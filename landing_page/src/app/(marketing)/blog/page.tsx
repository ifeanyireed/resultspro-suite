'use client';

import { useEffect, useState } from 'react';
import PhotoHero from '@/components/PhotoHero';
import ScrollReveal from '@/components/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  category?: string;
  image?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/blog')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PhotoHero 
        title="Latest News" 
        subtitle="Exploring the future of education, technology, and academic intelligence in Africa." 
        image="/photo08.jpeg" 
      />
      
      <section className="section section-white">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 style={{ marginBottom: '4rem' }}>Latest Insights</h2>
          </ScrollReveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-sky-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
              {posts.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="caption" style={{ color: 'var(--color-sky-blue)' }}>Stay tuned. Fresh insights are on the way.</p>
                </div>
              ) : (
                posts.map((post, i) => (
                  <ScrollReveal key={post.id} animation="fade-up" delay={i * 150}>
                    <article style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', marginBottom: '1.5rem' }}>
                          <Image 
                            src={post.image || `/photo0${(i % 5) + 1}.jpeg`} 
                            alt={post.title} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            className="hover-zoom"
                          />
                        </div>
                      </Link>
                      <span className="caption" style={{ color: 'var(--color-sky-blue)', marginBottom: '0.5rem', display: 'block' }}>
                        {post.category || 'Updates'} — {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-sky-blue)', transition: 'opacity 0.3s ease' }} className="hover-opacity">
                          {post.title}
                        </h3>
                      </Link>
                      <p style={{ color: 'var(--color-text-on-white)', marginBottom: '1.5rem', flex: '1', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.content.replace(/<[^>]*>?/gm, '')}
                      </p>
                      <Link href={`/blog/${post.slug}`} style={{ color: 'var(--color-sky-blue)', fontWeight: '600', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
                        Read Full Story —
                      </Link>
                    </article>
                  </ScrollReveal>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
