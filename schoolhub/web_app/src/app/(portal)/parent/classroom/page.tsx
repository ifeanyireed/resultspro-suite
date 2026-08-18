'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Task01Icon, 
  Activity04Icon, 
  AlertCircleIcon, 
  ArrowRight01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function ParentChildDashboard() {
  const [classroomData, setClassroomData] = useState<any>(null);

  useEffect(() => {
    api.get('/parent/classroom')
      .then(res => setClassroomData(res.data))
      .catch(err => console.error('Failed to load parent classroom data:', err));
  }, []);

  if (!classroomData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Classroom...</div>;
  }

  const { children_activity, alert } = classroomData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#146ef5', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ClassroomPRO</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Classroom Engagement
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Real-time tracking of your children&apos;s daily school engagement, attendance, and activity.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {children_activity.map((child: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${child.color}20` }}>
                     <Image src={child.photo} alt={child.name} width={64} height={64} style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                     <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{child.name}</h2>
                     <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{child.grade}</span>
                  </div>
               </div>
               <div style={{ background: '#f0fdf4', padding: '0.4rem 0.8rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #dcfce7' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981' }}>{child.status}</span>
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
               <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                     <Activity04Icon size={14} /> Attendance
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{child.attendance}</div>
               </div>
               <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                     <Task01Icon size={14} /> Homework
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{child.homework}</div>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <button style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  Open Activity Feed
                  <ArrowRight01Icon size={18} />
               </button>
               <button style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', cursor: 'pointer' }}>
                  Contact Form Teacher
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '2rem', border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
         <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertCircleIcon size={24} />
         </div>
         <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#92400e', margin: 0 }}>{alert.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#b45309', margin: '0.25rem 0', fontWeight: '500' }}>{alert.message}</p>
         </div>
         <button style={{ marginLeft: 'auto', background: 'white', border: '1px solid #fcd34d', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontWeight: '800', color: '#92400e', cursor: 'pointer' }}>View Details</button>
      </div>
    </div>
  );
}
