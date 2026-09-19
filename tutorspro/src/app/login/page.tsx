"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import api from '@/lib/api';

import { useGoogleLogin } from '@react-oauth/google';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await api.post(`${ process.env.NEXT_PUBLIC_USERS_API }/api/v1/auth/google`, { idToken: tokenResponse.access_token, app_module: 'tutorspro' });
        const user = res.data.user;
        setAuth(user, res.data.access_token || res.data.token);
        toast.success('Logged in with Google! 🎉');
        
        const roleRedirects: Record<string, string> = {
          'SUPERADMIN': '/super-admin/dashboard',
          'PLATFORM_ADMIN': '/platform-admin/dashboard',
          'SCHOOL_ADMIN': '/school/dashboard',
          'TUTOR': '/tutor/dashboard',
          'STUDENT': '/student/dashboard',
          'PARENT': '/parent/dashboard',
        };

        router.push(roleRedirects[user.role] || redirectTo);
      } catch (error: any) {
        console.error('Google Login Error:', error);
        toast.error(error.response?.data?.error || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
      setIsLoading(false);
    }
  });

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="w-full">
        <button
          type="button"
          onClick={() => loginWithGoogle()}
          disabled={isLoading}
          className="w-full flex justify-center items-center py-4 px-4 border border-slate-200 rounded-full shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>

      <p className="text-center mt-8 text-slate-400 text-sm">
        Need help logging in? <a href="mailto:support@resultspro.ng" className="text-blue-600 font-semibold hover:underline">Contact Support</a>
      </p>
    </div>
  );
}

import SharedLoginPage from "../../components/auth/SharedLoginPage";

export default function LoginPage() {
  return (
    <SharedLoginPage brandTitle="TutorsPRO" brandSubtitle="RESULTSPRO EDU SUITE" appDescription="The Ultimate Platform for Tutors">
      <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
        <LoginForm />
      </Suspense>
    </SharedLoginPage>
  );
}
