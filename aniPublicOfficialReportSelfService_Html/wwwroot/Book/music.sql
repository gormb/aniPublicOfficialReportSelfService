/* ============================================================================================================
   public.music  +  public.music_vw          – the songs, and what they are attached to in the books
   Supabase / PostgreSQL (run in the SQL editor; safe to run again)

   Where the pieces live
     public.redir        the register: one row per addressable thing. For music, group = 'Music'
                         columns: id, url, desc, "group", sort, qr, present, txt
                         id = the song's key, 'm' + the title's initials – 'mcn' = Comfortably Numb,
                         'mcb' = Carmina Burana, 'mltf' = Learning to Fly. It is also the deep link:
                         https://aigap.no/mcn  – exactly the url the sub chapter's 🎵 line holds in the .md.
                         desc  = 'Title; Artist'      url = the Spotify track      qr = the QR image name
                         txt   = the text that belongs to the song (the lyric, or a text written for the chapter)
     public.music        this table: what redir cannot know – which book, which chapter, which pages, what it feels like
     public.music_vw     music joined to redir, so a reader gets the song, its text, its url and its place in one row

   What each song row is for
     The chapter (ch) and sub chapter (su) are the anchor of the association between music and book; page_from/page_to
     are the pages that chapter covers. Both come from the sidecar .md that the book-update scripts already read:
       '#### p. N'  page marker      '## '  main chapter      '### '  sub chapter      '🎵 [name](https://aigap.no/mcn)'
     The scripts that update books keep book/lg/ed/ch/su/page_from/page_to in step with that file – nothing here is
     read from the pdf. The feelings (feel/mood) and the text (redir.txt) are what the music lends the text.
   ============================================================================================================ */

-- 1) the songs ------------------------------------------------------------------------------------------------
create table if not exists public.music (
    id          text primary key                       -- the song: the id in public.redir, e.g. 'mcn'
  , txt_id      text                                   -- the redir row holding *the text*; null = the song's own row
  , txt_kind    text                                   -- 'LYRIC' (the song's own text) | 'NEW' (written for the chapter)
  , title       text                                   -- song title – else read from redir.desc, before the ';'
  , artist      text                                   -- performer  – else read from redir.desc, after the ';'
  , album       text
  , year        int
  , dur_s       int                                    -- playing time in seconds
  , bpm         int                                    -- tempo
  , song_key    text                                   -- key/mode, e.g. 'B minor'
  , feel        text[]                                 -- the feelings the music lends the text: {grief,release}
  , mood        text                                   -- one line the AI can read: why this song stands here
  , book        text                                   -- the book on the shelf, i.e. the folder under b/: 'LifeDemandedDeath'
  , lg          text                                   -- the copy's language  'NO' | 'EN'
  , ed          text                                   -- the copy's edition   'PREM' | 'FREE'
  , ch          text                                   -- main chapter ('## ' in the .md)
  , su          text                                   -- sub chapter ('### ') – null = anchored to the whole main chapter
  , page_from   int                                    -- the pages that chapter covers – the .md's '#### p. N' markers,
  , page_to     int                                    -- first and last; the book-update scripts keep them in step
  , sort        numeric                                -- order within the book (else redir.sort)
  , note        text
  , origin      text default 'redir'                   -- where the row's facts came from
  , created_at  timestamptz not null default now()
  , updated_at  timestamptz not null default now()
  , constraint music_pages_ordered check (page_from is null or page_to is null or page_from <= page_to)
  , constraint music_lg   check (lg is null or lg in ('NO','EN'))
  , constraint music_ed   check (ed is null or ed in ('PREM','FREE'))
  , constraint music_kind check (txt_kind is null or txt_kind in ('LYRIC','NEW','OLD'))
);

create index if not exists music_book_ix on public.music (book, lg, ed, page_from);
create index if not exists music_ch_ix   on public.music (book, ch, su);
create index if not exists music_feel_ix on public.music using gin (feel);
create index if not exists music_txt_ix  on public.music (txt_id);

comment on table  public.music           is 'One row per song (id = the song id in public.redir, e.g. mcn). Holds what redir cannot know: the book/chapter it belongs to, the pages that chapter covers, and the feelings it lends the text.';
comment on column public.music.id        is 'The song: public.redir.id, e.g. mcn – also the deep link https://aigap.no/mcn that the .md''s 🎵 line holds.';
comment on column public.music.txt_id    is 'The redir row that carries the text (lyrics). null = the song''s own redir row.';
comment on column public.music.txt_kind  is 'LYRIC = the song''s own text, NEW/OLD = a text written for the chapter from it.';
comment on column public.music.feel      is 'The feelings the music lends the text – the point of the association.';
comment on column public.music.page_from is 'First page of the chapter the song is anchored to – from the sidecar''s ''#### p. N''.';
comment on column public.music.page_to   is 'Last page of that chapter – written by the scripts that update books, never by hand.';

-- 2) the song points at the register, and the text does too ---------------------------------------------------
--    The song ids must be unique before anything can point at them (they are – 117 ids, no duplicates).
--    Guarded: it only runs if public.redir is a real table (the view in step 4 joins it either way).
do $$
begin
    if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
                where n.nspname = 'public' and c.relname = 'redir' and c.relkind = 'r') then
        execute 'create unique index if not exists redir_id_uk on public.redir (id)';
        execute 'alter table public.music drop constraint if exists music_redir_fk';
        execute 'alter table public.music add  constraint music_redir_fk
                    foreign key (id) references public.redir (id) on update cascade on delete cascade';
        execute 'alter table public.music drop constraint if exists music_txt_redir_fk';
        execute 'alter table public.music add  constraint music_txt_redir_fk
                    foreign key (txt_id) references public.redir (id) on update cascade on delete set null';
    else
        raise notice 'public.redir is not a table – skipping the unique index and the two foreign keys';
    end if;
end $$;

-- 3) updated_at keeps itself honest ---------------------------------------------------------------------------
create or replace function public.music_touch() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists music_touch on public.music;
create trigger music_touch before insert or update on public.music
    for each row execute function public.music_touch();

-- 4) the view: the song, its text and the register's facts in one row ------------------------------------------
create or replace view public.music_vw as
select
    m.id                                                        as song_id
  , 'https://aigap.no/' || m.id                                 as link          -- the .md's 🎵 url
  , coalesce(nullif(btrim(m.title),''),  nullif(btrim(split_part(coalesce(r.desc,''),';',1)),'')) as title
  , coalesce(nullif(btrim(m.artist),''), nullif(btrim(split_part(coalesce(r.desc,''),';',2)),'')) as artist
  , m.album, m.year, m.dur_s, m.bpm, m.song_key
  , m.feel, m.mood, m.note
  , m.book, m.lg, m.ed, m.ch, m.su
  , m.page_from, m.page_to
  , case when m.page_from is not null and m.page_to is not null
         then m.page_to - m.page_from + 1 end                   as pages
  , r.url                                                       as spotify       -- what plays
  , r.qr, r.present, r."group"                                  as redir_group
  , r.desc                                                      as redir_desc
  , coalesce(m.sort, r.sort)                                    as sort
  , m.txt_kind
  , coalesce(m.txt_id, m.id)                                    as txt_id        -- the redir row the text comes from
  , t.desc                                                      as txt_desc
  , t.txt                                                       as txt           -- the text itself
  , length(coalesce(t.txt,''))                                  as txt_len
  , (t.txt is not null and btrim(t.txt) <> '')                  as has_txt
  , m.origin, m.created_at, m.updated_at
from public.music m
left join public.redir r on r.id = m.id
left join public.redir t on t.id = coalesce(nullif(m.txt_id,''), m.id);

comment on view public.music_vw is 'music joined to redir: song + text (lyrics/new text) + Spotify url + QR + where in the book.';

-- 5) who may read it (the page uses the publishable key; the book scripts use the service key) -----------------
alter table public.music enable row level security;

drop policy if exists music_read on public.music;
create policy music_read on public.music for select to anon, authenticated using (true);

drop policy if exists music_write on public.music;   -- drop this policy if the table must only change via the service key
create policy music_write on public.music for all to authenticated using (true) with check (true);

grant select on public.music, public.music_vw to anon, authenticated;
grant insert, update, delete on public.music to authenticated;

-- 6) seed: one row per song already in the register (85 music rows today, of which 3 are lists) ----------------
insert into public.music (id, title, artist, sort, origin)
select r.id
     , nullif(btrim(split_part(coalesce(r.desc,''),';',1)),'')
     , nullif(btrim(split_part(coalesce(r.desc,''),';',2)),'')
     , r.sort, 'redir'
from public.redir r
where r."group" = 'Music'
  and r.id not in ('mlist','mbooksongs','mx')        -- the playlist, the manual list and the meta page are not songs
on conflict (id) do nothing;

-- 7) the book-update script fills the rest ---------------------------------------------------------------------
--   For every b/{book}/b_{lg}_{ed}.md it walks:
--     '# '    the copy's title            -> -(not stored here)
--     '## '   main chapter                -> ch          (the song belongs to this chapter when .md has no ###)
--     '### '  sub chapter                 -> su
--     '#### p. N' page marker             -> page_from = first page of the heading, page_to = last page it covers
--                                             (page_to of a heading = page before the next heading's first page)
--     '🎵 [name](https://aigap.no/mcn)'   -> music.id = the url's last segment  (and music.txt_id := id)
--   The page markers are the sidecar's, never the pdf's own text.

-- 8) handy lookups ---------------------------------------------------------------------------------------------
-- a book's songs in reading order, with their feelings and text size:
--   select song_id,title,artist,ch,su,page_from,page_to,feel,mood,txt_len,spotify
--   from public.music_vw where book = 'LifeDemandedDeath' order by page_from, sort;
--
-- the text of one song (what was added for 'Comfortably Numb; Pink Floyd'):
--   select song_id,title,artist,txt from public.music_vw where song_id = 'mcn';
--
-- every song anchored to the chapter a page falls in:
--   select * from public.music_vw where book='LifeDemandedDeath' and page_from <= 41 and coalesce(page_to,page_from) >= 41;
--
-- the songs not anchored to a book yet (what the scripts still have to place):
--   select song_id,title,artist from public.music_vw where book is null order by sort;
