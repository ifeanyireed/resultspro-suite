'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTenant } from '@/components/TenantProvider';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';

export default function RegisterPortalPage() {
  const { tenant } = useTenant();
  const router = useRouter();
  const schoolName = tenant?.name || 'Greenwood High Academy';
  const [role, setRole] = useState<'parent' | 'student' | 'teacher'>('parent');

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/login?role=${role}`);
  };

  return (
    <main className="min-h-screen bg-light">
      <Navbar />

      <section className="section-py">
        <div className="container-nets max-w-2xl">
          <div className="card p-8 sm:p-12 bg-white">
            <div className="overline" style={{ marginBottom: '0.5rem' }}>{schoolName}</div>
            <h1 className="text-d4 fw-600 mb-2">Activate Your Campus Portal Account</h1>
            <p className="text-sm text-muted mb-8">
              Verify your admission number, parent phone number, or staff invite code to set up your password.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {(['parent', 'student', 'teacher'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={role === r ? 'btn btn-navy btn-sm' : 'btn btn-sm'}
                  style={
                    role !== r
                      ? { background: 'var(--color-nets-light)', color: 'var(--color-nets-text)', border: '1px solid var(--color-nets-border)' }
                      : {}
                  }
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleActivate} className="space-y-5">
              <div>
                <label className="field-label">Full Name</label>
                <input type="text" required placeholder="Enter your full name" className="input" />
              </div>

              <div>
                <label className="field-label">
                  {role === 'student'
                    ? 'Student Admission Number'
                    : role === 'parent'
                    ? 'Child’s Admission Number or Parent Phone'
                    : 'Staff Invite Code'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'student' ? 'e.g. GHA/2026/0142' : 'Enter verification code or ID'}
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">Email Address</label>
                <input type="email" required placeholder="you@example.com" className="input" />
              </div>

              <div>
                <label className="field-label">Create Portal Password</label>
                <input type="password" required placeholder="••••••••" className="input" />
              </div>

              <button type="submit" className="btn btn-navy w-full" style={{ width: '100%' }}>
                Activate Account &amp; Continue to Login <IconArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-muted">
              <span>Already have an active portal account?</span>
              <Link href="/login" className="fw-700 text-navy" style={{ color: 'var(--color-nets-navy)', textDecoration: 'none' }}>
                Sign In Here &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
