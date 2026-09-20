import { headers, cookies } from 'next/headers';
import { USERS_API, COURSES_API, EXAMS_API } from './api';

/**
 * Server-only utility to get the current tenant slug.
 * This reads the custom header injected by our Edge Middleware.
 */
export function getServerTenantSlug(): string {
  const headersList = headers();
  const slug = headersList.get('x-tenant-slug');
  if (slug) return slug;
  
  // Fallback for local dev if middleware didn't run or we're on plain localhost
  return process.env.NEXT_PUBLIC_TENANT_SLUG || 'localhost';
}

/**
 * Server-only utility to get the auth token.
 */
export function getServerAuthToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value || null;
}

/**
 * Creates a standard set of headers for server-side fetches.
 */
export function getServerAuthHeaders(): HeadersInit {
  const token = getServerAuthToken();
  const tenant = getServerTenantSlug();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-Domain': tenant,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * A tiny wrapper around native fetch for Server Components.
 */
export async function serverFetch(url: string, options: RequestInit = {}) {
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...getServerAuthHeaders(),
      ...options.headers,
    },
  };
  
  const res = await fetch(url, fetchOptions);
  
  // We can add server-side 401 handling here if needed, 
  // but usually we just let it fail and the component handles it.
  
  return res;
}
