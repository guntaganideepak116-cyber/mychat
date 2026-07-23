/**
 * Auth-aware fetch wrapper.
 * Attaches the Clerk auth token to every request.
 * Reads the API base URL from NEXT_PUBLIC_API_URL.
 *
 * Usage:
 *   import { apiFetch } from '@/lib/api';
 *   const data = await apiFetch('/conversations');
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * Base fetch wrapper that prepends the API base URL and attaches
 * an Authorization header when a token is provided.
 */
export async function apiFetch(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<Response> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;
  return fetch(url, { ...fetchOptions, headers });
}

/** Convenience: GET and parse JSON */
export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const res = await apiFetch(path, { method: 'GET', token });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Convenience: POST JSON body and parse JSON response */
export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string | null,
): Promise<T> {
  const res = await apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
    token,
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

