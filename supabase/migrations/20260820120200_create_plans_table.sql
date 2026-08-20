CREATE TABLE public.plans (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL UNIQUE,
  daily_quota_limit  integer NOT NULL CHECK (daily_quota_limit >= 0),
  price              numeric(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  created_at         timestamptz NOT NULL DEFAULT NOW(),
  updated_at         timestamptz NOT NULL DEFAULT NOW()
);
