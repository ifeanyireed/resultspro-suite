'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  Bars3Icon,
  PlayIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  DocumentIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  PresentationChartBarIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { coursesApi } from '@/lib/api';

type ContentItem = {
  id: string;
  type: 'TEXT' | 'VIDEO' | 'AUDIO' | 'PDF' | 'QUIZ' | 'HTML' | 'ASSIGNMENT' | 'PPT' | 'COMPILER' | 'LIVE_CLASS';
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  is_group_assignment?: boolean;
};

const getDirectMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://docs.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return url;
}

function getEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }
  return url;
};

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getIconForType(type: string) {
  switch (type) {
    case 'VIDEO': return <PlayIcon className="w-6 h-6" />;
    case 'AUDIO': return <SpeakerWaveIcon className="w-6 h-6" />;
    case 'LIVE_CLASS': return <VideoCameraIcon className="w-6 h-6" />;
    case 'TEXT':
    case 'HTML': return <DocumentTextIcon className="w-6 h-6" />;
    case 'QUIZ': return <QuestionMarkCircleIcon className="w-6 h-6" />;
    case 'COMPILER': return <CodeBracketIcon className="w-6 h-6" />;
    case 'PDF': return <DocumentIcon className="w-6 h-6" />;
    case 'PPT': return <PresentationChartBarIcon className="w-6 h-6" />;
    case 'ASSIGNMENT': return <ClipboardDocumentCheckIcon className="w-6 h-6" />;
    default: return <DocumentTextIcon className="w-6 h-6" />;
  }
}

function InteractiveQuizRenderer({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      if (!quizId) {
        setLoading(false);
        setError('No Quiz ID provided.');
        return;
      }
      try {
        setLoading(true);
        const res = await coursesApi.get(`/api/admin/quizzes/${quizId}`);
        const found = res.data.quiz || res.data;
        if (found) {
          found.questions = res.data.questions || found.questions || [];
          setQuiz(found);
        } else {
          setError('Quiz not found.');
        }
      } catch (err) {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId]);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading quiz...</div>;
  if (error || !quiz) return <div className="p-8 text-center text-red-500">{error || 'Unknown error'}</div>;

  let rawQuestions = quiz.questions;
  if ((!rawQuestions || rawQuestions.length === 0) && quiz.questions_json) {
    try { rawQuestions = typeof quiz.questions_json === 'string' ? JSON.parse(quiz.questions_json) : quiz.questions_json; } catch(e) {}
  }
  const questions = (rawQuestions || []).map((q: any) => {
    if (!q.options && q.options_json) {
      try { q.options = JSON.parse(q.options_json); } catch(e) { q.options = []; }
    }
    return q;
  });

  if (!questions.length) {
    return <div className="text-gray-500">No questions in this quiz.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" />
        <h3 className="font-bold text-xl text-gray-900">{quiz.title || "Knowledge Check"}</h3>
      </div>

      <div className="space-y-10">
        {questions.map((q: any, qIdx: number) => {
          const isMCQ = q.question_type !== 'THEORY';
          return (
            <div key={qIdx} className="space-y-4">
              <h4 className="font-bold text-base text-gray-900">{qIdx + 1}. {q.question}</h4>
              
              {isMCQ ? (
                <div className="space-y-3">
                  {(q.options || []).map((opt: string, oIdx: number) => {
                    const isSelected = answers[qIdx] === oIdx;
                    const isCorrect = oIdx === q.correct_index;
                    let borderClasses = 'border-gray-200 hover:border-blue-300 bg-white';
                    
                    if (submitted) {
                      if (isCorrect) borderClasses = 'border-green-500 bg-green-50 text-green-900';
                      else if (isSelected && !isCorrect) borderClasses = 'border-red-500 bg-red-50 text-red-900';
                    } else if (isSelected) {
                      borderClasses = 'border-blue-500 bg-blue-50';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => setAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${borderClasses}`}
                      >
                        <div className="flex items-center space-x-4">
                          <span className="font-mono text-sm font-bold text-gray-400">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-sm font-medium">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                  {submitted && q.explanation && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700">
                      <span className="font-bold text-gray-900 mr-2">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea 
                    disabled={submitted}
                    placeholder="Type your answer here..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    rows={5}
                  />
                  {submitted && q.reference && (
                    <div className="mt-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-gray-700">
                      <span className="font-bold text-blue-700 mr-2">Sample Answer/Rubric:</span>
                      {q.reference}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
        {!submitted && (
          <button
            onClick={() => setSubmitted(true)}
            className="bg-[#146ef5] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#105bd1] transition-all shadow-sm"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default function LessonPlayerPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: dashboardData, isLoading: dashLoading } = useQuery({
    queryKey: ['student-dashboard-summary'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/dashboard/summary');
      return res.data;
    }
  });

  const { data: journeyData, isLoading: journeyLoading } = useQuery({
    queryKey: ['cohort-journey', dashboardData?.cohort_id],
    queryFn: async () => {
      const res = await coursesApi.get(`/api/cohorts/${dashboardData.cohort_id}/journey`);
      return res.data;
    },
    enabled: !!dashboardData?.cohort_id
  });

  useEffect(() => {
    if (journeyData && journeyData.progress) {
      const p = journeyData.progress.find((pr: any) => pr.module_id === moduleId);
      if (p) {
        setActiveIndex(p.last_active_index || 0);
        if (p.completed_items) {
          try {
            setCompletedItems(JSON.parse(p.completed_items));
          } catch(e) {}
        } else {
          setCompletedItems([]);
        }
      } else {
        setActiveIndex(0);
        setCompletedItems([]);
      }
    } else if (!journeyLoading) {
      setActiveIndex(0);
      setCompletedItems([]);
    }
  }, [moduleId, journeyData, journeyLoading]);

  const queryClient = useQueryClient();
  const progressMutation = useMutation({
    mutationFn: async ({ completed, last_active_index, completed_items }: { completed: boolean, last_active_index: number, completed_items: string }) => {
      const res = await coursesApi.post(`/api/modules/${moduleId}/progress`, {
        completed,
        last_active_index,
        completed_items
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-dashboard-summary'] });
    }
  });

  if (dashLoading || journeyLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
        <div className="text-gray-400 animate-pulse font-medium text-lg">Loading lesson...</div>
      </div>
    );
  }

  const stage = journeyData?.stages?.find((s: any) => s.id === moduleId);
  
  if (!stage) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h2>
        <Link href="/dashboard/journey" className="px-6 py-3 bg-[#146ef5] text-white rounded-xl font-medium">
          Return to Journey Map
        </Link>
      </div>
    );
  }

  let items: ContentItem[] = [];
  try {
    if (stage.contents_json) {
      items = JSON.parse(stage.contents_json);
    }
  } catch(e) {
    console.error("Failed to parse stage contents", e);
  }

  const currentStageIndex = journeyData.stages.findIndex((s: any) => s.id === moduleId);
  const nextStage = journeyData.stages[currentStageIndex + 1];

  const handleMarkComplete = () => {
    let newCompleted = [...completedItems];
    if (!newCompleted.includes(activeIndex)) {
      newCompleted.push(activeIndex);
      setCompletedItems(newCompleted);
    }
    
    if (activeIndex === items.length - 1) {
      progressMutation.mutate({ completed: true, last_active_index: activeIndex, completed_items: JSON.stringify(newCompleted) }, {
        onSuccess: () => {
          if (nextStage) {
            router.push(`/dashboard/journey/${nextStage.id}`);
          } else {
            router.push('/dashboard/journey');
          }
        },
        onError: (error) => {
          console.error("Failed to mark module as complete:", error);
          alert("Failed to save progress. Please try again or check your connection.");
        }
      });
    } else {
      const nextIndex = activeIndex + 1;
      progressMutation.mutate({ completed: false, last_active_index: nextIndex, completed_items: JSON.stringify(newCompleted) }, {
        onSuccess: () => {
          setActiveIndex(nextIndex);
        },
        onError: (error) => {
          console.error("Failed to mark module as complete:", error);
          alert("Failed to save progress. Please try again or check your connection.");
        }
      });
    }
  };

  const currentItem = items[activeIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto font-grotesk text-gray-900">
      <div className="flex min-h-full w-full">
        {/* Main Left Content */}
        <div className="flex-1 flex flex-col relative transition-all duration-300">
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white sticky top-0 z-50 shrink-0">
            <Link href="/dashboard/journey" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-sm">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Journey Map
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900 hidden md:inline-block">{stage.title}</span>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600">
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 bg-gray-50 p-4 md:p-12 flex flex-col items-center">
          {items.length === 0 ? (
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 mt-10">
              This module has no content items baked into it yet.
            </div>
          ) : (
            <>
              <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[60vh] relative">
                
                {currentItem?.type === 'VIDEO' && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                      {currentItem.url?.includes('youtube.com') || currentItem.url?.includes('youtu.be') || currentItem.url?.includes('vimeo') ? (
                        <iframe src={getEmbedUrl(currentItem.url)} className="absolute inset-0 w-full h-full border-0" allowFullScreen></iframe>
                      ) : (
                        <video src={currentItem.url} controls className="absolute inset-0 w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                )}

                {currentItem?.type === 'AUDIO' && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4">
                      <SpeakerWaveIcon className="w-12 h-12 text-[#146ef5]" />
                      <audio src={currentItem.url} controls className="w-full max-w-md mt-4" />
                    </div>
                  </div>
                )}

                {currentItem?.type === 'LIVE_CLASS' && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <VideoCameraIcon className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-emerald-900 tracking-tight">Live Class Room</h3>
                          <p className="text-emerald-700 mt-2 mb-3">Join your mentor and cohort peers for this live session.</p>
                          {currentItem.url ? (
                            <div className="text-sm text-emerald-600/80 font-mono truncate max-w-sm">{currentItem.url}</div>
                          ) : (
                            <div className="text-sm text-emerald-600/80 italic">Meeting link will be provided by your mentor.</div>
                          )}
                        </div>
                      </div>
                      <a 
                        href={currentItem.url || '#'}
                        target={currentItem.url ? "_blank" : "_self"}
                        rel="noreferrer"
                        className={`w-full md:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 ${!currentItem.url && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <VideoCameraIcon className="w-6 h-6" />
                        {currentItem.url ? 'Join Meeting' : 'No Link Yet'}
                      </a>
                    </div>
                  </div>
                )}
                
                {currentItem?.type === 'COMPILER' && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div className="w-full h-[600px] relative rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      {currentItem.url ? (
                        <iframe 
                          src={`https://onecompiler.com/embed/${currentItem.url}?code=${encodeURIComponent(currentItem.content || '')}&hideLanguageSelection=true&hideNew=true&hideTitle=true`}
                          className="w-full h-full border-0 bg-white" 
                          title="Code Compiler" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">No language selected</div>
                      )}
                    </div>
                  </div>
                )}

                {currentItem?.type === 'ASSIGNMENT' && (() => {
                  const subType = currentItem.url || 'TEXT';
                  let btnText = 'Submit Assignment';
                  if (subType === 'TEXT') btnText = 'Write Submission';
                  else if (subType === 'LINK') btnText = 'Attach Link';
                  else if (subType === 'FILE') btnText = 'Upload File';

                  return (
                    <div className="space-y-6">
                      {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-indigo-900">Assignment Task</h3>
                          {currentItem.is_group_assignment && (
                            <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md flex items-center gap-1">
                              <ClipboardDocumentCheckIcon className="w-4 h-4" />
                              Group Assignment
                            </span>
                          )}
                        </div>
                        <p className="text-indigo-800 text-base mb-6 whitespace-pre-wrap leading-relaxed">{currentItem.content || 'No instructions provided.'}</p>
                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-indigo-200/50">
                          <button className="px-6 py-3 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-sm font-bold shadow-sm transition-colors">
                            {btnText}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {currentItem?.type === 'TEXT' && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div 
                      className="prose prose-lg prose-blue max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{ __html: currentItem.content || '' }}
                    />
                  </div>
                )}

                {currentItem?.type === 'HTML' && (() => {
                  const isProxyRequired = currentItem.url && (currentItem.url.includes('cloudinary.com') || currentItem.url.includes('drive.google.com') || currentItem.url.includes('docs.google.com'));
                  const iframeSrc = isProxyRequired ? `/api/html-proxy?url=${encodeURIComponent(getDirectMediaUrl(currentItem.url || ''))}` : currentItem.url;
                  return (
                    <div className="space-y-6">
                      {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                      {currentItem.content && (
                        <div 
                          className="prose prose-lg prose-blue max-w-none text-gray-800"
                          dangerouslySetInnerHTML={{ __html: currentItem.content }}
                        />
                      )}
                      <div className="w-full h-[600px] relative rounded-xl overflow-hidden shadow-sm bg-white border border-gray-200">
                        {currentItem.url ? (
                          <iframe src={iframeSrc} className="w-full h-full border-0 bg-white" title="HTML Content" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">No HTML uploaded</div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {currentItem?.type === 'QUIZ' && (
                  <InteractiveQuizRenderer quizId={currentItem.url || ''} />
                )}

                {(currentItem?.type === 'PDF' || currentItem?.type === 'PPT') && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div className="w-full h-[600px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative">
                      {currentItem.url ? (
                        currentItem.url.toLowerCase().endsWith('.pdf') ? (
                          <iframe src={`${currentItem.url}#view=FitH`} className="w-full h-full border-0" title="Document" />
                        ) : (
                          <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(currentItem.url)}`} className="w-full h-full border-0" title="Document" />
                        )
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-4">
                          <DocumentIcon className="w-12 h-12" />
                          <span>No document attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              <div className="w-full max-w-5xl mt-8 flex justify-end">
                <button 
                  onClick={handleMarkComplete}
                  disabled={progressMutation.isPending}
                  className="px-8 py-4 bg-[#146ef5] text-white rounded-full font-bold text-sm hover:bg-[#105bd1] shadow-md flex items-center gap-2 transition-all disabled:opacity-70"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {progressMutation.isPending 
                    ? 'Saving...' 
                    : activeIndex === items.length - 1 
                      ? 'Complete Module & Continue' 
                      : 'Mark Complete & Next'}
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Right Sidebar */}
      {sidebarOpen && (
        <aside className="w-80 border-l border-gray-200 bg-white sticky top-0 h-screen flex flex-col shrink-0 z-10 overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Module Contents</h3>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#146ef5] transition-all" 
                  style={{ width: items.length > 0 ? `${(completedItems.length / items.length) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-500 shrink-0">
                {completedItems.length}/{items.length}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {items.map((item, idx) => {
              const isCompleted = completedItems.includes(idx);
              const isActive = activeIndex === idx;
              return (
                <button 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left flex flex-col justify-center px-4 py-3 rounded-xl relative transition-colors ${isActive ? 'text-gray-900 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-10 before:bg-gray-900 before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`shrink-0 ${isCompleted ? 'text-green-500' : (isActive ? 'text-gray-900' : 'text-gray-400')}`}>
                      {isCompleted ? <CheckCircleSolid className="w-6 h-6" /> : getIconForType(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-normal truncate leading-tight ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                        {item.title || item.type}
                      </p>
                      <p className={`text-[11px] mt-0.5 truncate ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                        {item.description 
                          ? item.description 
                          : (item.content 
                              ? (stripHtml(item.content).length > 50 ? stripHtml(item.content).substring(0, 47) + '...' : stripHtml(item.content))
                              : item.type.toLowerCase())}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
      )}
      </div>
    </div>
  );
}
