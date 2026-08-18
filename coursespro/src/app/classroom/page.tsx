'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { IconRadio as Radio, IconUsers2 as Users2, IconMic as Mic, IconHeadphones as Headphones, IconVideo as Video, IconMessageSquare as MessageSquare, IconSparkles as Sparkles, IconArrowRight as ArrowRight, IconPlus as Plus } from '@tabler/icons-react';
import { mockPresence } from '@/lib/data';

export default function ClassroomPage() {
  const rooms = [
    {
      id: 'room-1',
      name: 'Sprint Room Alpha',
      type: 'Silent Coworking & Live Code Sync',
      activeCount: 6,
      avatarList: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      ],
    },
    {
      id: 'room-2',
      name: 'Mentor Office Hours Room',
      type: 'Open Audio & Architecture Defense',
      activeCount: 4,
      isMentorHost: true,
      avatarList: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      ],
    },
    {
      id: 'room-3',
      name: 'Figma & UI Review Hall',
      type: 'Screen Share & Critique',
      activeCount: 3,
      avatarList: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Alive Classroom & Voice Rooms"
        subtitle="Real-time ambient presence, open office hours, and collaborative study halls"
      />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Virtual Study Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <div
              key={r.id}
              className={`bg-surface rounded-2xl border p-6 shadow-sm flex flex-col justify-between space-y-5 ${
                r.isMentorHost ? 'border-signal ring-2 ring-signal/10' : 'border-line'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-growth-soft text-growth text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth animate-pulse"></span>
                    <span>ACTIVE NOW</span>
                  </span>
                  <span className="mono text-xs font-bold text-ink-faint">{r.activeCount} In Room</span>
                </div>

                <div>
                  <h4 className="font-grotesk font-bold text-base text-ink">{r.name}</h4>
                  <p className="text-xs text-ink-soft mt-0.5">{r.type}</p>
                </div>

                {/* Avatars Stack */}
                <div className="flex -space-x-2 pt-1">
                  {r.avatarList.map((av, i) => (
                    <img
                      key={i}
                      src={av}
                      alt="Student"
                      className="w-7 h-7 rounded-full border-2 border-surface object-cover"
                    />
                  ))}
                  {r.activeCount > r.avatarList.length && (
                    <div className="w-7 h-7 rounded-full bg-surface2 border-2 border-surface text-[10px] font-bold flex items-center justify-center text-ink-soft">
                      +{r.activeCount - r.avatarList.length}
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full bg-surface2 border border-line text-ink font-bold text-xs py-2 rounded-lg hover:bg-signal hover:text-white hover:border-signal transition-all flex items-center justify-center space-x-1.5">
                <Headphones className="w-3.5 h-3.5" />
                <span>Enter Room</span>
              </button>
            </div>
          ))}
        </div>

        {/* Live Presence Feed Table */}
        <div className="bg-surface rounded-2xl border border-line p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-grotesk font-bold text-base text-ink">Active Cohort Member Presence</h3>
            <span className="mono text-xs text-growth font-semibold">14 Members Online</span>
          </div>

          <div className="divide-y divide-line text-xs">
            {mockPresence.map((user) => (
              <div key={user.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-ink">{user.name}</h5>
                    <p className="text-[11px] text-ink-faint">Currently inside: {user.room}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="px-2.5 py-1 rounded-full bg-signal-soft text-signal font-bold text-[10px]">
                    {user.activity}
                  </span>
                  <button className="px-3 py-1.5 rounded-md bg-surface2 border border-line font-semibold text-ink-soft hover:text-ink hover:border-signal/30 text-xs">
                    Wave / DM
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
