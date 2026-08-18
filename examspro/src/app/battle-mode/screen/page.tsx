"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Timer, 
  Coins, 
  Sword, 
  Zap, 
  Target,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Loader2,
  Flag
} from 'lucide-react';
import { useBattle } from '@/hooks/useBattle';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Modal } from '@/components/ui/modal';
import toast from 'react-hot-toast';

function BattleScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const battleIdParam = searchParams.get('battleId');
  const { user } = useAuthStore();
  const { 
    status, 
    battleId,
    opponent, 
    questions, 
    opponentProgress, 
    opponentScore, 
    finalResult,
    updateProgress,
    submitFinalScore,
    finish
  } = useBattle(battleIdParam);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timeLeftRef = useRef(60);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [streak, setStreak] = useState(0);
  const [roomData, setRoomData] = useState<any>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isUserFinished, setIsUserFinished] = useState(false);
  const [isBotFinished, setIsBotFinished] = useState(false);
  
  // Bot Simulation State
  const [botProgress, setBotProgress] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const botQuestionIdx = useRef(0);
  const botTimerRef = useRef<any>(null);

  // Report State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const playSound = (soundName: string) => {
    if (roomData?.soundActivated === false) return;
    const audio = new Audio(`/sounds/${soundName}`);
    audio.play().catch(err => console.error("Error playing sound:", err));
  };

  useEffect(() => {
    if (battleId) {
      api.get(`/battles/${battleId}`).then(res => {
        setRoomData(res.data);
      }).catch(() => {});
    }
  }, [battleId]);

  // Bot Simulation logic
  useEffect(() => {
    if (!roomData?.isBot || status !== 'active' || !questions.length || isBotFinished || isFinishing) {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
      return;
    }

    const simulateBotMove = () => {
      // Don't start a move if the game isn't active
      if (status !== 'active' || isFinishing) return;

      if (botQuestionIdx.current >= questions.length) {
        setIsBotFinished(true);
        return;
      }

      // Random delay between 4-12 seconds per question
      const delay = Math.floor(Math.random() * 8000) + 4000;

      botTimerRef.current = setTimeout(() => {
        // Double check state inside timeout
        if (status !== 'active' || isFinishing) return;

        const isCorrect = Math.random() > 0.3; // 70% accuracy for bot
        if (isCorrect) {
          // Use a simulated time-bonus similar to human using Ref
          setBotScore(prev => prev + 100 + (Math.max(10, timeLeftRef.current - 5) * 2));
        }
        
        botQuestionIdx.current += 1;
        const progress = (botQuestionIdx.current / questions.length) * 100;
        setBotProgress(progress);

        if (botQuestionIdx.current < questions.length) {
          simulateBotMove();
        } else {
          setIsBotFinished(true);
        }
      }, delay);
    };

    simulateBotMove();
    return () => { if (botTimerRef.current) clearTimeout(botTimerRef.current); };
  }, [roomData?.isBot, status, questions.length, isBotFinished, isFinishing]);

  // Unified Match Completion Check (Bot Battle)
  useEffect(() => {
    if (roomData?.isBot && isUserFinished && isBotFinished && !isFinishing) {
       setIsFinishing(true);
       submitFinalScore(score, botScore);
       finish();
    }
  }, [isUserFinished, isBotFinished, roomData?.isBot, score, botScore, isFinishing, submitFinalScore, finish]);

  // Sync Score state with Ref
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Global Timer logic (Synced with server startedAt)
  useEffect(() => {
    if (status !== 'active' || !questions.length || !roomData?.startedAt || isFinishing) return;
    
    const interval = setInterval(() => {
      const startedAt = new Date(roomData.startedAt).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startedAt) / 1000);
      const remaining = Math.max(0, (roomData.duration || 60) - elapsed);
      
      setTimeLeft(remaining);
      timeLeftRef.current = remaining;

      if (remaining === 0) {
        clearInterval(interval);
        // Force completion on timeout for all battle types
        setIsFinishing(true);
        if (roomData?.isBot) {
          submitFinalScore(scoreRef.current, botScore);
        } else {
          submitFinalScore(scoreRef.current);
        }
        finish();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, questions.length, roomData, submitFinalScore, isFinishing, botScore, finish]);

  useEffect(() => {
    if (status === 'active' && questions.length > 0) {
      playSound('game_starts.mp3');
    }
  }, [status, questions.length]);

  useEffect(() => {
    // Only redirect if we are truly idle and have no battle ID at all
    if (status === 'idle' && !battleId) {
      const timer = setTimeout(() => {
        router.push('/battle-mode');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router, battleId]);

  // Redirection Logic
  useEffect(() => {
    if ((status === 'finished' || isFinishing) && finalResult) {
      const timer = setTimeout(() => {
        router.push(`/battle-mode/result?battleId=${battleId}`); 
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, finalResult, router, battleId, isFinishing]);

  // Fallback: If stuck in isFinishing, check API for completion
  useEffect(() => {
    if (!isFinishing || finalResult || status === 'finished') return;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/battles/${battleId}`);
        if (res.data.status === 'completed') {
           // We found it via API fallback
           router.push(`/battle-mode/result?battleId=${battleId}`);
        }
      } catch (e) {}
    };

    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [isFinishing, finalResult, status, battleId, router]);

  useEffect(() => {
    if (timeLeft === 47) {
      playSound('47s_remaining.mp3');
    }
  }, [timeLeft]);

  const currentQuestion = questions[currentQuestionIdx];

  const handleAnswerSubmit = () => {
    if (!selectedOption || !currentQuestion) return;
    setIsAnswered(true);

    const isCorrect = currentQuestion.options?.find((o: any) => o.id === selectedOption)?.isCorrect;
    
    if (isCorrect) playSound('correct_answer.mp3');
    else playSound('wrong_answer.mp3');

    handleNextQuestion(!!isCorrect);
  };

  const handleNextQuestion = (isCorrect: boolean) => {
    if (!questions.length) return;
    
    let newScore = score;
    let newStreak = streak;

    if (isCorrect) {
      newScore += 100 + (timeLeft * 2); // Time bonus
      newStreak += 1;
    } else {
      newStreak = 0;
    }

    setScore(newScore);
    setStreak(newStreak);

    // Calculate progress percentage
    const progress = ((currentQuestionIdx + 1) / questions.length) * 100;
    
    // Broadcast progress to opponent
    updateProgress(newScore, progress);

    setTimeout(() => {
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Battle finished for this user
        if (roomData?.isBot) {
          setIsUserFinished(true);
          // Don't submit yet - wait for bot in Unified Check effect
        } else {
          setIsFinishing(true);
          submitFinalScore(newScore);
          finish();
        }
      }
    }, 2000); // 2 second pause to see result
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason || !currentQuestion) return;
    
    setIsSubmittingReport(true);
    try {
      await api.post('/moderation/report', {
        type: 'question',
        targetId: currentQuestion.id,
        reason: reportReason
      });
      toast.success("Question reported. Thank you for your feedback!");
      setIsReportModalOpen(false);
      setReportReason("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (!user || status === 'idle' || status === 'searching' || (status === 'active' && questions.length === 0)) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Arena Data...</p>
        <p className="text-gray-600 text-[10px] mt-2">Status: {status} | Questions: {questions.length}</p>
      </div>
    );
  }

  // Calculate your own progress visually
  const myProgress = questions.length > 0 ? ((currentQuestionIdx + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-navy text-white flex flex-col overflow-hidden">
      {/* Top Battle Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 md:px-8 py-4 bg-navy border-b border-white/5 shadow-2xl">
        {/* Player 1 (You) */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-blue/20 border-2 border-blue p-0.5 flex items-center justify-center font-bold text-xl">
              {user.name?.[0] || user.email[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-blue text-[8px] font-black uppercase border-2 border-navy">YOU</div>
          </div>
          <div>
            <div className="text-xs font-black text-white">{currentQuestionIdx + 1}/{questions.length || 10}</div>
            <div className="w-24 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-blue transition-all duration-500" style={{ width: `${myProgress}%` }} />
            </div>
            <div className="text-[10px] text-gray-500 mt-1 font-bold">{score} pts</div>
          </div>
        </div>

        {/* Center Timer & Stake */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/[0.1] border-t-white/[0.15]">
            <div className="flex flex-col items-center">
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Stake</div>
              <div className="flex items-center gap-1 text-amber">
                <Coins className="w-3 h-3" />
                <span className="text-xs font-black">{roomData?.stakePerPlayer || '--'}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Room</div>
              <div className="text-[10px] font-black text-blue uppercase">
                #{roomData?.roomCode || (battleId && battleId.length === 6 ? battleId : (battleId ? battleId.split('-')[0] : '----'))}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Time</div>
              <div className={`text-sm font-mono font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-green'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Player 2 (Opponent) */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 mb-1 font-bold">{roomData?.isBot ? botScore : opponentScore} pts</div>
            <div className="w-24 h-1.5 bg-white/5 rounded-full mb-1 overflow-hidden ml-auto">
              <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${roomData?.isBot ? botProgress : opponentProgress}%` }} />
            </div>
          </div>
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border-2 border-red-500 p-0.5 flex items-center justify-center font-bold text-xl text-red-500">
               {roomData?.isBot ? "C" : (opponent?.name?.[0] || opponent?.email?.[0] || '?')}
            </div>
            <div className="absolute -bottom-2 -left-2 px-2 py-0.5 rounded bg-red-500 text-[8px] font-black uppercase border-2 border-navy text-white">{roomData?.isBot ? "BOT" : "RIVAL"}</div>
          </div>
        </div>
      </div>

      {/* Battle Content */}
      <div className="flex-1 relative flex flex-col md:flex-row">
        {/* Left Side: Opponent Status Overlay (Mobile/Split) */}
        <div className="absolute top-0 right-0 p-4 md:hidden pointer-events-none z-10">
          <div className="bg-navy/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{roomData?.isBot ? "CPU Progress" : "Opponent Progress"}</div>
             <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${roomData?.isBot ? botProgress : opponentProgress}%` }} />
              </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-8 md:p-16 flex flex-col max-w-4xl mx-auto w-full">
          {(status === 'finished' || isFinishing) ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <Trophy className="w-20 h-20 text-amber mb-6" />
                <h2 className="text-4xl font-display font-black text-white mb-2">BATTLE COMPLETE!</h2>
                <p className="text-gray-400 mb-8">Waiting for final results...</p>
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-green animate-spin" />
                  <Button 
                    onClick={() => router.push(`/battle-mode/result?battleId=${battleId}`)}
                    className="mt-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-5000"
                  >
                    View Results Anyway
                  </Button>
                </div>
             </div>
          ) : (
             <>
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Sword className="w-6 h-6 text-red-500" />
                      <h2 className="text-xl font-display font-black italic tracking-tight text-white/50 uppercase">Battle Question {currentQuestionIdx + 1}</h2>
                    </div>
                    <button 
                      onClick={() => setIsReportModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-[10px] font-bold text-gray-500 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all"
                    >
                      <Flag className="w-3 h-3" /> REPORT
                    </button>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight text-white mb-8">
                    {currentQuestion?.bodyText || "Loading question..."}
                  </h1>
                  
                  {/* Split Screen Indicator (Desktop) */}
                  <div className="hidden md:flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] mb-12">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{roomData?.isBot ? "CPU Progress" : "Opponent Progress"}</div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${roomData?.isBot ? botProgress : opponentProgress}%` }} />
                      </div>
                    </div>
                    {streak > 1 && (
                       <div className="flex items-center gap-2 text-amber font-black italic text-sm">
                        <Zap className="w-4 h-4 fill-current animate-pulse" />
                        STREAK: {streak}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion?.options ? currentQuestion.options.map((opt: any, index: number) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = isAnswered && opt.isCorrect;
                    const isWrong = isAnswered && isSelected && !opt.isCorrect;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => !isAnswered && setSelectedOption(opt.id)}
                        disabled={isAnswered}
                        className={`
                          relative p-6 rounded-3xl border text-left transition-all duration-300 group
                          ${isSelected && !isAnswered ? 'border-blue bg-blue/10' : 'border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] hover:bg-white/5 hover:border-white/20'}
                          ${isCorrect ? 'border-green bg-green/10 shadow-[0_0_20px_rgba(0,200,83,0.2)]' : ''}
                          ${isWrong ? 'border-red-500 bg-red-500/10' : ''}
                          ${isAnswered && !isCorrect && !isWrong ? 'opacity-40' : 'opacity-100'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all
                            ${isSelected && !isAnswered ? 'bg-blue text-white' : 'bg-white/5 text-gray-600 group-hover:bg-white/10 group-hover:text-white'}
                            ${isCorrect ? 'bg-green text-navy' : ''}
                            ${isWrong ? 'bg-red-500 text-white' : ''}
                          `}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className={`flex-1 font-bold ${isSelected || isCorrect ? 'text-white' : 'text-gray-400'}`}>
                            {opt.optionText}
                          </span>
                          {isCorrect && <CheckCircle2 className="w-6 h-6 text-green" />}
                          {isWrong && <AlertCircle className="w-6 h-6 text-red-500" />}
                        </div>
                      </button>
                    );
                  }) : (
                    <div className="col-span-full py-12 flex justify-center">
                       <Loader2 className="w-8 h-8 text-blue animate-spin" />
                    </div>
                  )}
                </div>

                <div className="mt-12 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-500 text-xs font-bold">
                    <Target className="w-4 h-4" />
                    Accuracy + Speed = High Score
                  </div>
                  
                  <button 
                    onClick={handleAnswerSubmit}
                    disabled={selectedOption === null || isAnswered}
                    className={`
                      px-12 py-5 rounded-2xl font-black text-lg transition-all
                      ${selectedOption === null ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 
                        isAnswered ? 'bg-gray-800 text-gray-400' : 'bg-green text-navy hover:scale-105 hover:shadow-xl hover:shadow-green/20'}
                    `}
                  >
                    SUBMIT ANSWER
                  </button>
                </div>
             </>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-blue/5 to-transparent pointer-events-none" />

      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Question"
      >
        <form onSubmit={handleReportSubmit} className="space-y-6">
          <p className="text-sm text-gray-400">
            Is there something wrong with this question? Please let us know so we can fix it.
          </p>
          
          <div className="space-y-3">
            {[
              "Incorrect answer",
              "Typo / Spelling error",
              "Images not loading",
              "Confusing wording",
              "Wrong subject / topic",
              "Other issue"
            ].map((reason) => (
              <label 
                key={reason}
                className={`
                  flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all
                  ${reportReason === reason ? 'bg-red-400/10 border-red-400/30 text-red-400' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15] text-gray-400 hover:bg-white/10'}
                `}
              >
                <input 
                  type="radio" 
                  name="reportReason" 
                  value={reason}
                  checked={reportReason === reason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${reportReason === reason ? 'border-red-400' : 'border-gray-600'}`}>
                  {reportReason === reason && <div className="w-2 h-2 rounded-full bg-red-400" />}
                </div>
                <span className="text-sm font-bold">{reason}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="flex-1 py-4 rounded-2xl border border-white/[0.1] border-t-white/[0.15] text-gray-400 font-bold hover:bg-white/5"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={!reportReason || isSubmittingReport}
              className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmittingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
              SUBMIT REPORT
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}

export default function BattleScreenPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-navy flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Arena...</p>
      </main>
    }>
      <BattleScreenContent />
    </Suspense>
  );
}
