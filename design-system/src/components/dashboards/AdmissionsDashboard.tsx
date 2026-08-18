'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar03Icon,
  FilterIcon,
  StarIcon,
  ArrowUp01Icon,
  Activity04Icon,
  Mail01Icon,
  Task01Icon
} from 'hugeicons-react';
import api from '@/lib/api';
import WelcomeBanner from './WelcomeBanner';
import styles from './Dashboard.module.css';

export default function AdmissionsDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/admissions/inquiries'),
      api.get('/admin/admissions/pipeline')
    ])
      .then(([inquiriesRes, pipelineRes]) => {
        setInquiries(inquiriesRes.data || []);
        setPipelineData(pipelineRes.data);
      })
      .catch(err => console.error('Failed to load admissions data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !pipelineData) {
    return <div className={styles.container}><div style={{ color: 'white', padding: '2rem' }}>Loading Admissions Insights...</div></div>;
  }

  const { stats, funnel } = pipelineData;

  // SVG Area Chart constants
  const width = 600;
  const height = 180;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const getX = (index: number) => padding + (index * (chartWidth / (funnel.length - 1)));
  const getY = (val: number) => padding + chartHeight - (val / 500 * chartHeight); // Scaling for 500 max

  const linePath = funnel.reduce((acc: string, point: any, i: number) => {
    return `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.count)}`;
  }, '');

  const areaPath = `${linePath} L ${getX(funnel.length - 1)} ${padding + chartHeight} L ${getX(0)} ${padding + chartHeight} Z`;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <WelcomeBanner 
          title="Admissions Overview" 
          description={`You have ${inquiries.length} active inquiries. Let's grow our school community!`} 
          monsterSrc="/monster_balloons.png" 
        />

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat: any, i: number) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statTitle}>{stat.label}</div>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ background: stat.bg, color: stat.color }}>
                   {stat.icon === 'analytics' && <Activity04Icon />}
                   {stat.icon === 'users' && <UserGroupIcon />}
                   {stat.icon === 'activity' && <Clock01Icon />}
                   {stat.icon === 'star' && <StarIcon />}
                </div>
                <div className={styles.statInfo}><h3>{stat.value}</h3></div>
              </div>
              <div className={styles.statInfo}><p>{stat.label === 'Active Leads' ? 'Total leads in funnel' : 'Performance metric'}</p></div>
            </div>
          ))}
        </div>

        {/* Bottom Widgets */}
        <div className={styles.bottomGrid}>
          <div className={styles.widget} style={{ overflow: 'visible' }}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#f59e0b15' }}>
                  <FilterIcon size={18} color="#f59e0b" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>Admissions Pipeline</h2>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', marginTop: '1.5rem', background: '#fcfaf8', borderRadius: '1.5rem', padding: '1rem', border: '1px solid #fef3c7' }}>
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                style={{ width: '100%', height: 'auto', overflow: 'visible' }}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#pipelineGradient)" />
                <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="3" />
                {funnel.map((item: any, i: number) => (
                  <circle key={i} cx={getX(i)} cy={getY(item.count)} r="4" fill="white" stroke="#f59e0b" strokeWidth="2" />
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                {funnel.map((item: any, i: number) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b' }}>{item.stage}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}>{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#10b98115' }}>
                  <StarIcon size={18} color="#10b981" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>Recent Inquiries</h2>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Live leads from the platform</span>
                </div>
              </div>
              <a href="/admin/admissions/inquiries" style={{ fontSize: '0.75rem', color: '#146ef5', fontWeight: '700', textDecoration: 'none' }}>View All</a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              {loading ? (
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading inquiries...</p>
              ) : inquiries.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No inquiries found.</p>
              ) : inquiries.slice(0, 5).map((item, i) => (
                <motion.div 
                  key={item.id} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 5, background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  style={{ 
                    padding: '1rem', 
                    background: '#fcfaf8', 
                    borderRadius: '1.25rem', 
                    border: '1px solid #fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{item.parent_name}</h4>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Learner: <span style={{ color: '#1e293b', fontWeight: '700' }}>{item.learner_name}</span></span>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Grade: <span style={{ color: '#1e293b', fontWeight: '700' }}>{item.class_of_entry}</span></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
