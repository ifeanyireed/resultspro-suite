"use client";

import Navbar from '@/components/Navbar';
import LoginPromptModal from '@/components/LoginPromptModal';
import { IconSearch as Search, IconChevronRight as ChevronRight, IconTarget as Target, IconFilter as Filter, IconLock as Lock, IconLoader2 as Loader2, IconX as X } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface Exam {
  id: string;
  name: string;
  subjects: number;
  year_range: string;
  isPopular?: boolean;
  isCurated?: boolean;
}

interface Category {
  name: string;
  exams: Exam[];
}

export default function PracticePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Hover Modal States
  const [hoveredExamId, setHoveredExamId] = useState<string | null>(null);
  const [hoveredSubjectIndex, setHoveredSubjectIndex] = useState<number>(0);
  const [hoverDataCache, setHoverDataCache] = useState<Record<string, any>>({});
  const [hoverLoading, setHoverLoading] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Preview States
  const [mobilePreviewExamId, setMobilePreviewExamId] = useState<string | null>(null);
  const [mobileSyllabusSubjectIndex, setMobileSyllabusSubjectIndex] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const fetchExams = async () => {
      try {
        const response = await api.get('/exams');
        // Normalize: Ensure it is an array
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Failed to load examinations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredCategories = (categories || []).map(cat => ({
    ...cat,
    exams: (cat.exams || []).filter(exam =>
      exam.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.exams && cat.exams.length > 0);

  const handleExamClick = useCallback(
    (e: React.MouseEvent, exam: Exam) => {
      if (!isAuthenticated) {
        e.preventDefault();
        
        // On mobile, show the bottom sheet preview first
        if (window.innerWidth < 768) {
          handleMouseEnter(exam.id);
          setMobilePreviewExamId(exam.id);
          setMobileSyllabusSubjectIndex(0);
        } else {
          router.push(`/login?redirect=/practice/${exam.id}`);
        }
      }
    },
    [isAuthenticated, router]
  );

  const handleMouseEnter = async (examId: string) => {
    if (isAuthenticated) return; // Only show heavy preview list for guests
    
    if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
    }
    
    setHoveredExamId(examId);
    setHoveredSubjectIndex(0); // Reset to first subject on new exam hover

    if (hoverDataCache[examId]) return;

    setHoverLoading(true);
    try {
      const res = await api.get(`/exams/${examId}/subjects`);
      setHoverDataCache(prev => ({ ...prev, [examId]: res.data.subjects }));
    } catch (err) {
      console.error("Failed to load hover details", err);
    } finally {
      setHoverLoading(false);
    }
  };

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    
    leaveTimeoutRef.current = setTimeout(() => {
        setHoveredExamId(null);
        leaveTimeoutRef.current = null;
    }, 800); // Using 800ms for a snappy but generous delay (user asked for 1s, I will use 1000ms if requested, trying to keep it fluid)
  };

  // Re-adjusting to Exactly 1s as requested
  const handleMouseLeaveFinal = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    
    leaveTimeoutRef.current = setTimeout(() => {
        setHoveredExamId(null);
        leaveTimeoutRef.current = null;
    }, 1000); 
  };

  const isAuth = mounted ? isAuthenticated : false;

  return (
    <main className="min-h-screen bg-light text-navy">
      <Navbar />

      {/* 30-second login prompt for guests */}
      <LoginPromptModal delayMs={30000} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-navy mb-6">
            Exam Browser
          </h1>

          {/* Guest nudge banner */}
          {!isAuth && (
            <div className="flex items-center gap-3 mb-6 px-5 py-3 rounded-2xl bg-blue/5 border border-blue/20 text-sm">
              <Lock className="w-4 h-4 text-blue shrink-0" />
              <span className="text-gray-600">
                Browse freely — <span className="text-navy font-semibold">sign in to start practising</span> and track your progress.
              </span>
              <Link
                href="/login"
                className="ml-auto shrink-0 px-4 py-1.5 rounded-lg bg-blue text-white text-xs font-bold hover:bg-blue/90 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for an exam (e.g. JAMB, WAEC, SAT)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white shadow-sm border border-nets-border rounded-2xl py-4 pl-12 pr-4 text-navy placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white shadow-sm border border-nets-border text-gray-600 hover:text-navy hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue/20 border-t-blue rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading examination catalog...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-slate-200" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">{cat.name}</h2>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.exams.map((exam, examIdx) => (
                      <div
                        key={exam.id}
                        className={`relative ${hoveredExamId === exam.id ? "z-[200]" : "z-10"}`}
                        onMouseEnter={() => handleMouseEnter(exam.id)}
                        onMouseLeave={handleMouseLeaveFinal}
                      >
                        <Link
                          href={`/practice/${exam.id}`}
                          onClick={(e) => handleExamClick(e, exam as Exam)}
                          className={`block group relative p-8 rounded-[1.5rem] shadow-sm hover:-translate-y-1 transition-transform h-full overflow-hidden bg-gradient-to-br ${examIdx % 2 === 0 ? 'from-[#146ef5] to-[#0a2e70]' : 'from-red-500 to-red-900'}`}
                        >
                          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
                          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20"></div>
                          <div className="flex flex-col h-full relative z-10 justify-center min-h-[160px]">
                            {/* Top right icon */}
                            <div className="absolute top-0 right-0">
                              {!isAuth && (
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                                  <Lock className="w-5 h-5 text-white" />
                                </div>
                              )}
                            </div>

                            <div className="mt-auto pt-8">
                              <h3 className="text-4xl font-display font-bold text-white mb-2">{exam.name}</h3>

                              <div className="flex items-center gap-4 text-sm text-white/80">
                                <div className="flex items-center gap-1.5">
                                  <Target className="w-4 h-4" />
                                  {exam.subjects} Subjects
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                              </div>
                            </div>

                            <div className="mt-8 flex gap-2">
                              {exam.isPopular && (
                                <span className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/30 transition-colors">
                                  Popular
                                </span>
                              )}
                              {exam.isCurated && (
                                <span className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/30 transition-colors">
                                  Curated
                                </span>
                              )}
                              {!isAuth && (
                                <span className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/30 transition-colors flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Login to Practice
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* DESKTOP Hover Tooltip (Boundary Aware) */}
                        {!isAuth && hoveredExamId === exam.id && (
                          <div className="hidden md:block absolute left-1/2 -top-6 -translate-y-full -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto group/tooltip max-w-[calc(100vw-40px)]">
                            <div className="relative p-0 rounded-3xl bg-white/95 border border-white/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex overflow-hidden ring-1 ring-slate-100 h-max min-w-[580px] w-max max-w-[800px]">
                              
                              {/* Left Pane - Subjects */}
                              <div className="w-[240px] border-r border-nets-border p-4 bg-white/50 shrink-0">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2">
                                  Subjects
                                  {hoverLoading && <Loader2 className="w-3 h-3 animate-spin inline-ml-2 float-right" />}
                                </h4>
                                <div className="space-y-1 max-h-[320px] overflow-y-auto no-scrollbar">
                                  {hoverDataCache[exam.id] ? hoverDataCache[exam.id].map((sub: any, idx: number) => (
                                    <div 
                                      key={idx}
                                      onMouseEnter={() => setHoveredSubjectIndex(idx)}
                                      className={`
                                        group/sub p-3 rounded-xl transition-all cursor-default flex items-center justify-between
                                        ${hoveredSubjectIndex === idx ? 'bg-blue/10 text-blue shadow-[inset_0_0_20px_rgba(20,110,245,0.1)]' : 'hover:bg-slate-200 text-gray-400'}
                                      `}
                                    >
                                      <span className="text-xs font-bold truncate pr-2">{sub.name}</span>
                                      <ChevronRight className={`w-3 h-3 transition-transform ${hoveredSubjectIndex === idx ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </div>
                                  )) : !hoverLoading && (
                                    <div className="text-xs text-gray-600 italic py-4 px-2">No subjects</div>
                                  )}
                                </div>
                              </div>

                              {/* Right Pane - Topics */}
                              <div className="flex-1 p-5 min-w-[320px] min-h-[320px] relative max-w-[560px]">
                                {hoverDataCache[exam.id]?.[hoveredSubjectIndex] ? (
                                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between mb-4 gap-6">
                                      <h5 className="text-sm font-bold text-navy truncate max-w-[320px]">
                                        {hoverDataCache[exam.id][hoveredSubjectIndex].name}
                                      </h5>
                                      <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 shrink-0">
                                        {hoverDataCache[exam.id][hoveredSubjectIndex].questions} Qs
                                      </span>
                                    </div>
                                    
                                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar min-w-[300px]">
                                      {hoverDataCache[exam.id][hoveredSubjectIndex].topics?.map((topic: any, i: number) => (
                                        <div key={i} className="group/topic p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-between gap-4">
                                          <div className="flex items-center gap-3 truncate">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-300 group-hover/topic:scale-125 group-hover/topic:bg-blue-500 transition-all" />
                                            <span className="text-xs text-gray-600 truncate font-medium">{topic.name}</span>
                                          </div>
                                          <span className="text-[10px] text-gray-400 font-mono font-bold shrink-0">{topic.questions}</span>
                                        </div>
                                      ))}
                                      {(!hoverDataCache[exam.id][hoveredSubjectIndex].topics || hoverDataCache[exam.id][hoveredSubjectIndex].topics.length === 0) && (
                                        <div className="text-xs text-gray-600 italic py-10 text-center">No topics cataloged</div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-full text-xs text-gray-600 italic">
                                    Select a subject to view topics
                                  </div>
                                )}
                              </div>

                              {/* Tooltip Down Arrow */}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 backdrop-blur-2xl border-b border-r border-white/60 rotate-45 transform" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No examinations found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* MOBILE Bottom Sheet Preview */}
      <AnimatePresence>
        {mobilePreviewExamId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobilePreviewExamId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-navy border-t border-white/10 rounded-t-[32px] z-[101] md:hidden flex flex-col overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center p-4">
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Mobile Content Header */}
              <div className="px-6 pb-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display text-navy">
                    {categories.flatMap(c => c.exams).find(e => e.id === mobilePreviewExamId)?.name}
                  </h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Syllabus Overview</p>
                </div>
                <button 
                  onClick={() => setMobilePreviewExamId(null)}
                  className="p-2 rounded-full bg-slate-200 border border-white/[0.1] border-t-white/[0.15]"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Subject Selector (Horizontal Scroll) */}
                <div className="flex overflow-x-auto no-scrollbar px-6 py-4 gap-3 border-b border-white/5">
                  {hoverDataCache[mobilePreviewExamId!]?.map((sub: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setMobileSyllabusSubjectIndex(idx)}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border
                        ${mobileSyllabusSubjectIndex === idx 
                          ? 'bg-blue/10 text-blue border-green/30' 
                          : 'bg-slate-200 text-gray-500 border-transparent hover:bg-white/10'}
                      `}
                    >
                      {sub.name}
                    </button>
                  ))}
                  {hoverLoading && (
                    <div className="flex items-center gap-2 px-4 py-2">
                      <Loader2 className="w-4 h-4 text-blue animate-spin" />
                      <span className="text-xs text-gray-600">Loading...</span>
                    </div>
                  )}
                </div>

                {/* Topics List (Vertical Scroll) */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                  {hoverDataCache[mobilePreviewExamId!]?.[mobileSyllabusSubjectIndex] ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          {hoverDataCache[mobilePreviewExamId!][mobileSyllabusSubjectIndex].name} • Topics
                        </span>
                        <span className="text-[10px] font-bold text-blue">{hoverDataCache[mobilePreviewExamId!][mobileSyllabusSubjectIndex].questions} Questions</span>
                      </div>
                      
                      {hoverDataCache[mobilePreviewExamId!][mobileSyllabusSubjectIndex].topics?.map((topic: any, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-blue font-mono">{String(i + 1).padStart(2, '0')}</span>
                            <span className="text-sm text-gray-600 font-medium">{topic.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-bold bg-slate-200 px-2 py-0.5 rounded-lg border border-white/[0.05] border-t-white/[0.1] leading-none shrink-0">
                            {topic.questions} Qs
                          </span>
                        </div>
                      ))}

                      {(!hoverDataCache[mobilePreviewExamId!][mobileSyllabusSubjectIndex].topics || 
                        hoverDataCache[mobilePreviewExamId!][mobileSyllabusSubjectIndex].topics.length === 0) && (
                        <div className="py-12 text-center text-xs text-gray-600 italic">No structure available for this subject.</div>
                      )}
                    </div>
                  ) : !hoverLoading && (
                    <div className="py-20 text-center text-gray-600 text-sm italic">Select a subject above to explore topics.</div>
                  )}
                </div>
              </div>

              {/* ACTION CALL: Sign in to practice */}
              <div className="p-6 bg-navy/80 backdrop-blur-md border-t border-white/10">
                <Link 
                  href={`/login?redirect=/practice/${mobilePreviewExamId}`}
                  className="w-full h-14 rounded-2xl bg-blue text-white font-bold flex items-center justify-center gap-2 hover:bg-blue/90 transition-all active:scale-95 text-center"
                >
                  <Lock className="w-5 h-5" />
                  Sign In to Start Practicing
                </Link>
                <p className="text-[10px] text-center text-gray-600 mt-4 font-medium">Join 50,000+ students already smashing their exams. Free to start.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
