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
  DocumentIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type ContentItem = {
  id: string;
  type: 'TEXT' | 'VIDEO' | 'AUDIO' | 'PDF' | 'QUIZ' | 'HTML' | 'ASSIGNMENT' | 'PPT' | 'COMPILER' | 'LIVE_CLASS';
  title?: string;
  content?: string;
  url?: string;
};

function getIconForType(type: string) {
  switch (type) {
    case 'VIDEO': return <PlayIcon className="w-5 h-5" />;
    case 'TEXT':
    case 'HTML': return <DocumentTextIcon className="w-5 h-5" />;
    case 'QUIZ': return <QuestionMarkCircleIcon className="w-5 h-5" />;
    case 'COMPILER': return <CodeBracketIcon className="w-5 h-5" />;
    case 'PDF': return <DocumentIcon className="w-5 h-5" />;
    default: return <DocumentTextIcon className="w-5 h-5" />;
  }
}

// Sub-component to render a quiz
function QuizRenderer({ quizData }: { quizData: any }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const questions = quizData.questions || [];

  if (!questions.length) {
    return <div className="text-gray-500">No questions in this quiz.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" />
        <h3 className="font-bold text-xl text-gray-900">{quizData.title || "Knowledge Check"}</h3>
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
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm"
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

  // Fetch dashboard data to get cohort_id
  const { data: dashboardData, isLoading: dashLoading } = useQuery({
    queryKey: ['student-dashboard-summary'],
    queryFn: async () => {
      const res = await api.get('/api/student/dashboard/summary');
      return res.data;
    }
  });

  // Fetch journey data using cohort_id
  const { data: journeyData, isLoading: journeyLoading } = useQuery({
    queryKey: ['cohort-journey', dashboardData?.cohort_id],
    queryFn: async () => {
      const res = await api.get(`/api/cohorts/${dashboardData.cohort_id}/journey`);
      return res.data;
    },
    enabled: !!dashboardData?.cohort_id
  });

  const queryClient = useQueryClient();
  const progressMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const res = await api.post(`/api/student/journey/modules/${moduleId}/progress`, {
        completed
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
        <Link href="/dashboard/journey" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium">
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
    if (!completedItems.includes(activeIndex)) {
      setCompletedItems([...completedItems, activeIndex]);
    }
    
    // If it's the last item, mark module as complete via API
    if (activeIndex === items.length - 1) {
      progressMutation.mutate(true, {
        onSuccess: () => {
          if (nextStage) {
            router.push(`/dashboard/journey/${nextStage.id}`);
          } else {
            router.push('/dashboard/journey');
          }
        }
      });
    } else {
      // Move to next item automatically
      setActiveIndex(activeIndex + 1);
    }
  };

  const currentItem = items[activeIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-white flex overflow-hidden font-grotesk text-gray-900">
      {/* Main Left Content */}
      <div className="flex-1 flex flex-col h-full relative transition-all duration-300">
        {/* Header */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
          <Link href="/dashboard/journey" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-sm">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Journey Map
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900 hidden md:inline-block">{stage.title}</span>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600">
              <Bars3Icon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-12 flex flex-col items-center">
          {items.length === 0 ? (
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 mt-10">
              This module has no content items baked into it yet.
            </div>
          ) : (
            <>
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[60vh]">
                {currentItem?.type === 'VIDEO' && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                      {currentItem.url?.includes('youtube.com') || currentItem.url?.includes('youtu.be') || currentItem.url?.includes('vimeo') ? (
                        <iframe src={currentItem.url} className="absolute inset-0 w-full h-full" allowFullScreen></iframe>
                      ) : (
                        <video src={currentItem.url} controls className="absolute inset-0 w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                )}

                {(currentItem?.type === 'TEXT' || currentItem?.type === 'HTML') && (
                  <div className="space-y-6">
                    {currentItem.title && <h2 className="font-bold text-2xl">{currentItem.title}</h2>}
                    <div 
                      className="prose prose-blue max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: currentItem.content || '' }}
                    />
                  </div>
                )}

                {currentItem?.type === 'QUIZ' && (
                  <QuizRenderer quizData={currentItem.content ? JSON.parse(currentItem.content) : {}} />
                )}

                {currentItem?.type === 'PDF' && (
                  <div className="space-y-6 text-center py-12">
                    <DocumentIcon className="w-16 h-16 text-blue-500 mx-auto" />
                    <h2 className="font-bold text-2xl">{currentItem.title || 'PDF Document'}</h2>
                    <p className="text-gray-500">Click below to view or download this document.</p>
                    <a href={currentItem.url} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                      Open PDF
                    </a>
                  </div>
                )}

                {!['VIDEO', 'TEXT', 'HTML', 'QUIZ', 'PDF'].includes(currentItem?.type || '') && (
                  <div className="space-y-6 text-center py-12">
                    <h2 className="font-bold text-2xl">{currentItem?.title || currentItem?.type}</h2>
                    {currentItem?.url && (
                      <a href={currentItem.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {currentItem.url}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="w-full max-w-4xl mt-8 flex justify-end">
                <button 
                  onClick={handleMarkComplete}
                  disabled={progressMutation.isPending}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all disabled:opacity-70"
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
        <aside className="w-80 border-l border-gray-100 bg-white h-full flex flex-col shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Module Contents</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all" 
                  style={{ width: items.length > 0 ? `${(completedItems.length / items.length) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-500 shrink-0">
                {completedItems.length}/{items.length}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.map((item, idx) => {
              const isCompleted = completedItems.includes(idx);
              const isActive = activeIndex === idx;
              return (
                <button 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3
                    ${isActive ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-transparent hover:bg-gray-50'}
                  `}
                >
                  <div className={`mt-0.5 shrink-0 ${isCompleted ? 'text-green-500' : (isActive ? 'text-blue-500' : 'text-gray-400')}`}>
                    {isCompleted ? <CheckCircleSolid className="w-6 h-6" /> : getIconForType(item.type)}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                      {item.title || item.type}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-blue-600/70' : 'text-gray-400'}`}>
                      {item.type.toLowerCase()}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
