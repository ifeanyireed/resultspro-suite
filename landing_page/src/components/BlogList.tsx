'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconEye, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const POSTS_PER_PAGE = 9;

export function BlogList({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts || []);
  const [loading, setLoading] = useState<boolean>(!initialPosts || initialPosts.length === 0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    async function loadClient() {
      try {
        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
        const [postsRes, catRes] = await Promise.all([
          fetch(`${USERS_API}/api/v1/cms/blog/posts`),
          fetch(`${USERS_API}/api/v1/cms/blog/categories`)
        ]);
        if (postsRes.ok) {
          const data = await postsRes.json();
          if (Array.isArray(data)) {
            const published = data.filter((p: any) => p.status === 'PUBLISHED');
            if (catRes.ok) {
              const categories = await catRes.json();
              published.forEach((p: any) => {
                const cat = categories.find((c: any) => c.id === p.category_id);
                if (cat) p.category = cat.name;
              });
            }
            setPosts(published);
          }
        }
      } catch (err) {
        console.error('Client fallback blog fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [initialPosts]);

  // Synchronize initial page from URL query string
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pageParam = new URLSearchParams(window.location.search).get('page');
      if (pageParam) {
        const p = parseInt(pageParam, 10);
        if (!isNaN(p) && p > 0) {
          setCurrentPage(p);
        }
      }
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  // Reset page if filtered results are fewer than current page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (page === 1) {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', page.toString());
      }
      window.history.pushState({}, '', url.toString());

      if (gridTopRef.current) {
        const yOffset = -120;
        const y = gridTopRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      window.history.pushState({}, '', url.toString());
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em]" style={{ borderColor: 'var(--color-nets-navy, #0f172a) transparent transparent transparent' }} />
        <p className="mt-4 text-sm text-gray-500">Loading latest articles...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="text-center text-muted py-12">No blog posts found.</div>;
  }

  return (
    <div ref={gridTopRef}>
      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-navy'
              }`}
              style={selectedCategory === cat ? { background: 'var(--color-nets-navy-dark, #0D1060)' } : undefined}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 9-Post Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedPosts.map((post: any) => {
          const coverImg = post.cover_image 
            ? (post.cover_image.startsWith('http://') || post.cover_image.startsWith('https://')
                ? post.cover_image 
                : `https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/${post.cover_image.split('/').pop()}`)
            : 'https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/photo13.jpg';

          return (
            <article key={post.id} className="bg-white rounded-sm shadow-sm hover:shadow-card-lg transition-shadow overflow-hidden flex flex-col border border-gray-200">
              <div className="relative h-48 overflow-hidden bg-nets-light">
                <img 
                  src={coverImg}
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-navy text-xs fw-600 px-3 py-1 rounded-sm">
                    {post.category || 'Blog'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-muted mb-3">
                  <span>
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    <IconEye size={14} className="text-slate-400" />
                    {(Number(post.view_count) || 0).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl fw-600 mb-3 text-navy leading-tight line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted mb-6 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm fw-600 text-red hover:opacity-80 transition-opacity" style={{ color: 'var(--color-nets-red)' }}>
                    Read Article <IconArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Controller (9 per view) */}
      {totalPages > 1 && (
        <nav aria-label="Blog pagination" className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-900">{filteredPosts.length}</span> articles
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded border transition-colors ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-navy cursor-pointer'
              }`}
            >
              <IconChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400 select-none">
                      …
                    </span>
                  );
                }
                const pageNum = Number(page);
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-9 h-9 text-sm font-semibold rounded flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    style={isActive ? { background: 'var(--color-nets-navy-dark, #0D1060)' } : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded border transition-colors ${
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-navy cursor-pointer'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <IconChevronRight size={16} />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
