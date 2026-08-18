import styles from './Testimonials.module.css';
import ScrollReveal from './ScrollReveal';
import Image from 'next/image';

const testimonials = [
  {
    quote: "ResultsPRO has completely transformed how we manage our academic data. What used to take weeks now takes minutes.",
    author: "Dr. Adebayo",
    role: "School Administrator",
    avatar: "/photo09.jpeg"
  },
  {
    quote: "The ExamsPRO platform made preparing for my finals so much more engaging. I felt ready and confident.",
    author: "Chidi E.",
    role: "Student",
    avatar: "/photo12.jpeg"
  },
  {
    quote: "As a teacher, the insights I get from ResultsPRO help me identify exactly where my students need more support.",
    author: "Mrs. Okonjo",
    role: "Lead Teacher",
    avatar: "/photo11.jpeg"
  }
];

export default function Testimonials() {
  return (
    <section className="section section-white" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-lg)' }}>
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className={styles.header}>
            <span className="caption">Testimonials</span>
            <h2>What Our Community Says</h2>
          </div>
        </ScrollReveal>
        
        <div className={styles.row}>
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={i * 200} className={styles.revealWrapper}>
              <div className={styles.item}>
                <div className={styles.quoteIcon}>&ldquo;</div>
                <blockquote className={styles.quote}>{t.quote}</blockquote>
                <div className={styles.author}>
                  <div className={styles.avatarWrapper}>
                    <Image src={t.avatar} alt={t.author} className={styles.avatar} width={48} height={48} />
                  </div>
                  <div>
                    <div className={styles.name}>{t.author}</div>
                    <div className={styles.role}>{t.role}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
