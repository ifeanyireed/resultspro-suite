import api from "@/lib/api";
import { fetchStaticRoutes } from "@/lib/static-routes";
import BlogPostClient from "./BlogPostClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export async function generateStaticParams() {
  try {
    const routes = await fetchStaticRoutes();
    return routes.blog.map(slug => ({ slug }));
  } catch (error) {
    console.error("Error fetching static routes for blog:", error);
    return [];
  }
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await api.get(`/blog/${slug}`);
    const data = res.data;
    if (!data) return null;
    
    return {
      ...data,
      content: data.bodyContent || data.content,
      featuredImage: data.featured_image || data.featuredImage,
      publishedAt: data.published_at || data.publishedAt,
      author: data.author ? { name: data.author.full_name || data.author.name } : { name: "Admin" },
      category: data.category ? { name: data.category.name } : { name: "General" }
    };
  } catch (err) {
    console.error(`Failed to fetch post: ${slug}`);
    return null;
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      <BlogPostClient post={post} slug={slug} />
      <Footer />
    </div>
  );
}
