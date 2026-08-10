import { SupabaseClient } from '@supabase/supabase-js';

export interface QueryResult {
  data: unknown;
  error: { message: string } | null;
}

export interface RecordedCall {
  table: string;
  method: string;
  args: unknown[];
}

export interface SupabaseMockConfig {
  /**
   * Results per table, consumed in order. Once one entry is left it answers
   * every further query on that table, so a test that reads twice only has to
   * queue two entries when the two answers differ.
   */
  results?: Record<string, QueryResult[]>;
}

export interface SupabaseMock {
  client: SupabaseClient;
  calls: RecordedCall[];
  callsFor(table: string, method?: string): RecordedCall[];
}

const CHAIN_METHODS = [
  'select',
  'insert',
  'update',
  'upsert',
  'delete',
  'eq',
  'neq',
  'in',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'ilike',
  'is',
  'order',
  'limit',
  'range',
  'single',
  'maybeSingle',
];

/**
 * Minimal stand-in for the Supabase query builder: every method returns the
 * same object and the object is awaitable at any point in the chain, which is
 * how the real builder behaves. It records what it was called with, so a test
 * can assert on the filters and on the row that was written.
 */
export function createSupabaseMock(config: SupabaseMockConfig = {}): SupabaseMock {
  const queues: Record<string, QueryResult[]> = {};
  for (const [table, results] of Object.entries(config.results ?? {})) {
    queues[table] = [...results];
  }

  const calls: RecordedCall[] = [];

  const from = jest.fn((table: string) => {
    const builder: Record<string, unknown> = {};

    for (const method of CHAIN_METHODS) {
      builder[method] = jest.fn((...args: unknown[]) => {
        calls.push({ table, method, args });
        return builder;
      });
    }

    builder.then = (
      onFulfilled: (value: QueryResult) => unknown,
      onRejected?: (reason: unknown) => unknown
    ) => {
      const queue = queues[table] ?? [{ data: [], error: null }];
      const result = queue.length > 1 ? (queue.shift() as QueryResult) : queue[0];
      return Promise.resolve(result).then(onFulfilled, onRejected);
    };

    return builder;
  });

  return {
    client: { from } as unknown as SupabaseClient,
    calls,
    callsFor: (table: string, method?: string) =>
      calls.filter((call) => call.table === table && (method === undefined || call.method === method)),
  };
}
