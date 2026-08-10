/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/items/route';
import { authenticateRequest } from '@/lib/supabase';
import { createItem, listItems } from '@/lib/db-server';
import { createSupabaseMock } from '../helpers/supabase-mock';
import { jsonRequest, malformedRequest } from '../helpers/request';

jest.mock('@/lib/supabase', () => ({ authenticateRequest: jest.fn() }));
jest.mock('@/lib/db-server', () => ({
  listItems: jest.fn(),
  createItem: jest.fn(),
}));

const authenticateRequestMock = authenticateRequest as jest.Mock;
const listItemsMock = listItems as jest.Mock;
const createItemMock = createItem as jest.Mock;
const client = createSupabaseMock().client;

const TEST_USER_ID = 'user-123';
const ITEM = {
  id: 'item-1',
  user_id: TEST_USER_ID,
  name: 'First',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  authenticateRequestMock.mockResolvedValue({ client, userId: TEST_USER_ID });
});

describe('GET /api/items', () => {
  it('answers 401 without a valid token', async () => {
    authenticateRequestMock.mockResolvedValue(null);
    const response = await GET(jsonRequest('/api/items', 'GET'));
    expect(response.status).toBe(401);
    expect(listItemsMock).not.toHaveBeenCalled();
  });

  it('returns the caller rows', async () => {
    listItemsMock.mockResolvedValue([ITEM]);
    const response = await GET(jsonRequest('/api/items', 'GET'));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ items: [ITEM] });
    expect(listItemsMock).toHaveBeenCalledWith(client, TEST_USER_ID);
  });

  it('hides the database error behind a 500 and a reference', async () => {
    listItemsMock.mockRejectedValue(new Error('relation "items" does not exist'));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET(jsonRequest('/api/items', 'GET'));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Internal server error');
    expect(body.reference).toEqual(expect.any(String));
    expect(JSON.stringify(body)).not.toContain('relation');
  });
});

describe('POST /api/items', () => {
  it('rejects a malformed body', async () => {
    const response = await POST(malformedRequest('/api/items', 'POST'));
    expect(response.status).toBe(400);
    expect(createItemMock).not.toHaveBeenCalled();
  });

  it('rejects an empty name', async () => {
    const response = await POST(jsonRequest('/api/items', 'POST', { name: '   ' }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'name cannot be empty' });
  });

  it('creates the row and answers 201', async () => {
    createItemMock.mockResolvedValue(ITEM);
    const response = await POST(jsonRequest('/api/items', 'POST', { name: 'First' }));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ item: ITEM });
    expect(createItemMock).toHaveBeenCalledWith(client, TEST_USER_ID, { name: 'First' });
  });
});
