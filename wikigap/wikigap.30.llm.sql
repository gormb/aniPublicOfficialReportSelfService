use wikigap; print '-- needs u.*; ' 
if schema_id('llm') is null exec('create schema llm')
go 
if object_id('llm.log') is null 
	create table llm.logxc(pk bigint identity(0,1) primary key clustered
	,x varchar(8000) null,o varchar(8000) null,dt datetime default getdate())

