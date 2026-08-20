-- The review row and the new review_status must land together, or the queue
-- shows a rating that already has a review. One function, one transaction.
CREATE OR REPLACE FUNCTION public.create_operator_review(
  p_rating_id       uuid,
  p_technical_cause text,
  p_destination     text
)
RETURNS public.operator_reviews
LANGUAGE plpgsql
AS $$
DECLARE
  v_review public.operator_reviews;
BEGIN
  INSERT INTO public.operator_reviews (rating_id, technical_cause, destination)
  VALUES (p_rating_id, p_technical_cause, p_destination)
  RETURNING * INTO v_review;

  UPDATE public.response_ratings
  SET review_status = CASE WHEN p_destination = 'discarded' THEN 'discarded' ELSE 'reviewed' END
  WHERE id = p_rating_id;

  RETURN v_review;
END;
$$;
