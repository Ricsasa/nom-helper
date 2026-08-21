/**
 * Row types of the public schema. created_at and updated_at are database
 * metadata: they are read here and never written by application code.
 */

export type ProfileRole = 'user' | 'operator';
export type ProfileLanguage = 'es-MX' | 'en-US';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type ReviewStatus = 'pending' | 'reviewed' | 'discarded' | 'not_applicable';

export type ReasonCategory =
  | 'citation_mismatch'
  | 'off_topic'
  | 'missing_info'
  | 'wrong_interpretation'
  | 'wrong_reference'
  | 'other';

export type TechnicalCause =
  | 'wrong_chunk_retrieved'
  | 'correct_chunk_wrong_response'
  | 'content_not_in_corpus'
  | 'wrong_citation_attribution'
  | 'no_issue';

export type ReviewDestination = 'add_to_eval_set' | 'marked_reviewed' | 'discarded';

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface Profile extends Timestamps {
  id: string;
  auth_user_id: string;
  name: string;
  role: ProfileRole;
  language: ProfileLanguage;
}

export interface Plan extends Timestamps {
  id: string;
  name: string;
  daily_quota_limit: number;
  price: number;
}

export interface Subscription extends Timestamps {
  id: string;
  profile_id: string;
  plan_id: string;
  starts_at: string;
  ends_at: string | null;
  status: SubscriptionStatus;
}

export interface Conversation extends Timestamps {
  id: string;
  profile_id: string;
  title: string;
}

/** Matches the response contract in docs/specs/ORCHESTRATOR.md. */
export interface Citation {
  chapter: string;
  article: string;
  page: string;
  excerpt: string;
}

export interface MessagePayload {
  query: string;
  summary: string;
  explanation: string;
  citations: Citation[];
  confidence_level: ConfidenceLevel;
  insufficient_info: boolean;
  norm_version: string;
}

export interface Message extends MessagePayload, Timestamps {
  id: string;
  conversation_id: string;
}

export interface RatingPayload {
  is_positive: boolean;
  reason_category?: ReasonCategory | null;
  reason_text?: string | null;
}

export interface ResponseRating extends Timestamps {
  id: string;
  message_id: string;
  is_positive: boolean;
  reason_category: ReasonCategory | null;
  reason_text: string | null;
  review_status: ReviewStatus;
}

export interface OperatorReviewPayload {
  technical_cause: TechnicalCause;
  destination: ReviewDestination;
}

export interface OperatorReview extends Timestamps {
  id: string;
  rating_id: string;
  technical_cause: TechnicalCause;
  destination: ReviewDestination;
  reviewed_at: string;
}

export interface DailyQuota extends Timestamps {
  id: string;
  profile_id: string;
  queries_used: number;
  quota_date: string;
  reset_at: string;
}

export interface ConsumptionLog extends Timestamps {
  id: string;
  profile_id: string;
  message_id: string;
  tokens_used: number;
  estimated_cost: number;
}

export interface QuotaResult {
  allowed: boolean;
  remaining: number;
}

export interface QuotaStatus {
  used: number;
  remaining: number;
  limit: number;
}

/** Inclusive start, exclusive end. ISO 8601 strings. */
export interface DateRange {
  from: string;
  to: string;
}

export interface ConsumptionSummary {
  total_queries: number;
  total_tokens: number;
  total_cost: number;
}

/** One row of the operator consumption panel. Aggregated per profile. */
export interface ProfileConsumption {
  profile_id: string;
  profile_name: string;
  total_queries: number;
  total_tokens: number;
  total_cost: number;
}

/** A pending negative rating joined with the message that produced it. */
export interface ReviewQueueEntry extends ResponseRating {
  message: Pick<Message, 'id' | 'query' | 'summary' | 'confidence_level'>;
}
