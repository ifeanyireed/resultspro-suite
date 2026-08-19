'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Plus, Edit2, Trash2, CheckCircle2, Clock, Eye, Heart, MessageCircle, BarChart2, Folder, Search, FileText, XCircle, Settings, X } from 'lucide-react';

export default function BlogCmsPage() {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'posts' | 'categories' | 'comments'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    setStats({
      totalPosts: 45, publishedPosts: 38, draftPosts: 7, totalCategories: 5, totalComments: 120, pendingComments: 3, totalLikes: 890,
      topPosts: [
        { id: '1', title: 'How to use ResultsPRO for Termly Reports', viewCount: 1200, likeCount: 45 },
        { id: '2', title: '5 Ways to Boost Agent Commissions', viewCount: 950, likeCount: 30 }
      ]
    });
    setPosts([
      { id: '1', title: 'How to use ResultsPRO for Termly Reports', status: 'PUBLISHED', viewCount: 1200, category: { name: 'Tutorials' }, _count: { comments: 12 } },
      { id: '2', title: 'Upcoming Features in 2026', status: 'DRAFT', viewCount: 0, category: { name: 'Announcements' }, _count: { comments: 0 } }
    ]);
    setCategories([
      { id: '1', name: 'Tutorials', slug: 'tutorials', description: 'Guides on using the platform.', _count: { posts: 15 }, isActive: true },
      { id: '2', name: 'Announcements', slug: 'announcements', description: 'Product updates.', _count: { posts: 8 }, isActive: true }
    ]);
    setComments([
      { id: '1', authorName: 'John Doe', authorEmail: 'john@example.com', content: 'Great tutorial, helped a lot!', post: { title: 'How to use ResultsPRO...' } }
    ]);
  }, []);

  return (
    <div className="w-full">
      <Header
        title="Suite Blog CMS"
        subtitle="Manage global blog articles, categories, and content for the ResultsPRO ecosystem"
      />

      <div className="p-8 space-y-6 max-w-[1400px] mx-auto w-full">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-full shadow-inner border border-slate-200 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {['dashboard', 'posts', 'categories', 'comments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                  activeSubTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Folder className="w-4 h-4" />
              <span>New Category</span>
            </button>
            <button
              onClick={() => setShowPostForm(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-300">
          {activeSubTab === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Published', value: stats.publishedPosts, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
                  { label: 'Drafts', value: stats.draftPosts, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
                  { label: 'Categories', value: stats.totalCategories, icon: Folder, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
                  { label: 'Comments', value: stats.totalComments, icon: MessageCircle, color: 'text-pink-500', bg: 'bg-pink-50 border-pink-100' },
                  { label: 'Pending', value: stats.pendingComments, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
                  { label: 'Likes', value: stats.totalLikes, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100' },
                ].map((stat, idx) => (
                  <div key={idx} className={`rounded-2xl border p-4 ${stat.bg} shadow-sm`}>
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                    <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{(stat.value || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-base text-slate-800">Top Performing Content</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Title</th>
                        <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Stats</th>
                        <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.topPosts.map((post: any) => (
                        <tr key={post.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-800">{post.title}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4 text-xs">
                              <span className="flex items-center gap-1 text-slate-500 font-medium"><Eye className="w-3.5 h-3.5" /> {post.viewCount}</span>
                              <span className="flex items-center gap-1 text-rose-500 font-medium"><Heart className="w-3.5 h-3.5" /> {post.likeCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Badge status="ACTIVE" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'posts' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-base text-slate-800">All Articles</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Filter articles..." className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all group flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge status={post.status} />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.category?.name}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{post.title}</h4>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"><Eye className="w-3.5 h-3.5" /> {post.viewCount} Views</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"><MessageCircle className="w-3.5 h-3.5" /> {post._count?.comments} Comments</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === 'DRAFT' && (
                        <button className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all" title="Publish"><CheckCircle2 className="w-4 h-4" /></button>
                      )}
                      <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Folder className="w-5 h-5" /></div>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-all"><Settings className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-1">{cat.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mb-4">/{cat.slug}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{cat.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat._count?.posts} Articles</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${cat.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'comments' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="font-bold text-base text-slate-800">Pending Moderation</h2>
              </div>
              <div className="p-6 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{comment.authorName}</p>
                        <p className="text-[10px] text-slate-500">{comment.authorEmail}</p>
                        <p className="text-[9px] text-blue-600 font-bold mt-1 uppercase tracking-wider">Post: {comment.post?.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold hover:bg-emerald-100 transition-all">Approve</button>
                        <button className="px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold hover:bg-rose-100 transition-all">Reject</button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{comment.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Placeholders for Forms */}
      {showPostForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl relative">
            <button onClick={() => setShowPostForm(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Compose New Article</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Article Title" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
              <textarea rows={10} placeholder="Write your content here..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"></textarea>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700">Save Article</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
