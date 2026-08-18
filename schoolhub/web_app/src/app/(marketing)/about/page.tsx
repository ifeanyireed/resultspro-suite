'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import FeatureSplit from '@/components/FeatureSplit/FeatureSplit';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function AboutPage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading About Us...
      </div>
    );
  }

  const { about } = tenantInfo.content;

  return (
    <>
      <HeroEditorial 
        title={about.hero_title}
        subtitle={about.hero_subtitle}
        image={about.hero_image}
      />

      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 style={{ maxWidth: '800px' }}>{about.history_title}</h2>
          </ScrollReveal>
        </div>
      </section>

      <FeatureSplit 
        title="Leadership with Vision"
        description={about.leadership}
        imageMain="/photo12.jpeg"
        imageSecondary="/photo02.jpeg"
        reverse
      />

      <section className="section section-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            {[
              { title: 'Excellence', desc: 'We never settle for mediocrity in academics or character.' },
              { title: 'Discipline', desc: 'The bedrock of success in a global society.' },
              { title: 'Innovation', desc: 'Embracing the tools of tomorrow, today.' }
            ].map((value, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
                <div style={{ padding: 'var(--space-md)' }}>
                  <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-sky-blue)' }}>{value.title}</h3>
                  <p style={{ color: 'var(--color-sky-blue)', opacity: 0.8 }}>{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
