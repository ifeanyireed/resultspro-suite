"use client";

import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoginPromptModal from '@/components/LoginPromptModal';
import { IconArrowLeft as ArrowLeft, IconSearch as Search, IconPlayerPlay as Play, IconLock as Lock, IconCircleCheck as CheckCircle2, IconCoins as Coins, IconClock as Clock, IconBolt as Zap, IconStar as Star, IconTrophy as Trophy, IconSparkles as Sparkles } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface Topic {
  id: number;
  name: string;
  questions: number;
  completed: boolean;
  active: boolean;
  locked: boolean;
  difficulty: string;
  reward: number;
  mastery: number;
}
interface YearStat {
  year: number;
  questions: number;
  answeredCount: number;
  isCompleted: boolean;
  mastery: number;
}

export default function TopicListPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const subjectId = params.subjectId as string;
  const { isAuthenticated } = useAuthStore();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [years, setYears] = useState<YearStat[]>([]);
  const [viewMode, setViewMode] = useState<'topic' | 'year'>('topic');
  const [readyPercent, setReadyPercent] = useState(0);
  const [subjectName, setSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTopics = useCallback(async () => {
    try {
      const response = await api.get(`/exams/subjects/${subjectId}/topics`);
      setTopics(Array.isArray(response.data.topics) ? response.data.topics : []);
      setSubjectName(response.data.subjectName);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to load topics for this subject.');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  const fetchYears = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/exams/subjects/${subjectId}/years`);
      setYears(response.data.years);
      setReadyPercent(response.data.readyPercent);
      setSubjectName(response.data.subjectName);
    } catch (err) {
      console.error('Error fetching years:', err);
      setError('Failed to load years for this subject.');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    if (subjectId) {
      if (viewMode === 'topic') {
        fetchTopics();
      } else {
        fetchYears();
      }
    }
  }, [subjectId, viewMode, fetchTopics, fetchYears]);

  const handleStartPractice = useCallback(
    (e: React.MouseEvent, topicId: number) => {
      if (!isAuthenticated) {
        e.preventDefault();
        router.push(`/login?redirect=/quiz?topicId=${topicId}`);
      }
    },
    [isAuthenticated, router]
  );

  const filteredTopics = topics?.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) && topic.questions > 0
  ) || [];

  const completedCount = topics?.filter(t => t.completed).length || 0;

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />

      {/* 30-second login prompt for guests */}
      <LoginPromptModal delayMs={30000} />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
        {/* Breadcrumbs */}
        <Link
          href={`/practice/${examId}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Subjects</span>
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-green/20 border-t-green rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading topics for {subjectName || subjectId}...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <Link
              href={`/practice/${examId}`}
              className="mt-4 inline-block px-6 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Go Back
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-blue font-bold text-sm uppercase tracking-widest">{examId.toUpperCase()}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-gray-400 text-sm font-medium">{subjectName}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
                    Select a <span className="text-green">{viewMode === 'topic' ? 'Topic' : 'Year'}</span>
                  </h1>
                  <p className="text-gray-500 font-medium">
                    {viewMode === 'topic' 
                      ? 'Master individual topics with focused practice and AI assistance.' 
                      : 'Simulate the real exam experience with mixed topics from past years.'}
                  </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex p-1 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] w-fit shrink-0">
                  <button
                    onClick={() => setViewMode('topic')}
                    className={`
                      px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                      ${viewMode === 'topic' ? 'bg-blue text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}
                    `}
                  >
                    Topic
                  </button>
                  <button
                    onClick={() => setViewMode('year')}
                    className={`
                      px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                      ${viewMode === 'year' ? 'bg-blue text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}
                    `}
                  >
                    Year
                  </button>
                </div>
              </div>

              {/* Guest nudge */}
              {!isAuthenticated && (
                <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-green/5 border border-green/20 text-sm">
                  <Lock className="w-4 h-4 text-green shrink-0" />
                  <span className="text-gray-300">
                    <Link href="/login" className="text-green font-semibold hover:underline">Sign in</Link>
                    &nbsp;to start practising — it&apos;s free!
                  </span>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
                />
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {viewMode === 'topic' ? (
                (filteredTopics || []).length > 0 ? (
                  (filteredTopics || []).map((topic) => (
                    <div
                      key={topic.id}
                      className={`
                        group p-1 rounded-[24px] transition-all
                        ${topic.active ? 'bg-gradient-to-r from-green to-blue' : 'bg-transparent'}
                      `}
                    >
                      <div className={`
                        relative p-6 rounded-[22px] border transition-all flex flex-col md:flex-row md:items-center gap-6
                        ${topic.active ? 'bg-navy border-transparent' : 'bg-white/[0.02] border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/10'}
                        ${topic.locked ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}
                      `}>
                        {/* Status Icon */}
                        <div className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all
                          ${topic.completed ? 'bg-green/10 text-green' : topic.active ? 'bg-blue/10 text-blue' : 'bg-white/5 text-gray-500'}
                          ${topic.locked ? 'bg-white/5 text-gray-700' : ''}
                        `}>
                          {topic.completed ? <CheckCircle2 className="w-7 h-7" /> :
                          topic.locked ? <Lock className="w-6 h-6" /> :
                          <Zap className={`w-7 h-7 ${topic.active ? 'animate-pulse' : ''}`} />}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-white">{topic.name}</h3>
                            <span className={`
                              px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter
                              ${topic.difficulty === 'Easy' ? 'bg-green/10 text-green' :
                                topic.difficulty === 'Medium' ? 'bg-amber/10 text-amber' : 'bg-red-500/10 text-red-500'}
                            `}>
                              {topic.difficulty}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {topic.questions} Questions
                            </div>
                            <div className="flex items-center gap-1.5 text-amber">
                              <Coins className="w-4 h-4" />
                              {topic.reward} coin/correct
                            </div>
                            {topic.mastery > 0 && (
                              <div className="flex items-center gap-1.5 text-blue">
                                <Star className="w-4 h-4 fill-current" />
                                {topic.mastery}% Mastery
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {isAuthenticated && !topic.locked && (
                            <Link href={`/practice/study/${topic.id}`}>
                              <button className="p-3 rounded-xl bg-white/5 text-blue hover:bg-blue/10 border border-white/[0.1] border-t-white/[0.15] transition-all group/study" title="AI Study Assistant">
                                <Sparkles className="w-5 h-5 group-hover/study:scale-110 transition-transform" />
                              </button>
                            </Link>
                          )}
                          
                          {!topic.locked ? (
                            <Link
                              href={`/quiz?topicId=${topic.id}`}
                              onClick={(e) => handleStartPractice(e, topic.id)}
                              className="w-full md:w-auto"
                            >
                              <button className={`
                                w-full md:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                ${topic.active
                                  ? 'bg-green text-navy hover:scale-105 shadow-[0_0_20px_rgba(0,200,83,0.3)]'
                                  : isAuthenticated
                                    ? 'bg-white/5 text-white hover:bg-white/10'
                                    : 'bg-white/5 text-gray-400 hover:bg-green/10 hover:text-green border border-white/[0.1] border-t-white/[0.15]'}
                              `}>
                                {isAuthenticated ? (
                                  <>
                                    <Play className="w-4 h-4 fill-current" />
                                    {topic.completed ? 'Practice Again' : 'Start Practice'}
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-4 h-4" />
                                    Sign in to Practice
                                  </>
                                )}
                              </button>
                            </Link>
                          ) : (
                            <button className="w-full md:w-auto px-8 py-3 rounded-xl bg-white/5 text-gray-500 font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                              <Coins className="w-4 h-4" />
                              Unlock for 10
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/[0.05] border-t-white/[0.1]">
                    <p className="text-gray-500">No topics found matching your search.</p>
                  </div>
                )
              ) : (
                /* Year Mode Arcade List */
                (years || []).length > 0 ? (
                  (years || []).map((yearStat) => (
                    <div
                      key={yearStat.year}
                      className="relative p-6 rounded-[22px] border bg-white/[0.02] border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    >
                      <div className="flex items-center gap-6">
                        {/* Arcade/Year Icon */}
                        <div className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all
                          ${yearStat.isCompleted ? 'bg-green/10 text-green' : 'bg-blue/10 text-blue'}
                        `}>
                          {yearStat.isCompleted ? <Trophy className="w-7 h-7" /> : <Play className="w-7 h-7" />}
                        </div>

                        <div>
                          <h3 className="text-2xl font-black text-white group-hover:text-blue transition-colors">
                            {yearStat.year} <span className="text-sm font-medium text-gray-500">Examination</span>
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {yearStat.questions} Qs Mixed</span>
                            <span className={`flex items-center gap-1.5 ${yearStat.mastery > 0 ? 'text-blue' : ''}`}>
                              <Star className={`w-4 h-4 ${yearStat.mastery > 0 ? 'fill-current' : ''}`} /> 
                              {yearStat.mastery}% Accuracy
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link 
                        href={`/quiz?subjectId=${subjectId}&year=${yearStat.year}`}
                        onClick={(e) => handleStartPractice(e, 0)}
                      >
                        <button className="w-full md:w-auto px-10 py-3.5 rounded-2xl bg-white/5 text-white font-bold hover:bg-blue hover:text-white border border-white/[0.1] border-t-white/[0.15] transition-all flex items-center justify-center gap-2">
                          <Play className="w-4 h-4 fill-current" />
                          Start Arcade
                        </button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/[0.05] border-t-white/[0.1]">
                    <p className="text-gray-500">No past year exams found for this subject.</p>
                  </div>
                )
              )}
            </div>

            {/* Motivation Card */}
            <div className="mt-12 p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Trophy className="w-40 h-40 text-white" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  {viewMode === 'topic' ? `Master the ${subjectName} Module` : `You are ${readyPercent}% Ready`}
                </h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  {viewMode === 'topic' 
                    ? `Complete all topics in this section with 80% or higher to earn a "${subjectName} Master" badge and 50 bonus coins.`
                    : `Your simulation readiness score is based on your mixed-topic performance across all past examination years.`}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue transition-all duration-1000"
                      style={{ 
                        width: viewMode === 'topic' 
                          ? `${(topics || []).length > 0 ? (completedCount / (topics || []).length) * 100 : 0}%`
                          : `${readyPercent}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue">
                    {viewMode === 'topic' 
                      ? `${completedCount}/${(topics || []).length} Completed`
                      : `${readyPercent}% Ready`}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
