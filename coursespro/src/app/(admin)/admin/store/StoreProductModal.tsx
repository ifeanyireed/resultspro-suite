import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';

interface StoreProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  product?: any;
}

export default function StoreProductModal({ isOpen, onClose, onSaved, product }: StoreProductModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    product_type: 'BOOK',
    price: 0,
    cover_image: '',
    file_url: '',
    is_published: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        product_type: product.product_type || 'BOOK',
        price: product.price || 0,
        cover_image: product.cover_image || '',
        file_url: product.file_url || '',
        is_published: product.is_published || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        product_type: 'BOOK',
        price: 0,
        cover_image: '',
        file_url: '',
        is_published: false
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price as any)
      };
      
      if (product) {
        await coursesApi.put(`/api/admin/store/${product.id}`, payload);
      } else {
        await coursesApi.post('/api/admin/store', payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      alert("Failed to save product: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden relative z-10"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'New Digital Product'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Master React in 10 Days" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <select className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" value={formData.product_type} onChange={e => setFormData({...formData, product_type: e.target.value})}>
                    <option value="BOOK">E-Book</option>
                    <option value="DOWNLOADABLE_COURSE">Downloadable Course / Asset</option>
                    <option value="TEMPLATE">Template</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input required type="number" min="0" step="0.01" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe what the buyer gets..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input type="text" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset File URL (The actual product)</label>
                <input required type="text" className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} placeholder="https://..." />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_published" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <label htmlFor="is_published" className="text-sm text-gray-700 font-medium">Publish to Store</label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#146ef5] hover:bg-[#105bd1] rounded-xl shadow-sm shadow-[#146ef5]/20 disabled:opacity-50 transition-colors">
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
