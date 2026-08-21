"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { IconHistory as History, IconCalendar as Calendar, IconSearch as Search, IconFilter as Filter, IconPlay as Play, IconFileText as FileText, IconMoreVertical as MoreVertical, IconUser as User, IconCircleCheck as CheckCircle2, IconXCircle as XCircle, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ParentHistory() {
  const [mounted, setMounted] = useState(false);
  const [selectedChild, setSelectedChild] = useState('all');
  const [history, setHistory] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, childrenRes] = await Promise.all([
        api.get('/parent/history'),
        api.get('/parent/children')
      ]);
      setHistory(historyRes.data);
      setChildren(childrenRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load lesson history');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const filteredHistory = history.filter(h => selectedChild === 'all' || h.child === selectedChild);

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Lesson <span className="text-blue">History</span>
            </h1>
            <p className="text-gray-400">Review past sessions, attendance, and recordings for all your children.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full md:w-48 bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue/50 transition-all appearance-none"
                >
                   <option value="all">All Children</option>
                   {children.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
             </div>
             <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-50">
            <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
            <p className="text-white font-bold">Loading records...</p>
          </div>
        ) : (
          <>
            <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/5">
                           <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Child / Subject</th>
                           <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tutor</th>
                           <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date & Duration</th>
                           <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                           <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {filteredHistory.map((item) => (
                           <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="text-white font-bold mb-1">{item.subject}</div>
                                 <div className="text-xs text-blue font-medium">{item.child}</div>
                              </td>
                              <td className="px-8 py-6 text-sm text-gray-400">
                                 {item.tutor}
                              </td>
                              <td className="px-8 py-6">
                                 <div className="text-sm text-white font-medium mb-1">{item.date}</div>
                                 <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{item.duration}</div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    item.status === 'Attended' ? 'bg-green/10 text-green' : 'bg-red-400/10 text-red-400'
                                 }`}>
                                    {item.status === 'Attended' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    {item.status}
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex items-center justify-end gap-3">
                                    {item.has_recording && (
                                       <button className="p-3 rounded-xl bg-blue/10 text-blue hover:bg-blue hover:text-white transition-all shadow-lg shadow-blue/5">
                                          <Play className="w-4 h-4 fill-current" />
                                       </button>
                                    )}
                                    <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                                       <FileText className="w-4 h-4" />
                                    </button>
                                    <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                                       <MoreVertical className="w-4 h-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {filteredHistory.length === 0 && (
              <div className="mt-12 py-20 text-center rounded-[40px] border-2 border-dashed border-white/5">
                 <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <History className="w-8 h-8 text-gray-500" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No records found</h3>
                 <p className="text-sm text-gray-500">Try adjusting your filters or checking back later.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
