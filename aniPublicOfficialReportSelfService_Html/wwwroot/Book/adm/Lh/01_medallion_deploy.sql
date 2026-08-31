CREATE SCHEMA IF NOT EXISTS bronze;
CREATE SCHEMA IF NOT EXISTS silver;
CREATE SCHEMA IF NOT EXISTS gold;

-- BRONZE LAYER
CREATE OR REPLACE VIEW bronze.book_codes AS
SELECT
  code AS code_id,
  NULLIF(TRIM(book), '') AS book_id,
  dtfrom AS valid_from,
  dtto AS valid_to,
  use_limit,
  mails AS authorized_emails,
  created_at AS source_created_at,
  NOW() AS bronze_loaded_at
FROM public.codes;

CREATE OR REPLACE VIEW bronze.book_books AS
SELECT
  book AS book_id,
  deployed,
  prod,
  dtautosyncfrom AS valid_from,
  dtautosyncto AS valid_to,
  "premiumCheckInterval" AS premium_interval_seconds,
  NOW() AS bronze_loaded_at
FROM public.books;

DROP VIEW IF EXISTS bronze.book_usage CASCADE;
CREATE OR REPLACE VIEW bronze.book_usage AS
SELECT
  u.id AS usage_id,
  u.fingerprint,
  u.session_id,
  u.code_id,
  NULLIF(TRIM(u.book), '') AS book_id,
  u.page AS page_number,
  u.event AS event_name,
  u.created_at AS event_timestamp,
  CAST(u.created_at AS date) AS event_date,
  g.timezone,
  g.language,
  NOW() AS bronze_loaded_at
FROM public.usage u
LEFT JOIN (
  SELECT d->>'sid' AS session_id, MAX(d->>'z') AS timezone, MAX(d->>'l') AS language
  FROM public.log_backup
  GROUP BY d->>'sid'
) g ON g.session_id = u.session_id::text;

DROP VIEW IF EXISTS bronze.book_log CASCADE;
CREATE OR REPLACE VIEW bronze.book_log AS
SELECT
  id AS log_id,
  k AS log_key,
  u AS user_identifier,
  d AS payload,
  d->>'sid' AS session_id,
  d->>'ua' AS user_agent,
  d->>'p' AS platform,
  d->>'l' AS language,
  d->>'z' AS timezone,
  d->>'r' AS referrer,
  d->>'s' AS screen,
  (d->>'m')::numeric AS device_memory,
  (d->>'c')::integer AS hardware_concurrency,
  (d->>'x')::numeric AS device_pixel_ratio,
  ts AS log_timestamp,
  CAST(ts AS date) AS log_date,
  NOW() AS bronze_loaded_at
FROM public.log_backup;

-- SILVER LAYER
CREATE OR REPLACE VIEW silver.book_codes AS
SELECT
  code_id,
  book_id,
  valid_from,
  valid_to,
  use_limit,
  authorized_emails,
  (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_to IS NULL OR valid_to >= NOW()) AS is_active,
  source_created_at,
  bronze_loaded_at
FROM bronze.book_codes;

CREATE OR REPLACE VIEW silver.book_books AS
SELECT
  book_id,
  deployed,
  prod,
  valid_from,
  valid_to,
  premium_interval_seconds,
  (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_to IS NULL OR valid_to >= NOW()) AS is_active,
  bronze_loaded_at
FROM bronze.book_books;

DROP VIEW IF EXISTS silver.book_usage CASCADE;
CREATE OR REPLACE VIEW silver.book_usage AS
SELECT
  usage_id,
  fingerprint,
  session_id,
  code_id,
  book_id,
  page_number,
  event_name,
  event_timestamp,
  event_date,
  timezone,
  language,
  bronze_loaded_at
FROM bronze.book_usage
WHERE usage_id IS NOT NULL;

DROP VIEW IF EXISTS silver.book_log CASCADE;
CREATE OR REPLACE VIEW silver.book_log AS
SELECT
  log_id,
  log_key,
  user_identifier,
  session_id,
  user_agent,
  platform,
  language,
  timezone,
  referrer,
  screen,
  device_memory,
  hardware_concurrency,
  device_pixel_ratio,
  log_timestamp,
  log_date,
  bronze_loaded_at
FROM bronze.book_log
WHERE log_id IS NOT NULL;

-- GOLD LAYER
DROP VIEW IF EXISTS gold.daily_active_readers CASCADE;
CREATE OR REPLACE VIEW gold.daily_active_readers AS
SELECT
  event_date AS activity_date,
  timezone,
  language,
  COUNT(DISTINCT fingerprint) AS active_readers,
  COUNT(DISTINCT session_id) AS active_sessions,
  COUNT(*) AS total_events
FROM silver.book_usage
GROUP BY event_date, timezone, language
ORDER BY event_date DESC;

DROP VIEW IF EXISTS gold.license_utilization CASCADE;
CREATE OR REPLACE VIEW gold.license_utilization AS
SELECT
  c.code_id,
  c.book_id,
  c.use_limit,
  COUNT(DISTINCT u.fingerprint) AS unique_users,
  COUNT(u.usage_id) AS total_events,
  GREATEST(c.use_limit - COUNT(DISTINCT u.fingerprint), 0) AS remaining_capacity
FROM silver.book_codes c
LEFT JOIN silver.book_usage u ON u.code_id = c.code_id
GROUP BY c.code_id, c.book_id, c.use_limit
ORDER BY c.book_id, c.code_id;

DROP VIEW IF EXISTS gold.book_analytics CASCADE;
CREATE OR REPLACE VIEW gold.book_analytics AS
SELECT
  book_id,
  COUNT(DISTINCT fingerprint) AS readers,
  COUNT(DISTINCT session_id) AS sessions,
  COUNT(*) FILTER (WHERE event_name = 'page') AS page_views,
  ROUND(COUNT(*) FILTER (WHERE event_name = 'page')::numeric / NULLIF(COUNT(DISTINCT fingerprint), 0), 1) AS pages_per_reader
FROM silver.book_usage
GROUP BY book_id
ORDER BY readers DESC;

DROP VIEW IF EXISTS gold.hourly_activity CASCADE;
CREATE OR REPLACE VIEW gold.hourly_activity AS
SELECT
  EXTRACT(hour FROM event_timestamp)::int AS hour_of_day,
  COUNT(DISTINCT fingerprint) AS readers,
  COUNT(*) AS events
FROM silver.book_usage
GROUP BY 1
ORDER BY 1;

DROP VIEW IF EXISTS gold.reader_retention CASCADE;
CREATE OR REPLACE VIEW gold.reader_retention AS
WITH daily AS (
  SELECT event_date, fingerprint
  FROM silver.book_usage
  GROUP BY event_date, fingerprint
)
SELECT
  d.event_date,
  COUNT(DISTINCT d.fingerprint) AS active_readers,
  COUNT(DISTINCT d.fingerprint) FILTER (
    WHERE EXISTS (SELECT 1 FROM daily p WHERE p.fingerprint = d.fingerprint AND p.event_date < d.event_date)
  ) AS returning_readers,
  ROUND(
    100.0 * COUNT(DISTINCT d.fingerprint) FILTER (
      WHERE EXISTS (SELECT 1 FROM daily p WHERE p.fingerprint = d.fingerprint AND p.event_date < d.event_date)
    ) / NULLIF(COUNT(DISTINCT d.fingerprint), 0), 1
  ) AS returning_pct
FROM daily d
GROUP BY d.event_date
ORDER BY d.event_date DESC;

DROP VIEW IF EXISTS gold.top_pages CASCADE;
CREATE OR REPLACE VIEW gold.top_pages AS
SELECT
  book_id,
  page_number,
  COUNT(DISTINCT fingerprint) AS readers,
  COUNT(*) AS views
FROM silver.book_usage
WHERE event_name = 'page' AND page_number >= 0
GROUP BY book_id, page_number
ORDER BY views DESC
LIMIT 100;

DROP VIEW IF EXISTS gold.session_stats CASCADE;
CREATE OR REPLACE VIEW gold.session_stats AS
SELECT
  session_id,
  book_id,
  COUNT(*) AS page_views,
  COUNT(DISTINCT page_number) AS unique_pages,
  MIN(event_timestamp) AS started_at,
  MAX(event_timestamp) AS last_event_at,
  ROUND(EXTRACT(EPOCH FROM (MAX(event_timestamp) - MIN(event_timestamp))) / 60, 1) AS duration_minutes
FROM silver.book_usage
WHERE event_name = 'page' AND page_number >= 0
GROUP BY session_id, book_id;

-- SERVING LAYER
CREATE OR REPLACE VIEW public.gold_book_analytics AS SELECT * FROM gold.book_analytics;
CREATE OR REPLACE VIEW public.gold_hourly_activity AS SELECT * FROM gold.hourly_activity;
CREATE OR REPLACE VIEW public.gold_daily_active_readers AS SELECT * FROM gold.daily_active_readers;
CREATE OR REPLACE VIEW public.gold_reader_retention AS SELECT * FROM gold.reader_retention;
CREATE OR REPLACE VIEW public.gold_top_pages AS SELECT * FROM gold.top_pages;
CREATE OR REPLACE VIEW public.gold_license_utilization AS SELECT * FROM gold.license_utilization;