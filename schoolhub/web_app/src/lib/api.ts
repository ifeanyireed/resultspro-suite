import axios from 'axios';

/**
 * SchoolHub API Client
 * 
 * Configured to handle multi-tenancy and centralized identity.
 * - baseURL: Points to the Go control plane.
 * - Headers: Automatically attaches JWT and X-School-Slug.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
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

    // 2. Attach School Slug (Tenant)
    // In production, the backend resolves by Host header, 
    // but the slug header allows for dev/preview environments.
    const slug = localStorage.getItem('schoolhub_slug');
    if (slug) {
      config.headers['X-School-Slug'] = slug;
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
