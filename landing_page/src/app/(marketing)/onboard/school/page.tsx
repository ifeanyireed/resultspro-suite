'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultsProRegistryForm } from '@/components/onboarding/ResultsProRegistryForm';
import { Camera, Image as ImageIcon, Globe, ArrowRight, ArrowLeft, CheckCircle2, Building2, Palette, BookOpen, Quote, Plus, Calendar, Layers, Users, GraduationCap, Upload, Check, CreditCard, Lock, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResultsProStepIndicator } from '@/components/onboarding/ResultsProStepIndicator';

const steps = [
  { id: 1, label: 'BASICS', icon: Building2 },
  { id: 2, label: 'BRANDING', icon: Palette },
  { id: 3, label: 'SESSION & TERM', icon: Calendar },
  { id: 4, label: 'CLASSES', icon: Layers },
  { id: 5, label: 'SUBJECTS', icon: BookOpen },
  { id: 6, label: 'TEACHERS', icon: Users },
  { id: 7, label: 'STUDENTS', icon: GraduationCap },
  { id: 8, label: 'PLAN', icon: CreditCard }
];

export default function SchoolOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    motto: '',
    email: '',
    phone: '',
    primaryColor: '#146ef5',
    accentColor: '#0f172a',
    country: 'Nigeria',
    curriculum: 'WASSCE / National',
    logoUrl: '' as string | null,
    logoFile: null as File | null,
    logoZoom: 1,
    logoRotate: 0,
    logoCropped: false,
    coverUrl: '' as string | null,
    coverFile: null as File | null,
    coverZoom: 1,
    coverRotate: 0,
    coverCropped: false,
    paymentOption: 'PRO',
    referralCode: ''
  });

  const [sessionData, setSessionData] = useState({
    sessionName: '2024/2025',
    startDate: '',
    endDate: '',
    isCurrent: true,
    terms: [
      { id: 1, name: 'First Term', startDate: '', endDate: '', isCurrent: true },
      { id: 2, name: 'Second Term', startDate: '', endDate: '', isCurrent: false },
      { id: 3, name: 'Third Term', startDate: '', endDate: '', isCurrent: false }
    ]
  });

  const [classesList, setClassesList] = useState([{ id: 1, name: '', level: '', curriculum_id: '', sections: [{ id: 1, name: '', room_number: '' }], subjects: [{ id: 1, name: '', code: '' }] }]);
  const [teachersList, setTeachersList] = useState([{ id: 1, email: '', assignments: [{ id: 1, class_id: '', section_id: '', subject_id: '' }] }]);
  const [studentsList, setStudentsList] = useState([{ id: 1, identifier: '', class_id: '', section_id: '', status: 'active' }]);

  const [notification, setNotification] = useState<string | null>(null);

  // Paystack Online Payment Popover States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paystackCardNum, setPaystackCardNum] = useState('');
  const [paystackExpiry, setPaystackExpiry] = useState('');
  const [paystackCvv, setPaystackCvv] = useState('');
  const [isPaystackProcessing, setIsPaystackProcessing] = useState(false);
  const [paystackStage, setPaystackStage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const triggerOnlinePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaystackCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaystackProcessing(true);
    setPaystackStage('Establishing secure handshake...');
    setTimeout(() => {
      setPaystackStage('Authorizing with card network...');
      setTimeout(() => {
        setPaystackStage('Verifying settlement balance...');
        setTimeout(() => {
          setIsPaystackProcessing(false);
          setPaymentSuccess(true);
          setTimeout(() => {
            setShowPaymentModal(false);
          }, 1500);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        logoUrl: url,
        logoFile: file,
        logoCropped: false
      }));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        coverUrl: url,
        coverFile: file,
        coverCropped: false
      }));
    }
  };

  const handleSaveCrop = () => {
    setFormData(prev => ({
      ...prev,
      logoCropped: true
    }));
    triggerToast("School logo cropped and saved successfully!");
  };

  const handleSaveCoverCrop = () => {
    setFormData(prev => ({
      ...prev,
      coverCropped: true
    }));
    triggerToast("Cover photo cropped and saved successfully!");
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/admin');
    }, 1500);
  };

  const inputStyle = "w-full p-4 bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium";
  const labelStyle = "block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1";
  const cardStyle = "bg-[#ffffff] border border-[#e2e8f0] p-10 max-w-[800px] mx-auto w-full";

  return (
    <>
      <main className="onboard-page bg-[#fafbfc] min-h-screen flex flex-col font-sans text-slate-900 selection:bg-blue-100" style={{ paddingBottom: '6rem' }}>
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm tracking-wide border border-white/10"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

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
            {/* STEP 1: BUSINESS BASICS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">School Basics</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Tell us a bit about your institution.</p>
                </div>

                <div style={{ height: '1.5rem' }} />

                <ResultsProRegistryForm 
                  data={{
                    name: formData.schoolName,
                    email: formData.email,
                    phone: formData.phone,
                  }}
                  onChange={(newData) => setFormData({ 
                    ...formData, 
                    schoolName: newData.name ?? formData.schoolName,
                    email: newData.email ?? formData.email,
                    phone: newData.phone ?? formData.phone,
                  })}
                  requireOtp={false}
                  requirePassword={false}
                  showName={false}
                  customTopElement={
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div className="relative">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Official School Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Royal Academy"
                            value={formData.schoolName}
                            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                            className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>School Motto</label>
                        <div className="relative">
                          <Quote className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Excellence in Service"
                            value={formData.motto}
                            onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                            className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                          />
                        </div>
                      </div>
                    </div>
                  }
                />

                <div style={{ height: '4rem' }} />
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button 
                    onClick={() => router.push('/onboard')} 
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Change Role
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.schoolName || !formData.email}
                    className="bg-[#146ef5] hover:bg-[#146ef5]/90 text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: BRANDING */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Your Visual Identity</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Your profile will adapt to the brand colors you choose.</p>
                </div>

                <div style={{ height: '1.5rem' }} />

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {/* Card 1: Assets */}
                  <div className={cardStyle} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', backgroundColor: '#ffffff' }}>
                    <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-100 pb-4 text-center" style={{ fontSize: '20px', marginBottom: '2rem' }}>Assets</h3>
                    <div className="flex-grow flex flex-col items-center w-full">
                      <div className="flex flex-col w-full items-center" style={{ marginBottom: '2.5rem' }}>
                        <label 
                          className="relative mx-auto rounded-full flex items-center justify-center cursor-pointer group transition-all"
                          style={{ aspectRatio: '1/1', width: '75%', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1), 0 10px 15px -5px rgba(0,0,0,0.04)' }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />

                          {formData.logoUrl ? (
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                              <motion.div
                                className="relative w-full h-full"
                                animate={{ scale: formData.logoCropped ? 1 : 1.05 }}
                              >
                                <img
                                  src={formData.logoUrl}
                                  alt="Logo Source"
                                  className="absolute object-cover transition-transform duration-75"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    transform: `scale(${formData.logoZoom}) rotate(${formData.logoRotate}deg)`,
                                  }}
                                />
                                {!formData.logoCropped && (
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
                              <div className="z-10 flex flex-col items-center justify-center gap-1">
                                <Camera className="w-10 h-10 text-white/90 transition-colors group-hover:text-white drop-shadow-md" strokeWidth={0.5} />
                                <span className="text-white font-black uppercase tracking-widest text-[10px] drop-shadow-md">Logo</span>
                              </div>
                            </div>
                          )}

                          <div 
                            className="absolute w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                            style={{ bottom: '14.6%', right: '14.6%', marginBottom: '-20px', marginRight: '-20px' }}
                          >
                            <Plus className="w-5 h-5" strokeWidth={2} />
                          </div>
                        </label>
                        
                        {formData.logoUrl && !formData.logoCropped && (
                          <div className="flex flex-col gap-3 mt-4" style={{ width: '75%' }}>
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                                <span>Zoom</span>
                                <span className="text-blue-600">{Math.round(formData.logoZoom * 100)}%</span>
                              </label>
                              <input 
                                type="range" min="1" max="3" step="0.1"
                                value={formData.logoZoom}
                                onChange={(e) => setFormData(prev => ({ ...prev, logoZoom: parseFloat(e.target.value) }))}
                                className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            
                            <button
                              onClick={(e) => { e.preventDefault(); handleSaveCrop(); }}
                              className="w-full bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Confirm Crop
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col w-full items-center gap-2 mt-4">
                        <label 
                          className="relative mx-auto rounded-3xl flex flex-col items-center justify-center cursor-pointer group transition-all"
                          style={{ aspectRatio: '1/1', width: '90%', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1), 0 10px 15px -5px rgba(0,0,0,0.04)' }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="hidden"
                          />
                          {formData.coverUrl ? (
                            <div className="w-full h-full rounded-3xl overflow-hidden relative">
                              <motion.div
                                className="relative w-full h-full"
                                animate={{ scale: formData.coverCropped ? 1 : 1.05 }}
                              >
                                <img
                                  src={formData.coverUrl}
                                  alt="Cover Source"
                                  className="absolute object-cover transition-transform duration-75"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    transform: `scale(${formData.coverZoom}) rotate(${formData.coverRotate}deg)`,
                                  }}
                                />
                                {!formData.coverCropped && (
                                  <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-3xl pointer-events-none bg-black/15 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                                )}
                              </motion.div>
                            </div>
                          ) : (
                            <div 
                              className="w-full h-full rounded-3xl flex items-center justify-center overflow-hidden"
                              style={{
                                backgroundImage: 'url(/abstract-blue-5.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            >
                              <div className="absolute inset-0 bg-black/40 rounded-3xl group-hover:bg-black/50 transition-colors"></div>
                              <div className="z-10 flex flex-col items-center justify-center mb-6">
                                <ImageIcon className="w-10 h-10 text-white/90 transition-colors group-hover:text-white drop-shadow-md" strokeWidth={0.5} />
                              </div>
                              <div 
                                className="absolute border whitespace-nowrap text-white transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                style={{ width: '85%', bottom: '8px', left: '50%', transform: 'translateX(-50%)', padding: '0.6rem 1.5rem', borderRadius: '9999px', backgroundColor: '#146ef5', borderColor: '#146ef5' }}
                              >
                                Upload Cover
                              </div>
                            </div>
                          )}
                        </label>
                        
                        {formData.coverUrl && !formData.coverCropped && (
                          <div className="flex flex-col gap-3 mt-4" style={{ width: '90%' }}>
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                                <span>Zoom</span>
                                <span className="text-blue-600">{Math.round(formData.coverZoom * 100)}%</span>
                              </label>
                              <input 
                                type="range" min="1" max="3" step="0.1"
                                value={formData.coverZoom}
                                onChange={(e) => setFormData(prev => ({ ...prev, coverZoom: parseFloat(e.target.value) }))}
                                className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            
                            <button
                              onClick={(e) => { e.preventDefault(); handleSaveCoverCrop(); }}
                              className="w-full bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Confirm Crop
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ height: '2rem' }}></div>
                    </div>
                  </div>

                  {/* Card 2: Preview & Colors */}
                  <div className={`${cardStyle} md:col-span-2`} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', backgroundColor: '#ffffff' }}>
                    <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-100 pb-4" style={{ fontSize: '20px', marginBottom: '2rem' }}>
                      Platform Preview
                    </h3>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                      <div>
                        <div className="flex gap-4 items-center">
                          <div 
                            className="relative shadow-sm shrink-0"
                            style={{ backgroundColor: formData.primaryColor, width: '2.5rem', height: '2.5rem', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}
                          >
                            <input
                              type="color"
                              value={formData.primaryColor}
                              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <div className="flex flex-col" style={{ gap: '0.1rem' }}>
                            <span className="font-bold text-slate-800 uppercase tracking-widest leading-none" style={{ fontSize: '16px' }}>{formData.primaryColor}</span>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Primary Color</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-4 items-center">
                          <div 
                            className="relative shadow-sm shrink-0"
                            style={{ backgroundColor: formData.accentColor, width: '2.5rem', height: '2.5rem', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}
                          >
                            <input
                              type="color"
                              value={formData.accentColor}
                              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <div className="flex flex-col" style={{ gap: '0.1rem' }}>
                            <span className="font-bold text-slate-800 uppercase tracking-widest leading-none" style={{ fontSize: '16px' }}>{formData.accentColor}</span>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Accent Color</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div 
                      className="border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40 bg-white transition-transform hover:-translate-y-1 duration-500"
                      style={{ marginTop: '3rem' }}
                    >
                      <div 
                        className="h-28 w-full transition-colors duration-500 relative overflow-hidden" 
                        style={{ 
                          backgroundColor: formData.primaryColor,
                          backgroundImage: formData.coverUrl ? `url(${formData.coverUrl})` : 'url(/abstract-blue-5.jpg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {/* Dark overlay filter on header */}
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="p-5 flex items-center justify-end relative z-10 h-full">
                          <div className="space-y-2">
                            <div className="h-3 w-24 bg-white/40 rounded-full" />
                            <div className="h-2 w-16 bg-white/20 rounded-full ml-auto" />
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                        <div style={{ marginTop: '-1.75rem', marginBottom: '1rem', position: 'relative', zIndex: 20 }}>
                          <div 
                            className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden relative"
                            style={{ border: '1.5px solid white' }}
                          >
                            {formData.logoUrl ? (
                              <img src={formData.logoUrl} className="w-full h-full object-contain" alt="School Logo" />
                            ) : (
                              <div 
                                className="w-full h-full" 
                                style={{
                                  backgroundImage: 'url(/abstract-blue-1.jpg)',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <h4 className="font-extrabold text-slate-900 tracking-tight leading-none" style={{ fontSize: '20px', marginBottom: '0.25rem' }}>{formData.schoolName || "Your School Name"}</h4>
                        <p className="text-slate-400 font-bold uppercase tracking-widest line-clamp-2" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                          {formData.motto || "Your school motto will appear here for students and parents to see."}
                        </p>
                        <div className="flex justify-between items-center border-t border-slate-100" style={{ marginTop: '2rem', paddingTop: '2rem' }}>
                          <div className="flex gap-1.5">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#146ef5', opacity: i === 0 ? 1 : 0.3 }} />)}
                          </div>
                          <div className="w-16 h-8 rounded-full shadow-sm" style={{ backgroundColor: '#146ef5' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
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
                    className="bg-[#146ef5] hover:bg-[#146ef5]/90 text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

                        {/* STEP 3: SESSION & TERM */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Session & Term</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Establish the temporal timeline for the school year.</p>
                </div>

                <div style={{ height: '1.5rem' }} />

                <div className={"bg-white border border-slate-200/60 p-6 md:p-8 relative"} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  <div className="space-y-8">
                    <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-100" style={{ fontSize: '14px', paddingBottom: '1rem', marginBottom: '1.25rem' }}>Academic Session</h3>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
                      <div className="relative">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Session Name <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. 2024/2025"
                            value={sessionData.sessionName}
                            onChange={(e) => setSessionData({ ...sessionData, sessionName: e.target.value })}
                            className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="relative">
                          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Start Date</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={sessionData.startDate}
                              onChange={(e) => setSessionData({ ...sessionData, startDate: e.target.value })}
                              className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                              style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>End Date</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={sessionData.endDate}
                              onChange={(e) => setSessionData({ ...sessionData, endDate: e.target.value })}
                              className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                              style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 pl-1 cursor-pointer" onClick={() => setSessionData({ ...sessionData, isCurrent: !sessionData.isCurrent })}>
                        <div 
                          className="flex items-center justify-center transition-all duration-300" 
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '50%', 
                            border: `2px solid ${sessionData.isCurrent ? '#146ef5' : '#cbd5e1'}`,
                            padding: '2px'
                          }}
                        >
                          <div 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              borderRadius: '50%', 
                              backgroundColor: sessionData.isCurrent ? '#146ef5' : 'transparent',
                              transition: 'all 0.2s ease-in-out'
                            }} 
                          />
                        </div>
                        <label className="text-sm font-medium text-slate-700 cursor-pointer select-none">Set as Current Active Session</label>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-100" style={{ fontSize: '14px', marginTop: '4rem', paddingBottom: '1rem', marginBottom: '1.25rem' }}>Term Configuration</h3>
                    <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: '1fr' }}>
                      {sessionData.terms.map((term, termIndex) => (
                        <div key={term.id} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
                          <div className="relative">
                            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Term Name <span className="text-rose-500">*</span></label>
                            <div className="relative">
                              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                placeholder="e.g. First Term"
                                value={term.name}
                                onChange={(e) => {
                                  const newTerms = [...sessionData.terms];
                                  newTerms[termIndex].name = e.target.value;
                                  setSessionData({ ...sessionData, terms: newTerms });
                                }}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="relative">
                              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Start Date</label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={term.startDate}
                                  onChange={(e) => {
                                    const newTerms = [...sessionData.terms];
                                    newTerms[termIndex].startDate = e.target.value;
                                    setSessionData({ ...sessionData, terms: newTerms });
                                  }}
                                  className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                  style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                />
                              </div>
                            </div>
                            <div className="relative">
                              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>End Date</label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={term.endDate}
                                  onChange={(e) => {
                                    const newTerms = [...sessionData.terms];
                                    newTerms[termIndex].endDate = e.target.value;
                                    setSessionData({ ...sessionData, terms: newTerms });
                                  }}
                                  className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                  style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-2 pl-1 cursor-pointer" onClick={() => {
                            const newTerms = sessionData.terms.map((t, i) => ({ ...t, isCurrent: i === termIndex }));
                            setSessionData({ ...sessionData, terms: newTerms });
                          }}>
                            <div 
                              className="flex items-center justify-center transition-all duration-300" 
                              style={{ 
                                width: '20px', 
                                height: '20px', 
                                borderRadius: '50%', 
                                border: `2px solid ${term.isCurrent ? '#146ef5' : '#cbd5e1'}`,
                                padding: '2px'
                              }}
                            >
                              <div 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  borderRadius: '50%', 
                                  backgroundColor: term.isCurrent ? '#146ef5' : 'transparent',
                                  transition: 'all 0.2s ease-in-out'
                                }} 
                              />
                            </div>
                            <label className="text-sm font-medium text-slate-700 cursor-pointer select-none">Set as Current Active Term</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
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
                    className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CLASSES & SECTIONS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Classes & Sections</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Establish the physical and structural hierarchy.</p>
                </div>

                <div style={{ height: '1.5rem' }} />

                <div className={"bg-white border border-slate-200/60 p-6 md:p-8 relative"} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'grid', gap: '3rem' }}>
                    {classesList.map((cls, classIndex) => (
                      <div key={cls.id} className="relative" style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                        <button onClick={() => setClassesList(classesList.filter((_, i) => i !== classIndex))} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 text-xs font-bold uppercase">Remove</button>
                        <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-200" style={{ fontSize: '14px', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Class {classIndex + 1}</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="relative">
                            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Class Name <span className="text-rose-500">*</span></label>
                            <div className="relative">
                              <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={cls.name}
                                onChange={e => {
                                  const newClasses = [...classesList];
                                  newClasses[classIndex].name = e.target.value;
                                  setClassesList(newClasses);
                                }}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                placeholder="e.g. Grade 10"
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Level / Order</label>
                            <div className="relative">
                              <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="number"
                                value={cls.level}
                                onChange={e => {
                                  const newClasses = [...classesList];
                                  newClasses[classIndex].level = e.target.value;
                                  setClassesList(newClasses);
                                }}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                placeholder="e.g. 1"
                              />
                            </div>
                          </div>

                        </div>

                        <div>
                          <h4 className="font-bold text-slate-700 text-xs uppercase tracking-widest mb-4">Sections</h4>
                          {cls.sections.map((section, sectionIndex) => (
                            <div key={section.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
                              <div className="relative">
                                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Section Name <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input
                                    type="text"
                                    value={section.name}
                                    onChange={e => {
                                      const newClasses = [...classesList];
                                      newClasses[classIndex].sections[sectionIndex].name = e.target.value;
                                      setClassesList(newClasses);
                                    }}
                                    className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                    style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                    placeholder="e.g. A, Science"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 items-center w-full">
                                <div className="flex-1 relative">
                                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Room Number</label>
                                  <div className="relative">
                                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                      type="text"
                                      value={section.room_number}
                                      onChange={e => {
                                        const newClasses = [...classesList];
                                        newClasses[classIndex].sections[sectionIndex].room_number = e.target.value;
                                        setClassesList(newClasses);
                                      }}
                                      className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                      style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                      placeholder="e.g. Room 204"
                                    />
                                  </div>
                                </div>
                                <button 
                                  onClick={() => {
                                    const newClasses = [...classesList];
                                    newClasses[classIndex].sections = newClasses[classIndex].sections.filter((_, i) => i !== sectionIndex);
                                    setClassesList(newClasses);
                                  }}
                                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newClasses = [...classesList];
                              newClasses[classIndex].sections.push({ id: Date.now(), name: '', room_number: '' });
                              setClassesList(newClasses);
                            }}
                            className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700"
                          >
                            <Plus className="w-3 h-3" /> Add Section
                          </button>
                        </div>
                      </div>
                    ))}

                    </div>
                    
                    <div className="flex justify-center" style={{ marginTop: '2rem' }}>
                      <button 
                        onClick={() => setClassesList([...classesList, { id: Date.now(), name: '', level: '', curriculum_id: '', sections: [{ id: Date.now()+1, name: '', room_number: '' }], subjects: [{ id: Date.now()+2, name: '', code: '' }] }])}
                        className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                      >
                        <Plus className="w-4 h-4" /> Add Another Class
                      </button>
                    </div>
                </div>

                <div style={{ height: '4rem' }} />
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
                    className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SUBJECTS */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Subjects</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Define what is being taught at the school.</p>
                </div>

                <div style={{ height: '1.5rem' }} />

                <div className={"bg-white border border-slate-200/60 p-6 md:p-8 relative"} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  <div className="space-y-4">
                    {classesList.map((cls, classIndex) => (
                      <div key={cls.id} className="relative" style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', marginBottom: '2rem' }}>
                        <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-200" style={{ fontSize: '14px', paddingBottom: '1rem', marginBottom: '1.5rem' }}>{cls.name || `Class ${classIndex + 1}`} Subjects</h3>
                        
                        {cls.subjects?.map((subject, subjectIndex) => (
                          <div key={subject.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem' }}>
                            <div className="relative">
                              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Subject Name <span className="text-rose-500">*</span></label>
                              <div className="relative">
                                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                  type="text"
                                  value={subject.name}
                                  onChange={e => {
                                    const newClasses = [...classesList];
                                    newClasses[classIndex].subjects[subjectIndex].name = e.target.value;
                                    setClassesList(newClasses);
                                  }}
                                  className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                  style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                  placeholder="e.g. Mathematics"
                                />
                              </div>
                            </div>
                            <div className="relative">
                              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Subject Code</label>
                              <div className="relative">
                                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                  type="text"
                                  value={subject.code}
                                  onChange={e => {
                                    const newClasses = [...classesList];
                                    newClasses[classIndex].subjects[subjectIndex].code = e.target.value;
                                    setClassesList(newClasses);
                                  }}
                                  className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                  style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                  placeholder="e.g. MATH101"
                                />
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const newClasses = [...classesList];
                                newClasses[classIndex].subjects = newClasses[classIndex].subjects.filter((_, i) => i !== subjectIndex);
                                setClassesList(newClasses);
                              }}
                              className="p-3 text-slate-400 hover:text-rose-500 transition-colors"
                              style={{ marginBottom: '0.25rem' }}
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <div className="flex justify-center" style={{ marginTop: '1rem' }}>
                          <button 
                            onClick={() => {
                              const newClasses = [...classesList];
                              if (!newClasses[classIndex].subjects) newClasses[classIndex].subjects = [];
                              newClasses[classIndex].subjects.push({ id: Date.now(), name: '', code: '' });
                              setClassesList(newClasses);
                            }}
                            className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                            style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px' }}
                          >
                            <Plus className="w-3 h-3" /> Add Subject to {cls.name || `Class ${classIndex + 1}`}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
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
                    className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: TEACHERS */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Assign Teachers</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Invite teachers and assign them to specific sections and subjects.</p>
                </div>

                <div style={{ height: '1.5rem' }} />

                <div className={"bg-white border border-slate-200/60 p-6 md:p-8 relative"} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  <div className="space-y-8">
                    {teachersList.map((teacher, teacherIndex) => (
                      <div key={teacher.id} className="relative" style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', marginBottom: '2rem' }}>
                        <button onClick={() => setTeachersList(teachersList.filter((_, i) => i !== teacherIndex))} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 text-xs font-bold uppercase">Remove</button>
                        <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-200" style={{ fontSize: '14px', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Teacher {teacherIndex + 1}</h3>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                          <div className="relative">
                            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Email Address <span className="text-rose-500">*</span></label>
                            <div className="relative">
                              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="email"
                                value={teacher.email}
                                onChange={e => {
                                  const newList = [...teachersList];
                                  newList[teacherIndex].email = e.target.value;
                                  setTeachersList(newList);
                                }}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                placeholder="teacher@school.edu"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-700 text-xs uppercase tracking-widest mb-4">Assignments</h4>
                          {teacher.assignments.map((assignment, assignmentIndex) => (
                            <div key={assignment.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem' }}>
                              <div className="relative">
                                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Class <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <select
                                    value={assignment.class_id}
                                    onChange={e => {
                                      const newList = [...teachersList];
                                      newList[teacherIndex].assignments[assignmentIndex].class_id = e.target.value;
                                      newList[teacherIndex].assignments[assignmentIndex].section_id = '';
                                      newList[teacherIndex].assignments[assignmentIndex].subject_id = '';
                                      setTeachersList(newList);
                                    }}
                                    className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800"
                                    style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white', appearance: 'none' }}
                                  >
                                    <option value="">Select Class</option>
                                    {classesList.map(c => <option key={c.id} value={c.id}>{c.name || `Class ${c.id}`}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div className="relative">
                                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Section <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <select
                                    value={assignment.section_id}
                                    onChange={e => {
                                      const newList = [...teachersList];
                                      newList[teacherIndex].assignments[assignmentIndex].section_id = e.target.value;
                                      setTeachersList(newList);
                                    }}
                                    className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
                                    style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white', appearance: 'none' }}
                                    disabled={!assignment.class_id}
                                  >
                                    <option value="">Select Section</option>
                                    {assignment.class_id && classesList.find(c => c.id.toString() === assignment.class_id?.toString())?.sections.map(s => <option key={s.id} value={s.id}>{s.name || `Section`}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div className="relative">
                                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Subject <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <select
                                    value={assignment.subject_id}
                                    onChange={e => {
                                      const newList = [...teachersList];
                                      newList[teacherIndex].assignments[assignmentIndex].subject_id = e.target.value;
                                      setTeachersList(newList);
                                    }}
                                    className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
                                    style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white', appearance: 'none' }}
                                    disabled={!assignment.class_id}
                                  >
                                    <option value="">Select Subject</option>
                                    {assignment.class_id && classesList.find(c => c.id.toString() === assignment.class_id?.toString())?.subjects?.map(s => <option key={s.id} value={s.id}>{s.name || `Subject`}</option>)}
                                  </select>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  const newList = [...teachersList];
                                  newList[teacherIndex].assignments = newList[teacherIndex].assignments.filter((_, i) => i !== assignmentIndex);
                                  setTeachersList(newList);
                                }}
                                className="p-3 text-slate-400 hover:text-rose-500 transition-colors"
                                style={{ marginBottom: '0.25rem' }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          
                          <div className="flex justify-center" style={{ marginTop: '1.5rem' }}>
                            <button 
                              onClick={() => {
                                const newList = [...teachersList];
                                newList[teacherIndex].assignments.push({ id: Date.now(), class_id: '', section_id: '', subject_id: '' });
                                setTeachersList(newList);
                              }}
                              className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                              style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px' }}
                            >
                              <Plus className="w-3 h-3" /> Add Assignment
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center" style={{ marginTop: '2rem' }}>
                      <button 
                        onClick={() => setTeachersList([...teachersList, { id: Date.now(), email: '', assignments: [{ id: Date.now()+1, class_id: '', section_id: '', subject_id: '' }] }])}
                        className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                      >
                        <Plus className="w-4 h-4" /> Add Another Teacher
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
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
                    className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 7: STUDENTS */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Add Students</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Enroll students into classes.</p>
                </div>

                <div style={{ height: '1.5rem' }} />
                
                <div style={{ margin: '0 auto', maxWidth: '800px', width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm" style={{ padding: '0.65rem 1.25rem', borderRadius: '9999px' }}>
                     <Upload className="w-3 h-3 text-slate-400" /> Upload CSV
                  </button>
                </div>

                <div className={"bg-white border border-slate-200/60 p-6 md:p-8 relative"} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  <div className="space-y-4">
                    {studentsList.map((student, studentIndex) => (
                      <div key={student.id} className="relative" style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', marginBottom: '2rem' }}>
                        <button onClick={() => setStudentsList(studentsList.filter((_, i) => i !== studentIndex))} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 text-xs font-bold uppercase">Remove</button>
                        <h3 className="font-bold text-slate-900 tracking-wider border-b border-slate-200" style={{ fontSize: '14px', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Student {studentIndex + 1}</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                          <div className="relative">
                            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Student Name / ID <span className="text-rose-500">*</span></label>
                            <div className="relative">
                              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={student.identifier}
                                onChange={e => {
                                  const newList = [...studentsList];
                                  newList[studentIndex].identifier = e.target.value;
                                  setStudentsList(newList);
                                }}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 placeholder:text-slate-400"
                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                                placeholder="Jane Doe"
                              />
                            </div>
                          </div>
                          
                          <div className="relative">
                            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Class <span className="text-rose-500">*</span></label>
                            <div className="relative">
                              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select
                                value={student.class_id}
                                onChange={e => {
                                  const newList = [...studentsList];
                                  newList[studentIndex].class_id = e.target.value;
                                  newList[studentIndex].section_id = '';
                                  setStudentsList(newList);
                                }}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800"
                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white', appearance: 'none' }}
                              >
                                <option value="">Select Class</option>
                                {classesList.map(c => <option key={c.id} value={c.id}>{c.name || `Class ${c.id}`}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="relative">
                            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Section <span className="text-rose-500">*</span></label>
                            <div className="relative">
                              <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select
                                value={student.section_id}
                                onChange={e => {
                                  const newList = [...studentsList];
                                  newList[studentIndex].section_id = e.target.value;
                                  setStudentsList(newList);
                                }}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
                                style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white', appearance: 'none' }}
                                disabled={!student.class_id}
                              >
                                <option value="">Select Section</option>
                                {student.class_id && classesList.find(c => c.id.toString() === student.class_id?.toString())?.sections.map(s => <option key={s.id} value={s.id}>{s.name || `Section`}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center" style={{ marginTop: '2rem' }}>
                      <button 
                        onClick={() => setStudentsList([...studentsList, { id: Date.now(), identifier: '', class_id: '', section_id: '', status: 'active' }])}
                        className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                      >
                        <Plus className="w-4 h-4" /> Add Another Student
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
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
                    className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next Step</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 8: PLAN */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Select Plan</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Choose a subscription plan to complete your school setup.</p>
                </div>

                <div style={{ height: '1.5rem' }} />

                <div className={"bg-white border border-slate-200/60 p-6 md:p-8 relative"} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '1000px', width: '100%', backgroundColor: '#ffffff' }}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { id: 'FREE', name: 'FREE', price: '₦0', period: 'forever', desc: 'Branded Website • Basic Profile' },
                      { id: 'BASIC', name: 'BASIC', price: '₦50,000', period: 'per term', desc: 'Up to 100 Students • App Access' },
                      { id: 'PRO', name: 'PRO', price: '₦150,000', period: 'per term', desc: 'Up to 500 Students • AI Insights', highlight: true },
                      { id: 'PREMIUM', name: 'PREMIUM', price: 'Custom', period: 'custom', desc: 'Unlimited Students • Multi-School' }
                    ].map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, paymentOption: plan.id });
                          setPaymentSuccess(false);
                        }}
                        className={`group border text-left transition-all relative ${
                          formData.paymentOption === plan.id
                            ? 'border-[#146ef5] bg-[#146ef5]/5 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ borderRadius: '1.5rem', padding: '1.25rem' }}
                      >
                        {plan.highlight && (
                          <div 
                            className="absolute left-1/2 -translate-x-1/2 bg-[#146ef5] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm"
                            style={{ top: '-0.75rem', padding: '0.25rem 0.75rem', whiteSpace: 'nowrap' }}
                          >
                            Most Popular
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2" style={{ marginBottom: '0.5rem' }}>
                          <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: '#1e293b' }}>{plan.name}</h4>
                          <div className="relative flex items-center justify-center pointer-events-none">
                            <div 
                              className={`absolute inset-0 rounded-full transition-transform duration-300 ${
                                formData.paymentOption === plan.id ? 'scale-100 bg-blue-100' : 'scale-0'
                              }`}
                            />
                            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                              formData.paymentOption === plan.id 
                                ? 'bg-blue-600 border border-blue-600 text-white shadow-sm' 
                                : 'bg-white border border-gray-200 text-gray-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white'
                            }`}>
                              <Check size={12} strokeWidth={formData.paymentOption === plan.id ? 2.5 : 2} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2" style={{ marginBottom: '0.5rem' }}>
                          <span className="text-xl font-black" style={{ color: '#0f172a' }}>{plan.price}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>/ {plan.period}</span>
                        </div>
                        <p className="font-semibold" style={{ color: '#64748b', fontSize: '11px' }}>{plan.desc}</p>
                      </button>
                    ))}
                  </div>
                  
                  <div style={{ height: '3rem' }} />

                  <div className="flex flex-col gap-4 text-center">
                    <div className="text-left mb-2">
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Agent Referral Code (Optional)</label>
                      <div className="relative">
                        <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.referralCode || ''}
                          onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                          placeholder="e.g. ref/john-doe"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold placeholder-slate-400 focus:outline-none focus:border-[#146ef5] focus:ring-2 focus:ring-[#146ef5]/20 transition-all"
                          style={{ borderRadius: '1.5rem', padding: '1rem 1rem 1rem 2.5rem' }}
                        />
                      </div>
                    </div>

                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 text-left mb-2" style={{ marginTop: '1rem' }}>Plan Activation</h4>
                    
                    {!paymentSuccess ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.paymentOption === 'FREE' || formData.paymentOption === 'PREMIUM') {
                            setPaymentSuccess(true);
                          } else {
                            triggerOnlinePayment();
                          }
                        }}
                        className="w-full bg-[#146ef5] hover:bg-[#0f56c9] text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        style={{ padding: '1.25rem', borderRadius: '1.5rem', marginTop: '1rem' }}
                      >
                        {formData.paymentOption === 'FREE' ? 'Activate Free Plan' : formData.paymentOption === 'PREMIUM' ? 'Submit Enterprise Request' : 'Proceed to Pay via Paystack'}
                      </button>
                    ) : (
                      <div className="border border-emerald-100 bg-emerald-50/20 flex items-center justify-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider" style={{ padding: '1.25rem', borderRadius: '1.5rem', marginTop: '1rem' }} >
                        <CheckCircle2 className="w-5 h-5" /> {formData.paymentOption === 'FREE' ? 'Free Plan Ready!' : formData.paymentOption === 'PREMIUM' ? 'Enterprise Request Sent!' : 'Payment Confirmed Successfully!'}
                      </div>
                    )}

                    <div className="flex gap-2.5 items-start p-4 rounded-xl text-[10px] text-slate-400 font-semibold text-left leading-relaxed mt-2" style={{ backgroundColor: '#f8fafc' }}>
                      <Lock size={14} className="text-[#146ef5] shrink-0 mt-0.5" />
                      <span>Transactions processed securely. Subscriptions can be managed or canceled anytime from your school dashboard.</span>
                    </div>
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button 
                    onClick={prevStep} 
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !paymentSuccess}
                    className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Provisioning...</span>
                      </>
                    ) : (
                      <>
                        <span>Finalize Setup</span>
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

      {/* ONLINE SUBSCRIPTION CHECKOUT POPOVER MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isPaystackProcessing) setShowPaymentModal(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="bg-[#1fcb87] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-sans font-black tracking-wider text-sm">
                  <div className="w-5 h-5 rounded-full bg-white text-[#1fcb87] flex items-center justify-center font-black text-xs">p</div>
                  <span>paystack</span>
                  <span className="text-[10px] font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full">SECURE</span>
                </div>
                <div className="text-[10px] font-bold text-white/90">
                  sandbox simulator
                </div>
              </div>

              <form onSubmit={handlePaystackCheckout} className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Payment Settle Amount</span>
                  <h3 className="text-2xl font-black text-slate-800">
                    {formData.paymentOption === 'BASIC' ? '₦50,000.00' : formData.paymentOption === 'PRO' ? '₦150,000.00' : 'Custom'}
                  </h3>
                  <span className="block text-[11px] text-slate-500 font-medium mt-1">{formData.email || 'school@example.com'}</span>
                </div>

                {!isPaystackProcessing && !paymentSuccess && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="4000 1234 5678 9010"
                        value={paystackCardNum}
                        onChange={(e) => setPaystackCardNum(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1fcb87] focus:ring-1 focus:ring-[#1fcb87] transition-all text-sm text-slate-800 font-medium tracking-widest"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Expiry</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={paystackExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length > 2) val = `${val.slice(0,2)}/${val.slice(2)}`;
                            setPaystackExpiry(val);
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1fcb87] focus:ring-1 focus:ring-[#1fcb87] transition-all text-sm text-slate-800 font-medium tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">CVV</label>
                        <input
                          type="password"
                          required
                          placeholder="123"
                          value={paystackCvv}
                          onChange={(e) => setPaystackCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1fcb87] focus:ring-1 focus:ring-[#1fcb87] transition-all text-sm text-slate-800 font-medium tracking-widest"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1fcb87] hover:bg-[#19a86f] text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2"
                      style={{ padding: '1.25rem', borderRadius: '1.5rem' }}
                    >
                      Pay Now
                    </button>
                  </div>
                )}

                {isPaystackProcessing && !paymentSuccess && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-[#1fcb87] rounded-full animate-spin mb-4" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#1fcb87] animate-pulse">
                      {paystackStage}
                    </span>
                  </div>
                )}

                {paymentSuccess && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-[#1fcb87] rounded-full flex items-center justify-center text-white mb-4 animate-[bounce_0.5s_ease-out]">
                      <CheckCircle2 size={32} strokeWidth={3} />
                    </div>
                    <span className="text-lg font-black text-slate-800 mb-1">Payment Successful!</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Redirecting to app...</span>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
