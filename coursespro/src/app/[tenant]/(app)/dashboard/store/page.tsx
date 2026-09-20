'use client';

import React, { useEffect, useState } from 'react';
import { BookOpenIcon, ArchiveBoxIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';

export default function DashboardStorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Need to extract the tenant from the hostname
    const fetchProducts = async () => {
      try {
        const domain = typeof window !== 'undefined' ? window.location.hostname : '';
        const slug = domain.split('.')[0];
        
        // Use a generic public fetch since we just want published products
        // Wait, the API needs tenant_id. We can fetch it via the public endpoint if we have the tenant_id,
        // OR we can just hit a new authenticated endpoint, OR we can fetch it via a helper.
        // Actually, since we're in a client component, let's just fetch all public store items for our tenant.
        // But the public endpoint takes tenant_id, not slug.
        // We can just rely on the API interceptor which sends X-Tenant-Domain!
        // Let's create a quick authenticated endpoint or reuse the admin one? No, admin requires admin role.
        // Let's just fetch the tenant info first, then fetch the store.
        
        const tenantRes = await fetch(`/api/public/tenant/resolve?domain=${domain}`);
        const tenantData = await tenantRes.json();
        const tenantId = tenantData.id;

        const res = await coursesApi.get(`/api/public/store?tenant_id=${tenantId}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch store products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'BOOK': return <BookOpenIcon className="w-5 h-5 text-indigo-500" strokeWidth={2} />;
      case 'DOWNLOADABLE_COURSE': return <ArchiveBoxIcon className="w-5 h-5 text-emerald-500" strokeWidth={2} />;
      default: return <DocumentIcon className="w-5 h-5 text-gray-500" strokeWidth={2} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Digital Store</h1>
        <p className="text-sm text-gray-500 mt-1">Enhance your learning with premium e-books, assets, and templates.</p>
      </div>

      {loading ? (
        <div className="animate-pulse flex gap-6">
          <div className="w-64 h-64 bg-gray-100 rounded-2xl"></div>
          <div className="w-64 h-64 bg-gray-100 rounded-2xl"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
          <ArchiveBoxIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Store is Empty</h3>
          <p className="text-gray-500 mt-1 text-sm">Check back later for new digital products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group hover:-translate-y-1">
              {prod.cover_image ? (
                <img src={prod.cover_image} alt={prod.title} className="w-full h-40 object-cover border-b border-gray-100" />
              ) : (
                <div className="w-full h-40 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                  {getIconForType(prod.product_type)}
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-gray-100 text-gray-700">
                    {prod.product_type.replace('_', ' ')}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{prod.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">{prod.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xl font-black text-gray-900">${Number(prod.price).toFixed(2)}</span>
                  <button className="bg-[#146ef5] text-white hover:bg-[#105bd1] px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-[#146ef5]/20">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
