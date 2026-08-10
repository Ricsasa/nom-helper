'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './api-client';
import { queryKeys } from './query-keys';
import { Item, ItemInput } from './types';

/**
 * Client-side data access. Components never call `fetch` and never touch the
 * Supabase client directly: they call these hooks, and the hooks go through the
 * internal API, so validation and RLS both stay on the server.
 */

export function useItems() {
  return useQuery({
    queryKey: queryKeys.items.all,
    queryFn: async () => {
      const { items } = await apiRequest<{ items: Item[] }>('/api/items', 'GET');
      return items;
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ItemInput) => {
      const { item } = await apiRequest<{ item: Item }>('/api/items', 'POST', input);
      return item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.items.all }),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ItemInput> }) => {
      const { item } = await apiRequest<{ item: Item }>(`/api/items/${id}`, 'PATCH', patch);
      return item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.items.all }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest<{ success: true }>(`/api/items/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.items.all }),
  });
}
