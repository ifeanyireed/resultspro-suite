'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';
import StoreProductModal from './StoreProductModal';

export default function StoreManagementPage() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: products = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['store_products'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/admin/store');
      return res.data.products || [];
    }
  });

  const openNewModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await coursesApi.delete(`/api/admin/store/${id}`);
      refetch();
    } catch (err: any) {
      alert("Failed to delete product.");
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'BOOK': return <BookOpenIcon className="w-5 h-5 text-indigo-500" strokeWidth={2} />;
      case 'DOWNLOADABLE_COURSE': return <ArchiveBoxIcon className="w-5 h-5 text-emerald-500" strokeWidth={2} />;
      default: return <DocumentIcon className="w-5 h-5 text-gray-500" strokeWidth={2} />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Digital Store Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage e-books, downloadable courses, and templates for your public store.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <ArchiveBoxIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
            <p className="text-sm text-gray-500 mt-1">Add your first e-book or digital asset to start selling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((prod: any) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {prod.cover_image ? (
                           <img src={prod.cover_image} alt={prod.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        ) : (
                           <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                             {getIconForType(prod.product_type)}
                           </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{prod.title}</p>
                          <p className="text-xs text-gray-500 max-w-[200px] truncate">{prod.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {getIconForType(prod.product_type)}
                        {prod.product_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        prod.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {prod.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(prod)} className="p-2 text-gray-400 hover:text-[#146ef5] transition-colors rounded-lg hover:bg-blue-50 mr-1">
                        <PencilSquareIcon className="w-5 h-5" strokeWidth={2} />
                      </button>
                      <button onClick={() => deleteProduct(prod.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                        <TrashIcon className="w-5 h-5" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StoreProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={() => refetch()} 
        product={selectedProduct} 
      />
    </>
  );
}
