import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosConfig';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Plus,
  Edit02,
  Trash01,
  CheckCircle,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  BarChart01,
  Folder,
  Search,
  FileText,
  XCircle,
  Settings02,
} from '@/lib/hugeicons-compat';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  category: {
    id: string;
    name: string;
  };
  _count?: {
    comments: number;
  };
  authorName?: string;
  authorEmail?: string;
  excerpt?: string;
  content?: string;
  htmlContent?: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  _count?: {
    posts: number;
  };
}

interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
  createdAt: string;
  post?: {
    title: string;
  };
}

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalComments: number;
  pendingComments: number;
  totalLikes: number;
  topPosts: BlogPost[];
}

export default function BlogManagementCMS() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'categories' | 'comments'>('dashboard');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Post Form State
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    htmlContent: '',
    categoryId: '',
    authorName: 'Admin',
    authorEmail: 'admin@resultpro.io',
    status: 'DRAFT',
  });

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  });

  // ReactQuill modules for word-processor-like experience
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
      ['blockquote', 'code-block']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image', 'video',
    'color', 'background', 'align', 'blockquote', 'code-block'
  ];

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/super-admin/blog/cms/stats');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/super-admin/blog/cms/posts', {
        params: { limit: 50 },
      });
      if (res.data?.success) {
        setPosts(res.data.data || []);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/super-admin/blog/public/categories');
      if (res.data?.success) {
        setCategories(res.data.data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get('/super-admin/blog/cms/comments/pending');
      if (res.data?.success) {
        setComments(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchPosts(), fetchCategories(), fetchComments()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Post Actions
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...postFormData,
        content: postFormData.htmlContent // Store HTML in both or handle accordingly
      };

      if (editingPost) {
        await axiosInstance.put(`/super-admin/blog/cms/posts/${editingPost.id}`, payload);
        toast.success('Post updated successfully');
      } else {
        await axiosInstance.post('/super-admin/blog/cms/posts', payload);
        toast.success('Post created successfully');
      }
      setShowPostForm(false);
      setEditingPost(null);
      fetchPosts();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error saving post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axiosInstance.delete(`/super-admin/blog/cms/posts/${postId}`);
        toast.success('Post deleted');
        fetchPosts();
        fetchStats();
      } catch (error) {
        toast.error('Error deleting post');
      }
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      await axiosInstance.post(`/super-admin/blog/cms/posts/${postId}/publish`);
      toast.success('Post published!');
      fetchPosts();
      fetchStats();
    } catch (error) {
      toast.error('Error publishing post');
    }
  };

  // Category Actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axiosInstance.put(`/super-admin/blog/cms/categories/${editingCategory.id}`, categoryFormData);
        toast.success('Category updated');
      } else {
        await axiosInstance.post('/super-admin/blog/cms/categories', categoryFormData);
        toast.success('Category created');
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      fetchCategories();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error saving category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure? This will fail if category has posts.')) {
      try {
        await axiosInstance.delete(`/super-admin/blog/cms/categories/${categoryId}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Error deleting category');
      }
    }
  };

  // Comment Actions
  const handleApproveComment = async (commentId: string) => {
    try {
      await axiosInstance.post(`/super-admin/blog/cms/comments/${commentId}/approve`, {
        approvedBy: 'Admin'
      });
      toast.success('Comment approved');
      fetchComments();
      fetchStats();
    } catch (error) {
      toast.error('Error approving comment');
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      await axiosInstance.post(`/super-admin/blog/cms/comments/${commentId}/reject`);
      toast.success('Comment rejected');
      fetchComments();
    } catch (error) {
      toast.error('Error rejecting comment');
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-gray-400">Create, edit and manage platform-wide blog content</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryFormData({ name: '', slug: '', description: '', displayOrder: 0, isActive: true });
                setShowCategoryForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              <Folder className="w-5 h-5" />
              New Category
            </button>
            <button
              onClick={() => {
                setEditingPost(null);
                setPostFormData({ title: '', slug: '', excerpt: '', content: '', htmlContent: '', categoryId: '', authorName: 'Admin', authorEmail: 'admin@resultpro.io', status: 'DRAFT' });
                setShowPostForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
          {['dashboard', 'posts', 'categories', 'comments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                {[
                  { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-blue-400' },
                  { label: 'Published', value: stats.publishedPosts, icon: CheckCircle, color: 'text-green-400' },
                  { label: 'Drafts', value: stats.draftPosts, icon: Clock, color: 'text-yellow-400' },
                  { label: 'Categories', value: stats.totalCategories, icon: Folder, color: 'text-purple-400' },
                  { label: 'Comments', value: stats.totalComments, icon: MessageCircle, color: 'text-pink-400' },
                  { label: 'Pending', value: stats.pendingComments, icon: Clock, color: 'text-orange-400' },
                  { label: 'Likes', value: stats.totalLikes, icon: Heart, color: 'text-red-400' },
                ].map((stat, idx) => (
                  <div key={idx} className="relative rounded-[24px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-5 hover:bg-white/5 transition-all">
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{(stat.value || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Top Posts Table */}
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
                <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart01 className="w-5 h-5 text-blue-400" />
                    Top Performing Content
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.07)]">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stats</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.topPosts || []).map((post) => (
                        <tr key={post.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-white">{post.title}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4 text-xs">
                              <span className="flex items-center gap-1 text-gray-400"><Eye className="w-3.5 h-3.5" /> {post.viewCount || 0}</span>
                              <span className="flex items-center gap-1 text-pink-400"><Heart className="w-3.5 h-3.5" /> {post.likeCount || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-6">
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
                <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">All Articles</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input type="text" placeholder="Filter articles..." className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
                  ) : (posts || []).length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No blog posts yet</div>
                  ) : (
                    (posts || []).map((post) => (
                      <div key={post.id} className="p-5 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${post.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                {post.status}
                              </span>
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.category?.name}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{post.title}</h4>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><Eye className="w-3.5 h-3.5" /> {post.viewCount || 0} Views</span>
                              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><MessageCircle className="w-3.5 h-3.5" /> {post._count?.comments || 0} Comments</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {post.status === 'DRAFT' && (
                              <button onClick={() => handlePublishPost(post.id)} className="p-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all" title="Publish"><CheckCircle className="w-5 h-5" /></button>
                            )}
                            <button 
                              onClick={() => { 
                                setEditingPost(post); 
                                setPostFormData({ 
                                  title: post.title, 
                                  slug: post.slug, 
                                  excerpt: post.excerpt || '', 
                                  content: post.content || '', 
                                  htmlContent: post.htmlContent || '',
                                  categoryId: post.category?.id || '', 
                                  authorName: post.authorName || 'Admin', 
                                  authorEmail: post.authorEmail || 'admin@resultpro.io',
                                  status: post.status,
                                }); 
                                setShowPostForm(true); 
                              }} 
                              className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all" 
                              title="Edit"
                            >
                              <Edit02 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDeletePost(post.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Delete"><Trash01 className="w-5 h-5" /></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(categories || []).map((cat) => (
                <div key={cat.id} className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><Folder className="w-6 h-6" /></div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryFormData({
                            name: cat.name,
                            slug: cat.slug,
                            description: cat.description || '',
                            displayOrder: cat.displayOrder,
                            isActive: cat.isActive,
                          });
                          setShowCategoryForm(true);
                        }}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-blue-400 transition-all"
                      >
                        <Settings02 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-all"
                      >
                        <Trash01 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">{cat.name}</h4>
                  <p className="text-xs text-gray-500 font-mono mb-4">/{cat.slug}</p>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{cat.description || 'No description provided'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{cat._count?.posts || 0} Articles</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${cat.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
               <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Pending Moderation</h2>
                </div>
                {comments.length > 0 ? (
                  <div className="p-6 space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-6 rounded-[24px] bg-white/5 border border-white/5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-white">{comment.authorName}</p>
                            <p className="text-xs text-gray-500">{comment.authorEmail}</p>
                            <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase tracking-wider">Post: {comment.post?.title || 'Unknown Post'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleApproveComment(comment.id)} className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all">Approve</button>
                            <button onClick={() => handleRejectComment(comment.id)} className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all">Reject</button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed italic">"{comment.content}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-4">
                    <MessageCircle className="w-16 h-16 text-gray-600 mx-auto opacity-20" />
                    <h3 className="text-xl font-bold text-white">All Clear!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm">There are currently no comments waiting for approval.</p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Post Form Modal */}
        {showPostForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-950 border border-white/10 rounded-[32px] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                <h3 className="text-2xl font-bold text-white">{editingPost ? 'Edit Article' : 'Compose New Article'}</h3>
                <button onClick={() => setShowPostForm(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500">✕</button>
              </div>
              <form onSubmit={handleSavePost} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Enter post title"
                      value={postFormData.title} 
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setPostFormData({ ...postFormData, title, slug: editingPost ? postFormData.slug : slug });
                      }} 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">URL Slug</label>
                    <input type="text" required value={postFormData.slug} onChange={(e) => setPostFormData({ ...postFormData, slug: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                    <select required value={postFormData.categoryId} onChange={(e) => setPostFormData({ ...postFormData, categoryId: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none cursor-pointer">
                      <option value="">Select Category...</option>
                      {(categories || []).map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Author Name</label>
                    <input type="text" value={postFormData.authorName} onChange={(e) => setPostFormData({ ...postFormData, authorName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Author Email</label>
                    <input type="email" value={postFormData.authorEmail} onChange={(e) => setPostFormData({ ...postFormData, authorEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Excerpt</label>
                  <textarea rows={2} placeholder="Brief summary for list view..." value={postFormData.excerpt} onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Article Content</label>
                    <button 
                      type="button" 
                      onClick={() => setPreviewMode(!previewMode)}
                      className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
                    >
                      {previewMode ? 'Editor Mode' : 'Preview Mode'}
                    </button>
                  </div>
                  
                  {previewMode ? (
                    <div 
                      className="w-full px-8 py-6 rounded-xl bg-white/5 border border-white/10 text-white min-h-[400px] prose prose-invert max-w-none overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: postFormData.htmlContent }}
                    />
                  ) : (
                    <div className="quill-container bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <style>{`
                        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; background: rgba(255,255,255,0.02); }
                        .ql-container.ql-snow { border: none !important; min-height: 400px; font-size: 16px; }
                        .ql-editor { min-height: 400px; color: white; }
                        .ql-editor.ql-blank::before { color: rgba(255,255,255,0.3) !important; font-style: normal; }
                        .ql-snow .ql-stroke { stroke: #94a3b8 !important; }
                        .ql-snow .ql-fill { fill: #94a3b8 !important; }
                        .ql-snow .ql-picker { color: #94a3b8 !important; }
                        .ql-snow .ql-picker-options { background-color: #0f172a !important; border: 1px solid rgba(255,255,255,0.1) !important; }
                      `}</style>
                      <ReactQuill 
                        theme="snow"
                        value={postFormData.htmlContent}
                        onChange={(content) => setPostFormData({ ...postFormData, htmlContent: content })}
                        modules={modules}
                        formats={formats}
                        placeholder="Start writing your masterpiece..."
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">{editingPost ? 'Save Changes' : 'Create Post'}</button>
                  <button type="button" onClick={() => setShowPostForm(false)} className="px-8 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
