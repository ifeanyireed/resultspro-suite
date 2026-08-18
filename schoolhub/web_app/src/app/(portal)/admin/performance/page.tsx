'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnalyticsUpIcon, StarIcon, Award01Icon, Activity04Icon, ArrowUp01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminPerformancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/performance');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin performance data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Performance Metrics...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load performance data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Institutional Performance
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          High-level academic excellence metrics, departmental rankings, and institutional KPIs.
        </p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.kpis?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'star' && <StarIcon />}
              {stat.icon === 'award' && <Award01Icon />}
              {stat.icon === 'analytics' && <AnalyticsUpIcon />}
              {stat.icon === 'activity' && <Activity04Icon />}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Department Performance */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Departmental Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {data.departments?.map((dept: any, i: number) => (
                 <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                       <span style={{ fontWeight: '700', color: '#1e293b' }}>{dept.name}</span>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: dept.trend.startsWith('+') ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                             <ArrowUp01Icon size={12} style={{ transform: dept.trend.startsWith('+') ? 'none' : 'rotate(180deg)' }} />
                             {dept.trend}
                          </span>
                          <span style={{ fontWeight: '800', color: '#1e293b' }}>{dept.score}%</span>
                       </div>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${dept.score}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         style={{ height: '100%', background: dept.color, borderRadius: '4px' }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Teacher Performance */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Faculty Highlights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.faculty?.map((teacher: any, i: number) => (
                 <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                       <Image src={teacher.photo} alt={teacher.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>{teacher.name}</div>
                       <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>{teacher.dept} Department</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10b981' }}>{teacher.score}</div>
                       <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: '700' }}>Rating</div>
                    </div>
                 </div>
               ))}
            </div>
            <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
               Full Faculty Audit
            </button>
         </div>
      </div>
    </div>
  );
}
