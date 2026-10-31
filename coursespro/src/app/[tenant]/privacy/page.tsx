import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconLock, IconArrowLeft } from '@tabler/icons-react';

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);
  return {
    title: tenant?.name ? `Privacy Policy | ${tenant.name}` : 'Privacy Policy',
    description: `Privacy policy detailing how student data, academic records, and personal information are collected and protected at ${tenant?.name || 'our institution'}.`,
  };
}

export default async function TenantPrivacyPage({ params }: { params: Promise<{ tenant: string }> }) {
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
            <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-emerald-400">
              <IconLock className="w-4 h-4" />
              <span>Data Protection & Privacy</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3"
              style={{ lineHeight: 1.15 }}
            >
              Privacy <span className="text-emerald-400">Policy</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              How student information, academic credentials, and personal data are collected, protected, and used at{' '}
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
                <span>Last Updated: <strong>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
              </div>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">1. Overview & Commitment</h2>
                <p className="leading-relaxed text-slate-600">
                  At <strong>{tenantName}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Institution&rdquo;), we take learner privacy and data confidentiality with the utmost seriousness. This Privacy Policy details the types of personal data we collect through this learning management portal, how it is safeguarded, and your rights concerning your educational records.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  In order to manage your cohort enrollment, deliver coursework, and record academic evaluations, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li><strong>Identity & Account Data:</strong> Full legal name, email address, phone number, profile avatar, and account credentials.</li>
                  <li><strong>Cohort & Learning Activity:</strong> Attendance records, live class engagement, assignment submissions, peer reviews, mentor feedback, and milestone progress.</li>
                  <li><strong>Transaction & Tuition Data:</strong> Payment timestamps, amounts, payment reference identifiers, and cohort enrollment tiers (we do not store raw card numbers; financial transactions are processed by PCI-DSS compliant providers like Paystack).</li>
                  <li><strong>Technical Log Data:</strong> Device browser type, IP address, login timestamps, and session diagnostics to maintain service reliability and secure against fraud.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">3. How Your Information Is Used</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  {tenantName} uses your information strictly for legitimate educational, administrative, and communicative purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>To register and administer cohort access, workshops, and mentor office hours.</li>
                  <li>To evaluate student projects, compute grades, and issue verified completion credentials.</li>
                  <li>To communicate vital program announcements, schedule adjustments, or system security notices.</li>
                  <li>To prevent academic dishonesty, unapproved multi-user account sharing, and unauthorized system access.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">4. Strict Student Data Isolation & Non-Sale</h2>
                <p className="leading-relaxed text-slate-600">
                  We maintain a zero-tolerance policy against the commercialization of student data. <strong>{tenantName} never sells, rents, or monetizes student records, contact details, or learning metrics to third-party advertisers or data brokers under any circumstances.</strong> Student data is isolated within {tenantName}&rsquo;s secure multi-tenant partition on the ResultsPRO cloud infrastructure.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">5. Data Security & Storage</h2>
                <p className="leading-relaxed text-slate-600">
                  Your information is safeguarded through multiple layers of defense:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>End-to-end encryption in transit via TLS 1.3 cryptographic protocols.</li>
                  <li>Encryption at rest for academic and credential databases.</li>
                  <li>Role-based access control (RBAC), ensuring only authorized instructional staff and administrators can access relevant student records.</li>
                  <li>Continuous vulnerability monitoring and automated security backups.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">6. Cookies & Session Storage</h2>
                <p className="leading-relaxed text-slate-600">
                  We use secure authentication cookies and local browser storage to keep you signed in, remember your cohort context, and preserve your UI preferences. We do not use third-party behavioral advertising cookies on this portal.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">7. Your Rights & Data Access</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  As an enrolled student or guardian, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>Review the personal data held about you by {tenantName}.</li>
                  <li>Request correction of inaccurate biographical or contact records.</li>
                  <li>Request deletion or archiving of your account upon program graduation (subject to required academic record retention laws).</li>
                </ul>
              </section>

              <section className="pt-6 border-t border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">8. Contact Our Data Protection Officer</h2>
                <p className="leading-relaxed text-slate-600 mb-3">
                  For privacy inquiries, data subject access requests, or security reports, please contact:
                </p>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm space-y-1.5 text-slate-700">
                  <div><strong>{tenantName} &ndash; Privacy & Data Protection</strong></div>
                  {contactEmail && <div>Email: <a href={`mailto:${contactEmail}`} className="text-emerald-600 hover:underline">{contactEmail}</a></div>}
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
