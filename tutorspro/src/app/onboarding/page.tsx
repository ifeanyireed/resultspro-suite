"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconChevronRight as ChevronRight, IconChevronLeft as ChevronLeft, IconTarget as Target, IconBookOpen as BookOpen, IconTrophy as Trophy, IconZap as Zap, IconCheck as Check, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [exams, setExams] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, goalsRes] = await Promise.all([
          api.get('/public/content/onboarding_exams'),
          api.get('/public/content/onboarding_goals')
        ]);
        setExams(examsRes.data || []);
        setGoals(goalsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch onboarding content, using fallbacks.");
        setExams([
          { id: 'waec', name: 'WAEC', category: 'West African' },
          { id: 'jamb', name: 'JAMB / UTME', category: 'Nigerian' },
          { id: 'sat', name: 'SAT', category: 'International' },
          { id: 'ielts', name: 'IELTS', category: 'International' },
        ]);
        setGoals([
          { value: 10, label: 'Casual', desc: '5-10 mins / day' },
          { value: 25, label: 'Regular', desc: '15-20 mins / day' },
          { value: 50, label: 'Serious', desc: '30-45 mins / day' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleExam = (id: string) => {
    setSelectedExams(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.push('/student/dashboard');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-green/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-green' : 'w-2 bg-white/10'}`} 
            />
          ))}
        </div>

        {/* Step 1: Exam Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center text-blue mx-auto mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-3">Which exams are you preparing for?</h1>
              <p className="text-gray-500">You can select more than one. We&apos;ll tailor your experience.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
              {exams.map(exam => (
                <button
                  key={exam.id}
                  onClick={() => toggleExam(exam.id)}
                  className={`
                    p-6 rounded-3xl border text-left transition-all relative group
                    ${selectedExams.includes(exam.id) ? 'border-green bg-green/5' : 'border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] hover:border-white/20'}
                  `}
                >
                  {selectedExams.includes(exam.id) && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-green flex items-center justify-center text-navy">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{exam.category}</div>
                  <div className="text-lg font-bold text-white">{exam.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Subject Focus */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center text-green mx-auto mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-3">What are your top subjects?</h1>
              <p className="text-gray-500">We&apos;ll prioritize these in your daily recommendations.</p>
            </div>

            <div className="space-y-3 mb-12">
              {['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology'].map(sub => (
                <button
                  key={sub}
                  className="w-full p-5 rounded-2xl border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] hover:bg-white/5 hover:border-white/10 text-left flex items-center justify-between group transition-all"
                >
                  <span className="font-bold text-white">{sub}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-green transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Daily Goal */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center text-amber mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-3">Set your daily goal</h1>
              <p className="text-gray-500">How many questions do you want to answer each day?</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-12">
              {goals.map(goal => (
                <button
                  key={goal.value}
                  onClick={() => setDailyGoal(goal.value)}
                  className={`
                    p-6 rounded-3xl border text-left transition-all flex items-center justify-between
                    ${dailyGoal === goal.value ? 'border-amber bg-amber/5' : 'border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] hover:border-white/20'}
                  `}
                >
                  <div>
                    <div className="text-lg font-bold text-white">{goal.label}</div>
                    <div className="text-xs text-gray-500">{goal.desc}</div>
                  </div>
                  <div className="text-2xl font-display font-black text-white">{goal.value}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="py-7 px-8 rounded-2xl border-white/10 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <Button 
            onClick={nextStep}
            className="flex-1 py-7 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg flex items-center justify-center gap-2"
          >
            {step === 3 ? "Start Winning" : "Continue"}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-center mt-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
          Step {step} of 3
        </p>
      </div>
    </main>
  );
}
