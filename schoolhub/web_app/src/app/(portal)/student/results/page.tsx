'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award01Icon, 
  Download01Icon, 
  Share01Icon, 
  AnalyticsUpIcon, 
  CheckmarkCircle02Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentResultsOverview() {
  const [resultsData, setResultsData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/results')
      .then(res => setResultsData(res.data))
      .catch(err => console.error('Failed to load results data:', err));
  }, []);

  if (!resultsData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Results...</div>;
  }

  const { term, stats, subjects, history } = resultsData;

  const getIcon = (label: string) => {
    if (label.includes('Avg')) return <AnalyticsUpIcon size={28} />;
    if (label.includes('Rank')) return <Award01Icon size={28} />;
    return <CheckmarkCircle02Icon size={28} />;
  };

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#8b5cf6', background: '#f5f3ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ResultsPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Term Results
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Your official academic standing for {term}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Download01Icon size={18} />
              Download PDF
           </button>
           <button style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.25)' }}>
              <Share01Icon size={18} />
              Share
           </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }}>
         {/* Subject List */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                  <tr style={{ background: '#f8fafc' }}>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Subject</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Score</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Grade</th>
                     <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Remark</th>
                  </tr>
               </thead>
               <tbody>
                  {subjects.map((res: any, i: number) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                       <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: '#1e293b' }}>{res.subject}</td>
                       <td style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#1e293b' }}>{res.score}%</td>
                       <td style={{ padding: '1.25rem 2rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#8b5cf6' }}>{res.grade}</span>
                       </td>
                       <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>{res.comment}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Historical Trend */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Performance History</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {history.map((h: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>{h.term}</span>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '800' }}>{h.score}</span>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                       </div>
                    </div>
                  ))}
               </div>
               <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Compare All Terms
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
