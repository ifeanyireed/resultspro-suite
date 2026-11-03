'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award01Icon, 
  Download01Icon, 
  Share01Icon, 
  AnalyticsUpIcon, 
  CheckmarkCircle02Icon,
  DocumentValidationIcon,
  File01Icon
} from 'hugeicons-react';
import api from '@/lib/api';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { CompactGradebook, ResultCheckerView } from '@resultspro/modules';
import { useAppHost } from '@/components/AppHostContext';

function StudentResultsSummary() {
  const [resultsData, setResultsData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/results')
      .then(res => setResultsData(res.data))
      .catch(err => console.error('Failed to load results data:', err));
  }, []);

  if (!resultsData) {
    return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Results...</div>;
  }

  const { term, stats, subjects, history } = resultsData;

  const getIcon = (label: string) => {
    if (label.includes('Avg')) return <AnalyticsUpIcon size={28} />;
    if (label.includes('Rank')) return <Award01Icon size={28} />;
    return <CheckmarkCircle02Icon size={28} />;
  };

  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Academic Performance
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Your official academic standing for {term}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
             <Download01Icon size={18} />
             Download PDF
           </button>
           <button style={{ background: '#8b5cf6', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontWeight: '700', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
             <Share01Icon size={18} />
             Share Card
           </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat: any, idx: number) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -4 }}
            style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {getIcon(stat.label)}
            </div>
            <div>
               <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
               <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subject Grades Table */}
      <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
           <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Subject Breakdown</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
           <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                 <th style={{ padding: '1rem 1.5rem' }}>Subject</th>
                 <th style={{ padding: '1rem 1.5rem' }}>Continuous Assessment</th>
                 <th style={{ padding: '1rem 1.5rem' }}>Examination</th>
                 <th style={{ padding: '1rem 1.5rem' }}>Total</th>
                 <th style={{ padding: '1rem 1.5rem' }}>Grade</th>
                 <th style={{ padding: '1rem 1.5rem' }}>Remarks</th>
              </tr>
           </thead>
           <tbody>
              {subjects.map((sub: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>
                   <td style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>{sub.name}</td>
                   <td style={{ padding: '1.2rem 1.5rem', color: '#64748b' }}>{sub.ca} / 40</td>
                   <td style={{ padding: '1.2rem 1.5rem', color: '#64748b' }}>{sub.exam} / 60</td>
                   <td style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>{sub.total}</td>
                   <td style={{ padding: '1.2rem 1.5rem' }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '0.5rem', 
                        background: sub.grade === 'A' ? '#ecfdf5' : sub.grade === 'B' ? '#eff6ff' : '#fffbeb',
                        color: sub.grade === 'A' ? '#10b981' : sub.grade === 'B' ? '#3b82f6' : '#f59e0b',
                        fontWeight: '800',
                        fontSize: '0.8rem'
                      }}>
                         {sub.grade}
                      </span>
                   </td>
                   <td style={{ padding: '1.2rem 1.5rem', color: '#64748b' }}>{sub.remarks}</td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentReportCardView() {
  const { tenant, user } = useAppHost();

  const mockSchool = {
    id: tenant?.id || 'greenwood',
    name: tenant?.name || 'Academic Institution',
    address: 'Academic Way, Lagos State',
    logo: tenant?.logo_url || '/icon.png',
  };

  const mockResult = {
    student: {
      name: user?.name || 'Student Candidate',
      admissionNumber: (user as any)?.admissionNumber || 'SCH/2026/0142',
      class: 'Senior Secondary 2 (SS2)',
      term: 'First Term 2025/2026',
    },
    subjects: [
      { name: 'Mathematics', score: 88, grade: 'A', remarks: 'Distinction' },
      { name: 'English Language', score: 79, grade: 'A', remarks: 'Excellent' },
      { name: 'Physics', score: 84, grade: 'A', remarks: 'Distinction' },
      { name: 'Chemistry', score: 72, grade: 'B', remarks: 'Very Good' },
      { name: 'Biology', score: 81, grade: 'A', remarks: 'Distinction' },
      { name: 'Civic Education', score: 90, grade: 'A', remarks: 'Outstanding' },
    ],
    attendance: { present: 62, total: 65 },
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
          Print Broadsheet
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

export default function StudentResultsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'summary',
      label: 'Performance Summary',
      icon: AnalyticsUpIcon,
      component: StudentResultsSummary,
    },
    {
      id: 'report-card',
      label: 'Official Report Card',
      icon: File01Icon,
      component: StudentReportCardView,
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
      appTitle="Results & Academic Standing"
      appSubtitle="Terminal broadsheets, scratch-card validation, and historical performance analysis."
      appBadge="ResultsPRO"
      accentColor="#8b5cf6"
      tabs={tabs}
      defaultTabId="summary"
    />
  );
}
