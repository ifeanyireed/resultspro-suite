'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTenant } from '@/components/TenantProvider';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';

export default function ForgotPasswordPage() {
  const { tenant } = useTenant();
  const schoolName = tenant?.name || 'Greenwood High Academy';
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-light">
      <Navbar />

      <section className="section-py">
        <div className="container-nets max-w-xl">
          <div className="card p-8 sm:p-12 bg-white">
            <div className="overline" style={{ marginBottom: '0.5rem' }}>{schoolName}</div>
            <h1 className="text-d4 fw-600 mb-2">Reset Portal Password / PIN</h1>
            <p className="text-sm text-muted mb-8">
              Enter your registered email address, phone number, or Student Admission ID to receive a reset link.
            </p>

            {submitted ? (
              <div className="p-6 rounded-sm bg-nets-light border border-gray-200 mb-6">
                <div className="flex items-center gap-2 fw-600 text-navy mb-2">
                  <IconCheck className="w-5 h-5 text-green-600" /> Recovery Instructions Sent
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  If an account matches the details provided, a password reset code has been dispatched via SMS and email.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <div>
                  <label className="field-label">Email, Phone, or Admission Number</label>
                  <input type="text" required placeholder="e.g. GHA/2026/0142 or parent@example.com" className="input" />
                </div>

                <button type="submit" className="btn btn-navy w-full" style={{ width: '100%' }}>
                  Send Recovery Code <IconArrowRight size={18} />
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-muted">
              <Link href="/login" className="fw-700 text-navy" style={{ color: 'var(--color-nets-navy)', textDecoration: 'none' }}>
                &larr; Return to Portal Login
              </Link>
              <Link href="/" className="text-muted" style={{ textDecoration: 'none' }}>
                School Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
