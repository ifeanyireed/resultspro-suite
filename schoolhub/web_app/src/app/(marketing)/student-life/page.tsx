'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import FeatureSplit from '@/components/FeatureSplit/FeatureSplit';
import StaggeredGallery from '@/components/StaggeredGallery/StaggeredGallery';

export default function StudentLifePage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading Student Life...
      </div>
    );
  }

  const { student_life } = tenantInfo.content;

  return (
    <>
      <HeroEditorial 
        title={student_life.hero_title}
        subtitle={student_life.hero_subtitle}
        image={student_life.hero_image}
        ctaText="Discover More"
        ctaLink="#community"
      />

      <section id="community" className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <span className="caption">A Vibrant Community</span>
            <h2 style={{ maxWidth: '800px', marginTop: 'var(--space-sm)' }}>{student_life.community}</h2>
          </ScrollReveal>
        </div>
      </section>

      <FeatureSplit 
        title="Sports & Athletics"
        description="Our state-of-the-art sports facilities and professional coaching programs encourage every student to stay active, healthy, and competitive. From inter-house sports to national championships, we foster excellence in every field."
        imageMain="/photo06.jpeg"
        imageSecondary="/photo07.jpeg"
      />

      <section className="section section-white">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>Arts, Music & Culture</h2>
          </ScrollReveal>
          <StaggeredGallery images={['/photo12.jpeg', '/photo13.jpeg', '/photo02.jpeg', '/photo03.jpeg']} />
        </div>
      </section>

      <FeatureSplit 
        title="Leadership & Clubs"
        description="Developing the leaders of tomorrow through diverse clubs and extracurricular activities. Whether it's Chess, Music, Drama, or Community Service, our students find their passion and build confidence."
        imageMain="/photo10.jpeg"
        imageSecondary="/photo01.jpeg"
        reverse
      />

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollReveal animation="fade-up">
            <h2 style={{ marginBottom: 'var(--space-lg)', color: 'white' }}>Join a vibrant student body today.</h2>
            <a href="/admissions/apply" className="btn btn-primary">Begin Application</a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
