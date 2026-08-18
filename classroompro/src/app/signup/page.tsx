"use client";

import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { IconUser as User, IconMail as Mail, IconLock as Lock, IconSchool as School, IconLoader2 as Loader2, IconChrome as Chrome } from '@tabler/icons-react';
import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msal";
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [role, setRole] = useState<"student" | "teacher" | "school_admin" | "parent" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { instance } = useMsal();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSocialLoginSuccess = (user: any, accessToken: string, refreshToken: string) => {
    setAuth(user, accessToken, refreshToken);
    toast.success('Account created successfully! 🎉');
    if (user.role === 'SUPERADMIN') {
      router.push('/dashboard/super-admin');
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', { idToken: tokenResponse.access_token });
      handleSocialLoginSuccess(res.data.user, res.data.access_token, res.data.refresh_token);
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
      handleSocialLoginSuccess(res.data.user, res.data.access_token, res.data.refresh_token);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Microsoft login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return (
      <AuthLayout 
        title="Join ClassroomPRO" 
        subtitle="Choose your account type to get started"
      >
        <div className="space-y-4">
          <button 
            onClick={() => setRole("student")}
            className="w-full p-4 rounded-xl border border-white/10 bg-navy/50 hover:border-green/50 hover:bg-green/5 transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-green/10 flex items-center justify-center text-green group-hover:scale-110 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">I am a Student</h4>
              <p className="text-xs text-muted-foreground">Access notes, quizzes and flashcards.</p>
            </div>
          </button>

          <button 
            onClick={() => setRole("parent")}
            className="w-full p-4 rounded-xl border border-white/10 bg-navy/50 hover:border-red-400/50 hover:bg-red-400/5 transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-red-400/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">I am a Parent</h4>
              <p className="text-xs text-muted-foreground">Monitor your child's academic progress.</p>
            </div>
          </button>

          <button 
            onClick={() => setRole("teacher")}
            className="w-full p-4 rounded-xl border border-white/10 bg-navy/50 hover:border-blue/50 hover:bg-blue/5 transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-blue/10 flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">I am a Teacher</h4>
              <p className="text-xs text-muted-foreground">Create content and manage classes.</p>
            </div>
          </button>

          <button 
            onClick={() => setRole("school_admin")}
            className="w-full p-4 rounded-xl border border-white/10 bg-navy/50 hover:border-amber/50 hover:bg-amber/5 transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-amber/10 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">School Admin</h4>
              <p className="text-xs text-muted-foreground">Manage your school's digital curriculum.</p>
            </div>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d1b2a] px-2 text-gray-500 font-bold tracking-widest">Or join with</span>
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
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-colors font-bold text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h10.1v10.1h-10.1z" fill="#f25022"/><path d="m10.9 0h10.1v10.1h-10.1z" fill="#7fba00"/><path d="m0 10.9h10.1v10.1h-10.1z" fill="#00a4ef"/><path d="m10.9 10.9h10.1v10.1h-10.1z" fill="#ffb900"/></svg>
                Microsoft
              </button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-green hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      fullName: formData.get('full_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: role?.toUpperCase()
    };

    try {
      await api.post('/auth/signup', data);
      toast.success('Account created! Please verify your email.');
      router.push(`/verify-email?role=${role}&email=${data.email}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create account" 
      subtitle={`Registering as a ${role.replace('_', ' ')}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <button 
          type="button"
          onClick={() => setRole(null)}
          className="text-xs font-bold text-muted-foreground hover:text-white mb-2"
        >
          ← Change role
        </button>
        
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="full_name" name="full_name" type="text" placeholder="John Doe" className="pl-10 h-12 bg-navy/50 border-white/10" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="email" name="email" type="email" placeholder="name@school.com" className="pl-10 h-12 bg-navy/50 border-white/10" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10 h-12 bg-navy/50 border-white/10" required />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full h-12 bg-green hover:bg-green/90 text-navy font-bold text-lg mt-4">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Create Account"}
        </Button>

        <p className="text-center text-xs text-muted-foreground px-4">
          By clicking &quot;Create Account&quot;, you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}
