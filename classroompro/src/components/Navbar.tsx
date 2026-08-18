"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { Bell, Home, BookOpen, BrainCircuit, Layers, DollarSign, LayoutDashboard, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Syllabus', href: '/syllabus' },
    { name: 'Notes', href: '/notes' },
    { name: 'Quizzes', href: '/quizzes' },
    { name: 'Flashcards', href: '/flashcards' },
    { name: 'Exams', href: '/exams' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md" style={{
        background: 'linear-gradient(180deg, rgba(13, 27, 42, 0.4) 0%, rgba(13, 27, 42, 0.1) 50%, rgba(13, 27, 42, 0) 100%)'
      }}>
        <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-[1600px] mx-auto">
          {/* Logo */}
          <Logo />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {!mounted ? (
              // Render a stable skeleton during SSR
              navItems.map((item) => (
                <div key={item.name} className="px-4 py-1.5 h-8 w-24 bg-white/5 animate-pulse rounded-full" />
              ))
            ) : (
              navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] flex gap-2 overflow-hidden px-4 py-1.5 rounded-full transition-all text-gray-300 hover:text-white text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] border border-white/5`}
                >
                  {item.name}
                </Link>
              ))
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {mounted && isAuthenticated && (
              <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </Link>
            )}

            {!mounted || !isAuthenticated ? (
              <div className="flex items-center gap-1.5 md:gap-3">
                <Link href="/login" className="text-xs md:text-sm font-bold text-gray-400 hover:text-white transition-colors px-2 md:px-4 py-2">
                  Login
                </Link>
                <Link href="/signup" className="bg-green text-navy text-[10px] md:text-sm font-black px-4 md:px-6 py-2 rounded-full hover:bg-green/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  GET STARTED
                </Link>
              </div>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-full pl-1 pr-1.5 md:pr-4 py-1 hover:bg-white/10 transition-all group shrink-0">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green text-navy flex items-center justify-center font-black text-[10px] md:text-xs group-hover:scale-105 transition-transform overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'
                  )}
                </div>
                <div className="flex flex-col leading-tight pr-1 md:pr-0">
                  <span className="text-[10px] md:text-sm font-black">{user?.role || 'USER'}</span>
                  <span className="text-[7px] md:text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Role</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-xl border-t border-white/5 px-4 py-3 flex items-center justify-between pb-4">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </Link>
        <Link
          href="/syllabus"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/syllabus') ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Syllabus</span>
        </Link>
        <Link
          href="/notes"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/notes') ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Notes</span>
        </Link>
        <Link
          href="/quizzes"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/quizzes') ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <BrainCircuit className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Quizzes</span>
        </Link>
        <Link
          href="/flashcards"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/flashcards') ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Cards</span>
        </Link>
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/dashboard') ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Dash</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
