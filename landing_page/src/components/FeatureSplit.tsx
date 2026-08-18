import Image from 'next/image';
import styles from './FeatureSplit.module.css';
import ScrollReveal from './ScrollReveal';

interface FeatureSplitProps {
  title: string;
  description: string;
  imageMain: string;
  imageSecondary: string;
  reverse?: boolean;
  linkText?: string;
  linkHref?: string;
}

export default function FeatureSplit({ 
  title, 
  description, 
  imageMain, 
  imageSecondary, 
  reverse,
  linkText = "Explore Solution",
  linkHref = "/#products"
}: FeatureSplitProps) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid} ${reverse ? styles.reverse : ''}`}>
        <div className={styles.images}>
          <ScrollReveal animation="fade-up" className={styles.mainWrapper}>
            <div className={styles.mainImage}>
              <Image src={imageMain} alt={title} fill style={{ objectFit: 'cover' }} />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200} className={styles.secondaryWrapper}>
            <div className={styles.secondaryImage}>
              <Image src={imageSecondary} alt="Secondary" fill style={{ objectFit: 'cover' }} />
            </div>
          </ScrollReveal>
        </div>
        <div className={styles.content}>
          <ScrollReveal animation="fade-up">
            <h2 className={styles.title}>{title}</h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <div className={styles.divider}></div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={400}>
            <p className={styles.description}>{description}</p>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={600}>
            <a href={linkHref} className={styles.link}>{linkText} —</a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
