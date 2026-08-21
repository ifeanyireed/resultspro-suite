'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { IconBook as BookOpen, IconCircleCheck as CheckCircle2, IconClock as Clock, IconUpload as Upload, IconLink2 as Link2, IconMessageSquare as MessageSquare, IconStar as Star, IconSparkles as Sparkles, IconArrowRight as ArrowRight, IconExternalLink as ExternalLink } from '@tabler/icons-react';
import { mockProjects } from '@/lib/data';

export default function ProjectsPage() {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Stage 03 • Projects & Submissions"
        subtitle="Deliver production-ready implementations against structured rubrics"
      />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {mockProjects.map((project) => (
          <div key={project.id} className="bg-surface rounded-2xl border border-line p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="mono text-xs font-bold uppercase text-signal">Stage {project.stageNumber} Project</span>
                <h3 className="font-grotesk font-bold text-xl text-ink mt-1">{project.title}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mono ${
                  project.status === 'MENTOR_REVIEW'
                    ? 'bg-amber-soft text-amber border border-amber/20'
                    : 'bg-signal-soft text-signal border border-signal/20'
                }`}
              >
                {project.status.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs text-ink-soft leading-relaxed">{project.description}</p>

            {/* Deliverables & Rubric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-surface2 rounded-xl p-5 border border-line space-y-3">
                <h4 className="font-bold text-xs uppercase mono text-ink-faint">Required Deliverables</h4>
                <ul className="space-y-2 text-xs text-ink">
                  {project.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-growth flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface2 rounded-xl p-5 border border-line space-y-3">
                <h4 className="font-bold text-xs uppercase mono text-ink-faint">Evaluation Rubric</h4>
                <div className="space-y-2 text-xs">
                  {project.rubric.map((r, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-line/60">
                      <span className="text-ink font-medium">{r.criterion}</span>
                      <span className="mono font-bold text-signal">{r.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mentor Feedback Display if present */}
            {project.mentorFeedback && (
              <div className="p-5 bg-signal-soft/40 border border-signal/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={project.mentorFeedback.avatar}
                      alt={project.mentorFeedback.mentorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-ink">{project.mentorFeedback.mentorName}</h5>
                      <p className="text-[10px] text-ink-faint">{project.mentorFeedback.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-xs text-ink">
                    <Star className="w-3.5 h-3.5 fill-amber text-amber" />
                    <span>{project.mentorFeedback.rating} / 5.0</span>
                  </div>
                </div>
                <p className="text-xs text-ink-soft italic">"{project.mentorFeedback.comment}"</p>
              </div>
            )}

            {/* Submission Form */}
            <div className="pt-4 border-t border-line">
              <h4 className="font-bold text-xs text-ink mb-2">Submit Project Repository or Figma Prototype</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Link2 className="w-4 h-4 text-ink-faint absolute left-3 top-2.5" />
                  <input
                    type="url"
                    placeholder="https://github.com/your-username/repo-name or Figma Link"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-surface2 border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-signal/20"
                  />
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  className="bg-signal text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-signal-light transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{submitted ? 'Submitted to Mentor Queue!' : 'Submit for Review'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
