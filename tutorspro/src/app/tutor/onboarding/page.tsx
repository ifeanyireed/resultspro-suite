"use client";

import { useState, useEffect } from 'react';
import { IconCheck as Check, IconChevronRight as ChevronRight, IconChevronLeft as ChevronLeft, IconUser as User, IconBookOpen as BookOpen, IconFileText as FileText, IconVideo as Video, IconClock as Clock, IconShieldCheck as ShieldCheck, IconUpload as Upload, IconPlus as Plus, IconLoader2 as Loader2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const steps = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Expertise', icon: BookOpen },
  { id: 3, name: 'Verification', icon: FileText },
  { id: 4, name: 'Sample Lesson', icon: Video },
  { id: 5, name: 'Availability', icon: Clock },
];

export default function TutorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Form State
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const toggleSubject = (sub: string) => {
    setSelectedSubjects(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/tutor/onboarding', {
        bio: bio,
        hourly_rate: parseInt(hourlyRate) || 0,
        subjects_json: JSON.stringify(selectedSubjects)
      });
      toast.success('Application submitted successfully!');
      router.push('/tutor/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy flex flex-col">
      {/* Simple Header */}
      <header className="py-6 px-4 md:px-8 border-b border-white/5 bg-navy/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center font-black text-navy">T</div>
            <span className="text-xl font-display font-black text-white tracking-tighter">TutorsPRO <span className="text-gray-500 font-medium">TUTORS</span></span>
          </div>
          <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">SAVE & EXIT</Link>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-green -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  currentStep >= step.id 
                    ? 'bg-green border-green text-navy' 
                    : 'bg-navy border-white/10 text-gray-500'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest hidden md:block ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-600'
                }`}>{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full blur-[100px] -mr-32 -mt-32" />

          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2">Personal Details</h2>
                <p className="text-gray-400">Tell us a bit about yourself to build your professional profile.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="Fetched from Central Auth" disabled className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="tel" placeholder="Fetched from Central Auth" disabled className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-gray-500 cursor-not-allowed" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Professional Bio</label>
                  <textarea 
                    rows={4} 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your teaching philosophy and experience..." 
                    className="w-full bg-navy border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-green/50 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2">Subject Expertise</h2>
                <p className="text-gray-400">Select the subjects you are qualified to teach.</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                   <h3 className="text-lg font-bold text-white mb-4">Core Subjects</h3>
                   <div className="flex flex-wrap gap-3">
                     {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Further Maths', 'Economics'].map((sub) => (
                       <button 
                         key={sub} 
                         onClick={() => toggleSubject(sub)}
                         className={`px-5 py-2 rounded-xl border text-sm font-medium transition-all ${
                           selectedSubjects.includes(sub) 
                             ? 'bg-green/10 border-green text-green' 
                             : 'bg-white/5 border-white/10 text-gray-400 hover:border-green/50'
                         }`}
                       >
                         {sub}
                       </button>
                     ))}
                     <button className="px-5 py-2 rounded-xl bg-white/5 border border-dashed border-white/20 text-sm font-bold text-gray-400 flex items-center gap-2 hover:text-white transition-colors">
                       <Plus className="w-4 h-4" /> ADD OTHER
                     </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Hourly Rate (₦)</label>
                    <input 
                      type="number" 
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="5000" 
                      className="w-full bg-navy border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-green/50 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Experience Level</label>
                    <select className="w-full bg-navy border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-green/50 transition-all appearance-none">
                       <option>Select Level</option>
                       <option>Undergraduate</option>
                       <option>Graduate</option>
                       <option>Masters / PhD</option>
                       <option>Certified Teacher</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2">Verification</h2>
                <p className="text-gray-400">Upload your documents for our vetting team to review.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Government ID', desc: 'International Passport, Driver License, or National ID.' },
                  { label: 'Educational Certificates', desc: 'Degree certificates, teaching licenses, or transcripts.' },
                ].map((doc, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 hover:border-green/50 transition-all flex flex-col items-center text-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-gray-500 group-hover:text-green" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{doc.label}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{doc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(currentStep === 4 || currentStep === 5) && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 text-center py-12">
               <div className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 {currentStep === 4 ? <Video className="w-10 h-10 text-green" /> : <Clock className="w-10 h-10 text-green" />}
               </div>
               <h2 className="text-3xl font-display font-black text-white mb-4">
                 {currentStep === 4 ? 'Sample Lesson Recording' : 'Set Availability'}
               </h2>
               <p className="text-gray-400 max-w-md mx-auto">
                 {currentStep === 4 
                   ? 'For the prototype, this step is simulated. Click continue to proceed.' 
                   : 'Set your regular teaching hours. This can be updated later in your profile.'}
               </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 pt-12 border-t border-white/5 flex justify-between items-center relative z-10">
            <button 
              onClick={prevStep}
              className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" /> BACK
            </button>
            
            {currentStep === steps.length ? (
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="px-10 py-4 rounded-2xl bg-green text-navy font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SUBMIT APPLICATION'}
                {!submitting && <Check className="w-5 h-5" />}
              </button>
            ) : (
              <button 
                onClick={nextStep}
                className="px-10 py-4 rounded-2xl bg-white text-navy font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-white/10"
              >
                CONTINUE
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3 text-green" /> Secure & Encrypted Application
           </div>
           <p className="text-xs text-gray-600 max-w-sm">
             By continuing, you agree to our Tutor Terms of Service and Privacy Policy. Our team typically reviews applications within 3-5 business days.
           </p>
        </div>
      </div>
    </main>
  );
}
