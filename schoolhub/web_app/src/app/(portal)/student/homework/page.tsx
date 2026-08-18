'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tick02Icon, Book02Icon, Clock01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentHomeworkPage() {
  const [homeworkTasks, setHomeworkTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = ['To Do', 'On Review', 'Completed'];

  useEffect(() => {
    api.get('/student/homework')
      .then(res => setHomeworkTasks(res.data.tasks || []))
      .catch(err => console.error('Failed to load homework:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Homework...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Homework & Assignments
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Track your tasks, submit assignments, and view teacher feedback.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {columns.map(column => (
          <div key={column}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: column === 'To Do' ? '#ef4444' : column === 'On Review' ? '#6366f1' : '#10b981' }} />
                <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{column}</h2>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>
                {homeworkTasks.filter(t => t.status === column).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {homeworkTasks.filter(task => task.status === column).map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                  style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '1.5rem',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: task.color, background: `${task.color}10`, padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>
                      {task.subject.toUpperCase()}
                    </span>
                    {task.status === 'Completed' ? (
                      <Tick02Icon size={16} color="#10b981" />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.65rem', fontWeight: '700' }}>
                        <Clock01Icon size={12} />
                        <span>{task.deadline}</span>
                      </div>
                    )}
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {task.title}
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Book02Icon size={12} color="#64748b" />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>View Material</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#146ef5' }}>Open Task</div>
                  </div>
                </motion.div>
              ))}

              {column === 'To Do' && (
                <div style={{ padding: '1.5rem', border: '2px dashed #e2e8f0', borderRadius: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>+ Add Custom Reminder</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
