'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import PhotoHero from '@/components/PhotoHero/PhotoHero';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import Image from 'next/image';

export default function NewsPage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/info')
      .then(res => setTenantInfo(res.data))
      .catch(err => console.error('Failed to load tenant info:', err));
  }, []);

  if (!tenantInfo) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Loading News...
      </div>
    );
  }

  const { news } = tenantInfo.content;

  const newsItems = [
    {
      title: "Inter-House Sports 2026: A Display of Athletic Excellence",
      date: "May 15, 2026",
      category: "Sports",
      image: "/photo06.jpeg",
      excerpt: "Students from all houses competed in various track and field events at our Igbesa campus..."
    },
    {
      title: "Loral Students Shine at National Robotics Competition",
      date: "April 20, 2026",
      category: "Innovation",
      image: "/photo04.jpeg",
      excerpt: "Our robotics team secured first place with their innovative AI-driven waste management drone..."
    },
    {
      title: "Upcoming Entrance Examination Dates Announced",
      date: "March 10, 2026",
      category: "Admissions",
      image: "/photo10.jpeg",
      excerpt: "Applications are now being accepted for the 2026/2027 academic session. View key dates here..."
    }
  ];

  return (
    <>
      <PhotoHero 
        title={news.hero_title} 
        subtitle={news.hero_subtitle} 
        image={news.hero_image} 
      />
      
      <section className="section section-white">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 style={{ marginBottom: '4rem' }}>Latest Updates</h2>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            {newsItems.map((item, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 150}>
                <article style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                      className="hover-zoom"
                    />
                  </div>
                  <span className="caption" style={{ color: 'var(--color-sky-blue)', marginBottom: '0.5rem', display: 'block' }}>
                    {item.category} — {item.date}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-sky-blue)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-on-white)', marginBottom: '1.5rem', flex: '1' }}>{item.excerpt}</p>
                  <a href="#" style={{ color: 'var(--color-sky-blue)', fontWeight: '600', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
                    Read Full Story —
                  </a>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
