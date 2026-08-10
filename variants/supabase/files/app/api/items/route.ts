import { authenticateRequest } from '@/lib/supabase';
import { createItem, listItems } from '@/lib/db-server';
import { ItemInput } from '@/lib/types';
import { validateName } from '@/lib/validation';
import { jsonError, jsonOk, readJsonBody, serverError, unauthorized } from '@/lib/api-response';

/**
 * Reference handler. Every route follows the same four steps: authenticate,
 * read the body, validate it, then touch the database inside a try/catch that
 * ends in serverError().
 */

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();
  try {
    const items = await listItems(auth.client, auth.userId);
    return jsonOk({ items });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();
  const body = await readJsonBody<ItemInput>(request);
  if (!body) return jsonError('Invalid JSON body', 400);
  const validationError = validateName(body.name, 100, 'name');
  if (validationError) return jsonError(validationError, 400);
  try {
    const item = await createItem(auth.client, auth.userId, body);
    return jsonOk({ item }, 201);
  } catch (error) {
    return serverError(error);
  }
}
