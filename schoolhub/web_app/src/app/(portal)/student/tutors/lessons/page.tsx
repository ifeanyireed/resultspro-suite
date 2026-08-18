'use client';

import React, { useEffect, useState } from 'react';
import { 
  VideoCameraIcon, 
  PlayCircle02Icon, 
  Download01Icon, 
  Tick02Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentOnlineLessons() {
  const [lessonsData, setLessonsData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/tutors/lessons')
      .then(res => setLessonsData(res.data))
      .catch(err => console.error('Failed to load lessons data:', err));
  }, []);

  if (!lessonsData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Online Lessons...</div>;
  }

  const { active_lessons, past_lessons, tasks } = lessonsData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>TutorsPRO</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Online Lessons
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Join live tutoring sessions and access replays of your past online lessons.
        </p>
      </header>

      {/* Active Lessons */}
      {active_lessons.map((lesson: any) => (
        <div key={lesson.id} style={{ background: '#fef2f2', borderRadius: '2rem', border: '1px solid #fee2e2', padding: '2rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <VideoCameraIcon size={32} />
              </div>
              <div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#991b1b', margin: 0 }}>{lesson.title}</h2>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'white', background: '#ef4444', padding: '0.2rem 0.6rem', borderRadius: '0.5rem' }}>LIVE NOW</span>
                 </div>
                 <p style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: '600', margin: 0 }}>with {lesson.tutor} • {lesson.time}</p>
              </div>
           </div>
           <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.25rem', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.25)' }}>
              Join Lesson
           </button>
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Past Lessons / Replays */}
         <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Recent Replays</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {past_lessons.map((lesson: any) => (
                 <div key={lesson.id} style={{ padding: '1.5rem', borderRadius: '1.75rem', background: 'white', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                       <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                          <PlayCircle02Icon size={24} />
                       </div>
                       <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{lesson.title}</h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', margin: '0.2rem 0' }}>{lesson.date} • {lesson.duration}</p>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Topics: {lesson.topics}</span>
                       </div>
                    </div>
                    <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>Watch</button>
                 </div>
               ))}
            </div>
         </div>

         {/* Follow-up Tasks */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Follow-up Tasks</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {tasks.map((item: any, i: number) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: item.status === 'done' ? 'none' : '2px solid #cbd5e1', background: item.status === 'done' ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {item.status === 'done' && <Tick02Icon size={14} color="white" />}
                    </div>
                    <div style={{ flex: 1 }}>
                       <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', margin: 0, textDecoration: item.status === 'done' ? 'line-through' : 'none', opacity: item.status === 'done' ? 0.5 : 1 }}>{item.task}</p>
                       <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600' }}>{item.type}</span>
                    </div>
                    {item.status === 'todo' && (
                       <button style={{ background: 'none', border: 'none', color: '#10b981', padding: 0, cursor: 'pointer' }}><Download01Icon size={18} /></button>
                    )}
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
