'use client';

import React from 'react';
import { 
  ChartPieIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { AnalyticsUpIcon, File01Icon, DocumentValidationIcon } from 'hugeicons-react';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { CompactGradebook, ResultCheckerView } from '@resultspro/modules';
import { useAppHost } from '@/components/AppHostContext';

function ParentResultsStream() {
  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
          Term Assessments & Analytics
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
          Review your ward&apos;s latest grades, class ranking, and term trajectory.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Continuous Assessments</h3>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', score: '92%', grade: 'A', date: 'Oct 12' },
              { subject: 'Physics', score: '88%', grade: 'B+', date: 'Oct 10' },
              { subject: 'English Lit.', score: '95%', grade: 'A+', date: 'Oct 05' },
              { subject: 'Chemistry', score: '82%', grade: 'B', date: 'Sep 28' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#8b5cf6] transition-colors cursor-pointer group">
                <div>
                  <h4 className="font-bold text-gray-900">{r.subject}</h4>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-lg text-gray-900">{r.score}</span>
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-[#8b5cf6] flex items-center justify-center font-bold text-sm">
                    {r.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#4c1d95] rounded-[1.5rem] p-6 shadow-sm border border-gray-100 text-white relative overflow-hidden flex flex-col justify-between">
          <div>
             <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Cumulative Standing</span>
             <h3 className="text-3xl font-extrabold mt-4 mb-2">Top 5% in Class Cohort</h3>
             <p className="text-sm opacity-90">Outstanding performance across STEM subjects with consistent attendance records.</p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center text-xs">
             <span>Class: Senior Secondary 2</span>
             <span>Term: 1st Term 2025/2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParentOfficialReportCard() {
  const { tenant } = useAppHost();

  const mockSchool = {
    id: tenant?.id || 'school',
    name: tenant?.name || 'Academic Institution',
    address: 'Academic Way, Lagos State',
    logo: tenant?.logo_url || '/icon.png',
  };

  const mockResult = {
    student: {
      name: 'Alex Johnson',
      admissionNumber: 'SCH/2026/0491',
      class: 'Senior Secondary 2 (SS2)',
      term: 'First Term 2025/2026',
    },
    subjects: [
      { name: 'Mathematics', score: 92, grade: 'A', remarks: 'Outstanding' },
      { name: 'English Language', score: 95, grade: 'A', remarks: 'Exceptional' },
      { name: 'Physics', score: 88, grade: 'A', remarks: 'Distinction' },
      { name: 'Chemistry', score: 82, grade: 'A', remarks: 'Distinction' },
      { name: 'Biology', score: 86, grade: 'A', remarks: 'Distinction' },
      { name: 'Civic Education', score: 91, grade: 'A', remarks: 'Outstanding' },
    ],
    attendance: { present: 64, total: 65 },
    totalObtainable: 600,
  };

  const mockTemplate = {
    id: 'standard-nigerian',
    name: 'Standard Nigerian Terminal Template',
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
    <div style={{ maxWidth: '900px', margin: '1rem auto 4rem auto', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 25px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Official Terminal Report Card</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Certified Nigerian curriculum broadsheet report.</p>
        </div>
        <button 
          onClick={() => window.print()}
          style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          Print Report Card
        </button>
      </div>

      <CompactGradebook
        school={mockSchool as any}
        result={mockResult as any}
        template={mockTemplate as any}
      />
    </div>
  );
}

export default function ParentResultsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'assessments',
      label: 'Assessments & Standing',
      icon: AnalyticsUpIcon,
      component: ParentResultsStream,
    },
    {
      id: 'report-card',
      label: 'Official Report Card',
      icon: File01Icon,
      component: ParentOfficialReportCard,
    },
    {
      id: 'checker',
      label: 'Scratch Card Checker',
      icon: DocumentValidationIcon,
      component: ResultCheckerView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Parent Academic Records"
      appSubtitle="Continuous assessments, official terminal broadsheets, and scratch card grade verification."
      appBadge="ResultsPRO"
      accentColor="#8b5cf6"
      tabs={tabs}
      defaultTabId="assessments"
    />
  );
}
