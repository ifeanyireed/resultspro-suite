'use client';

import React, { useEffect, useState } from 'react';
import { 
  Folder01Icon, 
  CheckmarkBadge01Icon,
  Alert02Icon,
  UserGroupIcon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function MentorConsole() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: hitting /mentor/submissions which maps to our GetPendingSubmissions API
    api.get('/mentor/submissions')
      .then(res => setSubmissions(res.data.submissions || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const approveSubmission = async (id: string) => {
    try {
      await api.post(`/mentor/submissions/${id}/review`, {
        status: 'APPROVED',
        mentor_rating: 5,
        mentor_feedback: 'Great job! Meets all acceptance criteria.',
        video_review_url: ''
      });
      // Remove from pending list
      setSubmissions(prev => prev.filter(s => s.id !== id));
      alert('Approved successfully.');
    } catch (e) {
      alert('Failed to review submission.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#8b5cf6', background: '#f5f3ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>Mentor Console</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
            Air-Traffic Control
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
            Student health, pending reviews, and drop-out risks.
          </p>
        </div>
      </header>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Pending Reviews</span>
            <Folder01Icon size={20} color="#3b82f6" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{submissions.length}</h2>
        </div>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>At Risk Students</span>
            <Alert02Icon size={20} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>2</h2>
        </div>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Avg. Velocity</span>
            <CheckmarkBadge01Icon size={20} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>94%</h2>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Pending Project Submissions</h2>
        </div>
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
            <Folder01Icon size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Inbox zero! All submissions are reviewed.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Project Title</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Student ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Links</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{sub.project_title}</p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Stage {sub.stage_number}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: '#64748b' }}>{sub.user_id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>
                    {sub.repo_url && <a href={sub.repo_url} target="_blank" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '1rem' }}>GitHub</a>}
                    {sub.live_demo_url && <a href={sub.live_demo_url} target="_blank" style={{ color: '#10b981', textDecoration: 'none' }}>Live Demo</a>}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => approveSubmission(sub.id)}
                      style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', marginRight: '0.5rem' }}
                    >
                      Quick Approve
                    </button>
                    <button style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Detailed Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
