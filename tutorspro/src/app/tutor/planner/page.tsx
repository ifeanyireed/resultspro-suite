"use client";

import api from '@/lib/api';
import { IconPlus as Plus, IconFileText as FileText, IconPaperclip as Paperclip, IconCalendar as Calendar, IconCircleCheck as CheckCircle2, IconMoreVertical as MoreVertical, IconChevronRight as ChevronRight, IconBook as BookOpen, IconTarget as Target, IconClock as Clock, IconDeviceFloppy as Save, IconTrash2 as Trash2, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TutorPlanner() {
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [outline, setOutline] = useState('');
  const [duration, setDuration] = useState('60');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/tutor/assignments');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!title || !objective) {
      toast.error('Please fill in title and learning objective');
      return;
    }

    setSaving(true);
    try {
      // Assuming lesson plan = assignment in backend for MVP
      await api.post('/tutor/assignments', {
        title: title,
        description: `Objective: ${objective}\nDuration: ${duration}m\n\nOutline:\n${outline}`,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dummy deadline
        priority: 'Normal'
      });
      toast.success('Plan saved successfully!');
      setTitle('');
      setObjective('');
      setOutline('');
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Lesson <span className="text-green">Planner</span>
            </h1>
            <p className="text-gray-400">Outline objectives, attach resources, and prepare for your sessions.</p>
          </div>
          <button 
            onClick={() => {
               setTitle('New Lesson Plan');
            }}
            className="px-8 py-4 rounded-2xl bg-green-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-green/20"
          >
             <Plus className="w-5 h-5" /> CREATE NEW PLAN
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Planner Form (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-8">
               <div className="flex justify-between items-center border-b border-white/5 pb-8 mb-8">
                  <div className="flex items-center gap-4 w-full">
                     <div className="w-12 h-12 rounded-xl bg-green/10 text-green flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <input 
                          type="text" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Lesson Title (e.g. Intro to Calculus)" 
                          className="w-full bg-transparent text-xl font-bold text-white focus:outline-none placeholder:text-gray-600"
                        />
                     </div>
                  </div>
                  <div className="flex gap-3 shrink-0 ml-4">
                     <button 
                       onClick={() => { setTitle(''); setObjective(''); setOutline(''); }}
                       className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
                     >
                       <Trash2 size={18} />
                     </button>
                     <button 
                       onClick={handleSavePlan}
                       disabled={saving}
                       className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                     >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />} 
                        SAVE PLAN
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Learning Objective</label>
                     <div className="relative">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                          type="text" 
                          value={objective}
                          onChange={(e) => setObjective(e.target.value)}
                          placeholder="Understand derivatives..." 
                          className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-green/50 transition-all" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Duration (min)</label>
                     <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                          type="number" 
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-green/50 transition-all" 
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Lesson Outline</label>
                  <textarea 
                    rows={8} 
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    className="w-full bg-navy border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-green/50 transition-all resize-none leading-relaxed"
                    placeholder="1. Introduction to rates of change&#10;2. Graphical representation of tangents&#10;3. The power rule derivation&#10;4. Practice problems..."
                  ></textarea>
               </div>

               <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Attached Resources</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <button className="p-4 rounded-2xl border-2 border-dashed border-white/5 text-gray-600 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs font-bold">
                        <Plus size={14} /> ATTACH FILE
                     </button>
                  </div>
               </div>
            </section>
          </div>

          {/* Sidebar - Recent Plans (Right) */}
          <div className="space-y-8">
            <section>
               <h2 className="text-2xl font-display font-bold text-white mb-6">Recent Plans</h2>
               
               {loading ? (
                  <div className="flex justify-center py-10 opacity-50">
                     <Loader2 className="w-8 h-8 text-green animate-spin" />
                  </div>
               ) : (
                  <div className="space-y-4">
                     {plans.map((plan: any) => (
                       <div key={plan.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-4">
                             <h3 className="font-bold text-white group-hover:text-green transition-colors line-clamp-1">{plan.title}</h3>
                             <span className={`shrink-0 ml-2 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                plan.status === 'Ready' ? 'bg-green/10 text-green' : 'bg-white/5 text-gray-500'
                             }`}>
                                {plan.priority || 'Draft'}
                             </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-600 font-black uppercase tracking-tighter mt-4">
                             <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {new Date(plan.createdAt).toLocaleDateString()}
                             </div>
                             <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                       </div>
                     ))}
                     {plans.length === 0 && (
                        <div className="text-center py-10 opacity-50 border-2 border-dashed border-white/5 rounded-3xl">
                           <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                           <p className="text-gray-400 text-sm">No plans created yet.</p>
                        </div>
                     )}
                  </div>
               )}
            </section>

            <section className="p-8 rounded-[40px] bg-gradient-to-br from-green/20 to-transparent border border-white/10">
               <div className="w-12 h-12 rounded-2xl bg-green/10 text-green flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-display font-bold text-white mb-2">Lesson Templates</h3>
               <p className="text-sm text-gray-400 mb-6 leading-relaxed">Save time by using our subject-specific templates for math, science, and languages.</p>
               <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                  Browse Templates
               </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
