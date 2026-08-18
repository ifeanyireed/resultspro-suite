import Image from 'next/image';
import styles from './PhotoHero.module.css';
import ScrollReveal from './ScrollReveal';

interface PhotoHeroProps {
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  tagline?: string;
}

export default function PhotoHero({ title, subtitle, image, ctaText, ctaLink, tagline = "Official Insights" }: PhotoHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image 
          src={image} 
          alt={title} 
          fill 
          priority
          className={styles.image}
        />
        <div className={styles.overlay}></div>
      </div>
      <div className="container">
        <div className={styles.content}>
          <ScrollReveal animation="fade-up">
            <span className="caption" style={{ color: 'white', marginBottom: '1rem', display: 'block' }}>{tagline}</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className={styles.title} style={{ color: 'white', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>{title}</h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={400}>
            <p className={styles.subtitle} style={{ color: 'white', opacity: 0.9 }}>{subtitle}</p>
          </ScrollReveal>
          {ctaText && ctaLink && (
            <ScrollReveal animation="fade-up" delay={600}>
              <a href={ctaLink} className="btn btn-primary">{ctaText}</a>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
