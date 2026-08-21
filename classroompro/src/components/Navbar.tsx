"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { getUnreadCount } from '@/lib/notifications.api';
import { IconBell as Bell } from '@tabler/icons-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<Record<string, string>>({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchFeatureFlags();

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('scroll', handleScroll);
      };
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // silently fail
    }
  };

  const fetchFeatureFlags = async () => {
    try {
      const res = await api.get('/public/settings');
      setFeatureFlags(res.data);
    } catch (err) {
      // silently fail
    }
  };

  const navItems = [
    { label: 'Features', href: '/#features', enabled: true },
    { label: 'For Schools', href: '/schools', enabled: true },
    { label: 'Pricing', href: '/pricing', enabled: true },
    { label: 'Contact', href: '/contact', enabled: true },
    { label: 'Dashboard', href: '/dashboard', enabled: isAuthenticated },
  ].filter(i => i.enabled);

  const isActive = (href: string) => pathname.startsWith(href) && href !== '/';

  return (
    <>
      <div aria-hidden style={{ height: '72px', width: '100%', flexShrink: 0, display: 'block' }} />
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '72px',
          zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled ? 'var(--color-nets-navy-dark)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="container-nets" style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/logo.png" alt="ClassroomPRO Logo" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
              <span style={{ marginLeft: '12px', fontSize: '1.25rem', fontWeight: 900, color: 'white', letterSpacing: '-0.05em' }}>ClassroomPRO</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="nav-desktop-links" aria-label="Main Navigation">
            {navItems.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className="nav-link"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    marginLeft: '20px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions (Auth/Profile) */}
          <div style={{ alignItems: 'center', gap: '1.25rem' }} className="nav-desktop-actions">
            {mounted && !isAuthenticated ? (
              <Link href="/login" className="btn btn-red btn-sm" style={{ textDecoration: 'none' }}>
                Log In
              </Link>
            ) : mounted && isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <Link href="/notifications" style={{ position: 'relative', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                  <Bell style={{ width: '20px', height: '20px' }} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: 'var(--color-nets-red)', color: 'white', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', padding: '0.5rem', flexDirection: 'column', gap: '5px', flexShrink: 0, cursor: 'pointer' }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: '24px', height: '2px', background: '#fff', borderRadius: '1px' }} />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />

            <motion.div key="dr" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              role="dialog" aria-modal aria-label="Navigation"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px',
                zIndex: 300, background: 'var(--color-nets-navy-dark)',
                display: 'flex', flexDirection: 'column', padding: '2rem',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexShrink: 0 }}>
                <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src="/logo.png" alt="ClassroomPRO Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{ marginLeft: '12px', fontSize: '1.25rem', fontWeight: 900, color: 'white', letterSpacing: '-0.05em' }}>ClassroomPRO</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem', padding: '0.5rem', cursor: 'pointer' }}>✕</button>
              </div>

              <nav aria-label="Mobile Navigation" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((l, i) => {
                  const active = isActive(l.href);
                  const content = (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.05), duration: 0.3, ease: 'easeOut' }}
                      style={{ 
                        padding: '1rem', 
                        fontSize: '1.25rem', 
                        fontWeight: active ? 600 : 500, 
                        color: active ? 'var(--color-nets-red)' : '#fff', 
                        borderLeft: active ? '3px solid var(--color-nets-red)' : '3px solid transparent',
                        background: active ? 'rgba(192, 39, 45, 0.05)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {l.label}
                    </motion.div>
                  )
                  return (
                    <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', textDecoration: 'none' }}>
                      {content}
                    </Link>
                  )
                })}
              </nav>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}
                style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                {!isAuthenticated ? (
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn btn-red" style={{ width: '100%', justifyContent: 'center', padding: '1rem', border: 'none', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
                    Sign Up Free
                  </Link>
                ) : (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn btn-red" style={{ width: '100%', justifyContent: 'center', padding: '1rem', border: 'none', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
                    Go to Dashboard
                  </Link>
                )}

                {/* Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <a href="mailto:hello@resultspro.ng" style={{ fontSize: '0.875rem', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Email</span> hello@resultspro.ng
                  </a>
                  <div style={{ fontSize: '0.875rem', color: '#fff', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>HQ</span> 
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
