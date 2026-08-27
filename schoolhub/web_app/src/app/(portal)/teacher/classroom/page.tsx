'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Book02Icon, 
  Task01Icon, 
  Megaphone01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function TeacherClassroomDashboard() {
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

  if (loading) return <div style={{ padding: '2rem' }}>Loading Classroom...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load classroom data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#146ef5', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ClassroomPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Classroom Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Real-time management of your assigned classes, lesson progress, and student engagement.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
             Schedule Lesson
           </button>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
             <PlusIcon style={{ width: 20, height: 20 }} />
             Create Lesson
           </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
         {/* Assigned Classes */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {data.assigned_classes?.map((cls: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                       <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: `${cls.color}10`, color: cls.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Book02Icon size={28} />
                       </div>
                       <div>
                          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{cls.name}</h2>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{cls.students} Students Enrolled</span>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>{cls.attendance}</div>
                       <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Attendance</span>
                    </div>
                 </div>

                 <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b' }}>
                       <span>Syllabus Progress</span>
                       <span>{cls.progress}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                       <div style={{ width: `${cls.progress}%`, height: '100%', background: cls.color, borderRadius: '4px' }} />
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ flex: 1, padding: '0.8rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>View Roster</button>
                    <button style={{ flex: 1, padding: '0.8rem', borderRadius: '1rem', background: cls.color, border: 'none', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>Open Classroom</button>
                 </div>
              </motion.div>
            ))}
         </div>

         {/* Teacher Insights Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Task01Icon size={20} color="#f59e0b" />
                  Homework Queue
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {data.homework_queue?.map((hw: any, i: number) => (
                    <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                       <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{hw.title}</p>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{hw.count}/{hw.total} Submitted</span>
                          <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}>Review</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Megaphone01Icon size={20} color="#0ea5e9" />
                  Quick Broadcast
               </h3>
               <textarea 
                  placeholder="Send announcement to all students..."
                  style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem', minHeight: '100px', outline: 'none', resize: 'none', marginBottom: '1.5rem' }}
               />
               <button style={{ width: '100%', padding: '0.8rem', borderRadius: '1rem', background: '#146ef5', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Send Announcement
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
