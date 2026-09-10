'use client';

import ScrollReveal from './ScrollReveal';
import HeroAnimationWrapper from './HeroAnimationWrapper';
import Link from 'next/link';
import { IconArrowLeft, IconCalendar, IconUser, IconMessage } from '@tabler/icons-react';

interface Comment {
  id: string | number;
  created_at: string;
  author: string;
  content: string;
}

interface BlogPost {
  id: string | number;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  comments?: Comment[];
  cover_image?: string;
  published_at?: string;
  category?: string;
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section styled like Product Pages */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '10rem', paddingBottom: '16rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
            <div className="max-w-4xl mx-auto text-center">
              <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-8 backdrop-blur-sm text-blue-300 hover:bg-white/20 transition-colors">
                <IconArrowLeft size={16} />
                <span>Back to Blog</span>
              </Link>
              
              <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <IconUser size={18} className="text-red" style={{ color: 'var(--color-nets-red)' }} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCalendar size={18} className="text-red" style={{ color: 'var(--color-nets-red)' }} />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          </HeroAnimationWrapper>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white border-b border-nets-border relative pb-24">
        <div className="container-nets">
          <ScrollReveal animation="fade-up">
            <div className="max-w-4xl mx-auto">
              
              {/* Featured Image */}
              <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-navy/20 border border-nets-border bg-nets-light mb-16 relative z-20" style={{ marginTop: "-12rem" }}>
                <img 
                  src={post.cover_image || "/photo08.jpeg"} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Prose Content */}
              <div className="max-w-3xl mx-auto">
                <div 
                  className="prose prose-lg prose-nets max-w-none"
                  style={{ color: 'var(--color-nets-navy)', lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />

                {/* Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-20 pt-12 border-t border-nets-border">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <IconMessage size={20} />
                      </div>
                      <h3 className="text-2xl fw-600 text-navy">Discussion</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-nets-light p-6 rounded-xl border border-nets-border">
                          <div className="flex items-center justify-between mb-3">
                            <span className="fw-600 text-navy">{comment.author}</span>
                            <span className="text-xs text-muted">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted leading-relaxed">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
