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
  console.log('[usersApi Interceptor] URL:', config.url, 'Token found:', !!token);
  if (token) {
    config.headers = config.headers || {};
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    console.warn('[usersApi Interceptor] No token found in cookies!');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        let rootDomain = host.includes('localhost') ? 'localhost' : (host.split('.').length > 2 ? `.${host.split('.').slice(-2).join('.')}` : `.${host}`);
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
  const cookieToken = typeof window !== 'undefined' ? Cookies.get('token') : null;
  const token = cookieToken;
  
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  console.log('[coursesApi Interceptor] URL:', config.url, 'Token found:', !!token);
  
  if (token) {
    config.headers = config.headers || {};
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
      config.headers.set('X-Tenant-Domain', domain);
      console.log('[coursesApi Interceptor] Headers set using .set()');
    } else {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Tenant-Domain'] = domain;
      console.log('[coursesApi Interceptor] Headers set using assignment');
    }
  } else {
    console.warn('[coursesApi Interceptor] No token found in cookies!');
  }
  return config;
});

coursesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        let rootDomain = host.includes('localhost') ? 'localhost' : (host.split('.').length > 2 ? `.${host.split('.').slice(-2).join('.')}` : `.${host}`);
        Cookies.remove('token', { domain: rootDomain, path: '/' });
        Cookies.remove('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
