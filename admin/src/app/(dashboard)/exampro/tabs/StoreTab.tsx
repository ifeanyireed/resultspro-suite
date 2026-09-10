import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Edit2, Trash2, Tag, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchExamproStorePacks, 
  createExamproStorePack, 
  updateExamproStorePack, 
  deleteExamproStorePack 
} from '@/lib/api';

export default function StoreTab() {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'COIN',
    coins: 0,
    price: 0,
    description: '',
    color: 'blue',
    popular: false,
    discount: '',
    bonus: '',
    isActive: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExamproStorePacks();
      setPacks(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error('Failed to load store packs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (pack?: any) => {
    if (pack) {
      setEditingPack(pack);
      setFormData({
        name: pack.name || '',
        type: pack.type || 'COIN',
        coins: pack.coins || 0,
        price: pack.price || 0,
        description: pack.description || '',
        color: pack.color || 'blue',
        popular: pack.popular || false,
        discount: pack.discount || '',
        bonus: pack.bonus || '',
        isActive: pack.isActive ?? true
      });
    } else {
      setEditingPack(null);
      setFormData({
        name: '',
        type: 'COIN',
        coins: 0,
        price: 0,
        description: '',
        color: 'blue',
        popular: false,
        discount: '',
        bonus: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        coins: Number(formData.coins),
        price: Number(formData.price)
      };

      if (editingPack) {
        await updateExamproStorePack(editingPack.id, payload);
        toast.success('Pack updated successfully');
      } else {
        await createExamproStorePack(payload);
        toast.success('Pack created successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(editingPack ? 'Failed to update pack' : 'Failed to create pack');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pack?')) return;
    try {
      await deleteExamproStorePack(id);
      toast.success('Pack deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete pack');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" /> Store & Plans Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage Coin Packs, ICAN Subscriptions, and Premium Plans</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      {/* Grid of Packs */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium">Loading store items...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <div key={pack.id} className={`relative bg-white rounded-2xl border ${!pack.isActive ? 'border-dashed border-slate-300 opacity-60' : pack.popular ? 'border-indigo-500 shadow-md' : 'border-slate-200 shadow-sm'} p-6 flex flex-col`}>
              
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> Most Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    {pack.type === 'COIN' ? <Zap className="w-3 h-3 text-amber-500 fill-current" /> : <Tag className="w-3 h-3 text-indigo-500" />}
                    {pack.type === 'COIN' ? 'Coin Pack' : 'Subscription Plan'}
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{pack.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(pack)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(pack.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-3xl font-black text-slate-900 mb-2">
                {formatCurrency(pack.price)}
              </div>

              {pack.type === 'COIN' && (
                <div className="text-sm font-bold text-amber-500 mb-4 flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-current" /> {pack.coins.toLocaleString()} Coins
                </div>
              )}

              {pack.description && (
                <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-2">{pack.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
                {pack.discount && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase">{pack.discount}</span>}
                {pack.bonus && <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-[10px] font-bold uppercase">{pack.bonus}</span>}
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${pack.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  {pack.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[10px] font-bold uppercase capitalize border border-slate-100">
                  Theme: {pack.color}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {editingPack ? <Edit2 className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4 text-indigo-600" />}
                {editingPack ? 'Edit Store Item' : 'Create Store Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <ShoppingCart className="w-5 h-5 opacity-0 hidden" /> {/* spacer */}
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Starter Pack, ICAN Full Access" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Item Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                    <option value="COIN">Coin Pack</option>
                    <option value="PREMIUM">Subscription Plan</option>
                  </select>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Price (NGN)</label>
                  <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Coins Granted (if Coin Pack)</label>
                  <input type="number" min="0" value={formData.coins} onChange={e => setFormData({...formData, coins: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Short description of the item" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Discount Tag (Optional)</label>
                  <input type="text" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Save 20%" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bonus Tag (Optional)</label>
                  <input type="text" value={formData.bonus} onChange={e => setFormData({...formData, bonus: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. +500 Bonus" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Color Theme</label>
                  <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                    <option value="blue">Blue</option>
                    <option value="amber">Amber</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  Mark as Most Popular
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  Active (Visible in Store)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">
                  {editingPack ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
