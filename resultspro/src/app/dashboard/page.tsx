"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  ChartBarIcon,
  AcademicCapIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { MotionRise } from "@/components/ScrollRiseProvider";
import { MarksheetScannerView } from "@/components/ai/MarksheetScannerView";
import { ResultAuditView } from "@/components/ai/ResultAuditView";
import { TeacherCommentStudio } from "@/components/ai/TeacherCommentStudio";
import { PerformanceIntelligenceView } from "@/components/ai/PerformanceIntelligenceView";
import { ParentResultInterpreter } from "@/components/ai/ParentResultInterpreter";
import { WebinarWorkflowDemo } from "@/components/ai/WebinarWorkflowDemo";

type TabKey = "webinar" | "intelligence" | "ocr" | "audit" | "comments" | "parent";

export default function ResultsProAIConsole() {
  const [activeTab, setActiveTab] = useState<TabKey>("webinar");

  const tabs: { id: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "webinar", label: "★ 9-Step Webinar Live Demo", icon: PlayCircleIcon },
    { id: "intelligence", label: "Multi-Campus Intelligence & AI Officer", icon: ChartBarIcon },
    { id: "ocr", label: "1. AI Marksheet OCR & CampusPRO Sync", icon: CameraIcon },
    { id: "audit", label: "2. AI Result Auditor", icon: ShieldExclamationIcon },
    { id: "comments", label: "3. AI Teacher & Principal Comments", icon: SparklesIcon },
    { id: "parent", label: "4. Parent AI Result & ClassroomPRO Loop", icon: AcademicCapIcon },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Architecture Switcher */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-[10px] font-black uppercase tracking-wider mb-2">
              CampusPRO (Academic Record) → ClassroomPRO (Learning Hub) → ResultsPRO (Intelligence Engine)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              ResultsPRO — AI School Assessment &amp; Performance Intelligence Engine
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              From manual score entry to intelligent multi-campus academic reporting for Laurel Academy (Ikeja, Lekki &amp; Abuja).
            </p>
          </div>
        </div>

        {/* Horizontal Subtabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  isSelected
                    ? "bg-[#0D1060] text-[#FBBC04] shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </MotionRise>

      {/* Active Screen Content */}
      {activeTab === "webinar" && <WebinarWorkflowDemo />}
      {activeTab === "intelligence" && <PerformanceIntelligenceView />}
      {activeTab === "ocr" && <MarksheetScannerView />}
      {activeTab === "audit" && <ResultAuditView />}
      {activeTab === "comments" && <TeacherCommentStudio />}
      {activeTab === "parent" && <ParentResultInterpreter />}
    </div>
  );
}
