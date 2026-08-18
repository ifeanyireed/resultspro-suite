'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BedIcon, Plus01Icon, UserGroupIcon, Home01Icon, Activity04Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminHostelPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/hostel');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin hostel data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Hostel Management...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load hostel data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Hostel Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Manage student boarding, room allocations, and facility maintenance across all residential blocks.
          </p>
        </div>
        <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
          <Plus01Icon size={20} />
          New Allocation
        </button>
      </header>

      {/* Stats Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.75rem', borderRadius: '2rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'bed' && <BedIcon size={32} />}
              {stat.icon === 'users' && <UserGroupIcon size={32} />}
              {stat.icon === 'activity' && <Activity04Icon size={32} />}
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
         {data.blocks?.map((block: any, i: number) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 + (i * 0.1) }}
             style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem', cursor: 'pointer' }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: `${block.color}10`, color: block.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Home01Icon size={24} />
                 </div>
                 <span style={{ fontSize: '0.7rem', fontWeight: '800', color: block.status === 'Near Full' ? '#ef4444' : '#10b981', background: block.status === 'Near Full' ? '#fef2f2' : '#f0fdf4', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>
                    {block.status.toUpperCase()}
                 </span>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>{block.name}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '700', color: '#64748b' }}>
                 <span>Occupancy</span>
                 <span>{block.capacity}</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
                 <div style={{ width: `${block.progress}%`, height: '100%', background: block.color, borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button style={{ flex: 1, padding: '0.8rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    View List
                 </button>
                 <button style={{ flex: 1, padding: '0.8rem', borderRadius: '1rem', background: block.color, border: 'none', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    Manage
                 </button>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
