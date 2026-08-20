-- Append-only. Never updated after insertion.
CREATE TABLE public.consumption_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  message_id      uuid NOT NULL REFERENCES public.messages (id) ON DELETE CASCADE,
  tokens_used     integer NOT NULL CHECK (tokens_used >= 0),
  estimated_cost  numeric(12, 6) NOT NULL DEFAULT 0 CHECK (estimated_cost >= 0),
  created_at      timestamptz NOT NULL DEFAULT NOW(),
  updated_at      timestamptz NOT NULL DEFAULT NOW()
);

-- The operator consumption panel filters by profile and date range.
CREATE INDEX consumption_logs_profile_id_created_at_idx
  ON public.consumption_logs (profile_id, created_at DESC);
