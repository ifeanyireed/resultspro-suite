'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import BlogPostContent from '@/components/BlogPostContent';

export function BlogPostClientWrapper({ initialPost, slug }: { initialPost: any; slug: string }) {
  const [post, setPost] = useState<any>(initialPost);
  const [loading, setLoading] = useState<boolean>(!initialPost);
  const [notFoundState, setNotFoundState] = useState<boolean>(false);

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
      setLoading(false);
      return;
    }

    async function loadPost() {
      try {
        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
        const res = await fetch(`${USERS_API}/api/v1/cms/blog/posts`);
        if (res.ok) {
          const posts = await res.json();
          if (Array.isArray(posts)) {
            const found = posts.find((p: any) => p.slug === slug && p.status === 'PUBLISHED');
            if (found) {
              setPost({
                ...found,
                author: "ResultsPRO Team",
                date: new Date(found.published_at || found.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              });
              setLoading(false);
              return;
            }
          }
        }
        setNotFoundState(true);
      } catch (err) {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [initialPost, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-light flex flex-col items-center justify-center py-32" style={{ background: 'var(--color-nets-light, #f8fafc)' }}>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em]" style={{ borderColor: 'var(--color-nets-navy, #0f172a) transparent transparent transparent' }} />
        <p className="mt-4 text-sm text-gray-500">Loading article...</p>
      </main>
    );
  }

  if (notFoundState || !post) {
    return (
      <main className="min-h-screen bg-light flex flex-col items-center justify-center py-32 px-4" style={{ background: 'var(--color-nets-light, #f8fafc)' }}>
        <h1 className="text-3xl font-bold text-navy mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md text-center">
          The article you are looking for does not exist or may have been moved.
        </p>
        <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white text-sm font-semibold rounded hover:opacity-90 transition-opacity" style={{ background: 'var(--color-nets-navy, #0f172a)' }}>
          <IconArrowLeft size={16} /> Return to Blog
        </Link>
      </main>
    );
  }

  return <BlogPostContent post={post} />;
}
