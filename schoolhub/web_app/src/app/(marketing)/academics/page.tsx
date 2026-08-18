'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import FeatureSplit from '@/components/FeatureSplit/FeatureSplit';
import StaggeredGallery from '@/components/StaggeredGallery/StaggeredGallery';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function AcademicsPage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading Academics...
      </div>
    );
  }

  const { academics } = tenantInfo.content;

  return (
    <>
      <HeroEditorial 
        title={academics.hero_title}
        subtitle={academics.hero_subtitle}
        image={academics.hero_image}
      />

      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2>Blended Curriculum</h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p style={{ maxWidth: '600px' }}>{academics.curriculum}</p>
          </ScrollReveal>
        </div>
      </section>

      <FeatureSplit 
        title="Primary Foundation"
        description="Building core literacy and numeracy skills while fostering curiosity and a love for learning."
        imageMain="/photo06.jpeg"
        imageSecondary="/photo03.jpeg"
      />

      <FeatureSplit 
        title="Secondary & A-Levels"
        description="Focused preparation for examinations and university entrance, ensuring 100% success rates."
        imageMain="/photo07.jpeg"
        imageSecondary="/photo13.jpeg"
        reverse
      />

      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>Learning Environments</h2>
          </ScrollReveal>
          <StaggeredGallery images={['/photo02.jpeg', '/photo04.jpeg', '/photo08.jpeg', '/photo10.jpeg']} />
        </div>
      </section>
    </>
  );
}
