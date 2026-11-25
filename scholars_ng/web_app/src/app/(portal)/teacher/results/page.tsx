'use client';

import React from 'react';
import {
  CameraIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  DocumentTextIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import {
  MarksheetScannerView,
  ResultAuditView,
  TeacherCommentStudio,
  CompactGradebook,
  WebinarWorkflowDemo,
} from '@resultspro/modules';
import { useAppHost } from '@/components/AppHostContext';
import { MotionRise } from '@/components/ScrollRiseProvider';

function TeacherBroadsheetPreview() {
  const { tenant } = useAppHost();

  const mockSchool = {
    id: tenant?.id || 'laurel-ikeja',
    name: tenant?.name || 'Laurel Academy — Ikeja Campus',
    address: 'Ikeja GRA, Lagos State, Nigeria',
    logo: tenant?.logo_url || '/icon.png',
  };

  const mockResult = {
    student: {
      name: 'Chidinma Adeleke',
      admissionNumber: 'LAU/IKJ/2026/014',
      class: 'JSS 2 Gold',
      term: 'Second Term 2025/2026',
    },
    subjects: [
      { name: 'Mathematics', score: 92, grade: 'A', remarks: 'Outstanding' },
      { name: 'English Language', score: 88, grade: 'A', remarks: 'Distinction' },
      { name: 'Basic Science', score: 85, grade: 'A', remarks: 'Distinction' },
      { name: 'Basic Technology', score: 81, grade: 'A', remarks: 'Excellent' },
      { name: 'Civic Education', score: 90, grade: 'A', remarks: 'Outstanding' },
    ],
    attendance: { present: 64, total: 65 },
    totalObtainable: 500,
  };

  const mockTemplate = {
    id: 'standard-nigerian',
    name: 'Standard Nigerian Terminal Broadsheet',
    gradingSystem: {
      A: { min: 75, max: 100 },
      B: { min: 65, max: 74 },
      C: { min: 50, max: 64 },
      D: { min: 45, max: 49 },
      E: { min: 40, max: 44 },
      F: { min: 0, max: 39 },
    },
  };

  return (
    <MotionRise className="max-w-4xl mx-auto my-4 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">Class Subject Broadsheet &amp; Report Card Preview</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Deterministic score consolidation combining approved ClassroomPRO CA scores and ResultsPRO OCR exam scores from CampusPRO.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-[#0D1060] text-[#FBBC04] text-xs font-extrabold hover:bg-[#151980] transition-colors cursor-pointer"
        >
          Print Class Broadsheet
        </button>
      </div>

      <CompactGradebook
        school={mockSchool as any}
        result={mockResult as any}
        template={mockTemplate as any}
      />
    </MotionRise>
  );
}

export default function TeacherResultsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'marksheet-ocr',
      label: '1. AI Marksheet OCR & Voice Entry',
      icon: CameraIcon,
      component: MarksheetScannerView,
    },
    {
      id: 'audit',
      label: '2. Pre-Submission AI Result Auditor',
      icon: ShieldExclamationIcon,
      component: ResultAuditView,
    },
    {
      id: 'comments',
      label: '3. AI Report Card Comments',
      icon: SparklesIcon,
      component: TeacherCommentStudio,
    },
    {
      id: 'broadsheet',
      label: '4. Class Broadsheet Preview',
      icon: DocumentTextIcon,
      component: TeacherBroadsheetPreview,
    },
    {
      id: 'webinar-demo',
      label: '★ 9-Step End-to-End Flow',
      icon: PlayCircleIcon,
      component: WebinarWorkflowDemo,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Teacher Assessment & Result Processing Console"
      appSubtitle="Digitize handwritten marksheets via AI OCR or voice dictation against your CampusPRO class roster, run pre-submission anomaly audits, and generate evidence-based report card remarks."
      appBadge="ResultsPRO"
      accentColor="#0D1060"
      tabs={tabs}
      defaultTabId="marksheet-ocr"
    />
  );
}
