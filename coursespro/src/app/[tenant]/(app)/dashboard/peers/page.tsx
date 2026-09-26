"use client";
import React, { useEffect, useState } from 'react';
import { ChatBubbleLeftRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

export default function PeersPage() {
  const [peers, setPeers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeers = async () => {
      try {
        setLoading(true);
        // 1. Fetch peer enrollments with presence status from coursespro
        const peersRes = await api.get('/api/peers/roster');
        const peerEnrollments = peersRes.data.peers || [];

        if (peerEnrollments.length === 0) {
          setPeers([]);
          setLoading(false);
          return;
        }

        const userIds = peerEnrollments.map((p: any) => p.user_id);

        // 2. Fetch rich profiles from users service
        const profilesRes = await api.post('/api/v1/users/profiles/bulk', { user_ids: userIds });
        const profiles = profilesRes.data.profiles || [];

        // 3. Merge data
        const mergedPeers = peerEnrollments.map((p: any) => {
          const profile = profiles.find((prof: any) => prof.id === p.user_id) || {};
          
          return {
            user_id: p.user_id,
            name: profile.full_name || profile.first_name || 'Anonymous Peer',
            role: profile.title || 'Student Builder',
            loc: profile.location || profile.country || 'Remote',
            status: p.status || 'Offline',
            avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'Anonymous')}&background=random`
          };
        });

        // Optional: sort Online/In Session first
        mergedPeers.sort((a: any, b: any) => {
          if (a.status === b.status) return 0;
          if (a.status === 'Online' || a.status === 'In Session') return -1;
          return 1;
        });

        setPeers(mergedPeers);
      } catch (err) {
        console.error("Failed to load peers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeers();
  }, []);

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Cohort Peers</h1>
          <p className="text-sm text-gray-500 mt-1">Network, collaborate, and learn alongside your fellow builders.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-medium">Loading your peers...</div>
      ) : peers.length === 0 ? (
        <div className="py-20 text-center text-gray-400 font-medium">No peers found in your current cohorts.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {peers.map((peer, i) => (
            <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm text-center group hover:-translate-y-1 transition-transform relative">
              <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${peer.status === 'Online' ? 'bg-emerald-500' : peer.status === 'In Session' ? 'bg-amber-500' : 'bg-gray-300'}`} title={peer.status}></div>
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden border border-gray-100 shadow-sm">
                 <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 truncate px-2">{peer.name}</h3>
              <p className="text-sm text-[#146ef5] font-medium mb-1 truncate px-2">{peer.role}</p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-6 truncate px-2">
                <MapPinIcon className="w-3 h-3 shrink-0"/> {peer.loc}
              </p>
              
              <button 
                onClick={() => window.location.href = `/dashboard/messages?user=${peer.user_id}`}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4"/> Message
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
