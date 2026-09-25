-- play.sql
-- supabase table for word map data, used by play.html/js
-- checksum (md5) 
create table if not exists public.map(whatwhere uuid primary key,words jsonb not null,dtC timestamptz default now() not null);
create or replace function public.map_ww(what varchar, wher varchar) returns uuid language sql immutable as $$ select (encode(substr(digest(what, 'sha1'), 1, 8), 'hex') || encode(substr(digest(wher, 'sha1'), 1, 8), 'hex'))::uuid; $$;
create or replace function public.map_get(what varchar, wher varchar) returns jsonb language sql immutable as $$ select words from public.map where whatwhere = public.map_ww(what, wher); $$;
create or replace function public.map_set(what varchar, wher varchar, words jsonb) returns uuid language sql volatile as $$ insert into public.map(whatwhere, words) values (public.map_ww(what, wher), words) on conflict (whatwhere) do update set words = excluded.words returning whatwhere; $$;
-- usage: (what is always uppercase, where is always lowercase, words is a jsonb array of objects with s:string and n:number)
select public.map_set('HELLO', 'l*n*p.n.nulls', '[{"s":"hello","n":4},{"s":"world","n":7}]'::jsonb);
select public.map_get('HELLO', 'l*n*p.n.nulls');
