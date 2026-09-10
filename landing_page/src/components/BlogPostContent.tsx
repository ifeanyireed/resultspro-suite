'use client';

import ScrollReveal from './ScrollReveal';
import Link from 'next/link';
import { IconArrowLeft, IconMessageCircle, IconBrandTwitter, IconBrandFacebook, IconBrandLinkedin, IconMail } from '@tabler/icons-react';

interface Comment {
  id: string | number;
  created_at: string;
  author: string;
  content: string;
}

interface BlogPost {
  id: string | number;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  comments?: Comment[];
  cover_image?: string;
  published_at?: string;
  category?: string;
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  
  return (
    <main className="min-h-screen bg-nets-light relative pb-24">
      {/* Back Button Floating */}
      <Link href="/blog" className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md text-sm fw-600 transition-all">
        <IconArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Featured Image Hero */}
      <div className="w-full h-[55vh] relative">
        <img 
          src={post.cover_image || "/photo13.jpeg"} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

            {/* Content Container Overlapping Image */}
      <div className="container-nets relative z-10" style={{ marginTop: '-25vh' }}>
        <div className="max-w-[1100px] mx-auto">
          
          <ScrollReveal animation="fade-up">
            {/* Card 1: Meta Header */}
            <div className="bg-white shadow-xl w-full p-8 md:p-16 mb-8">
              <span className="text-xs fw-700 tracking-widest uppercase text-muted mb-6 block">
                {post.category || 'Marketing'}
              </span>
              
              <h1 className="text-3xl md:text-5xl fw-700 text-navy mb-10 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <img src="/photo04.jpeg" className="w-full h-full object-cover" alt={post.author} />
                  </div>
                  <div>
                    <p className="text-sm fw-600 text-navy mb-0.5">by: {post.author}</p>
                    <p className="text-xs text-muted">on: {formattedDate}</p>
                  </div>
                </div>
                <div className="text-xs text-muted fw-600">
                  5 minutes Read
                </div>
              </div>
            </div>

            {/* Card 2 Row: Share + Body */}
            <div className="flex gap-8">
              
              {/* Floating Share Side-Nav */}
              <div className="hidden lg:flex flex-col items-center gap-4 w-12 shrink-0 pt-8">
                <span className="text-xs text-muted fw-600 mb-2">share</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-navy hover:bg-gray-200 transition-colors">
                  <IconBrandFacebook size={18} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-navy hover:bg-gray-200 transition-colors">
                  <IconBrandTwitter size={18} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-navy hover:bg-gray-200 transition-colors">
                  <IconBrandLinkedin size={18} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-navy hover:bg-gray-200 transition-colors">
                  <IconMail size={18} />
                </button>
              </div>

              {/* Card 2: Main Prose Content */}
              <div className="bg-white shadow-xl flex-1 p-8 md:p-16">
                <div 
                  className="prose prose-lg prose-nets max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />

                {/* Comments Section */}
                <div className="mt-20">
                  <h3 className="text-xl fw-700 text-navy mb-8">Comments</h3>
                  
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-8">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                            <img src="/photo13.jpeg" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 bg-nets-light p-5 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-nets-border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="fw-600 text-navy text-sm">{comment.author}</span>
                              <button className="text-xs font-semibold text-muted hover:text-navy flex items-center gap-1">
                                <IconMessageCircle size={14} /> Reply
                              </button>
                            </div>
                            <span className="text-[10px] text-muted uppercase tracking-wider block mb-3">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                            <p className="text-sm text-navy/80 leading-relaxed m-0">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-nets-light border border-nets-border rounded-xl p-8 text-center text-muted text-sm">
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  )}

                  {/* Leave Comment Form (Dummy) */}
                  <div className="mt-16 bg-nets-light border border-nets-border rounded-xl p-8">
                    <h4 className="text-lg fw-600 text-navy mb-6">Leave your Comments</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-lg border border-nets-border text-sm focus:outline-none focus:border-blue-500" />
                      <input type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-lg border border-nets-border text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-nets-border text-sm focus:outline-none focus:border-blue-500 mb-4" />
                    <textarea placeholder="Your Comment" rows={4} className="w-full px-4 py-3 rounded-lg border border-nets-border text-sm focus:outline-none focus:border-blue-500 mb-6"></textarea>
                    <button className="btn" style={{ backgroundColor: "var(--color-nets-red)", color: "white" }}>
                      Submit your Comment
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}