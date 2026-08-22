import api from './api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'battle' | 'reward' | 'achievement' | 'system';
  isRead: boolean;
  createdAt: string;
  metadata?: string;
}

export interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  type: string;
  route: string;
  target: string;
  targetValue?: string;
  targetExamId?: number;
  isPopup?: boolean;
  displayPages?: string;
  status: string;
  scheduledAt?: string;
  createdAt: string;
}

export interface PopupNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'battle' | 'reward' | 'achievement' | 'system';
  displayPages: string;
  targetExamId?: number;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

export const getNotifications = async () => {
  try {
    const response = await api.get<Notification[]>('notifications');
    return response.data;
  } catch (error: any) {
    // console.warn('Failed to fetch notifications:', error.response?.status, error.message);
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await api.get<{ count: number }>('notifs/unread');
    return response.data.count;
  } catch (error: any) {
    // console.warn('Failed to fetch unread count:', error.response?.status, error.message);
    throw error;
  }
};

export const getActivePopups = async () => {
  try {
    const response = await api.get<PopupNotification[]>('notifs/popups');
    return response.data;
  } catch (error: any) {
    // console.warn('Failed to fetch popups:', error.response?.status, error.message);
    throw error;
  }
};

export const markAsRead = async (id: string) => {
  const response = await api.patch(`notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.post('notifications/read-all');
  return response.data;
};

// Admin Endpoints
export interface NotificationLog {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  route: string;
  status: string;
  error?: string;
  createdAt: string;
}

export const getNotificationLogs = async () => {
  const response = await api.get<NotificationLog[]>('/admin/notifications/logs');
  return response.data;
};

export const getNotificationCampaigns = async () => {
  const response = await api.get<NotificationCampaign[]>('/admin/notifications/campaigns');
  return response.data;
};

export const createCampaign = async (data: Partial<NotificationCampaign>) => {
  const response = await api.post<NotificationCampaign>('/admin/notifications/campaigns', data);
  return response.data;
};

export const getPopups = async () => {
  const response = await api.get<PopupNotification[]>('/admin/notifications/popups');
  return response.data;
};

export const createPopup = async (data: Partial<PopupNotification>) => {
  const response = await api.post<PopupNotification>('/admin/notifications/popups', data);
  return response.data;
};

export const updatePopup = async (id: string, data: Partial<PopupNotification>) => {
  const response = await api.put(`/admin/notifications/popups/${id}`, data);
  return response.data;
};

export const deletePopup = async (id: string) => {
  const response = await api.delete(`/admin/notifications/popups/${id}`);
  return response.data;
};
