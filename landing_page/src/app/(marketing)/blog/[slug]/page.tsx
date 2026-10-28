import type { Metadata } from 'next';
import { BlogPostClientWrapper } from '@/components/BlogPostClientWrapper';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, delay = 1000): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || (res.status < 500 && res.status !== 408)) {
        return res;
      }
      if (i < retries) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
      }
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
  return fetch(url, options);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p: any) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: 'Article Not Found | ResultsPRO Suite',
      description: 'The requested article could not be found.',
    };
  }

  const title = post.meta_title ? post.meta_title : `${post.title} | ResultsPRO Suite`;
  const description = post.meta_description || post.excerpt || 'Read the latest insights and news from ResultsPRO Suite.';
  const keywords = post.meta_keywords ? post.meta_keywords.split(',').map((k: string) => k.trim()) : undefined;
  const coverImage = post.cover_image || 'https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/photo13.jpg';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImage],
    },
  };
}

async function getBlogPosts() {
  try {
    const rawApi = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
    const USERS_API = rawApi.trim().replace(/^["']|["']$/g, '');
    if (!USERS_API || !USERS_API.startsWith('http')) return [];
    const res = await fetchWithRetry(`${USERS_API}/api/v1/cms/blog/posts`, { cache: 'no-store' });
    if (!res.ok) return [];
    const posts = await res.json();
    if (!posts || !Array.isArray(posts)) return [];
    return posts.filter((p: any) => p.status === 'PUBLISHED');
  } catch (error) {
    console.error('Failed to fetch blog posts', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p: any) => p.slug === resolvedParams.slug);
  
  // Map backend format to component format if post was retrieved
  const formattedPost = post ? {
    ...post,
    author: "ResultsPRO Team",
    date: new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } : null;

  return <BlogPostClientWrapper initialPost={formattedPost} slug={resolvedParams.slug} />;
}
