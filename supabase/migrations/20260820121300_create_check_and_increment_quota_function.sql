-- Lazy row creation and increment in one statement. The WHERE clause on the
-- conflict branch is what enforces the limit: when it is false no row comes
-- back, and the caller knows the quota is spent. No read-then-write race.
CREATE OR REPLACE FUNCTION public.check_and_increment_quota(
  p_profile_id uuid,
  p_limit      integer
)
RETURNS TABLE (allowed boolean, remaining integer)
LANGUAGE plpgsql
AS $$
DECLARE
  v_used integer;
BEGIN
  INSERT INTO public.daily_quotas AS q (profile_id, queries_used, quota_date)
  VALUES (p_profile_id, 1, CURRENT_DATE)
  ON CONFLICT (profile_id, quota_date) DO UPDATE
    SET queries_used = q.queries_used + 1
    WHERE q.queries_used < p_limit
  RETURNING q.queries_used INTO v_used;

  IF v_used IS NULL THEN
    RETURN QUERY SELECT false, 0;
  ELSE
    RETURN QUERY SELECT true, GREATEST(p_limit - v_used, 0);
  END IF;
END;
$$;
