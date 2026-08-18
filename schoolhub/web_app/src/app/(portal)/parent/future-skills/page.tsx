'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CodeIcon, 
  Award01Icon, 
  StarIcon, 
  AnalyticsUpIcon, 
  Share01Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function ParentFutureSkillsView() {
  const [activeChild, setActiveChild] = useState(0);
  const [childrenSkills, setChildrenSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/parent/future-skills');
        setChildrenSkills(response.data);
      } catch (error) {
        console.error('Failed to fetch parent future skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Skills...</div>;
  if (!childrenSkills.length) return <div style={{ padding: '2rem' }}>No skills data found.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#f59e0b', background: '#fffbeb', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>Scholars.ng</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Future Skills Progress
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Monitor your children&apos;s digital skills journey across coding, AI, and emerging technologies.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           {childrenSkills.map((child, i) => (
             <button
               key={i}
               onClick={() => setActiveChild(i)}
               style={{
                 padding: '0.6rem 1.25rem',
                 borderRadius: '2rem',
                 border: activeChild === i ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                 background: activeChild === i ? '#fffbeb' : 'white',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 cursor: 'pointer',
                 transition: 'all 0.2s ease'
               }}
             >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                   <Image src={child.photo} alt={child.name} width={24} height={24} style={{ objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: activeChild === i ? '#b45309' : '#64748b' }}>{child.name.split(' ')[0]}</span>
             </button>
           ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Mastery Overview */}
         <div>
            <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem', marginBottom: '2rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                     <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{childrenSkills[activeChild].stage}</h2>
                     <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', marginTop: '0.25rem' }}>Current Milestone: {childrenSkills[activeChild].milestone}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#146ef5' }}>{childrenSkills[activeChild].completion}%</div>
                     <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Completion</span>
                  </div>
               </div>
               
               <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${childrenSkills[activeChild].completion}%` }}
                    transition={{ duration: 1 }}
                    style={{ height: '100%', background: 'linear-gradient(to right, #146ef5, #0ea5e9)', borderRadius: '6px' }} 
                  />
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem' }}>
                     <CodeIcon size={20} color="#146ef5" style={{ marginBottom: '0.5rem' }} />
                     <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>8 Modules</div>
                     <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>Completed</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem' }}>
                     <Award01Icon size={20} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                     <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>{childrenSkills[activeChild].badges} Badges</div>
                     <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>Earned</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem' }}>
                     <AnalyticsUpIcon size={20} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                     <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>Top 10%</div>
                     <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>Global Rank</span>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
               <button style={{ flex: 1, padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>View Skill Roadmap</button>
               <button style={{ flex: 1, padding: '1rem', borderRadius: '1.25rem', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <Share01Icon size={18} /> Share Progress
               </button>
            </div>
         </div>

         {/* Recommendation & Badges */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Recommended Next Step</h3>
               <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '2rem' }}>
                  {childrenSkills[activeChild].next_step}
               </p>
               <button style={{ width: '100%', padding: '0.8rem', borderRadius: '1rem', background: '#f59e0b', color: '#1e293b', border: 'none', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Encourage Next Module
               </button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Recently Earned</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ aspectRatio: '1', borderRadius: '0.75rem', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <StarIcon size={20} color="#f59e0b" />
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
