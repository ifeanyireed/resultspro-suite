'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { IconPlayCircle as PlayCircle, IconSparkles as Sparkles, IconBookOpen as BookOpen, IconHelpCircle as HelpCircle, IconCheckCircle2 as CheckCircle2, IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight, IconSend as Send, IconAward as Award } from '@tabler/icons-react';
import Link from 'next/link';

export default function LessonPlayerPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'ai' | 'quiz'>('content');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const quiz = {
    question: 'How do goroutines achieve lightweight concurrency compared to traditional operating system threads?',
    options: [
      'They allocate 2MB of stack space per thread directly in kernel space.',
      'They use dynamic segmented stacks starting at only 2KB and are multiplexed onto OS threads by the Go runtime scheduler.',
      'They disable garbage collection during execution.',
      'They execute exclusively on a single CPU core without preemption.',
    ],
    correctIndex: 1,
    explanation: 'Goroutines begin with a 2KB stack that grows and shrinks dynamically, enabling millions of concurrent routines with minimal RAM consumption.',
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Stage 02 • Practical Application"
        subtitle="High-Performance API Design with Go & GORM"
      />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Back Link */}
        <Link
          href="/journey"
          className="inline-flex items-center text-xs font-bold text-ink-soft hover:text-ink space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journey Map</span>
        </Link>

        {/* Video / Interactive Media Player Header */}
        <div className="bg-ink rounded-2xl overflow-hidden aspect-video max-h-96 relative flex items-center justify-center text-white shadow-md">
          <div className="text-center space-y-3 z-10">
            <button className="w-16 h-16 rounded-full bg-signal text-white flex items-center justify-center mx-auto hover:scale-105 transition-transform shadow-lg shadow-signal/40">
              <PlayCircle className="w-8 h-8" />
            </button>
            <div>
              <h3 className="font-grotesk font-bold text-lg">Watch: High-Performance Go REST API Architecture</h3>
              <p className="text-xs text-ink-faint">Video Duration: 24 mins • Recorded with Dr. Adeyemi</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-line space-x-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3 flex items-center space-x-1.5 transition-colors border-b-2 ${
              activeTab === 'content'
                ? 'border-signal text-signal'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lesson Text & Code</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-3 flex items-center space-x-1.5 transition-colors border-b-2 ${
              activeTab === 'ai'
                ? 'border-signal text-signal'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            <Sparkles className="w-4 h-4 text-signal" />
            <span>AI Executive Summary & Reflection</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-3 flex items-center space-x-1.5 transition-colors border-b-2 ${
              activeTab === 'quiz'
                ? 'border-signal text-signal'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-ember" />
            <span>Bloom's Taxonomy Quiz (1 Question)</span>
          </button>
        </div>

        {/* Tab Content 1: Lesson Content */}
        {activeTab === 'content' && (
          <div className="bg-surface rounded-2xl border border-line p-8 shadow-sm space-y-6 text-xs leading-relaxed text-ink-soft">
            <h3 className="font-grotesk font-bold text-lg text-ink">Decoupled Microservice Architecture in Go</h3>
            <p>
              In high-concurrency educational platforms like ResultsPRO, each domain service (e.g. Assessment Engine, CBT Test Runner, Tutoring Marketplace) maintains dedicated database connection pooling while authenticating through a unified identity authority.
            </p>

            <div className="bg-surface2 rounded-xl p-4 font-mono text-[11px] text-ink border border-line">
              <span className="text-signal font-bold">// GORM MySQL Connection Pooling</span>
              <br />
              db, err := gorm.Open(mysql.Open(dsn), &gorm.Config&#123;&#125;)
              <br />
              sqlDB, _ := db.DB()
              <br />
              sqlDB.SetMaxIdleConns(10)
              <br />
              sqlDB.SetMaxOpenConns(100)
            </div>

            <p>
              By leveraging connection pooling and standardizing on REST introspection endpoints (<code>POST /auth/introspect</code>), each microservice eliminates local credential storage and guarantees Zero-PII compliance across all sub-apps.
            </p>
          </div>
        )}

        {/* Tab Content 2: AI Summary */}
        {activeTab === 'ai' && (
          <div className="bg-surface rounded-2xl border border-line p-8 shadow-sm space-y-6">
            <div className="p-4 bg-signal-soft rounded-xl border border-signal/20 space-y-2">
              <div className="flex items-center space-x-2 text-signal font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Lesson Digest</span>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Key takeaway: Go's runtime scheduler multiplexes M goroutines onto N OS threads. Combined with GORM connection pooling and JWT token introspection, this enables 10,000+ simultaneous parent result card queries without database bottlenecking.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-ink">Mentor Reflection Prompt:</h4>
              <p className="text-xs text-ink-soft">
                How does separating the result calculation engine from the central identity database improve fault tolerance during term-end traffic spikes?
              </p>
              <textarea
                rows={4}
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                placeholder="Type your reflection here to submit to your mentor..."
                className="w-full bg-surface2 border border-line rounded-lg p-3 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-signal/20"
              ></textarea>
              <button
                onClick={() => setReflectionSaved(true)}
                className="bg-signal text-white px-4 py-2 rounded-md font-bold text-xs hover:bg-signal-light transition-colors flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{reflectionSaved ? 'Reflection Saved!' : 'Submit to Mentor'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 3: Quiz Runner */}
        {activeTab === 'quiz' && (
          <div className="bg-surface rounded-2xl border border-line p-8 shadow-sm space-y-6">
            <div>
              <span className="mono text-[10px] font-bold uppercase text-ember bg-ember-soft px-2.5 py-1 rounded-full">
                BLOOM LEVEL: ANALYSIS
              </span>
              <h4 className="font-grotesk font-bold text-base text-ink mt-3">
                {quiz.question}
              </h4>
            </div>

            <div className="space-y-3">
              {quiz.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === quiz.correctIndex;

                let borderClasses = 'border-line hover:border-signal/40 bg-surface2/50';
                if (quizSubmitted) {
                  if (isCorrect) {
                    borderClasses = 'border-growth bg-growth-soft/50 text-growth';
                  } else if (isSelected && !isCorrect) {
                    borderClasses = 'border-rose bg-rose-soft/50 text-rose';
                  }
                } else if (isSelected) {
                  borderClasses = 'border-signal bg-signal-soft/40';
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all ${borderClasses}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="mono font-bold text-ink-faint">0{idx + 1}</span>
                      <span className="text-ink">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="p-4 bg-surface2 rounded-xl border border-line text-xs space-y-1">
                <span className="font-bold text-ink">Explanation:</span>
                <p className="text-ink-soft">{quiz.explanation}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              {!quizSubmitted ? (
                <button
                  disabled={selectedAnswer === null}
                  onClick={() => setQuizSubmitted(true)}
                  className="bg-signal text-white px-6 py-2.5 rounded-md font-bold text-xs hover:bg-signal-light transition-all disabled:opacity-50"
                >
                  Verify Answer
                </button>
              ) : (
                <Link
                  href="/projects"
                  className="bg-growth text-white px-6 py-2.5 rounded-md font-bold text-xs hover:bg-growth/90 transition-all flex items-center space-x-1.5"
                >
                  <span>Proceed to Stage 03 Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
