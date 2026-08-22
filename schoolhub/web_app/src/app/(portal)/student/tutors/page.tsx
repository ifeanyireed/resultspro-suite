'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Plus01Icon, 
  Clock01Icon, 
  Book02Icon,
  VideoCamera01Icon,
  Message01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentTutorHub() {
  const [tutorData, setTutorData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/tutors')
      .then(res => setTutorData(res.data))
      .catch(err => console.error('Failed to load tutor data:', err));
  }, []);

  if (!tutorData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Tutors...</div>;
  }

  const { sessions, assignments, messages } = tutorData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>TutorsPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Tutor Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Manage your personal tutoring sessions, connect with experts, and review session notes.
          </p>
        </div>
        <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.25)' }}>
          <Plus01Icon size={20} />
          Book New Session
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        {/* Scheduled Sessions */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Upcoming Sessions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {sessions.map((session: any) => (
              <motion.div
                key={session.id}
                whileHover={{ y: -5 }}
                style={{ padding: '1.5rem', borderRadius: '2rem', background: 'white', border: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem', alignItems: 'center' }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '1.25rem', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                   <Image src={session.img} alt={session.tutor} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                         <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{session.subject}</h3>
                         <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>with {session.tutor}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#10b981', background: '#f0fdf4', padding: '0.25rem 0.6rem', borderRadius: '0.5rem' }}>{session.status.toUpperCase()}</span>
                   </div>
                   <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>
                         <Clock01Icon size={14} color="#10b981" />
                         {session.time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>
                         <Book02Icon size={14} color="#10b981" />
                         {session.topic}
                      </div>
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <button style={{ background: '#1e293b', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <VideoCamera01Icon size={14} /> Join
                   </button>
                   <button style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Reschedule</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar: Homework & Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Tutor Assignments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {assignments.map((as: any) => (
                   <div key={as.id} style={{ background: 'white', padding: '1rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{as.title}</p>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>From {as.tutor} • Due {as.due}</span>
                   </div>
                 ))}
                 <button style={{ width: '100%', padding: '0.75rem', borderRadius: '1rem', background: 'none', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    View All Homework
                 </button>
              </div>
           </div>

           <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Messages</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {messages.map((m: any, i: number) => (
                   <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.7rem' }}>{m.initial}</div>
                      <div style={{ flex: 1 }}>
                         <p style={{ fontSize: '0.8rem', fontWeight: '700', margin: 0 }}>{m.tutor}</p>
                         <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>{m.content}</p>
                      </div>
                   </div>
                 ))}
                 <button style={{ marginTop: '1rem', width: '100%', padding: '0.8rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Message01Icon size={16} /> Chat with Tutors
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
