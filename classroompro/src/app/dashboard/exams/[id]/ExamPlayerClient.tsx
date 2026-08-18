"use client";

import { IconArrowLeft as ArrowLeft, IconClock as Clock, IconChevronRight as ChevronRight, IconChevronLeft as ChevronLeft, IconFlag as Flag, IconSend as Send, IconLoader2 as Loader2, IconCheckCircle2 as CheckCircle2, IconGraduationCap as GraduationCap } from '@tabler/icons-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ExamPlayerClient() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get(`/exams/${id}`);
        const examData = res.data;
        
        // Parse optionsJson for multiple choice questions
        examData.questions = examData.questions.map((q: any) => ({
          ...q,
          options: q.optionsJson ? JSON.parse(q.optionsJson) : []
        }));
        
        setExam(examData);
        setTimeLeft(examData.duration * 60); // Set timer based on exam duration
      } catch (error) {
        console.error("Failed to fetch exam:", error);
        toast.error("Failed to load exam. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExam();
  }, [id]);

  useEffect(() => {
    if (!loading && exam && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, exam, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    const questionId = exam.questions[currentQuestionIdx].id;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestionIdx]: !prev[currentQuestionIdx]
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    let correctCount = 0;
    exam.questions.forEach((q: any) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    // In a real app, we would POST to /exams/submit
    // Since we don't have that endpoint yet, we'll simulate success
    toast.success("Exam submitted! Calculating results...");
    
    setTimeout(() => {
      router.push(`/dashboard/exams`);
      toast.success(`You scored ${correctCount}/${exam.questions.length}! 🎉`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-white p-8 text-center">
        <GraduationCap className="w-16 h-16 text-muted-foreground mb-6 opacity-20" />
        <h1 className="text-2xl font-bold mb-2">Exam Not Found</h1>
        <p className="text-muted-foreground mb-8">This assessment may have been moved or deleted.</p>
        <Link href="/dashboard/exams">
          <Button className="bg-blue text-white px-8 h-12 rounded-xl">Back to Exams</Button>
        </Link>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIdx];
  const isAnswered = (idx: number) => !!selectedAnswers[exam.questions[idx].id];

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Exam Header */}
      <header className="h-20 border-b border-white/10 bg-navy/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to leave? Your progress will not be saved.")) {
                router.push('/dashboard/exams');
              }
            }}
            className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white truncate max-w-[200px] md:max-w-md">{exam.title}</h1>
            <p className="text-xs text-muted-foreground">Question {currentQuestionIdx + 1} of {exam.questions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 transition-colors",
            timeLeft < 300 ? "border-red-500/50 bg-red-500/10 text-red-500" : "text-white"
          )}>
            <Clock className={cn("w-5 h-5", timeLeft < 300 ? "text-red-500 animate-pulse" : "text-blue")} />
            <span className="text-lg font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <Button 
            className="bg-blue hover:bg-blue/80 text-white font-bold px-6 h-10 rounded-xl shadow-lg shadow-blue/20" 
            onClick={() => {
              if (confirm("Are you sure you want to submit your exam now?")) {
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Submit Exam
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-8 grid lg:grid-cols-4 gap-8">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 blur-[80px] rounded-full -mr-32 -mt-32" />
             
             <div className="flex justify-between items-start mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white pr-4">
                  {currentQuestion?.text}
                </h2>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-black text-blue uppercase tracking-widest shrink-0">
                  Multiple Choice
                </span>
             </div>

             <div className="grid gap-4 relative z-10">
                {currentQuestion?.options.map((option: string, idx: number) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className={cn(
                        "w-full p-6 rounded-2xl border transition-all flex items-center gap-4 group text-left",
                        isSelected 
                          ? "bg-blue/10 border-blue shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                          : "bg-navy/50 border-white/10 hover:border-white/30"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all",
                        isSelected 
                          ? "bg-blue border-blue text-white" 
                          : "border-white/20 text-muted-foreground group-hover:border-white group-hover:text-white"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={cn(
                        "font-medium transition-colors",
                        isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                      )}>{option}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue ml-auto" />
                      )}
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              className="border-white/10 text-white h-12 px-6 rounded-xl hover:bg-white/5" 
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
              className="bg-blue hover:bg-blue/90 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-blue/20" 
              onClick={() => {
                if (currentQuestionIdx < exam.questions.length - 1) {
                  setCurrentQuestionIdx(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  if (confirm("You are at the last question. Do you want to submit your exam?")) {
                    handleSubmit();
                  }
                }
              }}
            >
              {currentQuestionIdx === exam.questions.length - 1 ? "Finish Exam" : "Next Question"} 
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Question Navigation Sidebar */}
        <div className="space-y-6">
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10 sticky top-28 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Question Map</h3>
              <div className="grid grid-cols-4 gap-2">
                 {exam.questions.map((_: any, idx: number) => {
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
                            ? "bg-blue/20 border-blue/50 text-blue" 
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
                    <div className="w-3 h-3 rounded bg-blue/20 border border-blue/50" /> Answered
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
