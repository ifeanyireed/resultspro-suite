"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState, useCallback } from 'react';
import { IconBell as Bell, IconMenu as Menu, IconX as X, IconHome as Home, IconInfo as Info, IconUsers as Users, IconCreditCard as CreditCard, IconGraduationCap as GraduationCap, IconBookText as BookText, IconHelpCircle as HelpCircle, IconMessageSquare as MessageSquare } from '@tabler/icons-react';
import { getUnreadCount } from '@/lib/notifications.api';

const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Silent error for unread count
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [mounted, isAuthenticated, fetchUnreadCount]);

  // Public links based on slugs.md
  const publicNavItems = [
    { name: 'About', href: '/about', icon: Info },
    { name: 'Tutors', href: '/tutors', icon: Users },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Schools', href: '/schools', icon: GraduationCap },
    { name: 'Blog', href: '/blog', icon: BookText },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: MessageSquare },
  ];

  // Check if we are in a dashboard area that has a sidebar
  const hasSidebar = pathname.startsWith('/parent/') || pathname === '/parent' ||
                    pathname.startsWith('/platform-admin/') || pathname === '/platform-admin' ||
                    (pathname.startsWith('/school/') && !pathname.startsWith('/schools')) || pathname === '/school' ||
                    pathname.startsWith('/super-admin/') || pathname === '/super-admin' ||
                    pathname.startsWith('/student/') || pathname === '/student' ||
                    (pathname.startsWith('/tutor/') && !pathname.startsWith('/tutors')) || pathname === '/tutor';

  if (!mounted) return null;

  return (
    <>
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all ${hasSidebar ? 'hidden lg:block' : ''}`} style={{
        background: 'linear-gradient(180deg, rgba(13, 27, 42, 0.4) 0%, rgba(13, 27, 42, 0.1) 50%, rgba(13, 27, 42, 0) 100%)'
      }}>
        <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-[1600px] mx-auto">
          <Logo />

          {/* Desktop Navigation */}
          {!hasSidebar && (
            <nav className="hidden md:flex items-center gap-2">
              {publicNavItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] flex gap-2 overflow-hidden px-4 py-1.5 rounded-full transition-all text-sm font-medium border border-white/5 ${
                    pathname === item.href 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-navy">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link 
                  href={
                    user?.role === 'ADMIN' || user?.isAdmin ? '/super-admin/dashboard' :
                    user?.role === 'MODERATOR' ? '/platform-admin/dashboard' :
                    user?.role === 'TUTOR' ? '/tutor/dashboard' :
                    user?.role === 'PARENT' ? '/parent/dashboard' :
                    user?.role === 'SCHOOL' ? '/school/dashboard' :
                    '/student/dashboard'
                  } 
                  className="flex items-center gap-2 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-full pl-1 pr-1.5 md:pr-4 py-1 hover:bg-white/10 transition-all group shrink-0"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green text-navy flex items-center justify-center font-black text-[10px] md:text-xs group-hover:scale-105 transition-transform">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div className="flex flex-col leading-tight pr-1 md:pr-0">
                    <span className="text-[10px] md:text-sm font-black text-white">{user?.name?.split(' ')[0]}</span>
                    <span className="text-[7px] md:text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Dashboard</span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 md:gap-3">
                <Link href="/login" className="text-xs md:text-sm font-bold text-gray-400 hover:text-white transition-colors px-2 md:px-4 py-2">
                  Login
                </Link>
                <Link href="/signup" className="bg-green text-navy text-[10px] md:text-sm font-black px-4 md:px-6 py-2 rounded-full hover:bg-green/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  GET STARTED
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {!hasSidebar && (
              <button 
                className="md:hidden p-2 text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && !hasSidebar && (
          <div className="md:hidden border-t border-white/5 bg-navy/95 backdrop-blur-xl">
            <nav className="flex flex-col p-4 space-y-2">
              {publicNavItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    pathname === item.href 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation (Sync with ExamsPRO look) */}
      {!hasSidebar && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-xl border-t border-white/5 px-4 py-3 flex items-center justify-between pb-4">
          <Link 
            href="/" 
            className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </Link>
          <Link 
            href="/tutors" 
            className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/tutors' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Tutors</span>
          </Link>
          <Link 
            href="/blog" 
            className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/blog' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
          >
            <BookText className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Blog</span>
          </Link>
          <Link 
            href="/pricing" 
            className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/pricing' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Pricing</span>
          </Link>
        </nav>
      )}
    </>
  );
};

export default Navbar;
