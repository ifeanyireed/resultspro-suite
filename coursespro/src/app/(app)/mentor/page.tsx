'use client';

import React, { useState } from 'react';
import { IconCertificate as GraduationCap, IconCircleCheck as CheckCircle2, IconCircleX as XCircle, IconVideo as Video, IconSparkles as Sparkles, IconAlertTriangle as AlertTriangle, IconSend as Send, IconExternalLink as ExternalLink } from '@tabler/icons-react';

export default function MentorPage() {
  const [reviews, setReviews] = useState([
    {
      id: 'sub-1',
      student: 'Tunde Bakare',
      avatar: '/avatars/character19.jpg',
      project: 'ResultsPRO Assessment Engine',
      stage: 'Stage 03',
      repoUrl: 'https://github.com/ifeanyireed/resultspro_suite',
      submittedAt: '2 hours ago',
      status: 'PENDING',
    },
    {
      id: 'sub-2',
      student: 'Fatima Ibrahim',
      avatar: '/avatars/character16.jpg',
      project: 'Multiplayer CBT Battle Arena',
      stage: 'Stage 03',
      repoUrl: 'https://github.com/ifeanyireed/resultspro_suite',
      submittedAt: '4 hours ago',
      status: 'PENDING',
    },
  ]);

  const [feedback, setFeedback] = useState('');

  const handleReviewAction = (id: string, action: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    alert(`Submission marked as ${action}!`);
  };

  return (
    <div className="flex-1 flex flex-col">
      

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Mentor Health Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-xl border border-line p-5 shadow-sm">
            <span className="mono text-[10px] font-bold uppercase text-ink-faint">Pending Reviews</span>
            <p className="text-2xl font-bold font-grotesk text-ink mt-1">{reviews.length} Submissions</p>
            <p className="text-xs text-amber mt-1">Average turnaround: 3.2 hours</p>
          </div>

          <div className="bg-surface rounded-xl border border-line p-5 shadow-sm">
            <span className="mono text-[10px] font-bold uppercase text-ink-faint">At-Risk Alerts</span>
            <p className="text-2xl font-bold font-grotesk text-growth mt-1">0 Students</p>
            <p className="text-xs text-ink-soft mt-1">100% active sprint engagement</p>
          </div>

          <div className="bg-surface rounded-xl border border-line p-5 shadow-sm">
            <span className="mono text-[10px] font-bold uppercase text-ink-faint">AI Assistance</span>
            <p className="text-2xl font-bold font-grotesk text-signal mt-1">Ready</p>
            <p className="text-xs text-signal mt-1">One-click rubric & scenario drafting</p>
          </div>
        </div>

        {/* Pending Submissions Queue */}
        <div className="space-y-4">
          <h3 className="font-grotesk font-bold text-base text-ink">Pending Student Submissions</h3>

          {reviews.length > 0 ? (
            reviews.map((sub) => (
              <div key={sub.id} className="bg-surface rounded-2xl border border-line p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={sub.avatar} alt={sub.student} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-ink">{sub.student}</h4>
                      <p className="text-xs text-ink-soft">{sub.project} • {sub.stage}</p>
                    </div>
                  </div>
                  <span className="mono text-xs text-ink-faint">{sub.submittedAt}</span>
                </div>

                <div className="bg-surface2 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-ink-soft">Repository Link:</span>
                  <a
                    href={sub.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-signal font-bold flex items-center hover:underline"
                  >
                    <span>{sub.repoUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-ink">Mentor Feedback & Critique</label>
                  <textarea
                    rows={3}
                    placeholder="Provide actionable code critique or attach a video review link..."
                    className="w-full bg-surface2 border border-line rounded-lg p-3 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-signal/20"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    onClick={() => handleReviewAction(sub.id, 'Revision Requested')}
                    className="px-4 py-2 border border-amber/40 text-amber rounded-lg font-bold text-xs hover:bg-amber-soft transition-colors flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>
                  <button
                    onClick={() => handleReviewAction(sub.id, 'Approved')}
                    className="px-5 py-2 bg-growth text-white rounded-lg font-bold text-xs hover:bg-growth/90 transition-colors flex items-center space-x-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Unlock Stage</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 bg-surface rounded-2xl border border-line text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-growth mx-auto" />
              <h4 className="font-bold text-sm text-ink">All submissions reviewed!</h4>
              <p className="text-xs text-ink-soft">New cohort submissions will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
