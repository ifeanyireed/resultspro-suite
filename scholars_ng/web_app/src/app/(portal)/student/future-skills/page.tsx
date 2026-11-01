'use client';

import React, { useEffect, useState } from 'react';
import { 
  AiBrain01Icon, 
  Award01Icon, 
  PlayCircle02Icon, 
  StarIcon, 
  CheckmarkCircle02Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentFutureSkillsPath() {
  const [cohorts, setCohorts] = useState<any[]>([]);

  useEffect(() => {
    api.get('/public/cohorts')
      .then(res => setCohorts(res.data.cohorts || []))
      .catch(err => console.error('Failed to load cohorts:', err));
  }, []);

  if (!cohorts) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Cohorts...</div>;
  }

  // Placeholder progress data for the sidebar
  const badges = 3;
  const milestone = "Backend Developer Track";
  const remaining = 2;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#f59e0b', background: '#fffbeb', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>Scholars.ng</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Future Skills Path
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Your long-term digital skills journey across coding, AI, and robotics.
          </p>
        </div>
        <button style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.25)' }}>
          <PlayCircle02Icon size={20} />
          Continue Path
        </button>
      </header>

      {/* Current Progress & Milestones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }}>
        <div>
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Available Cohorts</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {cohorts.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No active cohorts found.</p>
                 ) : cohorts.map((cohort: any) => (
                   <div key={cohort.id} style={{ display: 'flex', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                            <StarIcon size={20} />
                         </div>
                         <div style={{ width: '2px', flex: 1, background: '#f1f5f9' }} />
                      </div>
                      <div style={{ flex: 1, paddingBottom: '2.5rem' }}>
                         <div style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                               <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#10b981' }}>{cohort.status}</span>
                               <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>{cohort.duration_weeks} Weeks</span>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{cohort.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>{cohort.description}</p>
                            <div style={{ marginTop: '1rem' }}>
                               <button style={{ background: '#1e293b', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>View Journey</button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
           {/* Badges */}
           <div style={{ background: '#1e293b', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Award01Icon size={20} color="#f59e0b" />
                 Skill Badges
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} style={{ aspectRatio: '1', borderRadius: '1rem', background: i <= badges ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: i <= badges ? '1px solid rgba(255,255,255,0.1)' : '1px dashed rgba(255,255,255,0.05)' }}>
                      {i <= badges ? <StarIcon size={24} color="#f59e0b" /> : <div />}
                   </div>
                 ))}
              </div>
              <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', borderRadius: '1rem', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>View All Badges</button>
           </div>

           {/* Next Milestone */}
           <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Next Milestone</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#eff6ff', color: '#146ef5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AiBrain01Icon size={24} />
                 </div>
                 <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{milestone}</p>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{remaining} modules left</span>
                 </div>
              </div>
              <button style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                 Retake Skill Checkpoint
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
