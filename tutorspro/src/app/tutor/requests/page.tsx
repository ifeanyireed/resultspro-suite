"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  MessageSquare, 
  User, 
  MoreVertical,
  ChevronRight,
  Filter,
  Search,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TutorRequests() {
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/tutor/bookings');
      // Filter for Pending requests
      setRequests(res.data.filter((b: any) => b.status === 'Pending'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      await api.post('/tutor/bookings/status', {
        booking_id: bookingId,
        status: newStatus
      });
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update booking`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Class <span className="text-green">Requests</span>
            </h1>
            <p className="text-gray-400">Manage incoming booking requests from students and schools.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search requests..." className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-green/50 transition-all" />
             </div>
             <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
             <p className="text-white font-bold">Loading requests...</p>
           </div>
        ) : (
          <div className="space-y-6">
             {requests.length > 0 ? requests.map((req) => (
                <div key={req.id} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group">
                   <div className="flex flex-col lg:flex-row justify-between gap-8">
                      <div className="flex gap-6">
                         <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green to-blue flex items-center justify-center text-navy text-3xl font-black shadow-xl">
                            {req.student?.[0] || 'S'}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-2xl font-display font-bold text-white">{req.student}</h3>
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber/10 text-amber`}>
                                  {req.status}
                               </span>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                               <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{req.subject}</span>
                               <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Level</span>
                               <span className="px-3 py-1 rounded-full bg-green/10 border border-green/20 text-[10px] font-bold text-green uppercase tracking-widest">{req.price}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                               <div className="flex items-center gap-2">
                                  <CalendarIcon className="w-4 h-4" /> {req.date}
                               </div>
                               <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> {req.time}
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-4 lg:self-center">
                         <button className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-sm hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" /> MESSAGE
                         </button>
                         <div className="flex gap-2 w-full md:w-auto">
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Cancelled')}
                              disabled={updatingId === req.id}
                              className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-red-400 font-bold text-sm hover:bg-red-400/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                               {updatingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} DECLINE
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Confirmed')}
                              disabled={updatingId === req.id}
                              className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-green text-navy font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-green/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                               {updatingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} ACCEPT
                            </button>
                         </div>
                         <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-600 hover:text-white transition-all">
                            <MoreVertical className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>
             )) : (
               <div className="p-10 text-center rounded-[40px] border-2 border-dashed border-white/10 opacity-60">
                 <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                 <p className="text-white font-bold">No pending requests</p>
                 <p className="text-sm text-gray-400">You're all caught up!</p>
               </div>
             )}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-16 p-10 rounded-[40px] bg-gradient-to-br from-green/20 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-green/10 flex items-center justify-center text-green">
                 <Bell className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-xl font-display font-bold text-white mb-1">Fast Response Bonus</h4>
                 <p className="text-sm text-gray-500 max-w-lg">Tutors who respond to requests within 2 hours are 5x more likely to be featured in the student directory.</p>
              </div>
           </div>
           <button className="px-8 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2">
              Notification Settings <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </main>
  );
}
