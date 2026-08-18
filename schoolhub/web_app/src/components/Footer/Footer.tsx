import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import ScrollReveal from '../ScrollReveal/ScrollReveal';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className={styles.grid}>
            <div className={styles.brand}>
              <Image 
                src="/logo.png" 
                alt="Loral Logo" 
                width={100} 
                height={100} 
                style={{ width: 'auto', height: '80px' }}
                className={styles.footerLogo}
              />
              <p>Moulding the tender life of a child since 1978.</p>
            </div>
            <div className={styles.links}>
              <h4>School</h4>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/academics">Academics</Link></li>
                <li><Link href="/future-skills">Future Skills</Link></li>
                <li><Link href="/student-life">Student Life</Link></li>
                <li><Link href="/news">News & Events</Link></li>
              </ul>
            </div>
            <div className={styles.links}>
              <h4>Admissions</h4>
              <ul>
                <li><Link href="/admissions/apply">Apply Now</Link></li>
                <li><Link href="/admissions/tour">Book a Tour</Link></li>
                <li><Link href="/admissions/inquiry">Make Inquiry</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div className={styles.links}>
              <h4>Contact</h4>
              <p>Festac Town, Lagos</p>
              <p>Igbesa, Ogun State</p>
              <p>info@loralintlschools.com</p>
            </div>
          </div>
          <p className={styles.copyrightText}>
            &copy; {new Date().getFullYear()} Loral International Schools. Powered by SchoolHub.
          </p>
        </ScrollReveal>
      </div>
    </footer>
  );
}
