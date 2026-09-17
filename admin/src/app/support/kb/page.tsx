"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, DocumentTextIcon, FolderIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function KnowledgeBaseDashboard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
      
      const [catsRes, artsRes] = await Promise.all([
        fetch(`${USERS_API}/api/v1/support/kb/categories`),
        fetch(`${USERS_API}/api/v1/support/kb/articles`)
      ]);

      if (catsRes.ok) setCategories(await catsRes.json() || []);
      if (artsRes.ok) setArticles(await artsRes.json() || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
      const res = await fetch(`${USERS_API}/api/v1/support/kb/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('resultspro_admin_token')}`
        }
      });
      if (res.ok) {
        setArticles(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {}
  };

  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category_id === activeCategory)
    : articles;

  return (
    <div className="flex flex-col h-full bg-gray-50/50 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Knowledge Base</h2>
          <p className="text-sm text-gray-500 mt-1">Manage support articles, guides, and blueprints.</p>
        </div>
        <Link href="/support/kb/new" className="bg-[#146ef5] text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-[#105bd1] transition-colors shadow-sm">
          <PlusIcon className="w-5 h-5" />
          New Article
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#146ef5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex gap-8 flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 shrink-0 flex flex-col gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                activeCategory === null 
                  ? 'bg-white text-[#146ef5] shadow-sm border border-gray-100' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FolderIcon className="w-5 h-5" />
              All Categories
              <span className="ml-auto bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-full">
                {articles.length}
              </span>
            </button>
            
            {categories.map(cat => {
              const count = articles.filter(a => a.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                    activeCategory === cat.id 
                      ? 'bg-white text-[#146ef5] shadow-sm border border-gray-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FolderIcon className="w-5 h-5" />
                  {cat.name}
                  <span className="ml-auto bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Articles List */}
          <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-900 font-medium">No articles found</h3>
                <p className="text-gray-500 text-sm mt-1">Get started by creating a new article.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredArticles.map(article => (
                  <Link 
                    href={`/support/kb/${article.id}`} 
                    key={article.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#146ef5]/10 flex items-center justify-center shrink-0">
                        <DocumentTextIcon className="w-5 h-5 text-[#146ef5]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 leading-tight group-hover:text-[#146ef5] transition-colors">{article.title}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                            article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {article.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {article.category?.name || categories.find(c => c.id === article.category_id)?.name}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            Updated {new Date(article.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleDelete(article.id, e)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
