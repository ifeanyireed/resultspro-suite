'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import {
  IconCalendarEvent,
  IconClock,
  IconBrandZoom,
  IconSchool,
  IconCheck,
  IconShieldCheck,
  IconAward,
  IconFileSpreadsheet,
  IconPrinter,
  IconAlertTriangle,
  IconArrowRight,
  IconBrandWhatsapp,
  IconSparkles,
  IconTicket,
  IconChevronDown,
  IconChevronUp,
  IconUserCheck,
  IconChecklist,
  IconMail,
  IconPhone,
  IconUser,
  IconMapPin,
  IconChartBar,
} from '@tabler/icons-react';

export default function SmartSchoolEventsPage() {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 22,
    minutes: 15,
    seconds: 40,
  });

  // Registration Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    school_name: '',
    role: 'School Proprietor / Director',
    state_location: 'Lagos',
    estimated_students: '200 - 500 Students',
    pain_points: [] as string[],
  });

  const [submitting, setSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // FAQ Toggle State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Target Webinar Date: Thursday, Nov 26, 2026 at 11:00 AM WAT
  useEffect(() => {
    const targetDate = new Date('2026-11-26T11:00:00+01:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckboxChange = (pain: string) => {
    setFormData((prev) => {
      const exists = prev.pain_points.includes(pain);
      return {
        ...prev,
        pain_points: exists
          ? prev.pain_points.filter((p) => p !== pain)
          : [...prev.pain_points, pain],
      };
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/smart_school/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      setRegisteredData(data.registration);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMsg(err.message || 'Something went wrong. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is this webinar truly 100% free for schools?',
      a: 'Yes, absolutely. The Smart School Webinar Series is sponsored by ResultsPRO and Scholars.ng as part of our institutional digital transformation initiative across Nigeria. There are no hidden fees or credit card requirements.',
    },
    {
      q: 'What if I cannot attend the live broadcast on Thursday?',
      a: 'We strongly recommend registering even if you are not sure you can attend live. All registered educators receive the full high-definition video recording, the step-by-step PDF results playbook, and the NERDC-standard Excel score compilation templates directly in their email.',
    },
    {
      q: 'Can multiple teachers and administrators from the same school register?',
      a: 'Yes! We encourage school owners to register alongside their Vice Principals (Academic), Examination Officers, and Form Masters so the whole academic committee is aligned on modern results automation.',
    },
    {
      q: 'Does ResultsPRO support both Primary and Secondary school grading systems in Nigeria?',
      a: 'Yes. ResultsPRO supports both junior/senior secondary (WAEC/NECO 9-point scale A1–F9, CA1/CA2 30/70 or 40/60 splits) and primary school cognitive and letter grading with psychomotor and affective domain remarks.',
    },
    {
      q: 'How do I access the webinar session on the event day?',
      a: 'Upon registering, you will receive an instant confirmation ticket code, an email calendar invitation, and access to our private WhatsApp VIP attendee lounge where the direct Zoom link will be broadcast prior to 11:00 AM WAT.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans">
      <Navbar />

      {/* --- HERO BANNER & REGISTRATION DESK --- */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0D1060] via-[#0D1060]/95 to-slate-900">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-amber-400/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-nets max-w-7xl mx-auto px-4 relative z-10">
          {/* Breadcrumb Pill */}
          <MotionRise className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-amber-300 border border-amber-400/30 text-xs font-bold tracking-wide uppercase shadow-sm">
              <IconSparkles className="w-4 h-4 text-amber-400" /> Smart School Webinar Series · Edition 01
            </span>
          </MotionRise>

          {/* Master Headline */}
          <MotionRise delay={0.05} className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Free &amp; Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">EOT Results Processing</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The step-by-step masterclass for Nigerian School Proprietors, Principals &amp; Exam Officers to eliminate calculation errors, automate Continuous Assessment broadsheets, and publish tamper-proof digital report cards in under 15 minutes.
            </p>
          </MotionRise>

          {/* Event Quick Meta Bar */}
          <MotionRise delay={0.1} className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-200">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <IconCalendarEvent className="w-5 h-5 text-amber-400" />
              <span>Thursday, Nov 26, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <IconClock className="w-5 h-5 text-amber-400" />
              <span>11:00 AM – 12:00 PM WAT</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <IconBrandZoom className="w-5 h-5 text-blue-400" />
              <span>Live Zoom &amp; Virtual Webcast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <IconAward className="w-5 h-5 text-emerald-400" />
              <span>Free Certificate of Attendance</span>
            </div>
          </MotionRise>

          {/* Live Dynamic Countdown Timer */}
          <MotionRise delay={0.15} className="mt-8 max-w-xl mx-auto">
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl">
              <div className="text-center text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                Live Broadcast Commences In
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Days</span>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-4xl font-extrabold text-white font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Hours</span>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-4xl font-extrabold text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Minutes</span>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Seconds</span>
                </div>
              </div>
            </div>
          </MotionRise>

          {/* Main Hero Grid: Value Bullets (Left) + Registration Form Card (Right) */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Why This Webinar is Critical */}
            <MotionRise delay={0.2} className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <IconFileSpreadsheet className="w-7 h-7 text-amber-400 shrink-0" />
                  <span>The End-of-Term Reality for Nigerian Schools</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every December and July, Nigerian school administrators endure 2 to 3 weeks of exhaustion: chasing teachers for marks, manually checking thousands of arithmetic sums, struggling with corrupted Excel formulas, and spending hundreds of thousands of Naira on printed report card booklets that are often delayed or disputed by parents.
                </p>

                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    What You Will Master in This 45-Minute Session:
                  </h4>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span><strong>1-Click Broadsheet Generation:</strong> Consolidate scores across CA1 (20%), CA2 (20%), and Exam (60%) across all 18 curriculum subjects automatically.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span><strong>Automated WAEC/NECO Grade Pacing:</strong> Dynamic conversion into A1, B2, B3, C4, C5, C6, D7, E8, F9, class positions (1st, 2nd, 3rd), and arm averages without Excel headaches.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span><strong>Cognitive, Affective &amp; Psychomotor Ratings:</strong> Standardized 5-point domain rating and auto-generated teacher remarks matching student GPA.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span><strong>Tamper-Proof Parent Portal &amp; Scratch Cards:</strong> Issue encrypted scratch card PINs or portal credentials so parents check results instantly on their phones.</span>
                    </li>
                  </ul>
                </div>

                {/* Free Bonuses Box */}
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
                    <IconTicket className="w-4 h-4 text-amber-400" />
                    <span>Free Exclusive Bonuses for All Attendees:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    ✓ Immediate Free ResultsPRO Trial Setup for your school&apos;s upcoming EOT results.
                    <br />
                    ✓ Pre-formatted Nigerian NERDC Continuous Assessment Excel Spreadsheets.
                    <br />
                    ✓ Official Digital Certificate of Professional Development.
                  </p>
                </div>
              </div>
            </MotionRise>

            {/* Right Column: The Contact Collection Registration Form */}
            <MotionRise delay={0.25} className="lg:col-span-6">
              <div id="register" className="p-6 sm:p-8 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-100 relative overflow-hidden">
                {/* Decorative Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-blue-600 to-indigo-600" />

                {registeredData ? (
                  /* REGISTRATION CONFIRMED STATE */
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <IconCheck className="w-10 h-10 stroke-[3]" />
                    </div>

                    <div className="space-y-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider border border-emerald-200">
                        Registration Confirmed!
                      </span>
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Your Seat is Reserved, {registeredData.full_name}!
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        We have logged your pass for <strong>{registeredData.school_name}</strong>. A calendar invite has been queued for <strong>{registeredData.email}</strong>.
                      </p>
                    </div>

                    {/* Virtual Admission Pass Ticket */}
                    <div className="p-5 rounded-2xl bg-slate-900 text-white text-left space-y-3 relative overflow-hidden shadow-lg border border-slate-800">
                      <div className="flex justify-between items-start pb-2 border-b border-white/10">
                        <div>
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Webinar Admission Pass</span>
                          <h4 className="font-extrabold text-base text-white">{registeredData.series_name}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-white/20 text-white font-mono text-xs font-bold">
                          {registeredData.ticket_code}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400">Edition</span>
                          <p className="font-semibold text-white">{registeredData.edition_title}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Date &amp; Time</span>
                          <p className="font-semibold text-white">{registeredData.date_time}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-300">Access Channel:</span>
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <IconBrandZoom className="w-4 h-4 text-blue-400" /> Zoom Live Stream
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                      <a
                        href={registeredData.whatsapp_group}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <IconBrandWhatsapp className="w-5 h-5" />
                        Join VIP WhatsApp Attendees Lounge
                      </a>

                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Smart+School+Webinar:+Free+%26+Easy+EOT+Results+Processing&dates=20261126T100000Z/20261126T110000Z&details=Live+virtual+masterclass+on+automating+End-of-Term+results+for+Nigerian+schools.+Zoom+Link:+${encodeURIComponent(registeredData.zoom_access)}&location=Online+Zoom+Webcast`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <IconCalendarEvent className="w-4 h-4 text-blue-600" />
                        Add to Google Calendar
                      </a>

                      <a
                        href="https://resultspro.ng"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-xs font-semibold text-blue-600 hover:underline pt-2"
                      >
                        Explore ResultsPRO Engine in the meantime →
                      </a>
                    </div>
                  </div>
                ) : (
                  /* REGISTRATION FORM STATE */
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Free Seat Reservation</span>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                        Register Your School
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Reserve your free live Zoom pass and receive the complete Results Processing Starter Pack.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {errorMsg}
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <IconUser className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Olumide Adeleke"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Official Email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <IconMail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            required
                            placeholder="principal@school.edu.ng"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp / Phone <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <IconPhone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            placeholder="+234 803 123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* School Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        School / Institution Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <IconSchool className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Greenwood Academy, Lekki"
                          value={formData.school_name}
                          onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Role & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Role / Designation
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-white"
                        >
                          <option value="School Proprietor / Director">School Proprietor / Director</option>
                          <option value="Principal / Head of School">Principal / Head of School</option>
                          <option value="Examination Officer">Examination Officer</option>
                          <option value="Vice Principal (Academic)">Vice Principal (Academic)</option>
                          <option value="ICT Director / Computer Teacher">ICT Director / Computer Teacher</option>
                          <option value="Form Master / Form Mistress">Form Master / Form Mistress</option>
                          <option value="Academic Registrar">Academic Registrar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          State / Location
                        </label>
                        <select
                          value={formData.state_location}
                          onChange={(e) => setFormData({ ...formData, state_location: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-white"
                        >
                          <option value="Lagos">Lagos State</option>
                          <option value="Abuja (FCT)">Abuja (FCT)</option>
                          <option value="Rivers (Port Harcourt)">Rivers State</option>
                          <option value="Ogun">Ogun State</option>
                          <option value="Oyo (Ibadan)">Oyo State</option>
                          <option value="Kano">Kano State</option>
                          <option value="Kaduna">Kaduna State</option>
                          <option value="Edo (Benin)">Edo State</option>
                          <option value="Delta">Delta State</option>
                          <option value="Anambra">Anambra State</option>
                          <option value="Enugu">Enugu State</option>
                          <option value="Ondo">Ondo State</option>
                          <option value="Kwara">Kwara State</option>
                          <option value="Other State">Other Nigerian State</option>
                          <option value="International">Outside Nigeria</option>
                        </select>
                      </div>
                    </div>

                    {/* Student Population */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Approximate Student Enrollment
                      </label>
                      <select
                        value={formData.estimated_students}
                        onChange={(e) => setFormData({ ...formData, estimated_students: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-white"
                      >
                        <option value="Under 200 Students">Under 200 Students</option>
                        <option value="200 - 500 Students">200 – 500 Students</option>
                        <option value="500 - 1,000 Students">500 – 1,000 Students</option>
                        <option value="1,000 - 2,500 Students">1,000 – 2,500 Students</option>
                        <option value="2,500+ Students (Multi-Campus)">2,500+ Students (Multi-Campus)</option>
                      </select>
                    </div>

                    {/* Top Results Challenges Checklist */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Biggest Results Challenges (Select all that apply):
                      </label>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        {[
                          'Excel formula crashes & arithmetic calculation errors',
                          'Teachers submitting CA and exam marks late',
                          'High printing & report card paper booklet costs',
                          'Manual position ranking (1st, 2nd, 3rd) headaches',
                          'Report card tampering & fake result forgery risks',
                        ].map((pain) => (
                          <label key={pain} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pain_points.includes(pain)}
                              onChange={() => handleCheckboxChange(pain)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{pain}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {submitting ? (
                        <span>Reserving Your Seat...</span>
                      ) : (
                        <>
                          <span>Reserve Free Webinar Seat &amp; Resource Pack</span>
                          <IconArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400">
                      🔒 100% Free · Strictly for School Administrators · No Spam
                    </p>
                  </form>
                )}
              </div>
            </MotionRise>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE 4 WORKSHOP MODULES --- */}
      <section className="py-20 bg-slate-900 border-t border-white/5 relative">
        <div className="container-nets max-w-7xl mx-auto px-4">
          <MotionRise className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Masterclass Curriculum</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What You Will Learn in 45 Action-Packed Minutes
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              A practical, no-fluff walkthrough designed to empower your examination committee before the upcoming examination week.
            </p>
          </MotionRise>

          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white">1-Click Broadsheet Synthesis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Learn how subject teachers submit scores online, and how the exam officer generates master class broadsheets in under 60 seconds with automated grade boundary calculations.
              </p>
            </div>

            {/* Module 2 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Error-Free WAEC/NECO Grading</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eliminate manual arithmetic forever. Automatically compute class rankings (1st, 2nd, 3rd), subject averages, class minimum/maximum, and weighted Continuous Assessment ratios.
              </p>
            </div>

            {/* Module 3 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Affective &amp; Psychomotor Domains</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standardize teacher evaluation chits. Configure 5-point ratings for punctuality, neatness, and honesty, plus AI-assisted personalized form teacher and principal remarks.
              </p>
            </div>

            {/* Module 4 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                04
              </div>
              <h3 className="text-lg font-bold text-white">Digital Results &amp; Scratch Cards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deliver verified report cards directly to parents via WhatsApp, SMS links, or batch-printed scratch cards with cryptographic PIN security that stops tampering dead in its tracks.
              </p>
            </div>
          </MotionStagger>
        </div>
      </section>

      {/* --- SECTION 3: COMPARISON TABLE (MANUAL VS RESULTSPRO) --- */}
      <section className="py-20 bg-slate-950 border-t border-white/5">
        <div className="container-nets max-w-5xl mx-auto px-4">
          <MotionRise className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">The Modern Transformation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why 850+ Nigerian Schools Switched from Manual Spreadsheets
            </h2>
          </MotionRise>

          <MotionRise delay={0.1} className="overflow-x-auto rounded-3xl border border-white/10 shadow-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                  <th className="py-4 px-6 font-bold">Process Milestone</th>
                  <th className="py-4 px-6 font-bold text-rose-400">Traditional Excel / Paper</th>
                  <th className="py-4 px-6 font-bold text-emerald-400">ResultsPRO Automation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="hover:bg-white/5">
                  <td className="py-4 px-6 font-semibold text-white">Scores Compilation Time</td>
                  <td className="py-4 px-6 text-rose-300">14 to 21 sleepless days</td>
                  <td className="py-4 px-6 text-emerald-300 font-bold">15 minutes automated</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="py-4 px-6 font-semibold text-white">Arithmetic &amp; Sum Calculation</td>
                  <td className="py-4 px-6 text-rose-300">Prone to formula breaks &amp; human error</td>
                  <td className="py-4 px-6 text-emerald-300 font-bold">100% verified zero-error math</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="py-4 px-6 font-semibold text-white">Printing &amp; Paper Expense</td>
                  <td className="py-4 px-6 text-rose-300">₦150,000 – ₦450,000+ per term</td>
                  <td className="py-4 px-6 text-emerald-300 font-bold">₦0 (Instant PDF + Scratch Card)</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="py-4 px-6 font-semibold text-white">Report Card Delivery</td>
                  <td className="py-4 px-6 text-rose-300">Physical collection on speech day</td>
                  <td className="py-4 px-6 text-emerald-300 font-bold">Instant mobile portal &amp; SMS delivery</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="py-4 px-6 font-semibold text-white">Grade Forgery &amp; Alteration</td>
                  <td className="py-4 px-6 text-rose-300">High risk of student pen alterations</td>
                  <td className="py-4 px-6 text-emerald-300 font-bold">Cryptographically tamper-proof</td>
                </tr>
              </tbody>
            </table>
          </MotionRise>
        </div>
      </section>

      {/* --- SECTION 4: FREQUENTLY ASKED QUESTIONS --- */}
      <section className="py-20 bg-slate-900 border-t border-white/5">
        <div className="container-nets max-w-4xl mx-auto px-4">
          <MotionRise className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Questions &amp; Answers</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </MotionRise>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base cursor-pointer hover:bg-white/5"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? (
                    <IconChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <IconChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Floating CTA Banner */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-center space-y-4 border border-blue-500/30 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Transform Your School&apos;s Results This Term?
            </h3>
            <p className="text-sm text-slate-200 max-w-xl mx-auto">
              Join over 250 forward-thinking Nigerian school leaders on Thursday, Nov 26. Seats are strictly limited on Zoom.
            </p>
            <div className="pt-2">
              <a
                href="#register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg transition-transform hover:scale-105"
              >
                <span>Reserve Your Free Seat Now</span>
                <IconArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
