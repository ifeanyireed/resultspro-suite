"use client";

import { 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Flag,
  Send,
  Loader2,
  CheckCircle2,
  BrainCircuit,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function QuizPlayerClient() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes default
  const [evaluating, setEvaluating] = useState(false);
  const [theoryEvaluation, setTheoryEvaluation] = useState<Record<string, any>>({});
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        const quizData = res.data;
        
        // Parse optionsJson if it's a string
        quizData.questions = quizData.questions.map((q: any) => ({
          ...q,
          options: q.optionsJson ? (typeof q.optionsJson === 'string' ? JSON.parse(q.optionsJson) : q.optionsJson) : []
        }));
        
        setQuiz(quizData);

        // Check if bookmarked
        const bookmarksRes = await api.get('/bookmarks?type=QUIZ');
        const bookmarks = Array.isArray(bookmarksRes.data) ? bookmarksRes.data : [];
        setIsBookmarked(bookmarks.some((b: any) => b.contentId === id));
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        toast.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const res = await api.post('/bookmarks/toggle', { contentType: 'QUIZ', contentId: id });
      setIsBookmarked(res.data.status === 'marked');
      toast.success(res.data.status === 'marked' ? "Saved quiz" : "Removed from collection");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    if (!loading && quiz) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, quiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    const questionId = quiz.questions[currentQuestionIdx].id;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const evaluateTheory = async () => {
    const questionId = quiz.questions[currentQuestionIdx].id;
    const answer = selectedAnswers[questionId];
    
    if (!answer) {
      toast.error("Please type an answer first");
      return;
    }

    setEvaluating(true);
    try {
      const res = await api.post('/quizzes/evaluate-theory', {
        questionId,
        studentAnswer: answer
      });
      setTheoryEvaluation(prev => ({
        ...prev,
        [questionId]: res.data
      }));
      toast.success("AI evaluation complete!");
    } catch (error: any) {
      console.error("Evaluation error:", error);
      toast.error(error.response?.data?.error || "AI evaluation failed");
    } finally {
      setEvaluating(false);
    }
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestionIdx]: !prev[currentQuestionIdx]
    }));
  };

  const handleSubmit = async () => {
    // For now, let's calculate score and redirect to results
    let correctCount = 0;
    quiz.questions.forEach((q: any) => {
      if (q.type === 'THEORY') {
        // Use AI score if available, otherwise 0
        const evalData = theoryEvaluation[q.id];
        if (evalData && evalData.score >= 7) {
          correctCount++;
        }
      } else {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    toast.success("Quiz submitted successfully!");
    router.push(`/dashboard/quizzes/${id}/results?score=${correctCount}&total=${quiz.questions.length}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
        <Link href="/dashboard/quizzes">
          <Button>Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const isAnswered = (idx: number) => !!selectedAnswers[quiz.questions[idx].id];

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Quiz Header */}
      <header className="h-20 border-b border-white/10 bg-navy/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quizzes" className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white truncate max-w-[200px] md:max-w-md">{quiz.title}</h1>
            <p className="text-xs text-muted-foreground">Question {currentQuestionIdx + 1} of {quiz.questions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleBookmark}
            className={cn(
              "border-white/10 text-white hover:bg-white/5 transition-all hidden md:flex",
              isBookmarked && "bg-green/10 text-green border-green/20"
            )}
          >
            {isBookmarked ? (
              <><BookmarkCheck className="w-4 h-4 mr-2" /> Saved</>
            ) : (
              <><Bookmark className="w-4 h-4 mr-2" /> Save</>
            )}
          </Button>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Clock className="w-5 h-5 text-green" />
            <span className="text-lg font-mono font-bold text-white">{formatTime(timeLeft)}</span>
          </div>
          <Button className="bg-green text-navy font-bold px-6 h-10 rounded-xl" onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" /> Submit
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-8 grid lg:grid-cols-4 gap-8">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 blur-[80px] rounded-full -mr-32 -mt-32" />
             
             <div className="flex justify-between items-start mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white pr-4">
                  {currentQuestion?.text}
                </h2>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-black text-blue uppercase tracking-widest shrink-0">
                  {currentQuestion?.type === 'THEORY' ? 'Theory' : 'Multiple Choice'}
                </span>
             </div>

             <div className="space-y-4 relative z-10">
                {currentQuestion?.type === 'THEORY' ? (
                  <div className="space-y-4">
                    <textarea 
                      value={selectedAnswers[currentQuestion.id] || ""}
                      onChange={(e) => handleOptionSelect(e.target.value)}
                      placeholder="Type your answer here in detail..."
                      className="w-full min-h-[200px] p-6 rounded-2xl border border-white/10 bg-navy/20 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
                    />
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        className="bg-blue hover:bg-blue/90 text-white font-bold h-10 rounded-xl"
                        onClick={evaluateTheory}
                        disabled={evaluating || !selectedAnswers[currentQuestion.id]}
                      >
                        {evaluating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                        Evaluate with Mistral AI
                      </Button>
                    </div>
                    {theoryEvaluation[currentQuestion.id] && (
                      <div className="p-6 rounded-2xl bg-green/5 border border-green/20 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-green uppercase tracking-[0.2em]">AI Feedback</span>
                          <span className="px-3 py-1 rounded-full bg-green/20 text-green font-bold text-sm">
                            Score: {theoryEvaluation[currentQuestion.id].score}/10
                          </span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed italic">"{theoryEvaluation[currentQuestion.id].feedback}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  currentQuestion?.options.map((option: string, idx: number) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === option;
                    return (
                      <button 
                        key={idx}
                        onClick={() => handleOptionSelect(option)}
                        className={cn(
                          "w-full p-6 rounded-2xl border transition-all flex items-center gap-4 group text-left",
                          isSelected 
                            ? "bg-green/10 border-green shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                            : "bg-navy/50 border-white/10 hover:border-white/30"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all",
                          isSelected 
                            ? "bg-green border-green text-navy" 
                            : "border-white/20 text-muted-foreground group-hover:border-white group-hover:text-white"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={cn(
                          "font-medium transition-colors",
                          isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                        )}>{option}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-green ml-auto" />
                        )}
                      </button>
                    );
                  })
                )}
             </div>
          </div>

          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              className="border-white/10 text-white h-12 px-6 rounded-xl" 
              disabled={currentQuestionIdx === 0} 
              onClick={() => {
                setCurrentQuestionIdx(prev => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            <Button 
              variant="outline" 
              className={cn(
                "border-white/10 h-12 px-6 rounded-xl transition-all",
                flaggedQuestions[currentQuestionIdx] ? "bg-amber/10 border-amber text-amber" : "text-amber hover:bg-amber/10"
              )}
              onClick={toggleFlag}
            >
              <Flag className={cn("w-4 h-4 mr-2", flaggedQuestions[currentQuestionIdx] && "fill-current")} />
              {flaggedQuestions[currentQuestionIdx] ? "Flagged" : "Flag for Review"}
            </Button>

            <Button 
              className="bg-blue hover:bg-blue/90 text-white h-12 px-8 rounded-xl font-bold" 
              onClick={() => {
                if (currentQuestionIdx < quiz.questions.length - 1) {
                  setCurrentQuestionIdx(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  handleSubmit();
                }
              }}
            >
              {currentQuestionIdx === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"} 
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Question Navigation Sidebar */}
        <div className="space-y-6">
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10 sticky top-28 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Question Map</h3>
              <div className="grid grid-cols-5 gap-2">
                 {quiz.questions.map((_: any, idx: number) => {
                   const answered = isAnswered(idx);
                   const flagged = flaggedQuestions[idx];
                   const active = idx === currentQuestionIdx;
                   
                   return (
                     <button 
                      key={idx}
                      onClick={() => {
                        setCurrentQuestionIdx(idx);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={cn(
                        "aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-all relative",
                        active 
                          ? "bg-white/10 border-blue text-blue scale-110 z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                          : answered 
                            ? "bg-green/20 border-green/50 text-green" 
                            : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/30"
                      )}
                     >
                       {idx + 1}
                       {flagged && (
                         <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber rounded-full shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                       )}
                     </button>
                   );
                 })}
              </div>
              <div className="mt-6 space-y-3 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold">
                    <div className="w-3 h-3 rounded bg-green/20 border border-green/50" /> Answered
                 </div>
                 <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Unanswered
                 </div>
                 <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10 relative">
                       <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber rounded-full" />
                    </div> Flagged
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
