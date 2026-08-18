import api from './api';

export interface Report {
  id: string;
  type: 'question' | 'user' | 'comment' | 'other';
  targetId: string;
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  adminNotes?: string;
  reporterId: string;
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  resolvedById?: string;
  resolvedBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const moderationApi = {
  // Reports
  getReports: async (params?: { type?: string; status?: string }) => {
    const response = await api.get<Report[]>('/admin/reports', { params });
    return response.data;
  },

  updateReportStatus: async (id: string, data: { status: string; adminNotes?: string }) => {
    const response = await api.patch<Report>(`/admin/reports/${id}/status`, data);
    return response.data;
  },

  // User Moderation
  banUser: async (userId: string, data: { reason: string; expiresAt?: string }) => {
    const response = await api.post(`/admin/users/${userId}/ban`, data);
    return response.data;
  },

  unbanUser: async (userId: string) => {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response.data;
  },

  // Question Moderation
  updateQuestionStatus: async (id: string, status: string) => {
    const response = await api.patch(`/admin/questions/${id}/status`, { status });
    return response.data;
  },

  // User Submission
  submitReport: async (data: { type: string; targetId: string; reason: string }) => {
    const response = await api.post('/reports', data);
    return response.data;
  }
};
