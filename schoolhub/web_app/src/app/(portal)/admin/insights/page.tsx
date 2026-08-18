'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AnalyticsUpIcon, 
  Activity04Icon, 
  Download01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminSchoolInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/insights');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin insights data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Insights Hub...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load insights data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            School Insights Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Consolidated oversight across ClassroomPRO, ExamPRO, TutorsPRO, and Scholars.ng ecosystem.
          </p>
        </div>
        <button style={{ background: '#1e293b', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <Download01Icon size={18} />
           Export Ecosystem Report
        </button>
      </header>

      {/* Product Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.products?.map((item: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '2rem', border: '1px solid #f1f5f9' }}
          >
             <div style={{ fontSize: '0.75rem', fontWeight: '800', color: item.color, background: item.bg, padding: '0.25rem 0.6rem', borderRadius: '2rem', display: 'inline-block', marginBottom: '1.25rem' }}>{item.product}</div>
             <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{item.metric}</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{item.status}</span>
             </div>
             <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.6rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9', color: '#1e293b', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>Drill Down</button>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Adoption Trends */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Cross-Platform Adoption</h2>
            <div style={{ height: '250px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '0 2rem' }}>
               {data.products?.map((item: any, i: number) => (
                 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${item.val}%` }}
                      style={{ width: '100%', background: item.color, borderRadius: '0.5rem 0.5rem 0 0', opacity: 0.8 }} 
                    />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>{item.label}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Flagged Areas */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Management Focus</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.focus_areas?.map((area: any, i: number) => (
                 <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: area.color, marginBottom: '0.5rem' }}>
                       {area.icon === 'activity' && <Activity04Icon size={16} />}
                       {area.icon === 'analytics' && <AnalyticsUpIcon size={16} />}
                       <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{area.title}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{area.desc}</p>
                 </div>
               ))}
            </div>
            <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
               Monitor Flagged Students
            </button>
         </div>
      </div>
    </div>
  );
}
