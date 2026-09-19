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
  const token = typeof window !== 'undefined' ? (Cookies.get('token') || localStorage.getItem('token')) : null;
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (token) {
    if (!config.headers) {
       config.headers = {} as any;
    }
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
    (config.headers as any)['X-Tenant-Domain'] = domain;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
        let rootDomain: string | undefined = undefined;
        if (platformDomain !== 'localhost') {
           rootDomain = `.${platformDomain}`;
        }
        Cookies.remove('token', { domain: rootDomain, path: '/' });
        Cookies.remove('token');
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
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (token) {
    if (!config.headers) {
       config.headers = {} as any;
    }
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
    (config.headers as any)['X-Tenant-Domain'] = domain;
  }
  return config;
});

coursesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
        let rootDomain: string | undefined = undefined;
        if (platformDomain !== 'localhost') {
           rootDomain = `.${platformDomain}`;
        }
        Cookies.remove('token', { domain: rootDomain, path: '/' });
        Cookies.remove('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
