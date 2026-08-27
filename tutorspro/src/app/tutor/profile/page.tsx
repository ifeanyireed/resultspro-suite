"use client";

import api from '@/lib/api';
import { IconCamera as Camera, IconUser as User, IconBook as BookOpen, IconBolt as Zap, IconGlobe as Globe, IconDollarSign as DollarSign, IconShieldCheck as ShieldCheck, IconChevronRight as ChevronRight, IconPlus as Plus, IconTrash2 as Trash2, IconDeviceFloppy as Save, IconCheck as Check, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

export default function TutorProfileEditor() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user) {
      setHourlyRate(user.hourlyRate?.toString() || '');
      setBio(user.bio || '');
      try {
        if (user.subjects_json) {
          setSubjects(JSON.parse(user.subjects_json));
        }
      } catch (e) {
        console.error('Failed to parse subjects');
      }
    }
  }, [user]);

  if (!mounted) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/tutor/onboarding', {
        bio: bio,
        hourly_rate: parseInt(hourlyRate) || 0,
        subjects_json: JSON.stringify(subjects)
      });
      toast.success('Profile updated successfully');
      // In a real app, you might want to refresh the user context here
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  return (
    <main className="min-h-screen bg-navy pb-24">
            
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Public <span className="text-green">Profile</span>
            </h1>
            <p className="text-gray-400">Manage how students and parents see you in the directory.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                Preview Profile
             </button>
             <button 
               onClick={handleSave}
               disabled={loading}
               className="px-8 py-3 rounded-2xl bg-green-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-green/20 disabled:opacity-50"
             >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
                SAVE CHANGES
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Sidebar - Avatar and Verification */}
           <div className="space-y-8">
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center text-center relative overflow-hidden">
                 <div className="relative group mb-6">
                    <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-green to-blue flex items-center justify-center text-navy text-4xl font-black shadow-2xl">
                       {user?.full_name?.[0] || 'T'}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-navy border border-white/10 text-white shadow-xl hover:scale-110 transition-all">
                       <Camera className="w-5 h-5" />
                    </button>
                 </div>
                 <h3 className="text-xl font-display font-bold text-white mb-1">{user?.full_name || 'Tutor Name'}</h3>
                 {user?.isVerified && (
                   <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-[10px] font-bold text-green uppercase tracking-widest mb-6">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED TUTOR
                   </div>
                 )}
                 <p className="text-xs text-gray-500 leading-relaxed">Ensure your profile represents you well.</p>
              </div>

              <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                 <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Profile Completion</h4>
                 <div className="space-y-4">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                       <div className="w-[85%] h-full bg-green rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                       <span className="text-green">85% Complete</span>
                       <span className="text-gray-600">Level 2</span>
                    </div>
                    <ul className="space-y-3 pt-4">
                       {[
                         { text: 'Professional Bio', done: !!bio },
                         { text: 'Sample Lesson Video', done: false },
                         { text: 'Language Proficiency', done: true },
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs text-gray-400">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-green/20 text-green' : 'bg-white/5 text-gray-600'}`}>
                               <Check size={10} strokeWidth={4} />
                            </div>
                            {item.text}
                         </li>
                       ))}
                    </ul>
                 </div>
              </section>
           </div>

           {/* Main Content - Form */}
           <div className="lg:col-span-2 space-y-10">
              <section className="space-y-8 p-10 rounded-[40px] bg-white/[0.02] border border-white/5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Hourly Rate (₦)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type="number" 
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-green/50 transition-all" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Years of Experience</label>
                       <input type="number" defaultValue="5" className="w-full bg-navy border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-green/50 transition-all" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Professional Bio</label>
                    <textarea 
                      rows={6} 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-navy border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-green/50 transition-all resize-none leading-relaxed"
                      placeholder="Passionate Mathematics tutor with over 5 years of experience..."
                    ></textarea>
                 </div>

                 <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">My Subjects</label>
                    <div className="flex flex-wrap gap-3 mb-2">
                       {subjects.map(sub => (
                         <div key={sub} className="px-5 py-2 rounded-xl bg-green/10 border border-green/20 text-xs font-bold text-green flex items-center gap-3">
                            {sub}
                            <button onClick={() => handleRemoveSubject(sub)} className="hover:text-white transition-colors"><Trash2 size={14} /></button>
                         </div>
                       ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="e.g. Calculus" 
                        className="bg-navy border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-green/50"
                      />
                      <button onClick={handleAddSubject} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-500 hover:text-white hover:border-white/30 transition-all flex items-center gap-2">
                          <Plus size={14} /> ADD
                      </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Languages</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Globe className="w-4 h-4 text-blue" />
                             <span className="text-sm text-white font-medium">English (Native)</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-600" />
                       </div>
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Globe className="w-4 h-4 text-purple" />
                             <span className="text-sm text-white font-medium">Yoruba (Fluent)</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-600" />
                       </div>
                    </div>
                 </div>
              </section>

              {/* Sample Lesson Video Preview */}
              <section className="p-10 rounded-[40px] bg-navy border border-white/10 relative group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <Zap className="w-5 h-5 text-amber" />
                       <h3 className="text-xl font-display font-bold text-white">Sample Lesson Video</h3>
                    </div>
                    <span className="text-[10px] font-black text-amber uppercase tracking-widest px-3 py-1 bg-amber/10 rounded-full">Missing</span>
                 </div>
                 <p className="text-sm text-gray-500 mb-8 max-w-md">Upload a 2-3 minute video introducing yourself and explaining a simple concept. Tutors with videos get 4x more bookings.</p>
                 <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                    <Camera className="w-4 h-4" /> UPLOAD VIDEO
                 </button>
              </section>
           </div>
        </div>
      </div>
    </main>
  );
}
