import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized(): NextResponse {
  return jsonError('Unauthorized', 401);
}

export function notFound(resource: string): NextResponse {
  return jsonError(`${resource} not found`, 404);
}

// Postgres error text carries table, column and constraint names, so it never
// reaches the client. The reference id is the only thing that crosses the wire:
// it ties the generic response to the full error in the server log.
export function serverError(error: unknown): NextResponse {
  const reference = randomUUID();
  const detail = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(`[api] ${reference} ${detail}`);
  return NextResponse.json({ error: 'Internal server error', reference }, { status: 500 });
}

// A body larger than this is never legitimate for these endpoints, and parsing
// it would mean buffering attacker-chosen bytes before any validation runs.
export const MAX_BODY_BYTES = 64 * 1024;

export async function readJsonBody<T>(request: Request): Promise<T | null> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;
  try {
    const raw = await request.text();
    // content-length is a claim, not a guarantee: chunked requests omit it.
    if (raw.length > MAX_BODY_BYTES) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
