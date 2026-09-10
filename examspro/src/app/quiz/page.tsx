"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IconClock as Timer, IconCoins as Coins, IconChevronRight as ChevronRight, IconX as X, IconAlertCircle as AlertCircle, IconCircleCheck as CheckCircle2, IconBrain as Brain, IconLoader2 as Loader2, IconCheck as Check, IconBolt as Zap, IconSword as Sword } from '@tabler/icons-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { InlineMath } from 'react-katex';
import api from '@/lib/api';

function QuizContent() {
  const searchParams = useSearchParams();
  
  const renderTextWithMath = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\\(.*?\\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('\(') && part.endsWith('\)')) {
        const math = part.slice(2, -2);
        return <InlineMath key={i} math={math} />;
      }
      return <span key={i}>{part}</span>;
    });
  };
  const router = useRouter();
  const topicId = searchParams.get('topicId');
  const subjectId = searchParams.get('subjectId');
  const year = searchParams.get('year');

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(60);
  const [duration, setDuration] = useState(60);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const [isAnswered, setIsAnswered] = useState(false);
  const [serverVerified, setServerVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  const [sessionId] = useState(() => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString());
  
  const [quizMode, setQuizMode] = useState<'study' | 'exam' | null>(null);
  const [questionType, setQuestionType] = useState<'mcq' | 'theory'>('mcq');
  const [selectedLimit, setSelectedLimit] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState<'mode' | 'type' | 'count' | 'duration' | 'loading' | 'active'>('mode');
  
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hiddenOptionIds, setHiddenOptionIds] = useState<string[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [theoryAnswer, setTextAnswer] = useState("");
  const [availableTypes, setAvailableTypes] = useState({ mcq: true, theory: false });

  // Fetch Available Types
  useEffect(() => {
    const fetchAvailableTypes = async () => {
      try {
        let url = `/quiz/available-types?`;
        if (topicId) url += `topicId=${topicId}`;
        else if (subjectId) {
          url += `subjectId=${subjectId}`;
          if (year) url += `&year=${year}`;
        }
        const res = await api.get(url);
        setAvailableTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch available types:", err);
      }
    };

    if (topicId || (subjectId && year)) {
      fetchAvailableTypes();
    }
  }, [topicId, subjectId, year]);

  // Fetch Questions
  const fetchQuestions = async (limit: number | 'all') => {
    setQuizStep('loading');
    try {
      let endpoint = `/quiz/topics/${topicId}/questions?limit=${limit}&type=${questionType}`;
      if (!topicId && subjectId && year) {
        endpoint = `/exams/subjects/${subjectId}/questions?year=${year}&limit=${limit}&type=${questionType}`;
      }
      
      const res = await api.get(endpoint);
      setQuestions(res.data || []);
      setQuizStep('active');
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError("Failed to load questions. Please try again later.");
      setQuizStep('mode');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!topicId && (!subjectId || !year)) {
      setError("No topic or year selected. Please return and select a practice mode.");
      setLoading(false);
      return;
    }
  }, [topicId, subjectId, year]);

  const handleModeSelect = (mode: 'study' | 'exam') => {
    setQuizMode(mode);
    setQuizStep('type');
  };

  const handleTypeSelect = (type: 'mcq' | 'theory') => {
    setQuestionType(type);
    setQuizStep('count');
  };

  const handleCountSelect = (count: number) => {
    setSelectedLimit(count === 0 ? 100 : count); // logic for progress bar
    setQuizStep('duration');
  };

  const handleDurationSelect = (seconds: number) => {
    setDuration(seconds);
    setTimeLeft(seconds);
    const limit = selectedLimit === 100 ? 'all' : selectedLimit;
    fetchQuestions(limit as number | 'all');
  };

  // Timer Tick
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !loading && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAnswered, loading, questions.length]);

  const handleSelect = (id: string) => {
    if (!isAnswered) setSelectedOption(id);
  };

  const handleVerify = async () => {
    if (questionType === 'mcq' && !selectedOption) return;
    if (questionType === 'theory' && !theoryAnswer.trim()) return;
    if (!questions[currentIndex]) return;
    
    setIsAnswered(true); // lock inputs visually
    try {
      const currentQuestion = questions[currentIndex];
      const res = await api.post('/quiz/submit', {
        questionId: currentQuestion.id,
        selectedOptionId: selectedOption,
        textAnswer: theoryAnswer,
        timeTakenMs: Math.max(0, (duration - timeLeft) * 1000),
        sessionId: sessionId,
      });
      
      const data = res.data;
      setServerVerified(true);
      setIsCorrect(data.isCorrect);
      setCorrectOptionId(data.correctOptionId);
      setExplanation(data.explanation);
      
      if (quizMode === 'study') {
        if (data.isCorrect) {
          toast.success(`Correct! +${data.coinsEarned} Coins`);
        } else {
          toast.error(`Incorrect!`);
        }
      } else {
        // Collect result for final summary
        setExamResults(prev => [...prev, {
          questionId: currentQuestion.id,
          bodyText: currentQuestion.bodyText,
          selectedOptionId: selectedOption,
          textAnswer: theoryAnswer,
          correctOptionId: data.correctOptionId,
          isCorrect: data.isCorrect,
          explanation: data.explanation,
          topic: currentQuestion.topic,
          year: currentQuestion.year,
          options: currentQuestion.options,
          type: currentQuestion.type
        }]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit answer. Please try again.');
      setIsAnswered(false); // unlock if network fails
    }
  };

  const handleHint = async () => {
     if (hintsUsed >= 2 || isAnswered || !questions[currentIndex] || questionType === 'theory') return;
     
     try {
       const res = await api.post('/quiz/hint', {
         questionId: questions[currentIndex].id,
         excludedIds: hiddenOptionIds
       });
       
       setHiddenOptionIds(prev => [...prev, res.data.wrongOptionId]);
       setHintsUsed(prev => prev + 1);
       setShowHint(true);
       toast.success('Wrong option eliminated! (-2 coins)');
     } catch (err: any) {
       toast.error(err.response?.data?.error || 'Failed to unlock hint');
     }
  };

  const handleContinue = () => {
     if (currentIndex + 1 < questions.length) {
         setCurrentIndex(idx => idx + 1);
         // Reset state for new question
         setSelectedOption(null);
         setTextAnswer("");
         setIsAnswered(false);
         setServerVerified(false);
         setIsCorrect(null);
         setCorrectOptionId(null);
         setExplanation(null);
         setShowHint(false);
         setHintsUsed(0);
         setHiddenOptionIds([]);
         setTimeLeft(duration);
     } else {
         if (quizMode === 'exam') {
           setIsExamCompleted(true);
         } else {
           toast.success('Practice Session Completed!');
           if (subjectId) {
             router.push(`/practice/exam/${subjectId}`);
           } else {
             router.push('/dashboard');
           }
         }
     }
  };

  if (quizStep === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#146ef5] animate-spin mx-auto" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Preparing your session...</p>
        </div>
      </main>
    );
  }

  if (quizStep === 'active' && (error || questions.length === 0)) {
    return (
      <main className="min-h-screen bg-slate-50 text-gray-900 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold mb-4">{error || "No questions found for this topic."}</h2>
        <Link href="/dashboard">
          <Button className="bg-gray-100 hover:bg-white/20 text-gray-900 rounded-xl">Return to Dashboard</Button>
        </Link>
      </main>
    );
  }

  if (quizStep === 'mode') {
    return (
      <main className="min-h-screen bg-slate-50 text-gray-900 flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-xl w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#146ef5]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-[#146ef5]" />
            </div>
            <h1 className="text-4xl font-display font-bold">Choose Your Mode</h1>
            <p className="text-gray-500">Select how you want to practice today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => handleModeSelect('study')}
              className="p-8 rounded-[32px] bg-white border border-gray-200 shadow-sm hover:border-[#146ef5]/50 hover:bg-[#146ef5]/5 transition-all group text-left space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#146ef5]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-[#146ef5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Study Mode</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Immediate feedback and explanations after every question.</p>
              </div>
            </button>

            <button 
              onClick={() => handleModeSelect('exam')}
              className="p-8 rounded-[32px] bg-white border border-gray-200 shadow-sm hover:border-[#146ef5]/50 hover:bg-[#146ef5]/5 transition-all group text-left space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#146ef5]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Timer className="w-6 h-6 text-[#146ef5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Exam Mode</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Real-time simulation. See results only at the very end.</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (quizStep === 'type') {
    return (
      <main className="min-h-screen bg-slate-50 text-gray-900 flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-xl w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-amber/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sword className="w-10 h-10 text-amber" />
            </div>
            <h1 className="text-4xl font-display font-bold">Question Type</h1>
            <p className="text-gray-500">Choose the format of questions you want.</p>
          </div>

          <div className={`grid gap-4 ${availableTypes.theory ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'}`}>
            <button 
              onClick={() => handleTypeSelect('mcq')}
              className="p-8 rounded-[32px] bg-white border border-gray-200 shadow-sm hover:border-[#146ef5]/50 hover:bg-[#146ef5]/5 transition-all group text-left space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#146ef5]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-[#146ef5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Multiple Choice</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Select the correct option from given choices.</p>
              </div>
            </button>

            {availableTypes.theory && (
              <button 
                onClick={() => handleTypeSelect('theory')}
                className="p-8 rounded-[32px] bg-white border border-gray-200 shadow-sm hover:border-amber/50 hover:bg-amber/5 transition-all group text-left space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-amber" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Theory (AI Check)</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Type your answer and let AI evaluate your correctness.</p>
                </div>
              </button>
            )}
          </div>

          <button 
            onClick={() => setQuizStep('mode')}
            className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-2 mx-auto"
          >
            <X className="w-4 h-4" /> Go Back
          </button>
        </div>
      </main>
    );
  }

  if (quizStep === 'count') {
    return (
      <main className="min-h-screen bg-slate-50 text-gray-900 flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-xl w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#146ef5]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-[#146ef5]" />
            </div>
            <h1 className="text-4xl font-display font-bold">Select Length</h1>
            <p className="text-gray-500">How many questions would you like to answer?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[10, 20, 30, 40, 50, 0].map((count) => (
              <button 
                key={count}
                onClick={() => handleCountSelect(count)}
                className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm hover:border-[#146ef5]/50 hover:bg-[#146ef5]/5 transition-all group"
              >
                <div className="text-3xl font-display font-black text-gray-900 mb-1">{count === 0 ? 'All' : count}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Questions</div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setQuizStep('type')}
            className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-2 mx-auto"
          >
            <X className="w-4 h-4" /> Change Type
          </button>
        </div>
      </main>
    );
  }

  if (quizStep === 'duration') {
    return (
      <main className="min-h-screen bg-slate-50 text-gray-900 flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-xl w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#146ef5]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Timer className="w-10 h-10 text-[#146ef5]" />
            </div>
            <h1 className="text-4xl font-display font-bold">Time Per Question</h1>
            <p className="text-gray-500">Set a time limit for each question.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 5, 10, 15, 20, 25, 30].map((mins) => (
              <button 
                key={mins}
                onClick={() => handleDurationSelect(mins * 60)}
                className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm hover:border-[#146ef5]/50 hover:bg-[#146ef5]/5 transition-all group"
              >
                <div className="text-3xl font-display font-black text-gray-900 mb-1">{mins}m</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{mins * 60} Seconds</div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setQuizStep('count')}
            className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-2 mx-auto"
          >
            <X className="w-4 h-4" /> Change Question Count
          </button>
        </div>
      </main>
    );
  }

  if (isExamCompleted) {
    const score = examResults.filter(r => r.isCorrect).length;
    const total = examResults.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <main className="min-h-screen bg-slate-50 text-gray-900 p-6 md:p-12 overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Summary */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#146ef5]/10 border border-[#146ef5]/20 text-[#146ef5] font-bold text-xs uppercase tracking-widest mb-4">
              <Check className="w-4 h-4" /> Exam Completed
            </div>
            <h1 className="text-5xl font-display font-bold">Great Effort!</h1>
            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{score}/{total}</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Score</div>
              </div>
              <div className="w-px h-12 bg-gray-100" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${percentage >= 70 ? 'text-[#146ef5]' : 'text-amber'}`}>{percentage}%</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-500">
                <Zap className="w-4 h-4" />
              </div>
              Detailed Breakdown
            </h3>
            
            {examResults.map((res, idx) => (
              <div key={idx} className="p-8 rounded-[32px] bg-white border border-gray-200  space-y-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Question {idx + 1}</div>
                       <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-[#146ef5]/10 text-[8px] font-black text-[#146ef5] uppercase">
                            {res.topic?.subject?.exam?.name || "Practice"}
                          </span>
                          {res.year && (
                            <span className="px-1.5 py-0.5 rounded bg-white text-[8px] font-black text-gray-500">
                              {res.year}
                            </span>
                          )}
                       </div>
                    </div>
                    <p className="text-lg font-bold leading-relaxed">{res.bodyText}</p>
                  </div>
                  <div className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${res.isCorrect ? 'bg-[#146ef5]/10 border-[#146ef5]/20 text-[#146ef5]' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                    {res.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Answer</div>
                  {res.type === 'mcq' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${res.isCorrect ? 'bg-[#146ef5] text-white text-navy' : 'bg-red-500 text-gray-900'}`}>
                          {(() => {
                            const opt = res.options?.find((o: any) => o.id === res.selectedOptionId);
                            return opt ? String.fromCharCode(65 + opt.orderIndex) : '?';
                          })()}
                        </div>
                        <p className="text-sm text-gray-900">
                          {res.options?.find((o: any) => o.id === res.selectedOptionId)?.optionText || "No option selected"}
                        </p>
                      </div>
                      
                      {!res.isCorrect && (
                        <div className="pt-2 border-t border-gray-200 flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-[#146ef5] text-white flex items-center justify-center text-[10px] font-black text-navy">
                            {(() => {
                              const opt = res.options?.find((o: any) => o.id === res.correctOptionId);
                              return opt ? String.fromCharCode(65 + opt.orderIndex) : '?';
                            })()}
                          </div>
                          <p className="text-sm text-[#146ef5] font-bold">
                            Correct Answer: {res.options?.find((o: any) => o.id === res.correctOptionId)?.optionText}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">{res.textAnswer || "No answer provided"}</p>
                  )}
                </div>

                {!res.isCorrect && (
                   <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                      <div className="text-[10px] font-bold text-amber uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" /> Step-by-Step Explanation
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed italic">{res.explanation}</p>
                   </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-12">
            <Button 
               onClick={() => router.push('/dashboard')}
               className="px-12 py-6 rounded-2xl bg-[#146ef5] text-white hover:bg-blue-600 hover:scale-105 shadow-md font-bold text-lg"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const question = questions[currentIndex];
  // Sort options if backend didn't already
  const options = question?.options ? [...question.options].sort((a, b) => a.orderIndex - b.orderIndex) : [];

  return (
    <main className="min-h-screen bg-slate-50 text-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-200 bg-slate-50/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="flex flex-col">
            <div className="text-[10px] md:text-xs font-bold text-gray-500">Question {currentIndex + 1} of {questions.length}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="px-1.5 py-0.5 rounded-md bg-[#146ef5]/10 border border-[#146ef5]/20 text-[8px] md:text-[10px] font-black text-[#146ef5] uppercase">
                 {question.topic?.subject?.exam?.name || "Practice"}
               </span>
               {question.year && (
                 <span className="px-1.5 py-0.5 rounded-md bg-white border border-gray-200 shadow-sm text-[8px] md:text-[10px] font-black text-gray-500">
                   {question.year}
                 </span>
               )}
            </div>
          </div>        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              if (questions[currentIndex] && confirm("Report this question for an error or issue?")) {
                api.post('/moderation/report', { 
                  type: 'question', 
                  targetId: questions[currentIndex].id, 
                  reason: 'Question error' 
                });
                toast.success("Report submitted. Thank you!");
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Report Question</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
            <Timer className={`w-4 h-4 ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-[#146ef5]'}`} />
            <span className={`text-sm font-mono font-bold ${timeLeft < 20 ? 'text-red-500' : 'text-gray-900'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white">
        <div 
          className="h-full bg-[#146ef5] text-white transition-all duration-500" 
          style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }} 
        />
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col">
        {/* Difficulty Badge */}
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full bg-[#146ef5]/10 border border-[#146ef5]/20 text-[10px] font-bold text-[#146ef5] tracking-widest uppercase">
            {question.difficulty || "Standard"}
          </span>
        </div>

        {/* Question Area */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold leading-tight mb-8">
            {renderTextWithMath(question.bodyText)}
          </h2>
          
          {question.bodyImageUrl && (
            <div className="w-full aspect-video rounded-2xl bg-white border border-gray-200 shadow-sm mb-8 overflow-hidden">
                 <img src={question.bodyImageUrl} className="w-full h-full object-contain" alt="Question Resource" />
            </div>
          )}

          {/* Hint Display */}
          {showHint && (
            <div className="mt-6 p-5 rounded-2xl bg-amber/10 border border-amber/20 text-amber animate-in fade-in slide-in-from-top-2">
               <div className="font-bold flex items-center gap-2 mb-2">
                 <Brain className="w-4 h-4" /> Hint:
               </div>
               <p className="text-sm opacity-90">Think carefully. Eliminating absolute options is often a good start.</p>
            </div>
          )}

          {/* Explanation Display */}
          {(quizMode === 'study' && serverVerified && explanation) && (
            <div className={`mt-6 p-5 rounded-2xl animate-in fade-in slide-in-from-top-2 ${isCorrect ? 'bg-[#146ef5]/10 border border-[#146ef5]/20' : 'bg-red-500/10 border border-red-500/20'}`}>
               <div className={`font-bold flex items-center gap-2 mb-2 ${isCorrect ? 'text-[#146ef5]' : 'text-red-500'}`}>
                 <CheckCircle2 className="w-4 h-4" /> Explanation:
               </div>
               <p className="text-sm opacity-90">{explanation}</p>
            </div>
          )}
        </div>

        {/* Options Grid or Theory Input */}
        {questionType === 'mcq' ? (
          <div className="grid grid-cols-1 gap-4 mb-12">
            {options.map((opt: any) => {
              const isUserSelected = selectedOption === opt.id;
              const isActuallyCorrect = serverVerified && opt.id === correctOptionId;
              const isWrongSelection = serverVerified && isUserSelected && opt.id !== correctOptionId;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={isAnswered || hiddenOptionIds.includes(opt.id)}
                  className={`
                    relative w-full p-6 rounded-2xl border text-left transition-all group
                    ${isUserSelected && !serverVerified ? 'border-[#146ef5] bg-[#146ef5]/5 ring-0' : 'border-gray-200 shadow-sm bg-white hover:border-gray-300'}
                    ${isActuallyCorrect && quizMode === 'study' ? 'border-[#146ef5] bg-[#146ef5]/10 ring-2 ring-[#146ef5]/50' : ''}
                    ${isWrongSelection && quizMode === 'study' ? 'border-red-500 bg-red-500/10' : ''}
                    ${hiddenOptionIds.includes(opt.id) ? 'opacity-20 grayscale scale-95 pointer-events-none' : ''}
                    ${quizMode === 'exam' && isAnswered && isUserSelected ? 'border-[#146ef5] bg-[#146ef5]/10' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors shrink-0
                      ${isUserSelected && !serverVerified ? 'bg-[#146ef5] text-white text-navy' : 'bg-white text-gray-500 group-hover:bg-gray-100'}
                      ${isActuallyCorrect && quizMode === 'study' ? 'bg-[#146ef5] text-white text-navy' : ''}
                      ${isWrongSelection && quizMode === 'study' ? 'bg-red-500 text-gray-900' : ''}
                      ${quizMode === 'exam' && isUserSelected && isAnswered ? 'bg-[#146ef5] text-white' : ''}
                    `}>
                      {String.fromCharCode(65 + opt.orderIndex)}
                    </div>
                    <span className={`flex-1 font-medium ${isUserSelected || (isActuallyCorrect && quizMode === 'study') ? 'text-gray-900' : 'text-gray-500'}`}>
                      {renderTextWithMath(opt.optionText)}
                      {hiddenOptionIds.includes(opt.id) && <span className="ml-2 text-xs opacity-50 italic">(Eliminated)</span>}
                    </span>
                    
                    {isActuallyCorrect && quizMode === 'study' && <CheckCircle2 className="w-6 h-6 text-[#146ef5] shrink-0" />}
                    {isWrongSelection && quizMode === 'study' && <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />}
                    {quizMode === 'exam' && isUserSelected && isAnswered && <Check className="w-6 h-6 text-[#146ef5] shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-12 space-y-4">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Answer</div>
            <textarea
              value={theoryAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type your detailed answer here..."
              className={`
                w-full min-h-[200px] p-6 rounded-3xl bg-white border border-gray-200 shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#146ef5]/50 transition-all resize-none
                ${isAnswered ? 'opacity-50' : 'hover:border-gray-300'}
              `}
            />
            {isAnswered && !serverVerified && (
              <div className="flex items-center gap-3 text-[#146ef5] animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">AI is evaluating your response...</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto flex flex-col md:flex-row md:justify-between items-center gap-4 pt-8 border-t border-gray-200">
          {questionType === 'mcq' ? (
            <Button
              variant="ghost"
              className={`w-full md:w-auto flex gap-2 transition-colors order-2 md:order-1 ${hintsUsed >= 2 ? 'text-gray-700 cursor-default' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={handleHint}
              disabled={hintsUsed >= 2 || isAnswered}
            >
              <Brain className="w-4 h-4" />
              {hintsUsed >= 2 ? 'Max Hints' : `Used ${hintsUsed}/2 Hints (2 coins)`}
            </Button>
          ) : <div className="order-2 md:order-1" />}

          <div className="w-full md:w-auto order-1 md:order-2">
            {!serverVerified ? (
              <Button
                disabled={(questionType === 'mcq' ? selectedOption === null : !theoryAnswer.trim()) || isAnswered}
                onClick={handleVerify}
                className="w-full md:px-12 py-6 text-lg font-bold bg-[#146ef5] text-white hover:bg-blue-600 hover:scale-105 shadow-md rounded-xl"
              >
                {isAnswered ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (quizMode === 'exam' ? "Save & Next" : "Verify Answer")}
              </Button>
            ) : (
              <Button
                onClick={handleContinue}
                className="w-full md:px-12 py-6 text-lg font-bold bg-[#146ef5] text-white hover:bg-blue-600 hover:scale-105 shadow-md rounded-xl flex gap-2 justify-center"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#146ef5] animate-spin" />
      </main>
    }>
      <QuizContent />
    </Suspense>
  );
}
