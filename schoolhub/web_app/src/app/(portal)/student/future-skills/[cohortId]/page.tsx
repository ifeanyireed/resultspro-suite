'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft01Icon, 
  CheckmarkCircle02Icon, 
  LockIcon,
  PlayCircle02Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function CohortJourneyMap({ params }: { params: Promise<{ cohortId: string }> }) {
  const router = useRouter();
  const { cohortId } = use(params);
  
  const [data, setData] = useState<{ stages: any[], modules: any[] } | null>(null);

  useEffect(() => {
    // We assume the user is authenticated, so api.get will attach headers
    api.get(`/cohorts/${cohortId}/journey`)
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to load journey map:', err));
  }, [cohortId]);

  if (!data) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Journey Map...</div>;
  }

  const { stages, modules } = data;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <button 
        onClick={() => router.back()} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '2rem', fontWeight: '600' }}
      >
        <ArrowLeft01Icon size={20} /> Back to Cohorts
      </button>
      
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Journey Map</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>Your path through this cohort</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {stages.map((stage: any, index: number) => {
          const stageModules = modules.filter(m => m.stage_id === stage.id).sort((a, b) => a.order_index - b.order_index);
          const isLocked = index > 0; // Simplified logic: first stage unlocked, others locked

          return (
            <div key={stage.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: isLocked ? 0.5 : 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isLocked ? '#e2e8f0' : '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {isLocked ? <LockIcon size={20} /> : stage.stage_number}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{stage.title}</h2>
                  {stage.subtitle && <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{stage.subtitle}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', borderLeft: '2px dashed #e2e8f0', marginLeft: '1.2rem' }}>
                {stageModules.length === 0 ? (
                   <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No modules mapped yet.</p>
                ) : stageModules.map((mod: any) => (
                  <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', opacity: isLocked ? 0.5 : 1 }}>
                    <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'white', border: '1px solid #f1f5f9', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{mod.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>{mod.duration_text}</p>
                      </div>
                      <button 
                        disabled={isLocked}
                        onClick={() => router.push(`/student/future-skills/${cohortId}/module/${mod.id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: isLocked ? '#f1f5f9' : '#eff6ff', color: isLocked ? '#94a3b8' : '#146ef5', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontWeight: '700', cursor: isLocked ? 'not-allowed' : 'pointer' }}
                      >
                        <PlayCircle02Icon size={18} /> {isLocked ? 'Locked' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
