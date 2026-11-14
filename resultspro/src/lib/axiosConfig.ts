import axios from 'axios';

// Create axios instance with defaults
const getApiUrl = () => {
  if (typeof process !== 'undefined') {
    if (process.env?.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env?.NEXT_PUBLIC_USERS_API) return process.env.NEXT_PUBLIC_USERS_API;
  }
  try {
    return import.meta.env.VITE_API_URL || '';
  } catch (e) {
    return '';
  }
};
const apiUrl = getApiUrl();
export const axiosInstance = axios.create({
  baseURL: apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`,
  timeout: 30000,
});

// Add request interceptor to include auth token, tenant id, and microservice routing
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const tenantId = localStorage.getItem('tenantId') || localStorage.getItem('x-tenant-id') || localStorage.getItem('active_tenant_id');
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
        config.headers['X-Tenant-ID'] = tenantId;
      }
    }

    // Dynamic microservice routing for CampusPRO
    const campusApi = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_CAMPUS_API : '';
    if (campusApi && config.url && (config.url.includes('/campus/') || config.url.startsWith('/campus') || config.url.startsWith('campus/'))) {
      const cleanCampus = campusApi.replace(/\/+$/, '');
      config.baseURL = `${cleanCampus}/`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, token might be expired, clear auth data
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export default axios for use where needed
export default axiosInstance;
