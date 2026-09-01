import axios from 'axios';

/**
 * SchoolHub API Client
 * 
 * Configured to handle multi-tenancy and centralized identity.
 * - baseURL: Points to the Go control plane.
 * - Headers: Automatically attaches JWT and X-School-Slug.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://resultspro-service-coursespro.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject identity and tenant context
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // 1. Attach Central Auth JWT
    const token = localStorage.getItem('schoolhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Attach School Domain (Tenant)
    // The backend uses this to resolve the tenant ID via the introspection endpoint.
    let domain = window.location.host;
    if (domain.includes('localhost')) {
      domain = 'reedbreed.resultspro.ng';
    }
    if (domain) {
      config.headers['X-Tenant-Domain'] = domain;
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
      // Handle unauthorized (e.g., redirect to login)
      console.error('Session expired. Redirecting to Central Auth...');
    }
    return Promise.reject(error);
  }
);

export default api;
