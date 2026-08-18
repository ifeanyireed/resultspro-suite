'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function BlogCMSPage() {
  const posts = [
    {
      id: '1',
      title: 'Top 10 Tips for Passing WAEC and JAMB in One Sitting',
      author: 'Editorial Team',
      category: 'Exam Tips',
      views: 4820,
      status: 'PUBLISHED',
      date: '2026-08-01',
    },
    {
      id: '2',
      title: 'How SchoolHub Transforms Parent-School Communication in 2026',
      author: 'Product Team',
      category: 'EdTech Trends',
      views: 2950,
      status: 'PUBLISHED',
      date: '2026-08-10',
    },
    {
      id: '3',
      title: 'A Comprehensive Guide to Spaced Repetition Flashcards for Secondary Students',
      author: 'Dr. Adeyemi',
      category: 'Learning Science',
      views: 1300,
      status: 'DRAFT',
      date: '2026-08-15',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Suite Blog CMS"
        subtitle="Manage and publish SEO-optimized educational articles across the ResultsPRO gateway"
      />

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-slate-900">Articles & Educational Guides</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center space-x-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Article Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Total Views</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Publish Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{p.title}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-semibold">{p.category}</td>
                  <td className="px-4 py-3.5 text-slate-800">{p.author}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <Badge status={p.status} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{p.date}</td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button className="text-slate-600 hover:text-blue-600">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-slate-600 hover:text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
