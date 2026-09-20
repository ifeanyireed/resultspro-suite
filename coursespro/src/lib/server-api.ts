import { headers, cookies } from 'next/headers';
import { USERS_API, COURSES_API, EXAMS_API } from './api';

/**
 * Server-only utility to get the current tenant slug.
 * This reads the custom header injected by our Edge Middleware.
 */
export async function getServerTenantSlug(): Promise<string> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug');
  if (slug) return slug;
  
  // Fallback for local dev if middleware didn't run or we're on plain localhost
  return process.env.NEXT_PUBLIC_TENANT_SLUG || 'localhost';
}

/**
 * Server-only utility to get the auth token.
 */
export async function getServerAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}

/**
 * Creates a standard set of headers for server-side fetches.
 */
export async function getServerAuthHeaders(): Promise<HeadersInit> {
  const token = await getServerAuthToken();
  const tenant = await getServerTenantSlug();
  
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
  const authHeaders = await getServerAuthHeaders();
  
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };
  
  const res = await fetch(url, fetchOptions);
  
  // We can add server-side 401 handling here if needed, 
  // but usually we just let it fail and the component handles it.
  
  return res;
}
