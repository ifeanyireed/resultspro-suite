'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  User, 
  Search, 
  Users, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  AlertCircle,
  Smartphone,
  Mail,
  Check,
  Ticket,
  Clock,
  Sparkles,
  Info,
  CreditCard as CardIcon,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResultsProStepIndicator } from '@/components/onboarding/ResultsProStepIndicator';
import { ResultsProPageHeader } from '@/components/onboarding/ResultsProPageHeader';
import { ResultsProSectionLabel } from '@/components/onboarding/ResultsProSectionLabel';
import { ResultsProBottomNav } from '@/components/onboarding/ResultsProBottomNav';
import { ResultsProRegistryForm } from '@/components/onboarding/ResultsProRegistryForm';
const steps = [
  { id: 1, label: 'ROLE', icon: LayoutGrid },
  { id: 2, label: 'REGISTRY', icon: User },
  { id: 3, label: 'STUDENT', icon: Search },
  { id: 4, label: 'FAMILY', icon: Users },
  { id: 5, label: 'PAYMENT', icon: CreditCard }
];

export default function ParentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(2); // Starts at REGISTRY (Step 2)
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 2: Parent Registry
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    parentPassword: '',
    
    // Step 3: Student Verification
    admissionNumber: '',
    studentDob: '',
    newChildFirstName: '',
    newChildLastName: '',
    newChildClass: 'Grade 1',
    newChildDob: '',
    
    // Step 4: Family Profile
    relationshipType: 'Mother', // Default
    isEmergencyContact: true,
    siblings: [] as { name: string; admissionNumber: string; class: string }[],
    
    // Step 5: Payment
    paymentOption: 'PRO' as string,
    scratchCardPin: '',
  });

  // OTP Simulator States
  const [otpVerified, setOtpVerified] = useState(false);

  // Student Search Simulation States
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);
  const [isAddingNewChild, setIsAddingNewChild] = useState(false);
  const [isRegisteringChild, setIsRegisteringChild] = useState(false);
  const [studentVerified, setStudentVerified] = useState(false);
  const [verifiedStudentData, setVerifiedStudentData] = useState<{
    name: string;
    class: string;
    admissionNumber: string;
  } | null>(null);
  const [searchError, setSearchError] = useState('');
  const [linkConfirmed, setLinkConfirmed] = useState(false);
  const [searchStage, setSearchStage] = useState('');

  // Sibling Lookup States
  const [showAddSibling, setShowAddSibling] = useState(false);
  const [siblingAdminNo, setSiblingAdminNo] = useState('');
  const [siblingDob, setSiblingDob] = useState('');
  const [isSearchingSibling, setIsSearchingSibling] = useState(false);
  const [siblingSearchResult, setSiblingSearchResult] = useState<{
    name: string;
    class: string;
    admissionNumber: string;
  } | null>(null);
  const [siblingSearchError, setSiblingSearchError] = useState('');

  // Paystack / Flutterwave Online Payment Popover States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paystackCardNum, setPaystackCardNum] = useState('');
  const [paystackExpiry, setPaystackExpiry] = useState('');
  const [paystackCvv, setPaystackCvv] = useState('');
  const [isPaystackProcessing, setIsPaystackProcessing] = useState(false);
  const [paystackStage, setPaystackStage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [scratchCardError, setScratchCardError] = useState('');



  // Styling Variables (Matches resultspro UI aesthetics)
  const inputStyle = "w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all text-[0.875rem] text-slate-800 placeholder:text-slate-400";
  const labelStyle = "block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1";
  const cardStyle = "bg-[#ffffff] border border-[#e2e8f0] p-10 max-w-[800px] mx-auto w-full";



  // Student search simulator
  const handleStudentLookup = () => {
    if (!formData.admissionNumber || !formData.studentDob) {
      setSearchError('Admission Number and Date of Birth are required.');
      return;
    }
    setIsSearchingStudent(true);
    setSearchError('');
    setStudentVerified(false);
    
    // Simulate multi-stage network latency check
    setSearchStage('Connecting to academic service...');
    setTimeout(() => {
      setSearchStage('Validating student enrollment details...');
      setTimeout(() => {
        setSearchStage('Resolving profile data...');
        setTimeout(() => {
          setIsSearchingStudent(false);
          setVerifiedStudentData({
            name: 'Tunde Greenwood',
            class: 'Grade 10A',
            admissionNumber: formData.admissionNumber
          });
          setStudentVerified(true);
          setLinkConfirmed(true);
        }, 600);
      }, 600);
    }, 600);
  };

  // Add new child simulator
  const handleRegisterNewChild = () => {
    if (!formData.newChildFirstName || !formData.newChildLastName || !formData.newChildDob || !formData.newChildClass) {
      setSearchError('All fields are required to register a new child.');
      return;
    }
    setIsRegisteringChild(true);
    setSearchError('');
    setStudentVerified(false);
    
    setSearchStage('Creating student profile...');
    setTimeout(() => {
      setSearchStage('Generating Admission ID...');
      setTimeout(() => {
        setIsRegisteringChild(false);
        setVerifiedStudentData({
          name: `${formData.newChildFirstName} ${formData.newChildLastName}`,
          class: formData.newChildClass,
          admissionNumber: `NEW-${Math.floor(1000 + Math.random() * 9000)}`
        });
        setStudentVerified(true);
        setLinkConfirmed(true);
        setIsAddingNewChild(false);
      }, 800);
    }, 800);
  };

  // Sibling lookup simulator
  const handleSiblingLookup = () => {
    if (!siblingAdminNo || !siblingDob) {
      setSiblingSearchError('Sibling Admission Number and DOB are required.');
      return;
    }
    setIsSearchingSibling(true);
    setSiblingSearchError('');
    setSiblingSearchResult(null);

    setTimeout(() => {
      setIsSearchingSibling(false);
      setSiblingSearchResult({
        name: 'Amara Greenwood',
        class: 'Grade 10B',
        admissionNumber: siblingAdminNo
      });
    }, 1200);
  };

  const addSiblingToProfile = () => {
    if (siblingSearchResult) {
      // Check if already added
      const exists = formData.siblings.some(
        (s) => s.admissionNumber.toLowerCase() === siblingSearchResult.admissionNumber.toLowerCase()
      );
      if (exists) {
        setSiblingSearchError('This sibling is already linked to your profile.');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        siblings: [...prev.siblings, siblingSearchResult]
      }));
      // Reset search fields
      setSiblingSearchResult(null);
      setSiblingAdminNo('');
      setSiblingDob('');
      setShowAddSibling(false);
    }
  };

  const removeSibling = (adminNo: string) => {
    setFormData((prev) => ({
      ...prev,
      siblings: prev.siblings.filter((s) => s.admissionNumber !== adminNo)
    }));
  };

  // Scratch card formatting & auto validation
  const handleScratchCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[-\s]/g, '');
    if (/^\d*$/.test(val)) {
      // Format with dashes XXXX-XXXX-XXXX
      let formatted = val;
      if (val.length > 4 && val.length <= 8) {
        formatted = `${val.slice(0, 4)}-${val.slice(4)}`;
      } else if (val.length > 8) {
        formatted = `${val.slice(0, 4)}-${val.slice(4, 8)}-${val.slice(8, 12)}`;
      }
      setFormData(prev => ({ ...prev, scratchCardPin: formatted.slice(0, 14) }));
      
      // Auto-validate at 12 digits
      if (val.length === 12) {
        setScratchCardError('');
      }
    }
  };

  // Online subscription checkout triggers
  const triggerOnlinePayment = () => {
    setShowPaymentModal(true);
    setPaymentSuccess(false);
    setPaystackStage('Initialize Checkout Overlay...');
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
          // Wait briefly, then close popover modal
          setTimeout(() => {
            setShowPaymentModal(false);
          }, 1500);
        }, 800);
      }, 800);
    }, 800);
  };

  // Next steps checks
  const isStepValid = (stepId: number) => {
    switch (stepId) {
      case 2:
        return (
          formData.parentName.trim() !== '' &&
          formData.parentEmail.trim() !== '' &&
          formData.parentPhone.trim() !== '' &&
          formData.parentPassword.length >= 6 &&
          otpVerified
        );
      case 3:
        return studentVerified && linkConfirmed;
      case 4:
        return formData.relationshipType !== '';
      case 5:
        if (formData.paymentOption === 'FREE') return paymentSuccess; // Or true if Free doesn't require button click, but let's require clicking 'Activate'
        return paymentSuccess;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (step === 5) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(6); // Finish/success page
      }, 1500);
    } else {
      setStep((s) => Math.min(s + 1, 5));
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      router.push('/onboard');
    } else {
      setStep((s) => Math.max(s - 1, 2));
    }
  };

  const handleStepTrackerNavigation = (targetStep: number) => {
    if (targetStep === 1) {
      router.push('/onboard');
    } else if (targetStep < step) {
      setStep(targetStep);
    }
  };

  return (
    <>
      <main className="onboard-page bg-[#fafbfc] min-h-screen flex flex-col font-sans text-slate-900 selection:bg-blue-100" style={{ paddingBottom: '6rem' }}>
        <div className="h-2 md:h-4 w-full shrink-0" />
        
        <ResultsProStepIndicator 
          steps={steps} 
          activeStepId={step} 
          onStepClick={(id) => handleStepTrackerNavigation(id as number)} 
        />

        {/* TRANSITIONAL STEP CONTENT */}
        <div className="flex-1 w-full max-w-5xl self-center px-6 md:px-10 pt-4 pb-8 flex flex-col overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 flex flex-col"
              >
                {/* Spacer above title for better breathing room */}
                <div style={{ height: '4rem' }} />

                <ResultsProPageHeader 
                  title="Parent Registry" 
                  subtitle="Set up your parent credentials. We will verify your email and phone number to enable instant notification flags for academic results." 
                />

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                <ResultsProSectionLabel label="2. REGISTRY" />
                <div style={{ height: '1.25rem' }} />

                <ResultsProRegistryForm 
                  data={{
                    name: formData.parentName,
                    email: formData.parentEmail,
                    phone: formData.parentPhone,
                    password: formData.parentPassword
                  }}
                  onChange={(newData) => setFormData({ 
                    ...formData, 
                    parentName: newData.name ?? formData.parentName,
                    parentEmail: newData.email ?? formData.parentEmail,
                    parentPhone: newData.phone ?? formData.parentPhone,
                    parentPassword: newData.password ?? formData.parentPassword
                  })}
                  isVerified={otpVerified}
                  onVerifiedChange={setOtpVerified}
                />
                
                {/* Spacer between form and bottom nav */}
                <div style={{ height: '4rem' }} />

                <ResultsProBottomNav 
                  onBack={handlePrevStep}
                  backLabel="Role Selection"
                  onNext={handleNextStep}
                  nextLabel="Verify & Continue"
                  isNextDisabled={!isStepValid(2)}

                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 flex flex-col"
              >
                {/* Spacer above title for better breathing room */}
                <div style={{ height: '4rem' }} />

                <ResultsProPageHeader 
                  title="Student Verification" 
                  subtitle="Link your child to your parent dashboard. Input their official Admission/Student ID and Date of Birth to search the institutional database." 
                />

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                <ResultsProSectionLabel label="3. STUDENT" />
                <div style={{ height: '1.25rem' }} />

                <ResultsProRegistryForm
                  data={{ name: '', email: '', phone: '' }}
                  onChange={() => {}}
                  requireOtp={false}
                  requirePassword={false}
                  showName={false}
                  showEmail={false}
                  showPhone={false}
                  customTopElement={
                    <>
                      {/* Tabs / Toggle */}
                      {!studentVerified && (
                        <div className="flex gap-4 mb-6 pb-4 border-b border-slate-100">
                          <button
                            type="button"
                            onClick={() => { setIsAddingNewChild(false); setSearchError(''); }}
                            className={`text-xs font-black uppercase tracking-widest transition-colors ${!isAddingNewChild ? 'text-[#146ef5]' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            Find Existing Child
                          </button>
                          <button
                            type="button"
                            onClick={() => { setIsAddingNewChild(true); setSearchError(''); }}
                            className={`text-xs font-black uppercase tracking-widest transition-colors ${isAddingNewChild ? 'text-[#146ef5]' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            Register New Child
                          </button>
                        </div>
                      )}

                      {!studentVerified && !isAddingNewChild && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className={labelStyle}>Student Admission Number</label>
                              <input
                                type="text"
                                placeholder="e.g. GHS-2026-001"
                                value={formData.admissionNumber}
                                onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                className={inputStyle}
                                disabled={isSearchingStudent}
                                style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', height: '46px', appearance: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <label className={labelStyle}>Date of Birth</label>
                              <input
                                type="date"
                                value={formData.studentDob}
                                onChange={(e) => setFormData({ ...formData, studentDob: e.target.value })}
                                className={inputStyle}
                                disabled={isSearchingStudent}
                                style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', height: '46px', appearance: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>

                          {/* Lookup Action Trigger */}
                          {!isSearchingStudent && (
                            <button
                              type="button"
                              onClick={handleStudentLookup}
                              className="w-full h-[2.5rem] bg-[#146ef5] hover:bg-[#146ef5]/90 text-white font-bold rounded-full text-sm flex items-center justify-center transition-all hover:-translate-y-0.5"
                            >
                              Look Up Student Records
                            </button>
                          )}
                        </>
                      )}

                      {!studentVerified && isAddingNewChild && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className={labelStyle}>First Name</label>
                              <input
                                type="text"
                                placeholder="e.g. John"
                                value={formData.newChildFirstName}
                                onChange={(e) => setFormData({ ...formData, newChildFirstName: e.target.value })}
                                className={inputStyle}
                                disabled={isRegisteringChild}
                                style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', height: '46px', appearance: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <label className={labelStyle}>Last Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Doe"
                                value={formData.newChildLastName}
                                onChange={(e) => setFormData({ ...formData, newChildLastName: e.target.value })}
                                className={inputStyle}
                                disabled={isRegisteringChild}
                                style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', height: '46px', appearance: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <label className={labelStyle}>Class / Grade</label>
                              <select
                                value={formData.newChildClass}
                                onChange={(e) => setFormData({ ...formData, newChildClass: e.target.value })}
                                className={inputStyle}
                                disabled={isRegisteringChild}
                                style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', height: '46px', appearance: 'none', boxSizing: 'border-box' }}
                              >
                                <option>Grade 1</option>
                                <option>Grade 2</option>
                                <option>Grade 3</option>
                                <option>Grade 4</option>
                                <option>Grade 5</option>
                                <option>Grade 10A</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelStyle}>Date of Birth</label>
                              <input
                                type="date"
                                value={formData.newChildDob}
                                onChange={(e) => setFormData({ ...formData, newChildDob: e.target.value })}
                                className={inputStyle}
                                disabled={isRegisteringChild}
                                style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', height: '46px', appearance: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>

                          {!isRegisteringChild && (
                            <button
                              type="button"
                              onClick={handleRegisterNewChild}
                              className="w-full h-[2.5rem] bg-[#146ef5] hover:bg-[#146ef5]/90 text-white font-bold rounded-full text-sm flex items-center justify-center transition-all hover:-translate-y-0.5"
                            >
                              Register New Child
                            </button>
                          )}
                        </>
                      )}

                      {searchError && !studentVerified && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-rose-500">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{searchError}</span>
                        </div>
                      )}

                      {/* Loading States */}
                      {(isSearchingStudent || isRegisteringChild) && (
                        <div className="animate-pulse mt-4">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-6 h-6 border-[3px] border-[#146ef5]/20 border-t-[#146ef5] rounded-full animate-spin shrink-0" />
                            <div>
                              <h4 className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: '#000000' }}>
                                {isSearchingStudent ? 'Database Queries In Progress' : 'Processing Registration'}
                              </h4>
                              <p className="text-[10px] font-medium" style={{ color: '#000000' }}>{searchStage}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 opacity-40">
                            <div>
                              <label className={labelStyle}>Student Name</label>
                              <div className="h-[20px] w-3/4 bg-slate-200 rounded"></div>
                            </div>
                            <div>
                              <label className={labelStyle}>Class / Grade</label>
                              <div className="h-[20px] w-1/2 bg-slate-200 rounded"></div>
                            </div>
                            <div>
                              <label className={labelStyle}>Admission Number</label>
                              <div className="h-[20px] w-2/3 bg-slate-200 rounded"></div>
                            </div>
                            <div>
                              <label className={labelStyle}>Institution</label>
                              <div className="h-[20px] w-full bg-slate-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Match results resolved display */}
                      {studentVerified && verifiedStudentData && (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className={labelStyle}>Student Name</label>
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-slate-800">{verifiedStudentData.name}</span>
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Verified</span>
                              </div>
                            </div>
                            <div>
                              <label className={labelStyle}>Class / Grade</label>
                              <span className="block text-xl font-bold text-slate-800">{verifiedStudentData.class}</span>
                            </div>
                            <div>
                              <label className={labelStyle}>Admission Number</label>
                              <span className="block text-xl font-bold text-slate-800">{verifiedStudentData.admissionNumber}</span>
                            </div>
                            <div>
                              <label className={labelStyle}>Institution</label>
                              <span className="block text-xl font-bold text-slate-800">Greenwood High School</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setLinkConfirmed(!linkConfirmed)}
                            className="flex items-center gap-3 transition-colors group"
                            style={{ marginTop: '2.5rem' }}
                          >
                            <div
                              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center p-[3px] bg-transparent transition-all duration-300 ${
                                linkConfirmed
                                  ? 'border border-[#146ef5]'
                                  : 'border border-transparent group-hover:border-[#146ef5]'
                              }`}
                            >
                              <div
                                className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 ${
                                  linkConfirmed
                                    ? 'bg-[#146ef5] text-white'
                                    : 'bg-white border border-gray-200 text-slate-300 group-hover:bg-[#146ef5] group-hover:border-[#146ef5] group-hover:text-white'
                                }`}
                              >
                                <Check size={16} strokeWidth={linkConfirmed ? 2.5 : 2} />
                              </div>
                            </div>
                            <div className="text-left">
                              <span className={`block text-xs font-black uppercase tracking-wider ${linkConfirmed ? 'text-[#146ef5]' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                Confirm Link
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setStudentVerified(false);
                              setLinkConfirmed(false);
                            }}
                            className="mt-6 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest block transition-colors w-full text-center"
                          >
                            Reset Search Parameter
                          </button>
                        </motion.div>
                      )}
                    </>
                  }
                />

                {/* Spacer between form and bottom nav */}
                <div style={{ height: '4rem' }} />

                <ResultsProBottomNav 
                  onBack={handlePrevStep}
                  backLabel="Parent Registry"
                  onNext={handleNextStep}
                  nextLabel="Verify Relationship"
                  isNextDisabled={!isStepValid(3)}

                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 flex flex-col"
              >
                {/* Spacer above title for better breathing room */}
                <div style={{ height: '4rem' }} />

                <ResultsProPageHeader 
                  title="Family Profile" 
                  subtitle="Define your specific relationship context with linked students and configure emergency safety triggers." 
                />

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                <ResultsProSectionLabel label="4. FAMILY" />
                <div style={{ height: '1.25rem' }} />

                <div className={cardStyle} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  {/* Relationship Cards */}
                  <div className="mb-8" style={{ marginBottom: '2rem' }}>
                    <label className={labelStyle}>Select Relationship Type</label>
                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.375rem', borderRadius: '9999px', width: '100%', maxWidth: '400px', position: 'relative' }}>
                      {['Mother', 'Father', 'Guardian'].map((rel) => {
                        const isSelected = formData.relationshipType === rel;
                        return (
                          <button
                            key={rel}
                            type="button"
                            onClick={() => setFormData({ ...formData, relationshipType: rel })}
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
                            {rel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Emergency Toggle (Matching Confirm Link Style) */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isEmergencyContact: !formData.isEmergencyContact })}
                    className="w-full flex flex-row items-center justify-start group transition-all"
                    style={{ marginBottom: '2.5rem', marginTop: '1.5rem', gap: '1.25rem', textAlign: 'left' }}
                  >
                    <div
                      className={`shrink-0 w-[44px] h-[44px] rounded-full flex items-center justify-center p-[3px] bg-transparent transition-all duration-300 ${
                        formData.isEmergencyContact
                          ? 'border border-blue-600'
                          : 'border border-transparent group-hover:border-blue-600'
                      }`}
                    >
                      <div
                        className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 ${
                          formData.isEmergencyContact
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white'
                        }`}
                      >
                        <Check size={16} strokeWidth={formData.isEmergencyContact ? 2.5 : 2} />
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <span 
                        className="block text-xs font-black uppercase tracking-wider transition-colors duration-300"
                        style={{ color: formData.isEmergencyContact ? '#146ef5' : '#64748b' }}
                      >
                        Set As Emergency Contact
                      </span>
                    </div>
                  </button>

                  {/* Linked Students List */}
                  <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex items-center justify-between mb-4" style={{ marginBottom: '1rem' }}>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Linked Household Children</h4>
                      <button
                        type="button"
                        onClick={() => setShowAddSibling(!showAddSibling)}
                        className="bg-[#146ef5] hover:bg-[#146ef5]/90 text-white rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center shadow-md hover:-translate-y-0.5 transition-all"
                        style={{ padding: '0.75rem 1.5rem', gap: '0.5rem' }}
                      >
                        <Plus size={16} strokeWidth={3} /> Add Sibling
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* Primary Verified Student */}
                      <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', fontSize: '1.125rem' }}>
                            TG
                          </div>
                          <div>
                            <span className="block text-xl font-bold text-slate-800">Tunde Greenwood</span>
                            <span className="block text-xs text-slate-500 font-bold mt-1">Grade 10A • Anchor Student</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-[#146ef5] rounded-full text-[10px] font-black uppercase tracking-wider">Primary</span>
                      </div>

                      {/* Siblings */}
                      {formData.siblings.map((sib) => (
                        <div key={sib.admissionNumber} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 group">
                          <div className="flex items-center gap-4">
                            <div className="bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', fontSize: '1.125rem' }}>
                              AG
                            </div>
                            <div>
                              <span className="block text-xl font-bold text-slate-800">{sib.name}</span>
                              <span className="block text-xs text-slate-500 font-bold mt-1">{sib.class} • Sibling</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSibling(sib.admissionNumber)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Sibling Collapse Section */}
                  <AnimatePresence>
                    {showAddSibling && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-6"
                      >
                        <div 
                          style={{ padding: '2.5rem', border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px' }} 
                          className="flex flex-col gap-6"
                        >
                          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Link Sibling Student</h4>
                            <button 
                              type="button" 
                              onClick={() => setShowAddSibling(false)}
                              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
                            >
                              Cancel
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1">Sibling ID / Admission No</label>
                              <input
                                type="text"
                                placeholder="e.g. GHS-2026-002"
                                value={siblingAdminNo}
                                onChange={(e) => setSiblingAdminNo(e.target.value)}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all"
                                style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1">Date of Birth</label>
                              <input
                                type="date"
                                value={siblingDob}
                                onChange={(e) => setSiblingDob(e.target.value)}
                                className="focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all"
                                style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' }}
                              />
                            </div>
                          </div>

                          {siblingSearchError && (
                            <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                              <AlertCircle size={12} /> {siblingSearchError}
                            </span>
                          )}

                          {!siblingSearchResult && !isSearchingSibling && (
                            <button
                              type="button"
                              onClick={handleSiblingLookup}
                              className="w-full bg-[#146ef5] text-white rounded-full text-xs font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
                              style={{ padding: '1rem', backgroundColor: '#146ef5' }}
                            >
                              Verify Sibling Record
                            </button>
                          )}

                          {isSearchingSibling && (
                            <div className="animate-pulse mt-4">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-6 h-6 border-[3px] border-[#146ef5]/20 border-t-[#146ef5] rounded-full animate-spin shrink-0" />
                                <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: '#000000' }}>Searching records...</span>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-40">
                                <div>
                                  <div className="h-[24px] w-48 bg-slate-200 rounded mb-2"></div>
                                  <div className="h-[16px] w-24 bg-slate-200 rounded"></div>
                                </div>
                                <div className="h-[44px] w-32 bg-slate-200 rounded-full"></div>
                              </div>
                            </div>
                          )}

                          {siblingSearchResult && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                              <div>
                                <span className="block text-xl font-bold text-slate-800">{siblingSearchResult.name}</span>
                                <span className="block text-sm text-slate-500 font-bold mt-1">{siblingSearchResult.class}</span>
                              </div>
                              <button
                                type="button"
                                onClick={addSiblingToProfile}
                                className="bg-[#146ef5] hover:bg-[#146ef5]/90 text-white rounded-full text-xs font-extrabold uppercase tracking-widest transition-all shadow-md hover:-translate-y-0.5"
                                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#146ef5' }}
                              >
                                Add Sibling
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Spacer between form and bottom nav */}
                <div style={{ height: '4rem' }} />

                <ResultsProBottomNav 
                  onBack={handlePrevStep}
                  backLabel="Student Verification"
                  onNext={handleNextStep}
                  nextLabel="Proceed to Billing"
                  isNextDisabled={!isStepValid(4)}

                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 flex flex-col"
              >
                {/* Spacer above title for better breathing room */}
                <div style={{ height: '4rem' }} />

                <ResultsProPageHeader 
                  title="Payment & Activation" 
                  subtitle="Activate your portal lookup. Choose to settle access using a scratch card pin or subscribe termly via our payment processors." 
                />

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                <ResultsProSectionLabel label="5. PAYMENT" />
                <div style={{ height: '1.25rem' }} />

                <div className={cardStyle} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" style={{ marginBottom: '2.5rem' }}>
                    {[
                      { id: 'FREE', name: 'FREE', price: '₦0', period: 'forever', desc: '1 Student Profile • Basic View' },
                      { id: 'BASIC', name: 'BASIC', price: '₦5,000', period: 'per month', desc: '1 Student Tracking • Full Access' },
                      { id: 'PRO', name: 'PRO', price: '₦12,000', period: 'per month', desc: 'Up to 3 Students • AI Insights', highlight: true },
                      { id: 'PREMIUM', name: 'PREMIUM', price: '₦20,000', period: 'per month', desc: 'Up to 5 Students • Expert Consult' }
                    ].map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, paymentOption: plan.id });
                          setPaymentSuccess(false); // Reset on plan switch
                        }}
                        className={`group border text-left transition-all relative ${
                          formData.paymentOption === plan.id
                            ? 'border-[#146ef5] bg-[#146ef5]/5 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ borderRadius: '1.5rem', padding: '1.5rem' }}
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
                            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                              formData.paymentOption === plan.id 
                                ? 'bg-blue-600 border border-blue-600 text-white shadow-sm' 
                                : 'bg-white border border-gray-200 text-gray-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white'
                            }`}>
                              <Check size={14} strokeWidth={formData.paymentOption === plan.id ? 2.5 : 2} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2" style={{ marginBottom: '0.5rem' }}>
                          <span className="text-2xl font-black" style={{ color: '#0f172a' }}>{plan.price}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>/ {plan.period}</span>
                        </div>
                        <p className="text-[11px] font-semibold" style={{ color: '#64748b' }}>{plan.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Payment Inner Actions Panel */}
                  <div className="flex flex-col gap-4 text-center mt-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 text-left mb-2">Plan Activation</h4>
                    
                    {!paymentSuccess ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.paymentOption === 'FREE') {
                            setPaymentSuccess(true);
                          } else {
                            triggerOnlinePayment();
                          }
                        }}
                        className="w-full bg-[#146ef5] text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        style={{ padding: '1.25rem', borderRadius: '1.5rem', marginTop: '1rem' }}
                      >
                        {formData.paymentOption === 'FREE' ? 'Activate Free Plan' : `Proceed to Pay via Paystack`}
                      </button>
                    ) : (
                      <div className="border border-emerald-100 bg-emerald-50/20 flex items-center justify-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider" style={{ padding: '1.25rem', borderRadius: '1.5rem', marginTop: '1rem' }}>
                        <CheckCircle2 className="w-5 h-5" /> {formData.paymentOption === 'FREE' ? 'Free Plan Activated!' : 'Payment Confirmed Successfully!'}
                      </div>
                    )}

                    <div className="flex gap-2.5 items-start p-4 rounded-xl text-[10px] text-slate-400 font-semibold text-left leading-relaxed mt-2" style={{ backgroundColor: '#f8fafc' }}>
                      <Lock size={14} className="text-[#146ef5] shrink-0 mt-0.5" />
                      <span>Transactions processed securely. Subscriptions can be managed or canceled anytime from your parent dashboard.</span>
                    </div>
                  </div>
                </div>

                {/* Spacer between form and bottom nav */}
                <div style={{ height: '4rem' }} />

                <ResultsProBottomNav 
                  onBack={handlePrevStep}
                  backLabel="Family Profile"
                  onNext={handleNextStep}
                  nextLabel="Complete Onboarding"
                  isNextDisabled={!isStepValid(5) || isSubmitting}
                  isNextLoading={isSubmitting}

                />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white/95 border border-slate-200/60 rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(20,110,245,0.08)] text-center relative overflow-hidden"
              >
                {/* Floating sparkles background */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#146ef5]/5 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

                <div className="w-20 h-20 bg-gradient-to-tr from-[#146ef5] to-indigo-500 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-lg mx-auto mb-6 relative z-10 animate-bounce">
                  <CheckCircle2 size={40} className="stroke-[2.5]" />
                </div>

                <span className="text-[10px] font-extrabold text-[#146ef5] tracking-[0.25em] uppercase block mb-2">Onboarding Completed</span>
                <h2 className="text-3xl font-black text-slate-800 leading-tight mb-4">Profile Activated!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                  Welcome to the SchoolHub Ecosystem, <b>{formData.parentName}</b>. Your relationship ledger matches have been verified and synced downstream.
                </p>

                {/* Summary Box */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left max-w-lg mx-auto mb-8">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-200/40">Account Summary</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Parent User</span>
                      <span className="font-extrabold text-slate-800">{formData.parentName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Contact Detail</span>
                      <span className="font-medium">{formData.parentPhone}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Relationship</span>
                      <span className="font-extrabold text-[#146ef5]">{formData.relationshipType}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Main Linked Child</span>
                      <span className="font-extrabold text-slate-800">Tunde Greenwood (Grade 10A)</span>
                    </div>
                    {formData.siblings.length > 0 && (
                      <div className="col-span-2">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Linked Siblings</span>
                        <span className="font-medium text-slate-700">
                          {formData.siblings.map(s => `${s.name} (${s.class})`).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://schoolhub.resultspro.ng"
                    className="px-8 py-4 bg-[#146ef5] hover:bg-[#146ef5]/90 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all text-center"
                  >
                    Launch SchoolHub Portal
                  </a>
                  <button
                    type="button"
                    onClick={() => alert("Setup summary print instructions issued (Simulation).")}
                    className="px-8 py-4 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-full font-bold text-xs uppercase tracking-widest transition-all text-center"
                  >
                    Print Receipt
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
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isPaystackProcessing) setShowPaymentModal(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Centered Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-md relative z-10 overflow-hidden"
            >
              {/* Paystack green-themed mockup banner */}
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
                  <h3 className="text-2xl font-black text-slate-800">₦2,500.00</h3>
                  <span className="block text-[11px] text-slate-500 font-medium mt-1">{formData.parentEmail || 'parent@example.com'}</span>
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
                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1fcb87] text-sm font-bold text-slate-800 placeholder:text-slate-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM / YY"
                          value={paystackExpiry}
                          onChange={(e) => setPaystackExpiry(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1fcb87] text-sm font-bold text-slate-800 placeholder:text-slate-300 text-center"
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
                          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1fcb87] text-sm font-bold text-slate-800 placeholder:text-slate-300 text-center"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-[2.5rem] bg-[#1fcb87] hover:bg-[#1fcb87]/90 text-white font-bold rounded-full text-sm flex items-center justify-center transition-all hover:-translate-y-0.5 mt-4 gap-1.5"
                    >
                      <Lock size={12} className="stroke-[2.5]" /> Pay ₦2,500.00
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="w-full py-2.5 border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-colors"
                    >
                      Cancel Payment
                    </button>
                  </div>
                )}

                {/* Processing Transaction Simulation */}
                {isPaystackProcessing && (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 border-4 border-[#1fcb87]/20 border-t-[#1fcb87] rounded-full animate-spin mb-4" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-1">Gateway Handshake</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{paystackStage}</p>
                  </div>
                )}

                {/* Complete Successful Payment Checkout Display */}
                {paymentSuccess && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-6 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-sm animate-pulse">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-1">Transaction Successful</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Payment activation references committed successfully.</p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
