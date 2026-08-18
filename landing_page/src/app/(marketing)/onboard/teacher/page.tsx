'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  User,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  AlertCircle,
  LayoutGrid,
  Eye,
  EyeOff,
  Phone,
  Compass,
  Check,
  RotateCw,
  Scissors,
  Mail,
  ShieldCheck,
  Send,
  Sparkles,
  ChevronDown,
  School,
  Plus,
  Camera,
  X,
  Calculator,
  FlaskConical,
  Globe,
  BookText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResultsProRegistryForm } from '@/components/onboarding/ResultsProRegistryForm';
import { ResultsProStepIndicator } from '@/components/onboarding/ResultsProStepIndicator';

const steps = [
  { id: 1, label: 'ROLE', icon: LayoutGrid },
  { id: 2, label: 'INVITE', icon: Key },
  { id: 3, label: 'PROFILE', icon: User },
  { id: 4, label: 'CLASSES', icon: BookOpen }
];

export default function TeacherOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(2); // Starts at Step 2 (INVITE)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isSendingCorrection, setIsSendingCorrection] = useState(false);
  const [correctionSuccess, setCorrectionSuccess] = useState(false);
  const [correctionText, setCorrectionText] = useState('');

  // Custom alerts/toasts
  const [notification, setNotification] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    // Pre-filled read-only fields
    name: 'Mrs. Grace Daniels',
    email: 'teacher@greenwood.edu.ng',
    schoolName: 'Greenwood High School',

    // Step 2
    password: '',

    // Step 3
    phone: '',
    gender: 'Female',
    specialization: '',
    avatarUrl: '' as string | null,
    avatarFile: null as File | null,
    avatarZoom: 1.5,
    avatarRotate: 0,
    avatarCropped: false,

    // Step 4
    correctionSubmitted: false,
  });

  // Sample avatar image for crop mockup
  const sampleAvatarImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop";

  // Form data handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  // Password validation checks
  const passLength = formData.password.length >= 8;
  const passHasUpper = /[A-Z]/.test(formData.password);
  const passHasNumber = /[0-9]/.test(formData.password);
  const passHasSpecial = /[^A-Za-z0-9]/.test(formData.password);

  const getPasswordStrength = () => {
    if (!formData.password) return { score: 0, text: 'No Password', color: 'bg-slate-200' };
    let score = 0;
    if (passLength) score++;
    if (passHasUpper) score++;
    if (passHasNumber) score++;
    if (passHasSpecial) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength();
  const isStep2Valid = formData.password && passwordStrength.score >= 2;

  // File drop/upload triggers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatarUrl: url,
        avatarFile: file,
        avatarCropped: false
      }));
    }
  };

  const useSampleAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: sampleAvatarImage,
      avatarCropped: false
    }));
  };

  const handleSaveCrop = () => {
    setFormData(prev => ({
      ...prev,
      avatarCropped: true
    }));
    triggerToast("Profile photo cropped and saved successfully!");
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const isStep3Valid =
    formData.phone.length >= 10 &&
    formData.gender !== '' &&
    formData.specialization !== '';

  // Class assignment verification data
  const assignments = [
    { id: 1, class: 'Grade 10A', subject: 'Mathematics', type: 'Core Subject', periods: 4 },
    { id: 2, class: 'Grade 10B', subject: 'Physics', type: 'Core Subject', periods: 3 },
    { id: 3, class: 'Grade 11A', subject: 'English Language', type: 'Core Subject', periods: 4 },
    { id: 4, class: 'Grade 12A', subject: 'Further Mathematics', type: 'Elective Subject', periods: 2 }
  ];

  const getSubjectIcon = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return <Calculator className="w-5 h-5" strokeWidth={1.5} />;
    if (s.includes('physics') || s.includes('chemistry') || s.includes('science')) return <FlaskConical className="w-5 h-5" strokeWidth={1.5} />;
    if (s.includes('english') || s.includes('language') || s.includes('history')) return <BookText className="w-5 h-5" strokeWidth={1.5} />;
    if (s.includes('geography') || s.includes('social')) return <Globe className="w-5 h-5" strokeWidth={1.5} />;
    return <BookOpen className="w-5 h-5" strokeWidth={1.5} />;
  };

  // Steps navigation
  const nextStep = () => setStep(s => Math.min(s + 1, steps.length));
  const prevStep = () => {
    if (step === 2) {
      router.push('/onboard');
    } else {
      setStep(s => Math.max(s - 1, 2));
    }
  };

  // Submit Handler
  const handleFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      triggerToast("Onboarding finalized successfully! Welcome aboard.");
      setTimeout(() => {
        router.push('/teacher');
      }, 1500);
    }, 2000);
  };

  // Simulation of Admin Notification alert
  const sendCorrectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim()) return;

    setIsSendingCorrection(true);
    setTimeout(() => {
      setIsSendingCorrection(false);
      setCorrectionSuccess(true);
      setFormData(prev => ({ ...prev, correctionSubmitted: true }));
      triggerToast("Alert dispatched! Greenwood High School Admin has been notified.");
      setTimeout(() => {
        setIsCorrectionModalOpen(false);
        setCorrectionSuccess(false);
        setCorrectionText('');
      }, 2000);
    }, 1500);
  };

  // Styling Variables (Matches resultspro UI aesthetics)
  const inputStyle = "w-full p-4 bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium";
  const labelStyle = "block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1";
  const cardStyle = "bg-[#ffffff] border border-[#e2e8f0] p-10 max-w-[800px] mx-auto w-full";

  return (
    <>
      {/* Global Notifications/Alert Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md bg-opacity-95">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold leading-normal">{notification}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="onboard-page bg-[#fafbfc] min-h-screen flex flex-col font-sans text-slate-900 selection:bg-blue-100" style={{ paddingBottom: '6rem' }}>
        <div className="h-2 md:h-4 w-full shrink-0" />

        <ResultsProStepIndicator 
          steps={steps} 
          activeStepId={step} 
          onStepClick={(id) => {
            if (id === 1) {
              router.push('/onboard');
            } else if (Number(id) < step) {
              setStep(Number(id));
            }
          }} 
        />

        <div className="flex-1 w-full max-w-5xl self-center px-6 md:px-10 pt-4 pb-8 flex flex-col overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* SCREEN 1 / STEP 2: INVITATION VERIFICATION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                {/* Spacer above title for better breathing room */}
                <div style={{ height: '4rem' }} />

                {/* Headers */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-[10px] tracking-wider uppercase mb-3">
                    <School className="w-3.5 h-3.5" />
                    <span>{formData.schoolName}</span>
                  </div>
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Invitation Verification</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Verify your pre-approved classroom registry details and secure your access.</p>
                </div>

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                {/* Section Label */}
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-3.5 bg-blue-600 rounded-full"></div>
                  <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">2. VERIFY INVITATION</span>
                </div>
                <div style={{ height: '1.25rem' }} />

                <ResultsProRegistryForm 
                    data={{
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                      password: formData.password
                    }}
                    onChange={(newData) => {
                      if (newData.password !== undefined) {
                        setFormData({ ...formData, password: newData.password });
                      }
                    }}
                    requireOtp={false}
                    showName={false}
                    showPhone={false}
                    readOnlyFields={['email']}
                    customTopElement={
                      <div className="mb-8 flex flex-row items-center gap-3 w-full">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-lg font-black">
                            {formData.schoolName.charAt(0)}
                          </div>
                        </div>

                        <div className="flex flex-col justify-center">
                          <h2 className="font-extrabold text-slate-800 text-left tracking-tight leading-none mb-1" style={{ fontSize: '33px' }}>
                            {formData.schoolName}
                          </h2>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 text-left block">
                            Assigned School
                          </span>
                        </div>
                      </div>
                    }
                  />

                <div style={{ height: '4rem' }} />
                {/* Bottom Navigation Button Bar */}
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button
                    onClick={prevStep}
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!isStep2Valid}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2 / STEP 3: PROFILE COMPLETION */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-8 flex flex-col"
              >
                {/* Spacer above title for better breathing room */}
                <div style={{ height: '4rem' }} />

                {/* Headers */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Profile Completion</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Verify bio-data items and align specialization preferences.</p>
                </div>

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                {/* Section Label */}
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-3.5 bg-blue-600 rounded-full"></div>
                  <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">3. COMPLETE PROFILE</span>
                </div>
                <div style={{ height: '1.25rem' }} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Inputs Column */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className={cardStyle} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Phone Number */}
                        <div>
                          <label className={labelStyle}>Contact Phone Number</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10" style={{ paddingLeft: '1rem' }}>
                              <Phone className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                              type="tel"
                              placeholder="+234 803 123 4567"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              style={{ padding: '0.75rem 1.25rem', paddingLeft: '2.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                            />
                          </div>
                        </div>

                        {/* Gender Selection */}
                        <div>
                          <label className={labelStyle}>Gender</label>
                          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.375rem', borderRadius: '9999px', width: '100%', maxWidth: '350px', position: 'relative' }}>
                            {['Female', 'Male', 'Other'].map((g) => {
                              const isSelected = formData.gender === g;
                              return (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, gender: g })}
                                  style={{
                                    flex: 1,
                                    padding: '0.875rem 0',
                                    borderRadius: '9999px',
                                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                                    color: isSelected ? '#146ef5' : '#64748b',
                                    boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' : 'none',
                                    fontWeight: isSelected ? '800' : '600',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                >
                                  {g}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Specialization dropdown */}
                        <div>
                          <label className={labelStyle}>Academic Specialization</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10" style={{ paddingLeft: '1rem' }}>
                              <Compass className="w-4 h-4 text-slate-400" />
                            </div>
                            <select
                              value={formData.specialization}
                              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                              className="appearance-none cursor-pointer relative"
                              style={{ padding: '0.75rem 1.25rem', paddingLeft: '2.75rem', paddingRight: '2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                            >
                              <option value="" disabled>Select Specialization Degree</option>
                              <option value="B.Sc. Mathematics">B.Sc. Mathematics</option>
                              <option value="B.Ed. Mathematics">B.Ed. Mathematics</option>
                              <option value="B.A. English Language">B.A. English Language</option>
                              <option value="M.Sc. Physics">M.Sc. Physics</option>
                              <option value="B.Sc. Chemistry">B.Sc. Chemistry</option>
                              <option value="B.Ed. Science Education">B.Ed. Science Education</option>
                              <option value="M.Ed. Educational Management">M.Ed. Educational Management</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-slate-400" style={{ paddingRight: '1rem' }}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Avatar Upload / Crop UI Column */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-start pt-4 space-y-6">
                    <label 
                      className="relative w-52 h-52 rounded-full flex items-center justify-center cursor-pointer group transition-all mt-4"
                      style={{ boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1), 0 10px 15px -5px rgba(0,0,0,0.04)' }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />

                      {formData.avatarUrl ? (
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                          <motion.div
                            className="relative w-full h-full"
                            animate={{ scale: formData.avatarCropped ? 1 : 1.05 }}
                          >
                            <img
                              src={formData.avatarUrl}
                              alt="Avatar Source"
                              className="absolute object-cover transition-transform duration-75"
                              style={{
                                width: '100%',
                                height: '100%',
                                transform: `scale(${formData.avatarZoom}) rotate(${formData.avatarRotate}deg)`,
                              }}
                            />
                            {!formData.avatarCropped && (
                              <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-full pointer-events-none bg-black/15 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                            )}
                          </motion.div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                          style={{
                            backgroundImage: 'url(/abstract-blue-1.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 rounded-full group-hover:bg-black/50 transition-colors"></div>
                          <Camera className="w-12 h-12 text-white/90 transition-colors group-hover:text-white z-10 relative drop-shadow-md" strokeWidth={1} />
                        </div>
                      )}

                      {/* Plus icon badge at bottom right */}
                      <div className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white border border-white shadow-sm group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" strokeWidth={2} />
                      </div>
                    </label>

                          {/* CROP CONTROLS (Only if image loaded and not finalized) */}
                          {formData.avatarUrl && !formData.avatarCropped && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3"
                            >
                              <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                <Scissors className="w-3 h-3 text-blue-500" /> Image Crop Controls
                              </span>

                              {/* Zoom slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                  <span>Zoom Scale</span>
                                  <span>{formData.avatarZoom.toFixed(1)}x</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="3"
                                  step="0.1"
                                  value={formData.avatarZoom}
                                  onChange={(e) => setFormData({ ...formData, avatarZoom: parseFloat(e.target.value) })}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                              </div>

                              {/* Rotation slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                  <span>Rotate Angle</span>
                                  <span>{formData.avatarRotate}°</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="360"
                                  value={formData.avatarRotate}
                                  onChange={(e) => setFormData({ ...formData, avatarRotate: parseInt(e.target.value) })}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={handleSaveCrop}
                                className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-blue-500/10 flex items-center justify-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Save Crop Preview
                              </button>
                            </motion.div>
                          )}

                          {formData.avatarCropped && (
                            <div className="mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between px-3">
                              <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo Cropped
                              </span>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, avatarCropped: false })}
                                className="text-[9px] font-extrabold uppercase text-slate-400 hover:text-blue-600 transition-colors"
                              >
                                Adjust
                              </button>
                            </div>
                          )}
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
                {/* Bottom Navigation Button Bar */}
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button 
                    onClick={prevStep} 
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!isStep3Valid}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3 / STEP 4: ASSIGNMENT VERIFICATION */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-8 flex flex-col"
              >
                {/* Spacer above title for better breathing room */}
                <div style={{ height: '4rem' }} />

                {/* Headers */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Assignment Verification</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Verify classrooms and curriculums assigned to your staff profile.</p>
                </div>

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                {/* Section Label */}
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-3.5 bg-blue-600 rounded-full"></div>
                  <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">4. VERIFY CLASSES</span>
                </div>
                <div style={{ height: '1.25rem' }} />

                <div className="border border-slate-200 bg-white" style={{ borderRadius: '6px', padding: '2rem', margin: '0 auto', maxWidth: '800px', width: '100%' }}>
                  <div className="space-y-6">

                    <div className="flex justify-between items-center" style={{ paddingBottom: '1rem' }}>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Class & Course Assignments</span>
                        <h4 className="font-bold text-slate-800 mt-1" style={{ fontSize: '22px' }}>Landed Schedule Profile</h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsCorrectionModalOpen(true)}
                        className={`transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 border ${formData.correctionSubmitted
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'text-white'
                          }`}
                        style={{ 
                          padding: '0.6rem 1.25rem', 
                          borderRadius: '9999px',
                          ...(formData.correctionSubmitted ? {} : { backgroundColor: '#146ef5', borderColor: '#146ef5' })
                        }}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formData.correctionSubmitted ? "Review Request Sent" : "Request Correction"}</span>
                      </button>
                    </div>

                    {/* Read-Only Table/Cards List */}
                    <div className="flex flex-col" style={{ gap: '1.25rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                      {assignments.map((asg) => (
                        <div
                          key={asg.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#f4f7fd] border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                              {getSubjectIcon(asg.subject)}
                            </div>
                            <div>
                              <h5 className="text-[15px] font-bold text-slate-800 leading-tight">{asg.class} - {asg.subject}</h5>
                              <span className="font-bold text-slate-400 uppercase tracking-widest block" style={{ fontSize: '9.5px', marginTop: '0.1rem' }}>
                                {asg.type} • {asg.periods} periods per week 
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0 pr-2">
                            Active Listing
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-3" style={{ marginTop: '2rem' }}>
                      <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" strokeWidth={2} />
                      <div className="text-[12px] font-medium text-slate-600 leading-relaxed">
                        Verify that these classes match your physical workload allocation. If there is a discrepancy, click 
                        <span className="font-bold text-blue-600 px-1 cursor-pointer hover:underline" onClick={() => setIsCorrectionModalOpen(true)}>Request Correction</span>. The wizard can still be finalized.
                      </div>
                    </div>

                    {formData.correctionSubmitted && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 mt-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block leading-none">Correction Alert Registered</span>
                          <p className="text-[10.5px] font-semibold text-amber-900/80 leading-normal mt-1">
                            Your report was successfully delivered to the School Administrator. They can adjust assignments live from the school portal dashboard.
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                <div style={{ height: '4rem' }} />
                {/* Bottom Navigation Button Bar */}
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button 
                    onClick={prevStep} 
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    onClick={handleFinalize}
                    disabled={isSubmitting}
                    className="text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', backgroundColor: '#146ef5' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Provisioning...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* CORRECTION REQUEST SLIDE-OVER / MODAL */}
      <AnimatePresence>
        {isCorrectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] border border-slate-200/60 w-full max-w-lg p-7 shadow-2xl space-y-6 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setIsCorrectionModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0f172a]">Request Assignment Correction</h3>
                  <p className="text-xs text-slate-500 font-medium">This alerts school administration to adjust your class lists.</p>
                </div>
              </div>

              {!correctionSuccess ? (
                <form onSubmit={sendCorrectionRequest} className="space-y-4">
                  <div>
                    <label className={labelStyle}>Staff Context Info</label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3.5 border border-slate-200/60 rounded-xl">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Teacher</span>
                        {formData.name}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">School Domain</span>
                        {formData.schoolName}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelStyle}>Specify Incorrect Assignments</label>
                    <textarea
                      required
                      rows={4}
                      value={correctionText}
                      onChange={(e) => setCorrectionText(e.target.value)}
                      placeholder="Specify your adjustments (e.g. 'I am not teaching Grade 10B Further Mathematics. Please assign me to English Grade 10A instead.')"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCorrectionModalOpen(false)}
                      className="h-10 px-5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingCorrection}
                      className="h-10 px-5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSendingCorrection ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Dispatching Alert...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Correction Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-emerald-800">Alert Dispatched to Admin!</h4>
                    <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                      A high-priority notification was pushed to school system administrators. This will not block your onboarding progress.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
