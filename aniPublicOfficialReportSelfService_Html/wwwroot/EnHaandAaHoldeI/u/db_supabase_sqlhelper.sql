-- supabase - database (re)creation
set nocount on;use master;print '-- supabase - database (re)creation'
if db_id('supabase') is not null exec('exec supabase.u.bu;use supabase;alter database supabase set single_user with rollback immediate;use master;drop database supabase')
if db_id('supabase') is null exec('create database supabase;alter database supabase set auto_shrink on, recovery simple, allow_snapshot_isolation on')
go

use supabase;print '-- t - type -- u - utility -- u conf'
-- t - type; int, string and time
;if schema_id('t') is null exec('create schema t');if type_id('t.s')+type_id('t.d')+type_id('t.i') is null exec('create type t.s from nvarchar(4000);create type t.d from datetime2;create type t.i from bigint')
-- u - utility; execution and logging
if schema_id('u') is null exec('create schema u')
	if object_id('u.xl') is null exec('create table u.xl(pk bigint identity(1,1) primary key clustered,s t.s,cmd t.s,meth t.s,sC t.d default getdate(),eC t.d,eM t.s,ref uniqueidentifier default newid())')
	insert u.xl(s,eC)select '-- t - type; string and time',getdate()
	insert u.xl(s,eC)select '-- u - utility; execution and logging',getdate()
go
create or alter proc u.x @s t.s,@cmd t.s=@s,@meth t.i=0 as set nocount on;insert u.xl(s,cmd)values(@s,@cmd);
	declare @pk bigint=scope_identity(),@x t.s='u.x'+cast(@meth as sysname),@c t.s=replace(isnull(@cmd,@s),'"','''');
	print @c;exec @x @c,@pk;update u.xl set eC=getdate() where pk=@pk
go
truncate table  u.xl--declare @pkS bigint=(select max(pk) from u.xl)
exec ('create or alter proc u.x0 @c t.s,@pk t.i as set nocount on;exec(@c)')
exec u.x 'u.xn -- multiple','create or alter proc u.xn @s t.s,@c0 t.s=null,@c1 t.s=null,@c2 t.s=null,@c3 t.s=null,@c4 t.s=null,@c5 t.s=null,@c6 t.s=null,@c7 t.s=null,@c8 t.s=null,@c9 t.s=null as set nocount on;if @c0 is null return;exec u.x @s,@c0;exec u.xn @s,@c1,@c2,@c3,@c4,@c5,@c6,@c7,@c8,@c9'
exec u.xn 'u.x0..n -- ways u.x works; 0:simple, 1:ignore err','--create or alter proc u.x0 @c t.s,@pk t.i as set nocount on;exec(@c)'
	,'create or alter proc u.x1 @c t.s,@pk t.i as set nocount on;begin try exec (@c) end try begin catch update u.xl set eM=ERROR_MESSAGE() where pk=@pk;print ''    -- i:''+ERROR_MESSAGE() end catch'
exec u.xn 'u.xi/xmi/xni -- ignore err','create or alter proc u.xi @s t.s,@cmd t.s=null as set nocount on;exec u.x @s,@cmd,1'
	,'create or alter proc u.xni @s t.s,@c0 t.s=null,@c1 t.s=null,@c2 t.s=null,@c3 t.s=null,@c4 t.s=null,@c5 t.s=null,@c6 t.s=null,@c7 t.s=null,@c8 t.s=null,@c9 t.s=null as set nocount on;if @c0 is null return;exec u.xi @s,@c0;exec u.xni @s,@c1,@c2,@c3,@c4,@c5,@c6,@c7,@c8,@c9'
exec u.xni 'u.cs, u.bu - checksum, backup this db','create or alter function u.cs(@v nvarchar(4000))returns bigint with schemabinding as begin return hashbytes("sha2_256",isnull(@v,"[null]"))end'
	,'create or alter proc u.bu as set nocount on;backup database supabase to disk=''supabase.bak'' with name=''full'',compression'

-- u conf - configuration
exec u.xni 'u.conf, u.confset, u.confget - configuration store, get, set'
	,'create table u.conf(pk bigint identity(1,1) primary key clustered,fk bigint default 0,k t.s,v t.s,dt t.d default getdate(),dtO t.d,ref uniqueidentifier default newid(),csK as u.cs(k) persisted, constraint ucsK unique nonclustered(csK,dtO)with(ignore_dup_key=on),csV as u.cs(v) persisted)'
	,'create or alter proc u.confset @k t.s,@v t.s,@k1 t.s=null,@v1 t.s=null,@k2 t.s=null,@v2 t.s=null,@k3 t.s=null,@v3 t.s=null,@k4 t.s=null,@v4 t.s=null,@k5 t.s=null,@v5 t.s=null,@k6 t.s=null,@v6 t.s=null,@k7 t.s=null,@v7 t.s=null,@k8 t.s=null,@v8 t.s=null,@k9 t.s=null,@v9 t.s=null as set nocount on;print "-- u.confset "+@k+"="+@v;update u.conf set dtO=getdate() where k=@k and dtO is null;insert u.conf(k,v)values(@k,@v);if @k1 is not null exec u.confset @k1,@v1,@k2,@v2,@k3,@v3,@k4,@v4,@k5,@v5,@k6,@v6,@k7,@v7,@k8,@v8,@k9,@v9'
	,'create or alter function u.confget(@k nvarchar(4000))returns nvarchar(4000) with schemabinding as begin return (select top 1 v from u.conf where k=@k and dtO is null) end'

-- sb - supabase
insert u.xl(s,eC)select '-- sb - supabase',getdate()
exec u.xni 'schema sb','create schema sb'
exec u.confset 'sb ds','db.xyz.supabase.co','sb usr','postgres','sb pwd','password'

exec u.xni 'ls - linked server'
	,'if exists(select*from sys.servers where name="SB")exec sp_dropserver SB,droplogins'
	,'declare @c t.s="Driver={PostgreSQL ANSI(x64)};Server="+u.confget("sb ds")+";Port=5432;Database=postgres;SSLmode=require;";exec sp_addlinkedserver "SB","","MSDASQL",null,null,@c'
	,'declare @u t.s=u.confget("sb usr"),@p t.s=u.confget("sb pwd");exec sp_addlinkedsrvlogin "SB","false",null,@u,@p'
	,'exec sp_serveroption "SB","rpc out","true"'
	,'exec sp_serveroption "SB","remote proc transaction promotion","false"'
	--,'exec master.dbo.xp_regwrite "HKEY_LOCAL_MACHINE","SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL15.SQLEXPRESS\Providers\MSDASQL","AllowInProcess",REG_DWORD,1'

-- test
exec u.xi 'ls test','select * from openquery(SB,"select 1")'
--
select * from u.xl where eM is not null--where pk>=@pkS
--select * from u.conf
