"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Trophy, 
  Settings, 
  ChevronRight,
  MoreVertical,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const ICON_MAP: Record<string, any> = {
  class: { icon: Calendar, color: 'text-blue', bg: 'bg-blue/10' },
  billing: { icon: CreditCard, color: 'text-green', bg: 'bg-green/10' },
  milestone: { icon: Trophy, color: 'text-amber', bg: 'bg-amber/10' },
  message: { icon: MessageSquare, color: 'text-purple', bg: 'bg-purple/10' },
  default: { icon: Bell, color: 'text-gray-400', bg: 'bg-white/5' }
};

export default function ParentNotifications() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/parent/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/parent/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted) return null;

  const filteredNotifications = notifications.filter(n => filter === 'all' || n.type === filter);

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Alert <span className="text-blue">Inbox</span>
            </h1>
            <p className="text-gray-400">Stay updated on your children's progress and platform events.</p>
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-sm text-gray-500 font-bold hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
           {['all', 'class', 'billing', 'milestone', 'message'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                   filter === t ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                }`}
              >
                 {t}
              </button>
           ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-50">
            <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
            <p className="text-white font-bold">Checking alerts...</p>
          </div>
        ) : (
          <div className="space-y-4">
             {filteredNotifications.map((n) => {
                const config = ICON_MAP[n.type] || ICON_MAP.default;
                const Icon = config.icon;
                return (
                  <div 
                    key={n.id}
                    className={`p-6 rounded-[32px] border transition-all flex gap-6 items-start group relative ${
                       n.read ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/5 border-white/10 shadow-xl'
                    }`}
                  >
                     {!n.read && (
                       <div className="absolute top-8 left-2 w-1.5 h-1.5 rounded-full bg-blue" />
                     )}
                     <div className={`w-14 h-14 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                           <h3 className={`font-bold transition-colors ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.title}</h3>
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter shrink-0 ml-4">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">{n.desc}</p>
                        <div className="flex items-center justify-between">
                           <button className="text-[10px] font-black text-blue uppercase tracking-widest flex items-center gap-1 hover:underline">
                              View Details <ChevronRight className="w-3 h-3" />
                           </button>
                           <button className="p-2 rounded-lg bg-white/5 text-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                );
             })}
             {filteredNotifications.length === 0 && (
                <div className="py-20 text-center rounded-[40px] border-2 border-dashed border-white/5">
                   <Bell className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                   <p className="text-gray-500 font-bold">Your inbox is empty.</p>
                </div>
             )}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-16 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 text-center">
           <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-6">Need to change your alert preferences?</p>
           <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2 mx-auto">
              <Settings className="w-4 h-4" /> NOTIFICATION SETTINGS
           </button>
        </div>
      </div>
    </main>
  );
}
