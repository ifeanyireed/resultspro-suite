import axios from 'axios';
import Cookies from 'js-cookie';

export const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
export const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'https://resultspro-service-examspro.onrender.com';

const api = axios.create({
  baseURL: USERS_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
