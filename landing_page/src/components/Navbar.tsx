"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isOnboarding = pathname?.startsWith('/onboard') || pathname?.startsWith('/login');
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SchoolHub', path: '/schoolhub' },
    { name: 'ExamsPRO', path: '/examspro' },
    { name: 'ClassroomPRO', path: '/classroompro' },
    { name: 'ResultsPRO', path: '/resultspro' },
    { name: 'TutorsPRO', path: '/tutorspro' },
    { name: 'CoursesPRO', path: '/coursespro' },
    { name: 'PuzzlePRO', path: '/puzzlepro' },
  ];

  if (isOnboarding) return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[var(--color-nets-navy-dark)]/90 backdrop-blur-md border-b border-white/5 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-nets flex items-center justify-between">
        <Logo />

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((l) => (
              <Link 
                key={l.path} 
                href={l.path}
                className="text-sm fw-500 text-white/80 hover:text-white transition-colors"
              >
                {l.name}
              </Link>
            ))}
          </div>
          
          <div className="w-[1px] h-6 bg-white/10" />
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm fw-600 text-white hover:text-white/80 transition-colors">
              Sign In
            </Link>
            <Link href="/onboard" className="btn btn-red btn-sm">
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-[2px] bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[var(--color-nets-navy-dark)] border-b border-white/10 shadow-2xl lg:hidden"
          >
            <div className="container-nets py-6 flex flex-col gap-4">
              {navLinks.map((l) => (
                <Link 
                  key={l.path} 
                  href={l.path}
                  className="text-lg fw-500 text-white/90 py-2 border-b border-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <Link 
                  href="/login" 
                  className="btn btn-outline-white w-full text-center justify-center"
                >
                  Sign In
                </Link>
                <Link 
                  href="/onboard" 
                  className="btn btn-red w-full text-center justify-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
