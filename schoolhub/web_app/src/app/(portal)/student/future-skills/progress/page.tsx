'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CodeIcon, 
  Activity04Icon, 
  AnalyticsUpIcon, 
  Clock01Icon, 
  StarIcon,
  ArrowRight01Icon,
  Share01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentFutureSkillsProgress() {
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/future-skills/progress')
      .then(res => setProgressData(res.data))
      .catch(err => console.error('Failed to load progress data:', err));
  }, []);

  if (!progressData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Skills Progress...</div>;
  }

  const { stats, breakdown, recommendation } = progressData;

  const getIcon = (label: string) => {
    if (label.includes('Time')) return <Clock01Icon size={28} />;
    if (label.includes('Avg')) return <StarIcon size={28} />;
    return <AnalyticsUpIcon size={28} />;
  };

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#f59e0b', background: '#fffbeb', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>Scholars.ng</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Skills Mastery
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Detailed breakdown of your development across digital skill modules.
          </p>
        </div>
        <button style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.25)' }}>
           <Share01Icon size={18} />
           Share Progress
        </button>
      </header>

      {/* Development Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getIcon(stat.label)}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Mastery Breakdown */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Skill Mastery</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {breakdown.map((item: any, i: number) => (
                 <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                       <span style={{ fontWeight: '700', color: '#1e293b' }}>{item.name}</span>
                       <span style={{ fontWeight: '800', color: '#1e293b' }}>{item.mastery}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.mastery}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         style={{ height: '100%', background: item.color, borderRadius: '4px' }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Recommendation */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Next Level Recommendation</h3>
               <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '2rem' }}>{recommendation.reason.replace(/\*\*/g, '')}</p>
               <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                     <CodeIcon size={18} color="#f59e0b" />
                     <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Recommended Module</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>{recommendation.module}</p>
               </div>
               <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1.25rem', background: '#f59e0b', color: '#1e293b', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Resume Learning
                  <ArrowRight01Icon size={18} />
               </button>
            </div>

            <button style={{ width: '100%', padding: '1.25rem', borderRadius: '1.5rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
               <Activity04Icon size={20} color="#f59e0b" />
               Practice Skill Challenge
            </button>
         </div>
      </div>
    </div>
  );
}
