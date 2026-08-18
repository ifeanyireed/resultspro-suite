'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, Award01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function ParentReportsPage() {
  const [activeChild, setActiveChild] = useState(0);
  const [childrenReports, setChildrenReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/parent/reports');
        setChildrenReports(response.data);
      } catch (error) {
        console.error('Failed to fetch parent reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Reports...</div>;
  if (!childrenReports.length) return <div style={{ padding: '2rem' }}>No reports found.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Academic Reports
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Detailed performance metrics, teacher comments, and academic goals for your children.
        </p>
      </header>

      {/* Child Selector */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        {childrenReports.map((child, i) => (
          <button
            key={i}
            onClick={() => setActiveChild(i)}
            style={{
              padding: '1rem 2rem',
              borderRadius: '1.5rem',
              border: activeChild === i ? '2px solid #6366f1' : '1px solid #e2e8f0',
              background: activeChild === i ? '#eef2ff' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid white' }}>
              <Image src={child.photo} alt={child.name} width={40} height={40} style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: activeChild === i ? '#6366f1' : '#1e293b' }}>{child.name}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>{child.grade}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        {/* Detailed Breakdown */}
        <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Subject Performance</h2>
            <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', cursor: 'pointer' }}>
              Download PDF
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {childrenReports[activeChild].subjects.map((sub: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{sub.name}</span>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', fontWeight: '500' }}>{sub.comment}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#6366f1' }}>{sub.grade}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>{sub.score}%</div>
                  </div>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.score}%` }}
                    transition={{ duration: 1 }}
                    style={{ height: '100%', background: '#6366f1', borderRadius: '3px' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats & Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award01Icon size={20} color="#f59e0b" />
              Academic Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Avg Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{childrenReports[activeChild].overallScore}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Attendance</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{childrenReports[activeChild].attendance}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Class Rank</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{childrenReports[activeChild].rank}</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <StarIcon size={20} color="#f59e0b" />
              Teacher Observations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '4px', height: 'auto', background: '#6366f1', borderRadius: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, fontWeight: '500' }}>
                  &quot;Highly participative in class discussions. Shows great leadership in group projects.&quot;
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>— Mr. Henderson, Form Tutor</span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '4px', height: 'auto', background: '#10b981', borderRadius: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, fontWeight: '500' }}>
                  &quot;Consistently submits homework on time. Exceptional results in recent unit tests.&quot;
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>— Mrs. Smith, Academic Head</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
