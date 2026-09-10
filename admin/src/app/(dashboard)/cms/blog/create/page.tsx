'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArrowLeft, Save, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreateBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  const handleSave = (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title) {
      toast.error('Title is required');
      return;
    }
    // Simulate save
    toast.success(`Post ${status === 'DRAFT' ? 'saved as draft' : 'published'} successfully!`);
    router.push('/cms/blog');
  };

  return (
    <div className="w-full">
      <Header
        title="Create Blog Post"
        subtitle="Write and publish a new article to the suite blog"
      />

      <div className="p-8 space-y-6 max-w-[1200px] mx-auto w-full">
        {/* Actions Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <Link href="/cms/blog" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave('DRAFT')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button 
              onClick={() => handleSave('PUBLISHED')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              Publish Post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Post Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 10 Tips for Passing ICAN..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Content</label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3">Post Settings</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Excerpt</label>
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary of the post..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-slate-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 appearance-none"
                >
                  <option value="">Select Category...</option>
                  <option value="announcements">Announcements</option>
                  <option value="tips">Study Tips</option>
                  <option value="updates">Product Updates</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. ICAN, Exams, Study"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Cover Image</label>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer">
                  <span className="text-sm font-medium">Click to upload</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
