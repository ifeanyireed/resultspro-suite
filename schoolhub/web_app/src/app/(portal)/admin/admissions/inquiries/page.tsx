'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search01Icon, FilterIcon, Mail01Icon, PhoneIcon, MoreHorizontalIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdmissionsInquiriesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/admissions/inquiries');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admissions inquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Inquiries...</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Inquiry Database
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Manage prospective family inquiries, track lead sources, and qualify potential enrollments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search inquiries..." style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '250px', outline: 'none' }} />
              <Search01Icon size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
           </div>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
             <FilterIcon size={20} />
             Filter
           </button>
        </div>
      </header>

      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Parent Name</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Student</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Grade</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Source</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.25rem 2rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((inq: any, i: number) => (
              <motion.tr 
                key={inq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderTop: '1px solid #f1f5f9' }}
              >
                <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: '#1e293b' }}>{inq.parent}</td>
                <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontWeight: '600' }}>{inq.student}</td>
                <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontWeight: '600' }}>{inq.grade}</td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '0.5rem' }}>{inq.source}</span>
                </td>
                <td style={{ padding: '1.25rem 2rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>{inq.date}</td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: '800', color: inq.color, background: `${inq.color}10`, padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: `1px solid ${inq.color}20` }}>
                     {inq.status.toUpperCase()}
                   </span>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><Mail01Icon size={18} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><PhoneIcon size={18} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><MoreHorizontalIcon size={18} /></button>
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
