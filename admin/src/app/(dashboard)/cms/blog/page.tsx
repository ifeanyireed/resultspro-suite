'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { 
  FileText, Plus, Edit, Trash2, Eye, 
  LayoutDashboard, Folder, MessageCircle, 
  BarChart2, CheckCircle, Clock, Heart,
  Settings, Search
} from 'lucide-react';

export default function BlogCMSPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'categories' | 'comments'>('dashboard');

  const posts = [
    {
      id: '1',
      title: 'Top 10 Tips for Passing WAEC and JAMB in One Sitting',
      author: 'Editorial Team',
      category: 'Exam Tips',
      views: 4820,
      likes: 342,
      comments: 12,
      status: 'PUBLISHED',
      date: '2026-08-01',
    },
    {
      id: '2',
      title: 'How SchoolHub Transforms Parent-School Communication in 2026',
      author: 'Product Team',
      category: 'EdTech Trends',
      views: 2950,
      likes: 189,
      comments: 5,
      status: 'PUBLISHED',
      date: '2026-08-10',
    },
    {
      id: '3',
      title: 'A Comprehensive Guide to Spaced Repetition Flashcards',
      author: 'Dr. Adeyemi',
      category: 'Learning Science',
      views: 1300,
      likes: 56,
      comments: 2,
      status: 'DRAFT',
      date: '2026-08-15',
    },
  ];

  const categories = [
    { id: '1', name: 'Exam Tips', slug: 'exam-tips', articles: 45, status: 'Active' },
    { id: '2', name: 'EdTech Trends', slug: 'edtech-trends', articles: 12, status: 'Active' },
    { id: '3', name: 'Learning Science', slug: 'learning-science', articles: 8, status: 'Active' },
    { id: '4', name: 'Parenting', slug: 'parenting', articles: 24, status: 'Active' },
  ];

  const pendingComments = [
    { id: '1', author: 'Jane Doe', email: 'jane@example.com', post: 'Top 10 Tips...', content: 'Great article, very helpful!' },
    { id: '2', author: 'John Smith', email: 'john@example.com', post: 'How SchoolHub...', content: 'When will this be available in my childs school?' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="Suite Blog CMS"
        subtitle="Manage and publish SEO-optimized educational articles across the ResultsPRO gateway"
      />

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 shadow-sm transition-all text-xs">
              <Folder className="w-4 h-4" />
              New Category
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm transition-all text-xs">
              <Plus className="w-4 h-4" />
              New Article
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 w-fit shadow-sm">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'posts', icon: FileText, label: 'Articles' },
            { id: 'categories', icon: Folder, label: 'Categories' },
            { id: 'comments', icon: MessageCircle, label: 'Comments' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-500">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { label: 'Total Posts', value: 124, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Published', value: 98, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Drafts', value: 26, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Categories', value: 12, icon: Folder, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Comments', value: 842, icon: MessageCircle, color: 'text-pink-600', bg: 'bg-pink-50' },
                  { label: 'Pending', value: 14, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Total Likes', value: 12450, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{(stat.value).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Top Posts Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-blue-600" />
                    Top Performing Content
                  </h2>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Title</th>
                      <th className="px-6 py-3 font-semibold">Stats</th>
                      <th className="px-6 py-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {posts.filter(p => p.status === 'PUBLISHED').map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-4 text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-slate-600"><Eye className="w-3.5 h-3.5 text-blue-500" /> {post.views}</span>
                            <span className="flex items-center gap-1.5 text-slate-600"><Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likes}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Badge status={post.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* POSTS TAB */}
          {activeTab === 'posts' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="font-bold text-sm text-slate-900">All Articles</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Filter articles..." className="pl-9 pr-4 py-2 w-64 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Article Title</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">Author</th>
                    <th className="px-6 py-3 font-semibold">Stats</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {posts.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="line-clamp-1">{p.title}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">{p.category}</td>
                      <td className="px-6 py-4 text-slate-700">{p.author}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-slate-500 font-semibold">
                          <span className="flex items-center gap-1" title="Views"><Eye className="w-3.5 h-3.5" />{p.views}</span>
                          <span className="flex items-center gap-1" title="Comments"><MessageCircle className="w-3.5 h-3.5" />{p.comments}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={p.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-all hover:border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><Folder className="w-5 h-5" /></div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{cat.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mb-4">/{cat.slug}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cat.articles} Articles</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                      {cat.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COMMENTS TAB */}
          {activeTab === 'comments' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Pending Moderation</h2>
              </div>
              <div className="p-6 space-y-4">
                {pendingComments.map((comment) => (
                  <div key={comment.id} className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{comment.author}</p>
                        <p className="text-[10px] text-slate-500">{comment.email}</p>
                        <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-wider">Post: {comment.post}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors">Approve</button>
                        <button className="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors">Reject</button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic border-l-2 border-slate-300 pl-3">"{comment.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
