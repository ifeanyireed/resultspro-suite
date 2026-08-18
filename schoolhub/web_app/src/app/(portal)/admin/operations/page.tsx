'use client';

import React, { useEffect, useState } from 'react';
import { Settings01Icon, Activity04Icon, Clock01Icon, AlertCircleIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminOperationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/operations');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin operations data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Operations Log...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load operations data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Operations Log
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Monitor critical incident logs, manage facility maintenance, and track operational milestones.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Settings01Icon size={18} />
             System Settings
           </button>
           <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <AlertCircleIcon size={18} />
             Report Incident
           </button>
        </div>
      </header>

      {/* Health Overview */}
      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Activity04Icon size={32} />
            </div>
            <div>
               <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Operational Status: {data.health?.status}</div>
               <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: '500' }}>{data.health?.desc}</p>
            </div>
         </div>
         <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Uptime</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{data.health?.uptime}</div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Incident Log */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Incident History</h2>
               <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '700', cursor: 'pointer' }}>Filter Log</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.incidents?.map((incident: any) => (
                 <div key={incident.id} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: incident.color, border: '1px solid #e2e8f0' }}>
                          <AlertCircleIcon size={20} />
                       </div>
                       <div>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{incident.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Severity: {incident.severity} • {incident.time}</div>
                       </div>
                    </div>
                    <div>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', color: incident.status === 'Resolved' ? '#10b981' : '#f59e0b', background: incident.status === 'Resolved' ? '#f0fdf4' : '#fffbeb', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: `1px solid ${incident.status === 'Resolved' ? '#10b981' : '#f59e0b'}20` }}>
                         {incident.status.toUpperCase()}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Maintenance Schedule */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Facility Schedule</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.schedule?.map((item: any, i: number) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#146ef5' }}>
                       {item.icon === 'clock' && <Clock01Icon />}
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>{item.name}</div>
                       <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{item.date}</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '800', fontSize: '0.75rem' }}>Edit</button>
                 </div>
               ))}
            </div>
            <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
               View Full Calendar
            </button>
         </div>
      </div>
    </div>
  );
}
