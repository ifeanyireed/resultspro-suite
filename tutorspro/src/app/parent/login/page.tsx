"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, ChevronRight, UserCircle2, Loader2 } from 'lucide-react';
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
    <main className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* ... background ... */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-[10px] font-bold text-blue uppercase tracking-widest mb-6">
             <Shield className="w-3 h-3" /> Parent Security Portal
          </div>
          <h1 className="text-4xl font-display font-black text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Manage your child&apos;s learning journey.</p>
        </div>

        <div className="p-8 md:p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-bold text-blue hover:underline uppercase tracking-tighter">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue/50 transition-all"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-blue text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue/20 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "LOG IN TO PORTAL"}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have a parent account? <Link href="/signup" className="text-blue font-bold hover:underline">Create One</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <Link href="/login" className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-white transition-colors">
            <UserCircle2 className="w-4 h-4" /> STUDENT LOGIN
          </Link>
          <div className="w-1 h-1 rounded-full bg-white/10 self-center" />
          <Link href="/contact" className="text-xs font-bold text-gray-600 hover:text-white transition-colors">HELP CENTER</Link>
        </div>
      </div>
    </main>
  );
}
