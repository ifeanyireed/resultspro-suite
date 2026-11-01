'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo.png" 
              alt="Loral Logo" 
              width={80} 
              height={80} 
              priority
              style={{ width: 'auto', height: '60px' }}
              className={styles.logoImage}
            />
          </Link>
          <div className={styles.links}>
            <Link href="/about">Story</Link>
            <Link href="/academics">Academics</Link>
            <Link href="/future-skills">Innovation</Link>
            <Link href="/student-life">Student Life</Link>
            <Link href="/admissions">Admissions</Link>
          </div>
          <div className={styles.actions}>
            <Link href="/portal" className={styles.portalLink}>Portal</Link>
            <Link href="/admissions/apply" className="btn btn-primary">Apply</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
