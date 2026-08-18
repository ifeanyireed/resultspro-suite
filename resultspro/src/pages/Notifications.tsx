import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Mail, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotifications(15000); // Refresh every 15 seconds
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterRead, setFilterRead] = useState<string>('ALL');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const typeMatch = filterType === 'ALL' || notif.type === filterType;
      const readMatch =
        filterRead === 'ALL' || (filterRead === 'UNREAD' && !notif.isRead) || (filterRead === 'READ' && notif.isRead);
      return typeMatch && readMatch;
    });
  }, [notifications, filterType, filterRead]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await clearAll();
        toast.success('All notifications cleared');
      } catch {
        toast.error('Failed to clear notifications');
      }
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TICKET_CREATED':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'MESSAGE_RECEIVED':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'TICKET_ASSIGNED':
        return <Mail className="w-5 h-5 text-purple-600" />;
      case 'STATUS_CHANGED':
        return <CheckCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TICKET_CREATED':
        return 'New Ticket';
      case 'MESSAGE_RECEIVED':
        return 'Message Received';
      case 'TICKET_ASSIGNED':
        return 'Ticket Assigned';
      case 'STATUS_CHANGED':
        return 'Status Changed';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      {/* Action Bar */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <Button onClick={handleClearAll} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="TICKET_CREATED">New Ticket</option>
                <option value="MESSAGE_RECEIVED">Message Received</option>
                <option value="TICKET_ASSIGNED">Ticket Assigned</option>
                <option value="STATUS_CHANGED">Status Changed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Status</label>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Notifications</option>
                <option value="UNREAD">Unread Only</option>
                <option value="READ">Read Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filterType !== 'ALL' || filterRead !== 'ALL'
              ? `Notifications (${filteredNotifications.length} filtered)`
              : `All Notifications (${notifications.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="md" text="Loading notifications..." />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.isRead
                      ? 'bg-white border-gray-200 opacity-75'
                      : 'bg-blue-50 border-blue-200'
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">{getIconForType(notification.type)}</div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>

                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {notification.ticketId && (
                          <span className="text-blue-600 font-medium">Ticket: {notification.ticketId}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2">
                      {!notification.isRead && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <p className="text-sm text-gray-600 mt-1">Unread</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter((n) => n.isRead).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Read</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {notifications.filter((n) => n.type === 'MESSAGE_RECEIVED').length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Messages</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{notifications.length}</div>
              <p className="text-sm text-gray-600 mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
