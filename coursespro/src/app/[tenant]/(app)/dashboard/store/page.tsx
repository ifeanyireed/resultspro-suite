'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { 
  BookOpenIcon, 
  ArchiveBoxIcon, 
  DocumentIcon, 
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  ArrowDownTrayIcon,
  TagIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  description: string;
  product_type: 'BOOK' | 'DOWNLOADABLE_COURSE' | 'TEMPLATE' | string;
  price: number;
  stock?: number | null;
  cover_image?: string;
  file_url?: string;
  is_published: boolean;
}

export default function DashboardStorePage() {
  const { user } = useAuthStore();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['student-store-products', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/store');
      return res.data?.products || [];
    },
    enabled: !!user,
  });

  const products: Product[] = data || [];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'BOOK': 
        return <BookOpenIcon className="w-6 h-6 text-indigo-500" strokeWidth={1.8} />;
      case 'DOWNLOADABLE_COURSE': 
        return <ArchiveBoxIcon className="w-6 h-6 text-emerald-500" strokeWidth={1.8} />;
      default: 
        return <DocumentIcon className="w-6 h-6 text-[#146ef5]" strokeWidth={1.8} />;
    }
  };

  const formatPrice = (price: number) => {
    if (price <= 0) return 'Free';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesType = filterType === 'ALL' || prod.product_type === filterType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      prod.title.toLowerCase().includes(q) || 
      (prod.description && prod.description.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  const handlePurchase = (prod: Product) => {
    if (prod.price <= 0 && prod.file_url) {
      window.open(prod.file_url, '_blank', 'noopener,noreferrer');
      toast.success('Free download started!');
      return;
    }
    toast.success(`Checkout initialized for ${prod.title}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & KPI Summary */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#146ef5] border border-blue-100">
              <ShoppingBagIcon className="w-3.5 h-3.5 text-[#146ef5]" />
              Digital Learning Marketplace
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Curriculum Store</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Acquire specialized e-books, downloadable sprint repositories, exam preparation guides, and architectural design kits.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-gray-50 text-gray-800 px-4 py-2.5 rounded-2xl border border-gray-200 shadow-xs">
          <SparklesIcon className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Available Assets</p>
            <p className="font-extrabold text-sm">{products.length} Products</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'ALL'
                ? 'bg-[#146ef5] text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilterType('BOOK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'BOOK'
                ? 'bg-[#146ef5] text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Books & Guides
          </button>
          <button
            onClick={() => setFilterType('DOWNLOADABLE_COURSE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'DOWNLOADABLE_COURSE'
                ? 'bg-[#146ef5] text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Course Bundles
          </button>
          <button
            onClick={() => setFilterType('TEMPLATE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'TEMPLATE'
                ? 'bg-[#146ef5] text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Templates & Code
          </button>
        </div>

        {/* Real-time Search */}
        <div className="relative min-w-[240px]">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
          />
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 font-medium text-xs">Loading campus digital catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center shadow-xs">
          <ArchiveBoxIcon className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-gray-900">No products found</h3>
          <p className="text-gray-400 text-xs mt-1">
            {searchQuery ? 'Try adjusting your search query.' : 'New e-books and templates will appear here soon.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isBookOutOfStock = prod.product_type === 'BOOK' && typeof prod.stock === 'number' && prod.stock <= 0;
            const hasStock = prod.product_type === 'BOOK' && typeof prod.stock === 'number';

            return (
              <div 
                key={prod.id} 
                className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group hover:-translate-y-1"
              >
                {/* Product Cover Artwork */}
                <div className="w-full h-44 bg-gradient-to-tr from-slate-100 via-gray-50 to-blue-50/40 relative flex items-center justify-center border-b border-gray-100 overflow-hidden">
                  {prod.cover_image ? (
                    <img 
                      src={prod.cover_image} 
                      alt={prod.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-gray-200/80 flex items-center justify-center">
                      {getIconForType(prod.product_type)}
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs border border-gray-200/60">
                    {prod.product_type.replace('_', ' ')}
                  </span>
                  {hasStock && (
                    !isBookOutOfStock ? (
                      <span className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                        {prod.stock} left
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                        Sold Out
                      </span>
                    )
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug line-clamp-1">
                      {prod.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                      {prod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Price</p>
                      <span className="text-base font-black text-gray-900">
                        {formatPrice(prod.price)}
                      </span>
                    </div>
                    <button 
                      onClick={() => handlePurchase(prod)}
                      disabled={isBookOutOfStock}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 ${
                        isBookOutOfStock
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-[#146ef5] text-white hover:bg-[#105bd1] shadow-[#146ef5]/20'
                      }`}
                    >
                      {isBookOutOfStock ? (
                        'Sold Out'
                      ) : prod.price <= 0 ? (
                        <>
                          <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Download
                        </>
                      ) : (
                        <>
                          <ShoppingBagIcon className="w-3.5 h-3.5" /> Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
