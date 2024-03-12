if db_id('wikigap_no') is null set noexec on
go
use wikigap_no 
if schema_id('w') is null exec('create schema w')
go -- drop proc u.x
create or alter proc w.t_c @recreate bit,@t sysname,@f varchar(max),@f1 varchar(max)=null,@f2 varchar(max)=null,@f3 varchar(max)=null,@f4 varchar(max)=null,@f5 varchar(max)=null,@f6 varchar(max)=null,@f7 varchar(max)=null,@f8 varchar(max)=null,@f9 varchar(max)=null as set nocount on
	if @recreate=1 exec u.x '','drop table if exists w.',@t,@conc=1
	set concat_null_yields_null on
	select @f1=','+@f1,@f2=','+@f2,@f3=','+@f3,@f4=','+@f4,@f5=','+@f5,@f6=','+@f6,@f7=','+@f7,@f8=','+@f8,@f9=','+@f9
	set @f=concat_ws('',@f,@f1,@f2,@f3,@f4,@f5,@f6,@f7,@f8,@f9)
	declare @c sysname='table w.'+@t+' fields '+@f
	exec u.x @c,'create table w.',@t,'(pk',@t,' bigint primary key identity(0,1),',@t,'hash bigint not null default 0,fkl bigint,',@f,')', @ignoreErr=1,@conc=1
go
create or alter proc w.c @recreate bit=0 as set nocount on print '-- Create tables log, src, title, revision, hlang, download'
	exec w.t_c @recreate,log,'dt datetime default getdate(),u sysname default System_User,slice int default 1, slices int default 1,fc int default -1,tc int default -1,rc int default -1'
	--exec w.t_c @recreate,src,'fileName nvarchar(4000),dbname sysname null, siteinfo XML,dt datetime, sz bigint'
	--	exec u.x '','create unique index ix_idup on w.src(srchash) with ignore_dup_key',@ignoreErr=1
	exec w.t_c @recreate,title,'fksrc bigint,rowno bigint,FilePositionStart bigint,FilePosition bigint,title sysname,ns int,id bigint'
	exec w.t_c @recreate,revision,'fktitle bigint,fksrc bigint,FilePosition bigint,id bigint,parentid bigint null,timestamp datetime,comment nvarchar(max) null,model sysname,format sysname,text nvarchar(max),sha1 sysname,range int'
		,'index ix_idup unique(revisionhash)with(ignore_dup_key=on)'
		,'index ix(fktitle,fksrc,FilePosition)'
		,'index ixrange(range,fktitle,fksrc)'
	--exec u.x 'w.w: ?','create or alter view w.w as select pkrevision=isnull(pkrevision,titlehash),pktitle,t.fksrc,src.dbname, t.ns, t.title, r.text, r.timestamp, r.comment from w.title t left join w.revision r on pktitle=r.fktitle and r.fksrc=t.fksrc left join w.src on pksrc=r.fksrc where isnull(r.range,1)=1'
	exec w.t_c @recreate,language,'l sysname,ld datetime default getdate(),lurl as ''https://dumps.wikimedia.org/''+l+''wiki/latest/'''
			/*html*/,'f as ''D:\data\wiki_no\html\wd_''+l+''.html'',fc varchar(max),ff varchar(max),fd datetime'
			/*zip*/ ,'z varchar(max),zd datetime,zdend datetime'
			/*xml*/ ,'x varchar(max),xd datetime,xdend datetime'
			,'i varchar(max),id datetime,idend datetime'
			,'index ix_idup unique(l)with(ignore_dup_key=on)'
		--exec u.x '','create unique index ix_idup on w.language(l) with ignore_dup_key',@ignoreErr=1
	--exec w.t_c @recreate,download,'fkhlang bigint,f varchar(8000),url varchar(8000),compressed varchar(8000),uncompressed varchar(8000),start datetime default getdate(),done datetime'
	--exec u.x '','create or alter view w.languagefile as select filel=l,fno=row_number()over(partition by languagehash order by f)
	--	,url=lurl+f.v,zf=z+f.v,xf=x+f.v,f=f.v '
	--	,'from w.language cross apply (select v=value from string_split(ff,'','')) as f',@conc=1
go
--create or alter procedure w.f_attr @f sysname='D:\data\wiki_no\xml\' as --returns @o table(n sysname,dt datetime,sz bigint,f varchar(8000))
--	exec (';with o as (select o=trim(o) from openquery(aigap,''exec xp_cmdshell ''''dir "' + @f + '" /t:w'''' with result sets ((o sysname null))'')) 
--	,d as (select d=replace(o,''Directory of '','''')+''\'' from o where charindex(''\'',o)>0)
--	,f as (select f=substring(o, 37,20), dt=try_cast(left(o, 20) as datetime), sz=try_cast(replace(substring(o, 18, 19),'','','''') as bigint) from o where len(o)>40)
--	select fn=d+f,f,dt,sz from f cross join d
--	')
go
create or alter procedure w.f_attr @f1 sysname='D:\data\wiki_no\xml\', @f2 sysname='F:\data\wiki_no\xml\', @show bit=0 as set nocount on; --returns @o table(n sysname,dt datetime,sz bigint,f varchar(8000))
	declare @r table(k int identity(0,1),o sysname null)
	declare @c sysname='dir "'+@f1+'" /t:w', @c2 sysname='dir "'+@f2+'" /t:w'
	insert @r(o)exec xp_cmdshell @c;insert @r(o)exec xp_cmdshell @c2
	declare @f table(k int identity(0,1),fn sysname,dt datetime,sz bigint,loc sysname)
	drop table if exists w.hfile
	;with d as (select k,dir=replace(o,'Directory of ','')+'\' from @r where charindex('\',o)>0)
		, f as (select k,fn=substring(o, 37,50), dtf=try_cast(left(o, 20) as datetime), sz=try_cast(replace(substring(o, 18, 19),',','') as bigint) from @r where len(o)>40)
	insert @f select fn,dtf,sz,loc=(select dir from d where k=(select max(k) from d where d.k<f.k))+fn
	from f
	if @show=1 select * from @f
go -- 
create or alter proc w.h_l @onlynew bit=1 as set nocount on
	print '-- list all relevant wiki files via http'
	exec u.x '-- update all wiki languages from homepage', 'cmd curl https://meta.wikimedia.org/wiki/Names_of_Wikimedia_languages -o d:\data\wiki_no\html\w_.html' --exec u.x 'cmd curl https://www.wikipedia.org/ -o d:\data\wiki_no\html\w.html';with w as (select c=BulkColumn FROM OPENROWSET(BULK 'd:\data\wiki_no\html\w.html',single_clob) as csv), lc as (select l=value, ll=charindex('.wikipedia.org/', value)from w cross apply string_split((select replace(c,'<a href="//','~') from w), '~'))
		,'with w as (select c=bulkcolumn from openrowset(bulk ''d:\data\wiki_no\html\w_.html'',single_clob) as csv)
			, lc as (select l=value, ll=charindex(''"'', value)from w cross apply string_split((select replace(c,''languages/'',''~'') from w), ''~''))
		insert w.language(l) select distinct l=left(l,ll-1) from lc where ll between 2 and 20
			and left(l,ll-1) in (''no'',''nn'',''en'')'
		,'with s as (select pksum=pklanguage, fnsum=string_agg(fn,'','')--, l, fd
			from w.language 
			cross apply (select fn=left(value,charindex(''"'', value)-1) from string_split(replace(language.fc, ''href="'', ''¨''), ''¨'') where charindex(''.7z'',value)>0 and charindex(''-rss'',value)=0 and value like ''%pages-meta-history%'' and charindex(''"'',value)>10) f
			group by pklanguage)/*select fnsum,l.* */
		update l set ff=s.fnsum from w.language l left join s on pksum=pklanguage where ff is null and fnsum is not null'
	print '---- get list for each of the languages' --update w.language set fd=null,fc=null,languagehash=0
	declare @pk int=-1, @url varchar(8000), @f sysname
	select top 1 @pk=pklanguage, @url=lurl, @f=f from w.language where pklanguage>@pk and (@onlynew=0 or fd is null) order by pklanguage
	while @@rowcount=1 begin
		exec u.x @f,'cmd curl -s ',@url,' -o ',@f, @conc=1
		exec u.x 'update w.language hash, fc and fd','declare @fc varchar(max)=(select c=bulkcolumn from openrowset(bulk ''',@f,''', single_clob) as c)
			;if len(@fc)>1000 update w.language set fc=@fc,languagehash=u.cs(@fc),fd=getdate() where languagehash!=u.cs(@fc) and pklanguage=',@pk,'
			else update w.language set fc=@fc,fd=''2001-01-01'' where languagehash!=u.cs(@fc) and pklanguage=',@pk,@conc=1
		select top 1 @pk=pklanguage, @url=lurl, @f=f from w.language where pklanguage>@pk and (@onlynew=0 or fd is null) order by pklanguage
	end
	print '---- create views for the relevant (meta history) files (disabled)'
go
create or alter proc w.h_dui_df @lang sysname,@ff varchar(8000),@url sysname,@z sysname as set nocount on
	declare @pro varchar(max),@fpro varchar(max),@fepi varchar(max),@c varchar(max)
	update w.language set z=@z,zd=getdate()where zdend is null and l=@lang
	if @@rowcount>0 begin -- found language not downloaded;without z completed
		select @pro='declare @f sysname',@fpro=char(10)+';set @f=''',@fepi=concat_ws('',''';',char(10)
			,'exec u.x @f,''cmd curl ',@url,''',','@f,'' -o ',@z,''',@f,@conc=1')
		set @c=concat_ws('',@pro, @fpro, replace(@ff,',',@fepi+@fpro),@fepi)
		exec u.x '---- download',@c
		update w.language set zdend=getdate()where l=@lang
	end
go
create or alter proc w.h_dui_uf @lang sysname,@ff varchar(8000),@z sysname,@x sysname,@b sysname as set nocount on
	declare @pro varchar(max),@fpro varchar(max),@fepi varchar(max),@c varchar(max)
	update w.language set x=@x,xd=getdate()where xdend is null and l=@lang
	if @@rowcount>0 begin -- found language not uncompressed; without x completed
		select @pro='declare @f sysname',@fpro=char(10)+';set @f=''',@fepi=concat_ws('',''';',char(10)
			,'exec u.x @f,''cmd d:\data\wiki_no\7za.exe e -y '','''+@z+''',@f,'' -o',@x,''',@conc=1
			;exec u.x @f,''cmd move '','''+@z+''',@f,'' ',@b,''',@conc=1')
		set @c=concat_ws('',@pro, @fpro, replace(@ff,',',@fepi+@fpro),@fepi)
		--print @c
		exec u.x '---- uncompress',@c
		update w.language set xdend=getdate()where l=@lang
	end
go
create or alter proc w.h_dui_if @lang sysname,@ff varchar(8000),@x sysname as set nocount on
	print concat_ws(',','----',@lang,@ff,@x)
	--set nocount on;update w.language set xdend=null where l=@l;exec w.h_du @z, @x, @b

		print '-- Import wiki into w.t(itle) and w.r(evision), from w.language, w.l(og) operations '
	--print '---- Refill w.l - log '+cast(@sI as sysname)+' of '+cast(@sC as sysname)  -- truncate table w.l
	--declare @fkl bigint=(select max(pklanguage) from w.language where slice=@sI and slices=@sC)
	--if @trunc=1 update w.l set dt=getdate() where slice=@sI and slices=@sC
	--if @@rowcount=0 or @trunc=0
		--update 
		--	insert w.l(fkl, slice, slices) select @fkl,@sI,@sC
		--select @fkl=max(pkl) from w.l where slice=@sI and slices=@sC -- select * from w.l
	print '---- Refill w.f - files'
		--insert w.f(fhash,fkl,fileName) select distinct fk=fileNameHash,@fkl,fileName FROM u.i_xml(@src, 'page', 'sitename|dbname|base', 1, 10240, 65536, 65536)
		--update w.l set fc=@@rowcount where pkl=@fkl
		--begin try while @@rowcount>0 update w.f set siteinfo=isnull((select top 1 s from u.i_part(fileName, 'siteinfo')),'') where pkf in (select top 1 pkf from w.f where siteinfo is null)
		--	end try begin catch end catch
		--update w.f set dbname=siteinfo.value('(dbname)[1]', 'nvarchar(max)') where dbname is null and siteinfo is not null--	select * from w.f
		--exec w.f_attr @src
	print '---- Recreate w.t - titles'
	--	if @trunc=1 delete from w.t where fkl in (select pkl from w.l where slice=@sI and slices=@sC)
	--insert w.t select pk=u.cs(c00), fkl=@fkl, fkf=fileNameHash, rowno=PK, FilePositionStart=cast(null as bigint), FilePosition, title=c00, ns=c01, id=c02 
	--	from u.i_xml(@src, 'page', 'title|ns|id', @sI, @sC, 65536, 1048576)
	--select pk=Common.cs(c00), fkl=@fkl, fkf=fileNameHash, rowno=PK, FilePositionStart=cast(null as bigint), FilePosition, title=c00, ns=c01, id=c02 
	--		from Common.GetXmlTags_Slice(@src, 'page', 'title|ns|id', @sI, @sC, 65536, 1048576)
		--update w.l set tc=@@rowcount where pkl=@fkl
		--update w.t set FilePositionStart=isnull(prev.FilePosition,0)
		--	from w.t left join w.t prev ON prev.pkt=t.pkt-1 AND t.fkf=prev.fkf


				--	--select * from w.t order by 1,2
	--print '---- Recreate w.r - revisions'
	--	if @trunc=1 truncate table w.r
	--	insert w.r select fk=PK, fkt=cast(null as bigint), fkf=fileNameHash, FilePosition, id=c00, parentid=c01, timestamp=try_cast(c02 as datetime), comment=c03, model=c04, format=c05, text=c06, sha1=c07, 0
	--		from Common.GetXmlTags_Slice(@src, 'revision', 'id|parentid|timestamp|comment|model|format|text|sha1', @sI, @sC, 65536, 1048576)
	--	update w.r set fkt=t.pk
	--		from w.r join w.t on r.fkf=t.fkf and r.FilePosition
	--		between t.FilePositionStart and t.FilePosition
	--		where fkt is null
	--	;with w_rn AS (select range, row_number() over (partition by fkt, fkf order by timestamp DESC) AS new_range from w_r)
	--		update w_rn set range = new_range;
	--	--select * from w.r order by 1,2

go
create or alter proc w.h_dui @z sysname='D:\data\wiki_no\compressed\',@x sysname='D:\data\wiki_no\xml\',@b sysname='D:\data\wiki_no\compressed\processed\'
		as set nocount on
	print '-- download and uncompress all wiki files'
	declare @lang sysname, @url varchar(8000), @ff varchar(max)
	declare c cursor for select l, lurl, ff from w.language order by 1 --desc
	open c;fetch next from c into @lang,@url,@ff
	while @@fetch_status=0 begin
		print '---- '+@lang
		exec w.h_dui_df @lang,@ff,@url,@z
		exec w.h_dui_uf @lang,@ff,@z,@x,@b
		exec w.h_dui_if @lang,@ff,@x
		fetch next from c into @lang,@url,@ff
	end;
	close c;deallocate c;
go
create or alter proc w.i @src sysname='D:\data\wiki_no\xml\*.xml', @sI int=1, @sC int=1024, @trunc bit=1 as set nocount on
go
--exec w.c --1 -- create tables (remove 1 after debug)
--exec w.h_l -- list all relevant wiki files via http 
--exec w.h_dui -- 'd:\data\wiki_no\compressed\' -- download and unzip all wiki files
--exec w.i --'D:\data\wiki_no\xml\*.xml'--,1,1024 -- import first part
/* go
--declare @i int=1
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,10240
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,10240
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,256000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,256000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,128000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,64000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,32000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,16000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',2,8000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',3,8000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',4,8000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',5,8000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',6,8000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',7,8000
--exec Common.Import 'D:\data\wiki_no\xml\*.xml',8,8000

https://dumps.wikimedia.org/mswiki/20240201/mswiki-20240201-pages-meta-history.xml.bz2
https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-meta-history.xml.bz2
https://dumps.wikimedia.org/enwiki/latest/
*/
--select * from w.w
--select * from w.t
--select * from w.f
--select * from w.l
go
set noexec off