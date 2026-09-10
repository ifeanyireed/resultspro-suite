import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Edit2, Trash2, Tag, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchExamproStorePacks, createExamproStorePack, updateExamproStorePack, deleteExamproStorePack,
  fetchExamproSettings, updateExamproSetting
} from '@/lib/api';

export default function StoreTab() {
  const [packs, setPacks] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeView, setActiveView] = useState<'COIN' | 'ACTIVITY' | 'REFERRAL'>('COIN');
  const [settings, setSettings] = useState<any[]>([]);

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
    isActive: true,
    category: 'School',
    period: 'per month',
    features: '',
    ctaText: 'Get Started',
    accessLevel: 'PREMIUM'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [packData, planData] = await Promise.all([
        fetchExamproStorePacks(),
        []
      ]);
      setPacks(Array.isArray(packData) ? packData : []);
          } catch (e) {
      toast.error('Failed to load store items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: any, type: 'COIN' | 'PLAN' = 'COIN') => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        type: type,
        coins: item.coins || 0,
        price: item.price || 0,
        description: item.description || '',
        color: item.color || 'blue',
        popular: item.popular || item.highlight || false,
        discount: item.discount || '',
        bonus: item.bonus || '',
        isActive: item.isActive ?? true,
        category: item.category || 'School',
        period: item.period || 'per month',
        features: item.features || '',
        ctaText: item.ctaText || 'Get Started',
        accessLevel: item.accessLevel || 'PREMIUM'
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '', type: activeView, coins: 0, price: 0, description: '', color: 'blue', popular: false,
        discount: '', bonus: '', isActive: true, category: 'School', period: 'per month', features: '["Feature 1", "Feature 2"]', ctaText: 'Get Started', accessLevel: 'PREMIUM'
      });
    }
    setIsModalOpen(true);
  };

  const updateSetting = async (id: string, value: string) => {
    try {
      await updateExamproSetting(id, value);
      toast.success('Setting updated');
      loadData();
    } catch (err) {
      toast.error('Failed to update setting');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.type === 'COIN') {
        const payload = {
          name: formData.name, type: 'COIN', coins: Number(formData.coins), price: Number(formData.price),
          description: formData.description, color: formData.color, popular: formData.popular, discount: formData.discount, bonus: formData.bonus, isActive: formData.isActive
        };
        if (editingItem) await updateExamproStorePack(editingItem.id, payload);
        else await createExamproStorePack(payload);
      } else {
        const payload = {
          name: formData.name, price: Number(formData.price), category: formData.category, period: formData.period,
          features: formData.features, ctaText: formData.ctaText, highlight: formData.popular, accessLevel: formData.accessLevel, isActive: formData.isActive
        };
        
      }
      toast.success('Saved successfully');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (id: string, type: 'COIN'|'PLAN') => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteExamproStorePack(id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  const renderCard = (item: any, type: 'COIN'|'PLAN') => (
    <div key={item.id} className={`relative bg-white rounded-2xl border ${!item.isActive ? 'border-dashed border-slate-300 opacity-60' : (item.popular || item.highlight) ? 'border-indigo-500 shadow-md' : 'border-slate-200 shadow-sm'} p-6 flex flex-col`}>
      {(item.popular || item.highlight) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-current" /> Most Popular
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            {type === 'COIN' ? <Zap className="w-3 h-3 text-amber-500 fill-current" /> : <Tag className="w-3 h-3 text-indigo-500" />}
            {type === 'COIN' ? 'Coin Pack' : `${item.category} Plan`}
          </div>
          <h3 className="text-lg font-black text-slate-800">{item.name}</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => handleOpenModal(item, type)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(item.id, type)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="text-3xl font-black text-slate-900 mb-2">
        {formatCurrency(item.price)} <span className="text-sm font-medium text-slate-500">{item.period ? `/ ${item.period}` : ''}</span>
      </div>
      {type === 'COIN' && (
        <div className="text-sm font-bold text-amber-500 mb-4 flex items-center gap-1">
          <Zap className="w-4 h-4 fill-current" /> {item.coins?.toLocaleString()} Coins
        </div>
      )}
      {type === 'PLAN' && item.accessLevel && (
        <div className="text-xs font-bold text-indigo-500 mb-4 flex items-center gap-1">Access: {item.accessLevel}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" /> Store & Plans Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage Coin Packs and Subscription Plans independently</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setActiveView('COIN')} className={`px-4 py-1.5 text-xs font-bold rounded-md ${activeView === 'COIN' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Coin Packs</button>
            <button onClick={() => setActiveView('ACTIVITY')} className={`px-4 py-1.5 text-xs font-bold rounded-md ${activeView === 'ACTIVITY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Activity Deductions</button>
            <button onClick={() => setActiveView('REFERRAL')} className={`px-4 py-1.5 text-xs font-bold rounded-md ${activeView === 'REFERRAL' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Referral Settings</button>
          </div>
          {activeView === 'COIN' && (
            <button onClick={() => handleOpenModal(null, 'COIN')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Pack
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium">Loading settings...</div>
      ) : (
        <>
          {activeView === 'COIN' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map(p => renderCard(p, 'COIN'))}
            </div>
          )}

          {activeView === 'ACTIVITY' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
              <h3 className="font-bold text-slate-800 mb-6">Coin Deductions & Rewards</h3>
              <div className="space-y-6">
                {[
                  { id: 'quiz_retake_fee', label: 'Quiz Retake Fee', desc: 'Coins deducted when a user retakes a quiz.' },
                  { id: 'hint_cost', label: 'Hint Cost', desc: 'Coins deducted when a user buys a hint during a test.' },
                  { id: 'signup_reward', label: 'Sign-up Reward', desc: 'Coins granted to new users upon registration.' },
                  { id: 'daily_login_reward', label: 'Daily Login Reward', desc: 'Coins granted every day the user logs in.' },
                ].map(setting => {
                  const val = settings.find(s => s.id === setting.id)?.value || '0';
                  return (
                    <div key={setting.id} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-slate-800">{setting.label}</p>
                        <p className="text-xs text-slate-500 mt-1">{setting.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          defaultValue={val}
                          onBlur={(e) => {
                            if (e.target.value !== val) {
                              updateSetting(setting.id, e.target.value);
                            }
                          }}
                          className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-right" 
                        />
                        <span className="text-sm font-bold text-slate-400">Coins</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeView === 'REFERRAL' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
              <h3 className="font-bold text-slate-800 mb-6">Referral Configuration</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-800">Referral Bonus (Coins)</p>
                    <p className="text-xs text-slate-500 mt-1">Coins awarded to the referrer when a friend signs up.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      defaultValue={settings.find(s => s.id === 'referral_bonus')?.value || '150'}
                      onBlur={(e) => {
                        const v = settings.find(s => s.id === 'referral_bonus')?.value || '150';
                        if (e.target.value !== v) updateSetting('referral_bonus', e.target.value);
                      }}
                      className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-right" 
                    />
                    <span className="text-sm font-bold text-slate-400">Coins</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-800">Referral Discount Percentage</p>
                    <p className="text-xs text-slate-500 mt-1">Discount given to the referred user upon subscription conversion.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      defaultValue={settings.find(s => s.id === 'referral_discount_percentage')?.value || '10'}
                      onBlur={(e) => {
                        const v = settings.find(s => s.id === 'referral_discount_percentage')?.value || '10';
                        if (e.target.value !== v) updateSetting('referral_discount_percentage', e.target.value);
                      }}
                      className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-right" 
                    />
                    <span className="text-sm font-bold text-slate-400">% OFF</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800">Referral Program Status</p>
                    <p className="text-xs text-slate-500 mt-1">Enable or disable the entire referral system.</p>
                  </div>
                  <div>
                    <select
                      value={settings.find(s => s.id === 'referral_enabled')?.value || 'true'}
                      onChange={(e) => updateSetting('referral_enabled', e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 font-bold"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {editingItem ? <Edit2 className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4 text-indigo-600" />}
                {editingItem ? 'Edit Item' : 'Create Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Starter Pack, ICAN Full Access" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Price (NGN)</label>
                  <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>

                {formData.type === 'COIN' ? (
                  <>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Coins Granted</label>
                      <input type="number" min="0" value={formData.coins} onChange={e => setFormData({...formData, coins: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                      <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                        <option value="School">School</option>
                        <option value="Family">Family</option>
                        <option value="Agent">Agent</option>
                        <option value="ICAN">ICAN</option>
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Period</label>
                      <input type="text" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. per month" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Access Level</label>
                      <select value={formData.accessLevel} onChange={e => setFormData({...formData, accessLevel: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                        <option value="PREMIUM">Premium General</option>
                        <option value="ICAN_SINGLE">ICAN Single Paper</option>
                        <option value="ICAN_FULL">ICAN Full Access</option>
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CTA Text</label>
                      <input type="text" value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Features (JSON Array)</label>
                      <textarea rows={3} value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" placeholder='["Feature 1", "Feature 2"]' />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  Mark as Popular / Highlight
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
