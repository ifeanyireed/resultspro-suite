'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { IconUsers2 as Users2, IconHeartHandshake as HeartHandshake, IconMessageSquare as MessageSquare, IconExternalLink as ExternalLink, IconSparkles as Sparkles } from '@tabler/icons-react';
import { mockPeers } from '@/lib/data';

export default function PeersPage() {
  const activePair = mockPeers.find((p) => p.isPair);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Peer Directory & Collaboration"
        subtitle="Sprint peer pairing, joint submissions, and pre-mentor code critiques"
      />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Active Peer Pairing Banner */}
        {activePair && (
          <div className="bg-surface rounded-2xl border border-signal p-6 shadow-sm ring-2 ring-signal/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-signal-soft text-signal flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="mono text-[10px] font-bold uppercase text-signal">Assigned Sprint Pair</span>
                <h3 className="font-grotesk font-bold text-lg text-ink mt-0.5">
                  You & {activePair.name}
                </h3>
                <p className="text-xs text-ink-soft mt-1">
                  Collaborating on <strong>Stage 03: Projects</strong> • Next joint review tomorrow at 2:00 PM WAT
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-signal text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-signal-light transition-colors flex items-center justify-center space-x-1.5 shadow-sm">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Pair Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* Peer Directory Roster */}
        <div className="space-y-4">
          <h3 className="font-grotesk font-bold text-base text-ink">Cohort Member Roster</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPeers.map((peer) => (
              <div key={peer.id} className="bg-surface rounded-2xl border border-line p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={peer.avatar} alt={peer.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-ink">{peer.name}</h4>
                      <p className="text-xs text-ink-soft">{peer.role}</p>
                    </div>
                  </div>
                  <span className="mono text-[10px] font-bold text-ink-faint px-2 py-0.5 rounded-full bg-surface2 border border-line">
                    {peer.timezone}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {peer.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="mono text-[10px] font-semibold px-2 py-0.5 rounded bg-surface2 text-ink-soft border border-line/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-line text-xs">
                  <span className="text-ink-faint text-[11px]">{peer.currentStage}</span>
                  <button className="font-bold text-signal hover:underline">Inspect Submissions</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
