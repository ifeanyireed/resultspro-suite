'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { IconStack2 as Layers, IconCircleCheck as CheckCircle2, IconLock as Lock, IconPlayCircle as PlayCircle, IconClock as Clock, IconBook as BookOpen, IconSparkles as Sparkles, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { mockJourneyStages } from '@/lib/data';

export default function JourneyPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="7-Stage Learning Journey"
        subtitle="Progress from Foundational Knowledge to Public Employer Portfolio"
      />

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Journey Progress Bar */}
        <div className="bg-surface rounded-2xl border border-line p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="mono text-xs font-bold uppercase text-signal">Cohort Pathway</span>
              <h3 className="font-grotesk font-bold text-xl text-ink mt-0.5">
                Fullstack Systems & Distributed Microservices
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold font-grotesk text-ink">42%</span>
              <p className="text-[11px] text-ink-faint">Stage 02 of 07 In Progress</p>
            </div>
          </div>

          <div className="w-full bg-line rounded-full h-2 overflow-hidden">
            <div className="bg-signal h-2 rounded-full" style={{ width: '42%' }}></div>
          </div>
        </div>

        {/* 7 Stages Chronological Stack */}
        <div className="space-y-6">
          {mockJourneyStages.map((stage) => {
            const isCompleted = stage.status === 'COMPLETED';
            const isInProgress = stage.status === 'IN_PROGRESS';
            const isLocked = stage.status === 'LOCKED';

            return (
              <div
                key={stage.id}
                className={`bg-surface rounded-2xl border transition-all shadow-sm overflow-hidden ${
                  isInProgress
                    ? 'border-signal ring-2 ring-signal/10'
                    : isCompleted
                    ? 'border-growth/40'
                    : 'border-line opacity-75'
                }`}
              >
                {/* Stage Header */}
                <div className="p-6 flex items-start justify-between border-b border-line bg-surface2/30">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-grotesk font-bold text-sm ${
                        isCompleted
                          ? 'bg-growth text-white'
                          : isInProgress
                          ? 'bg-signal text-white'
                          : 'bg-line text-ink-faint'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stage.number}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-grotesk font-bold text-lg text-ink">{stage.title}</h4>
                        {isInProgress && (
                          <span className="px-2 py-0.5 rounded-full bg-signal-soft text-signal text-[10px] font-bold">
                            CURRENT STAGE
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-growth-soft text-growth text-[10px] font-bold">
                            COMPLETED
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-0.5 rounded-full bg-surface2 text-ink-faint text-[10px] font-bold flex items-center space-x-1 border border-line">
                            <Lock className="w-3 h-3" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-soft mt-1">{stage.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Modules List */}
                {stage.modules.length > 0 ? (
                  <div className="divide-y divide-line p-2">
                    {stage.modules.map((mod) => (
                      <div
                        key={mod.id}
                        className="p-4 flex items-center justify-between hover:bg-surface2/50 rounded-xl transition-colors"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              mod.completed ? 'bg-growth-soft text-growth' : 'bg-signal-soft text-signal'
                            }`}
                          >
                            {mod.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-ink">{mod.title}</h5>
                            <div className="flex items-center space-x-3 text-[11px] text-ink-faint mt-0.5">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{mod.duration}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{mod.readingsCount} Readings</span>
                              </span>
                              {mod.hasQuiz && (
                                <span className="text-signal font-semibold">Quiz Included</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/journey/${mod.id}`}
                          className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1 transition-all ${
                            mod.completed
                              ? 'bg-surface2 text-ink hover:bg-line'
                              : 'bg-signal text-white hover:bg-signal-light shadow-sm'
                          }`}
                        >
                          <span>{mod.completed ? 'Review' : 'Start Lesson'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-ink-faint">
                    <Lock className="w-5 h-5 mx-auto mb-1 text-ink-faint" />
                    <span>Unlocks upon successful mentor evaluation of preceding stage projects.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
