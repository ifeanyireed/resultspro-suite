"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconTrophy as Trophy, IconCircleCheck as CheckCircle2, IconCircleX as XCircle, IconClock as Clock, IconArrowRight as ArrowRight, IconRotateCcw as RotateCcw, IconShare2 as Share2, IconChevronLeft as ChevronLeft, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function QuizResultsClient() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const status = percentage >= 70 ? "Passed" : "Failed";

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Quiz Results" />
      
      <main className="p-8 max-w-4xl mx-auto space-y-8">
        <Link href="/dashboard/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Quizzes
        </Link>

        {/* Hero Result Card */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full -z-10">
              <div className="absolute top-0 right-1/4 w-64 h-64 bg-green/10 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue/10 blur-[80px] rounded-full" />
           </div>

           <div className={cn(
             "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4",
             status === "Passed" ? "bg-green/10 text-green border-green/20" : "bg-red-500/10 text-red-500 border-red-500/20"
           )}>
              <Trophy className="w-12 h-12" />
           </div>

           <h2 className={cn(
             "text-[10px] font-bold uppercase tracking-[0.3em] mb-2",
             status === "Passed" ? "text-green" : "text-red-500"
           )}>
             {status === "Passed" ? "Congratulations!" : "Keep Practicing!"}
           </h2>
           <h1 className="text-4xl font-bold text-white mb-2 font-display">You {status}!</h1>
           <p className="text-muted-foreground mb-8">{quiz?.title || "Topic Quiz"}</p>

           <div className="flex justify-center items-end gap-2 mb-10">
              <span className="text-7xl font-bold text-white leading-none">{percentage}</span>
              <span className="text-2xl font-bold text-muted-foreground mb-1">%</span>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-white/5 pt-10">
              <div className="text-center">
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Correct</div>
                 <div className="text-xl font-bold text-white">{score}/{total}</div>
              </div>
              <div className="text-center border-l border-white/5">
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Time</div>
                 <div className="text-xl font-bold text-white">--:--</div>
              </div>
              <div className="text-center border-l border-white/5">
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Rank</div>
                 <div className="text-xl font-bold text-white">#--</div>
              </div>
              <div className="text-center border-l border-white/5">
                 <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Points</div>
                 <div className="text-xl font-bold text-green">+{score * 10}</div>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
           <Link href="/dashboard/subjects" className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 rounded-2xl text-lg">
                 Continue Learning <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
           </Link>
           <Link href={`/dashboard/quizzes/${id}`} className="flex-1">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white h-14 rounded-2xl font-bold">
                 <RotateCcw className="mr-2 w-5 h-5" /> Retake Quiz
              </Button>
           </Link>
           <Button variant="outline" className="w-14 h-14 p-0 border-white/10 hover:bg-white/5 text-white rounded-2xl">
              <Share2 className="w-5 h-5" />
           </Button>
        </div>

        {/* Breakdown section */}
        <div className="space-y-6 pt-8">
           <h3 className="text-xl font-bold text-white font-display">Performance Breakdown</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center text-green shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                 </div>
                 <div>
                    <div className="text-lg font-bold text-white">Accuracy</div>
                    <p className="text-xs text-muted-foreground">You got {score} out of {total} questions correct.</p>
                 </div>
              </div>
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center text-amber shrink-0">
                    <Clock className="w-8 h-8" />
                 </div>
                 <div>
                    <div className="text-lg font-bold text-white">Speed</div>
                    <p className="text-xs text-muted-foreground">Great job completing the assessment!</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
