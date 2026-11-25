"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MotionRise } from '@/components/ScrollRiseProvider';
import { IconShield as Shield, IconMail as Mail, IconLock as Lock, IconChevronRight as ChevronRight, IconUserCircle as UserCircle2, IconLoader2 as Loader2 } from '@tabler/icons-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function ParentLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const user = res.data.user;
      setAuth(user, res.data.access_token || res.data.token);
      toast.success('Parent Portal Access Granted');
      
      if (user.role === 'PARENT' || user.role === 'SUPERADMIN') {
        router.push('/parent/dashboard');
      } else {
        router.push('/login');
        toast.error('This portal is for Parents only.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <MotionRise className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-bold text-blue uppercase tracking-widest mb-6">
             <Shield className="w-3 h-3" /> Parent Security Portal
          </div>
          <h1 className="text-4xl font-display font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Manage your child&apos;s learning journey.</p>
        </div>

        <div className="p-8 md:p-10 rounded-[40px] bg-white border border-gray-100 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-bold text-blue hover:underline uppercase tracking-tighter">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue transition-all"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-green text-navy font-bold text-lg flex items-center justify-center gap-2 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "LOG IN TO PORTAL"}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have a parent account? <Link href="/signup" className="text-blue font-bold hover:underline">Create One</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <Link href="/login" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
            <UserCircle2 className="w-4 h-4" /> STUDENT LOGIN
          </Link>
          <div className="w-1 h-1 rounded-full bg-gray-300 self-center" />
          <Link href="/contact" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">HELP CENTER</Link>
        </div>
      </MotionRise>
    </main>
  );
}
