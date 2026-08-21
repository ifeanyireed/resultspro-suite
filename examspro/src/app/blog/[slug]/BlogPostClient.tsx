"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage: string;
  publishedAt: string;
  author?: { name: string };
  category?: { name: string };
  tags: string;
}

export default function BlogPostClient({ post, slug }: { post: BlogPost | null, slug: string }) {
  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (!post) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-nets-navy)' }}>
        <section style={{ paddingTop: '160px', paddingBottom: '80px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container-nets" style={{ textAlign: 'center' }}>
            <h1 className="h1" style={{ color: 'white', marginBottom: '1.5rem' }}>Post Not Found</h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/blog" className="btn btn-red" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Back to Blog
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--color-nets-navy-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <article style={{ flex: 1 }}>
        {/* Header Section */}
        <header style={{ paddingTop: '160px', paddingBottom: '80px', background: 'var(--color-nets-navy)' }}>
          <div className="container-nets">
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <Link href="/blog" style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', textDecoration: 'none' }}>
                ← Back to Articles
              </Link>
              
              <div style={{ marginBottom: '2rem' }}>
                <span className="overline" style={{ color: 'var(--color-nets-red)', marginBottom: '1rem', display: 'block' }}>
                  {post.category?.name || "General"}
                </span>
                <h1 className="h2" style={{ color: 'white', lineHeight: 1.2 }}>
                  {post.title}
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{post.author?.name || "Admin"}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {new Date(post.publishedAt).toLocaleDateString("en-NG", { dateStyle: 'long' })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="container-nets" style={{ marginTop: '-40px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <img 
              src={post.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80"} 
              alt={post.title}
              style={{ width: '100%', height: 'auto', aspectRatio: '21/9', objectFit: 'cover', borderRadius: '2px', display: 'block' }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="container-nets" style={{ paddingBottom: '80px' }}>
           <div style={{ maxWidth: '700px', margin: '0 auto' }}>
             <div 
               className="prose prose-invert prose-lg max-w-none"
               style={{ color: 'rgba(255,255,255,0.8)' }}
               dangerouslySetInnerHTML={{ __html: post.content }}
             />

             {/* Footer Info */}
             <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                   {(post.tags || "").split(',').filter(t => t.trim()).map(tag => (
                     <span key={tag} style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '2px' }}>
                        #{tag.trim()}
                     </span>
                   ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Share</span>
                   <button onClick={copyLink} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.8125rem', cursor: 'pointer', borderRadius: '2px' }}>
                      Copy Link
                   </button>
                </div>
             </div>
           </div>
        </div>
      </article>
    </main>
  );
}
