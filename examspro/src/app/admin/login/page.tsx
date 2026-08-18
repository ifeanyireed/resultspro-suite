"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Fingerprint,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [step, setStep] = useState(1); // 1: Login, 2: 2FA
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // First, check if user exists and password is correct, then trigger OTP
      await api.post('/auth/request-otp', { email, password });
      setStep(2);
      toast.success('Verification code sent to your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.error('Please enter your email first');
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Reset code sent to your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return toast.error('Please enter all 6 digits');
    
    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: otpValue });
      
      const user = res.data.user;
      if (user.role !== 'ADMIN' && user.role !== 'MODERATOR' && !user.isAdmin) {
        toast.error('Unauthorized access. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      setAuth(user, res.data.token);
      toast.success('Welcome to Admin Control Center');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Admin specific background - more subtle/professional */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-green/5 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-gray-400 mb-8">
            <ShieldCheck className="w-4 h-4 text-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Admin Access</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green rounded-2xl flex items-center justify-center font-display font-black text-navy text-2xl shadow-lg shadow-green/20">E</div>
            <span className="text-3xl font-display font-bold text-white tracking-tight">ResultsPRO Exams <span className="text-gray-600 font-medium">/ Admin</span></span>
          </div>
        </div>

        <div className="p-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent">
          <div className="bg-[#111] p-8 md:p-10 rounded-[31px] border border-white/5 shadow-2xl">
            {step === 1 ? (
              <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Administrator Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@resultspro.ng"
                      className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-green/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] font-bold text-green hover:underline uppercase tracking-widest"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-green/50 transition-colors"
                    />
                  </div>
                </div>

                <Button className="w-full py-7 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg flex items-center justify-center gap-2 group">
                  Authenticate
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handle2FA} className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center text-green mx-auto mb-6">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 px-4">Enter the 6-digit code sent to your registered device.</p>
                </div>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 bg-black border border-white/10 rounded-xl text-center text-xl font-black text-green focus:outline-none focus:border-green transition-colors"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <Button className="w-full py-7 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg">
                    Verify & Enter
                  </Button>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-xs font-bold text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-bold text-gray-700 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green" />
            System Status: Nominal
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span>v2.4.0-admin</span>
        </div>
      </div>
    </main>
  );
}
