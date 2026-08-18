'use client';

import PhotoHero from './PhotoHero';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

interface Comment {
  id: number;
  created_at: string;
  author: string;
  content: string;
}

interface BlogPost {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  comments: Comment[];
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  return (
    <main>
      <PhotoHero 
        title={post.title} 
        subtitle={`By ${post.author} — ${new Date(post.created_at).toLocaleDateString()}`} 
        image="/photo08.jpeg" 
        tagline="In-Depth Insight"
      />

      <section className="section section-white">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal animation="fade-up">
            <Link href="/blog" style={{ color: 'var(--color-sky-blue)', textDecoration: 'none', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', marginBottom: '2rem', display: 'inline-block' }}>
              ← Back to Blog
            </Link>
            
            <div 
              className="blog-content"
              style={{ color: 'var(--color-text-on-white)', lineHeight: '1.8', fontSize: '1.125rem' }}
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {post.comments && post.comments.length > 0 && (
              <div style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid rgba(20, 110, 245, 0.1)' }}>
                <h3 style={{ color: 'var(--color-sky-blue)', marginBottom: '2rem' }}>Comments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {post.comments.map((comment) => (
                    <div key={comment.id}>
                      <span className="caption" style={{ color: 'var(--color-sky-blue)', display: 'block', marginBottom: '0.5rem' }}>
                        {comment.author} — {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      <p style={{ color: 'var(--color-text-on-white)' }}>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
