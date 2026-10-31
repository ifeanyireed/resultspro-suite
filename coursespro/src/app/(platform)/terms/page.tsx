import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconShieldCheck, IconArrowLeft } from '@tabler/icons-react';

export const metadata = {
  title: 'Terms of Service | CoursesPRO',
  description: 'Terms of Service governing the use of the CoursesPRO learning management platform and ecosystem.',
};

export default function PlatformTermsPage() {
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
            <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-blue-400">
              <IconShieldCheck className="w-4 h-4" />
              <span>Platform Legal & Policies</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3"
              style={{ lineHeight: 1.15 }}
            >
              Terms of <span className="text-blue-400">Service</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Terms and conditions governing the use of CoursesPRO by participating institutions, mentors, and students.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white border-b border-gray-200">
          <div className="container-nets max-w-4xl mx-auto px-4 sm:px-6">
            <div className="prose prose-slate max-w-none text-slate-700 space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 text-xs sm:text-sm text-slate-500">
                <span>CoursesPRO &bull; ResultsPRO Suite</span>
                <span>Effective Date: <strong>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
              </div>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
                <p className="leading-relaxed text-slate-600">
                  By accessing or using CoursesPRO (a product of the ResultsPRO Edu Suite), you agree to comply with and be bound by these Terms of Service. If you are registering on behalf of an educational institution or organization, you represent that you have the authority to bind that entity to these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">2. Platform Services & Multi-Tenancy</h2>
                <p className="leading-relaxed text-slate-600">
                  CoursesPRO provides multi-tenant learning infrastructure enabling schools, organizations, and creators to run cohort-based learning, administer assessments, manage peer reviews, and issue credentials. Individual institutions configure their own terms and policies within their respective tenant workspaces.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">3. Account Responsibilities</h2>
                <p className="leading-relaxed text-slate-600">
                  Users are responsible for safeguarding login credentials and for all activities occurring under their accounts. You must notify us immediately of any unauthorized use or security incident.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">4. Intellectual Property</h2>
                <p className="leading-relaxed text-slate-600">
                  The CoursesPRO platform, branding, user interface, software code, and architecture are the exclusive property of ResultsPRO. Course curricula, instructional content, and student work remain the property of their respective creators and institutions.
                </p>
              </section>

              <section className="pt-6 border-t border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">5. Contact Information</h2>
                <p className="leading-relaxed text-slate-600">
                  For inquiries regarding platform terms or enterprise partnerships, please email <a href="mailto:hello@resultspro.ng" className="text-blue-600 hover:underline">hello@resultspro.ng</a> or visit <a href="https://www.resultspro.ng" className="text-blue-600 hover:underline">www.resultspro.ng</a>.
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
