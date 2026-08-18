import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, X, CheckCircle, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  ticketId?: string;
  createdAt: string;
  actionUrl?: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }

    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [open]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [notificationsRes, countRes] = await Promise.all([
        axios.get(`${API_BASE}/notifications?limit=10`),
        axios.get(`${API_BASE}/notifications/count/unread`),
      ]);

      setNotifications(notificationsRes.data.data || []);
      setUnreadCount(countRes.data.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await axios.put(`${API_BASE}/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE}/notifications/read/all`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await axios.delete(`${API_BASE}/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-3 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-4 flex justify-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
        ) : (
          notifications.map((notification, idx) => (
            <div key={notification.id}>
              <DropdownMenuItem
                onClick={() =>
                  !notification.isRead && handleMarkAsRead(notification.id)
                }
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {notification.type === 'TICKET_CREATED' && (
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    )}
                    {notification.type === 'MESSAGE_RECEIVED' && (
                      <Bell className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    )}
                    {notification.type === 'STATUS_CHANGED' && (
                      <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </DropdownMenuItem>
              {idx < notifications.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <button className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-2">
                View All Notifications
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
