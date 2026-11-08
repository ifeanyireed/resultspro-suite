'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSchool,
  IconBuilding,
  IconCertificate,
  IconBuildingSkyscraper,
  IconUsers,
  IconNetwork,
  IconAlertTriangle,
  IconFileText,
  IconCash,
  IconWifiOff,
  IconMessages,
  IconShieldCheck,
  IconServer,
  IconCalendar,
  IconClock,
  IconDeviceLaptop,
  IconMapPin,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconSparkles,
  IconBrandWhatsapp,
  IconCalendarEvent,
  IconUserCheck,
  IconPhoneCall,
  IconHelpCircle,
  IconListCheck,
  IconPlayerPlay,
  IconLock,
} from '@tabler/icons-react';
import Link from 'next/link';

// --- DATA DEFINITIONS ---

interface OrganizationOption {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  defaultModules: string[];
}

const ORGANIZATION_TYPES: OrganizationOption[] = [
  {
    id: 'k12',
    title: 'K-12 Private & International Schools',
    subtitle: 'Nursery, Primary, JSS & SSS seeking automated report cards, attendance, and exam management.',
    icon: IconSchool,
    defaultModules: ['resultspro', 'classroompro', 'examspro'],
  },
  {
    id: 'tertiary',
    title: 'Tertiary Institutions & Higher Ed',
    subtitle: 'Universities, polytechnics, and colleges needing semester CGPA computations, transcripts, and faculty portals.',
    icon: IconBuildingSkyscraper,
    defaultModules: ['resultspro', 'examspro', 'scholars_ng'],
  },
  {
    id: 'professional',
    title: 'Professional Training & Tech Academies',
    subtitle: 'ICAN, ACCA, coding bootcamps, and executive education requiring cohort workspaces and mentor reviews.',
    icon: IconCertificate,
    defaultModules: ['coursespro', 'examspro'],
  },
  {
    id: 'subeb',
    title: 'Government SUBEB & Exam Boards',
    subtitle: 'State Ministries of Education, SUBEB boards, and examination bodies running biometric audits and large-scale CBT.',
    icon: IconBuilding,
    defaultModules: ['examspro', 'scholars_ng', 'resultspro'],
  },
  {
    id: 'tutoring',
    title: 'Tutoring Hubs & Test Prep Centers',
    subtitle: 'WAEC, JAMB, Cambridge, SAT prep hubs managing student batches, timed mocks, and tutor hours billing.',
    icon: IconUsers,
    defaultModules: ['tutorspro', 'examspro', 'puzzlepro'],
  },
  {
    id: 'multicampus',
    title: 'Multi-Campus Faith & Enterprise Networks',
    subtitle: 'Educational networks with 3+ branches requiring centralized oversight, shared question banks, and inter-branch analytics.',
    icon: IconNetwork,
    defaultModules: ['resultspro', 'examspro', 'classroompro', 'scholars_ng'],
  },
];

interface PainPointOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  recommendedModule: string;
}

const PAIN_POINTS: PainPointOption[] = [
  {
    id: 'exam_malpractice',
    title: 'CBT Exam Fraud & Question Leakages',
    description: 'Impersonation during midterms/finals, leaked question papers, and lack of proctoring.',
    icon: IconAlertTriangle,
    recommendedModule: 'examspro',
  },
  {
    id: 'delayed_reports',
    title: 'Delayed Report Cards & Calculation Errors',
    description: 'Teachers spending 3+ weeks calculating cumulative marks, broadsheets, and handwriting report slips.',
    icon: IconFileText,
    recommendedModule: 'resultspro',
  },
  {
    id: 'fee_defaults',
    title: 'Fee Collection Defaults & Reconciliation Leakage',
    description: 'Parents claiming unverified bank transfers, manual teller cross-checking, and poor revenue visibility.',
    icon: IconCash,
    recommendedModule: 'resultspro',
  },
  {
    id: 'network_outages',
    title: 'Power Outages & Unreliable Internet',
    description: 'Exams and campus operations stalling whenever fiber or cellular data drops during the day.',
    icon: IconWifiOff,
    recommendedModule: 'examspro',
  },
  {
    id: 'multicampus_blindspot',
    title: 'Multi-Campus Disconnect & Record Fragmentation',
    description: 'Central management unable to view live enrollment, revenue, and teacher performance across distributed campuses.',
    icon: IconNetwork,
    recommendedModule: 'resultspro',
  },
  {
    id: 'parent_friction',
    title: 'Parent Communication Friction',
    description: 'Unanswered calls, lost WhatsApp broadcasts, and lack of immediate notification when students miss roll-call.',
    icon: IconMessages,
    recommendedModule: 'classroompro',
  },
  {
    id: 'transcript_fraud',
    title: 'Transcript Forgery & Verification Delays',
    description: 'Paper certificates forged by graduates; tedious manual verification for employers and foreign embassies.',
    icon: IconShieldCheck,
    recommendedModule: 'scholars_ng',
  },
  {
    id: 'teacher_overload',
    title: 'Teacher Administrative Burnout',
    description: 'Overburdened teachers spending hours on manual lesson notes and record-keeping instead of teaching.',
    icon: IconSchool,
    recommendedModule: 'classroompro',
  },
];

interface SolutionModule {
  id: string;
  name: string;
  tagline: string;
  highlight: string;
  icon: any;
}

const SOLUTION_MODULES: SolutionModule[] = [
  {
    id: 'resultspro',
    name: 'ResultsPRO',
    tagline: 'Institutional SIS & Automated Report Cards',
    highlight: 'Auto-computes cumulative broadsheets, generates holographic anti-forgery PDF report cards with QR codes.',
    icon: IconFileText,
  },
  {
    id: 'examspro',
    name: 'ExamsPRO',
    tagline: 'Anti-Cheat Offline & Cloud CBT Engine',
    highlight: 'Proctored local LAN & cloud CBT engine, automated randomization, 100% offline synchronization.',
    icon: IconShieldCheck,
  },
  {
    id: 'classroompro',
    name: 'ClassroomPRO',
    tagline: 'Digital Syllabus, Attendance & Timetables',
    highlight: 'Biometric student attendance, daily timetable builder, lesson plans, and parent portal feeds.',
    icon: IconSchool,
  },
  {
    id: 'coursespro',
    name: 'CoursesPRO',
    tagline: 'Cohort LMS & Interactive Peer Learning',
    highlight: 'Live video classrooms, mentor code/portfolio evaluations, interactive assignments, and peer workspaces.',
    icon: IconDeviceLaptop,
  },
  {
    id: 'tutorspro',
    name: 'TutorsPRO',
    tagline: 'Private Tutoring & Hourly Lesson Billing',
    highlight: 'Vetted tutor marketplace, student-tutor matchmaker, session timesheets, and escrow payouts.',
    icon: IconUsers,
  },
  {
    id: 'puzzlepro',
    name: 'PuzzlePRO',
    tagline: 'Gamified Cognitive Drills & Math Arenas',
    highlight: 'Daily brain teasers, mathematics arenas, and student aptitude tournament ranking.',
    icon: IconSparkles,
  },
  {
    id: 'scholars_ng',
    name: 'Scholars.ng',
    tagline: 'National ID, Transcript & Scholarship Registry',
    highlight: 'Student biometric universal ID, instant QR transcript verification, and bursary fund tracking.',
    icon: IconBuilding,
  },
];

export default function DemoBookingFlow() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [organizationType, setOrganizationType] = useState<string>('k12');
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([
    'delayed_reports',
    'exam_malpractice',
  ]);
  const [studentCount, setStudentCount] = useState<string>('250 – 1,000');
  const [campusCount, setCampusCount] = useState<string>('Single Campus');
  const [infrastructure, setInfrastructure] = useState<string>('Hybrid Grid + Hotspot');
  const [migrationNeed, setMigrationNeed] = useState<string>('Excel / Google Sheets');
  const [timeline, setTimeline] = useState<string>('Immediate (This Academic Term)');
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([
    'resultspro',
    'examspro',
    'classroompro',
  ]);

  // Logistics & Contact
  const [demoFormat, setDemoFormat] = useState<'virtual' | 'physical'>('virtual');
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState<string>('11:00 AM WAT');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [role, setRole] = useState<string>('School Proprietor / Owner');
  const [notes, setNotes] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Toggle Pain Point
  const handleTogglePainPoint = (id: string) => {
    setSelectedPainPoints((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((p) => p !== id) : [...prev, id];

      // Auto-suggest solution module
      const painObj = PAIN_POINTS.find((p) => p.id === id);
      if (!exists && painObj?.recommendedModule) {
        if (!selectedSolutions.includes(painObj.recommendedModule)) {
          setSelectedSolutions((s) => [...s, painObj.recommendedModule]);
        }
      }
      return updated;
    });
  };

  // Toggle Solution Module
  const handleToggleSolution = (id: string) => {
    setSelectedSolutions((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Select Org Type & auto-set default modules
  const handleSelectOrgType = (id: string) => {
    setOrganizationType(id);
    const org = ORGANIZATION_TYPES.find((o) => o.id === id);
    if (org && org.defaultModules) {
      setSelectedSolutions((prev) => {
        const combined = new Set([...prev, ...org.defaultModules]);
        return Array.from(combined);
      });
    }
  };

  // Dynamic Agenda & Recommendations
  const currentOrg = useMemo(
    () => ORGANIZATION_TYPES.find((o) => o.id === organizationType) || ORGANIZATION_TYPES[0],
    [organizationType]
  );

  const estimatedDuration = useMemo(() => {
    const base = 20;
    const addOn = Math.min(25, selectedSolutions.length * 5);
    return `${base + addOn} minutes`;
  }, [selectedSolutions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !phone || !institutionName) {
      setErrorMessage('Please fill in your name, official email, phone/WhatsApp number, and institution name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        organizationType: currentOrg.title,
        painPoints: selectedPainPoints.map((id) => PAIN_POINTS.find((p) => p.id === id)?.title || id),
        studentCount,
        campusCount,
        infrastructure,
        migrationNeed,
        timeline,
        selectedSolutions: selectedSolutions.map(
          (id) => SOLUTION_MODULES.find((m) => m.id === id)?.name || id
        ),
        demoFormat: demoFormat === 'virtual' ? 'Virtual (Google Meet / Zoom)' : 'On-Campus Executive Presentation',
        preferredDate,
        preferredTime,
        fullName,
        email,
        phone,
        institutionName,
        role,
        notes,
      };

      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmationData(data.booking);
      } else {
        setErrorMessage(data.error || 'Failed to submit demo booking. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('A network error occurred. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar deep link generator
  const googleCalendarUrl = useMemo(() => {
    if (!confirmationData) return '#';
    const title = encodeURIComponent(`ResultsPRO Executive Demo: ${confirmationData.contact.institutionName}`);
    const details = encodeURIComponent(
      `Tailored Demo for ${confirmationData.contact.fullName} (${confirmationData.contact.role})\n` +
      `Institution: ${confirmationData.contact.institutionName}\n` +
      `Modules: ${confirmationData.selectedSolutions.join(', ')}\n` +
      `Reference: ${confirmationData.referenceCode}\n` +
      `Demo Link will be emailed prior to the session.`
    );
    const location = encodeURIComponent(confirmationData.logistics.demoFormat);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }, [confirmationData]);

  // WhatsApp click-to-chat link
  const whatsappUrl = useMemo(() => {
    if (!confirmationData) return '#';
    const text = encodeURIComponent(
      `Hello ResultsPRO Team, I just booked a tailored demo for *${confirmationData.contact.institutionName}*.\n` +
      `Reference Code: *${confirmationData.referenceCode}*\n` +
      `Preferred Slot: ${confirmationData.logistics.preferredDate} at ${confirmationData.logistics.preferredTime}.\n` +
      `Name: ${confirmationData.contact.fullName} (${confirmationData.contact.role}).`
    );
    return `https://wa.me/2348000000000?text=${text}`;
  }, [confirmationData]);

  return (
    <div className="w-full">
      {/* SUCCESS CONFIRMATION VIEW */}
      {confirmationData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-12 max-w-4xl mx-auto my-8"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md">
            <IconCheck size={40} stroke={2.5} />
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-widest mb-3">
              Booking Confirmed
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Your Tailored Demo Is Scheduled!
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              Thank you, <strong className="text-slate-900">{confirmationData.contact.fullName}</strong>. We have reserved your tailored executive walkthrough for <strong className="text-slate-900">{confirmationData.contact.institutionName}</strong>.
            </p>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 font-mono text-sm font-bold text-slate-800 mb-8">
              <span className="text-slate-400 font-normal">Reference ID:</span>
              <span className="text-[#0D1060]">{confirmationData.referenceCode}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0D1060] text-white font-bold text-sm hover:bg-[#1A1FA8] transition shadow-lg"
            >
              <IconCalendarEvent size={20} />
              <span>Add to Google Calendar</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-lg"
            >
              <IconBrandWhatsapp size={20} />
              <span>Chat With Our Demo Lead on WhatsApp</span>
            </a>
          </div>

          {/* Session Overview Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IconListCheck className="text-blue-600" size={22} />
              <span>Your Demo Session Blueprint</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Date & Time</span>
                <p className="font-semibold text-slate-800">{confirmationData.logistics.preferredDate}</p>
                <p className="text-xs text-slate-500 mt-0.5">{confirmationData.logistics.preferredTime}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Format</span>
                <p className="font-semibold text-slate-800">{confirmationData.logistics.demoFormat}</p>
                <p className="text-xs text-slate-500 mt-0.5">Duration: ~{estimatedDuration}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Institution Scope</span>
                <p className="font-semibold text-slate-800">{confirmationData.organizationType}</p>
                <p className="text-xs text-slate-500 mt-0.5">{confirmationData.context.studentCount} students</p>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Modules Prepared for Demonstration:</span>
              <div className="flex flex-wrap gap-2">
                {confirmationData.selectedSolutions.map((sol: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-xs text-slate-800 shadow-xs"
                  >
                    <IconCheck size={14} className="text-emerald-600" />
                    <span>{sol}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex items-start gap-2">
              <IconHelpCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p>
                A calendar invitation with video conference coordinates has been dispatched to <strong>{confirmationData.contact.email}</strong>. If your institution requires a formal letter of invitation for the Board or Ministry, reply to the email or notify us on WhatsApp.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => {
                setConfirmationData(null);
                setCurrentStep(1);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
            >
              Book Another Demo Session
            </button>
          </div>
        </motion.div>
      ) : (
        /* MULTI-STEP WIZARD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          
          {/* LEFT WIZARD COLUMN (Steps 1 to 5) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
            
            {/* Step Indicator Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                  Step {currentStep} of 5
                </span>
                <span className="text-xs font-bold text-[#0D1060] bg-yellow-100/70 border border-[#FBBC04]/40 px-3 py-1 rounded-full">
                  {currentStep === 1 && 'SME & Institution Type'}
                  {currentStep === 2 && 'Core Challenges & Bottlenecks'}
                  {currentStep === 3 && 'Scale & Campus Context'}
                  {currentStep === 4 && 'Tailored Solutions'}
                  {currentStep === 5 && 'Logistics & Confirmation'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#FBBC04] transition-all duration-300 h-full"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* ERROR ALERT */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                <IconAlertTriangle className="text-rose-600 shrink-0" size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: ORGANIZATION TYPE */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    What Kind of Institution or SME Are You?
                  </h2>
                  <p className="text-slate-500 text-sm mt-1.5">
                    Select your operating category so we calibrate our demonstration with real workflows from your peers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {ORGANIZATION_TYPES.map((org) => {
                    const Icon = org.icon;
                    const isSelected = organizationType === org.id;
                    return (
                      <div
                        key={org.id}
                        onClick={() => handleSelectOrgType(org.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0D1060] bg-slate-50 shadow-md ring-2 ring-[#0D1060]/10'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div>
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                              isSelected
                                ? 'bg-[#FBBC04] text-[#0D1060]'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon size={24} />
                          </div>
                          <h3 className="font-bold text-slate-900 text-base mb-1.5 leading-snug">
                            {org.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {org.subtitle}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                          <span className={isSelected ? 'text-[#0D1060] font-bold' : 'text-slate-400'}>
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#0D1060] text-white flex items-center justify-center">
                              <IconCheck size={12} stroke={2.5} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: PAIN POINTS & CHALLENGES */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    What Are Your Core Operational Pain Points?
                  </h2>
                  <p className="text-slate-500 text-sm mt-1.5">
                    Select all that apply. We will directly show how ResultsPRO eliminates these bottlenecks during your demo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {PAIN_POINTS.map((pain) => {
                    const Icon = pain.icon;
                    const isSelected = selectedPainPoints.includes(pain.id);
                    return (
                      <div
                        key={pain.id}
                        onClick={() => handleTogglePainPoint(pain.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-[#0D1060] bg-amber-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#FBBC04] text-[#0D1060]' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">
                              {pain.title}
                            </h4>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded text-[#0D1060] focus:ring-[#FBBC04] h-4 w-4 pointer-events-none"
                            />
                          </div>
                          <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                            {pain.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONTEXT & SCALE COMPLEXITY */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Your Operational Context &amp; Infrastructure
                  </h2>
                  <p className="text-slate-500 text-sm mt-1.5">
                    Help us prepare the right network simulation (cloud vs. offline edge) and capacity tier.
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  {/* Student Population */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Total Student Enrollment
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['< 250 students', '250 – 1,000', '1,000 – 3,500', '3,500+ (Enterprise)'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setStudentCount(size)}
                          className={`px-3 py-3 rounded-xl border text-xs font-bold transition text-center ${
                            studentCount === size
                              ? 'bg-[#0D1060] text-white border-[#0D1060] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Campuses */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Operating Campuses / Branches
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {['Single Campus', '2 – 4 Campuses', '5+ Distributed Campuses'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCampusCount(c)}
                          className={`px-3 py-3 rounded-xl border text-xs font-bold transition text-center ${
                            campusCount === c
                              ? 'bg-[#0D1060] text-white border-[#0D1060] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Power & Network Infrastructure */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Power &amp; Network Infrastructure Reality
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          id: 'Reliable High-Speed Fiber',
                          desc: 'Continuous internet, low packet drop',
                        },
                        {
                          id: 'Hybrid Grid + Hotspot',
                          desc: 'Intermittent power, mobile data fallbacks',
                        },
                        {
                          id: 'Strictly Offline-First',
                          desc: 'Local LAN server required, zero constant web',
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setInfrastructure(item.id)}
                          className={`p-3.5 rounded-xl border text-left transition ${
                            infrastructure === item.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-bold mb-1">{item.id}</span>
                          <span
                            className={`block text-[11px] leading-tight ${
                              infrastructure === item.id ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Record Setup & Migration Need */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Current System to Migrate From
                      </label>
                      <select
                        value={migrationNeed}
                        onChange={(e) => setMigrationNeed(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                      >
                        <option value="Paper Registers & Physical Files">Paper Registers & Physical Files</option>
                        <option value="Excel / Google Sheets">Excel / Google Sheets</option>
                        <option value="Legacy Desktop Software (e.g. QuickSchools)">Legacy Desktop Software</option>
                        <option value="Existing Cloud Platform (Migrating Historical Data)">Existing Cloud Platform</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Target Deployment Timeline
                      </label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                      >
                        <option value="Immediate (This Academic Term)">Immediate (This Academic Term)</option>
                        <option value="Next Term / Semester">Next Term / Semester</option>
                        <option value="Next Academic Session (Annual Planning)">Next Academic Session</option>
                        <option value="Just Researching & Evaluating">Just Researching & Evaluating</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SOLUTIONS TO DEMO */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Select Which Solutions You Wish to See
                  </h2>
                  <p className="text-slate-500 text-sm mt-1.5">
                    We pre-selected modules based on your challenges. Feel free to toggle any extra solutions you want included.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {SOLUTION_MODULES.map((sol) => {
                    const Icon = sol.icon;
                    const isSelected = selectedSolutions.includes(sol.id);
                    return (
                      <div
                        key={sol.id}
                        onClick={() => handleToggleSolution(sol.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-[#0D1060] bg-slate-50/80 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[#FBBC04] text-[#0D1060]' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            <Icon size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-base">{sol.name}</h4>
                              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                                • {sol.tagline}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                              {sol.highlight}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#0D1060] text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <IconCheck size={13} stroke={2.5} />
                                <span>In Demo</span>
                              </>
                            ) : (
                              '+ Add'
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: SCHEDULE & CONTACT DETAILS */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Schedule Your Demo &amp; Contact Details
                  </h2>
                  <p className="text-slate-500 text-sm mt-1.5">
                    Pick your preferred session format and coordinates. We will send the calendar invite and meeting details.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                  {/* Format Toggle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Demo Format
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setDemoFormat('virtual')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center gap-3 ${
                          demoFormat === 'virtual'
                            ? 'border-[#0D1060] bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <IconDeviceLaptop
                          className={demoFormat === 'virtual' ? 'text-[#0D1060]' : 'text-slate-400'}
                          size={24}
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-900">Virtual Interactive Demo</p>
                          <p className="text-[11px] text-slate-500">Google Meet / Zoom (35 mins)</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setDemoFormat('physical')}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center gap-3 ${
                          demoFormat === 'physical'
                            ? 'border-[#0D1060] bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <IconMapPin
                          className={demoFormat === 'physical' ? 'text-[#0D1060]' : 'text-slate-400'}
                          size={24}
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-900">On-Campus Presentation</p>
                          <p className="text-[11px] text-slate-500">Lagos, Abuja &amp; Port Harcourt</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <IconCalendar size={16} /> Preferred Date
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <IconClock size={16} /> Preferred Time Slot (WAT)
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                      >
                        <option value="9:00 AM WAT">9:00 AM WAT (Morning Slot)</option>
                        <option value="11:00 AM WAT">11:00 AM WAT (Late Morning)</option>
                        <option value="1:00 PM WAT">1:00 PM WAT (Early Afternoon)</option>
                        <option value="3:00 PM WAT">3:00 PM WAT (Afternoon Slot)</option>
                        <option value="4:30 PM WAT">4:30 PM WAT (Executive Wrap-up)</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Adaeze Okafor"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="a.okafor@school.edu.ng"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Institution / Organization Name *
                      </label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        placeholder="e.g. Corona Schools, King's College"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Leadership Role / Title
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                      >
                        <option value="School Proprietor / Owner">School Proprietor / Owner</option>
                        <option value="Principal / Vice Principal">Principal / Vice Principal</option>
                        <option value="Head of Academics / Exam Officer">Head of Academics / Exam Officer</option>
                        <option value="Registrar / Administrative Director">Registrar / Administrative Director</option>
                        <option value="IT Director / Systems Administrator">IT Director / Systems Administrator</option>
                        <option value="Bursar / Financial Controller">Bursar / Financial Controller</option>
                        <option value="Ministry / SUBEB Representative">Ministry / SUBEB Representative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Specific Goals or Questions (Optional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Focus on offline CBT failover and JAMB-style broadsheets"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBBC04]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#FBBC04] hover:bg-[#E5A800] text-[#0D1060] font-black text-base shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#0D1060] border-t-transparent rounded-full animate-spin" />
                          <span>Locking in Your Custom Demo...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm &amp; Book My Tailored Demo</span>
                          <IconArrowRight size={20} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      Zero commitment required • Includes personalized migration assessment
                    </p>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP NAVIGATION BUTTONS (For Steps 1 to 4) */}
            {currentStep < 5 && (
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    <IconArrowLeft size={16} />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D1060] text-white font-bold text-xs hover:bg-[#1A1FA8] transition shadow-md"
                >
                  <span>Continue</span>
                  <IconArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DYNAMIC TAILORED AGENDA CARD (Real-time updates) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-[#0D1060] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#FBBC04] bg-[#FBBC04]/10 border border-[#FBBC04]/30 px-2.5 py-1 rounded-full">
                  Live Custom Agenda
                </span>
                <span className="text-xs text-white/60 font-semibold flex items-center gap-1">
                  <IconClock size={14} /> ~{estimatedDuration}
                </span>
              </div>

              <h3 className="text-xl font-black tracking-tight mb-1 text-white">
                Your Customized Walkthrough
              </h3>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                Calculated dynamically from your SME profile, scale, and operational challenges.
              </p>

              {/* Persona Pill */}
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FBBC04] text-[#0D1060] flex items-center justify-center shrink-0">
                    <currentOrg.icon size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Target Persona</span>
                    <p className="text-xs font-bold text-white leading-tight">{currentOrg.title}</p>
                  </div>
                </div>

                <div className="text-[11px] text-white/70 border-t border-white/10 pt-2.5 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/40">Enrollment Scale:</span>
                    <span className="font-semibold text-white">{studentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Network Model:</span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{infrastructure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Historical Data:</span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{migrationNeed}</span>
                  </div>
                </div>
              </div>

              {/* Selected Solutions */}
              <div className="mb-6">
                <span className="text-[11px] uppercase font-bold tracking-wider text-white/60 block mb-2.5">
                  Demonstration Modules ({selectedSolutions.length})
                </span>
                <div className="space-y-1.5">
                  {selectedSolutions.map((solId) => {
                    const sol = SOLUTION_MODULES.find((m) => m.id === solId);
                    if (!sol) return null;
                    return (
                      <div
                        key={sol.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-xs text-white font-medium"
                      >
                        <IconCheck size={14} className="text-[#FBBC04]" />
                        <span className="font-bold">{sol.name}</span>
                        <span className="text-white/40 text-[11px] truncate">— {sol.tagline}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Focus Topics from Pain Points */}
              <div className="mb-6 border-t border-white/10 pt-4">
                <span className="text-[11px] uppercase font-bold tracking-wider text-white/60 block mb-2">
                  Priority Focus Topics
                </span>
                {selectedPainPoints.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPainPoints.map((pId) => {
                      const p = PAIN_POINTS.find((pt) => pt.id === pId);
                      return (
                        <span
                          key={pId}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-amber-200"
                        >
                          {p?.title || pId}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 italic">No specific challenges selected yet.</p>
                )}
              </div>

              {/* EdTech Specialist Avatar Match */}
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FBBC04] text-[#0D1060] font-bold text-xs flex items-center justify-center shrink-0">
                  <IconUserCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Assigned Solutions Architect</p>
                  <p className="text-[11px] text-white/70">Senior African EdTech Specialist</p>
                </div>
              </div>
            </div>

            {/* Quick Proof Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <IconShieldCheck className="text-emerald-600" size={18} />
                <span>Enterprise Guarantee</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every demo includes our proprietary <strong>Sub-Saharan Offline Failover Simulation</strong>, demonstrating zero exam disruption even if your facility loses power and internet mid-session.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <IconShieldCheck size={14} className="text-[#0D1060]" />
                  <span>Zero Obligation</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconLock size={14} className="text-slate-400" />
                  <span>Confidential NDA</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
