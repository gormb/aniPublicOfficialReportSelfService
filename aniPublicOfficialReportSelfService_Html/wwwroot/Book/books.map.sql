create extension if not exists pgcrypto;
-- drop view map_show
-- drop table public.map
create table if not exists public.map(whatwhere uuid primary key,words jsonb not null,crc uuid not null,dtC timestamptz default now() not null);
create table if not exists public.map_txt(id bigint primary key,t varchar not null);
create or replace function public.map_ww(what varchar,wher varchar) returns uuid language sql immutable strict parallel safe as $$ select (encode(substr(digest(upper(what),'sha1'),1,8),'hex')||encode(substr(digest(lower(wher),'sha1'),1,8),'hex'))::uuid; $$;
create or replace function public.map_get(what varchar,wher varchar) returns jsonb language sql stable as $$ select words from public.map where whatwhere=public.map_ww(what,wher); $$;
create or replace function public.map_hash64(t varchar) returns bigint language sql immutable strict parallel safe as $$ select ('x'||encode(substr(digest(t,'sha1'),1,8),'hex'))::bit(64)::bigint; $$;
create or replace function public.map_crc(par varchar,sib varchar) returns uuid language sql immutable parallel safe as $$ select (encode(substr(digest(coalesce(par,''),'sha1'),1,8),'hex')||encode(substr(digest(coalesce(sib,''),'sha1'),1,8),'hex'))::uuid; $$;
create or replace function public.map_crc_par(c uuid) returns bigint language sql immutable strict parallel safe as $$ select ('x'||substr(encode(uuid_send(c),'hex'),1,16))::bit(64)::bigint; $$;
create or replace function public.map_crc_sib(c uuid) returns bigint language sql immutable strict parallel safe as $$ select ('x'||substr(encode(uuid_send(c),'hex'),17,16))::bit(64)::bigint; $$;
create or replace function public.map_txt_id(t varchar) returns bigint language sql immutable strict parallel safe as $$ select public.map_hash64(t); $$;
create or replace function public.map_txt_add(t varchar) returns void language sql volatile as $$ insert into public.map_txt(id,t) values(public.map_txt_id(t),t) on conflict(id) do nothing; $$;
drop function if exists public.map_set(varchar,varchar,jsonb);
create or replace function public.map_set(what varchar,wher varchar,words jsonb,par varchar default null,sib varchar default null) returns uuid language plpgsql volatile as $$ declare id uuid; begin perform public.map_txt_add(what); perform public.map_txt_add(wher); insert into public.map(whatwhere,words,crc) values(public.map_ww(what,wher),words,public.map_crc(par,sib)) on conflict(whatwhere) do update set words=excluded.words,crc=excluded.crc,dtC=now() returning whatwhere into id; return id; end; $$;
-- change detection: true when the row is missing or its stored crc differs from map_crc(par,sib) (rows predating crc read as changed).
create or replace function public.map_changed(what varchar,wher varchar,par varchar,sib varchar) returns boolean language sql stable as $$ select (select crc from public.map where whatwhere=public.map_ww(what,wher)) is distinct from public.map_crc(par,sib); $$;
-- drop cached rows: the single row for (what,wher), or every row for what when wher is null. returns rows removed.
create or replace function public.map_invalidate(what varchar,wher varchar default null) returns integer language plpgsql volatile as $$ declare n integer; begin if wher is null then delete from public.map m where encode(substr(uuid_send(m.whatwhere),1,8),'hex')=substr(encode(digest(upper(what),'sha1'),'hex'),1,16); else delete from public.map m where m.whatwhere=public.map_ww(what,wher); end if; get diagnostics n=row_count; return n; end; $$;
drop view if exists public.map_show;
create view public.map_show as select m.whatwhere,tw.t as what,tr.t as wher,m.words,m.crc,m.dtC from public.map m left join public.map_txt tw on encode(substr(uuid_send(m.whatwhere),1,8),'hex')=substr(encode(digest(upper(tw.t),'sha1'),'hex'),1,16) left join public.map_txt tr on encode(substr(uuid_send(m.whatwhere),9,8),'hex')=substr(encode(digest(lower(tr.t),'sha1'),'hex'),1,16);
-- select public.map_set('E','l*n*p.n.nulls','[{"advokaten":99,"nettopp":8,"føler":8,"overfor":8,"nærmeste":8,"forstanden":7,"stanser":7,"sammenbrudd":7,"erkjennelse":7,"europa":6,"likevel":6,"tapet":1,"kiel":1,"tiden":1,"ingenting":1,"mine":1,"oppleve":1,"døden":1,"kanskje":1,"hele":1,"alicante":1,"gjennom":1,"skulle":1}]'::jsonb,'<parent text>','<sib1 sib2 …>');
-- select public.map_get('E','l*n*p.n.nulls')->0 as cell0;
-- select public.map_ww('HELLO','l*n*p.n.nulls');
-- select * from public.map_show order by dtC desc limit 1000;
-- change detection / invalidation (par = the node's own text, sib = all its children's texts summed):
-- select public.map_crc('parent text','sib1 sib2 …');                     -- uuid: 1-8 parent, 9-16 siblings
-- select public.map_changed('E','l*n*p.n.nulls','parent','sib1 sib2');   -- true = cache row is missing or stale
-- select public.map_crc_par(crc),public.map_crc_sib(crc) from public.map_show;   -- pull the two 64-bit halves back out
-- select public.map_invalidate('E','l*n*p.n.nulls');                    -- drop one cached cell
-- select public.map_invalidate('E');                                    -- drop every cell for filter 'E' (after a book changed)
-- how big is the cache: 
-- select count(*) rows, pg_size_pretty(sum(pg_column_size(words))) size from public.map;
-- rebuild capped (drops the oversized rows written before the cap): 
-- truncate table public.map;


select length(words::text), * from public.map_show order by dtC desc limit 1000;
--delete from public.map