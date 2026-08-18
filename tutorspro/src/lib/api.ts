import axios from 'axios';
import { toast } from 'react-hot-toast';

const getApiUrl = () => {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  
  // If we are in the browser and not on localhost, use the relative path /api
  // which will be proxied by Nginx to the Go backend
  if (!window.location.hostname.includes('localhost')) {
    return '/api';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global Safety Net for offline or blocked requests
    if (error.message === 'Network Error') {
      console.warn("Backend is unreachable! Potential connection drop, offline server, or aggressive adblocker.");
      if (typeof window !== 'undefined') {
        toast.error("Unable to connect to servers. Please check your connection or disable adblockers.", {
          id: "network-error", // prevents toast spam
          duration: 5000
        });
      }
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: window.location.href = '/admin/login'; 
        // Better to let the component handle it or use a store
      }
    }
    return Promise.reject(error);
  }
);

export default api;
