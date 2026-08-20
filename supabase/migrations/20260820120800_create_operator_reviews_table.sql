CREATE TABLE public.operator_reviews (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id        uuid NOT NULL UNIQUE REFERENCES public.response_ratings (id) ON DELETE CASCADE,
  technical_cause  text NOT NULL CHECK (technical_cause IN (
                     'wrong_chunk_retrieved', 'correct_chunk_wrong_response',
                     'content_not_in_corpus', 'wrong_citation_attribution', 'no_issue')),
  destination      text NOT NULL CHECK (destination IN (
                     'add_to_eval_set', 'marked_reviewed', 'discarded')),
  reviewed_at      timestamptz NOT NULL DEFAULT NOW(),
  created_at       timestamptz NOT NULL DEFAULT NOW(),
  updated_at       timestamptz NOT NULL DEFAULT NOW()
);
