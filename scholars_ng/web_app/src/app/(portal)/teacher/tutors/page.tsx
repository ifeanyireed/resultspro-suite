'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Video01Icon as VideoCamera01Icon, 
  Clock01Icon, 
  NoteIcon,
  Share01Icon,
  Calendar01Icon,
  AnalyticsUpIcon
} from 'hugeicons-react';
import api from '@/lib/api';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { TutorCalendarView, TutorDashboardView } from '@tutorspro/modules';

function TeacherTutorScheduleView() {
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

  if (loading) return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Schedule...</div>;
  if (!data) return <div style={{ color: '#64748b', padding: '2rem' }}>Failed to load tutor data.</div>;

  const { upcoming_sessions, requests, stats } = data;

  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Tutoring Itinerary
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Manage your one-on-one sessions, track attendance, and provide follow-up tasks for your learners.
          </p>
        </div>
      </header>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
         <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{stats.active_students}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Active Students</div>
         </div>
         <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{stats.hours_taught} hrs</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Teaching Hours</div>
         </div>
         <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{stats.rating} ★</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Average Rating</div>
         </div>
         <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981' }}>{stats.earnings}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Total Earned</div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
         {/* Upcoming Sessions List */}
         <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.5rem', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem' }}>Upcoming Lessons</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {upcoming_sessions.map((sess: any) => (
                 <div key={sess.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '44px', height: '44px', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                          <Image src={sess.student_avatar} alt={sess.student_name} fill style={{ objectFit: 'cover' }} />
                       </div>
                       <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{sess.student_name}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{sess.topic} • {sess.subject}</span>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}>{sess.time}</div>
                       <button style={{ marginTop: '0.4rem', background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <VideoCamera01Icon size={14} /> Launch
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* New Requests */}
         <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '1.5rem', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem' }}>Pending Booking Requests</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {requests.map((req: any) => (
                 <div key={req.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' }}>{req.parent_name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>Request for {req.student_name} ({req.subject})</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <button style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>Accept</button>
                       <button style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>Decline</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

export default function TeacherTutorsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'schedule',
      label: 'Sessions & Requests',
      icon: Clock01Icon,
      component: TeacherTutorScheduleView,
    },
    {
      id: 'calendar',
      label: 'Availability Calendar',
      icon: Calendar01Icon,
      component: TutorCalendarView,
    },
    {
      id: 'dashboard',
      label: 'Tutor Metrics',
      icon: AnalyticsUpIcon,
      component: TutorDashboardView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Teacher Tutoring Portal"
      appSubtitle="Personalized tutoring bookings, calendar availability, session delivery, and payouts."
      appBadge="TutorsPRO"
      accentColor="#10b981"
      tabs={tabs}
      defaultTabId="schedule"
    />
  );
}
