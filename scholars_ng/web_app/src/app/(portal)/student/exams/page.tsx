'use client';

import React, { useEffect, useState } from 'react';
import { 
  Quiz01Icon, 
  Calendar03Icon, 
  HistoryIcon, 
  Clock01Icon, 
  AnalyticsUpIcon,
  AlertCircleIcon,
  ArrowRight01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentMyExams() {
  const [examsData, setExamsData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/exams')
      .then(res => setExamsData(res.data))
      .catch(err => console.error('Failed to load exams data:', err));
  }, []);

  if (!examsData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Exams...</div>;
  }

  const { upcoming, weak_topics, history, stats } = examsData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ExamPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            My Exams & Practice
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Prepare for upcoming tests, review mock history, and tackle your weak topics.
          </p>
        </div>
        <button style={{ background: '#6366f1', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.25)' }}>
          <Quiz01Icon size={20} />
          Start Practice Test
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem' }}>
        {/* Left Column: Schedule & Weak Topics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           {/* Upcoming */}
           <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Calendar03Icon size={20} color="#6366f1" />
                 Upcoming Schedule
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {upcoming.map((exam: any) => (
                   <div key={exam.id} style={{ padding: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                         <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{exam.title}</p>
                         <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{exam.date} • {exam.time}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: '800', color: exam.type === 'Official' ? '#ef4444' : '#6366f1', background: exam.type === 'Official' ? '#fef2f2' : '#eef2ff', padding: '0.25rem 0.6rem', borderRadius: '0.5rem' }}>{exam.type.toUpperCase()}</span>
                   </div>
                 ))}
                 <button style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem' }}>View Exam Calendar</button>
              </div>
           </div>

           {/* Weak Topics */}
           <div style={{ background: '#fffbeb', borderRadius: '2rem', border: '1px solid #fef3c7', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#92400e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <AlertCircleIcon size={20} />
                 Topics to Retry
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#b45309', marginBottom: '1.5rem', lineHeight: 1.5 }}>You&apos;ve missed these questions in your last 3 attempts. Practice makes perfect!</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {weak_topics.map((topic: string, i: number) => (
                   <div key={i} style={{ padding: '0.75rem 1rem', background: 'white', borderRadius: '1rem', border: '1px solid #fef3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{topic}</span>
                      <ArrowRight01Icon size={16} color="#d97706" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: History & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           {/* Mock History */}
           <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <HistoryIcon size={24} color="#6366f1" />
                 Mock Test History
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {history.map((test: any) => (
                   <div key={test.id} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#6366f1' }}>{test.subject.charAt(0)}</div>
                         <div>
                            <p style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{test.title}</p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{test.date} • {test.duration} spent</span>
                         </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{test.score}</div>
                         <button style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '800', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}>Review Attempt</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Quick Stats */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#eff6ff', borderRadius: '1.5rem', padding: '1.5rem' }}>
                 <Clock01Icon size={20} color="#146ef5" style={{ marginBottom: '0.5rem' }} />
                 <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{stats.learning_time}</div>
                 <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.25rem' }}>Learning Time</p>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '1.5rem', padding: '1.5rem' }}>
                 <AnalyticsUpIcon size={20} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                 <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{stats.weekly_growth}</div>
                 <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.25rem' }}>Weekly Growth</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
