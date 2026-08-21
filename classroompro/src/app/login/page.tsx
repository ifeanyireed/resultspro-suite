"use client";

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { IconMail as Mail, IconLock as Lock, IconArrowRight as ArrowRight, IconBolt as Zap, IconLoader2 as Loader2, IconBrandGoogle as Chrome } from '@tabler/icons-react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msal";
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaUserId, setMfaUserId] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const { instance } = useMsal();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      
      if (res.data.mfa_required) {
        setMfaRequired(true);
        setMfaUserId(res.data.user_id);
        toast.success('2FA Required. Please enter your code.');
        setIsLoading(false);
        return;
      }

      const { access_token, refresh_token } = res.data;
      
      // Store tokens temporarily so the next API call is authenticated
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Fetch full profile from our local backend
      const userRes = await api.get('/auth/me');
      const user = userRes.data;
      
      setAuth(user, access_token, refresh_token);
      toast.success('Welcome back!');
      
      // Role-based redirection
      if (redirectTo !== '/dashboard') {
        router.push(redirectTo);
      } else {
        switch (user.role) {
          case 'SUPERADMIN':
            router.push('/dashboard/super-admin');
            break;
          case 'TEACHER':
            router.push('/dashboard/teacher');
            break;
          case 'SCHOOL_ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'PARENT':
            router.push('/dashboard/parent');
            break;
          default:
            router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode) return;
    setIsLoading(true);
    try {
      // Use the verification endpoint specifically for login flow
      const res = await api.post('/auth/mfa/challenge', {
        user_id: mfaUserId,
        code: mfaCode
      });
      
      const { access_token, refresh_token } = res.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      const userRes = await api.get('/auth/me');
      const user = userRes.data;
      
      setAuth(user, access_token, refresh_token);
      toast.success('MFA Verified. Welcome back!');
      
      if (user.role === 'SUPERADMIN') {
        router.push('/dashboard/super-admin');
      } else {
        router.push(redirectTo);
      }
    } catch (error: any) {
      console.error('MFA Error:', error);
      toast.error(error.response?.data?.error || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', { idToken: tokenResponse.access_token });
      const { access_token, refresh_token } = res.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      const userRes = await api.get('/auth/me');
      const user = userRes.data;
      
      setAuth(user, access_token, refresh_token);
      toast.success('Logged in with Google');
      
      if (user.role === 'SUPERADMIN') {
        router.push('/dashboard/super-admin');
      } else {
        router.push(redirectTo);
      }
    } catch (error: any) {
      console.error('Google Login Error:', error);
      toast.error(error.response?.data?.error || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
    setIsLoading(false);
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      const res = await api.post('/auth/microsoft', { accessToken: loginResponse.accessToken });
      const { access_token, refresh_token } = res.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      const userRes = await api.get('/auth/me');
      const user = userRes.data;
      
      setAuth(user, access_token, refresh_token);
      toast.success('Logged in with Microsoft');
      
      if (user.role === 'SUPERADMIN') {
        router.push('/dashboard/super-admin');
      } else {
        router.push(redirectTo);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Microsoft login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="w-full">
        {!mfaRequired ? (
          <>
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
                <span className="bg-white px-2 text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className={`grid ${process.env.NEXT_PUBLIC_ENABLE_MICROSOFT_AUTH === 'true' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
              {mounted && googleClientId ? (
                <GoogleLoginButton 
                  onSuccess={handleGoogleSuccess} 
                  onError={handleGoogleError} 
                  isLoading={isLoading} 
                />
              ) : (
                <button 
                  disabled
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 font-semibold text-sm opacity-50 cursor-not-allowed"
                >
                  <Chrome className="w-4 h-4" />
                  Google
                </button>
              )}
              
              {process.env.NEXT_PUBLIC_ENABLE_MICROSOFT_AUTH === 'true' && (
                <button 
                  onClick={handleMicrosoftLogin}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h10.1v10.1h-10.1z" fill="#f25022"/><path d="m10.9 0h10.1v10.1h-10.1z" fill="#7fba00"/><path d="m0 10.9h10.1v10.1h-10.1z" fill="#00a4ef"/><path d="m10.9 10.9h10.1v10.1h-10.1z" fill="#ffb900"/></svg>
                  Microsoft
                </button>
              )}
            </div>
          </>
        ) : (
          <form className="space-y-6 animate-in fade-in zoom-in duration-300" onSubmit={handleMfaVerify}>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Enter 2FA Code</h2>
              <p className="text-xs text-slate-400">Please enter the 6-digit code from your authenticator app to complete your login.</p>
            </div>

            <div className="space-y-2">
              <input 
                type="text" 
                required
                autoFocus
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="000000"
                className="block w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-900 text-3xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading || mfaCode.length < 6}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Login"}
            </Button>

            <button 
              type="button"
              onClick={() => setMfaRequired(false)}
              className="w-full text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              Go back to login
            </button>
          </form>
        )}
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
    <SharedLoginPage brandTitle="ClassroomPRO" brandSubtitle="RESULTSPRO EDU SUITE" appDescription="The Ultimate Learning Management System">
      <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
        <LoginForm />
      </Suspense>
    </SharedLoginPage>
  );
}
