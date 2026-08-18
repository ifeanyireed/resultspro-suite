import Image from 'next/image';
import styles from './StaggeredGallery.module.css';
import ScrollReveal from './ScrollReveal';

interface StaggeredGalleryProps {
  images: string[];
}

export default function StaggeredGallery({ images }: StaggeredGalleryProps) {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.grid}>
          {images.map((img, i) => (
            <ScrollReveal 
              key={i} 
              animation="fade-up" 
              delay={i * 100}
              className={`${styles.item} ${styles[`item${(i % 5) + 1}`]}`}
            >
              <div className={styles.imageWrapper}>
                <Image src={img} alt={`Gallery ${i}`} fill style={{ objectFit: 'cover' }} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
