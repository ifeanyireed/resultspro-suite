"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { IconSword as Sword, IconTrophy as Trophy, IconCoins as Coins, IconCheckCircle2 as CheckCircle2, IconInfo as Info, IconAlertTriangle as AlertTriangle, IconXCircle as XCircle, IconBell as Bell } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { getNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/notifications.api';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all read", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'battle': return Sword;
      case 'reward': return Coins;
      case 'achievement': return Trophy;
      case 'system': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'battle': return 'red';
      case 'reward': return 'amber';
      case 'achievement': return 'green';
      case 'system': return 'blue';
      case 'warning': return 'amber';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 pt-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-500 text-sm font-medium">Stay updated with your progress and challenges.</p>
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-[10px] font-bold text-green uppercase tracking-widest hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
            <p className="text-gray-500 mt-4 font-bold text-xs uppercase tracking-widest">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/[0.1] border-t-white/[0.15]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">All caught up!</h3>
            <p className="text-gray-500 text-sm">You have no new notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const Icon = getIcon(n.type);
              const color = getColor(n.type);
              return (
                <div 
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                  className={`
                    group p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden
                    ${!n.isRead ? 'bg-white/5 border-white/10 shadow-xl' : 'bg-white/[0.02] border-white/[0.05] border-t-white/[0.1] opacity-70'}
                  `}
                >
                  {!n.isRead && (
                    <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-green shadow-[0_0_10px_rgba(0,200,83,0.5)]" />
                  )}
                  
                  <div className="flex gap-6">
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center shrink-0
                      ${color === 'red' ? 'bg-red-500/10 text-red-500' : 
                        color === 'amber' ? 'bg-amber/10 text-amber' : 
                        color === 'green' ? 'bg-green/10 text-green' : 'bg-blue/10 text-blue'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-white group-hover:text-green transition-colors">{n.title}</h3>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{n.message}</p>
                      
                      {n.type === 'battle' && !n.isRead && (
                        <div className="flex gap-2 mt-4">
                          <Button className="bg-green text-navy hover:bg-green/90 rounded-xl px-6 h-10 text-xs font-bold">Accept Battle</Button>
                          <Button variant="outline" className="border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 rounded-xl px-6 h-10 text-xs font-bold">Decline</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.2em]">End of notifications</p>
          </div>
        )}
      </div>
    </main>
  );
}
