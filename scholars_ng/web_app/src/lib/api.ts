import axios from 'axios';

/**
 * Helper to read a cookie on the client
 */
function getCookieValue(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

/**
 * Resolve active tenant context on client (subdomain, custom domain, query, DOM dataset, cookie, or localStorage)
 */
export function getActiveTenantContext(): { tenantId: string; tenantSlug: string; tenantDomain: string } {
  if (typeof window === 'undefined') {
    return { tenantId: '', tenantSlug: '', tenantDomain: '' };
  }

  const host = window.location.host;
  const rawHostname = window.location.hostname.toLowerCase().trim();
  const hostname = rawHostname.startsWith('www.') ? rawHostname.slice(4) : rawHostname;
  const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();

  let tenantSlug = '';
  const urlParams = new URLSearchParams(window.location.search);
  const queryTenant = urlParams.get('tenant')?.toLowerCase().trim();

  if (queryTenant) {
    tenantSlug = queryTenant;
  } else if (hostname.endsWith('.localhost')) {
    tenantSlug = hostname.replace(/\.localhost$/, '');
  } else if (hostname.endsWith('.scholars.local')) {
    tenantSlug = hostname.replace(/\.scholars\.local$/, '');
  } else if (hostname.endsWith(`.${platformDomain}`)) {
    tenantSlug = hostname.replace(new RegExp(`\\.${platformDomain.replace('.', '\\.')}$`), '');
  } else if (hostname.endsWith('.scholars.ng')) {
    tenantSlug = hostname.replace(/\.scholars\.ng$/, '');
  } else if (hostname.endsWith('.resultspro.ng')) {
    tenantSlug = hostname.replace(/\.resultspro\.ng$/, '');
  } else if (
    hostname &&
    hostname !== platformDomain &&
    hostname !== 'scholars.ng' &&
    hostname !== 'resultspro.ng' &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1' &&
    !hostname.endsWith('.vercel.app') &&
    !hostname.endsWith('.onrender.com')
  ) {
    // Custom institutional domain (e.g., portal.greenwoodhigh.edu.ng)
    tenantSlug = rawHostname;
  }

  const domTenantId = document.documentElement?.getAttribute('data-tenant-id') || '';
  const domTenantSlug = document.documentElement?.getAttribute('data-tenant-slug') || '';

  const tenantId =
    domTenantId ||
    getCookieValue('tenant_id') ||
    getCookieValue('active_tenant_id') ||
    localStorage.getItem('active_tenant_id') ||
    localStorage.getItem('tenant_id') ||
    '';

  const finalSlug =
    tenantSlug ||
    domTenantSlug ||
    getCookieValue('tenant_slug') ||
    getCookieValue('active_tenant_slug') ||
    localStorage.getItem('active_tenant_slug') ||
    localStorage.getItem('tenant_slug') ||
    '';

  return {
    tenantId,
    tenantSlug: finalSlug,
    tenantDomain: host,
  };
}

/**
 * scholars_ng API Client
 * 
 * Configured to handle multi-tenancy and centralized identity.
 * - baseURL: Points to the Go control plane (service_users / service_classroom / etc.).
 * - Headers: Automatically attaches JWT and X-Tenant-Domain / X-Tenant-Slug / X-Tenant-Id.
 */
const defaultApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_USERS_API ? `${process.env.NEXT_PUBLIC_USERS_API}/api` : '');
const api = axios.create({
  baseURL: defaultApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject identity and strict tenant isolation headers
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // 1. Attach Central Auth JWT (supports multiple keys used across suite apps)
    const token = 
      localStorage.getItem('scholars_ng_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('authToken') ||
      getCookieValue('token') ||
      getCookieValue('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Attach Strict Tenant Headers (ID, Slug, Custom Domain)
    const { tenantId, tenantSlug, tenantDomain } = getActiveTenantContext();

    if (tenantSlug) {
      config.headers['X-Tenant-Slug'] = tenantSlug;
    }
    if (tenantDomain) {
      config.headers['X-Tenant-Domain'] = tenantDomain;
    }
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
      config.headers['X-Tenant-ID'] = tenantId;
    }
  }

  // 3. Dynamic Microservice Routing: direct campus endpoints to CampusPRO if configured
  const campusApi = process.env.NEXT_PUBLIC_CAMPUS_API;
  if (campusApi && config.url && (config.url.includes('/campus/') || config.url.startsWith('/campus') || config.url.startsWith('/public/campus'))) {
    const cleanCampus = campusApi.replace(/\/+$/, '');
    config.baseURL = cleanCampus.endsWith('/api') ? cleanCampus : `${cleanCampus}/api`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);

export default api;
