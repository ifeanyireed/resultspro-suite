'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import ScrollReveal from './ScrollReveal';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const pathname = usePathname();

  // Hide footer on admin and onboard routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/super-admin') || pathname?.startsWith('/agent') || pathname?.startsWith('/onboard') || pathname?.startsWith('/sample-home')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className={styles.grid}>
            <div className={styles.brand}>
              <Image 
                src="/logo.png" 
                alt="ResultsPRO Logo" 
                width={180} 
                height={180} 
                style={{ width: 'auto', height: '144px' }}
                className={styles.footerLogo}
              />
              <p>The digital foundation for schools to scale excellence and track student progress with intelligence.</p>
            </div>
            <div className={styles.links}>
              <h4>Products</h4>
              <ul>
                <li><Link href="/#ecosystem">SchoolHub</Link></li>
                <li><Link href="/#ecosystem">ExamsPRO</Link></li>
                <li><Link href="/#ecosystem">ClassroomPRO</Link></li>
                <li><Link href="/#ecosystem">ResultsPRO</Link></li>
                <li><Link href="/#ecosystem">TutorsPRO</Link></li>
              </ul>
            </div>
            <div className={styles.links}>
              <h4>Legal</h4>
              <ul>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            <div className={styles.links}>
              <h4>Contact</h4>
              <p>Nigeria Office</p>
              <p>+234 (0) 800 000 0000</p>
              <p>hello@resultspro.ng</p>
              
              <div className={styles.subscription}>
                <h5>Subscribe to Insights</h5>
                {status === 'success' ? (
                  <p className={styles.success}>Thanks for joining!</p>
                ) : (
                  <form className={styles.footerForm} onSubmit={handleSubmit}>
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.footerInput} 
                      required
                      disabled={status === 'loading'}
                    />
                    <button type="submit" className={styles.footerSubmit} disabled={status === 'loading'}>
                      {status === 'loading' ? '...' : '→'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          <p className={styles.copyrightText}>
            &copy; {new Date().getFullYear()} ResultsPRO NG. All rights reserved.
          </p>
        </ScrollReveal>
      </div>
    </footer>
  );
}
