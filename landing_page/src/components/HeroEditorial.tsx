import Image from 'next/image';
import styles from './HeroEditorial.module.css';
import ScrollReveal from './ScrollReveal';

interface HeroEditorialProps {
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  tagline?: string;
}

export default function HeroEditorial({ 
  title, 
  subtitle, 
  image, 
  ctaText = "Partner with Us", 
  ctaLink = "/contact",
  secondaryCtaText = "Our Vision",
  secondaryCtaLink = "/#ecosystem",
  tagline = "The Education Infrastructure"
}: HeroEditorialProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <ScrollReveal animation="fade-up" delay={100}>
            <span className="caption">{tagline}</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={300}>
            <h1 className={styles.title}>{title}</h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={500}>
            <p className={styles.subtitle}>{subtitle}</p>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={700}>
            <div className={styles.actions}>
              <a href={ctaLink} className="btn btn-primary">{ctaText}</a>
              <a href={secondaryCtaLink} className="btn btn-secondary">{secondaryCtaText}</a>
            </div>
          </ScrollReveal>
        </div>
        <div className={styles.imageContainer}>
          <ScrollReveal animation="zoom-in" className={styles.revealWrapper}>
            <div className={styles.imageWrapper}>
              <Image 
                src={image} 
                alt="Editorial Hero" 
                fill 
                priority
                className={styles.image}
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.line}></div>
      </div>
    </section>
  );
}
