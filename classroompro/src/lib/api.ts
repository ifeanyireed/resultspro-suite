import axios from 'axios';
import { toast } from 'react-hot-toast';

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://resultspro-service-classroompro.onrender.com/api';
};

const API_URL = getApiUrl();

// Debug log to help identify connection issues on droplets
if (typeof window !== 'undefined') {
  console.log(`[API] Resolved Base URL: ${API_URL} (Hostname: ${window.location.hostname}, Port: ${window.location.port})`);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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
  async (error) => {
    const originalRequest = error.config;

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
          const { access_token, refresh_token } = res.data;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
          }
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getStudentDashboard = async () => {
  const response = await api.get('/dashboard/student');
  return response.data;
};

export const getStudentSubjects = async () => {
  const response = await api.get('/dashboard/subjects');
  return response.data;
};

export const getSubjectSyllabus = async (subject: string) => {
  const response = await api.get(`/dashboard/syllabus?subject=${subject}`);
  return response.data;
};

export const getStudentProgress = async () => {
  const response = await api.get('/dashboard/progress');
  return response.data;
};

export const logStudySession = async (duration: number, activity: string) => {
  const response = await api.post('/gamification/session', { duration, activity });
  return response.data;
};

export default api;
