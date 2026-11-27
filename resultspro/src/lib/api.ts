// API client for CampusPRO (System of Record) & ResultsPRO (EOT Gradebooks & Scratch Cards)
import axios from 'axios';

export const CAMPUS_API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CAMPUS_API) ||
  'https://resultspro-service-campuspro.onrender.com';

export const RESULTS_API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_RESULTS_API) ||
  'https://resultspro-service-resultspro.onrender.com';

export const USERS_API_BASE =
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_USERS_API || process.env?.NEXT_PUBLIC_API_URL)) ||
  'https://resultspro-service-users.onrender.com';

export function extractTenantIdFromJwt(token?: string | null): string {
  if (!token) return '';
  try {
    const parts = token.split('.');
    if (parts.length < 2) return '';
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const claims = JSON.parse(jsonPayload);
    if (claims?.tenant_id && typeof claims.tenant_id === 'string') {
      return claims.tenant_id;
    }
    if (claims?.tenants && typeof claims.tenants === 'object') {
      for (const key of Object.keys(claims.tenants)) {
        const entry = claims.tenants[key];
        if (entry?.id) return String(entry.id);
      }
    }
  } catch {
    // Ignore malformed tokens
  }
  return '';
}

const CENTRAL_SUBDOMAINS = new Set([
  'www',
  'app',
  'api',
  'resultspro',
  'classroompro',
  'coursespro',
  'courses',
  'examspro',
]);

export function getActiveTenantId(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const qTenant = params.get('tenant') || params.get('tenant_id') || params.get('school_id');
    if (qTenant) return qTenant;

    const stored =
      localStorage.getItem('tenantId') ||
      localStorage.getItem('x-tenant-id') ||
      localStorage.getItem('active_tenant_id') ||
      localStorage.getItem('schoolId') ||
      localStorage.getItem('tenant_slug');
    if (stored) return stored;

    const rawUser = localStorage.getItem('user');
    if (rawUser && rawUser !== 'undefined') {
      try {
        const parsed = JSON.parse(rawUser);
        const userTenant =
          parsed?.tenant_id || parsed?.school_id || parsed?.tenant_slug || parsed?.school?.id;
        if (userTenant) return String(userTenant);
      } catch {
        // Ignore parse error
      }
    }

    const token =
      localStorage.getItem('authToken') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken');
    const jwtTenant = extractTenantIdFromJwt(token);
    if (jwtTenant) return jwtTenant;

    const host = window.location.hostname;
    if (host.endsWith('.scholars.ng') || host.endsWith('.resultspro.ng')) {
      const sub = host.split('.')[0].toLowerCase();
      if (sub && !CENTRAL_SUBDOMAINS.has(sub)) {
        return sub;
      }
    }
  }
  return 'tenant-greenwoodhigh';
}

function attachAuthAndTenant(config: any) {
  const tenantId = getActiveTenantId();
  config.headers = config.headers || {};
  config.headers['X-Tenant-ID'] = tenantId;
  config.headers['x-tenant-id'] = tenantId;

  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('authToken') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

// CampusPRO API Client — System of Record for Institution, Branches, Staff, Parents, Wards, Classes, Subjects, Attendance & Official Exam Scores
export const campusApi = axios.create({
  baseURL: CAMPUS_API_BASE.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});
campusApi.interceptors.request.use(attachAuthAndTenant);

// ResultsPRO API Client — Owns Generated EOT Gradebooks (res_instances, res_student_results) & Scratch Cards (res_scratch_cards, res_scratch_card_usages)
export const resultsApi = axios.create({
  baseURL: RESULTS_API_BASE.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});
resultsApi.interceptors.request.use(attachAuthAndTenant);

// Default API Client with smart microservice routing
export const api = axios.create({
  baseURL: RESULTS_API_BASE.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config) => {
  attachAuthAndTenant(config);
  const url = config.url || '';
  if (url.includes('/campus/') || url.startsWith('/api/v1/campus') || url.startsWith('/api/public/campus')) {
    config.baseURL = CAMPUS_API_BASE.replace(/\/+$/, '');
  } else if (url.startsWith('/auth/') || url.startsWith('/users/')) {
    config.baseURL = USERS_API_BASE.replace(/\/+$/, '');
  } else {
    config.baseURL = RESULTS_API_BASE.replace(/\/+$/, '');
  }
  return config;
});

export default api;
