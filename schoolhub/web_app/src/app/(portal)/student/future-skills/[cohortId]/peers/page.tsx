'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft01Icon, UserGroupIcon, Trophy01Icon, Message01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function PeersDirectory({ params }: { params: Promise<{ cohortId: string }> }) {
  const router = useRouter();
  const { cohortId } = use(params);

  const [peers, setPeers] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch peers ordered by XP (Leaderboard)
    api.get(`/peers/roster?cohort_id=${cohortId}`)
      .then(res => setPeers(res.data.peers || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [cohortId]);

  // WebSocket for Live Presence
  useEffect(() => {
    const token = localStorage.getItem('schoolhub_token') || '';
    let domain = window.location.host;
    if (domain.includes('localhost')) {
      domain = 'reedbreed.resultspro.ng';
    }
    const wsUrl = `ws://localhost:8080/api/classroom/ws?room=PeerDirectory&token=${token}&domain=${domain}`;
    
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PRESENCE_UPDATE') {
          setActiveSessions(data.active_users || []);
        }
      } catch (e) {
        console.error('WS parse error', e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const isOnline = (userId: string) => {
    return activeSessions.includes(userId);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <button 
        onClick={() => router.back()} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '2rem', fontWeight: '600' }}
      >
        <ArrowLeft01Icon size={20} /> Back to Journey Map
      </button>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Cohort Roster & Leaderboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
            Connect with your peers and track your momentum.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'white', padding: '0.75rem 1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
             <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
             <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{activeSessions.length} Online Now</span>
          </div>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: '2rem', color: '#64748b' }}>Loading peers...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {peers.map((peer, index) => {
            const rank = index + 1;
            const online = isOnline(peer.user_id);
            
            return (
              <div key={peer.id} style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                {rank <= 3 && (
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: rank === 1 ? '#fef3c7' : rank === 2 ? '#f1f5f9' : '#ffedd5', borderBottomLeftRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Trophy01Icon size={24} color={rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : '#d97706'} />
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', border: online ? '2px solid #10b981' : '2px solid transparent', position: 'relative' }}>
                      {/* Avatar Placeholder */}
                      {online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', borderRadius: '50%', background: '#10b981', border: '2px solid white' }} />}
                   </div>
                   <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>User {peer.user_id.substring(0,6)}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Stage {peer.current_stage_number}</p>
                   </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '1rem' }}>
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 0.2rem 0' }}>Total XP</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6', margin: 0 }}>{peer.current_xp}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 0.2rem 0' }}>Streak</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f59e0b', margin: 0 }}>{peer.streak_days} Days</p>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '1rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                     <Message01Icon size={18} /> Message
                   </button>
                   <button style={{ padding: '0.75rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}>
                     <UserGroupIcon size={18} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
