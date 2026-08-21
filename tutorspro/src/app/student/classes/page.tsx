"use client";

import Navbar from '@/components/Navbar';
import { IconCalendar as Calendar, IconClock as Clock, IconBook as BookOpen, IconPlay as Play, IconChevronRight as ChevronRight, IconMapPin as MapPin, IconVideo as Video, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { RoleGate } from '@/components/RoleGate';

export default function StudentClasses() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDay = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.get('/student/schedule');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch schedule");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  const classes = data?.classes || [];
  const goals = data?.goals || { current: 0, total: 0 };

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'SCHOOL_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-12">
             My <span className="text-blue">Schedule</span>
          </h1>

          {/* Weekly Calendar Strip */}
          <div className="flex justify-between items-center mb-12 p-6 rounded-3xl bg-white/5 border border-white/10 overflow-x-auto gap-4 scrollbar-hide">
             {weekDays.map((day, i) => (
               <div key={day} className={`flex flex-col items-center min-w-[60px] p-4 rounded-2xl transition-all ${
                 i === currentDay ? 'bg-blue text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
               }`}>
                  <span className="text-[10px] uppercase font-bold tracking-widest mb-1">{day}</span>
                  <span className="text-xl font-display font-bold">{new Date().getDate() + (i - currentDay)}</span>
                  {i === currentDay && <div className="w-1 h-1 rounded-full bg-white mt-2" />}
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Classes List */}
             <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-display font-bold text-white mb-6">Upcoming Sessions</h2>
                {classes.length > 0 ? classes.map((cls: any) => (
                  <div key={cls.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all group">
                     <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-blue/20 flex items-center justify-center text-blue shrink-0">
                              <BookOpen className="w-8 h-8" />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="text-xl font-bold text-white">{cls.subject}</h3>
                                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                                   cls.status === 'Live' ? 'bg-green/10 text-green animate-pulse' : 'bg-white/5 text-gray-500'
                                 }`}>
                                   {cls.status}
                                 </span>
                              </div>
                              <div className="text-sm text-gray-400 mb-4">Tutor: {cls.tutor} • {cls.type}</div>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                 <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-amber" /> {cls.time}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Video className="w-3 h-3 text-blue" /> HD Interactive Room
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center">
                           <button className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                             cls.status === 'Live' ? 'bg-green-600 text-white hover:shadow-[0_0_20px_rgba(0,200,83,0.4)]' : 'bg-white/5 text-gray-500 border border-white/10'
                           }`}>
                              <Play className="w-4 h-4 fill-current" />
                              {cls.status === 'Live' ? 'Join Now' : 'Enter Room'}
                           </button>
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="p-16 rounded-[40px] bg-white/5 border border-dashed border-white/10 text-center">
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No upcoming sessions found</p>
                  </div>
                )}
             </div>

             {/* Quick Actions / Sidebar */}
             <div className="space-y-6">
                <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                   <h3 className="text-xl font-display font-bold text-white mb-6">Learning Goal</h3>
                   <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-black text-white">{goals.current} / {goals.total}</span>
                      <span className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-widest">Sessions</span>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-blue rounded-full" style={{ width: `${(goals.current / goals.total) * 100}%` }} />
                   </div>
                   <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      You are {goals.total - goals.current} sessions away from your weekly goal. Keep going!
                   </p>
                   <button className="w-full py-4 rounded-xl border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-all">
                      Edit Goals
                   </button>
                </section>

                <section className="p-6 rounded-3xl bg-gradient-to-br from-amber/20 to-transparent border border-white/10">
                   <h4 className="text-sm font-bold text-white mb-4">Next Up</h4>
                   <div className="p-4 rounded-2xl bg-navy/50 border border-white/5">
                      <div className="text-white font-bold text-xs mb-1">
                         {classes.length > 0 ? classes[0].subject : 'No session soon'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                         {classes.length > 0 ? `Starts at ${classes[0].time}` : 'Check back later'}
                      </div>
                   </div>
                </section>
             </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
