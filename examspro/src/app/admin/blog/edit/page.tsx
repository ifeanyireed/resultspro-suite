"use client";

import { useState, useEffect, Suspense } from "react";
import api from "@/lib/api";
import { IconChevronLeft as ChevronLeft, IconDeviceFloppy as Save, IconLoader2 as Loader2, IconPhoto as ImageIcon, IconUpload as Upload } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import WYSIWYGEditor from "@/components/admin/WYSIWYGEditor";

function EditPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    summary: "",
    featuredImage: "",
    categoryId: "",
    isPublished: false,
    tags: ""
  });

  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchPost();
    } else {
      setFetching(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/blog/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchPost = async () => {
    try {
      setFetching(true);
      const res = await api.get("/admin/blog/posts");
      const post = res.data.find((p: any) => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          content: post.content,
          summary: post.summary,
          featuredImage: post.featuredImage,
          categoryId: post.categoryId || "",
          isPublished: post.isPublished,
          tags: post.tags
        });
      } else {
        toast.error("Post not found");
        router.push("/admin/blog");
      }
    } catch (err) {
      toast.error("Failed to fetch post data");
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/admin/upload-image?folder=blog", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData(prev => ({ ...prev, featuredImage: res.data.url }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/admin/blog/posts/${id}`, {
        ...formData,
        categoryId: formData.categoryId || null
      });
      toast.success("Post updated successfully!");
      router.push("/admin/blog");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-navy">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-navy text-white p-8">
        <h1 className="text-2xl font-bold mb-4">No Post ID provided</h1>
        <Link href="/admin/blog" className="text-green hover:underline">Back to CMS</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-navy">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/blog" className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to CMS
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-black text-white">Edit Post</h1>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green hover:bg-green/90 text-navy font-black rounded-xl gap-2 min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            UPDATE POST
          </Button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Post Title</label>
                <input 
                  type="text"
                  placeholder="Enter a catchy title..."
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 px-6 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-green/50"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Summary / Excerpt</label>
                <textarea 
                  placeholder="Briefly describe what this post is about..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-green/50 resize-none"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Main Content</label>
                <WYSIWYGEditor 
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  placeholder="Write your article here..."
                />
              </div>
            </div>

            {/* Sidebar / Settings */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">URL Slug</label>
                  <input 
                    type="text"
                    className="w-full bg-navy border border-white/10 rounded-xl py-2 px-4 text-xs font-mono text-gray-400 focus:outline-none focus:ring-2 focus:ring-green/50"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                  <select 
                    className="w-full bg-navy border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green/50"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Featured Image</label>
                  <div className="relative group">
                    <input 
                      type="text"
                      placeholder="https://..."
                      className="w-full bg-navy border border-white/10 rounded-xl py-2 pl-10 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green/50"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    />
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    
                    <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                       {uploading ? <Loader2 className="w-4 h-4 text-green animate-spin" /> : <Upload className="w-4 h-4 text-gray-400" />}
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                  {formData.featuredImage && (
                    <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-white/10">
                       <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tags (comma separated)</label>
                  <input 
                    type="text"
                    placeholder="JAMB, Tips, 2026"
                    className="w-full bg-navy border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green/50"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                   <span className="text-sm font-bold text-white">Published</span>
                   <button 
                     type="button"
                     onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                     className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPublished ? 'bg-green' : 'bg-white/10'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPublished ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-navy">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </div>
    }>
      <EditPostForm />
    </Suspense>
  );
}
