'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus01Icon, Calendar03Icon, Flag01Icon, Tick02Icon, MoreHorizontalIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function TeacherTasksPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/teacher/tasks');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher task data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Tasks...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load task data.</div>;

  return (
    <div style={{ maxWidth: '1000px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            My Tasks
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Your personal task manager for lesson plans, meetings, and administrative work.
          </p>
        </div>
        <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
          <Plus01Icon size={20} />
          Add Task
        </button>
      </header>

      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0.5rem 0' }}>
          {['Active Tasks', 'Upcoming', 'Completed'].map((tab, i) => (
            <button 
              key={tab} 
              style={{ 
                padding: '1rem 2rem', 
                background: 'none', 
                border: 'none', 
                borderBottom: i === 0 ? '3px solid #146ef5' : '3px solid transparent',
                color: i === 0 ? '#146ef5' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.active_tasks?.map((task: any, i: number) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ background: '#f8fafc' }}
                style={{
                  padding: '1.25rem',
                  borderRadius: '1.25rem',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {/* Empty checkbox circle */}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{task.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar03Icon size={14} />
                      <span>{task.deadline}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1' }} />
                      <span>{task.category}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: task.color, fontSize: '0.75rem', fontWeight: '800', background: `${task.color}10`, padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>
                    <Flag01Icon size={14} />
                    {task.priority}
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <MoreHorizontalIcon size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#f8fafc', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tick02Icon size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', display: 'block' }}>Task Mastery</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>You completed {data.stats?.completed_today} tasks today. Great productivity!</span>
          </div>
        </div>
        <div style={{ width: '150px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
           <div style={{ width: `${data.stats?.mastery_percent}%`, height: '100%', background: '#10b981', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}
