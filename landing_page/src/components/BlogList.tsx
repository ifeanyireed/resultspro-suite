'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

export function BlogList({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts || []);
  const [loading, setLoading] = useState<boolean>(!initialPosts || initialPosts.length === 0);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    async function loadClient() {
      try {
        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
        const [postsRes, catRes] = await Promise.all([
          fetch(`${USERS_API}/api/v1/cms/blog/posts`),
          fetch(`${USERS_API}/api/v1/cms/blog/categories`)
        ]);
        if (postsRes.ok) {
          const data = await postsRes.json();
          if (Array.isArray(data)) {
            const published = data.filter((p: any) => p.status === 'PUBLISHED');
            if (catRes.ok) {
              const categories = await catRes.json();
              published.forEach((p: any) => {
                const cat = categories.find((c: any) => c.id === p.category_id);
                if (cat) p.category = cat.name;
              });
            }
            setPosts(published);
          }
        }
      } catch (err) {
        console.error('Client fallback blog fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [initialPosts]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em]" style={{ borderColor: 'var(--color-nets-navy, #0f172a) transparent transparent transparent' }} />
        <p className="mt-4 text-sm text-gray-500">Loading latest articles...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="text-center text-muted py-12">No blog posts found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post: any) => {
        const coverImg = post.cover_image 
          ? (post.cover_image.startsWith('http://') || post.cover_image.startsWith('https://')
              ? post.cover_image 
              : `https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/${post.cover_image.split('/').pop()}`)
          : 'https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/photo13.jpg';

        return (
          <article key={post.id} className="bg-white rounded-sm shadow-sm hover:shadow-card-lg transition-shadow overflow-hidden flex flex-col border border-gray-200">
            <div className="relative h-48 overflow-hidden bg-nets-light">
              <img 
                src={coverImg}
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-navy text-xs fw-600 px-3 py-1 rounded-sm">
                  {post.category || 'Blog'}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between text-xs text-muted mb-3">
                <span>
                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>ResultsPRO</span>
              </div>
              <h2 className="text-xl fw-600 mb-3 text-navy leading-tight line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-muted mb-6 flex-1 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-200">
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm fw-600 text-red hover:opacity-80 transition-opacity" style={{ color: 'var(--color-nets-red)' }}>
                  Read Article <IconArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
