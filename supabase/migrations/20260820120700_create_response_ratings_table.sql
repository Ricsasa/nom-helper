-- One rating per message. review_status belongs to the operator workflow.
CREATE TABLE public.response_ratings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id       uuid NOT NULL UNIQUE REFERENCES public.messages (id) ON DELETE CASCADE,
  is_positive      boolean NOT NULL,
  reason_category  text CHECK (reason_category IN (
                     'citation_mismatch', 'off_topic', 'missing_info',
                     'wrong_interpretation', 'wrong_reference', 'other')),
  reason_text      text,
  review_status    text NOT NULL DEFAULT 'pending' CHECK (review_status IN (
                     'pending', 'reviewed', 'discarded', 'not_applicable')),
  created_at       timestamptz NOT NULL DEFAULT NOW(),
  updated_at       timestamptz NOT NULL DEFAULT NOW()
);

-- The operator queue reads exactly this slice.
CREATE INDEX response_ratings_review_status_idx
  ON public.response_ratings (review_status)
  WHERE is_positive = false;
