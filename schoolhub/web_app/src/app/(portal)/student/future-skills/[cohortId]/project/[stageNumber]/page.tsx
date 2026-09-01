'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft01Icon, Upload02Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function SubmitProject({ params }: { params: Promise<{ cohortId: string, stageNumber: string }> }) {
  const router = useRouter();
  const { cohortId, stageNumber } = use(params);

  const [formData, setFormData] = useState({
    project_title: '',
    repo_url: '',
    live_demo_url: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/projects/submit', {
        cohort_id: cohortId,
        stage_number: parseInt(stageNumber, 10),
        ...formData
      });
      alert('Project submitted successfully!');
      router.back();
    } catch (err) {
      alert('Failed to submit project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <button 
        onClick={() => router.back()} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '2rem', fontWeight: '600' }}
      >
        <ArrowLeft01Icon size={20} /> Back to Journey Map
      </button>

      <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#3b82f6', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>Stage {stageNumber}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>Project Submission</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Submit your milestone deliverable for mentor review.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Project Title *</label>
            <input 
              required
              type="text" 
              value={formData.project_title}
              onChange={e => setFormData({...formData, project_title: e.target.value})}
              placeholder="e.g. E-Commerce Backend API"
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>GitHub Repository URL</label>
            <input 
              type="url" 
              value={formData.repo_url}
              onChange={e => setFormData({...formData, repo_url: e.target.value})}
              placeholder="https://github.com/..."
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Live Demo URL</label>
            <input 
              type="url" 
              value={formData.live_demo_url}
              onChange={e => setFormData({...formData, live_demo_url: e.target.value})}
              placeholder="https://..."
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Notes for Mentor</label>
            <textarea 
              rows={4}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Any specific areas you want feedback on?"
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontWeight: '700', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              <Upload02Icon size={20} /> {loading ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
