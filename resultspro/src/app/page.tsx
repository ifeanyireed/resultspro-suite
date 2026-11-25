import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import { IconBook, IconBrain, IconTrophy, IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Services Grid (6 AI Pillars) */}
      <section className="section-py bg-light">
        <div className="container-nets">
          <MotionRise style={{ marginBottom: '4rem', maxWidth: '720px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>6 Major AI Pillars + Connected Trio</div>
            <h2 className="text-d4 fw-400">More Than Result Processing — An Academic Intelligence Engine.</h2>
          </MotionRise>
          
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '1. AI Marksheet OCR & Roster Sync',
                exams: 'Snap multi-page handwritten marksheets. AI extracts scores and fuzzy-matches student names against CampusPRO with mandatory teacher approval.',
              },
              {
                title: '2. Pre-Publication AI Result Auditor',
                exams: 'Automatically flags missing CA scores, duplicate student records, max-score overflows, attendance conflicts, and >25% historical swings.',
              },
              {
                title: '3. AI Teacher & Principal Remarks',
                exams: 'Drafts personalized report-card narratives in Encouraging, Corrective, Developmental, or Celebratory tones using real student performance.',
              },
              {
                title: '4. Multi-Campus Performance Intelligence',
                exams: 'Compare Ikeja, Lekki, and Abuja campuses. Ask natural-language questions backed by verifiable figures and AI promotion forecasts.',
              },
              {
                title: '5. AI Parent Result Interpretation',
                exams: 'Explains each child’s academic trajectory in plain language, answers parent questions, and recommends targeted home study plans.',
              },
              {
                title: '6. ClassroomPRO Closed-Loop Learning',
                exams: 'Connects terminal grade drops directly to ClassroomPRO’s multi-year topic mastery history, NERDC notes, AI stories, flashcards, and quizzes.',
              },
            ].map((cat, i) => (
              <div key={i} className="card p-8 bg-white">
                <IconBrain className="w-8 h-8 text-red mb-6" />
                <h3 className="text-xl fw-600 mb-2">{cat.title}</h3>
                <p className="text-muted text-sm mb-6">{cat.exams}</p>
                <Link href="/dashboard" className="nav-link text-navy" style={{ color: 'var(--color-nets-navy)' }}>
                  Explore in Live Console &rarr;
                </Link>
              </div>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* Why ResultsPRO (Connected Trio Architecture) */}
      <section className="section-py bg-white border-y border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <MotionRise>
              <div className="overline" style={{ marginBottom: '1rem' }}>The Connected Trio Architecture</div>
              <h2 className="text-d3 fw-300 mb-6">CampusPRO · ClassroomPRO · ResultsPRO</h2>
              <p className="text-body-lg text-muted mb-8">
                Clear system-of-record boundaries: CampusPRO owns the multi-campus structure and official examination score ledger; ClassroomPRO retains multi-year learning attempts and topic gaps; ResultsPRO processes deterministic broadsheets and AI performance intelligence.
              </p>
              
              <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[ 
                  { title: 'AI Results-Processing Officer', reward: 'Automated end-of-term readiness copilot', icon: IconUserPlus },
                  { title: '100% Deterministic Arithmetic', reward: 'Zero AI guesswork in totals, grades & ranks', icon: IconBrain },
                  { title: 'Multi-Campus Isolation', reward: 'Built-in campus scoping & group rollup', icon: IconTrophy },
                  { title: 'Traceable Score Provenance', reward: 'ClassroomPRO & OCR audit trails in CampusPRO', icon: IconBook },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center text-red shrink-0">
                      <item.icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                    </div>
                    <div>
                      <h4 className="fw-600">{item.title}</h4>
                      <p className="text-sm text-muted">{item.reward}</p>
                    </div>
                  </div>
                ))}
              </MotionStagger>
              <Link href="/dashboard" className="btn btn-navy">Launch AI Results Console</Link>
            </MotionRise>
            
            <MotionRise delay={0.15} className="relative">
              <img src="/photo13.jpeg" alt="Students learning" className="rounded-sm shadow-card-lg" />
            </MotionRise>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-py bg-navy text-white text-center">
        <MotionRise className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">From Manual Score Entry to Intelligent Academic Reporting</h2>
          <p className="text-body-lg text-muted-light mb-10">
            Experience the 9-step webinar demonstration showing how Nigerian schools transform end-of-term result processing with AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="btn btn-red btn-lg">Watch Interactive Webinar Demo</Link>
            <Link href="/login" className="btn btn-outline-white btn-lg">Sign In</Link>
          </div>
        </MotionRise>
      </section>

      <Footer />
    </main>
  );
}
