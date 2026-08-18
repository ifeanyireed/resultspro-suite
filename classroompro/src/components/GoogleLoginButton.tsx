"use client";

import { useGoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleLoginButtonProps {
  onSuccess: (tokenResponse: any) => void;
  onError: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function GoogleLoginButton({ onSuccess, onError, isLoading, disabled }: GoogleLoginButtonProps) {
  const login = useGoogleLogin({
    onSuccess,
    onError,
  });

  return (
    <button
      onClick={() => login()}
      disabled={isLoading || disabled}
      className={cn(
        "flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-60 font-bold text-sm w-full"
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.01h2.64c1.54-1.42 2.43-3.5 2.43-5.94z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.01c-.73.48-1.66.76-2.64.76-2.85 0-5.27-1.92-6.13-4.51H1.64v2.09C3.48 20.24 7.51 23 12 23z" fill="#34A853"/>
          <path d="M5.87 14.58c-.23-.69-.35-1.43-.35-2.08s.12-1.39.35-2.08V8.33H1.64C.6 10.41 0 12.72 0 15s.6 4.59 1.64 6.67l4.23-2.09z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.51 1 3.48 3.76 1.64 7.67l4.23 2.08c.86-2.59 3.28-4.51 6.13-4.51z" fill="#EA4335"/>
        </svg>
      )}
      Google
    </button>
  );
}
