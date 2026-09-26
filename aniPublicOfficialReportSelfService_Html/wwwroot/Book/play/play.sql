-- play.sql
-- supabase cache for the word maps behind the word cloud / word map in play.html/js
-- key = checksum (sha1) of `what` (the cloud filter, uppercase – '' = unfiltered) and `wher` (the hierarchy id, lowercase)
-- words = a jsonb array [ {word:count}, … ] – one element per cell in the list, so ONE lookup draws the whole word map
create extension if not exists pgcrypto;
create table if not exists public.map(whatwhere uuid primary key,words jsonb not null,dtC timestamptz default now() not null);
create or replace function public.map_ww(what varchar, wher varchar) returns uuid language sql immutable as $$ select (encode(substr(digest(what, 'sha1'), 1, 8), 'hex') || encode(substr(digest(wher, 'sha1'), 1, 8), 'hex'))::uuid; $$;
create or replace function public.map_get(what varchar, wher varchar) returns jsonb language sql stable as $$ select words from public.map where whatwhere = public.map_ww(what, wher); $$;
create or replace function public.map_set(what varchar, wher varchar, words jsonb) returns uuid language sql volatile as $$ insert into public.map(whatwhere, words) values (public.map_ww(what, wher), words) on conflict (whatwhere) do update set words = excluded.words, dtC = now() returning whatwhere; $$;
-- usage: what = the word-cloud filter (uppercase, '' = unfiltered); wher = the hierarchy id (the ?p= id, lowercase); words = [ {word:count}, … ] one per cell
select public.map_set('E', 'l*n*p.n.nulls', '[{"advokaten":99,"nettopp":8,"føler":8,"overfor":8,"nærmeste":8,"forstanden":7,"stanser":7,"sammenbrudd":7,"erkjennelse":7,"europa":6,"likevel":6,"tapet":1,"kiel":1,"tiden":1,"ingenting":1,"mine":1,"oppleve":1,"døden":1,"kanskje":1,"hele":1,"alicante":1,"gjennom":1,"skulle":1}]'::jsonb);
-- read it back: element 0 is the first cell's {word:count} map
select public.map_get('E', 'l*n*p.n.nulls')->0 as cell0;