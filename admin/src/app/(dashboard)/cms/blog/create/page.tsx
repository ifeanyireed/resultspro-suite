'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RichTextEditor } from '@/components/RichTextEditor';
import { TagsInput } from '@/components/TagsInput';
import { ArrowLeft, Save, Send, Globe, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreateBlogPost() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <CreateBlogPostContent />
    </React.Suspense>
  );
}

const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';

function CreateBlogPostContent() {
    const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  useEffect(() => {
    if (editId) {
      fetch(`${USERS_API}/api/v1/cms/blog/categories`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCategories(data);
        });
      fetch(`${USERS_API}/api/v1/cms/blog/posts`)
        .then(res => res.json())
        .then(data => {
          const posts = Array.isArray(data) ? data : (data.posts || []);
          const post = posts.find((p: any) => p.id === editId);
          if (post) {
            setTitle(post.title || '');
            setExcerpt(post.excerpt || '');
            setCategory(post.category_id || '');
            setContent(post.content || '');
            setTags(post.tags || '');
            setMetaTitle(post.meta_title || '');
            setMetaDescription(post.meta_description || '');
            setMetaKeywords(post.meta_keywords || '');
            setViewCount(Number(post.view_count) || 0);
            let imgUrl = post.cover_image || '';
            if (imgUrl && imgUrl.startsWith('/')) imgUrl = 'https://resultspro.ng' + imgUrl;
            setCoverImage(imgUrl);
            // Wait a tick for editor to initialize
            setTimeout(() => {
              if ((window as any).tinymce || document.querySelector('.tiptap')) {
                // Not ideal but works for this level of abstraction
              }
            }, 500);
          }
        });
    }
  }, [editId]);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [viewCount, setViewCount] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_path', 'blog/covers');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
        toast.success('Cover image uploaded!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    setIsSaving(true);
    if (!title) {
      toast.error('Title is required');
      return;
    }
    
    try {
      let author_id = "0eef95ef-57e0-4a7d-ae31-c8376fe28fd0";
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          if (u.id) author_id = u.id;
        }
      } catch(e) {}

      const payload: any = {
        title,
        excerpt,
        content,
        cover_image: coverImage,
        category_id: category || null,
        tags,
        status,
        author_id,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        view_count: viewCount,
      };

      let url = `${USERS_API}/api/v1/cms/blog/posts`;

      if (editId) {
        payload['id'] = editId;
      }

      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success(`Post ${status === 'DRAFT' ? 'saved as draft' : 'published'} successfully!`);
        router.push('/cms/blog');
      } else {
        toast.error('Failed to save post');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <Header
        title="Create Blog Post"
        subtitle="Write and publish a new article to the suite blog"
      />

      <div className="px-1 sm:px-4 md:p-8 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-[1200px] mx-auto w-full">
        {/* Actions Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <Link href="/cms/blog" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave('DRAFT')}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm transition-colors shadow-sm ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'}`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button 
              onClick={() => handleSave('PUBLISHED')}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm transition-colors shadow-sm ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              <Send className="w-4 h-4" />
              {isSaving ? 'Publishing...' : (editId ? 'Update Post' : 'Publish Post')}
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

            {/* SEO & Metadata Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-800">SEO & Metadata</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Search Engine Optimization</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">Meta Title</label>
                  <span className={`text-xs ${metaTitle.length > 60 ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>
                    {metaTitle.length} / 60 characters
                  </span>
                </div>
                <input 
                  type="text" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title ? `${title} | ResultsPRO` : "Custom search engine title..."}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800 text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">If blank, defaults to the post title + brand suffix.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">Meta Description</label>
                  <span className={`text-xs ${metaDescription.length > 160 ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>
                    {metaDescription.length} / 160 characters
                  </span>
                </div>
                <textarea 
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || "Concise summary for search engines and social media previews..."}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-slate-700 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">If blank, search engines will use the excerpt.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Meta Keywords</label>
                <input 
                  type="text" 
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="edtech, school management, cbt, results, nigerian education"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-slate-800"
                />
                <p className="text-xs text-slate-400 mt-1">Comma-separated keywords for indexing.</p>
              </div>

              {/* SERP Preview */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Google Search Preview</span>
                </div>
                <p className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer truncate">
                  {metaTitle || title || "Your Blog Post Title"} | ResultsPRO
                </p>
                <p className="text-xs text-emerald-700 truncate">
                  https://resultspro.ng/blog/{(title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'article-slug')}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {metaDescription || excerpt || "Write an engaging meta description to improve click-through rates from Google and social shares."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* View Count Metrics Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-800">Performance</h3>
                </div>
                <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Analytics</span>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Total Views</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number"
                    min="0"
                    value={viewCount}
                    onChange={(e) => setViewCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-bold text-slate-800"
                  />
                  <span className="text-xs text-slate-400 font-medium">views</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">View count auto-increments upon unique reader visits.</p>
              </div>
            </div>

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
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Tags (Comma separated)</label>
                <TagsInput value={tags} onChange={setTags} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Cover Image</label>
                <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer overflow-hidden">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Click to upload'}</span>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
                {coverImage && (
                  <button onClick={() => setCoverImage('')} className="text-xs text-rose-500 font-medium mt-2 hover:underline">
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
