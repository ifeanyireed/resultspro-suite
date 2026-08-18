'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowUp01Icon, 
  ArrowDown01Icon, 
  Activity04Icon,
  Book02Icon,
  PrinterIcon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentResultsAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/results/analytics')
      .then(res => setAnalyticsData(res.data))
      .catch(err => console.error('Failed to load analytics data:', err));
  }, []);

  if (!analyticsData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Analytics...</div>;
  }

  const { trends, pulse, strategies } = analyticsData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#8b5cf6', background: '#f5f3ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ResultsPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Academic Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Deep performance patterns, subject trends, and attendance correlation.
          </p>
        </div>
        <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <PrinterIcon size={18} />
           Print Summary
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Trend Analysis */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Subject Trends</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {trends.map((item: any, i: number) => (
                 <div key={i} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, border: '1px solid #e2e8f0' }}>
                          <Book02Icon size={20} />
                       </div>
                       <div>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Previous: {item.previous}%</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{item.current}%</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '800', color: item.status === 'improving' ? '#10b981' : '#ef4444' }}>
                          {item.status === 'improving' ? <ArrowUp01Icon size={12} /> : <ArrowDown01Icon size={12} />}
                          {item.status.toUpperCase()}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Correlation & Recommendations */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#f5f3ff', borderRadius: '2rem', padding: '2rem', border: '1px solid #ddd6fe' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#5b21b6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity04Icon size={20} />
                  Performance Pulse
               </h3>
               <p style={{ fontSize: '0.85rem', color: '#6d28d9', lineHeight: 1.6, fontWeight: '500' }}>
                  {pulse.insight.replace(/\*\*/g, '')}
               </p>
            </div>

            <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Learning Strategy</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {strategies.map((strategy: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#146ef5', marginTop: '0.4rem', flexShrink: 0 }} />
                       <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{strategy.replace(/\*\*/g, '')}</p>
                    </div>
                  ))}
               </div>
               <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                  View Full breakdown
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
