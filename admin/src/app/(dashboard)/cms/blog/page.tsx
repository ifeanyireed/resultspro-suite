'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { StatCard } from '@/components/StatCard';
import { DocumentTextIcon, CheckCircleIcon, DocumentIcon, PlusIcon, TagIcon, ChatBubbleLeftIcon, FolderIcon } from '@heroicons/react/24/outline';
import { fetchBlogPosts } from '@/lib/api';
import { BlogPost } from '@/lib/types';

const TABS = [
  { id: 'posts', name: 'Posts', icon: DocumentTextIcon },
  { id: 'categories', name: 'Categories', icon: FolderIcon },
  { id: 'tags', name: 'Tags', icon: TagIcon },
  { id: 'comments', name: 'Comments', icon: ChatBubbleLeftIcon },
];

export default function BlogCMSPage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchBlogPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  const totalPosts = posts.length;
  const published = posts.filter(p => p.status === 'PUBLISHED').length;
  const drafts = posts.filter(p => p.status === 'DRAFT').length;

  return (
    <div className="w-full">
      <Header
        title="Suite Blog CMS"
        subtitle="Manage global articles, categories, tags, and comments across the suite"
      >
        <button className="flex items-center gap-2 bg-[#146ef5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-4 h-4" />
          {activeTab === 'posts' ? 'Create Post' : activeTab === 'categories' ? 'Add Category' : activeTab === 'tags' ? 'Add Tag' : 'Settings'}
        </button>
      </Header>

      <div className="p-8 space-y-8">
        
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Posts"
                value={loading ? '...' : totalPosts}
                icon={DocumentTextIcon}
                color="blue"
              />
              <StatCard
                title="Published"
                value={loading ? '...' : published}
                icon={CheckCircleIcon}
                color="emerald"
              />
              <StatCard
                title="Drafts"
                value={loading ? '...' : drafts}
                icon={DocumentIcon}
                color="amber"
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-800">All Posts</h3>
                <input 
                  type="text"
                  placeholder="Search posts..."
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-white border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading posts...</td>
                      </tr>
                    ) : posts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No blog posts found. Create one to get started.</td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900">{post.title}</p>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">{post.excerpt}</p>
                          </td>
                          <td className="px-6 py-4">{post.author}</td>
                          <td className="px-6 py-4">{post.category}</td>
                          <td className="px-6 py-4">
                            <Badge status={post.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {post.published_at 
                              ? new Date(post.published_at).toLocaleDateString() 
                              : new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</button>
                            <button className="text-rose-600 hover:text-rose-800 text-sm font-medium">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Categories</h3>
              <input type="text" placeholder="Search categories..." className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Post Count</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No categories found. Add one to get started.</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Tags</h3>
              <input type="text" placeholder="Search tags..." className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Post Count</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No tags found. Add one to get started.</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Comments</h3>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Spam</option>
                </select>
                <input type="text" placeholder="Search comments..." className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">In Response To</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No comments found.</td></tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
