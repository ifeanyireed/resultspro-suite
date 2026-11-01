'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckmarkCircle02Icon, 
  Target01Icon,
  Activity04Icon,
  ArrowRight01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentPracticeProgress() {
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/exams/progress')
      .then(res => setProgressData(res.data))
      .catch(err => console.error('Failed to load progress data:', err));
  }, []);

  if (!progressData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Practice Progress...</div>;
  }

  const { stats, mastery, recommendations } = progressData;

  const getIcon = (label: string) => {
    if (label.includes('Accuracy')) return <Target01Icon size={28} />;
    if (label.includes('Completion')) return <CheckmarkCircle02Icon size={28} />;
    return <Activity04Icon size={28} />;
  };

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ExamPRO</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Practice Analytics
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Visualize your improvement across mock tests and identify gaps in your knowledge.
        </p>
      </header>

      {/* Accuracy & Completion */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getIcon(stat.label)}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        {/* Subject Progress */}
        <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Subject Mastery</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {mastery.map((item: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: '#1e293b' }}>{item.subject}</span>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                     <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', display: 'block' }}>ACCURACY</span>
                        <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>{item.accuracy}</span>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', display: 'block' }}>COMPLETION</span>
                        <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>{item.progress}%</span>
                     </div>
                  </div>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: '100%', background: item.color, borderRadius: '4px' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div style={{ background: '#1e293b', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Teacher Recommendations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {recommendations.map((rec: any, i: number) => (
                   <div key={i} style={{ borderLeft: `3px solid ${rec.color}`, paddingLeft: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>&quot;{rec.text.replace(/\*\*/g, '')}&quot;</p>
                      <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>— {rec.teacher}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <button style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Continue Practice Plan <ArrowRight01Icon size={16} />
                 </button>
                 <button style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Compare Last 5 Attempts <ArrowRight01Icon size={16} />
                 </button>
                 <button style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Review Weak Topics <ArrowRight01Icon size={16} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
