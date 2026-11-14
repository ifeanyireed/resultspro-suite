'use client';

import React from 'react';
import { ChartBarIcon, DocumentTextIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import ResultsPRODashboard from '@/components/Dashboard/ResultsPRODashboard';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { CompactGradebook, ResultCheckerView } from '@resultspro/modules';
import { useAppHost } from '@/components/AppHostContext';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

function AdminBroadsheetPreview() {
  const { tenant } = useAppHost();

  const mockSchool = {
    id: tenant?.id || 'admin-school',
    name: tenant?.name || 'Academic Institution',
    address: 'Central Campus, Nigeria',
    logo: tenant?.logo_url || '/icon.png',
  };

  const mockResult = {
    student: {
      name: 'Sample Broadsheet Exemplar',
      admissionNumber: 'SCH/ADM/2026/001',
      class: 'Senior Secondary 3 (SS3)',
      term: 'Annual Terminal Summary',
    },
    subjects: [
      { name: 'Mathematics', score: 95, grade: 'A', remarks: 'Outstanding' },
      { name: 'English Language', score: 91, grade: 'A', remarks: 'Outstanding' },
      { name: 'Further Mathematics', score: 89, grade: 'A', remarks: 'Distinction' },
      { name: 'Physics', score: 94, grade: 'A', remarks: 'Outstanding' },
      { name: 'Chemistry', score: 88, grade: 'A', remarks: 'Distinction' },
      { name: 'Technical Drawing', score: 92, grade: 'A', remarks: 'Outstanding' },
    ],
    attendance: { present: 65, total: 65 },
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
    <MotionRise style={{ maxWidth: '900px', margin: '1rem auto 4rem auto', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 25px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Official Broadsheet Template Preview</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Standardized report card configuration active for this school tenant.</p>
        </div>
        <button 
          onClick={() => window.print()}
          style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          Print Sample
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

export default function AdminResultsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'analytics',
      label: 'Performance Analytics',
      icon: ChartBarIcon,
      component: ResultsPRODashboard,
    },
    {
      id: 'broadsheet',
      label: 'Broadsheet Template',
      icon: DocumentTextIcon,
      component: AdminBroadsheetPreview,
    },
    {
      id: 'validator',
      label: 'Scratch Card Validator',
      icon: CheckBadgeIcon,
      component: ResultCheckerView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Results & Examination Broadsheets"
      appSubtitle="School-wide GPA tracking, Nigerian curriculum broadsheet management, and scratch-card verification."
      appBadge="ResultsPRO"
      accentColor="#8b5cf6"
      tabs={tabs}
      defaultTabId="analytics"
    />
  );
}
