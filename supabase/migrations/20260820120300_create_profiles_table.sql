-- The only table that knows auth_user_id. Every other table uses profile_id.
CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  uuid NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  name          text NOT NULL,
  role          text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'operator')),
  language      text NOT NULL DEFAULT 'es-MX' CHECK (language IN ('es-MX', 'en-US')),
  created_at    timestamptz NOT NULL DEFAULT NOW(),
  updated_at    timestamptz NOT NULL DEFAULT NOW()
);
