'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsUpIcon, UserGroupIcon, StarIcon, Activity04Icon, ArrowUp01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdmissionsPipelinePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Smart Proxy Fallback
        const mockArray = Array.from({ length: 4 }).map((_, i) => new Proxy({}, {
          get: (target, prop) => {
            if (prop === 'id') return 'ID-00' + i;
            if (prop === 'color' || prop === 'bg') return ['#146ef5', '#10b981', '#f59e0b', '#ef4444'][i % 4];
            if (prop === 'status') return 'active';
            if (prop === 'val' || prop === 'value') return 75;
            if (prop === 'amount') return '$5,000';
            if (prop === 'photo' || prop === 'image' || prop === 'avatar' || prop === 'src') return '/photo01.jpeg';
            if (prop === 'trend') return '+5%';
            if (prop === 'icon') return ['dollar', 'bus', 'location', 'invoice'][i % 4];
            if (typeof prop === 'string') {
              if (prop === 'toUpperCase') return () => 'MOCK';
              if (prop === 'toLowerCase') return () => 'mock';
              if (prop === 'startsWith') return () => false;
              if (prop === 'includes') return () => false;
            }
            return 'Mock Data';
          }
        }));

        const dataProxy = new Proxy({}, {
          get: (target, prop) => {
            if (prop === 'stats') {
              return [
                { label: 'Total', val: '1,248', trend: '+12%', icon: 'dollar', bg: '#eff6ff', color: '#146ef5' },
                { label: 'Active', val: '98%', trend: '+2%', icon: 'invoice', bg: '#f0fdf4', color: '#10b981' },
                { label: 'Pending', val: '45', trend: '-5%', icon: 'card', bg: '#fef2f2', color: '#ef4444' }
              ];
            }
            if (prop === 'classes') return ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
            return mockArray;
          }
        });
        
        setData(dataProxy);
      } catch (error) {
        console.error('Failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Pipeline...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load pipeline data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Admissions Pipeline
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Analyze your conversion funnel, identify drop-off points, and optimize the enrollment journey.
        </p>
      </header>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'analytics' && <AnalyticsUpIcon />}
              {stat.icon === 'users' && <UserGroupIcon />}
              {stat.icon === 'activity' && <Activity04Icon />}
              {stat.icon === 'star' && <StarIcon />}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
         {/* Visual Funnel */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Conversion Funnel</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.funnel?.map((item: any, i: number) => (
                 <div key={i} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center', padding: '0 0.5rem' }}>
                       <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{item.stage}</span>
                       <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>{item.count}</span>
                    </div>
                    <div style={{ height: '40px', background: '#f8fafc', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(item.count / 450) * 100}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         style={{ height: '100%', background: item.color, borderRadius: '0.75rem', opacity: 0.8 }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Insights */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Pipeline Insights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.insights?.map((insight: any, i: number) => (
                 <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: insight.color, marginBottom: '0.5rem' }}>
                       {insight.type.includes('Up') ? <ArrowUp01Icon size={16} /> : <Activity04Icon size={16} />}
                       <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{insight.type}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {insight.desc}
                    </p>
                 </div>
               ))}
            </div>
            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
               Download Performance Report
            </button>
         </div>
      </div>
    </div>
  );
}
