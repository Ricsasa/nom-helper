-- Aggregation belongs in the database. Pulling every log row into Node to sum
-- it is the same answer for far more bytes.
CREATE OR REPLACE FUNCTION public.total_consumption_summary(
  p_from timestamptz,
  p_to   timestamptz
)
RETURNS TABLE (total_queries bigint, total_tokens bigint, total_cost numeric)
LANGUAGE sql
AS $$
  SELECT COUNT(*)::bigint,
         COALESCE(SUM(tokens_used), 0)::bigint,
         COALESCE(SUM(estimated_cost), 0)::numeric
  FROM public.consumption_logs
  WHERE created_at >= p_from AND created_at < p_to;
$$;
