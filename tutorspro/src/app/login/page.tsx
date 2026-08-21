"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { IconMail as Mail, IconLock as Lock, IconArrowRight as ArrowRight, IconBrandGoogle as Chrome, IconBolt as Zap, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msal";
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const { instance } = useMsal();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      const user = res.data.user;
      setAuth(user, res.data.access_token || res.data.token);
      toast.success('Welcome back!');
      
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
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await api.post('/auth/google', { idToken: tokenResponse.access_token });
        const user = res.data.user;
        setAuth(user, res.data.access_token || res.data.token);
        toast.success('Logged in with Google');
        
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
  });

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      const res = await api.post('/auth/microsoft', { accessToken: loginResponse.accessToken });
      const user = res.data.user;
      setAuth(user, res.data.access_token || res.data.token);
      toast.success('Logged in with Microsoft');
      
      const roleRedirects: Record<string, string> = {
        'SUPERADMIN': '/super-admin/dashboard',
        'PLATFORM_ADMIN': '/platform-admin/dashboard',
        'SCHOOL_ADMIN': '/school/dashboard',
        'TUTOR': '/tutor/dashboard',
        'STUDENT': '/student/dashboard',
        'PARENT': '/parent/dashboard',
      };

      router.push(roleRedirects[user.role] || redirectTo);
    } catch (error) {
      console.error(error);
      toast.error('Microsoft login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="w-full">
        <form className="space-y-5" onSubmit={handleEmailLogin}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <Link href="/forgot-password" global-link="true" className="text-[10px] font-bold text-blue-600 hover:text-blue-600/80 uppercase">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                Login to Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => loginWithGoogle()}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm shadow-sm"
          >
            <Chrome className="w-4 h-4" />
            Google
          </button>
          
          <button 
            onClick={handleMicrosoftLogin}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h10.1v10.1h-10.1z" fill="#f25022"/><path d="m10.9 0h10.1v10.1h-10.1z" fill="#7fba00"/><path d="m0 10.9h10.1v10.1h-10.1z" fill="#00a4ef"/><path d="m10.9 10.9h10.1v10.1h-10.1z" fill="#ffb900"/></svg>
            Microsoft
          </button>
        </div>
      </div>

      <p className="text-center mt-8 text-slate-400 text-sm">
        Don&apos;t have an account? <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Sign up for free</Link>
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
