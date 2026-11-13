"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useTenant } from '@/components/TenantProvider';
import { getUnreadCount } from '@/lib/notifications.api';
import { IconBell as Bell } from '@tabler/icons-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { tenant } = useTenant();
  
  const schoolName = tenant?.name || 'Greenwood High Academy';
  const schoolLogo = tenant?.logo_url || '/logo.png';

  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);

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

  const navItems = [
    { label: 'Facilities', href: '/#facilities' },
    { label: 'Admissions', href: '/#admissions' },
    { label: 'News & Events', href: '/#news' },
    { label: 'Notice Board', href: '/#notices' },
    { label: 'Our Team', href: '/#team' },
  ];

  const isActive = (href: string) => pathname.startsWith(href) && href !== '/';

  return (
    <>
      <div aria-hidden style={{ height: '72px', width: '100%', flexShrink: 0, display: 'block', background: 'var(--color-nets-navy-dark)' }} />
      <header
        role="banner"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '72px',
          display: 'flex', alignItems: 'center',
          background: scrolled ? 'var(--color-nets-navy-dark)' : 'var(--color-nets-navy-dark)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div className="container-nets" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

          {/* Logo */}
          <Link href="/" aria-label={schoolName} style={{ display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'opacity 0.2s ease', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <img src={schoolLogo} alt={`${schoolName} Logo`} style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
            <span style={{ marginLeft: '12px', fontSize: '1.25rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{schoolName}</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary Desktop" style={{ gap: '2rem', alignItems: 'center' }} className="nav-desktop">
            {mounted ? (
              navItems.map(l => (
                <Link key={l.label} href={l.href} className="nav-link">{l.label}</Link>
              ))
            ) : (
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ width: '60px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                <div style={{ width: '80px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                <div style={{ width: '70px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
              </div>
            )}
            
            {mounted && !isAuthenticated ? (
              <Link href="/#admissions" className="btn btn-red" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
                Apply Now
              </Link>
            ) : mounted && isAuthenticated ? (
              <Link href="/student/dashboard" className="btn btn-red" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
                Go to Portal
              </Link>
            ) : null}
          </nav>

          {/* Desktop actions (Auth/Profile) */}
          <div style={{ alignItems: 'center', gap: '1rem' }} className="nav-desktop-actions">
            {mounted && !isAuthenticated ? (
              <Link href="/login" className="btn btn-outline-white btn-sm" style={{ textDecoration: 'none' }}>
                Portal Login
              </Link>
            ) : mounted && isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <Link href="/student/dashboard" className="btn btn-red btn-sm" style={{ textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <Link href="/notifications" style={{ position: 'relative', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                  <Bell style={{ width: '20px', height: '20px' }} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: 'var(--color-nets-red)', color: '#0D1060', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/student/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', overflow: 'hidden' }}>
                    <img src={`/avatars/character${((user?.id?.charCodeAt(0) || 0) % 20) + 1}.jpg`} alt={(user as any)?.name || (user as any)?.full_name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  <img src={schoolLogo} alt={`${schoolName} Logo`} style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{ marginLeft: '12px', fontSize: '1.25rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{schoolName}</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem', padding: '0.5rem', cursor: 'pointer' }}>✕</button>
              </div>

              <nav aria-label="Mobile Navigation" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', textDecoration: 'none' }}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05), duration: 0.3, ease: 'easeOut' }}
                        style={{ 
                          padding: '1rem', 
                          fontSize: '1.25rem', 
                          fontWeight: active ? 600 : 500, 
                          color: active ? 'var(--color-nets-red)' : '#fff', 
                          borderLeft: active ? '3px solid var(--color-nets-red)' : '3px solid transparent',
                          background: active ? 'rgba(251, 188, 4, 0.12)' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {l.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}
                style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <Link href="/#admissions" onClick={() => setMobileOpen(false)} className="btn btn-red" style={{ width: '100%', justifyContent: 'center', padding: '1rem', border: 'none', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
                  Apply for Admission
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline-white" style={{ width: '100%', justifyContent: 'center', padding: '1rem', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
                  Portal Login
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
