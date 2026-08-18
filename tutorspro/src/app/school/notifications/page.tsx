"use client";

import { 
  Bell, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Trash2,
  Mail,
  Send
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getSchoolNotifications, createSchoolNotification } from '@/lib/school.api';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'Success' | 'Warning' | 'Info';
  time: string;
  read: boolean;
}

export default function SchoolNotifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getSchoolNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error("Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    const toastId = toast.loading("Sending announcement...");
    try {
      const response = await createSchoolNotification({});
      toast.success(response.message || "Announcement sent!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to send announcement.", { id: toastId });
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Success': return 'bg-green/10 text-green border-green/20';
      case 'Warning': return 'bg-amber/10 text-amber border-amber/20';
      default: return 'bg-blue/10 text-blue border-blue/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Success': return CheckCircle2;
      case 'Warning': return AlertCircle;
      default: return Info;
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">School Notifications</h1>
            <p className="text-gray-400">Admin alerts, system updates, and tenant-level announcements.</p>
          </div>
          <button 
            onClick={handleCreateNotification}
            className="px-6 py-3 rounded-2xl bg-purple text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all text-sm">
            <Send className="w-5 h-5" /> Send Announcement
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-500 text-center py-10">Loading notifications...</p>
          ) : (
            notifications.map((notif) => {
            const Icon = getTypeIcon(notif.type);
            return (
              <div 
                key={notif.id} 
                className={`p-6 rounded-[32px] border transition-all flex gap-6 group relative ${
                  notif.read ? 'bg-white/[0.01] border-white/5' : 'bg-white/[0.03] border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]'
                }`}
              >
                {!notif.read && <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-purple shadow-[0_0_10px_rgba(168,85,247,1)]" />}
                
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${getTypeStyles(notif.type)}`}>
                   <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold ${notif.read ? 'text-gray-300' : 'text-white'}`}>{notif.title}</h3>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-2xl">{notif.message}</p>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </main>
  );
}
