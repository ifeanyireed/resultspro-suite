import Link from 'next/link';
import { IconBuilding, IconTarget, IconHeart, IconGlobe } from '@tabler/icons-react';

export const metadata = {
  title: 'About Us | ResultsPro Edu Suite',
  description: 'Our mission is to build the digital infrastructure for modern African education.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-blue-300 mx-auto">
            <IconBuilding size={16} />
            <span>Company</span>
          </div>
          <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Powering the future of <span style={{ fontWeight: 700, color: 'white' }}>African education.</span>
          </h1>
          <p className="text-body-lg text-white/70 mt-6">
            ResultsPro is building the digital infrastructure that helps schools scale, teachers thrive, and students achieve their absolute potential.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl fw-600 text-navy mb-4">Our Core Values</h2>
            <p className="text-muted text-lg">The principles that guide every line of code we write.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-nets-border">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <IconTarget size={24} />
              </div>
              <h3 className="text-xl fw-600 text-navy mb-3">Impact First</h3>
              <p className="text-muted leading-relaxed">We measure our success by the tangible improvements in student outcomes and school efficiency.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-nets-border">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <IconGlobe size={24} />
              </div>
              <h3 className="text-xl fw-600 text-navy mb-3">Radical Accessibility</h3>
              <p className="text-muted leading-relaxed">High-quality educational tools shouldn't require gigabit internet. We build for the realities of African infrastructure.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-nets-border">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <IconHeart size={24} />
              </div>
              <h3 className="text-xl fw-600 text-navy mb-3">Empathy</h3>
              <p className="text-muted leading-relaxed">We listen deeply to teachers, parents, and school owners to build software that solves actual, painful problems.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
