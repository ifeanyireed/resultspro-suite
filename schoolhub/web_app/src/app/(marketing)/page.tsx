'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import FeatureSplit from '@/components/FeatureSplit/FeatureSplit';
import StaggeredGallery from '@/components/StaggeredGallery/StaggeredGallery';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function Home() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  const galleryImages = [
    '/photo02.jpeg',
    '/photo03.jpeg',
    '/photo04.jpeg',
    '/photo05.jpeg',
    '/photo06.jpeg',
  ];

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading Digital Campus...
      </div>
    );
  }

  const { content } = tenantInfo;
  const home = content.home;

  return (
    <>
      <HeroEditorial 
        title={home.hero_title}
        subtitle={home.hero_subtitle}
        image={home.hero_image}
      />

      <FeatureSplit 
        title="A Legacy of Excellence"
        description="Founded on the principles of discipline and academic rigor, Loral International Schools has been a beacon of quality education in Nigeria for over four decades."
        imageMain="/photo08.jpeg"
        imageSecondary="/photo11.jpeg"
      />

      <section className="section section-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'center' }}>
            <div>
              <ScrollReveal animation="fade-up">
                <span className="caption">Our Mission</span>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
                <h2 style={{ marginTop: 'var(--space-sm)' }}>{home.mission}</h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={400}>
                <p>{home.mission_text}</p>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="slide-left">
              <div style={{ padding: 'var(--space-md)', borderLeft: '2px solid var(--color-light-blue)' }}>
                <p style={{ fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--color-text-on-white)', textShadow: 'none' }}>&ldquo;Education is not just about books; it&rsquo;s about the soul of the child.&rdquo;</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', color: '#ffffff' }}>Our Facilities</h2>
          </ScrollReveal>
          <StaggeredGallery images={galleryImages} />
        </div>
      </section>

      <FeatureSplit 
        title="Future-Ready Skills"
        description="Integrating Coding, Robotics, and AI into the core curriculum to prepare our students for the global digital economy."
        imageMain="/photo09.jpeg"
        imageSecondary="/photo04.jpeg"
        reverse
      />

      <section className="section section-white" style={{ paddingBottom: 'var(--space-lg)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollReveal animation="fade-up">
            <span className="caption">Admissions Open</span>
            <h2 style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>Start Your Journey Today</h2>
            <a href="/admissions/apply" className="btn btn-primary">Apply Now</a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
