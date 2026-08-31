/*Gold
select * from gold.daily_active_readers order by activity_date desc limit 100;
  -- select distinct timezone, language from gold.daily_active_readers 
select * from gold.license_utilization order by book_id, code_id limit 100;
select * from gold.book_analytics limit 100;
select * from gold.hourly_activity limit 100;
select * from gold.reader_retention order by event_date desc limit 100;
select * from gold.top_pages limit 100;
select * from gold.session_stats order by started_at desc limit 100;
//*/

/*Silver
select * from silver.book_codes order by valid_to desc limit 100;
select * from silver.book_books order by valid_from desc limit 100;
select * from silver.book_usage order by event_timestamp desc limit 100;
select * from silver.book_log order by log_timestamp desc limit 100;
  -- select distinct user_agent from silver.book_log
//*/

/*Bronze
select * from bronze.book_codes order by valid_from desc limit 100;
select * from bronze.book_books order by valid_from desc limit 100;
select * from bronze.book_usage order by event_timestamp desc limit 100;
select * from bronze.book_log order by log_timestamp desc limit 100;
  -- select * from bronze.book_log where referrer not in ('') order by log_timestamp desc limit 100;
//*/
