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
  let token = null;
  if (typeof window !== 'undefined') {
    token = Cookies.get('token') || localStorage.getItem('token');
    console.log(`[usersApi] Running on ${window.location.href}`);
    console.log(`[usersApi] localStorage token: ${localStorage.getItem('token') ? 'EXISTS' : 'NULL'}`);
    console.log(`[usersApi] cookies token: ${Cookies.get('token') ? 'EXISTS' : 'NULL'}`);
  }
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  console.log('[usersApi Interceptor] URL:', config.url, 'Token found:', !!token);
  if (token) {
    if (!config.headers) {
       config.headers = {} as any;
    }
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
      config.headers.set('X-Tenant-Domain', domain);
    } else {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
      (config.headers as any)['X-Tenant-Domain'] = domain;
    }
  } else {
    console.warn('[usersApi Interceptor] No token found in cookies or localstorage!');
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
        localStorage.removeItem('token');
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
  let token = null;
  if (typeof window !== 'undefined') {
    token = Cookies.get('token') || localStorage.getItem('token');
    console.log(`[coursesApi] Running on ${window.location.href}`);
    console.log(`[coursesApi] localStorage token: ${localStorage.getItem('token') ? 'EXISTS' : 'NULL'}`);
    console.log(`[coursesApi] cookies token: ${Cookies.get('token') ? 'EXISTS' : 'NULL'}`);
  }
  
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  console.log('[coursesApi Interceptor] URL:', config.url, 'Token found:', !!token);
  
  if (token) {
    // Forcefully inject headers
    if (!config.headers) {
       config.headers = {} as any;
    }
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
      config.headers.set('X-Tenant-Domain', domain);
    } else {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
      (config.headers as any)['X-Tenant-Domain'] = domain;
    }
  } else {
    console.error('[coursesApi Interceptor] CRITICAL: No token found in cookies or localStorage!');
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
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
