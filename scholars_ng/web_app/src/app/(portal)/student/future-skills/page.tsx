'use client';

import React, { useEffect, useState } from 'react';
import { 
  AiBrain01Icon, 
  Award01Icon, 
  PlayCircle02Icon, 
  StarIcon, 
  CheckmarkCircle02Icon,
  CodeCircleIcon,
  GameIcon
} from 'hugeicons-react';
import api from '@/lib/api';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { CustomizerLeaderboard } from '@puzzlepro/modules';
import { useAppHost } from '@/components/AppHostContext';

function FutureSkillsTracks() {
  const [cohorts, setCohorts] = useState<any[]>([]);

  useEffect(() => {
    api.get('/public/cohorts')
      .then(res => setCohorts(res.data.cohorts || []))
      .catch(err => console.error('Failed to load cohorts:', err));
  }, []);

  if (!cohorts) {
    return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Cohorts...</div>;
  }

  const badges = 3;
  const milestone = "Visual Logic & Algorithms";
  const remaining = 2;

  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Future Skills & Coding Adventures
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Your long-term digital skills journey across coding, AI, and block-based robotics.
          </p>
        </div>
      </header>

      {/* Current Progress & Milestones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        <div>
         <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Active Learning Tracks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 {cohorts.map((c: any) => (
                   <div key={c.id} style={{ border: '1px solid #f1f5f9', borderRadius: '1.25rem', padding: '1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                         <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase' }}>{c.curriculum_track}</span>
                         <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: '0.25rem 0' }}>{c.name}</h4>
                         <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Level {c.current_level} • Mentor: {c.instructor_name}</p>
                      </div>
                      <button style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                         Resume Module
                      </button>
                   </div>
                 ))}
              </div>
          </div>
        </div>

        <div>
           <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', borderRadius: '1.5rem', padding: '1.75rem', color: 'white', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                 <AiBrain01Icon size={24} />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Active Challenge</h3>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{milestone}</div>
              <p style={{ opacity: 0.9, fontSize: '0.85rem', lineHeight: 1.5 }}>
                 {remaining} visual algorithm challenges remaining to unlock your Junior Game Dev badge.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function PuzzleStudioEmbed() {
  return (
    <div style={{ maxWidth: '1200px', margin: '1rem auto 4rem auto' }}>
      <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #f1f5f9', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: '#fffbeb', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#f59e0b' }}>
          <Gamepad01Icon size={32} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>636 Blockly Coding Adventures</h3>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          Solve algorithmic puzzles, program autonomous sprites, dodge obstacles, and unlock worlds 1 through 6.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a
            href="https://puzzlepro.ng"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#f59e0b', color: 'white', textDecoration: 'none', padding: '0.85rem 1.75rem', borderRadius: '1rem', fontWeight: 700, fontSize: '0.95rem', display: 'inline-block' }}
          >
            Launch Fullscreen Studio →
          </a>
        </div>
      </div>
    </div>
  );
}

function FutureSkillsLeaderboardView() {
  return (
    <div style={{ maxWidth: '900px', margin: '1rem auto 4rem auto' }}>
      <CustomizerLeaderboard onClose={() => {}} />
    </div>
  );
}

export default function StudentFutureSkillsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'tracks',
      label: 'Learning Tracks',
      icon: CodeCircleIcon,
      component: FutureSkillsTracks,
    },
    {
      id: 'puzzle-studio',
      label: 'PuzzlePRO Adventures',
      icon: GameIcon,
      component: PuzzleStudioEmbed,
    },
    {
      id: 'leaderboard',
      label: 'School XP Leaderboard',
      icon: Award01Icon,
      component: FutureSkillsLeaderboardView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Future Skills & Coding Path"
      appSubtitle="Algorithmic problem solving, Blockly visual programming, and school coding leaderboards."
      appBadge="PuzzlePRO"
      accentColor="#f59e0b"
      tabs={tabs}
      defaultTabId="tracks"
    />
  );
}
