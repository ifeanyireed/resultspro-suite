"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IconMail as Mail, IconLock as Lock, IconArrowRight as ArrowRight, IconUser as UserIcon, IconTicket as Ticket, IconBrandChrome as Chrome, IconBolt as Zap, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msal";
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasGoogleClientId = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  const { instance } = useMsal();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error('Please agree to the Terms and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/signup', formData);
      const { user, token } = response.data;
      
      setAuth(user, token);
      toast.success('Account created successfully! Enjoy your welcome bonus.');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create account';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await api.post('/auth/google', { 
          idToken: tokenResponse.access_token,
          referralCode: formData.referralCode 
        });
        setAuth(res.data.user, res.data.token);
        toast.success('Signed up with Google');
        router.push('/dashboard');
      } catch (error) {
        toast.error('Google signup failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleMicrosoftSignup = async () => {
    setIsLoading(true);
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      const res = await api.post('/auth/microsoft', { 
        accessToken: loginResponse.accessToken,
        referralCode: formData.referralCode 
      });
      setAuth(res.data.user, res.data.token);
      toast.success('Signed up with Microsoft');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Microsoft signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl shadow-2xl">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              required
              placeholder="Ifeanyi Chuks"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Referral Code (Optional)</label>
          <div className="relative">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="EXAM50"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
              className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors uppercase tracking-widest"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 py-2 px-1">
          <input 
            type="checkbox" 
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/10 bg-navy text-green focus:ring-green/20 accent-green cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
            I agree to the <Link href="/terms" className="text-green hover:underline font-bold">Terms & Conditions</Link> and <Link href="/privacy" className="text-green hover:underline font-bold">Privacy Policy</Link>.
          </label>
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full py-7 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Create My Account
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
          <span className="bg-transparent px-2 text-gray-500 font-bold tracking-widest">Or sign up with</span>
        </div>
      </div>

      <div className={`grid ${hasGoogleClientId ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        {hasGoogleClientId && (
          <button 
            onClick={() => loginWithGoogle()}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-colors font-bold text-sm"
          >
            <Chrome className="w-4 h-4" />
            Google
          </button>
        )}
        
        <button 
          onClick={handleMicrosoftSignup}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-colors font-bold text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h10.1v10.1h-10.1z" fill="#f25022"/><path d="m10.9 0h10.1v10.1h-10.1z" fill="#7fba00"/><path d="m0 10.9h10.1v10.1h-10.1z" fill="#00a4ef"/><path d="m10.9 10.9h10.1v10.1h-10.1z" fill="#ffb900"/></svg>
          Microsoft
        </button>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden text-black dark:text-white">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue/10 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo className="mb-8" imageSize={40} textSize="text-2xl" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-500">Join 50,000+ students and start earning coins.</p>
        </div>

        <Suspense fallback={
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-green animate-spin mb-4" />
            <p className="text-gray-500 font-bold">Loading signup form...</p>
          </div>
        }>
          <SignupForm />
        </Suspense>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Already have an account? <Link href="/login" className="text-green font-bold hover:underline">Log in here</Link>
        </p>
      </div>

      {/* Decorative footer element */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <Zap className="w-3 h-3 text-amber fill-current" />
          Get 50 bonus coins instantly
        </div>
        <p className="text-[10px] text-gray-600 text-center max-w-xs uppercase tracking-widest leading-loose">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
