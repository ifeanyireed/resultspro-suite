'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Plus01Icon, 
  StarIcon, 
  Clock01Icon, 
  FilterIcon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function ParentTutorBooking() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/parent/tutors');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch parent tutor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Tutors...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load tutor data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>TutorsPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Tutor Booking
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Find the best academic support for your children and manage their specialized learning sessions.
          </p>
        </div>
        <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.25)' }}>
          <Plus01Icon size={20} />
          Book New Tutor
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
         {/* Available Tutors */}
         <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Recommended Tutors</h2>
               <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>
                  <FilterIcon size={16} /> Filter by Subject
               </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               {data.available_tutors?.map((tutor: any) => (
                 <motion.div
                   key={tutor.id}
                   whileHover={{ y: -5 }}
                   style={{ background: 'white', padding: '1.5rem', borderRadius: '2rem', border: '1px solid #f1f5f9' }}
                 >
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                       <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', overflow: 'hidden', position: 'relative' }}>
                          <Image src={tutor.img} alt={tutor.name} fill style={{ objectFit: 'cover' }} />
                       </div>
                       <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{tutor.name}</h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', margin: '0.2rem 0' }}>{tutor.subject}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: '800' }}>
                             <StarIcon size={14} /> {tutor.rating}
                             <span style={{ color: '#cbd5e1', fontWeight: '500' }}>({tutor.sessions} sessions)</span>
                          </div>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                       <button style={{ flex: 1, padding: '0.75rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>Profile</button>
                       <button style={{ flex: 1.5, padding: '0.75rem', borderRadius: '1rem', background: '#10b981', border: 'none', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>Book Session</button>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Booked Sessions */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Your Bookings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.bookings?.map((booking: any, i: number) => (
                 <div key={i} style={{ padding: '1.25rem', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#146ef5', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>{booking.child.toUpperCase()}</span>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#10b981' }}>{booking.status}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Session with {booking.tutor}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginTop: '0.5rem' }}>
                       <Clock01Icon size={14} /> {booking.time}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                       <button style={{ flex: 1, padding: '0.5rem', borderRadius: '0.75rem', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '700', fontSize: '0.75rem' }}>Cancel</button>
                       <button style={{ flex: 1, padding: '0.5rem', borderRadius: '0.75rem', background: 'none', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '0.75rem' }}>Reschedule</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
