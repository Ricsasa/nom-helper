-- Rows are created lazily by an atomic upsert on the first query of the day.
-- The unique constraint is what makes ON CONFLICT possible.
CREATE TABLE public.daily_quotas (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  queries_used  integer NOT NULL DEFAULT 1 CHECK (queries_used >= 0),
  quota_date    date NOT NULL DEFAULT CURRENT_DATE,
  reset_at      timestamptz NOT NULL DEFAULT NOW(),
  created_at    timestamptz NOT NULL DEFAULT NOW(),
  updated_at    timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_quotas_profile_id_quota_date_key UNIQUE (profile_id, quota_date)
);
