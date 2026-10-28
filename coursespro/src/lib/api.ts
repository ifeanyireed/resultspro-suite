import axios from 'axios';
import Cookies from 'js-cookie';

export const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
export const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'https://resultspro-service-examspro.onrender.com';

/**
 * Extracts the tenant slug from the current hostname.
 * Handles:
 * - Production subdomains: skillupacademy.resultspro.ng → "skillupacademy"
 * - Dev subdomains:        skillupacademy.localhost:3001 → "skillupacademy"
 * - Plain localhost:        falls back to NEXT_PUBLIC_TENANT_SLUG env var
 */
export function getTenantSlug(): string {
  if (typeof window === 'undefined') return '';

  // 1. If canonical tenant_slug was persisted during login or page load for this host, use it
  const storedSlug = localStorage.getItem('tenant_slug');
  const storedHost = localStorage.getItem('tenant_slug_host');
  if (storedSlug && storedHost === window.location.hostname) {
    return storedSlug;
  }
  
  const hostname = window.location.hostname;
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';

  // Check if it's the platform domain or internal host
  const isPlatform = hostname === 'localhost' || 
                     hostname === platformDomain || 
                     hostname === `coursespro.${platformDomain}` || 
                     hostname.includes('onrender.com') || 
                     hostname === 'www';

  if (isPlatform) {
    return process.env.NEXT_PUBLIC_TENANT_SLUG || '';
  }

  // If it's a custom domain (e.g. learn.skilluplearningacademy.com), return full hostname
  const isCustomDomain = !hostname.includes(platformDomain) && !hostname.includes('localhost');
  if (isCustomDomain) {
    return hostname;
  }

  // Otherwise, extract the subdomain (e.g. skillupacademy.resultspro.ng -> skillupacademy)
  return hostname.split('.')[0];
}

const api = axios.create({
  baseURL: USERS_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? (Cookies.get('token') || localStorage.getItem('token')) : null;
  const domain = getTenantSlug();
  
  if (!config.headers) {
      config.headers = {} as any;
  }
  (config.headers as any)['X-Tenant-Domain'] = domain;
  
  if (token) {
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth on explicit token/session failures, not on tenant resolution issues
    const errorStr = JSON.stringify(error.response?.data || {}).toLowerCase();
    const isTenantIssue = errorStr.includes('tenant');
    
    if (error.response?.status === 401 && !isTenantIssue) {
      console.error("api interceptor caught 401 and wiped token. error.response.data:", error.response?.data);
      if (typeof window !== 'undefined') {
        const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
        let rootDomain: string | undefined = undefined;
        if (platformDomain !== 'localhost') {
           rootDomain = `.${platformDomain}`;
        }
        Cookies.remove('token', { domain: rootDomain, path: '/' });
        Cookies.remove('token');
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);


export const COURSES_API = process.env.NEXT_PUBLIC_COURSES_API || 'https://resultspro-service-coursespro.onrender.com';

export const coursesApi = axios.create({
  baseURL: COURSES_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

coursesApi.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? (Cookies.get('token') || localStorage.getItem('token')) : null;
  const domain = getTenantSlug();
  
  if (!config.headers) {
      config.headers = {} as any;
  }
  (config.headers as any)['X-Tenant-Domain'] = domain;
  
  if (token) {
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

coursesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth on explicit token/session failures, not on tenant resolution issues
    const errorStr = JSON.stringify(error.response?.data || {}).toLowerCase();
    const isTenantIssue = errorStr.includes('tenant');

    if (error.response?.status === 401 && !isTenantIssue) {
      console.error("api interceptor caught 401 and wiped token. error.response.data:", error.response?.data);
      if (typeof window !== 'undefined') {
        const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
        let rootDomain: string | undefined = undefined;
        if (platformDomain !== 'localhost') {
           rootDomain = `.${platformDomain}`;
        }
        Cookies.remove('token', { domain: rootDomain, path: '/' });
        Cookies.remove('token');
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
