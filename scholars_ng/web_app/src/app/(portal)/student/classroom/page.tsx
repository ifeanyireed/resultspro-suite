'use client';

import React, { useEffect, useState } from 'react';
import { 
  Clock01Icon, 
  Task01Icon, 
  Megaphone01Icon, 
  Message01Icon,
  Activity04Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentClassroomDashboard() {
  const [classroomData, setClassroomData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/classroom')
      .then(res => setClassroomData(res.data))
      .catch(err => console.error('Failed to load classroom data:', err));
  }, []);

  if (!classroomData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Classroom...</div>;
  }

  const { today_lessons, upcoming_homework, insights, announcements } = classroomData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#146ef5', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ClassroomPRO</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Classroom Snapshot
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Real-time daily learning activity, attendance streaks, and classroom announcements.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Today's Lessons */}
          <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock01Icon size={24} color="#146ef5" />
              Today&apos;s Lessons
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {today_lessons.map((lesson: any) => (
                <div key={lesson.id} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{lesson.subject}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0', fontWeight: '600' }}>Topic: {lesson.topic}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700' }}>
                       <Clock01Icon size={14} /> {lesson.time}
                    </div>
                  </div>
                  <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    Open Lesson
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Homework deadlines */}
          <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Task01Icon size={24} color="#f59e0b" />
              Upcoming Deadlines
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {upcoming_homework.map((hw: any) => (
                 <div key={hw.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                       <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{hw.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{hw.subject} • Due {hw.deadline}</span>
                       </div>
                       <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}>Submit</button>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                       <div style={{ width: `${hw.progress}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Attendance Streak */}
          <div style={{ background: 'linear-gradient(135deg, #146ef5 0%, #0ea5e9 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
               <Activity04Icon size={24} />
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Attendance Streak</h3>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{insights.attendance_streak}</div>
            <p style={{ opacity: 0.9, fontSize: '0.85rem', lineHeight: 1.5 }}>{insights.streak_message}</p>
          </div>

          {/* Announcements */}
          <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Megaphone01Icon size={20} color="#6366f1" />
                Announcements
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {announcements.map((ann: any) => (
                  <div key={ann.id} style={{ padding: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: '700', marginBottom: '0.4rem' }}>{ann.teacher}</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{ann.content}</p>
                  </div>
                ))}
                <button style={{ width: '100%', padding: '0.75rem', borderRadius: '1rem', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                   <Message01Icon size={16} />
                   Message Teacher
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
