'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Book02Icon, 
  Task01Icon, 
  Megaphone01Icon,
  HelpCircleIcon,
  AnalyticsUpIcon
} from 'hugeicons-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { 
  TeacherCreateNoteView, 
  TeacherCreateQuizView, 
  TeacherAnalyticsView 
} from '@classroompro/modules';

function TeacherClassroomStream() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/teacher/classroom');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher classroom data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Classroom...</div>;
  if (!data) return <div style={{ color: '#64748b', padding: '2rem' }}>Failed to load classroom data.</div>;

  const { assigned_classes, recent_notes, announcements } = data;

  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Classroom Overview
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Real-time management of your assigned classes, lesson progress, and student engagement.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
         {/* Assigned Classes */}
         <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem' }}>Your Assigned Classes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
               {assigned_classes.map((cls: any) => (
                 <div key={cls.id} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.5rem', padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                       <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{cls.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{cls.subject}</span>
                       </div>
                       <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#146ef5', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontWeight: '800' }}>
                         {cls.students_count} Students
                       </span>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem' }}>
                          <span>Curriculum Covered</span>
                          <span>{cls.curriculum_coverage}%</span>
                       </div>
                       <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${cls.curriculum_coverage}%`, height: '100%', background: '#146ef5', borderRadius: '3px' }} />
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                       <button style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', padding: '0.6rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                         Attendance
                       </button>
                       <button style={{ flex: 1, background: '#146ef5', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                         Start Class
                       </button>
                    </div>
                 </div>
               ))}
            </div>

            {/* Published Notes / Resources */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem' }}>Recent Published Lesson Notes</h3>
            <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '1.5rem', overflow: 'hidden' }}>
               {recent_notes.map((note: any, idx: number) => (
                 <div key={note.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: idx !== recent_notes.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: '#eff6ff', color: '#146ef5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Book02Icon size={20} />
                       </div>
                       <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{note.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{note.class} • {note.date}</span>
                       </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>{note.views} reads</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Sidebar Quick Announcements */}
         <div>
            <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '1.5rem', padding: '1.75rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Megaphone01Icon size={20} color="#146ef5" />
                  Broadcast to Classes
               </h3>
               <textarea 
                 placeholder="Type an announcement to broadcast to all your students..."
                 style={{ width: '100%', height: '110px', borderRadius: '1rem', border: '1px solid #cbd5e1', padding: '1rem', fontSize: '0.85rem', resize: 'none', marginBottom: '1rem' }}
               />
               <button style={{ width: '100%', background: '#146ef5', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '1rem', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Post Announcement
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

export default function TeacherClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'stream',
      label: 'Classroom Stream',
      icon: Book02Icon,
      component: TeacherClassroomStream,
    },
    {
      id: 'create-note',
      label: 'Handout Editor',
      icon: Task01Icon,
      component: TeacherCreateNoteView,
    },
    {
      id: 'create-quiz',
      label: 'Quiz Generator',
      icon: HelpCircleIcon,
      component: TeacherCreateQuizView,
    },
    {
      id: 'analytics',
      label: 'Topic Analytics',
      icon: AnalyticsUpIcon,
      component: TeacherAnalyticsView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Teacher Classroom Console"
      appSubtitle="Curriculum lesson authoring, AI-assisted quiz generation, topic mastery, and student broadcasts."
      appBadge="ClassroomPRO"
      accentColor="#146ef5"
      tabs={tabs}
      defaultTabId="stream"
    />
  );
}
