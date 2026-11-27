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

// Attach auth token, tenant id, and tenant domain on every request so service_classroompro
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
      const tenantId =
        localStorage.getItem('tenantId') ||
        localStorage.getItem('x-tenant-id') ||
        localStorage.getItem('tenant_slug');
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
        config.headers['X-Tenant-Domain'] = tenantId;
      } else if (window.location?.hostname) {
        config.headers['X-Tenant-Domain'] = window.location.hostname;
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
