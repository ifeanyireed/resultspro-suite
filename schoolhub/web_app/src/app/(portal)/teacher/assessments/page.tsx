'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quiz01Icon, Plus01Icon, AnalyticsUpIcon, StarIcon, Activity04Icon, ArrowRight01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function TeacherAssessmentsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/teacher/assessments');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher assessment data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Assessments...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load assessment data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Assessments Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Create and manage ExamsPRO assessments, quizzes, and track academic excellence.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}>
            Question Bank
          </button>
          <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
            <Plus01Icon size={20} />
            New Assessment
          </button>
        </div>
      </header>

      {/* Stats Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'star' && <StarIcon size={28} />}
              {stat.icon === 'activity' && <Activity04Icon size={28} />}
              {stat.icon === 'quiz' && <Quiz01Icon size={28} />}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Recent Assessments</h2>
            <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>View All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.recent_assessments?.map((item: any, i: number) => (
              <div key={i} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: item.color, fontSize: '0.8rem' }}>
                    {item.type === 'Exam' ? 'EX' : 'QZ'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.2rem' }}>{item.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{item.class} • {item.date}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>{item.avg}</div>
                   <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Avg Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <AnalyticsUpIcon size={24} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>ExamsPRO Analytics</h2>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.9, marginBottom: '2rem' }}>
            {data.analytics?.insight}
          </p>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Top Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.analytics?.top_performance?.map((perf: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  {perf}
                </div>
              ))}
            </div>
          </div>
          <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1rem', background: 'white', border: 'none', color: '#4338ca', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Full Report
            <ArrowRight01Icon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
