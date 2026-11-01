'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalyticsUpIcon, StarIcon, Award01Icon, Activity04Icon, ArrowUp01Icon } from 'hugeicons-react';

const subjectPerformance = [
  { subject: 'Mathematics', score: 92, trend: '+4%', color: '#146ef5' },
  { subject: 'Physics', score: 88, trend: '+2%', color: '#6366f1' },
  { subject: 'Biology', score: 85, trend: '-1%', color: '#10b981' },
  { subject: 'English', score: 90, trend: '+3%', color: '#f59e0b' },
  { subject: 'History', score: 78, trend: '+5%', color: '#8b5cf6' },
  { subject: 'Computer Sci', score: 95, trend: '+2%', color: '#0ea5e9' },
];

export default function StudentProgressPage() {
  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Academic Progress
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Detailed breakdown of your performance, grades, and learning milestones.
        </p>
      </header>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Overall GPA', value: '3.8', icon: <StarIcon />, color: '#146ef5', bg: '#eff6ff' },
          { label: 'Rank', value: '5th / 120', icon: <Award01Icon />, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Attendance', value: '98%', icon: <Activity04Icon />, color: '#10b981', bg: '#f0fdf4' },
          { label: 'Credits', value: '24 / 30', icon: <AnalyticsUpIcon />, color: '#6366f1', bg: '#f5f3ff' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        {/* Subject Breakdown */}
        <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Subject Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {subjectPerformance.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: '#1e293b' }}>{item.subject}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: item.trend.startsWith('+') ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <ArrowUp01Icon size={12} style={{ transform: item.trend.startsWith('+') ? 'none' : 'rotate(180deg)' }} />
                      {item.trend}
                    </span>
                    <span style={{ fontWeight: '800', color: '#1e293b' }}>{item.score}%</span>
                  </div>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: '100%', background: item.color, borderRadius: '4px' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones & Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '2rem', padding: '2rem', color: 'white' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Learning Goals</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { goal: 'Complete Calculus Series', progress: 80 },
                { goal: 'Read 5 Science Journals', progress: 40 },
                { goal: 'Perfect Attendance Week', progress: 100 },
              ].map((goal, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ opacity: 0.9 }}>{goal.goal}</span>
                    <span style={{ fontWeight: '700' }}>{goal.progress}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      style={{ height: '100%', background: '#146ef5', borderRadius: '2px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
              Set New Goal
            </button>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Certificates</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ flex: 1, aspectRatio: '1', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Award01Icon size={24} color="#cbd5e1" />
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>
              Earn 2 more badges to unlock the &quot;Scholar&quot; achievement!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
