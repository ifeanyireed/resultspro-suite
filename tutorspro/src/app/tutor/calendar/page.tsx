"use client";

import api from '@/lib/api';
import { IconCalendar as CalendarIcon, IconClock as Clock, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight, IconPlus as Plus, IconLock as Lock, IconCircleCheck as CheckCircle2, IconRefreshCcw as RefreshCcw, IconSettings as Settings, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TutorCalendar() {
  const [mounted, setMounted] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/tutor/bookings'); // Fetch from tutor endpoint
      
      const formatted = res.data.map((b: any) => ({
        day: b.day,
        time: b.time,
        type: b.status === 'Confirmed' || b.status === 'Pending' ? 'booked' : 'available',
        student: b.student
      }));
      setAvailability(formatted);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  return (
    <main className="min-h-screen bg-navy pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Teaching <span className="text-green">Calendar</span>
            </h1>
            <p className="text-gray-400">Set your availability and manage your class schedule.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                <Settings className="w-4 h-4" /> Recurrence Settings
             </button>
             <button className="px-8 py-3 rounded-2xl bg-green-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-green/20">
                <Plus className="w-5 h-5" /> ADD TIME SLOT
             </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white/5 border border-white/10 p-6 rounded-[32px]">
           <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"><ChevronLeft size={24} /></button>
              <h2 className="text-xl font-display font-bold text-white">May 11 - 17, 2026</h2>
              <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"><ChevronRight size={24} /></button>
           </div>
           
           <div className="flex gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-green" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Available</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-white/10" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Blocked</span>
              </div>
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
             <p className="text-white font-bold">Loading calendar...</p>
           </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                   <thead>
                      <tr>
                         <th className="p-6 border-b border-r border-white/5 bg-navy/50 w-24"></th>
                         {days.map(day => (
                            <th key={day} className="p-6 border-b border-r border-white/5 min-w-[140px]">
                               <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{day}</div>
                               <div className="text-lg font-display font-bold text-white">1{days.indexOf(day) + 1}</div>
                            </th>
                         ))}
                      </tr>
                   </thead>
                   <tbody>
                      {times.map(time => (
                         <tr key={time}>
                            <td className="p-4 border-b border-r border-white/5 text-center">
                               <span className="text-[10px] font-bold text-gray-600">{time}</span>
                            </td>
                            {days.map(day => {
                               const slot = availability.find(a => a.day === day && a.time === time);
                               return (
                                  <td key={day} className="p-2 border-b border-r border-white/5 h-20 group relative">
                                     {slot ? (
                                        <div className={`w-full h-full rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer ${
                                           slot.type === 'booked' 
                                             ? 'bg-blue/20 border border-blue/30 text-blue' 
                                             : 'bg-green/10 border border-green/20 text-green hover:bg-green/20'
                                        }`}>
                                           <div className="text-[10px] font-black uppercase tracking-widest truncate">
                                              {slot.type === 'booked' ? 'BOOKED' : 'AVAILABLE'}
                                           </div>
                                           {slot.student && (
                                              <div className="text-xs font-bold text-white truncate">{slot.student}</div>
                                           )}
                                        </div>
                                     ) : (
                                        <button className="w-full h-full rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/[0.02] flex items-center justify-center text-gray-800 hover:text-gray-600 transition-all">
                                           <Plus size={16} />
                                        </button>
                                     )}
                                  </td>
                               );
                            })}
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* Calendar Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3 text-amber font-bold mb-4">
                 <Lock className="w-4 h-4" /> Personal Time
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                 Use the "Block Time" feature to prevent students from booking during your lunch breaks or personal appointments.
              </p>
           </div>
           <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3 text-blue font-bold mb-4">
                 <RefreshCcw className="w-4 h-4" /> Sync Calendar
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                 Connect your Google or Outlook calendar to automatically block time when you have external events.
              </p>
           </div>
           <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3 text-green font-bold mb-4">
                 <CheckCircle2 className="w-4 h-4" /> 24h Policy
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                 Cancellations within 24 hours of a session are subject to our protection policy to ensure your earnings are secure.
              </p>
           </div>
        </div>
      </div>
    </main>
  );
}
