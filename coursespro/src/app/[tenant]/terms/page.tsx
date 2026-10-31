import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconShieldCheck, IconArrowLeft } from '@tabler/icons-react';

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);
  return {
    title: tenant?.name ? `Terms of Service | ${tenant.name}` : 'Terms of Service',
    description: `Terms of Service and conditions of use for students, educators, and partners at ${tenant?.name || 'our institution'}.`,
  };
}

export default async function TenantTermsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  const tenantName = tenant.name || 'Institution';
  const contactEmail = tenant.contact_email || 'hello@resultspro.ng';
  const contactPhone = tenant.contact_phone;
  const fullAddress = tenant.full_address;

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      <Navbar
        tenantName={tenant.name}
        tenantLogo={tenant.logo_url}
        darkLogoUrl={tenant.dark_logo_url}
        flattenLogo={tenant.flatten_logo}
        contactEmail={tenant.contact_email}
        contactPhone={tenant.contact_phone}
        contactLocation={tenant.full_address}
      />

      <article className="flex-1">
        {/* Header Section */}
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
              <span>Legal & Policies</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3"
              style={{ lineHeight: 1.15 }}
            >
              Terms of <span className="text-blue-400">Service</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Terms and conditions governing enrollment, participation, and account use at{' '}
              <span className="font-semibold text-white">{tenantName}</span>.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16 bg-white border-b border-gray-200">
          <div className="container-nets max-w-4xl mx-auto px-4 sm:px-6">
            <div className="prose prose-slate max-w-none text-slate-700 space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 text-xs sm:text-sm text-slate-500">
                <span>Tenant: <strong className="text-slate-900">{tenantName}</strong></span>
                <span>Effective Date: <strong>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
              </div>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
                <p className="leading-relaxed text-slate-600">
                  By accessing, browsing, registering for, or enrolling in any learning cohorts, courses, or services operated by{' '}
                  <strong>{tenantName}</strong> (referred to herein as &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Institution&rdquo;) via this portal powered by the ResultsPRO / CoursesPRO learning operating infrastructure, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use this portal.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">2. User Accounts & Security</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  To participate in cohorts and access curriculum materials, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>Provide accurate, current, and complete personal and enrollment information.</li>
                  <li>Maintain the confidentiality and security of your account credentials, login password, and verification tokens.</li>
                  <li>Refrain from sharing, selling, or transferring account access to third parties or non-enrolled students.</li>
                  <li>Promptly notify {tenantName} administration if you discover or suspect any unauthorized breach of your account.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">3. Cohort Enrollment & Academic Conduct</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  Participation in learning programs at {tenantName} is predicated upon mutual respect and academic integrity:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li><strong>Active Participation:</strong> Students are expected to attend scheduled sessions, engage constructively in peer reviews, and complete assigned deliverables.</li>
                  <li><strong>Academic Integrity:</strong> Plagiarism, submission of unauthorized third-party work as your own, or disrupting live cohort sessions will result in disciplinary review, up to and including disqualification without refund.</li>
                  <li><strong>Mentor Interaction:</strong> Direct interaction with mentors and instructors must remain professional and confined to approved educational channels.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">4. Fees, Tuitions & Payments</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  All cohort fees, tuition payments, and curriculum materials are billed in accordance with the published tuition schedule for {tenantName}:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>Payments processed through integrated gateways (e.g., Paystack) are subject to payment provider authorization and bank settlement.</li>
                  <li>Cohort access and credential issuance are contingent upon full and prompt settlement of agreed tuition or installment schedules.</li>
                  <li>Refund policies, if applicable, are governed by {tenantName}&rsquo;s specific cohort refund guidelines communicated prior to program commencement.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">5. Intellectual Property</h2>
                <p className="leading-relaxed text-slate-600">
                  All instructional materials, syllabi, multimedia recordings, slide decks, and proprietary frameworks provided during the program are the intellectual property of <strong>{tenantName}</strong> or its licensors. You are granted a limited, personal, non-exclusive license to use these materials solely for your individual educational advancement. You may not distribute, duplicate, rebroadcast, or commercialize cohort content without explicit prior written authorization.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">6. Platform Infrastructure & Availability</h2>
                <p className="leading-relaxed text-slate-600">
                  This learning portal is hosted on high-availability cloud infrastructure provided by ResultsPRO Edu Suite. While we strive for 99.9% uptime, occasional scheduled maintenance or unexpected technical interruptions may occur. {tenantName} and its infrastructure providers will make commercially reasonable efforts to restore services promptly.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">7. Disclaimers & Limitation of Liability</h2>
                <p className="leading-relaxed text-slate-600">
                  Educational programs and cohorts are delivered to develop practical competency. While {tenantName} equips students with relevant skills and accredited credentials, graduation does not guarantee employment or specific financial outcomes. To the maximum extent permitted by applicable law, neither {tenantName} nor the platform providers shall be liable for indirect, punitive, or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">8. Changes to These Terms</h2>
                <p className="leading-relaxed text-slate-600">
                  {tenantName} reserves the right to amend or update these Terms of Service periodically to reflect operational, educational, or legal developments. Revised terms will become effective upon being published on this page. Continued access following notification constitutes acceptance.
                </p>
              </section>

              <section className="pt-6 border-t border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">9. Contact & Support</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  For questions concerning these Terms of Service, academic policies, or enrollment verification, please contact:
                </p>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm space-y-1.5 text-slate-700">
                  <div><strong>{tenantName}</strong></div>
                  {contactEmail && <div>Email: <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">{contactEmail}</a></div>}
                  {contactPhone && <div>Phone: {contactPhone}</div>}
                  {fullAddress && <div>Address: {fullAddress}</div>}
                </div>
              </section>
            </div>
          </div>
        </section>
      </article>

      <Footer
        tenantName={tenant.name}
        tenantLogo={tenant.logo_url}
        darkLogoUrl={tenant.dark_logo_url}
        flattenLogo={tenant.flatten_logo}
        contactEmail={tenant.contact_email}
        contactPhone={tenant.contact_phone}
        contactLocation={tenant.full_address}
      />
    </main>
  );
}
