import axios from 'axios';

// Create axios instance with defaults
const getApiUrl = () => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
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

// Add request interceptor to include auth token and tenant id
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const tenantId = localStorage.getItem('tenantId') || localStorage.getItem('x-tenant-id');
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
      }
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
