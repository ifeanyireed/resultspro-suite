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

export function getActiveTenantId(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const qTenant = params.get('tenant') || params.get('tenant_id') || params.get('school_id');
    if (qTenant) return qTenant;

    const stored =
      localStorage.getItem('tenantId') ||
      localStorage.getItem('x-tenant-id') ||
      localStorage.getItem('active_tenant_id') ||
      localStorage.getItem('tenant_slug');
    if (stored) return stored;

    const host = window.location.hostname;
    if (host.endsWith('.scholars.ng') || host.endsWith('.resultspro.ng')) {
      const sub = host.split('.')[0];
      if (sub && sub !== 'www' && sub !== 'app') {
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
