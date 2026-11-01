'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book02Icon, UserGroupIcon, Clock01Icon, Location01Icon, MoreHorizontalIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/teacher/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Classes...</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          My Classes
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Manage your student rosters, view class schedules, and track attendance.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {classes.map((cls, i) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            style={{
              background: 'white',
              borderRadius: '2rem',
              border: '1px solid #f1f5f9',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: `${cls.color}10`, color: cls.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Book02Icon size={24} />
              </div>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <MoreHorizontalIcon size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>{cls.name}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                <UserGroupIcon size={18} />
                <span>{cls.students} Students Enrolled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                <Clock01Icon size={18} />
                <span>{cls.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                <Location01Icon size={18} />
                <span>Room {cls.room}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <div 
                  key={day} 
                  style={{ 
                    flex: 1, 
                    textAlign: 'center', 
                    padding: '0.4rem 0', 
                    borderRadius: '0.75rem', 
                    fontSize: '0.7rem', 
                    fontWeight: '800',
                    background: cls.days.includes(day) ? cls.color : '#f8fafc',
                    color: cls.days.includes(day) ? 'white' : '#94a3b8',
                    border: cls.days.includes(day) ? 'none' : '1px solid #f1f5f9'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ flex: 1, padding: '0.8rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                Attendance
              </button>
              <button style={{ flex: 1, padding: '0.8rem', borderRadius: '1rem', background: cls.color, border: 'none', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                View Roster
              </button>
            </div>

            <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: cls.color }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
