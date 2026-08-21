"use client";

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoginPromptModal from '@/components/LoginPromptModal';
import { IconArrowLeft as ArrowLeft, IconSearch as Search, IconBook as BookOpen, IconChevronRight as ChevronRight, IconCoins as Coins, IconTrophy as Trophy, IconChartBar as BarChart3, IconLock as Lock, IconBolt as Zap } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface Subject {
  id: string;
  name: string;
  questions: number;
  completed: number;
  color: string;
  reward: number;
}

export default function SubjectSelectionPage() {
  const params = useParams();
  const examId = params.examId as string;
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examName, setExamName] = useState('');
  const [percentile, setPercentile] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get(`/exams/${examId}/subjects`);
        setSubjects(Array.isArray(response.data.subjects) ? response.data.subjects : []);
        setExamName(response.data.examName);
        setPercentile(response.data.percentile || 0);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects for this examination.');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchSubjects();
    }
  }, [examId]);

  const filteredSubjects = subjects.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green/20 text-green',
      blue: 'bg-blue/20 text-blue',
      amber: 'bg-amber/20 text-amber',
      purple: 'bg-purple/20 text-purple',
      pink: 'bg-pink/20 text-pink',
      orange: 'bg-orange/20 text-orange',
      indigo: 'bg-indigo/20 text-indigo',
      cyan: 'bg-cyan/20 text-cyan',
    };
    return colors[color] || 'bg-blue/20 text-blue';
  };

  /** Clicking a subject card requires auth */
  const handleSubjectClick = useCallback(
    (e: React.MouseEvent, subjectId: string) => {
      if (!isAuthenticated) {
        e.preventDefault();
        router.push(`/login?redirect=/practice/${examId}/${subjectId}`);
      }
    },
    [isAuthenticated, router, examId]
  );

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />

      {/* 30-second login prompt for guests */}
      <LoginPromptModal delayMs={30000} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Breadcrumbs */}
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Exams</span>
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue/20 border-t-blue rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading subjects for {examId.toUpperCase()}...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <Link
              href="/practice"
              className="mt-4 inline-block px-6 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Go Back
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-lg bg-green/10 text-green text-[10px] font-bold uppercase tracking-widest border border-green/20">
                    Active Exam
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tight">
                  {examName} <span className="text-blue">Subjects</span>
                </h1>

                {/* Guest nudge */}
                {!isAuthenticated && (
                  <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green" />
                    <span>
                      <Link href="/login" className="text-green font-semibold hover:underline">Sign in</Link>
                      &nbsp;to start practising and track your progress
                    </span>
                  </p>
                )}
              </div>

              <div className="w-full md:w-96 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue/50 transition-colors"
                />
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredSubjects.map((sub, i) => (
                <Link
                  key={i}
                  href={`/practice/${examId}/${sub.id}`}
                  onClick={(e) => handleSubjectClick(e, sub.id)}
                  className="group p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/5 hover:border-white/20 transition-all flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorClass(sub.color)} group-hover:scale-110 transition-transform`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber/10 text-amber border border-amber/20">
                      <Coins className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">+{sub.reward}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green transition-colors">{sub.name}</h3>
                  <p className="text-sm text-gray-500 mb-6">{sub.questions.toLocaleString()} Practice Questions</p>

                  <div className="mt-auto pt-6 border-t border-white/5">
                    {isAuthenticated ? (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Completion</span>
                          <span className="text-[10px] font-bold text-white">{sub.completed}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green transition-all duration-1000"
                            style={{ width: `${sub.completed}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign in to practice</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Exam Stats / Promo / AI Tutor */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-green/20 via-blue/10 to-transparent border border-green/20 flex items-center justify-between group overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-green fill-green" />
                    <span className="text-xs font-bold text-green uppercase tracking-widest">Premium AI Help</span>
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white mb-2">AI STYDY TUTOR</h4>
                  <p className="text-sm text-gray-400 max-w-xs mb-6">Struggling with {examName} concepts? Our AI tutor knows the entire syllabus.</p>
                  <Link 
                    href="/study-assistant"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green text-navy rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    ASK TUTOR NOW
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="relative shrink-0 hidden sm:block">
                  <div className="w-32 h-32 rounded-full bg-green/20 blur-3xl absolute -inset-4" />
                  <BookOpen className="w-24 h-24 text-green/20 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col gap-4">
                <Trophy className={`w-10 h-10 ${percentile > 0 ? 'text-amber' : 'text-gray-600'}`} />
                <h4 className="text-xl font-bold text-white">
                  {percentile > 0 
                    ? `Top ${Math.max(1, 100 - Math.floor(percentile))}% Percentile` 
                    : 'Not Ranked Yet'}
                </h4>
                <p className="text-sm text-gray-400">
                  {percentile > 0 
                    ? `Performing better than ${Math.floor(percentile)}% of students in ${examName}.` 
                    : `Start practicing to see how you compare against other ${examName} students.`}
                </p>
              </div>

              <Link 
                href={`/practice/${examId}/syllabus`}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] flex flex-col justify-center items-center text-center gap-4 group cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green group-hover:text-navy transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">Full Syllabus</h4>
                <p className="text-sm text-gray-400">View official {examName} requirements.</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
