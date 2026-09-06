CREATE SCHEMA IF NOT EXISTS util;
DROP FUNCTION IF EXISTS util.unDeploy(text, text);
CREATE OR REPLACE FUNCTION util.unDeploy(p_schema text, p_pattern text DEFAULT '%')
RETURNS TABLE(schema_name text, obj_name text, obj_type text) LANGUAGE plpgsql AS $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT n.nspname AS sch, c.relname AS obj,
           CASE c.relkind
             WHEN 'v' THEN 'VIEW'
             WHEN 'm' THEN 'MATERIALIZED VIEW'
             ELSE 'TABLE'
           END AS kind
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = p_schema
      AND c.relkind IN ('r','v','m','p')
      AND c.relname LIKE p_pattern
    ORDER BY n.nspname, c.relname
  LOOP
    EXECUTE format('DROP %s IF EXISTS %I.%I CASCADE', r.kind, r.sch, r.obj);
    schema_name := r.sch;
    obj_name := r.obj;
    obj_type := r.kind;
    RETURN NEXT;
  END LOOP;
END $$;