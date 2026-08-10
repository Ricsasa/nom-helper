import { v } from 'convex/values';
import { mutation, query, QueryCtx, MutationCtx } from './_generated/server';

/**
 * Reference functions. Convex has no row-level security: authorisation is code,
 * and every function has to run it. `requireUserId` is that check, and no
 * function may touch the table without it.
 */
async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthenticated');
  return identity.subject;
}

const MAX_NAME_LENGTH = 100;

function normalizeName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length < 1) throw new Error('name cannot be empty');
  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new Error(`name cannot exceed ${MAX_NAME_LENGTH} characters`);
  }
  return trimmed;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query('items')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert('items', { userId, name: normalizeName(args.name) });
  },
});

export const update = mutation({
  args: { id: v.id('items'), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const item = await ctx.db.get(args.id);
    // A document id is guessable, so ownership is checked on every write.
    if (!item || item.userId !== userId) throw new Error('Item not found');
    await ctx.db.patch(args.id, { name: normalizeName(args.name) });
  },
});

export const remove = mutation({
  args: { id: v.id('items') },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error('Item not found');
    await ctx.db.delete(args.id);
  },
});
