CREATE TABLE public.conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title       text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW()
);

-- Serves the sidebar list: conversations of one profile, newest first.
CREATE INDEX conversations_profile_id_created_at_idx
  ON public.conversations (profile_id, created_at DESC);
