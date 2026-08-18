import BlogPostContent from "@/components/BlogPostContent";
import { notFound } from "next/navigation";

interface Comment {
  id: number;
  created_at: string;
  blog_post_id: number;
  author: string;
  content: string;
}

interface Like {
  id: number;
  created_at: string;
  blog_post_id: number;
  user_id: string;
}

interface BlogPost {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  comments: Comment[];
  likes: Like[];
}

export async function generateStaticParams() {
  try {
    const res = await fetch('http://localhost:8080/api/blog');
    if (!res.ok) return [];
    const posts: BlogPost[] = await res.json();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to fetch blog posts for generateStaticParams:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let post: BlogPost | null = null;
  try {
    const res = await fetch(`http://localhost:8080/api/blog/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      post = await res.json();
    }
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug}:`, error);
  }

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
