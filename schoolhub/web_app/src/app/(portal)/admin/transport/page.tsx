'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SchoolBusIcon, Plus01Icon, Location01Icon, Clock01Icon, Activity04Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminTransportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/transport');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin transport data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Transport...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load transport data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Transport Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Monitor bus fleet operations, optimize routes, and ensure student safety during transit.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
             Track Live
           </button>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
             <Plus01Icon size={20} />
             Add New Route
           </button>
        </div>
      </header>

      {/* Stats Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.75rem', borderRadius: '2rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'bus' && <SchoolBusIcon size={32} />}
              {stat.icon === 'location' && <Location01Icon size={32} />}
              {stat.icon === 'clock' && <Clock01Icon size={32} />}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Fleet List */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Fleet Status</h2>
               <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '700', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.active_buses?.map((bus: any) => (
                 <div key={bus.id} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', border: '1px solid #e2e8f0' }}>
                          <SchoolBusIcon size={20} />
                       </div>
                       <div>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{bus.id} - {bus.route}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Driver: {bus.driver} • Load: {bus.load}</div>
                       </div>
                    </div>
                    <div>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', color: bus.color, background: `${bus.color}10`, padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: `1px solid ${bus.color}20` }}>
                         {bus.status.toUpperCase()}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Operational Log */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Operational Alert</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.alerts?.map((alert: any, i: number) => (
                 <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: alert.color, marginBottom: '0.5rem' }}>
                       <Activity04Icon size={16} />
                       <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{alert.type}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {alert.desc}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.75rem', fontWeight: '600' }}>{alert.time}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
