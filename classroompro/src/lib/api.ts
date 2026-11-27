import axios from 'axios';

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://resultspro-service-classroompro.onrender.com/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function extractTenantIdFromJwt(token?: string | null): string {
  if (!token) return '';
  try {
    const parts = token.split('.');
    if (parts.length < 2) return '';
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const claims = JSON.parse(jsonPayload);
    if (claims?.tenant_id && typeof claims.tenant_id === 'string') {
      return claims.tenant_id;
    }
    if (claims?.tenants && typeof claims.tenants === 'object') {
      for (const key of Object.keys(claims.tenants)) {
        const entry = claims.tenants[key];
        if (entry?.id) return String(entry.id);
      }
    }
  } catch {
    // Ignore malformed tokens
  }
  return '';
}

function isCentralAppHostname(host: string): boolean {
  const lower = (host || '').toLowerCase().split(':')[0];
  if (
    !lower ||
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower.endsWith('.onrender.com') ||
    lower.endsWith('.vercel.app')
  ) {
    return true;
  }
  const centralHosts = new Set([
    'resultspro.ng',
    'www.resultspro.ng',
    'app.resultspro.ng',
    'classroompro.resultspro.ng',
    'coursespro.resultspro.ng',
    'courses.resultspro.ng',
    'classroompro.ng',
    'www.classroompro.ng',
  ]);
  return centralHosts.has(lower);
}

export function resolveActiveTenantId(): string {
  if (typeof window === 'undefined') return '';
  const stored =
    localStorage.getItem('tenantId') ||
    localStorage.getItem('x-tenant-id') ||
    localStorage.getItem('active_tenant_id') ||
    localStorage.getItem('schoolId') ||
    localStorage.getItem('tenant_slug');
  if (stored && !isCentralAppHostname(stored)) return stored;

  const rawUser = localStorage.getItem('user');
  if (rawUser && rawUser !== 'undefined') {
    try {
      const parsed = JSON.parse(rawUser);
      const userTenant =
        parsed?.tenant_id || parsed?.school_id || parsed?.tenant_slug || parsed?.school?.id;
      if (userTenant) return String(userTenant);
    } catch {
      // Ignore parse errors
    }
  }

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('token');
  const jwtTenant = extractTenantIdFromJwt(token);
  if (jwtTenant) return jwtTenant;

  const host = window.location?.hostname || '';
  if (host && !isCentralAppHostname(host)) {
    return host;
  }
  return '';
}

// Attach auth token and resolved user tenant_id on every request so service_classroompro
// can proxy user and academic record lookups directly to service_campuspro.
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const tenantId = resolveActiveTenantId();
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
        config.headers['X-Tenant-ID'] = tenantId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
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
  const response = await api.get(`/dashboard/syllabus?subject=${encodeURIComponent(subject)}`);
  return response.data;
};

export const getStudentProgress = async () => {
  const response = await api.get('/dashboard/progress');
  return response.data;
};

export const getCampusClasses = async () => {
  const response = await api.get('/campus/classes');
  return response.data;
};

export const getCampusStudents = async (params?: { arm_id?: string; class_id?: string; search?: string }) => {
  const response = await api.get('/campus/students', { params });
  return response.data;
};

export const getCampusParentWards = async () => {
  const response = await api.get('/campus/parent/wards');
  return response.data;
};

export const getCampusOfficialExamScores = async (params?: Record<string, string>) => {
  const response = await api.get('/campus/exam-scores/official', { params });
  return response.data;
};

export const getCampusBranches = async () => {
  const response = await api.get('/campus/branches');
  return response.data;
};

export const getCampusStaff = async (params?: Record<string, string>) => {
  const response = await api.get('/campus/staff', { params });
  return response.data;
};

export const getCampusNotices = async () => {
  const response = await api.get('/campus/notices');
  return response.data;
};

export const getCampusSummary = async () => {
  const response = await api.get('/campus/summary');
  return response.data;
};

export const getCampusUsersDirectory = async () => {
  const response = await api.get('/campus/users');
  return response.data;
};

export const logStudySession = async (duration: number, activity: string) => {
  const response = await api.post('/gamification/session', { duration, activity });
  return response.data;
};

export default api;
