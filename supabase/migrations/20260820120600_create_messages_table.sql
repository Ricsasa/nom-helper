-- Every structured field of the response contract is its own column.
-- citations stays JSONB: its length varies and the RAG pipeline defines its shape.
CREATE TABLE public.messages (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   uuid NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  query             text NOT NULL,
  summary           text NOT NULL,
  explanation       text NOT NULL,
  citations         jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence_level  text NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),
  insufficient_info boolean NOT NULL DEFAULT false,
  norm_version      text NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT NOW(),
  updated_at        timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_conversation_id_created_at_idx
  ON public.messages (conversation_id, created_at ASC);
