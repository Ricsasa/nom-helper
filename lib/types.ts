export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark' | 'system';

/** Error shape every API route returns; `reference` ties it to a server log. */
export interface ApiError {
  error: string;
  reference?: string;
}

/** Example resource. Replace with the real domain types. */
export interface Item {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ItemInput {
  name: string;
}
