"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { IconMail as Mail, IconLock as Lock, IconArrowRight as ArrowRight, IconChrome as Chrome, IconZap as Zap, IconLoader2 as Loader2 } from '@tabler/icons-react';
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
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo className="mb-8" imageSize={40} textSize="text-2xl" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-gray-500">Log in to your account to continue your journey.</p>
      </div>

      <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl shadow-2xl">
        <form className="space-y-5" onSubmit={handleEmailLogin}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <Link href="/forgot-password" global-link="true" className="text-[10px] font-bold text-blue hover:text-blue/80 uppercase">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
              />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full py-7 rounded-2xl bg-green text-navy font-bold text-lg flex items-center justify-center gap-2 group"
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
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-500 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => loginWithGoogle()}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-colors font-bold text-sm"
          >
            <Chrome className="w-4 h-4" />
            Google
          </button>
          
          <button 
            onClick={handleMicrosoftLogin}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-colors font-bold text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h10.1v10.1h-10.1z" fill="#f25022"/><path d="m10.9 0h10.1v10.1h-10.1z" fill="#7fba00"/><path d="m0 10.9h10.1v10.1h-10.1z" fill="#00a4ef"/><path d="m10.9 10.9h10.1v10.1h-10.1z" fill="#ffb900"/></svg>
            Microsoft
          </button>
        </div>
      </div>

      <p className="text-center mt-8 text-gray-500 text-sm">
        Don&apos;t have an account? <Link href="/signup" className="text-green font-bold hover:underline">Sign up for free</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue/10 rounded-full blur-[120px]" />
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-green animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Preparing Login...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>

      {/* Decorative footer element */}
      <div className="mt-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <Zap className="w-3 h-3 text-amber fill-current" />
        Join 50,000+ students already winning
      </div>
    </main>
  );
}
