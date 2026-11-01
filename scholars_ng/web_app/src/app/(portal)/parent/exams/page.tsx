'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  AnalyticsUpIcon, 
  Target01Icon, 
  Activity04Icon, 
  Clock01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function ParentExamInsights() {
  const [examsData, setExamsData] = useState<any>(null);
  const [activeChild, setActiveChild] = useState(0);

  useEffect(() => {
    api.get('/parent/exams')
      .then(res => setExamsData(res.data))
      .catch(err => console.error('Failed to load parent exams data:', err));
  }, []);

  if (!examsData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Exam Insights...</div>;
  }

  const { insights, performance, next_exam, recent_activity } = examsData;
  const childName = insights[activeChild].name;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ExamPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Exam Readiness
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Track how your children are preparing for exams through their practice scores and completion rates.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           {insights.map((child: any, i: number) => (
             <button
               key={i}
               onClick={() => setActiveChild(i)}
               style={{
                 padding: '0.6rem 1.25rem',
                 borderRadius: '2rem',
                 border: activeChild === i ? '2px solid #6366f1' : '1px solid #e2e8f0',
                 background: activeChild === i ? '#eef2ff' : 'white',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 cursor: 'pointer',
                 transition: 'all 0.2s ease'
               }}
             >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                   <Image src={child.photo} alt={child.name} width={24} height={24} style={{ objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: activeChild === i ? '#6366f1' : '#64748b' }}>{child.name.split(' ')[0]}</span>
             </button>
           ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
         {[
           { label: 'Avg Practice Score', value: insights[activeChild].avgScore, icon: <Target01Icon />, color: '#6366f1', bg: '#eef2ff' },
           { label: 'Quiz Completion', value: insights[activeChild].completion, icon: <AnalyticsUpIcon />, color: '#10b981', bg: '#f0fdf4' },
           { label: 'Readiness Level', value: insights[activeChild].readiness, icon: <Activity04Icon />, color: '#f59e0b', bg: '#fffbeb' },
         ].map((stat, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
           >
             <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.cloneElement(stat.icon as React.ReactElement, { size: 28 })}
             </div>
             <div>
               <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
               <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
             </div>
           </motion.div>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Weak Areas */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Practice Performance</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {performance[childName]?.map((item: any, i: number) => (
                 <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                       <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>{item.subject}</span>
                       <span style={{ fontWeight: '800', color: '#1e293b' }}>{item.score}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.score}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         style={{ height: '100%', background: item.color, borderRadius: '4px' }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
            <button style={{ marginTop: '2.5rem', width: '100%', padding: '1rem', borderRadius: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', cursor: 'pointer' }}>
               View Full Subject Breakdown
            </button>
         </div>

         {/* Readiness Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Next Exam Date</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Clock01Icon size={24} color="#f59e0b" />
                  </div>
                  <div>
                     <p style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0 }}>{next_exam[childName]?.title}</p>
                     <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{next_exam[childName]?.date}</span>
                  </div>
               </div>
               <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.6 }}>Recommended: {next_exam[childName]?.recommendation}</p>
               <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', borderRadius: '1rem', background: '#6366f1', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Encourage Revision
               </button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Recent Practice Activity</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recent_activity[childName]?.map((act: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{act.title}</p>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{act.time}</span>
                       </div>
                       <span style={{ fontWeight: '800', color: '#10b981', fontSize: '0.9rem' }}>{act.score}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
