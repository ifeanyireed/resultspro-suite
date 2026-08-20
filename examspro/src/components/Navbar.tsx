"use client";

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { IconBell as Bell, IconChevronDown as ChevronDown, IconBolt as Zap, IconSword as Sword, IconBrain as Brain, IconBook as BookText, IconHome as Home, IconUser as User, IconTrophy as Trophy, IconLayoutDashboard as LayoutDashboard, IconShoppingBag as ShoppingBag } from '@tabler/icons-react';
import { getUnreadCount } from '@/lib/notifications.api';

const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<Record<string, string>>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFeatureFlags();
    
    const checkNarrow = () => {
      setIsNarrow(window.innerWidth < 1440);
    };
    checkNarrow();
    window.addEventListener('resize', checkNarrow);

    if (isAuthenticated) {
      fetchUnreadCount();
      // Polling for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', checkNarrow);
      };
    }
    return () => window.removeEventListener('resize', checkNarrow);
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count');
    }
  };

  const fetchFeatureFlags = async () => {
    try {
      const res = await api.get('/public/settings');
      setFeatureFlags(res.data);
    } catch (err) {
      console.error('Failed to fetch feature flags');
    }
  };

  const navItems = [
    { name: 'Practice', enabled: true },
    { name: 'Live Games', enabled: featureFlags['live_games_enabled'] !== 'false' },
    { name: 'Battle Mode', enabled: featureFlags['battle_mode_enabled'] !== 'false' },
    { name: 'AI Tutor', enabled: isAuthenticated },
    { name: 'Leaderboard', enabled: true },
    { name: 'Referral', enabled: true },
    { name: 'Blog', enabled: true },
    { name: 'Shop', enabled: true },
    { name: 'Admin', enabled: isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'MODERATOR') },
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
              ['Practice', 'Live Games', 'Battle Mode', 'Leaderboard', 'Referral', 'Shop'].map((item) => (
                <div key={item} className="px-4 py-1.5 h-8 w-24 bg-white/5 animate-pulse rounded-full" />
              ))
            ) : (
              navItems
                .filter((item) => item.enabled)
                .filter((item) => {
                  // If narrow, hide Live Games and Battle Mode (they'll be under Practice dropdown)
                  if (isNarrow && (item.name === 'Live Games' || item.name === 'Battle Mode')) {
                    return false;
                  }
                  return true;
                })
                .map((item) => {
                  const href = item.name.toLowerCase().replace(/\s+/g, '-');
                  let finalHref = href === 'live-games' ? '/live' : href === 'ai-tutor' ? '/study-assistant' : `/${href}`;
                  
                  if (item.name === 'Admin') finalHref = '/admin/dashboard';
                  if (item.name === 'Practice' && isNarrow) {
                    return (
                      <div key={item.name} className="relative group">
                        <button 
                          className="justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] flex gap-2 overflow-hidden px-4 py-1.5 rounded-full transition-all text-gray-300 group-hover:text-white text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] border border-white/5"
                        >
                          Practice <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-navy/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] py-2">
                          <Link 
                            href="/practice"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center">
                               <Brain className="w-4 h-4 text-green" />
                            </div>
                            <div>
                              <div className="font-bold">Practice Mode</div>
                              <div className="text-[10px] opacity-50">Standard study & exams</div>
                            </div>
                          </Link>
                          {featureFlags['live_games_enabled'] !== 'false' && (
                            <Link 
                              href="/live"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center">
                                 <Zap className="w-4 h-4 text-blue" />
                              </div>
                              <div>
                                <div className="font-bold">Live Games</div>
                                <div className="text-[10px] opacity-50">Real-time multiplayer</div>
                              </div>
                            </Link>
                          )}
                          {featureFlags['battle_mode_enabled'] !== 'false' && (
                            <Link 
                              href="/battle-mode"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                                 <Sword className="w-4 h-4 text-amber" />
                              </div>
                              <div>
                                <div className="font-bold">Battle Mode</div>
                                <div className="text-[10px] opacity-50">1v1 competitive play</div>
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link 
                      key={item.name}
                      href={finalHref}
                      className={`justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] flex gap-2 overflow-hidden px-4 py-1.5 rounded-full transition-all text-gray-300 hover:text-white text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] border border-white/5 ${item.name === 'AI Tutor' ? 'text-green border-green/20 bg-green/5' : ''}`}
                    >
                      {item.name}
                    </Link>
                  );
                })
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {mounted && isAuthenticated && (
              <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-navy">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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
              <Link href="/profile" className="flex items-center gap-2 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-full pl-1 pr-1.5 md:pr-4 py-1 hover:bg-white/10 transition-all group shrink-0">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green text-navy flex items-center justify-center font-black text-[10px] md:text-xs group-hover:scale-105 transition-transform">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col leading-tight pr-1 md:pr-0">
                  <span className="text-[10px] md:text-sm font-black">{user?.coinBalance}</span>
                  <span className="text-[7px] md:text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Coins</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-xl border-t border-white/5 px-4 py-3 flex items-center justify-between pb-4">
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/dashboard' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </Link>
        <Link 
          href="/practice" 
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/practice') ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <Brain className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Practice</span>
        </Link>
        <Link 
          href="/live" 
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/live' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Live</span>
        </Link>
        <Link 
          href="/battle-mode" 
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/battle-mode') ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <Sword className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Battle</span>
        </Link>
        <Link 
          href="/leaderboard" 
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/leaderboard' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Ranks</span>
        </Link>
        <Link 
          href="/shop" 
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/shop' ? 'text-green' : 'text-gray-500 hover:text-green'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Shop</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
