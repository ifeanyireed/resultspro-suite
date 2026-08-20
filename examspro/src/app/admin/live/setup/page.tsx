"use client";

import { useState, useEffect } from 'react';
import { IconSettings as Settings, IconPlus as Plus, IconBook as BookOpen, IconCoins as Coins, IconUsers as Users, IconCalendar as Calendar, IconClock as Clock, IconShieldCheck as ShieldCheck, IconChevronRight as ChevronRight, IconTarget as Target, IconGlobe as Globe, IconLock as Lock, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLiveGameSetup() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [formData, setFormData] = useState({
    examId: '',
    subjectId: '',
    title: '',
    entryFee: 20,
    maxPlayers: 100,
    questionCount: 10
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/admin/exams');
      const examList = Array.isArray(res.data) ? res.data : (res.data?.exams || res.data?.data || []);
      setExams(examList);
      if (examList.length > 0) {
        setFormData(prev => ({ ...prev, examId: examList[0].id.toString() }));
        fetchSubjects(examList[0].id);
      }
    } catch (err) {
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (examId: string | number) => {
   try {
     const res = await api.get(`/exams/${examId}/subjects`);
     // Normalize: backend returns an object { examName: "...", subjects: [...] }
     const subjectList = Array.isArray(res.data) 
       ? res.data 
       : (res.data?.subjects || res.data?.data || []);

     setSubjects(subjectList);
     if (subjectList.length > 0) {
       setFormData(prev => ({ ...prev, subjectId: subjectList[0].id.toString() }));
     }
   } catch (err) {
     toast.error("Failed to load subjects");
   }
  };
  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData(prev => ({ ...prev, examId: id }));
    fetchSubjects(id);
  };

  const handlePublish = async () => {
    if (!formData.subjectId) return toast.error("Please select a subject");
    
    setPublishing(true);
    try {
      const res = await api.post('/live/create', {
        subjectId: parseInt(formData.subjectId),
        entryFee: formData.entryFee,
        maxPlayers: formData.maxPlayers
      });
      toast.success("Room published successfully!");
      router.push(`/admin/live/control?roomId=${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to publish room");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Create Live Game Room" />

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 pb-24 no-scrollbar">
        <div className="flex justify-end gap-4 mb-4">
          <Button variant="outline" className="rounded-xl border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white font-bold text-xs hover:bg-white/10 transition-colors">Save as Template</Button>
          <Button 
            onClick={handlePublish}
            disabled={publishing}
            className="rounded-xl bg-green text-navy hover:bg-green/90 font-bold text-xs gap-2"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            PUBLISH ROOM
          </Button>
        </div>

        {/* Room Basics */}
        <section className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex items-center gap-3 bg-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Room Configuration</h3>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Exam / Category</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select 
                    value={formData.examId}
                    onChange={handleExamChange}
                    className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white outline-none appearance-none focus:border-green transition-colors"
                  >
                    {Array.isArray(exams) && exams.map(exam => (
                      <option key={exam.id} value={exam.id} className="bg-navy">{exam.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subject Focus</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select 
                    value={formData.subjectId}
                    onChange={(e) => setFormData(prev => ({ ...prev, subjectId: e.target.value }))}
                    className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white outline-none appearance-none focus:border-green transition-colors"
                  >
                    {Array.isArray(subjects) && subjects.map(sub => (
                      <option key={sub.id} value={sub.id} className="bg-navy">{sub.name}</option>
                    ))}
                    {(!subjects || subjects.length === 0) && <option className="bg-navy">No subjects found</option>}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Room Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Weekly Mathematics Championship"
                className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-green placeholder:text-gray-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entry Fee</label>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl focus-within:border-green transition-colors">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <input 
                    type="number" 
                    value={formData.entryFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryFee: parseInt(e.target.value) }))}
                    className="bg-transparent font-bold text-white outline-none w-full" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Max Players</label>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl focus-within:border-green transition-colors">
                  <Users className="w-4 h-4 text-blue-400" />
                  <input 
                    type="number" 
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                    className="bg-transparent font-bold text-white outline-none w-full" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Questions</label>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl focus-within:border-green transition-colors">
                  <ShieldCheck className="w-4 h-4 text-green" />
                  <input 
                    type="number" 
                    value={formData.questionCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                    className="bg-transparent font-bold text-white outline-none w-full" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scheduling */}
        <section className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="px-8 py-6 border-b border-white/[0.05] border-t-white/[0.1] flex items-center gap-3 bg-white/5">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="font-display font-bold text-white text-lg">Scheduling</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="date" className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-green transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="time" className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-green transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-green" />
                <h4 className="font-bold text-white">Public Room</h4>
              </div>
              <button className="w-12 h-6 rounded-full bg-green relative">
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Public rooms are visible to all users in the lobby and can be joined by anyone with enough coins.</p>
          </div>

          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] opacity-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-500" />
                <h4 className="font-bold text-white">Private Room</h4>
              </div>
              <button className="w-12 h-6 rounded-full bg-white/10 relative">
                <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full shadow-sm" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Private rooms require a join code. Only users with the link or code can participate.</p>
          </div>
        </div>
      </div>
    </>
  );
}
