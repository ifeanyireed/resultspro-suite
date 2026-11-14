'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Task01Icon, UserGroupIcon, Clock01Icon, FolderCheckIcon, MoreHorizontalIcon } from 'hugeicons-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

export default function TeacherHomeworkPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject_name: 'Mathematics',
    class_name: 'SS 2 Science',
    due_date: '2026-11-25',
    max_score: 20,
    instructions: ''
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/v1/campus/homework');
      const rows = Array.isArray(response.data) ? response.data : [];
      const colors = ['#146ef5', '#10b981', '#8b5cf6', '#f59e0b'];
      setData({
        stats: [
          { label: 'Active Homework', value: String(rows.length), bg: '#eff6ff', color: '#146ef5' },
          {
            label: 'Total Submissions',
            value: String(rows.reduce((acc: number, r: any) => acc + Number(r.submissions_count || 0), 0)),
            bg: '#ecfdf5',
            color: '#10b981'
          },
          {
            label: 'Classes Covered',
            value: String(new Set(rows.map((r: any) => r.class_name)).size || 1),
            bg: '#fffbeb',
            color: '#f59e0b'
          }
        ],
        assignments: rows.map((r: any, idx: number) => ({
          id: r.id,
          title: `${r.subject_name}: ${r.title}`,
          status: r.status === 'PUBLISHED' ? 'Active' : r.status || 'Needs Grading',
          class: r.class_name,
          deadline: r.due_date || 'Upcoming',
          submissions: `${r.submissions_count || 0}/${r.total_students || 28}`,
          color: colors[idx % colors.length]
        }))
      });
    } catch (error) {
      console.error('Failed to fetch tenant teacher homework data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/campus/homework', {
        ...newTask,
        max_score: Number(newTask.max_score)
      });
      setShowCreateModal(false);
      setNewTask({
        title: '',
        subject_name: 'Mathematics',
        class_name: 'SS 2 Science',
        due_date: '2026-11-25',
        max_score: 20,
        instructions: ''
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to create homework:', err);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Homework...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load homework data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Homework Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Assign, track, and grade student homework across all your classes.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}
        >
          <PlusIcon style={{ width: 20, height: 20 }} />
          Create Assignment
        </button>
      </header>

      {showCreateModal && (
        <form
          onSubmit={handleCreateHomework}
          style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #dbeafe', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}
        >
          <input
            type="text"
            required
            placeholder="Assignment Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
          />
          <input
            type="text"
            required
            placeholder="Subject Name"
            value={newTask.subject_name}
            onChange={(e) => setNewTask({ ...newTask, subject_name: e.target.value })}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
          />
          <input
            type="text"
            required
            placeholder="Target Class (e.g. SS 2 Science)"
            value={newTask.class_name}
            onChange={(e) => setNewTask({ ...newTask, class_name: e.target.value })}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
          />
          <input
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
          />
          <input
            type="text"
            placeholder="Instructions"
            value={newTask.instructions}
            onChange={(e) => setNewTask({ ...newTask, instructions: e.target.value })}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ background: '#146ef5', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
              Publish to Class
            </button>
            <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Stats Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Task01Icon size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Active Assignments</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {data.assignments?.map((assignment: any, i: number) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            style={{
              background: 'white',
              borderRadius: '1.75rem',
              border: '1px solid #f1f5f9',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '1.25rem', background: `${assignment.color}10`, color: assignment.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FolderCheckIcon size={24} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{assignment.title}</h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: assignment.status === 'Needs Grading' ? '#f59e0b' : '#146ef5', background: assignment.status === 'Needs Grading' ? '#fffbeb' : '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', border: `1px solid ${assignment.status === 'Needs Grading' ? '#fde68a' : '#dbeafe'}` }}>
                    {assignment.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <UserGroupIcon size={16} />
                    <span>{assignment.class}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock01Icon size={16} />
                    <span>Due: {assignment.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{assignment.submissions}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Submissions</div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                 <button style={{ padding: '0.75rem 1.25rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                   View All
                 </button>
                 <button style={{ padding: '0.75rem 1.25rem', borderRadius: '1rem', background: assignment.color, border: 'none', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                   {assignment.status === 'Needs Grading' ? 'Start Grading' : 'Manage'}
                 </button>
              </div>
              
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <MoreHorizontalIcon size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
