"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewKBArticle() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    content: '',
    status: 'published'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
      const res = await fetch(`${USERS_API}/api/v1/support/kb/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
      const res = await fetch(`${USERS_API}/api/v1/support/kb/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('resultspro_admin_token')}`
        },
        body: JSON.stringify({
          ...formData,
          slug: generateSlug(formData.title),
          author_id: JSON.parse(localStorage.getItem('user') || '{}').id
        })
      });

      if (res.ok) {
        router.push('/support/kb');
      } else {
        alert('Failed to create article');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 p-6 rounded-2xl overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/support/kb" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm border border-gray-100 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Article</h2>
          <p className="text-sm text-gray-500 mt-1">Write a new knowledge base blueprint.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-4xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#146ef5] outline-none text-gray-900"
              placeholder="e.g. How to process refunds"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              required
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#146ef5] outline-none text-gray-900 bg-white"
            >
              <option value="" disabled>Select category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="status" 
                value="published" 
                checked={formData.status === 'published'}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-4 h-4 text-[#146ef5]"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="status" 
                value="draft" 
                checked={formData.status === 'draft'}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-4 h-4 text-[#146ef5]"
              />
              <span className="text-sm text-gray-700">Draft</span>
            </label>
          </div>
        </div>

        <div className="flex-1 flex flex-col mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
          <textarea 
            required
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            className="flex-1 w-full border border-gray-200 rounded-xl p-4 focus:border-[#146ef5] outline-none text-gray-900 font-mono text-sm resize-none min-h-[400px]"
            placeholder="# Introduction\n\nStart typing..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-auto">
          <Link href="/support/kb" className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2.5 bg-[#146ef5] text-white font-medium rounded-xl hover:bg-[#105bd1] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
