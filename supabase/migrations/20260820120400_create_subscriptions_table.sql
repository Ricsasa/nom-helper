-- Structural placeholder. No billing logic is active.
CREATE TABLE public.subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  plan_id     uuid NOT NULL REFERENCES public.plans (id) ON DELETE RESTRICT,
  starts_at   date NOT NULL,
  ends_at     date,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX subscriptions_profile_id_idx ON public.subscriptions (profile_id);
