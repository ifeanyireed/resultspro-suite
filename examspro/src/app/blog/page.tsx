"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featuredImage: string;
  publishedAt: string;
  author?: { name: string };
  category?: { name: string };
  tags: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blog");
      setPosts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-nets-navy)' }}>
      <Navbar />
      
      <section style={{ paddingTop: '160px', paddingBottom: '80px', background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets">
          <div style={{ maxWidth: '800px' }}>
            <span className="overline" style={{ color: 'var(--color-nets-red)', marginBottom: '1rem', display: 'inline-block' }}>Blog & Updates</span>
            <h1 className="h1" style={{ color: 'white', marginBottom: '1.5rem' }}>ResultsPRO News</h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Stay updated with the latest JAMB/WAEC news, study tips, and platform updates.
            </p>
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', maxWidth: '400px', padding: '0.875rem 1.25rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: '0.875rem', borderRadius: '2px', outline: 'none'
              }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--color-nets-navy)', flex: 1 }}>
        <div className="container-nets">
          {loading ? (
            <div style={{ padding: '4rem 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
              Loading articles...
            </div>
          ) : filteredPosts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--color-nets-navy-dark)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '16/10', width: '100%', background: 'rgba(255,255,255,0.02)' }}>
                    <img 
                      src={post.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"} 
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="overline" style={{ color: 'var(--color-nets-red)' }}>{post.category?.name || "General"}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="h5" style={{ color: 'white', marginBottom: '1rem', lineHeight: 1.4 }}>
                      {post.title}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                      {post.summary}
                    </p>
                    <span style={{ color: 'var(--color-nets-red)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Read Article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: '4rem 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              No articles found matching your search.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
