import { authenticateRequest } from '@/lib/supabase';
import { deleteItem, updateItem } from '@/lib/db-server';
import { ItemInput } from '@/lib/types';
import { validateName } from '@/lib/validation';
import {
  jsonError,
  jsonOk,
  notFound,
  readJsonBody,
  serverError,
  unauthorized,
} from '@/lib/api-response';

// Next 15 hands route params as a promise.
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();
  const { id } = await params;
  const body = await readJsonBody<Partial<ItemInput>>(request);
  if (!body) return jsonError('Invalid JSON body', 400);
  if (body.name !== undefined) {
    const validationError = validateName(body.name, 100, 'name');
    if (validationError) return jsonError(validationError, 400);
  }
  try {
    const item = await updateItem(auth.client, auth.userId, id, body);
    if (!item) return notFound('Item');
    return jsonOk({ item });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();
  const { id } = await params;
  try {
    const deleted = await deleteItem(auth.client, auth.userId, id);
    if (!deleted) return notFound('Item');
    return jsonOk({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
