'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AnalyticsUpIcon, 
  UserGroupIcon, 
  ArrowUp01Icon, 
  ArrowDown01Icon,
  FilterIcon,
  Activity04Icon,
  ArrowRight01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function TeacherPracticeInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/teacher/exams');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher practice insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Insights...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load insights data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ExamPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Practice Insights
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Monitor how your students are performing in practice exams and identify class-wide knowledge gaps.
          </p>
        </div>
        <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <FilterIcon size={18} />
           Filter by Class
        </button>
      </header>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'analytics' && <AnalyticsUpIcon size={28} />}
              {stat.icon === 'users' && <UserGroupIcon size={28} />}
              {stat.icon === 'activity' && <Activity04Icon size={28} />}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Class Rankings */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Class Performance</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.class_performance?.map((cls: any, i: number) => (
                 <div key={i} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                       <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{cls.name}</div>
                       <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Participation: {cls.participation}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{cls.avgScore}</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '800', color: cls.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                          {cls.trend.startsWith('+') ? <ArrowUp01Icon size={12} /> : <ArrowDown01Icon size={12} />}
                          {cls.trend}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
               Review Full Class Report
            </button>
         </div>

         {/* Class Weak Topics */}
         <div style={{ background: '#fef2f2', borderRadius: '2rem', border: '1px solid #fee2e2', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#991b1b', marginBottom: '1.5rem' }}>Common Knowledge Gaps</h2>
            <p style={{ fontSize: '0.9rem', color: '#b91c1c', marginBottom: '2rem', lineHeight: 1.6 }}>These topics have the lowest accuracy across your Year 10 classes.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.knowledge_gaps?.map((item: any, i: number) => (
                 <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #fee2e2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                       <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>{item.topic}</span>
                       <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ef4444' }}>{item.accuracy}</span>
                    </div>
                    <button style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem', borderRadius: '0.75rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                       Assign Revision <ArrowRight01Icon size={14} />
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
