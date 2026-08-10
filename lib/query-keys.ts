/**
 * Every React Query key lives here, so an invalidation cannot drift from the
 * key a hook subscribed with. One entry per resource: `all` for the list,
 * narrower factories built on top of it, so invalidating `all` also drops the
 * narrower entries.
 */
export const queryKeys = {
  items: {
    all: ['items'] as const,
    byId: (id: string) => [...queryKeys.items.all, { id }] as const,
  },
};
