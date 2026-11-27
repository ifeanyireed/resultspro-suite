"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CameraIcon,
  UserGroupIcon,
  ShieldExclamationIcon,
  CheckBadgeIcon,
  TableCellsIcon,
  ChatBubbleBottomCenterTextIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useCampusProContext } from "@/context/CampusProContext";

export interface WebinarStep {
  stepNumber: number;
  productBadge: "ClassroomPRO → CampusPRO" | "ResultsPRO OCR" | "ResultsPRO × CampusPRO" | "ResultsPRO Auditor" | "Teacher Approval" | "ResultsPRO Engine" | "ResultsPRO Narrative AI" | "Admin Copilot & Intelligence" | "Parent & ClassroomPRO Loop";
  title: string;
  subtitle: string;
  actor: string;
  campusScope: string;
  systemOfRecordNote: string;
  metricValue: number;
  metricSuffix: string;
  metricLabel: string;
  highlights: { label: string; value: string; status: "success" | "warning" | "info" }[];
  narrativeQuote: string;
}

const WEBINAR_STEPS: WebinarStep[] = [
  {
    stepNumber: 1,
    productBadge: "ClassroomPRO → CampusPRO",
    title: "Continuous Assessment Completed & Synced to CampusPRO",
    subtitle: "Ikeja Mathematics teacher finalizes CA 1 & CA 2 in ClassroomPRO. Detailed quiz attempts stay in ClassroomPRO; approved scores transfer into CampusPRO's official examination score records.",
    actor: "Mr. Tunde Bakare (Ikeja Maths Teacher)",
    campusScope: "Laurel Academy · Ikeja Campus (JSS 2 Gold)",
    systemOfRecordNote: "ClassroomPRO retains 142 quiz attempts & topic telemetry. CampusPRO receives 38 approved CA scores (Ref: CLP-ASSESS-2026-CA1).",
    metricValue: 38,
    metricSuffix: " / 38",
    metricLabel: "Approved CA Scores Synced to CampusPRO",
    highlights: [
      { label: "Daniel Adebayo (LAU/IKJ/2026/001)", value: "CA1: 18/20 · CA2: 17/20 (Synced)", status: "success" },
      { label: "Chidera Anozie (LAU/IKJ/2026/004)", value: "CA1: 16/20 · CA2: 19/20 (Synced)", status: "success" },
      { label: "ClassroomPRO Retained Telemetry", value: "Topic Struggle Detected: Fractions & Percentages (38% acc.)", status: "info" },
    ],
    narrativeQuote: "ClassroomPRO keeps the full multi-year assessment history, while CampusPRO holds the official approved examination records.",
  },
  {
    stepNumber: 2,
    productBadge: "ResultsPRO OCR",
    title: "Teacher Uploads Photographed Handwritten Exam Marksheet",
    subtitle: "Instead of spending 4 hours typing 60-mark terminal exam scores manually, the teacher snaps 2 pages of the handwritten exam marksheet.",
    actor: "Mr. Tunde Bakare (Ikeja Maths Teacher)",
    campusScope: "Laurel Academy · Ikeja Campus (JSS 2 Gold)",
    systemOfRecordNote: "Multi-sheet upload (Page 1: Roll 1–20, Page 2: Roll 21–38) queued for AI Vision OCR extraction.",
    metricValue: 2,
    metricSuffix: " Pages",
    metricLabel: "Handwritten Marksheets Consolidated",
    highlights: [
      { label: "Page 1: ikeja_jss2_maths_p1.jpg", value: "20 Handwritten Rows Detected · High Contrast", status: "success" },
      { label: "Page 2: ikeja_jss2_maths_p2.jpg", value: "19 Handwritten Rows Detected · Multi-Sheet Linked", status: "success" },
      { label: "Voice-Assisted Fallback", value: "Ready for hands-free score dictation", status: "info" },
    ],
    narrativeQuote: "Where the innovation really pops is scanning multi-sheet handwritten marksheets in seconds.",
  },
  {
    stepNumber: 3,
    productBadge: "ResultsPRO × CampusPRO",
    title: "AI Extracts Scores & Reconciles Against CampusPRO Roster",
    subtitle: "AI reads the handwritten names and exam scores, matching them against CampusPRO's canonical Ikeja JSS 2 Gold student records—even when names are abbreviated or reordered.",
    actor: "ResultsPRO Vision OCR + CampusPRO Roster API",
    campusScope: "Laurel Academy · Ikeja Campus (JSS 2 Gold)",
    systemOfRecordNote: "Fuzzy phonetic & Levenshtein matching against CampusPRO's campus-scoped student directory.",
    metricValue: 98,
    metricSuffix: ".4%",
    metricLabel: "Handwriting Recognition & Roster Match Confidence",
    highlights: [
      { label: "Exact Match: 'Adebayo Oluwaseun'", value: "→ Adebayo Oluwaseun Daniel (LAU/IKJ/2026/001) · Exam: 54/60", status: "success" },
      { label: "Fuzzy Match: 'Chidera A.'", value: "→ Anozie Chidera Grace (LAU/IKJ/2026/004) · Exam: 51/60 (94% Match)", status: "warning" },
      { label: "Fuzzy Match: 'Okafor Tobi'", value: "→ Okafor Oluwatobi Emmanuel (LAU/IKJ/2026/015) · Exam: 56/60", status: "warning" },
    ],
    narrativeQuote: "AI intelligently matches abbreviated or misspelled names against CampusPRO without ever silently guessing.",
  },
  {
    stepNumber: 4,
    productBadge: "ResultsPRO Auditor",
    title: "AI Result Auditor Flags Missing Scores, Duplicates & Conflicts",
    subtitle: "Before generating final results, AI acts as an intelligent auditor—flagging missing CA scores, duplicate entries across sheets, score overflows, and attendance conflicts.",
    actor: "ResultsPRO Pre-Publication AI Auditor",
    campusScope: "Laurel Academy · Ikeja Campus",
    systemOfRecordNote: "Cross-checked against CampusPRO Exam Config (Max 100) and CampusPRO Biometric Attendance Logs.",
    metricValue: 21,
    metricSuffix: " Flags",
    metricLabel: "12 Missing · 3 Duplicates · 4 Variations · 2 Calc/Attendance",
    highlights: [
      { label: "Duplicate Entry Across Page 1 & 2", value: "Bello Musa Ibrahim (LAU/IKJ/2026/009) appears twice — Merge recommended", status: "warning" },
      { label: "Attendance Conflict Detected", value: "Adeyemi Toluwani marked Absent in CampusPRO Clinic Log on Nov 18 but has Exam score 52/60", status: "warning" },
      { label: "Historical Variation (>25% Drop)", value: "Danjuma Fatima dropped from 84% last term to 48% this term — Flagged for review", status: "info" },
    ],
    narrativeQuote: "AI never silently resolves uncertain matches or anomalies—it surfaces a crystal-clear audit report for human review.",
  },
  {
    stepNumber: 5,
    productBadge: "Teacher Approval",
    title: "Teacher Reviews, Resolves Flags & Approves Official Entries",
    subtitle: "The teacher confirms fuzzy name matches, merges the duplicate row, verifies the make-up exam sitting, and clicks Approve. Approved scores lock into CampusPRO.",
    actor: "Mr. Tunde Bakare (Ikeja Maths Teacher)",
    campusScope: "Laurel Academy · Ikeja Campus (JSS 2 Gold)",
    systemOfRecordNote: "All 38 student score records stamped with teacher approval ID, timestamp, and OCR batch reference in CampusPRO.",
    metricValue: 100,
    metricSuffix: "%",
    metricLabel: "Human-Approved & Locked in CampusPRO Official Ledger",
    highlights: [
      { label: "Fuzzy Matches Confirmed", value: "Chidera Anozie & Oluwatobi Okafor identities verified by teacher ✓", status: "success" },
      { label: "Duplicate Consolidated", value: "Bello Musa Ibrahim Page 1 & Page 2 merged (CA1: 14, CA2: 15, Exam: 45) ✓", status: "success" },
      { label: "Official Ledger Sync", value: "Committed to CampusPRO (Batch Ref: OCR-IKJ-2026-089) ✓", status: "success" },
    ],
    narrativeQuote: "Every AI-extracted score is reviewable, auditable, and explicitly approved by the teacher.",
  },
  {
    stepNumber: 6,
    productBadge: "ResultsPRO Engine",
    title: "ResultsPRO Pulls Official Scores & Generates Master Broadsheet",
    subtitle: "ResultsPRO retrieves the approved official scores from CampusPRO and runs 100% deterministic software arithmetic for totals, averages, GPA, grades, and class rankings.",
    actor: "ResultsPRO Deterministic Go Calculation Engine",
    campusScope: "Laurel Academy · Ikeja Campus (JSS 2 Gold)",
    systemOfRecordNote: "Zero AI hallucination in arithmetic: Totals, NERDC Grade Boundaries (A: 75–100), and Positions computed deterministically.",
    metricValue: 78,
    metricSuffix: ".4%",
    metricLabel: "Computed JSS 2 Gold Class Average (38 Students Ranked)",
    highlights: [
      { label: "1st Position: Eze Zinachidi", value: "CA1: 20 + CA2: 19 + Exam: 58 = 97% (Grade A · Distinction)", status: "success" },
      { label: "2nd Position: Okafor Oluwatobi", value: "CA1: 19 + CA2: 18 + Exam: 56 = 93% (Grade A · Distinction)", status: "success" },
      { label: "3rd Position: Adebayo Daniel", value: "CA1: 18 + CA2: 17 + Exam: 54 = 89% (Grade A · Distinction)", status: "success" },
    ],
    narrativeQuote: "Use AI for interpreting documents and detecting patterns, but keep score arithmetic, grading, and ranking 100% deterministic.",
  },
  {
    stepNumber: 7,
    productBadge: "ResultsPRO Narrative AI",
    title: "AI Generates Personalized Teacher & Principal Report Comments",
    subtitle: "Combining CampusPRO official scores and attendance with ClassroomPRO's topic-level learning history, AI drafts tailored remarks in Encouraging, Corrective, Developmental, or Celebratory tones.",
    actor: "Class Teacher & Campus Principal",
    campusScope: "Laurel Academy · Ikeja Campus (JSS 2 Gold)",
    systemOfRecordNote: "38 personalized Class Teacher and Principal report-card comments generated and approved in 45 seconds.",
    metricValue: 38,
    metricSuffix: " Cards",
    metricLabel: "Personalized Report-Card Narratives Approved",
    highlights: [
      { label: "Daniel Adebayo (Encouraging Tone)", value: "'Demonstrated considerable improvement in Maths (89%) and Basic Science (85%), but needs daily practice in English Comprehension & Summary Writing.'", status: "success" },
      { label: "Musa Bello (Developmental Tone)", value: "'Performed well in PHE (81%), though ClassroomPRO history shows recurring gaps in Fractions & Ratios (52% in Maths). Holiday revision pack assigned.'", status: "info" },
      { label: "Principal's Endorsement", value: "Auto-tailored by student GPA tier and attendance consistency ✓", status: "success" },
    ],
    narrativeQuote: "Teachers no longer struggle to write meaningful remarks for 40 students at the end of term.",
  },
  {
    stepNumber: 8,
    productBadge: "Admin Copilot & Intelligence",
    title: "School Admin Runs AI Results Officer & Multi-Campus Intelligence",
    subtitle: "The Group Administrator types: 'Prepare my school's end-of-term result processing for Primary 5' and compares performance across Ikeja, Lekki, and Abuja campuses.",
    actor: "Dr. Olufemi Adeleke (Laurel Academy Group Administrator)",
    campusScope: "Laurel Academy Group HQ (Ikeja · Lekki · Abuja)",
    systemOfRecordNote: "AI Results-Processing Officer verifies subject submissions, sends reminders to 2 outstanding teachers, and unlocks publication.",
    metricValue: 3,
    metricSuffix: " Campuses",
    metricLabel: "Ikeja (76.4%) · Lekki (79.1%) · Abuja (72.8%) Consolidated",
    highlights: [
      { label: "AI Results Officer Check", value: "10/12 subjects synced · 1-Click reminder sent to Basic Tech & French teachers ✓", status: "success" },
      { label: "Conversational Admin Query", value: "'Which subjects declined most in SS2?' → Further Maths (-9.4%) & Physics (-7.1%) with verifiable figures", status: "info" },
      { label: "AI Promotion & WAEC Forecast", value: "88.5% of SS2 cohort meets promotion criteria (Clearly labelled as prediction)", status: "success" },
    ],
    narrativeQuote: "An AI results-processing officer for every school—guiding administrators from submission checks to publication.",
  },
  {
    stepNumber: 9,
    productBadge: "Parent & ClassroomPRO Loop",
    title: "Parents Receive Plain-Language AI Result & Launch ClassroomPRO Revision",
    subtitle: "Parents open their child's report card to find an AI explanation of strengths and weaknesses, interactive Q&A, and a 1-click ClassroomPRO revision pack (NERDC Notes, AI Story, Flashcards & Quiz).",
    actor: "Mrs. Adebayo (Parent) & Daniel (Student)",
    campusScope: "Home Portal · Connected to ClassroomPRO",
    systemOfRecordNote: "Closes the continuous academic improvement loop: ResultsPRO report card triggers targeted ClassroomPRO learning.",
    metricValue: 20,
    metricSuffix: " Mins/Day",
    metricLabel: "Targeted Holiday Revision Plan Active in ClassroomPRO",
    highlights: [
      { label: "Plain-Language Parent Summary", value: "'Improved in 3 subjects! Focus holiday support on English Comprehension & Summary Writing.'", status: "success" },
      { label: "Parent Interactive Q&A", value: "Answered: 'Why did my child drop in English?' using ClassroomPRO quiz telemetry", status: "info" },
      { label: "1-Click ClassroomPRO Remedial Pack", value: "Launched: NERDC Note + 'The Lagos Lagoon Mystery' AI Story + 15 Flashcards ✓", status: "success" },
    ],
    narrativeQuote: "From manual score entry to intelligent academic reporting—closing the loop between school and home.",
  },
];

export const WebinarWorkflowDemo: React.FC = () => {
  const { schoolName, branches } = useCampusProContext();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const branchSummary =
    branches.length > 0
      ? branches.map((b) => b.name).join(" · ")
      : "Main Campus · Annex Campus · Abuja Campus";

  const stageCardRef = useRef<HTMLDivElement | null>(null);
  const metricNumRef = useRef<HTMLSpanElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);
  const scanBeamRef = useRef<HTMLDivElement | null>(null);

  const activeStep = WEBINAR_STEPS[currentIdx];

  // GSAP animations on step change: timeline progress bar, counter tween, card pulse, and OCR laser beam
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animate progress bar width
      if (progressLineRef.current) {
        gsap.to(progressLineRef.current, {
          width: `${((currentIdx + 1) / WEBINAR_STEPS.length) * 100}%`,
          duration: 0.65,
          ease: "power3.out",
        });
      }

      // 2. Animate metric number counter from 0 to target value
      if (metricNumRef.current) {
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: activeStep.metricValue,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            if (metricNumRef.current) {
              metricNumRef.current.textContent = Math.round(counterObj.val).toString();
            }
          },
        });
      }

      // 3. Subtle GSAP stage card entrance elevation
      if (stageCardRef.current) {
        gsap.fromTo(
          stageCardRef.current,
          { y: 14, scale: 0.99 },
          { y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
        );
      }

      // 4. OCR Laser Scan Beam animation when on Step 2 or Step 3
      if (scanBeamRef.current && (currentIdx === 1 || currentIdx === 2)) {
        gsap.fromTo(
          scanBeamRef.current,
          { top: "0%", opacity: 0.9 },
          {
            top: "96%",
            opacity: 0.2,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );
      }
    });

    return () => ctx.revert();
  }, [currentIdx, activeStep.metricValue]);

  // Optional auto-play timer for live webinar presentation
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % WEBINAR_STEPS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Top Webinar Storyline Banner */}
      <div className="bg-[#0D1060] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBBC04] text-[#0D1060] text-xs font-black uppercase tracking-wider">
              <SparklesIcon className="w-4 h-4" /> Live Webinar Interactive Showcase · 9-Stage Connected Trio Flow
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              &ldquo;How AI Can Transform End-of-Term Results Processing in Nigerian Schools&rdquo;
            </h2>
            <p className="text-sm text-white/80">
              Promise: <strong className="text-white">From manual score entry to intelligent academic reporting</strong> — demonstrating {schoolName} ({branchSummary}) across ClassroomPRO, CampusPRO, and ResultsPRO.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                autoPlay
                  ? "bg-red-500 text-white"
                  : "bg-[#FBBC04] text-[#0D1060] hover:opacity-95"
              }`}
            >
              {autoPlay ? (
                <>
                  <PauseIcon className="w-4 h-4" /> Pause Auto-Demo
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" /> Auto-Play Webinar Story
                </>
              )}
            </button>
            <button
              onClick={() => {
                setAutoPlay(false);
                setCurrentIdx(0);
              }}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all"
            >
              <ArrowPathIcon className="w-4 h-4" /> Restart
            </button>
          </div>
        </div>

        {/* GSAP Animated Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-between text-[11px] font-bold text-white/70 mb-2">
            <span>Stage {activeStep.stepNumber} of {WEBINAR_STEPS.length}</span>
            <span>{activeStep.productBadge}</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressLineRef}
              className="h-full bg-[#FBBC04] rounded-full"
              style={{ width: "11%" }}
            />
          </div>

          {/* 9-Step Pill Stepper */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 mt-4">
            {WEBINAR_STEPS.map((st, idx) => {
              const isCurrent = idx === currentIdx;
              const isPast = idx < currentIdx;
              return (
                <button
                  key={st.stepNumber}
                  onClick={() => {
                    setAutoPlay(false);
                    setCurrentIdx(idx);
                  }}
                  className={`py-2 px-2 rounded-xl text-left transition-all border ${
                    isCurrent
                      ? "bg-[#FBBC04] text-[#0D1060] border-[#FBBC04] font-black shadow-md scale-[1.03]"
                      : isPast
                      ? "bg-white/15 text-white border-white/20 font-bold"
                      : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 font-medium"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider opacity-80">
                    Step {st.stepNumber}
                  </div>
                  <div className="text-[11px] truncate">{st.title.split(" ")[0]}...</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Animated Stage Card (Framer Motion + GSAP) */}
      <div ref={stageCardRef} className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.stepNumber}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden"
          >
            {/* GSAP Laser Scan Beam overlay on OCR steps (Steps 2 & 3) */}
            {(currentIdx === 1 || currentIdx === 2) && (
              <div
                ref={scanBeamRef}
                className="pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FBBC04] to-transparent shadow-[0_0_20px_#FBBC04] z-20"
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left 7 Columns: Narrative & Highlights */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#0D1060] text-white text-xs font-black uppercase tracking-wider">
                    Step {activeStep.stepNumber} · {activeStep.productBadge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold">
                    {activeStep.campusScope}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                  {activeStep.title}
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {activeStep.subtitle}
                </p>

                {/* Staggered Framer Motion Highlights */}
                <div className="space-y-3 pt-2">
                  {activeStep.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        h.status === "success"
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                          : h.status === "warning"
                          ? "bg-amber-50/70 border-amber-200 text-amber-950"
                          : "bg-blue-50/60 border-blue-200 text-blue-950"
                      }`}
                    >
                      <span className="text-xs font-extrabold">{h.label}</span>
                      <span className="text-xs font-semibold opacity-90">{h.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Architectural Boundary Callout */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex items-start gap-3">
                  <BuildingLibraryIcon className="w-5 h-5 text-[#0D1060] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-black text-[#0D1060]">
                      System-of-Record Boundary:{" "}
                    </strong>
                    {activeStep.systemOfRecordNote}
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: GSAP Animated Telemetry & Speaker Quote */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6 bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-200/80">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    Active Actor / Engine
                  </div>
                  <div className="text-sm font-extrabold text-gray-900 mb-6">
                    {activeStep.actor}
                  </div>

                  {/* GSAP Tweened Number Counter Card */}
                  <div className="p-6 rounded-3xl bg-[#0D1060] text-white shadow-lg">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white mb-2">
                      Live Webinar Telemetry
                    </div>
                    <div className="text-4xl md:text-5xl font-black tracking-tight text-white">
                      <span ref={metricNumRef}>{activeStep.metricValue}</span>
                      <span className="text-white">{activeStep.metricSuffix}</span>
                    </div>
                    <div className="text-xs text-white/80 font-semibold mt-2">
                      {activeStep.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Webinar Presenter Takeaway Quote */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#146ef5]">
                    Webinar Presenter Key Takeaway
                  </div>
                  <p className="text-xs md:text-sm font-bold text-gray-800 italic leading-relaxed">
                    &ldquo;{activeStep.narrativeQuote}&rdquo;
                  </p>
                </div>

                {/* Step Navigation Controls */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrentIdx((prev) =>
                        prev === 0 ? WEBINAR_STEPS.length - 1 : prev - 1
                      );
                    }}
                    className="px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1.5 hover:bg-gray-100 transition-all"
                  >
                    <ArrowLeftIcon className="w-4 h-4" /> Previous Step
                  </button>

                  <button
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrentIdx((prev) => (prev + 1) % WEBINAR_STEPS.length);
                    }}
                    className="flex-1 py-3 px-5 rounded-2xl bg-[#FBBC04] text-[#0D1060] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-sm"
                  >
                    Next Stage ({((currentIdx + 1) % WEBINAR_STEPS.length) + 1}/9)
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
