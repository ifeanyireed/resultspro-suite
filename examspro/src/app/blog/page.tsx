"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
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

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue/20 via-navy to-navy pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto relative z-10 text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight">
              ResultsPRO <span className="text-green">Blog</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Stay updated with the latest JAMB/WAEC news, study tips, and platform updates.
            </p>
            
            <div className="max-w-xl mx-auto pt-8">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-green transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-[32px] py-6 pl-16 pr-8 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green/50 transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-green animate-spin" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              {/* Featured Post */}
              {!searchTerm && featuredPost && (
                <div className="mb-20">
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden border border-white/[0.1] border-t-white/[0.15] bg-white/5 shadow-2xl">
                        <img 
                          src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-green text-navy text-xs font-black uppercase tracking-widest shadow-lg">
                          Featured
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-green">
                          <Tag className="w-4 h-4" /> {featuredPost.category?.name || "General"}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white group-hover:text-green transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed line-clamp-3">
                          {featuredPost.summary}
                        </p>
                        <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                             <User className="w-4 h-4" /> {featuredPost.author?.name || "Admin"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                             <Calendar className="w-4 h-4" /> {new Date(featuredPost.publishedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchTerm ? filteredPosts : otherPosts).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
                    <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden border border-white/[0.1] border-t-white/[0.15] bg-white/5 mb-6">
                      <img 
                        src={post.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green">
                         {post.category?.name || "General"}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-green transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {post.summary}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                           <Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                        <div className="text-green opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                           Read <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-[40px]">
              <p className="text-gray-500 font-bold text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
