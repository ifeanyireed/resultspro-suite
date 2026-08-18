import Image from 'next/image';
import styles from './AppDownload.module.css';
import ScrollReveal from './ScrollReveal';

export default function AppDownload() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <ScrollReveal animation="fade-up">
              <span className="caption">Mobile Experience</span>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <h2 className={styles.title}>SchoolHub in Your Pocket</h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={400}>
              <p className={styles.description}>
                Take your digital campus everywhere. Access results, manage assignments, and stay connected with your school community on the go.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={600}>
              <div className={styles.actions}>
                <a href="#" className={styles.storeButton}>
                   <svg viewBox="0 0 24 24" className={styles.storeIcon} fill="currentColor">
                     <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z"/>
                   </svg>
                   <div className={styles.buttonInner}>
                      <span className={styles.smallText}>Download on the</span>
                      <span className={styles.largeText}>App Store</span>
                   </div>
                </a>
                <a href="#" className={styles.storeButton}>
                   <svg viewBox="0 0 466 511.98" className={styles.storeIcon}>
                     <path fill="#EA4335" d="M199.9 237.8 1.4 470.17c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46L199.9 237.8z"/>
                     <path fill="#FBBC04" d="m433.91 205.1-104.65-60-111.61 110.22 113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22z"/>
                     <path fill="#34A853" d="M199.42 273.45 329.27 145.1 87.9 8.37C79.53 2.79 68.36 0 57.2 0 30.7 0 6.98 18.14 1.4 41.86l198.02 231.59z"/>
                     <path fill="#4285F4" d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86z"/>
                   </svg>
                   <div className={styles.buttonInner}>
                      <span className={styles.smallText}>Get it on</span>
                      <span className={styles.largeText}>Google Play</span>
                   </div>
                </a>
              </div>
            </ScrollReveal>
          </div>
          
          <div className={styles.imageContainer}>
             <ScrollReveal animation="zoom-in" delay={300} className={styles.monsterWrapper}>
                <Image 
                  src="/monster_studying.png" 
                  alt="Studying Monster" 
                  width={240} 
                  height={240} 
                  className={styles.monster}
                />
             </ScrollReveal>
             <ScrollReveal animation="slide-left" delay={500} className={styles.phoneWrapper}>
                <div className={styles.phoneFrame}>
                   <Image 
                      src="/photo12.jpeg" 
                      alt="App Interface" 
                      fill 
                      style={{ objectFit: 'cover' }}
                      className={styles.screenImage}
                   />
                </div>
             </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
