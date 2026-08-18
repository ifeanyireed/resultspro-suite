'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Activity04Icon, Download01Icon, Message01Icon, StarIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function ParentResultsAnalytics() {
  const [activeChild, setActiveChild] = useState(0);
  const [childrenPerformance, setChildrenPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/parent/results');
        setChildrenPerformance(response.data);
      } catch (error) {
        console.error('Failed to fetch parent results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Results...</div>;
  if (!childrenPerformance.length) return <div style={{ padding: '2rem' }}>No results found.</div>;

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
            Deep dive into your children&apos;s academic performance patterns and term-to-term trends.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           {childrenPerformance.map((child, i) => (
             <button
               key={i}
               onClick={() => setActiveChild(i)}
               style={{
                 padding: '0.6rem 1.25rem',
                 borderRadius: '2rem',
                 border: activeChild === i ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                 background: activeChild === i ? '#f5f3ff' : 'white',
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
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: activeChild === i ? '#8b5cf6' : '#64748b' }}>{child.name.split(' ')[0]}</span>
             </button>
           ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Performance Breakdown */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Subject Trends</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {childrenPerformance[activeChild].subjects.map((item: any, i: number) => (
                 <div key={i} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                       <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{item.name}</div>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', color: item.status === 'Strength' ? '#10b981' : item.status === 'Weakness' ? '#ef4444' : '#6366f1', textTransform: 'uppercase' }}>{item.status}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{item.score}%</div>
                       <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Term 3 Official</div>
                    </div>
                 </div>
               ))}
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
               <button style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Download01Icon size={18} /> Download Result
               </button>
               <button style={{ flex: 1, background: '#8b5cf6', color: 'white', border: 'none', padding: '1rem', borderRadius: '1.25rem', fontWeight: '700', cursor: 'pointer' }}>
                  Compare Terms
               </button>
            </div>
         </div>

         {/* Insights Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#f5f3ff', borderRadius: '2rem', padding: '2rem', border: '1px solid #ddd6fe' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#5b21b6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StarIcon size={20} />
                  Teacher Spotlight
               </h3>
               <p style={{ fontSize: '0.85rem', color: '#6d28d9', lineHeight: 1.6, fontWeight: '500' }}>
                  &quot;{childrenPerformance[activeChild].spotlight}&quot;
               </p>
               <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#5b21b6', marginTop: '1rem' }}>— Principal Office</span>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Correlation Insight</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#eff6ff', color: '#146ef5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Activity04Icon size={24} />
                  </div>
                  <div>
                     <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Attendance vs Grades</p>
                     <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>High Positive Correlation</span>
                  </div>
               </div>
               <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>Consistent attendance (98%+) is a key driver for the current Distinction standing.</p>
            </div>

            <button style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
               <Message01Icon size={18} /> Message School Office
            </button>
         </div>
      </div>
    </div>
  );
}
