SELECT * FROM util.unDeploy('bronze', 'book\_%')
union all SELECT * FROM util.unDeploy('silver', 'book\_%')
union all SELECT * FROM util.unDeploy('public', 'gold\_book\_%');
