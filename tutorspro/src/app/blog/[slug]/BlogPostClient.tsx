"use client";

import { useState } from "react";
import { Loader2, Calendar, ChevronLeft, Tag, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
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
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
         <h1 className="text-4xl font-display font-black text-white mb-4">Post Not Found</h1>
         <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been moved.</p>
         <Link href="/blog">
           <button className="px-8 py-3 rounded-xl bg-green text-navy font-black uppercase tracking-widest hover:bg-green/90 transition-all">
             Back to Blog
           </button>
         </Link>
      </div>
    );
  }

  return (
    <main className="flex-1 pb-20">
      <article>
        {/* Header Section */}
        <header className="relative pt-20 pb-20 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue/20 via-navy to-navy pointer-events-none" />
          
          <div className="max-w-[900px] mx-auto relative z-10 text-center space-y-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-green transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Articles
            </Link>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green/10 text-green text-[10px] font-black uppercase tracking-widest">
                <Tag className="w-3 h-3" /> {post.category?.name || "General"}
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight">
                {post.title}
              </h1>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green text-[10px] font-black">
                  {post.author?.name?.charAt(0) || "A"}
                </div>
                <span className="font-bold">{post.author?.name || "Admin"}</span>
              </div>
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> {new Date(post.publishedAt).toLocaleDateString("en-NG", { dateStyle: 'long' })}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-[1000px] mx-auto px-6 -mt-10 mb-20 relative z-20">
           <div className="aspect-[21/9] rounded-[40px] overflow-hidden border border-white/[0.1] border-t-white/[0.15] bg-white/5 shadow-2xl">
              <img 
                src={post.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80"} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
           </div>
        </div>

        {/* Content */}
        <div className="max-w-[800px] mx-auto px-6 relative z-10">
           <div 
             className="prose prose-invert prose-green max-w-none prose-lg
               prose-headings:font-display prose-headings:font-black
               prose-p:text-gray-300 prose-p:leading-relaxed
               prose-li:text-gray-300
               prose-strong:text-white
               prose-blockquote:border-green prose-blockquote:bg-green/5 prose-blockquote:p-4 prose-blockquote:rounded-xl
             "
             dangerouslySetInnerHTML={{ __html: post.content }}
           />

           {/* Footer Info */}
           <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-wrap gap-2">
                 {post.tags.split(',').map(tag => (
                   <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest border border-white/[0.05] border-t-white/[0.1]">
                      #{tag.trim()}
                   </span>
                 ))}
              </div>

              <div className="flex items-center gap-4">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Share:</span>
                 <button onClick={copyLink} className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <LinkIcon className="w-4 h-4" />
                 </button>
                 <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all">
                    <Twitter className="w-4 h-4" />
                 </button>
                 <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-gray-400 hover:text-[#4267B2] hover:bg-[#4267B2]/10 transition-all">
                    <Facebook className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </article>
    </main>
  );
}
