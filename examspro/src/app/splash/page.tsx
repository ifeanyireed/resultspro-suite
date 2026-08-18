"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green/5 rounded-full blur-[120px]" />
      </div>

      <div className={`relative z-10 transition-all duration-1000 flex flex-col items-center ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Animated Logo */}
        <div className="w-24 h-24 bg-green rounded-[32px] flex items-center justify-center font-display font-black text-navy text-4xl shadow-[0_0_50px_rgba(0,200,83,0.3)] animate-bounce mb-8">
          E
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-4">
          ResultsPRO <span className="text-green">Exams</span>
        </h1>
        
        <p className="text-gray-500 font-medium tracking-[0.2em] uppercase text-xs animate-pulse">
          AI-Powered • Gamified • Free
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-green animate-[loading_3s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(50%); }
          100% { width: 0%; transform: translateX(200%); }
        }
      `}</style>
    </main>
  );
}
