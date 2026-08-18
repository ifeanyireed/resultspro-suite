'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar03Icon, Clock01Icon, Location01Icon, UserGroupIcon, FilterIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function ParentEventsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/parent/events');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch parent events data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Events...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load events data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Events Calendar
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Stay updated with school meetings, sports days, and important deadlines.
          </p>
        </div>
        <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1.25rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
          <FilterIcon size={18} />
          Filter Events
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
        {/* Events List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {data.upcoming?.map((event: any, i: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 10 }}
              style={{
                background: 'white',
                borderRadius: '2rem',
                border: '1px solid #f1f5f9',
                padding: '1.5rem',
                display: 'flex',
                gap: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '180px', height: '120px', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <Image 
                  src={event.img} 
                  alt={event.title} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  sizes="180px"
                  priority={i === 0}
                />
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.7rem', fontWeight: '800', color: event.color, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {event.category.toUpperCase()}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' }}>{event.title}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                    <Calendar03Icon size={16} color="#6366f1" />
                    <span>{event.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                    <Clock01Icon size={16} color="#6366f1" />
                    <span>{event.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                    <Location01Icon size={16} color="#6366f1" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div style={{ alignSelf: 'center' }}>
                <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', padding: '0.75rem 1.5rem', borderRadius: '1rem', cursor: 'pointer' }}>
                  RSVP
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar / Month View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Monthly Overview</h3>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.6 }}>
              You have 4 events scheduled for June. Your attendance at the Parent-Teacher meeting is requested.
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserGroupIcon size={20} />
                 </div>
                 <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7, display: 'block' }}>Next Meeting</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>In 2 days</span>
                 </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Annual Holidays</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {data.holidays?.map((h: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{h.name}</span>
                   <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
