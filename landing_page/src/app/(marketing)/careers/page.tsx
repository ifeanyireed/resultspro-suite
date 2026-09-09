import Link from 'next/link';
import { IconBriefcase, IconCode, IconHeadset, IconArrowRight } from '@tabler/icons-react';

export const metadata = {
  title: 'Careers | ResultsPro Edu Suite',
  description: 'Join the team building the digital infrastructure for modern African education.',
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-emerald-300 mx-auto">
            <IconBriefcase size={16} />
            <span>Careers at ResultsPro</span>
          </div>
          <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Do the best work of <span style={{ fontWeight: 700, color: 'white' }}>your life.</span>
          </h1>
          <p className="text-body-lg text-white/70 mt-6">
            We are a lean, fast-moving team of engineers, designers, and educators deeply committed to solving hard problems in the education sector.
          </p>
        </div>
      </section>

      {/* Open Roles */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl fw-600 text-navy mb-8">Open Positions</h2>
            
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-nets-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <IconCode size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg fw-600 text-navy">Senior Full-Stack Engineer (Go/Next.js)</h3>
                    <p className="text-sm text-muted">Lagos, Nigeria (Hybrid)</p>
                  </div>
                </div>
                <Link href="mailto:careers@resultspro.ng?subject=Senior Full-Stack Engineer" className="btn btn-outline-white text-sm">
                  Apply Now
                </Link>
              </div>

              <div className="p-6 rounded-2xl border border-nets-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <IconHeadset size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg fw-600 text-navy">School Success Manager</h3>
                    <p className="text-sm text-muted">Abuja, Nigeria (Remote)</p>
                  </div>
                </div>
                <Link href="mailto:careers@resultspro.ng?subject=School Success Manager" className="btn btn-outline-white text-sm">
                  Apply Now
                </Link>
              </div>
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-nets-border text-center">
              <h3 className="text-xl fw-600 text-navy mb-2">Don't see a fit?</h3>
              <p className="text-muted mb-6">We're always looking for exceptional talent. Send your resume and tell us how you can contribute.</p>
              <Link href="mailto:careers@resultspro.ng" className="text-blue-600 fw-600 hover:underline">
                careers@resultspro.ng
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
