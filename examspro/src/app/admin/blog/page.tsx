"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { IconPlus as Plus, IconEdit as Edit2, IconTrash as Trash2, IconEye as Eye, IconEyeOff as EyeOff, IconSearch as Search, IconLoader2 as Loader2, IconFileText as FileText, IconCalendar as Calendar, IconUser as User, IconFolderPlus as FolderPlus, IconX as X, IconMessage as MessageSquare, IconCircleCheck as CheckCircle } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string;
  viewCount: number;
  author?: { name: string };
  category?: { name: string };
}

export default function BlogCMSPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [autoApprove, setAutoApprove] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/blog/posts");
      setPosts(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/blog/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;
    
    const slug = newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    try {
      await api.post("/admin/blog/categories", { ...newCategory, slug });
      toast.success("Category created");
      setNewCategory({ name: "" });
      fetchCategories();
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/admin/blog/posts/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminHeader 
        title="Blog CMS" 
        subtitle="Manage your site's articles and news"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <div className="flex-1 overflow-y-auto p-8 bg-navy text-white no-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-black text-white">Articles</h2>
            <p className="text-gray-500">View and edit your published content</p>
          </div>
          <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setShowCategoryModal(true)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/[0.1] border-t-white/[0.15] rounded-xl gap-2 px-6"
          >
            <FolderPlus className="w-5 h-5" />
            CATEGORIES
          </Button>
          <Link href="/admin/blog/comments">
            <Button 
              className="bg-white/5 hover:bg-white/10 text-white border border-white/[0.1] border-t-white/[0.15] rounded-xl gap-2 px-6"
            >
              <MessageSquare className="w-5 h-5" />
              COMMENTS
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button className="bg-green hover:bg-green/90 text-navy font-black rounded-xl gap-2 px-6">
              <Plus className="w-5 h-5" />
              CREATE POST
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />
          <div className="relative w-full max-w-md bg-navy border border-white/10 rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-300 overflow-hidden text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-black text-white">Categories</h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mb-8 flex gap-2">
              <input 
                type="text" 
                placeholder="New category name..."
                className="flex-1 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green/50 placeholder:text-gray-600"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Button type="submit" className="bg-green hover:bg-green/90 text-navy font-black rounded-xl px-6">ADD</Button>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {categories.map(cat => (
                 <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] hover:bg-white/10 transition-colors">
                   <div>
                     <div className="font-bold text-white text-sm">{cat.name}</div>
                     <div className="text-[10px] text-gray-500 font-mono">/{cat.slug}</div>
                   </div>
                 </div>
               ))}
               {categories.length === 0 && (
                 <div className="text-center py-12">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <FolderPlus className="w-6 h-6 text-gray-600" />
                   </div>
                   <p className="text-gray-600 text-sm font-bold">No categories yet.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Stats and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Posts</div>
          <div className="text-3xl font-display font-black text-white">{posts.length}</div>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Published</div>
          <div className="text-3xl font-display font-black text-green">{posts.filter(p => p.isPublished).length}</div>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] md:col-span-2 flex items-end">
           <div className="relative w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
             <input 
               type="text" 
               placeholder="Search posts..."
               className="w-full bg-navy border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green/50"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-green animate-spin" />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-[32px] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.1] border-t-white/[0.15] bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Post</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Stats</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1 group-hover:text-green transition-colors">{post.title}</div>
                    <div className="text-xs text-gray-500 font-mono">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-xs text-gray-400">
                          <User className="w-3 h-3" /> {post.author?.name || 'Admin'}
                       </div>
                       <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 text-green text-[10px] font-black uppercase tracking-wider">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-wider">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">{post.viewCount}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Views</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/blog/edit?id=${post.id}`}>
                        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-xl hover:bg-blue/10 hover:text-blue text-gray-500">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => handleDelete(post.id)}
                        size="icon" variant="ghost" 
                        className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-gray-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500 font-bold">No posts found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
