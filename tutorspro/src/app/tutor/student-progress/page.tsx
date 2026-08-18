"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { IconUsers as Users, IconSearch as Search, IconFilter as Filter, IconChevronRight as ChevronRight, IconBrain as Brain, IconCheckCircle2 as CheckCircle2, IconClock as Clock, IconTrendingUp as TrendingUp, IconMessageSquare as MessageSquare, IconBarChart3 as BarChart3, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TutorStudentProgress() {
  const [mounted, setMounted] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const res = await api.get('/tutor/student-progress');
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load student progress');
    } finally {
      setLoading(false);
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
              Student <span className="text-green">Analytics</span>
            </h1>
            <p className="text-gray-400">Track performance, mastery levels, and engagement across all your students.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search students..." className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-green/50 transition-all" />
             </div>
             <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
             <p className="text-white font-bold">Loading student analytics...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
             {/* Summary Sidebar */}
             <div className="space-y-6">
                {[
                  { label: 'Avg Mastery', value: '84%', icon: Brain, color: 'text-purple', bg: 'bg-purple/10' },
                  { label: 'Avg Attendance', value: '96%', icon: Clock, color: 'text-blue', bg: 'bg-blue/10' },
                  { label: 'Completion', value: '88%', icon: CheckCircle2, color: 'text-green', bg: 'bg-green/10' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-[32px] bg-white/5 border border-white/10">
                     <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                        <stat.icon className="w-5 h-5" />
                     </div>
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                     <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                  </div>
                ))}
                
                <section className="p-8 rounded-[40px] bg-gradient-to-br from-green/20 to-transparent border border-white/10 mt-6">
                   <TrendingUp className="w-8 h-8 text-green mb-4" />
                   <h3 className="text-lg font-bold text-white mb-2">Teaching Insight</h3>
                   <p className="text-xs text-gray-500 leading-relaxed">Your students' scores in Mathematics have increased by 12% since you started using interactive flashcards.</p>
                </section>
             </div>

             {/* Student List */}
             <div className="lg:col-span-3 space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="p-6 md:p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group">
                     <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white text-xl font-black shadow-xl shrink-0">
                              {student.name?.[0] || 'S'}
                           </div>
                           <div>
                              <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-green transition-colors">{student.name}</h3>
                              <div className="flex flex-wrap gap-3 mb-4">
                                 <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{student.grade}</span>
                                 <span className="px-3 py-0.5 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-bold text-blue uppercase tracking-widest">{student.subject}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                 <span>Last session: {student.lastSession}</span>
                                 <span className="w-1 h-1 rounded-full bg-white/10" />
                                 <span>Attendance: {student.attendance}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 md:justify-end flex-1">
                           <div className="flex-1 max-w-[120px]">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                                 <span className="text-gray-500">Mastery</span>
                                 <span className="text-white">{student.mastery}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-green rounded-full shadow-[0_0_10px_rgba(0,200,83,0.3)]" style={{ width: `${student.mastery}%` }} />
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-white transition-all">
                                 <MessageSquare size={18} />
                              </button>
                              <button className="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2">
                                 DETAILS <ChevronRight size={14} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
                {students.length === 0 && (
                   <div className="p-10 text-center rounded-[40px] border-2 border-dashed border-white/10 opacity-60">
                     <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                     <p className="text-white font-bold">No students found</p>
                     <p className="text-sm text-gray-400">You don't have any students assigned yet.</p>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>
    </main>
  );
}
