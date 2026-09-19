"use client";

import { IconCalendar as Calendar, IconClock as Clock, IconBook as BookOpen, IconPlayerPlay as Play, IconChevronRight as ChevronRight, IconMapPin as MapPin, IconVideo as Video, IconLoader2 as Loader2 } from '@tabler/icons-react';
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#146ef5] animate-spin" />
      </main>
    );
  }

  const classes = data?.classes || [];
  const goals = data?.goals || { current: 0, total: 0 };

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'SCHOOL_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-gray-50 pb-24">
                
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
             My Schedule
          </h1>

          {/* Weekly Calendar Strip */}
          <div className="flex justify-between items-center mb-8 p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm overflow-x-auto gap-4 scrollbar-hide">
             {weekDays.map((day, i) => (
               <div key={day} className={`flex flex-col items-center min-w-[60px] p-4 rounded-xl transition-all ${
                 i === currentDay ? 'bg-[#146ef5] text-white shadow-md shadow-[#146ef5]/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
               }`}>
                  <span className="text-[10px] uppercase font-bold tracking-widest mb-1">{day}</span>
                  <span className="text-xl font-bold">{new Date().getDate() + (i - currentDay)}</span>
                  {i === currentDay && <div className="w-1 h-1 rounded-full bg-white mt-2" />}
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Classes List */}
             <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-normal text-gray-900 mb-4">Upcoming Sessions</h2>
                {classes.length > 0 ? classes.map((cls: any) => (
                  <div key={cls.id} className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                     <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex gap-4">
                           <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-[#146ef5] shrink-0">
                              <BookOpen className="w-6 h-6" />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="text-lg font-semibold text-gray-900">{cls.subject}</h3>
                                 <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                                   cls.status === 'Live' ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-gray-100 text-gray-500'
                                 }`}>
                                   {cls.status}
                                 </span>
                              </div>
                              <div className="text-sm text-gray-500 mb-3">Tutor: <span className="font-medium text-gray-700">{cls.tutor}</span> • {cls.type}</div>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                 <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-amber-500" /> {cls.time}
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <Video className="w-4 h-4 text-[#146ef5]" /> HD Interactive Room
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center">
                           <button className={`w-full md:w-auto px-6 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                             cls.status === 'Live' ? 'bg-[#146ef5] text-white hover:bg-[#105bd1] shadow-sm shadow-[#146ef5]/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                           }`}>
                              <Play className="w-4 h-4" />
                              {cls.status === 'Live' ? 'Join Now' : 'Enter Room'}
                           </button>
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="p-12 rounded-[1.5rem] bg-white border border-dashed border-gray-200 text-center flex items-center justify-center">
                     <p className="text-gray-500 font-medium text-sm">No upcoming sessions found</p>
                  </div>
                )}
             </div>

             {/* Quick Actions / Sidebar */}
             <div className="space-y-6">
                <section className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm">
                   <h3 className="text-xl font-normal text-gray-900 mb-6">Learning Goal</h3>
                   <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-light tracking-tight text-gray-900">{goals.current} / {goals.total}</span>
                      <span className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-widest">Sessions</span>
                   </div>
                   <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-[#146ef5] rounded-full" style={{ width: `${(goals.current / goals.total) * 100}%` }} />
                   </div>
                   <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      You are <span className="font-medium text-gray-700">{goals.total - goals.current} sessions</span> away from your weekly goal. Keep going!
                   </p>
                   <button className="w-full py-3 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
                      Edit Goals
                   </button>
                </section>

                <section className="p-6 rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-orange-50/20 border border-orange-100 shadow-sm">
                   <h4 className="text-sm font-semibold text-gray-900 mb-4">Next Up</h4>
                   <div className="p-4 rounded-xl bg-white border border-orange-100 shadow-sm">
                      <div className="text-gray-900 font-semibold text-sm mb-1">
                         {classes.length > 0 ? classes[0].subject : 'No session soon'}
                      </div>
                      <div className="text-xs text-gray-500">
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
