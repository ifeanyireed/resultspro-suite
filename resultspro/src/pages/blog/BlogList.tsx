import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '@/lib/axiosConfig';
import { IconSearch as Search, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight, IconHeart as Heart, IconEye as Eye, IconFileText as FileText } from '@tabler/icons-react';
import Navigation from '@/components/Navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImageUrl?: string;
  authorName: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedCategory = searchParams.get('category');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/super-admin/blog/public/posts', {
        params: {
          page,
          limit: 10,
          category: selectedCategory,
        },
      });
      if (res.data?.success) {
        setPosts(res.data.data);
        setTotalPages(res.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/super-admin/blog/public/categories');
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory]);

  const handleCategoryChange = (slug: string | null) => {
    setPage(1);
    if (slug) {
      setSearchParams({ category: slug, page: '1' });
    } else {
      setSearchParams({ page: '1' });
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0 opacity-40"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        {/* Decorative Blurs */}
        <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-48 -left-24" />
        <div className="absolute w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] bottom-0 right-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 pt-40">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Results Pro <span className="text-blue-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Expert insights on school management, educational technology, and platform updates.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-focus-within:bg-blue-500/30 transition-all duration-500" />
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 pl-14 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-2xl"
              />
              <Search className="absolute left-5 w-6 h-6 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-20">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-8 py-3 rounded-xl font-bold transition-all border shadow-lg ${
              !selectedCategory
                ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-8 py-3 rounded-xl font-bold transition-all border shadow-lg ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-32 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10">
            <p className="text-gray-400 text-xl font-medium">No articles found matching your search</p>
          </div>
        ) : (
          <>
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white/5 backdrop-blur-md rounded-[40px] overflow-hidden hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-blue-500/50 shadow-2xl"
                >
                  <div className="w-full h-64 bg-gray-900 relative overflow-hidden">
                    {post.featuredImageUrl ? (
                      <img
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-blue-500/20" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-xl backdrop-blur-md">
                        {post.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-6">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></span>
                      <span>5 min read</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-base mb-8 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                          {post.authorName.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-gray-300">{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                          <Eye className="w-4 h-4" /> <span className="text-xs font-bold">{post.viewCount}</span>
                        </span>
                        <span className="flex items-center gap-2 hover:text-pink-400 transition-colors">
                          <Heart className="w-4 h-4" /> <span className="text-xs font-bold">{post.likeCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-14 h-14 rounded-2xl font-black transition-all border shadow-xl ${
                        page === p
                          ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-20 px-4 md:px-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <img src="/logo.png" alt="Results Pro" className="h-12 w-auto mx-auto mb-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase mb-4">
            &copy; 2026 Results Pro. All rights reserved.
          </p>
          <div className="flex justify-center gap-8 text-gray-600 text-xs font-black uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
