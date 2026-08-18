"use client";

import Navbar from '@/components/Navbar';
import { Brain, Trophy, ChevronRight, Play, Clock, Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { RoleGate } from '@/components/RoleGate';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/student/quizzes');
        setQuizzes(res.data || []);
      } catch (err) {
        console.error("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-purple animate-spin" />
      </main>
    );
  }

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'SCHOOL_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* ... rest of header ... */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                   Quiz <span className="text-purple">Arena</span>
                </h1>
                <p className="text-gray-400">Test your knowledge and earn mastery XP.</p>
             </div>
             <div className="flex gap-4">
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                   <Trophy className="w-5 h-5 text-amber" />
                   <div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Total XP</div>
                      <div className="text-sm font-bold text-white">4,250 XP</div>
                   </div>
                </div>
             </div>
          </div>

          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz, i) => (
                <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all relative group overflow-hidden">
                   {quiz.status === 'Completed' && (
                     <div className="absolute top-0 right-0 p-6">
                        <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center text-green font-black text-xs">
                           {quiz.score}
                        </div>
                     </div>
                   )}
                   
                   <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center text-purple mb-6">
                      <Brain className="w-7 h-7" />
                   </div>
                   
                   <h3 className="text-xl font-display font-bold text-white mb-1">{quiz.title}</h3>
                   <div className="text-xs text-gray-500 mb-6 uppercase tracking-widest font-bold">{quiz.subject}</div>

                   <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                         <Sparkles className="w-3.5 h-3.5 text-blue" />
                         {quiz.questions} Qs
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                         <Clock className="w-3.5 h-3.5 text-amber" />
                         {quiz.time}
                      </div>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        quiz.difficulty === 'Easy' ? 'bg-green/10 text-green' : quiz.difficulty === 'Medium' ? 'bg-blue/10 text-blue' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {quiz.difficulty}
                      </div>
                   </div>

                   <button className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                     quiz.status === 'Completed' ? 'bg-white/5 text-gray-500' : 'bg-purple text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                   }`}>
                      <Play className="w-4 h-4 fill-current" />
                      {quiz.status === 'Completed' ? 'Retake Quiz' : 'Start Quiz'}
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
               <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No quizzes available for your subjects</p>
            </div>
          )}
        </div>
      </main>
    </RoleGate>
  );
}
