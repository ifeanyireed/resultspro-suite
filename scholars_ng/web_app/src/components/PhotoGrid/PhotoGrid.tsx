import Image from 'next/image';
import styles from './PhotoGrid.module.css';
import ScrollReveal from '../ScrollReveal/ScrollReveal';

interface PhotoGridProps {
  title: string;
  images: string[];
}

export default function PhotoGrid({ title, images }: PhotoGridProps) {
  return (
    <section className="section">
      <div className="container">
        <ScrollReveal animation="fade-in">
          <h2 className={styles.title}>{title}</h2>
        </ScrollReveal>
        <div className={styles.grid}>
          {images.map((img, i) => (
            <ScrollReveal 
              key={i} 
              animation={i % 2 === 0 ? 'slide-right' : 'slide-left'} 
              delay={i * 100}
              className={styles.gridItem}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={img} 
                  alt={`Facility ${i + 1}`} 
                  fill 
                  className={styles.image}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
