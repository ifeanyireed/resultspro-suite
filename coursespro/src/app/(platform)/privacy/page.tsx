import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconLock, IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'Privacy Policy | CoursesPRO',
  description: 'Privacy Policy describing how personal information and learner data are handled on the CoursesPRO platform.',
};

export default function PlatformPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      <Navbar isPlatform={true} />

      <article className="flex-1">
        <section
          style={{
            background: 'var(--color-nets-navy-dark, #0B1021)',
            paddingTop: '8rem',
            paddingBottom: '4rem',
            color: '#ffffff',
          }}
        >
          <div className="container-nets max-w-4xl mx-auto px-4 sm:px-6">
            <Link
              href="/login"
              className="inline-flex items-center text-xs uppercase tracking-widest text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
            <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-emerald-400">
              <IconLock className="w-4 h-4" />
              <span>Platform Data Protection</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3"
              style={{ lineHeight: 1.15 }}
            >
              Privacy <span className="text-emerald-400">Policy</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              How CoursesPRO protects personal information, secures academic data, and maintains multi-tenant isolation.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white border-b border-gray-200">
          <div className="container-nets max-w-4xl mx-auto px-4 sm:px-6">
            <div className="prose prose-slate max-w-none text-slate-700 space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 text-xs sm:text-sm text-slate-500">
                <span>CoursesPRO &bull; ResultsPRO Suite</span>
                <span>Last Updated: <strong>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
              </div>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">1. Scope of This Policy</h2>
                <p className="leading-relaxed text-slate-600">
                  This Privacy Policy applies to personal data processed by CoursesPRO (part of the ResultsPRO suite). It details how data collected through our applications is stored, safeguarded, and respected.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">2. Tenant Isolation & Student Protection</h2>
                <p className="leading-relaxed text-slate-600">
                  Each school or organization on CoursesPRO operates within an isolated tenant partition. Student records, grades, submissions, and communications are restricted to authorized users within that organization. We do not sell student data, share student profiles across tenants, or serve targeted third-party advertising.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">3. Information Security</h2>
                <p className="leading-relaxed text-slate-600">
                  We employ rigorous technical safeguards, including TLS encryption in transit, strict database access controls, encrypted backups, and continuous security auditing to prevent unauthorized data access or disclosure.
                </p>
              </section>

              <section className="pt-6 border-t border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">4. Contact & Inquiries</h2>
                <p className="leading-relaxed text-slate-600">
                  For privacy questions or data protection inquiries, contact our team at <a href="mailto:hello@resultspro.ng" className="text-emerald-600 hover:underline">hello@resultspro.ng</a>.
                </p>
              </section>
            </div>
          </div>
        </section>
      </article>

      <Footer isPlatform={true} />
    </main>
  );
}
