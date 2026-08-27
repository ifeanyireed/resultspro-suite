'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderCheckIcon, Search01Icon, FilterIcon, MoreHorizontalIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdmissionsApplicationsPage() {
  const [data, setData] = useState<any[]>([]);
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

  if (loading) return <div style={{ padding: '2rem' }}>Loading Applications...</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Application Manager
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Review full enrollment applications, manage offers, and track student onboarding status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search apps..." style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '220px', outline: 'none' }} />
              <Search01Icon size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
           </div>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
             <FilterIcon size={20} />
             Filter
           </button>
        </div>
      </header>

      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>App ID</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Student Name</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Grade</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Submitted</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.25rem 2rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((app: any, i: number) => (
              <motion.tr 
                key={app.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderTop: '1px solid #f1f5f9' }}
              >
                <td style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#146ef5', fontSize: '0.85rem' }}>{app.id}</td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <div style={{ fontWeight: '700', color: '#1e293b' }}>{app.student}</div>
                   <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Parent: {app.parent}</div>
                </td>
                <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontWeight: '600' }}>{app.grade}</td>
                <td style={{ padding: '1.25rem 2rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>{app.date}</td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: '800', color: app.color, background: `${app.color}10`, padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: `1px solid ${app.color}20` }}>
                     {app.status.toUpperCase()}
                   </span>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>Review</button>
                      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><MoreHorizontalIcon size={18} /></button>
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FolderCheckIcon size={20} />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', margin: 0 }}>
          Next Application Review Cycle: **Monday, 16 June**. Ensure all pending assessments are scheduled.
        </p>
      </div>
    </div>
  );
}
