'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  VideoCameraIcon, 
  Clock01Icon, 
  Plus01Icon, 
  NoteIcon,
  Share01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function TeacherTutorSchedule() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/teacher/tutors');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher tutor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Schedule...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load tutor data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>TutorsPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Tutoring Schedule
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Manage your one-on-one sessions, track attendance, and provide follow-up tasks for your learners.
          </p>
        </div>
        <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.25)' }}>
          <Plus01Icon size={20} />
          Set Availability
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
         {/* Sessions List */}
         <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Upcoming Sessions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.sessions?.map((session: any) => (
                 <motion.div
                   key={session.id}
                   whileHover={{ x: 10 }}
                   style={{ padding: '1.5rem', borderRadius: '2.5rem', background: 'white', border: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem', alignItems: 'center' }}
                 >
                    <div style={{ width: '80px', height: '80px', borderRadius: '1.5rem', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                       <Image src={session.img} alt={session.student} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                             <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{session.topic}</h3>
                             <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>with {session.student}</span>
                          </div>
                          <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#10b981', background: '#f0fdf4', padding: '0.25rem 0.6rem', borderRadius: '0.5rem' }}>{session.status.toUpperCase()}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>
                             <Clock01Icon size={14} color="#10b981" />
                             {session.time} ({session.duration})
                          </div>
                       </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <button style={{ background: '#1e293b', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <VideoCameraIcon size={14} /> Join
                       </button>
                       <button style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Reschedule</button>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Tasks & Feedback */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Quick Session Actions</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <NoteIcon size={18} color="#10b981" /> Add Session Notes
                  </button>
                  <button style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <Share01Icon size={18} color="#146ef5" /> Share Resources
                  </button>
               </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Tutor Earnings</h3>
               <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>${data.earnings?.monthly?.toFixed(2)}</div>
               <p style={{ opacity: 0.8, fontSize: '0.8rem', lineHeight: 1.5 }}>Calculated from {data.earnings?.sessions} sessions completed this month.</p>
               <button style={{ width: '100%', marginTop: '2rem', padding: '0.8rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>Payout History</button>
            </div>
         </div>
      </div>
    </div>
  );
}
