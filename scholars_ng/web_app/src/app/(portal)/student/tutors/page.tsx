'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Clock01Icon, 
  Book02Icon,
  Video01Icon as VideoCamera01Icon,
  Message01Icon,
  Search01Icon,
  Calendar01Icon
} from 'hugeicons-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { FindTutorView, StudentBookingsView, VirtualClassroomView } from '@tutorspro/modules';

function StudentTutorDashboard() {
  const [tutorData, setTutorData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/tutors')
      .then(res => setTutorData(res.data))
      .catch(err => console.error('Failed to load tutor data:', err));
  }, []);

  if (!tutorData) {
    return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Tutors...</div>;
  }

  const { sessions, assignments, messages } = tutorData;

  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Tutoring Sessions & Mentorship
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Manage your personal tutoring sessions, connect with experts, and review session notes.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Scheduled Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock01Icon size={22} color="#10b981" />
              Upcoming Scheduled Sessions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {sessions.map((sess: any) => (
                <div key={sess.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                      <Image src={sess.tutor_avatar} alt={sess.tutor_name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{sess.topic}</h4>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginTop: '0.2rem' }}>
                        with <span style={{ color: '#10b981' }}>{sess.tutor_name}</span> • {sess.subject}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}>{sess.date}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>{sess.time}</div>
                    <button style={{ marginTop: '0.5rem', background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <VideoCamera01Icon size={14} /> Join Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments from Tutors */}
          <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Book02Icon size={22} color="#f59e0b" />
              Assigned Homework & Exercises
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {assignments.map((asgn: any) => (
                <div key={asgn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{asgn.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Tutor: {asgn.tutor} • Due {asgn.due}</span>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '0.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '800',
                    background: asgn.status === 'Completed' ? '#ecfdf5' : '#fffbeb',
                    color: asgn.status === 'Completed' ? '#10b981' : '#f59e0b'
                  }}>
                    {asgn.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messaging Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Message01Icon size={20} color="#10b981" />
              Tutor Messages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg: any) => (
                <div key={msg.id} style={{ padding: '1rem', background: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>{msg.from}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{msg.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{msg.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentTutorsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'itinerary',
      label: 'My Sessions & Tasks',
      icon: Clock01Icon,
      component: StudentTutorDashboard,
    },
    {
      id: 'discover',
      label: 'Discover Vetted Tutors',
      icon: Search01Icon,
      component: FindTutorView,
    },
    {
      id: 'bookings',
      label: 'Session Bookings',
      icon: Calendar01Icon,
      component: StudentBookingsView,
    },
    {
      id: 'classroom',
      label: 'Live Lesson Room',
      icon: VideoCamera01Icon,
      component: VirtualClassroomView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Tutoring & 1-on-1 Mentorship"
      appSubtitle="Vetted Nigerian teachers, online scheduling, whiteboard lessons, and homework assistance."
      appBadge="TutorsPRO"
      accentColor="#10b981"
      tabs={tabs}
      defaultTabId="itinerary"
    />
  );
}
