import axios from 'axios';

/**
 * scholars_ng API Client
 * 
 * Configured to handle multi-tenancy and centralized identity.
 * - baseURL: Points to the Go control plane (service_users / service_classroom / etc.).
 * - Headers: Automatically attaches JWT and X-Tenant-Domain / X-Tenant-Id.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject identity and tenant context
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // 1. Attach Central Auth JWT (supports multiple keys used across suite apps)
    const token = 
      localStorage.getItem('scholars_ng_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Attach School Domain & Tenant Slug
    const host = window.location.host;
    const hostname = window.location.hostname.toLowerCase();
    const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();

    // Check if on a subdomain (e.g. greenfield.scholars.ng or greenfield.localhost)
    let tenantSlug = '';
    if (hostname.endsWith('.localhost')) {
      tenantSlug = hostname.replace('.localhost', '');
    } else if (hostname.endsWith(`.${platformDomain}`)) {
      tenantSlug = hostname.replace(`.${platformDomain}`, '');
    } else if (hostname.endsWith('.resultspro.ng')) {
      tenantSlug = hostname.replace('.resultspro.ng', '');
    } else if (
      hostname !== platformDomain &&
      hostname !== `www.${platformDomain}` &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1'
    ) {
      // Custom institutional domain
      tenantSlug = hostname;
    }

    if (tenantSlug) {
      config.headers['X-Tenant-Slug'] = tenantSlug;
      config.headers['X-Tenant-Domain'] = host;
    }

    const storedTenantId = localStorage.getItem('active_tenant_id');
    if (storedTenantId) {
      config.headers['x-tenant-id'] = storedTenantId;
    }
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
