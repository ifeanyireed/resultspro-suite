'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroEditorial from '@/components/HeroEditorial/HeroEditorial';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function AdmissionsPage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading Admissions...
      </div>
    );
  }

  const { admissions } = tenantInfo.content;

  return (
    <>
      <HeroEditorial 
        title={admissions.hero_title}
        subtitle={admissions.hero_subtitle}
        image={admissions.hero_image}
      />
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            {[
              { title: 'Apply Now', link: '/admissions/apply' },
              { title: 'Book a Tour', link: '/admissions/tour' },
              { title: 'Enquiry', link: '/admissions/inquiry' }
            ].map((box, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
                <div style={{ padding: 'var(--space-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <h3>{box.title}</h3>
                  <a href={box.link} className="btn btn-secondary" style={{ marginTop: 'var(--space-md)' }}>Get Started</a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
