import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * Convex validates every document against this schema on write, so a field that
 * is missing here cannot be stored. `userId` holds the subject of the auth
 * identity; the index makes the per-user read a lookup instead of a scan.
 */
export default defineSchema({
  items: defineTable({
    userId: v.string(),
    name: v.string(),
  }).index('by_user', ['userId']),
});
