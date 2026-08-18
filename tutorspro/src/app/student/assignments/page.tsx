"use client";

import Navbar from '@/components/Navbar';
import { IconFileText as FileText, IconClock as Clock, IconCheckCircle2 as CheckCircle2, IconAlertCircle as AlertCircle, IconChevronRight as ChevronRight, IconUpload as Upload, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { RoleGate } from '@/components/RoleGate';

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/student/assignments');
        setAssignments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch assignments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </main>
    );
  }

  const completedCount = assignments.filter(a => a.status === 'Submitted').length;

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                   My <span className="text-green">Assignments</span>
                </h1>
                <p className="text-gray-400">Track and submit your tutor-assigned homework.</p>
             </div>
             <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green" />
                <div className="text-sm font-bold text-white">{completedCount} Completed</div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-4">
                {assignments.length > 0 ? assignments.map(item => (
                  <div key={item.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all group">
                     <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex gap-6">
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                             item.status === 'Submitted' ? 'bg-green/10 text-green' : 'bg-blue/10 text-blue'
                           }`}>
                              <FileText className="w-8 h-8" />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                 {item.priority === 'High' && (
                                   <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[8px] font-bold uppercase tracking-widest">Urgent</span>
                                 )}
                              </div>
                              <div className="text-sm text-gray-500 mb-4">Assigned by {item.tutor}</div>
                              <div className="flex items-center gap-4 text-xs">
                                 <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-3.5 h-3.5 text-amber" />
                                    Deadline: {item.deadline}
                                 </div>
                                 <div className={`flex items-center gap-2 font-bold ${
                                   item.status === 'Submitted' ? 'text-green' : 'text-blue'
                                 }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Submitted' ? 'bg-green' : 'bg-blue'}`} />
                                    {item.status}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center">
                           {item.status === 'Submitted' ? (
                             <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs font-bold hover:text-white transition-all">
                                View Submission
                             </button>
                           ) : (
                             <button className="px-6 py-3 rounded-xl bg-green text-navy font-bold text-xs flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all">
                                <Upload className="w-4 h-4" /> Submit Now
                             </button>
                           )}
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="p-16 rounded-[40px] bg-white/5 border border-dashed border-white/10 text-center">
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No assignments found</p>
                  </div>
                )}
             </div>

             <div className="space-y-6">
                <section className="p-8 rounded-[40px] bg-gradient-to-br from-blue/20 to-transparent border border-white/10">
                   <h3 className="text-xl font-display font-bold text-white mb-4">Submission Guide</h3>
                   <p className="text-sm text-gray-400 leading-relaxed mb-6">
                      Ensure your files are in PDF or JPEG format. Max size 20MB per file. 
                      Tutors will review within 48 hours.
                   </p>
                   <ul className="space-y-3">
                      {['Read brief carefully', 'Attach all resources', 'Add comments for tutor'].map(t => (
                        <li key={t} className="text-xs text-gray-500 flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5 text-green" /> {t}
                        </li>
                      ))}
                   </ul>
                </section>

                <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                   <h3 className="text-xl font-display font-bold text-white mb-4">Recent Feedback</h3>
                   <div className="p-4 rounded-2xl bg-navy/50 border border-white/5">
                      <div className="text-xs font-bold text-white mb-1">Algebra Quiz Re-run</div>
                      <p className="text-[10px] text-gray-500 line-clamp-2 italic">&quot;Great improvement on quadratic equations. Watch your signs in step 3...&quot;</p>
                      <div className="mt-3 text-[8px] font-bold text-green uppercase tracking-widest">Score: 92%</div>
                   </div>
                </section>
             </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
