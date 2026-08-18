'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar03Icon, Clock01Icon, UserGroupIcon, Plus01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdmissionsToursPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/admissions/tours');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admissions tours data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Tours...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load tours data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Tours & Events
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Schedule campus visits, manage open house events, and assign tour guides to prospective families.
          </p>
        </div>
        <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
          <Plus01Icon size={20} />
          Book Tour
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Today's Schedule */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Today&apos;s Schedule</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {data.tours?.map((tour: any, i: number) => (
                 <motion.div
                   key={tour.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   style={{ padding: '1.5rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                 >
                    <div style={{ width: '80px', height: '80px', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                       <Image src={tour.img} alt={tour.family} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{tour.family} Campus Visit</h3>
                          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: tour.status === 'Arrived' ? '#10b981' : tour.status === 'Confirmed' ? '#146ef5' : '#f59e0b', background: 'white', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                            {tour.status.toUpperCase()}
                          </span>
                       </div>
                       <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                             <Clock01Icon size={14} color="#146ef5" />
                             {tour.time}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                             <UserGroupIcon size={14} color="#146ef5" />
                             Guide: {tour.staff}
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Calendar Widget Placeholder */}
         <div style={{ background: '#1e293b', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>June 2024</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
               {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                 <div key={d} style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.5, marginBottom: '0.5rem' }}>{d}</div>
               ))}
               {Array.from({ length: 30 }).map((_, i) => (
                 <div 
                   key={i} 
                   style={{ 
                     aspectRatio: '1', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     fontSize: '0.85rem', 
                     fontWeight: '700',
                     borderRadius: '0.5rem',
                     background: i + 1 === 12 ? '#146ef5' : 'transparent',
                     color: i + 1 === 12 ? 'white' : 'inherit',
                     cursor: 'pointer'
                   }}
                 >
                   {i + 1}
                 </div>
               ))}
            </div>
            <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
               <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem' }}>Upcoming Major Events</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar03Icon size={20} />
                     </div>
                     <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Open House Day</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Saturday, 22 June</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
