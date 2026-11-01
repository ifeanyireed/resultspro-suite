'use client';

import React, { useEffect, useState } from 'react';
import { 
  Book02Icon, 
  Search01Icon, 
  StarIcon, 
  Folder01Icon, 
  Share01Icon,
  PlayCircle02Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function StudentLearningLibrary() {
  const [learningData, setLearningData] = useState<any>(null);

  useEffect(() => {
    api.get('/student/learning')
      .then(res => setLearningData(res.data))
      .catch(err => console.error('Failed to load learning data:', err));
  }, []);

  if (!learningData) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Library...</div>;
  }

  const { resources, recommended, folders } = learningData;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#146ef5', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ClassroomPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Learning Library
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Access curated lesson notes, slides, and recommended revision materials.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search resources..." 
            style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '280px', outline: 'none' }}
          />
          <Search01Icon size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </header>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['All Resources', 'Class Notes', 'Lecture Slides', 'Handouts', 'Video Replays'].map((cat, i) => (
          <button 
            key={i} 
            style={{ 
              padding: '0.6rem 1.25rem', 
              borderRadius: '2rem', 
              border: i === 0 ? '2px solid #146ef5' : '1px solid #e2e8f0', 
              background: i === 0 ? '#eff6ff' : 'white',
              color: i === 0 ? '#146ef5' : '#64748b',
              fontWeight: '700',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        {/* Resource List */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Recently Accessed</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resources.map((res: any) => (
              <div key={res.id} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: 'white', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Book02Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{res.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', margin: '0.2rem 0' }}>{res.subject} • {res.type}</p>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>Accessed {res.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem' }}><StarIcon size={18} /></button>
                   <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem' }}><Share01Icon size={18} /></button>
                   <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: '800', color: '#1e293b', cursor: 'pointer' }}>Open</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended & Folders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <PlayCircle02Icon size={20} color="#0ea5e9" />
                 Recommended for you
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 {recommended.map((rec: any, i: number) => (
                   <div key={i} style={{ cursor: 'pointer' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.25rem' }}>{rec.title}</p>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{rec.type} • {rec.duration || `${rec.questions} questions`}</span>
                   </div>
                 ))}
                 <button style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    Continue Learning
                 </button>
              </div>
           </div>

           <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Your Study Folders</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 {folders.map((folder: string) => (
                   <div key={folder} style={{ padding: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', cursor: 'pointer' }}>
                      <Folder01Icon size={20} color="#146ef5" style={{ marginBottom: '0.5rem' }} />
                      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{folder}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
