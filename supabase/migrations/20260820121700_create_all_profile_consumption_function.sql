-- Per-profile aggregation for the operator consumption panel. The grouping and
-- the ordering happen in the database: Node never sees the individual log rows.
-- Profiles with no logs are absent, not zero rows: the panel ranks consumption.
CREATE OR REPLACE FUNCTION public.all_profile_consumption()
RETURNS TABLE (
  profile_id    uuid,
  profile_name  text,
  total_queries bigint,
  total_tokens  bigint,
  total_cost    numeric
)
LANGUAGE sql
AS $$
  SELECT c.profile_id,
         p.name,
         COUNT(*)::bigint,
         COALESCE(SUM(c.tokens_used), 0)::bigint,
         COALESCE(SUM(c.estimated_cost), 0)::numeric
  FROM public.consumption_logs c
  JOIN public.profiles p ON p.id = c.profile_id
  GROUP BY c.profile_id, p.name
  ORDER BY 4 DESC;
$$;
