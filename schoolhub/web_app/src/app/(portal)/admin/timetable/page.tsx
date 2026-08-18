'use client';

import React, { useEffect, useState } from 'react';
import { Plus01Icon, FilterIcon, UserGroupIcon, Location01Icon, Clock01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminTimetablePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/timetable');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin timetable data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Timetable...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load timetable data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Master Timetable
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Manage the institutional schedule, assign teachers to rooms, and resolve scheduling conflicts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1.25rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
             <FilterIcon size={18} />
             Conflict Check
           </button>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
             <Plus01Icon size={20} />
             Add Class Session
           </button>
        </div>
      </header>

      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
           {data.classes?.map((cls: string, i: number) => (
             <button 
               key={i} 
               style={{ 
                 padding: '0.6rem 1.25rem', 
                 borderRadius: '2rem', 
                 border: i === 4 ? '2px solid #146ef5' : '1px solid #e2e8f0', 
                 background: i === 4 ? '#eff6ff' : 'white',
                 color: i === 4 ? '#146ef5' : '#64748b',
                 fontWeight: '700',
                 fontSize: '0.85rem',
                 whiteSpace: 'nowrap',
                 cursor: 'pointer'
               }}
             >
               {cls}
             </button>
           ))}
        </div>

        <div style={{ minWidth: '800px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div />
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                {day}
              </div>
            ))}
          </div>

          {[ '08:00', '09:00', '10:00', '11:00', '12:00', '13:00' ].map((hour, hIdx) => (
            <div key={hour} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: '1rem', height: '100px', borderTop: '1px solid #f1f5f9' }}>
               <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', paddingTop: '0.5rem' }}>{hour}</div>
               {[0, 1, 2, 3, 4].map(dIdx => (
                 <div key={dIdx} style={{ padding: '0.5rem' }}>
                    {(hIdx + dIdx) % 3 === 0 && (
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '0.75rem', height: '100%', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <div style={{ fontWeight: '800', color: '#1e293b' }}>Mathematics</div>
                         <div style={{ color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                            <Location01Icon size={10} /> Room 402
                         </div>
                      </div>
                    )}
                 </div>
               ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
         <div style={{ background: '#f8fafc', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <UserGroupIcon size={18} color="#146ef5" />
               Teacher Utilization
            </h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{data.stats?.utilization}</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Average teacher workload across all departments.</p>
         </div>
         <div style={{ background: '#f8fafc', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Location01Icon size={18} color="#10b981" />
               Room Availability
            </h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{data.stats?.rooms}</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Available for extra-curricular or special sessions.</p>
         </div>
         <div style={{ background: '#fef2f2', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #fee2e2' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Clock01Icon size={18} />
               Conflicts Detected
            </h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444' }}>{data.stats?.conflicts}</div>
            <p style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: '0.25rem' }}>No scheduling overlaps found in current term.</p>
         </div>
      </div>
    </div>
  );
}
