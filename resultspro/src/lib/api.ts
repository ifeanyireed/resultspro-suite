// API client for analytics endpoints
import axios from 'axios';

const baseURL =
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_RESULTS_API || process.env?.NEXT_PUBLIC_API_URL || process.env?.NEXT_PUBLIC_USERS_API)) ||
  import.meta.env.VITE_API_URL ||
  '';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
