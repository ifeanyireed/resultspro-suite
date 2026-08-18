"use client";

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Zap,
  Loader2,
  Chrome
} from 'lucide-react';
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
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo className="mb-8" imageSize={40} textSize="text-2xl" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-gray-500">Log in to your account to continue your journey.</p>
      </div>

      <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl shadow-2xl">
        {!mfaRequired ? (
          <>
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
                <span className="bg-[#0d1b2a] px-2 text-gray-500 font-bold tracking-widest">Or continue with</span>
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
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-gray-500 font-bold text-sm opacity-50 cursor-not-allowed"
                >
                  <Chrome className="w-4 h-4" />
                  Google
                </button>
              )}
              
              {process.env.NEXT_PUBLIC_ENABLE_MICROSOFT_AUTH === 'true' && (
                <button 
                  onClick={handleMicrosoftLogin}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-colors font-bold text-sm"
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
              <div className="w-16 h-16 rounded-2xl bg-green/20 flex items-center justify-center text-green mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Enter 2FA Code</h2>
              <p className="text-xs text-gray-500">Please enter the 6-digit code from your authenticator app to complete your login.</p>
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
                className="w-full bg-navy border border-white/10 rounded-2xl py-4 text-center text-white text-3xl font-bold tracking-[0.5em] focus:outline-none focus:border-green/50 transition-colors"
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading || mfaCode.length < 6}
              className="w-full py-7 rounded-2xl bg-green text-navy font-bold text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Login"}
            </Button>

            <button 
              type="button"
              onClick={() => setMfaRequired(false)}
              className="w-full text-xs font-bold text-gray-500 hover:text-white transition-colors"
            >
              Go back to login
            </button>
          </form>
        )}
      </div>

      <p className="text-center mt-8 text-gray-500 text-sm">
        Don&apos;t have an account? <Link href="/signup" className="text-green font-bold hover:underline">Sign up for free</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20 overflow-y-auto">
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
        Join ClassroomPRO and start learning
      </div>
    </main>
  );
}
