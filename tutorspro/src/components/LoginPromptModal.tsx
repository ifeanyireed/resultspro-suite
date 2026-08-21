"use client";

import { useEffect, useState, useCallback } from 'react';
import { IconX as X, IconBolt as Zap, IconTrophy as Trophy, IconBarChart3 as BarChart3, IconBrandGoogle as Chrome, IconArrowRight as ArrowRight, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginPromptModalProps {
  /** How many ms to wait before showing the modal. Default: 30000 */
  delayMs?: number;
  /** Externally control visibility */
  show?: boolean;
  /** Callback when closed */
  onClose?: () => void;
}

export default function LoginPromptModal({ delayMs = 30000, show, onClose }: LoginPromptModalProps) {
  const { isAuthenticated, setAuth } = useAuthStore();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with 'show' prop
  useEffect(() => {
    if (show !== undefined) {
      setVisible(show);
    }
  }, [show]);

  // Dismiss permanently for this session
  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    // Don't show if already authenticated or already dismissed
    if (isAuthenticated || dismissed || show !== undefined) return;

    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isAuthenticated, dismissed, delayMs, show]);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await api.post('/auth/google', { idToken: tokenResponse.access_token });
        const user = res.data.user;
        setAuth(user, res.data.token);
        toast.success('Logged in with Google! 🎉');
        dismiss();
        // Stay on the same page after login
      } catch {
        toast.error('Google login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
      setIsLoading(false);
    },
  });

  if (!visible || isAuthenticated) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-prompt-title"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto relative w-full max-w-md rounded-[32px] overflow-hidden border border-white/10 shadow-2xl
          animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300">

          {/* Gradient background */}
          <div className="absolute inset-0 bg-[#0d1b2a]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-green/15 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-blue/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Dismiss login prompt"
            className="absolute top-5 right-5 z-50 w-8 h-8 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 p-8">
            {/* Icon badge */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-green fill-current" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber border-2 border-[#0d1b2a] flex items-center justify-center">
                  <span className="text-[8px] font-black text-navy">✦</span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                 <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full border border-green/20 text-xs font-bold uppercase tracking-wider mb-2">
                   <BarChart3 className="w-3.5 h-3.5" /> Track Mastery
                 </div>
              </div>
              <h2
                id="login-prompt-title"
                className="text-2xl font-display font-bold text-white mb-3"
              >
                Supercharge Your Prep
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Sign in to save your quiz results, track topic mastery, earn coins, and compete on the leaderboard.
              </p>
            </div>

            {/* Benefit chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { icon: Trophy, label: 'Leaderboard' },
                { icon: BarChart3, label: 'Progress Tracking' },
                { icon: Zap, label: 'Earn Coins' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-xs font-bold text-gray-300"
                >
                  <Icon className="w-3.5 h-3.5 text-green" />
                  {label}
                </div>
              ))}
            </div>

            {/* Google Login CTA */}
            <button
              id="login-prompt-google-btn"
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-gray-900 font-bold text-sm hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mb-3"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5 text-[#4285F4]" />
              )}
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#0d1b2a] text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  or
                </span>
              </div>
            </div>

            {/* Email login link */}
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white text-sm font-bold hover:bg-white/10 transition-colors group"
            >
              Login with Email
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <p className="text-center text-[11px] text-gray-600 mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-green hover:underline font-bold">
                Sign up free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
