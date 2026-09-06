-- Revoke API access to Bronze & Silver
REVOKE ALL ON SCHEMA bronze FROM anon, authenticated, public;
REVOKE ALL ON SCHEMA silver FROM anon, authenticated, public;
REVOKE ALL ON ALL TABLES IN SCHEMA bronze FROM anon, authenticated, public;
REVOKE ALL ON ALL TABLES IN SCHEMA silver FROM anon, authenticated, public;

-- Grant ETL & Ingestion rights to service_role
GRANT ALL ON SCHEMA bronze TO service_role;
GRANT ALL ON SCHEMA silver TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA bronze TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA silver TO service_role;

-- Serving layer in public: read access for API clients (analytics page uses publishable key = anon)
GRANT SELECT ON public.gold_book_analytics TO anon, authenticated;
GRANT SELECT ON public.gold_hourly_activity TO anon, authenticated;
GRANT SELECT ON public.gold_daily_active_readers TO anon, authenticated;
GRANT SELECT ON public.gold_reader_retention TO anon, authenticated;
GRANT SELECT ON public.gold_top_pages TO anon, authenticated;
GRANT SELECT ON public.gold_license_utilization TO anon, authenticated;