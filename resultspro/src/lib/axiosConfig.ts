import axios from 'axios';

// Create axios instance with defaults
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const axiosInstance = axios.create({
  baseURL: apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`,
  timeout: 30000,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
