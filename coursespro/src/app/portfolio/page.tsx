'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { IconBriefcase as Briefcase, IconExternalLink as ExternalLink, IconGithub as Github, IconCircleCheck as CheckCircle2, IconStar as Star, IconAward as Award } from '@tabler/icons-react';
import { mockPortfolio } from '@/lib/data';

export default function PortfolioPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Public Employer Portfolio"
        subtitle="Stage 07 • Verified project case studies and mentor endorsements"
      />

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Profile Card */}
        <div className="bg-surface rounded-2xl border border-line p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-signal text-white flex items-center justify-center font-grotesk font-bold text-xl shadow-md shadow-signal/30">
              AR
            </div>
            <div>
              <h3 className="font-grotesk font-bold text-xl text-ink">Alex Reed</h3>
              <p className="text-xs text-ink-soft">Fullstack Systems Engineer • Verified BuilderOS Graduate</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-growth-soft text-growth text-[10px] font-bold">
                  AVAILABLE FOR HIRE
                </span>
                <span className="mono text-[10px] text-ink-faint">Lagos, Nigeria (WAT)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="bg-signal text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-signal-light transition-colors shadow-sm">
              Copy Public Share Link
            </button>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-6">
          <h4 className="font-grotesk font-bold text-base text-ink">Verified Production Case Studies</h4>

          {mockPortfolio.map((item) => (
            <div key={item.id} className="bg-surface rounded-2xl border border-line p-6 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="mono text-[10px] font-bold uppercase text-signal">{item.category}</span>
                  <h4 className="font-grotesk font-bold text-lg text-ink mt-0.5">{item.title}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-surface2 border border-line text-ink-soft hover:text-ink transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-signal text-white font-bold text-xs hover:bg-signal-light transition-colors"
                  >
                    <span>Live Architecture Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-ink-soft leading-relaxed">{item.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {item.techStack.map((t, i) => (
                  <span
                    key={i}
                    className="mono text-[10px] font-semibold px-2.5 py-1 rounded-md bg-surface2 text-ink-soft border border-line"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {item.endorsement && (
                <div className="p-4 bg-growth-soft/40 border border-growth/20 rounded-xl flex items-start space-x-3 text-xs">
                  <Star className="w-4 h-4 text-growth fill-growth flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-growth">Lead Mentor Endorsement:</span>
                    <p className="text-ink-soft mt-0.5 italic">"{item.endorsement}"</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
