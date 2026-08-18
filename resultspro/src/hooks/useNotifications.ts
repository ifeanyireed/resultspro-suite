import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  ticketId?: string;
  createdAt: string;
  actionUrl?: string;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useNotifications = (refreshInterval = 30000): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [notificationsRes, countRes] = await Promise.all([
        axios.get(`${API_BASE}/notifications?limit=50`),
        axios.get(`${API_BASE}/notifications/count/unread`),
      ]);

      setNotifications(notificationsRes.data.data || []);
      setUnreadCount(countRes.data.data.unreadCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await axios.put(`${API_BASE}/notifications/${id}/read`);
        await fetchNotifications();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to mark as read');
        console.error('Failed to mark as read:', err);
      }
    },
    [fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put(`${API_BASE}/notifications/read/all`);
      await fetchNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
      console.error('Failed to mark all as read:', err);
    }
  }, [fetchNotifications]);

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`${API_BASE}/notifications/${id}`);
        await fetchNotifications();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete notification');
        console.error('Failed to delete notification:', err);
      }
    },
    [fetchNotifications]
  );

  const clearAll = useCallback(async () => {
    try {
      await axios.delete(`${API_BASE}/notifications/clear/all`);
      await fetchNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear notifications');
      console.error('Failed to clear notifications:', err);
    }
  }, [fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchNotifications, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchNotifications, refreshInterval]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
};
