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

function normalizeSlug(s: string): string {
  try {
    s = decodeURIComponent(s);
  } catch (_) {}
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findPost(posts: any[], requestedSlug: string) {
  if (!requestedSlug || !Array.isArray(posts)) return null;

  // 1. Exact match
  let found = posts.find((p: any) => p.slug === requestedSlug);
  if (found) return found;

  // 2. Decoded URI match
  try {
    const decoded = decodeURIComponent(requestedSlug);
    found = posts.find((p: any) => p.slug === decoded);
    if (found) return found;
  } catch (_) {}

  // 3. Normalized match (handles punctuation, colons, quotes differences)
  const targetNorm = normalizeSlug(requestedSlug);
  found = posts.find((p: any) => normalizeSlug(p.slug) === targetNorm);
  if (found) return found;

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const posts = await getBlogPosts();
  const post = findPost(posts, resolvedParams.slug);

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
    
    const [postsRes, catRes] = await Promise.all([
      fetchWithRetry(`${USERS_API}/api/v1/cms/blog/posts`, { cache: 'no-store' }),
      fetchWithRetry(`${USERS_API}/api/v1/cms/blog/categories`, { cache: 'no-store' })
    ]);

    let posts = [];
    if (postsRes.ok) posts = await postsRes.json();
    if (!posts || !Array.isArray(posts)) return [];
    
    const published = posts.filter((p: any) => p.status === 'PUBLISHED');

    if (catRes.ok) {
      const categories = await catRes.json();
      published.forEach((p: any) => {
        const cat = categories.find((c: any) => c.id === p.category_id);
        if (cat) p.category = cat.name?.trim();
      });
    }

    return published;
  } catch (error) {
    console.error('Failed to fetch blog posts', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const posts = await getBlogPosts();
  const post = findPost(posts, resolvedParams.slug);

  // Dynamic related posts calculation (excluding current post)
  let relatedPosts: any[] = [];
  if (post && Array.isArray(posts)) {
    const activeCategory = post.category_id || post.category?.name || '';
    const otherPosts = posts.filter((p: any) => p.slug !== post.slug && p.id !== post.id);
    const sameCategoryPosts = otherPosts.filter((p: any) => 
      activeCategory && (p.category_id === activeCategory || p.category?.name === activeCategory)
    );
    const otherCategoryPosts = otherPosts.filter((p: any) => 
      !activeCategory || (p.category_id !== activeCategory && p.category?.name !== activeCategory)
    );
    relatedPosts = [...sameCategoryPosts, ...otherCategoryPosts].slice(0, 3);
  }
  
  // Map backend format to component format if post was retrieved
  const formattedPost = post ? {
    ...post,
    author: "ResultsPRO Team",
    date: new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } : null;

  return (
    <BlogPostClientWrapper 
      initialPost={formattedPost} 
      initialRelatedPosts={relatedPosts} 
      slug={post?.slug || resolvedParams.slug} 
    />
  );
}
