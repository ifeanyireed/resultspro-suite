'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft01Icon } from 'hugeicons-react';

export default function LessonPlayer({ params }: { params: Promise<{ cohortId: string, moduleId: string }> }) {
  const router = useRouter();
  const { cohortId, moduleId } = use(params);

  // In a real app, fetch the specific module by ID
  // For now, we will render a placeholder player

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <button 
        onClick={() => router.back()} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '2rem', fontWeight: '600' }}
      >
        <ArrowLeft01Icon size={20} /> Back to Journey Map
      </button>

      <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Module Content Player</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Module ID: {moduleId}</p>
        </div>
        
        <div style={{ padding: '2rem', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontStyle: 'italic' }}>Interactive Markdown and Video Player renders here.</p>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
          <button style={{ padding: '0.8rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>Previous Module</button>
          <button style={{ padding: '0.8rem 1.5rem', borderRadius: '1rem', border: 'none', background: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Mark as Complete</button>
        </div>
      </div>
    </div>
  );
}
