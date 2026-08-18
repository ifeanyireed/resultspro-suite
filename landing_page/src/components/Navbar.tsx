'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar on admin and onboard routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/super-admin') || pathname?.startsWith('/agent') || pathname?.startsWith('/onboard') || pathname?.startsWith('/sample-home')) {
    return null;
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo.png" 
              alt="ResultsPRO Logo" 
              width={150} 
              height={150} 
              priority
              style={{ width: 'auto', height: '132px' }}
              className={styles.logoImage}
            />
          </Link>
          <div className={styles.links}>
            <Link href="/blog">Blog</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.actions}>
            <Link href="https://auth.resultspro.ng" className={styles.portalLink}>Login</Link>
            <Link href="/onboard" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
