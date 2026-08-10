const BASE_URL = 'http://localhost:3000';

/** A Request shaped the way the route handlers read it: bearer token plus JSON body. */
export function jsonRequest(path: string, method: string, body?: unknown): Request {
  return new Request(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/** A Request whose body is not valid JSON, to exercise readJsonBody's failure path. */
export function malformedRequest(path: string, method: string): Request {
  return new Request(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    body: '{ not json',
  });
}
