"use client";

import api from '@/lib/api';
import { IconBell as Bell, IconCalendar as Calendar, IconClock as Clock, IconCheck as Check, IconX as X, IconMessage as MessageSquare, IconUser as User, IconDotsVertical as MoreVertical, IconChevronRight as ChevronRight, IconFilter as Filter, IconSearch as Search, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

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
    <main className="min-h-screen bg-gray-50 pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <MotionRise className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-2">
              Class <span className="text-blue">Requests</span>
            </h1>
            <p className="text-gray-600">Manage incoming booking requests from students and schools.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search requests..." className="w-full md:w-64 bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none focus:border-blue transition-all shadow-sm" />
             </div>
             <button className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-all shadow-sm">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </MotionRise>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
             <p className="text-gray-900 font-bold">Loading requests...</p>
           </div>
        ) : (
          <MotionStagger className="space-y-6">
             {requests.length > 0 ? requests.map((req) => (
                <div key={req.id} className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                   <div className="flex flex-col lg:flex-row justify-between gap-8">
                      <div className="flex gap-6">
                         <div className="w-20 h-20 rounded-3xl bg-navy flex items-center justify-center text-white text-3xl font-black shadow-md">
                            {req.student?.[0] || 'S'}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-2xl font-display font-bold text-gray-900">{req.student}</h3>
                               <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue/10 text-blue">
                                  {req.status}
                               </span>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                               <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{req.subject}</span>
                               <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Level</span>
                               <span className="px-3 py-1 rounded-full bg-green/20 border border-green/30 text-[10px] font-bold text-navy uppercase tracking-widest">{req.price}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                               <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" /> {req.date}
                               </div>
                               <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> {req.time}
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-4 lg:self-center">
                         <button className="w-full md:w-auto px-6 py-4 rounded-2xl bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm hover:text-gray-900 hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" /> MESSAGE
                         </button>
                         <div className="flex gap-2 w-full md:w-auto">
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Cancelled')}
                              disabled={updatingId === req.id}
                              className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                               {updatingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} DECLINE
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'Confirmed')}
                              disabled={updatingId === req.id}
                              className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-green text-navy font-bold text-sm hover:scale-105 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                               {updatingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} ACCEPT
                            </button>
                         </div>
                         <button className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 transition-all">
                            <MoreVertical className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>
             )) : (
               <div className="p-10 text-center rounded-[40px] bg-white border-2 border-dashed border-gray-200">
                 <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <p className="text-gray-900 font-bold">No pending requests</p>
                 <p className="text-sm text-gray-500">You&apos;re all caught up!</p>
               </div>
             )}
          </MotionStagger>
        )}

        {/* Info Banner */}
        <MotionRise delay={0.15} className="mt-16 p-10 rounded-[40px] bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-green/20 flex items-center justify-center text-navy">
                 <Bell className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-xl font-display font-bold text-gray-900 mb-1">Fast Response Bonus</h4>
                 <p className="text-sm text-gray-600 max-w-lg">Tutors who respond to requests within 2 hours are 5x more likely to be featured in the student directory.</p>
              </div>
           </div>
           <button className="px-8 py-4 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
              Notification Settings <ChevronRight className="w-4 h-4" />
           </button>
        </MotionRise>
      </div>
    </main>
  );
}
