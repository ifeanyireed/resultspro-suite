'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import FeatureSplit from '@/components/FeatureSplit/FeatureSplit';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function FutureSkillsPage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading Future Skills...
      </div>
    );
  }

  const { future_skills } = tenantInfo.content;

  return (
    <>
      <HeroEditorial 
        title={future_skills.hero_title}
        subtitle={future_skills.hero_subtitle}
        image={future_skills.hero_image}
      />

      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2>ScholarsNG Integration</h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p style={{ maxWidth: '600px' }}>{future_skills.scholars_text}</p>
          </ScrollReveal>
        </div>
      </section>

      <FeatureSplit 
        title="Robotics & AI"
        description="Hands-on learning with advanced robotics kits and artificial intelligence modules."
        imageMain="/photo04.jpeg"
        imageSecondary="/photo10.jpeg"
      />

      <FeatureSplit 
        title="Coding & Design"
        description="From web development to 3D modeling, our students master the languages of the future."
        imageMain="/photo08.jpeg"
        imageSecondary="/photo01.jpeg"
        reverse
      />
    </>
  );
}
