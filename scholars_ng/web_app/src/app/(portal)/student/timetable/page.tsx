'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar03Icon, Clock01Icon, Location01Icon, UserIcon } from 'hugeicons-react';
import api from '@/lib/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export default function StudentTimetablePage() {
  const [timetableData, setTimetableData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/timetable')
      .then(res => setTimetableData(res.data))
      .catch(err => console.error('Failed to load timetable data:', err));
  }, []);

  if (!timetableData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Timetable...</div>;
  }

  const { schedule, summary } = timetableData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Weekly Timetable
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Your academic schedule for {summary.term}.
        </p>
      </header>

      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem', overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ minWidth: '800px' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div />
            {days.map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div style={{ position: 'relative' }}>
            {hours.map((hour) => (
              <div key={hour} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: '1rem', height: '100px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', paddingTop: '0.5rem' }}>{hour}</div>
                {[0, 1, 2, 3, 4].map(dayIndex => {
                  const subject = schedule.find((s: any) => s.day === days[dayIndex] && s.time === hour);
                  return (
                    <div key={dayIndex} style={{ position: 'relative' }}>
                      {subject && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            right: '4px',
                            bottom: '4px',
                            background: `${subject.color}10`,
                            border: `1px solid ${subject.color}30`,
                            borderRadius: '1rem',
                            padding: '1rem',
                            zIndex: 10,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem' }}>{subject.subject}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
                              <UserIcon size={12} />
                              <span>{subject.teacher}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: subject.color, fontWeight: '700' }}>
                            <Location01Icon size={12} />
                            <span>Room {subject.room}</span>
                          </div>
                          <div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', width: '4px', background: subject.color, borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }} />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar03Icon size={18} color="#146ef5" />
            Upcoming Changes
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
            {summary.upcoming_changes}
          </p>
        </div>
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock01Icon size={18} color="#10b981" />
            Attendance Summary
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{summary.attendance_rate}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Excellent attendance this term. Keep it up!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
