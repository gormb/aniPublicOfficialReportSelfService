/*
drop view if exists public.music_vw;
drop table if exists public.music;

create table if not exists public.music (id text primary key, replaced_by text, ch text, su text, page int, comments text, contents text, relevance text, book text default 'Liv krevde død', lg text default 'NO', ed text default '1', txt_id text, updated_at timestamptz default now());
create or replace view public.music_vw as select r.id as song_id, r.desc as song, btrim(split_part(r.desc, ';', 1)) as title, btrim(split_part(r.desc, ';', 2)) as artist, r.url as spotify, r.qr, t.txt, m.* from public.redir r left join public.music m on m.id = r.id left join public.redir t on t.id = coalesce(m.txt_id, r.id) where r."group" = 'Music';
-- */
