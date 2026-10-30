"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Mail, ArrowRight, Loader2, Sparkles, Building2, Users, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import TenantLogo from '@/components/TenantLogo';

function VerifyEmailContent({ tenant }: { tenant: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const resolvedTenantSlug = tenant?.slug || (params?.tenant as string) || '';

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize email & otp from searchParams or sessionStorage
  useEffect(() => {
    const queryEmail = searchParams.get('email');
    const queryCode = searchParams.get('code') || searchParams.get('token');
    
    let targetEmail = '';
    if (queryEmail) {
      targetEmail = queryEmail;
    } else if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('auth_temp_email');
        if (stored) targetEmail = stored;
      } catch (e) {}
    }

    if (targetEmail) {
      setEmail(targetEmail);
      setNewEmailInput(targetEmail);
    }

    if (queryCode && queryCode.length >= 6) {
      setOtp(queryCode.trim());
    }
  }, [searchParams]);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const processLoginToken = async (authToken: string, authUser: any) => {
    setAuth(authUser, authToken);
    try {
      const base64Url = authToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const roles = payload.roles || [];

      if (roles.includes('tenant-admin') || roles.includes('superadmin') || roles.includes('platform-admin')) {
        router.push('/admin');
        return;
      } else if (roles.includes('mentor')) {
        router.push('/mentor');
        return;
      }
    } catch (e) {}

    const selectedCohortId = Cookies.get('selected_cohort_id');
    if (selectedCohortId) {
      router.push('/onboarding/orientation');
    } else {
      router.push('/dashboard');
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp || otp.length < 5) return;

    setVerificationLoading(true);
    setError('');
    setSuccess('');

    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
      await axios.post(`${USERS_API}/api/v1/auth/verify-email`, { token: otp.trim() });

      // Check if we have cached credentials for seamless auto-login
      let tempPass = '';
      let tempEmail = '';
      if (typeof window !== 'undefined') {
        try {
          tempPass = sessionStorage.getItem('auth_temp_pass') || '';
          tempEmail = sessionStorage.getItem('auth_temp_email') || '';
        } catch (e) {}
      }

      const loginTargetEmail = email || tempEmail;
      if (tempPass && loginTargetEmail) {
        try {
          const loginRes = await axios.post(`${USERS_API}/api/v1/auth/login`, {
            email: loginTargetEmail,
            password: tempPass,
            tenant_id: tenant?.id,
            tenant_slug: resolvedTenantSlug,
            app_module: 'coursespro'
          });

          // Clean up temporary stored password
          try {
            sessionStorage.removeItem('auth_temp_pass');
            sessionStorage.removeItem('auth_temp_email');
          } catch (e) {}

          const token = loginRes.data.access_token || loginRes.data.token;
          if (token) {
            await processLoginToken(token, loginRes.data.user);
            return;
          }
        } catch (loginErr) {
          // If auto-login fails, redirect cleanly to login page
        }
      }

      // Fallback redirect with verified status query parameter
      router.push(`/login?email=${encodeURIComponent(loginTargetEmail)}&verified=true`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid or expired verification code');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please provide your email address to resend the code.');
      setIsEditingEmail(true);
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
      await axios.post(`${USERS_API}/api/v1/auth/resend-verification`, {
        email: email.trim(),
        tenant_id: tenant?.id,
        tenant_slug: resolvedTenantSlug
      });

      setSuccess(`A new 6-digit verification code has been sent to ${email}.`);
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.trim()) return;
    setEmail(newEmailInput.trim());
    setIsEditingEmail(false);
    try {
      sessionStorage.setItem('auth_temp_email', newEmailInput.trim());
    } catch (e) {}
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Aesthetic / Branding */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#0B1021]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <TenantLogo
              theme="dark"
              height={40}
              logoUrl={tenant?.logo_url}
              darkLogoUrl={tenant?.dark_logo_url}
              flattenLogo={tenant?.flatten_logo}
              tenantName={tenant?.name}
            />
            <div>
              <h1 className="font-bold text-white text-3xl tracking-tight">{tenant?.name || 'Academy'}</h1>
              <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest">Learning Management System</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Identity Verification</span>
            </div>
            <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Verify your email to continue learning.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Complete your one-time verification to gain full access to cohorts, course content, certificates, and collaborative workspaces.
            </p>

            <div className="flex space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">140+</h4>
                  <p className="text-slate-400 text-sm">Active Schools</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">4.8k+</h4>
                  <p className="text-slate-400 text-sm">Total Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>End-to-end encrypted identity verification</span>
          </div>
        </div>
      </div>

      {/* Right Panel - OTP Verification Form */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-16 relative">
        {/* Mobile Logo overlay */}
        <div className="lg:hidden flex items-center justify-center mb-10 w-full absolute top-8 left-0 right-0">
          <TenantLogo
            theme="light"
            height={40}
            logoUrl={tenant?.logo_url}
            darkLogoUrl={tenant?.dark_logo_url}
            flattenLogo={tenant?.flatten_logo}
            tenantName={tenant?.name}
          />
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Verify Your Email</h2>
            <p className="text-slate-500 text-sm">
              We've sent a 6-digit verification code to{' '}
              {email ? (
                <span className="font-semibold text-slate-800 break-all">{email}</span>
              ) : (
                <span className="italic text-slate-400">your email address</span>
              )}
              .
            </p>

            {email && !isEditingEmail && (
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                Wrong email address? Change it
              </button>
            )}
          </div>

          {/* Edit Email Inline Form */}
          {isEditingEmail && (
            <form onSubmit={handleUpdateEmail} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Update Email Address</label>
              <input
                type="email"
                required
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Save & Use
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(false)}
                  className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Feedback Alerts */}
          {success && (
            <div className="mb-6 p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP Verification Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                autoFocus
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-center tracking-[0.5em] text-2xl font-bold placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={verificationLoading || otp.length < 5}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {verificationLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify & Sign In <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || countdown > 0}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 inline-flex items-center gap-1.5 transition-colors"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending new code...
                  </>
                ) : countdown > 0 ? (
                  `Resend code in ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" /> Didn't receive the code? Resend
                  </>
                )}
              </button>

              <Link
                href="/login"
                className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
              >
                Back to login
              </Link>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Need assistance? Contact support at{' '}
              <a href="mailto:support@resultspro.ng" className="text-blue-600 hover:underline">
                support@resultspro.ng
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailForm({ tenant }: { tenant: any }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <VerifyEmailContent tenant={tenant} />
    </Suspense>
  );
}
