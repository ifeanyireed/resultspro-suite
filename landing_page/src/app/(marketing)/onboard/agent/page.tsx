'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ResultsProRegistryForm } from '@/components/onboarding/ResultsProRegistryForm';
import { ResultsProStepIndicator } from '@/components/onboarding/ResultsProStepIndicator';
import {
  LayoutGrid,
  ClipboardList,
  ShieldCheck,
  Wallet,
  Share2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Copy,
  Check,
  Sparkles,
  FileText,
  X,
  Building2,
  TrendingUp,
  Percent,
  ImageIcon,
  Camera,
  Plus,
  Link,
  CreditCard
} from 'lucide-react';
const steps = [
  { id: 1, label: 'ROLE', icon: LayoutGrid },
  { id: 2, label: 'REGISTER', icon: ClipboardList },
  { id: 3, label: 'KYC', icon: ShieldCheck },
  { id: 4, label: 'LEDGER', icon: Wallet },
  { id: 5, label: 'CONSOLE', icon: Share2 }
];

const nigerianZones = [
  'Lagos (South West)',
  'Abuja FCT (North Central)',
  'Rivers (South South)',
  'Enugu (South East)',
  'Kano (North West)',
  'Kaduna (North West)',
  'Oyo (South West)',
  'Anambra (South East)',
  'Plateau (North Central)',
  'Delta (South South)',
  'Akwa Ibom (South South)'
];

const docTypes = [
  { id: 'NIN', name: 'National Identity Number (NIN)', desc: '11-digit national identity card' },
  { id: 'Passport', name: 'International Passport', desc: 'Standard biometric travel passport' },
  { id: 'License', name: "Driver's License", desc: 'FRSC government-issued driver permit' }
];

const banks = [
  'Access Bank',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'Guaranty Trust Bank (GTB)',
  'Key Stone Bank',
  'Moniepoint MFB',
  'OPay Digital Services',
  'Sterling Bank',
  'United Bank for Africa (UBA)',
  'Wema Bank',
  'Zenith Bank'
];

export default function AgentOnboarding() {
  const router = useRouter();

  // Starting at Step 2 (REGISTER) per instructions
  const [step, setStep] = useState(2);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '123 Test Street, Ikeja',
    state: 'Lagos State',
    lga: 'Ikeja',
    documentType: 'NIN',
    bankName: 'Zenith Bank',
    accountNumber: '',
    accountName: '',
    customSlug: ''
  });

  // Track if custom slug has been manually edited
  const [isSlugManual, setIsSlugManual] = useState(false);

  // File Upload State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  // KYC verification simulator state
  const [isVerifyingKYC, setIsVerifyingKYC] = useState(false);
  const [kycProgressStep, setKycProgressStep] = useState(0);

  // Ledger verification state
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);
  const [resolvedAccountName, setResolvedAccountName] = useState('');

  // Referral Console interactions state
  const [copied, setCopied] = useState(false);
  const [schoolsSlider, setSchoolsSlider] = useState(10);
  const [agentPlan, setAgentPlan] = useState(1);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [isCompletedFlow, setIsCompletedFlow] = useState(false);

  // Automatically update the custom referral slug based on the full name, unless edited manually
  useEffect(() => {
    if (!isSlugManual) {
      const slugified = formData.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, customSlug: slugified || 'agent-name' }));
    }
  }, [formData.fullName, isSlugManual]);

  // Handle Text Input updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Screen 1: Registration Validation
  const isRegistrationValid =
    formData.fullName.trim().length >= 3 &&
    formData.email.includes('@') &&
    formData.phone.trim().length >= 10 &&
    formData.address.trim().length >= 10;

  // Screen 2: KYC Validation & Submission Handshake
  const isKYCReady = docFile !== null && selfieFile !== null;

  const triggerKYCVerification = () => {
    if (!isKYCReady) return;
    setStep(4); // Advance to Financial Ledger (Step 4) immediately
    setIsVerifyingKYC(true);
    setKycProgressStep(0);

    const checkInterval = setInterval(() => {
      setKycProgressStep(prev => {
        if (prev < 3) {
          return prev + 1;
        } else {
          clearInterval(checkInterval);
          setTimeout(() => {
            setIsVerifyingKYC(false);
          }, 800);
          return prev;
        }
      });
    }, 900);
  };

  // Screen 3: Ledger Verification Handshake
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, accountNumber: val }));

    if (val.length === 10) {
      setIsResolvingAccount(true);
      setResolvedAccountName('');
      setTimeout(() => {
        setIsResolvingAccount(false);
        setResolvedAccountName('Chinedu Okafor'); // Mock resolved account name
      }, 1200);
    } else {
      setIsResolvingAccount(false);
      setResolvedAccountName('');
    }
  };

  const isLedgerValid = formData.accountNumber.length === 10 && resolvedAccountName === 'Chinedu Okafor';

  // Screen 4: Referral console and copy link functions
  const copyReferralLink = () => {
    const url = `resultspro.ng/ref/${formData.customSlug || 'agent-name'}`;
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Commission Calculations
  const getCommissionPercentage = (schools: number) => {
    if (schools <= 19) return 10;
    if (schools <= 49) return 15;
    return 20;
  };

  const currentRate = getCommissionPercentage(schoolsSlider);
  const averageSchoolTermlySub = 100000; // 100,000 NGN
  const onboardingBounty = schoolsSlider * averageSchoolTermlySub * (currentRate / 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  // Final flow submission
  const handleFinalizeOnboarding = () => {
    setIsSubmittingFinal(true);
    setTimeout(() => {
      setIsSubmittingFinal(false);
      setIsCompletedFlow(true);
    }, 1800);
  };

  // Step Tracker Render Navigation Click
  const handleStepClick = (sId: number) => {
    if (sId === 1) {
      router.push('/onboard');
    } else if (sId < step) {
      setStep(sId);
    }
  };

  const inputClass = "focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all";
  const inputStyle = { padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white', color: '#0f172a' };
  const labelStyle = "block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1";
  const cardStyle = "bg-[#ffffff] border border-[#e2e8f0] p-10 max-w-[800px] mx-auto w-full";

  return (
    <>
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

            {/* SCREEN 1: ACCOUNT REGISTRATION */}
            {step === 2 && (
              <motion.div
                key="screen1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                {/* Form Header */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Account Registration</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Provide accurate bio-data details. This cannot be easily changed.</p>
                </div>

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                {/* Sub-sections/Step label indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">2. REGISTER</span>
                </div>
                <div style={{ height: '1.25rem' }} />

                <ResultsProRegistryForm 
                  data={{
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    state: formData.state,
                    lga: formData.lga,
                  }}
                  onChange={(newData) => setFormData({ 
                    ...formData, 
                    fullName: newData.name ?? formData.fullName,
                    email: newData.email ?? formData.email,
                    phone: newData.phone ?? formData.phone,
                    address: newData.address ?? formData.address,
                    state: newData.state ?? formData.state,
                    lga: newData.lga ?? formData.lga
                  })}
                  requireOtp={false}
                  requirePassword={false}
                  showAddress={true}
                  showStateLga={true}
                />

                <div style={{ height: '4rem' }} />
                {/* Bottom Navigation Button Bar */}
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button
                    onClick={() => router.push('/onboard')}
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Change Role
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    disabled={!isRegistrationValid}
                    className="bg-[#146ef5] hover:bg-[#146ef5]/90 text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next: KYC Verification</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: KYC VERIFICATION */}
            {step === 3 && (
              <motion.div
                key="screen2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                {/* Form Header */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">KYC Verification</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Verify your identity profile to unlock referral commission limits.</p>
                </div>

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                {/* Sub-sections/Step label indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">3. KYC</span>
                </div>
                <div style={{ height: '1.25rem' }} />

                <div className={cardStyle} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>

                  <div className="space-y-8">
                    {/* Document Type Slider */}
                    <div>
                      <label className={labelStyle} style={{ marginTop: '0.75rem' }}>Select Document Type</label>
                      <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.375rem', borderRadius: '9999px', width: '100%', maxWidth: '400px', position: 'relative' }}>
                        {docTypes.map((type) => {
                          const isSelected = formData.documentType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, documentType: type.id })}
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
                              {type.id}
                            </button>
                          );
                        })}
                      </div>
                      <p className="uppercase tracking-wider text-slate-400 font-extrabold mt-2 pl-2" style={{ fontSize: '9px' }}>
                        {docTypes.find(t => t.id === formData.documentType)?.name} - {docTypes.find(t => t.id === formData.documentType)?.desc}
                      </p>
                      <div style={{ height: '1rem' }} />
                    </div>

                    {/* File Upload Grids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                      {/* Drag and Drop Document Area */}
                      <div className="flex flex-col w-full items-center">
                        <label className={labelStyle} style={{ marginTop: '0.75rem' }}>{formData.documentType} Document Scan</label>
                        <label 
                          htmlFor="doc-upload-input"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              setDocFile(e.dataTransfer.files[0]);
                            }
                          }}
                          className="relative mx-auto rounded-3xl flex flex-col items-center justify-center cursor-pointer group transition-all mt-2"
                          style={{ aspectRatio: '1/1', width: '75%', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1), 0 10px 15px -5px rgba(0,0,0,0.04)' }}
                        >
                          <input
                            id="doc-upload-input"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setDocFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          {docFile ? (
                            <div className="w-full h-full rounded-3xl overflow-hidden relative">
                                <img
                                  src={URL.createObjectURL(docFile)}
                                  alt="Document Source"
                                  className="absolute object-cover w-full h-full"
                                />
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
                                Upload Document
                              </div>
                            </div>
                          )}
                        </label>
                      </div>

                      {/* Selfie Upload Area */}
                      {/* Selfie Upload Area */}
                      <div className="flex flex-col w-full items-center">
                        <label className={labelStyle} style={{ marginTop: '0.75rem' }}>Live Selfie Upload</label>
                        <label 
                          htmlFor="selfie-upload-input"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              setSelfieFile(e.dataTransfer.files[0]);
                            }
                          }}
                          className="relative mx-auto rounded-full flex items-center justify-center cursor-pointer group transition-all mt-2"
                          style={{ aspectRatio: '1/1', width: '75%', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1), 0 10px 15px -5px rgba(0,0,0,0.04)' }}
                        >
                          <input
                            id="selfie-upload-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSelfieFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />

                          {selfieFile ? (
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                <img
                                  src={URL.createObjectURL(selfieFile)}
                                  alt="Selfie Source"
                                  className="absolute object-cover w-full h-full"
                                />
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
                                <span className="text-white font-black uppercase tracking-widest text-[10px] drop-shadow-md">Selfie</span>
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
                      </div>

                    </div>
                  </div>
                </div>

                <div style={{ height: '4rem' }} />
                {/* Bottom Navigation Button Bar */}
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button
                    onClick={() => setStep(2)}
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    onClick={triggerKYCVerification}
                    disabled={!isKYCReady}
                    className="bg-[#146ef5] hover:bg-[#146ef5]/90 text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Verify & Continue</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: FINANCIAL LEDGER */}
            {step === 4 && (
              <motion.div
                key="screen3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8 flex flex-col"
              >
                <div style={{ height: '4rem' }} />
                {/* Form Header */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Financial Ledger</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Setup your designated bank details for automated commission payouts.</p>
                </div>

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                {/* Sub-sections/Step label indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">4. LEDGER</span>
                </div>
                <div style={{ height: '1.25rem' }} />
                <div className={cardStyle} style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '2.5rem', margin: '0 auto', maxWidth: '800px', width: '100%', backgroundColor: '#ffffff' }}>
                  {isVerifyingKYC ? (
                    <div className="w-full animate-pulse transition-opacity duration-300">
                      <div className="flex flex-col items-center justify-center mb-8">
                        <Loader2 className="w-10 h-10 text-[#146ef5] animate-spin mb-4" />
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Verifying Credentials...</h3>
                        <p className="text-slate-500 text-sm font-medium">Running background checks, please wait.</p>
                      </div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          {[1, 2, 3].map(i => (
                            <div key={`top-${i}`} className="space-y-2">
                              <div className="w-24 h-2.5 bg-slate-200 rounded-full"></div>
                              <div className="w-full h-12 bg-slate-50 rounded border border-slate-100"></div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2].map(i => (
                            <div key={`bottom-${i}`} className="space-y-2">
                              <div className="w-24 h-2.5 bg-slate-200 rounded-full"></div>
                              <div className="w-full h-12 bg-slate-50 rounded border border-slate-100"></div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="w-24 h-2.5 bg-slate-200 rounded-full"></div>
                          <div className="w-full h-12 bg-slate-50 rounded border border-slate-100"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ResultsProRegistryForm 
                      data={{
                        name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        state: formData.state,
                        lga: formData.lga
                      }}
                      onChange={(newData) => setFormData({ 
                        ...formData, 
                        fullName: newData.name ?? formData.fullName,
                        email: newData.email ?? formData.email,
                        phone: newData.phone ?? formData.phone,
                        address: newData.address ?? formData.address,
                        state: newData.state ?? formData.state,
                        lga: newData.lga ?? formData.lga
                      })}
                      requireOtp={false}
                      requirePassword={false}
                      showAddress={false}
                      showStateLga={false}
                      customTopElement={
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          <div>
                            <label className={labelStyle} style={{ marginTop: '0.75rem' }}>Bank Name</label>
                            <div className="relative">
                              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select
                                value={formData.bankName}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, bankName: e.target.value })}
                                className={`${inputClass} cursor-pointer`}
                                style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                              >
                                {banks.map(b => <option key={b}>{b}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelStyle} style={{ marginTop: '0.75rem' }}>Account Number</label>
                            <div className="relative">
                              <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                placeholder="10-digit account number"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                className={inputClass}
                                style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                                maxLength={10}
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelStyle} style={{ marginTop: '0.75rem' }}>Account Name (Auto-verified)</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                disabled
                                placeholder="Will be auto-filled..."
                                value={formData.accountName}
                                className={`${inputClass} disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
                                style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                              />
                            </div>
                          </div>
                        </div>
                      }
                    />
                  )}
                </div>

                <div style={{ height: '4rem' }} />
                {/* Bottom Navigation Button Bar */}
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    onClick={() => setStep(5)}
                    disabled={formData.accountNumber.length < 10}
                    className="bg-[#146ef5] hover:bg-[#146ef5]/90 text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <span>Next: Set Profile URL</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 4: REFERRAL CONSOLE */}
            {step === 5 && (
              <motion.div
                key="screen4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8 flex flex-col"
              >

                <div style={{ height: '4rem' }} />
                {/* Form Header */}
                <div className="text-center mb-6 flex flex-col items-center">
                  <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Referral Console</h1>
                  <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Configure your links, forecast payouts, and view marketing materials.</p>
                </div>

                {/* Spacer above Section Label */}
                <div style={{ height: '1.5rem' }} />

                {/* Sub-sections/Step label indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">5. CONSOLE</span>
                </div>
                <div style={{ height: '1.25rem' }} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

                  {/* Left Column: Link Generator & Collateral */}
                  <div className="lg:col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    {/* Link Generator Box */}
                    <div className="bg-[#ffffff] border border-[#e2e8f0] w-full" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '1.75rem' }}>
                      <h3 className="font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-4 mb-5" style={{ fontSize: '20px' }}>
                        Referral Link Customizer
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Custom Reference Slug</label>
                          <div className={`flex items-center relative ${inputClass}`} style={{ ...inputStyle, paddingLeft: '4rem', overflow: 'hidden', maxWidth: '300px' }}>
                            <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-400 select-none">ref/</span>
                            <input
                              type="text"
                              value={formData.customSlug}
                              onChange={(e) => {
                                setIsSlugManual(true);
                                const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                setFormData(prev => ({ ...prev, customSlug: cleaned }));
                              }}
                              placeholder="reference-slug"
                              className="w-full h-full bg-transparent outline-none border-none text-[13px] font-bold text-[#0f172a] placeholder-slate-400"
                            />
                          </div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                          <div className="flex justify-between items-center gap-3">
                            <div className="flex flex-col" style={{ gap: '0.25rem' }}>
                              <span className="text-base font-medium text-[#146ef5] select-all truncate leading-none" style={{ paddingBottom: '4px' }}>
                                resultspro.ng/ref/{formData.customSlug || 'agent-name'}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block leading-none">
                                Live referral url
                              </span>
                            </div>
                            <button
                              onClick={copyReferralLink}
                              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center p-[3px] bg-transparent transition-all duration-300 group cursor-pointer shrink-0 ${copied ? 'border border-[#146ef5]' : 'border border-transparent hover:border-[#146ef5]'}`}
                              title="Copy to Clipboard"
                            >
                              <div
                                className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 ${copied ? 'bg-[#146ef5] text-white' : 'bg-white border border-slate-200 text-slate-400 group-hover:bg-[#146ef5] group-hover:border-[#146ef5] group-hover:text-white'}`}
                              >
                                {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2} />}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Marketing Collateral Deck */}
                    <div className="bg-[#ffffff] border border-[#e2e8f0] w-full" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '1.75rem' }}>
                      <h3 className="font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-4" style={{ fontSize: '20px', marginBottom: '1.5rem' }}>
                        Marketing Assets Deck
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                          { name: "ResultsPRO Deck Slide.pdf", size: "4.8 MB" },
                          { name: "ExamsPRO CBT Demo Video.mp4", size: "18.2 MB" },
                          { name: "Brand Assets Package.zip", size: "9.5 MB" },
                          { name: "Sales Outreach Email Templates.docx", size: "1.2 MB" },
                          { name: "Social Media Campaign Banners.zip", size: "14.3 MB" }
                        ].map((item, idx, arr) => (
                          <div key={idx} className="flex justify-between items-center transition-all cursor-pointer group" style={{ paddingTop: '1rem', paddingBottom: '1rem', borderBottom: idx !== arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center p-[3px] bg-transparent transition-all duration-300 border border-transparent group-hover:border-[#146ef5] shrink-0">
                                <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 bg-white border border-slate-200 text-slate-400 group-hover:bg-[#146ef5] group-hover:border-[#146ef5] group-hover:text-white">
                                  <FileText size={16} strokeWidth={2} />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700 block tracking-tight group-hover:text-[#146ef5] transition-colors leading-none" style={{ marginBottom: '0.25rem' }}>{item.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">{item.size}</span>
                              </div>
                            </div>
                            <button className="bg-[#146ef5] text-white border border-transparent hover:bg-[#0f56c9] transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center shadow-sm hover:shadow hover:-translate-y-0.5" style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px' }}>
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Interactive Earnings Estimator */}
                  <div className="lg:col-span-6">
                    <div className="bg-[#ffffff] border border-[#e2e8f0] w-full flex flex-col h-full" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.02)', borderRadius: '4px', padding: '1.75rem' }}>
                      <h3 className="font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-4 flex justify-between items-center" style={{ fontSize: '20px', marginBottom: '1.5rem' }}>
                        <span>Earnings Estimator</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#146ef5] px-2 py-0.5 bg-sky-50 rounded-full border border-sky-100">
                          <Percent className="w-3 h-3" /> {currentRate}% COMM.
                        </span>
                      </h3>

                      {/* Estimation calculator metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-[#146ef5] to-[#0f56c9] border border-transparent flex flex-col justify-between transition-all group" style={{ padding: '1.25rem', borderRadius: '4px', boxShadow: '0 10px 25px -5px rgba(20, 110, 245, 0.4)', aspectRatio: '1 / 1' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center p-[3px] bg-white/20 transition-all duration-300 border border-white/30 group-hover:border-white/60 shrink-0">
                              <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 bg-white text-[#146ef5]">
                                <Building2 size={16} strokeWidth={2} />
                              </div>
                            </div>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/80">
                              Schools Referred
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-white leading-none tracking-tighter" style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>
                              {schoolsSlider}
                            </span>
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">New subscribed schools</span>
                          </div>
                        </div>

                        <div className="bg-white border border-[#e2e8f0] flex flex-col justify-between transition-all hover:border-[#146ef5] group" style={{ padding: '1.25rem', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', aspectRatio: '1 / 1' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center p-[3px] bg-transparent transition-all duration-300 border border-transparent group-hover:border-[#146ef5] shrink-0">
                              <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 bg-white border border-slate-200 text-slate-400 group-hover:bg-[#146ef5] group-hover:border-[#146ef5] group-hover:text-white">
                                <CreditCard size={16} strokeWidth={2} />
                              </div>
                            </div>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                              Onboarding Bounty
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-slate-800 leading-none tracking-tighter" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                              {formatCurrency(onboardingBounty)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commission</span>
                          </div>
                        </div>
                      </div>

                      {/* Range Slider */}
                      <div className="mb-8" style={{ marginTop: '2.5rem' }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Projected Onboardings</span>
                          <span className="text-xs font-extrabold text-slate-600">{schoolsSlider} / 100</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={100}
                          value={schoolsSlider}
                          onChange={(e) => setSchoolsSlider(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#146ef5] focus:outline-none focus:ring-0"
                        />
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 select-none">
                          <span>1 School</span>
                          <span>50 Schools</span>
                          <span>100 Schools</span>
                        </div>
                      </div>

                      {/* Commission Tiers Breakdown */}
                      <div className="mt-8 border-t border-slate-100" style={{ paddingTop: '2rem' }}>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-4">Commission Tiers Breakdown</span>
                        <div>
                          <div className="bg-slate-100 rounded-xl p-1 relative">
                            <div className="relative flex w-full">
                              {/* Sliding Indicator */}
                              <div 
                                className="absolute top-0 bottom-0 w-1/3 bg-white rounded-lg shadow-sm border border-slate-200 transition-transform duration-500 ease-out" 
                                style={{ 
                                  transform: `translateX(${schoolsSlider <= 19 ? '0%' : schoolsSlider <= 49 ? '100%' : '200%'})`
                                }}
                              />
                              {[
                                { rate: "10% COMM.", active: schoolsSlider <= 19 },
                                { rate: "15% COMM.", active: schoolsSlider >= 20 && schoolsSlider <= 49 },
                                { rate: "20% COMM.", active: schoolsSlider >= 50 }
                              ].map((t, idx) => (
                                <div
                                  key={idx}
                                  className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-300 ${t.active ? 'text-[#146ef5]' : 'text-slate-500'}`}
                                  style={{ paddingTop: '0.875rem', paddingBottom: '0.875rem' }}
                                >
                                  <span className="text-sm font-black">
                                    {t.rate}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Labels under the segmented control */}
                          <div className="flex w-full mt-3 px-1">
                            {[
                              { label: "1 - 19 Schools", active: schoolsSlider <= 19 },
                              { label: "20 - 49 Schools", active: schoolsSlider >= 20 && schoolsSlider <= 49 },
                              { label: "50+ Schools", active: schoolsSlider >= 50 }
                            ].map((t, idx) => (
                              <div key={idx} className="flex-1 text-center">
                                <span className={`text-[9px] font-extrabold uppercase tracking-widest transition-colors duration-300 ${t.active ? 'text-slate-600' : 'text-slate-400'}`}>
                                  {t.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Agent Plan Selection */}
                      <div className="mt-auto border-t border-slate-100" style={{ paddingTop: '2rem', marginTop: '2rem' }}>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-4">Agent Plan Selection</span>
                        <div>
                          <div className="bg-slate-100 rounded-xl p-1 relative cursor-pointer">
                            <div className="relative flex w-full">
                              {/* Sliding Indicator */}
                              <div 
                                className="absolute top-0 bottom-0 w-1/3 bg-white rounded-lg shadow-sm border border-slate-200 transition-transform duration-500 ease-out pointer-events-none" 
                                style={{ 
                                  transform: `translateX(${agentPlan === 0 ? '0%' : agentPlan === 1 ? '100%' : '200%'})`
                                }}
                              />
                              {[
                                { name: "Basic", id: 0 },
                                { name: "Pro", id: 1 },
                                { name: "Premium", id: 2 }
                              ].map((t) => (
                                <div
                                  key={t.id}
                                  onClick={() => setAgentPlan(t.id)}
                                  className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-300 ${agentPlan === t.id ? 'text-[#146ef5]' : 'text-slate-500'}`}
                                  style={{ paddingTop: '0.875rem', paddingBottom: '0.875rem' }}
                                >
                                  <span className="text-sm font-black uppercase tracking-wide">
                                    {t.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Labels under the segmented control */}
                          <div className="flex w-full mt-3 px-1">
                            {[
                              { label: "₦10,000 / mo", limit: "Up to 5 Schools", id: 0 },
                              { label: "₦30,000 / mo", limit: "Up to 20 Schools", id: 1 },
                              { label: "₦100,000 / mo", limit: "Unlimited", id: 2 }
                            ].map((t) => (
                              <div key={t.id} className="flex-1 flex flex-col items-center">
                                <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-300 ${agentPlan === t.id ? 'text-slate-600' : 'text-slate-400'}`}>
                                  {t.label}
                                </span>
                                <span className={`text-[9px] font-bold mt-1 tracking-wide transition-colors duration-300 ${agentPlan === t.id ? 'text-[#146ef5]' : 'text-slate-400 opacity-60'}`}>
                                  {t.limit}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Pay Button */}
                          <div style={{ marginTop: '2.5rem' }}>
                            <button className="w-full bg-[#146ef5] text-white border border-transparent hover:bg-[#0f56c9] transition-all font-black uppercase tracking-widest text-[11px] flex items-center justify-center shadow-sm hover:shadow hover:-translate-y-0.5" style={{ padding: '0.75rem 1.25rem', borderRadius: '9999px' }}>
                              Subscribe to {agentPlan === 0 ? 'Basic' : agentPlan === 1 ? 'Pro' : 'Premium'} Plan
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                <div style={{ height: '4rem' }} />
                {/* Bottom Navigation Button Bar */}
                <div className="w-full shrink-0 border-t border-gray-200 flex justify-between sticky bottom-0 bg-[#fafbfc] px-6 py-6 z-10" style={{ marginTop: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <button
                    onClick={() => setStep(4)}
                    disabled={isSubmittingFinal}
                    className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    onClick={handleFinalizeOnboarding}
                    disabled={isSubmittingFinal}
                    className="bg-[#146ef5] hover:bg-[#0f56c9] text-white transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px' }}
                  >
                    {isSubmittingFinal ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Customizing Console...</span>
                      </>
                    ) : (
                      <>
                        <span>Finalize Setup</span> <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Copy-to-clipboard Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/35 border border-slate-800"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold tracking-tight">Referral link copied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Success Screen */}
      <AnimatePresence>
        {isCompletedFlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-50 px-6"
          >
            <div className="w-20 h-20 rounded-full bg-[#146ef5] flex items-center justify-center text-white mb-6 shadow-lg shadow-sky-500/50 relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-sky-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ zIndex: -1, opacity: 0.25 }}
              />
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 tracking-tight">
              Welcome to ResultsPRO, {formData.fullName}!
            </h1>
            <p className="text-slate-400 text-base md:text-lg text-center max-w-md font-medium mb-8">
              Your partner referral console is fully provisioned. You can now start onboarding schools and tracking payouts.
            </p>
            <button
              onClick={() => router.push('/onboard')}
              className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-md shadow-white/10"
            >
              Open Agent Console <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
