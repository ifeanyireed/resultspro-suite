'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Check, Edit, Trash2, Plus, School, Users, UserCog, Building, LayoutDashboard, Receipt, GraduationCap, Map, Home, Briefcase, Puzzle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/Badge';

const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';

async function fetchPlans() {
  try {
    const res = await fetch(`${USERS_API}/api/v1/billing/plans`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.plans || data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchInvoices() {
  return []; // Mocked for now
}

export default function SubscriptionsCommandCenter() {
  const [activeTab, setActiveTab] = useState('SchoolHub');
  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    monthly_price: 0,
    annual_price: 0,
    period: 'per month',
    app_module: '',
    category: '',
    access_level: 'PREMIUM',
    max_students: 0,
    max_teachers: 0,
    max_results_per_term: 0,
    storage_gb: 0,
    redirect_url: '',
    highlight: false,
    is_active: true
  });
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const tabs = [
    { id: 'SchoolHub', label: 'SchoolHub', icon: School },
    { id: 'ResultsPRO', label: 'ResultsPRO', icon: LayoutDashboard },
    { id: 'ExamsPRO', label: 'ExamsPRO', icon: Edit },
    { id: 'ClassroomPRO', label: 'ClassroomPRO', icon: Users },
    { id: 'PuzzlePRO', label: 'PuzzlePRO', icon: Puzzle },
    { id: 'TutorsPRO', label: 'TutorsPRO', icon: GraduationCap },
    { id: 'CoursesPRO', label: 'CoursesPRO', icon: Map },
    { id: 'FamilyHub', label: 'FamilyHub', icon: Home },
    { id: 'AgentNetwork', label: 'Agent Network', icon: Briefcase },
  ];

  const loadData = async () => {
    setLoading(true);
    const [p, i] = await Promise.all([fetchPlans(), fetchInvoices()]);
    setPlans(p);
    setInvoices(i);
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const res = await fetch(`${USERS_API}/api/v1/billing/plans/${id}`, { method: 'DELETE' });
      if (res.ok) await loadData();
      else alert('Failed to delete plan');
    } catch (err) {
      console.error(err);
      alert('Error deleting plan');
    }
  };

  const openModal = (plan: any = null) => {
    if (plan) {
      setEditingPlan(plan.id);
      setFormData({
        name: plan.name,
        monthly_price: plan.monthly_price || plan.price || 0,
        annual_price: plan.annual_price || 0,
        period: plan.period || 'per month',
        app_module: plan.app_module || activeTab,
        category: plan.category || '',
        access_level: plan.access_level || 'PREMIUM',
        max_students: plan.max_students || 0,
        max_teachers: plan.max_teachers || 0,
        max_results_per_term: plan.max_results_per_term || 0,
        storage_gb: plan.storage_gb || 0,
        redirect_url: plan.redirect_url || '',
        highlight: !!plan.highlight,
        is_active: plan.is_active !== false
      });
      let parsed = [];
      try {
        parsed = typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features || []);
      } catch (e) {}
      setFeaturesList(Array.isArray(parsed) ? parsed : []);
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        monthly_price: 0,
        annual_price: 0,
        period: 'per month',
        app_module: activeTab,
        category: activeTab,
        access_level: 'PREMIUM',
        max_students: 0,
        max_teachers: 0,
        max_results_per_term: 0,
        storage_gb: 0,
        redirect_url: '',
        highlight: false,
        is_active: true
      });
      setFeaturesList([]);
      setNewFeature('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingPlan ? 'PUT' : 'POST';
    const url = editingPlan 
      ? `${USERS_API}/api/v1/billing/plans/${editingPlan}`
      : `${USERS_API}/api/v1/billing/plans`;
      
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           monthly_price: Number(formData.monthly_price),
           annual_price: Number(formData.annual_price),
           max_students: Number(formData.max_students),
           max_teachers: Number(formData.max_teachers),
           max_results_per_term: Number(formData.max_results_per_term),
           storage_gb: Number(formData.storage_gb),
           features: JSON.stringify(featuresList)
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        await loadData();
      } else {
        alert('Failed to save plan');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving plan');
    }
  };

  const filteredPlans = plans.filter(p => (p.app_module || p.category) === activeTab || p.app_module === activeTab || (p.category === 'School' && activeTab === 'SchoolHub') || (p.category === 'Family' && activeTab === 'FamilyHub') || (p.category === 'Agent' && activeTab === 'AgentNetwork') || (p.category === 'ICAN' && activeTab === 'ExamsPRO'));

  return (
    <div className="w-full relative">
      <Header
        title="Subscriptions & Central Billing"
        subtitle="Manage standardized subscription tiers, quotas, and invoice ledgers across the suite"
      />

      <div className="px-8 pt-4">
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-xs transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 stroke-2" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {activeTab === 'Invoices' ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Recent Institutional Invoices</h3>
              <span className="text-xs text-slate-500">Auto-generated upon renewal</span>
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No invoices generated yet.</div>
            ) : (
              <div className="divide-y divide-slate-50 text-xs">
                {invoices.map((inv: any) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800 text-xs">{inv.invoice_number} • {inv.tenant_name}</p>
                      <p className="text-[11px] text-slate-500">{inv.plan_name} Plan {inv.billing_cycle} Renewal • Due {new Date(inv.due_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-slate-800 text-xs">₦{inv.amount.toLocaleString()}</span>
                      <Badge status={inv.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {activeTab} Plans & Quotas
              </h3>
              <button 
                onClick={() => openModal()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Plan</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan: any) => (
                <div
                  key={plan.id || plan.name}
                  className={`bg-white rounded-2xl border p-6 shadow-sm relative flex flex-col justify-between ${
                    plan.name === 'Pro' || plan.highlight ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
                  }`}
                >
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={() => openModal(plan)} className="p-1.5 bg-slate-50 text-slate-500 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors border border-slate-200">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="p-1.5 bg-slate-50 text-slate-500 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                        {plan.badge || plan.access_level || plan.category}
                      </span>
                      {plan.max_students > 0 && (
                        <span className="text-xs font-semibold text-slate-400">
                          Up to {plan.max_students > 900000 ? 'Unlimited' : plan.max_students.toLocaleString()} Students
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-medium text-slate-800 text-xs mt-2">{plan.name}</h4>
                    <div className="mt-2 flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-slate-900">₦{(plan.monthly_price || plan.price || 0).toLocaleString()}</span>
                      <span className="text-xs text-slate-500">/{plan.period || 'per month'}</span>
                    </div>

                    <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                      {plan.max_students > 0 && <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Max Students:</span>
                        <span className="font-medium text-slate-800 text-xs">{plan.max_students > 900000 ? 'Unlimited' : plan.max_students.toLocaleString()}</span>
                      </div>}
                      {plan.max_teachers > 0 && <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Max Teachers:</span>
                        <span className="font-medium text-slate-800 text-xs">{plan.max_teachers > 900000 ? 'Unlimited' : plan.max_teachers.toLocaleString()}</span>
                      </div>}
                      {plan.max_results_per_term > 0 && <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Results / Term:</span>
                        <span className="font-medium text-slate-800 text-xs">{plan.max_results_per_term > 900000 ? 'Unlimited' : plan.max_results_per_term.toLocaleString()}</span>
                      </div>}
                      {plan.storage_gb > 0 && <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Storage:</span>
                        <span className="font-medium text-slate-800 text-xs">{plan.storage_gb} GB</span>
                      </div>}
                    </div>

                    <ul className="mt-6 space-y-2 text-xs text-slate-600">
                      {typeof plan.features === 'string' && plan.features.startsWith('[') ? JSON.parse(plan.features).map((f: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      )) : (plan.features || []).map((f: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              {loading ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-24 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-sm font-semibold">Loading plans...</p>
                </div>
              ) : filteredPlans.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-slate-400">
                  No plans configured for {activeTab} yet.
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Plan Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="e.g. STARTER" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Price</label>
                  <input type="number" required value={formData.monthly_price} onChange={e => setFormData({...formData, monthly_price: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Annual Price</label>
                  <input type="number" required value={formData.annual_price} onChange={e => setFormData({...formData, annual_price: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">App Module</label>
                  <input required value={formData.app_module} onChange={e => setFormData({...formData, app_module: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Access Level Role</label>
                  <select required value={formData.access_level} onChange={e => setFormData({...formData, access_level: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white">
                    <option value="FREE">FREE</option>
                    <option value="BASIC">BASIC</option>
                    <option value="PRO">PRO</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                    <option value="ICAN_SINGLE">ICAN_SINGLE (ExamsPRO)</option>
                    <option value="ICAN_GROUP">ICAN_GROUP (ExamsPRO)</option>
                    <option value="ICAN_FULL">ICAN_FULL (ExamsPRO)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Billing Period</label>
                  <select required value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white">
                    <option value="per month">Per Month</option>
                    <option value="per year">Per Year</option>
                    <option value="forever">Lifetime / One-off</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Hard Limits & Quotas (Use 999999 for unlimited)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Max Students</label>
                    <input type="number" value={formData.max_students} onChange={e => setFormData({...formData, max_students: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Max Teachers</label>
                    <input type="number" value={formData.max_teachers} onChange={e => setFormData({...formData, max_teachers: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Max Results / Term</label>
                    <input type="number" value={formData.max_results_per_term} onChange={e => setFormData({...formData, max_results_per_term: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Storage (GB)</label>
                    <input type="number" value={formData.storage_gb} onChange={e => setFormData({...formData, storage_gb: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Features Matrix</h4>
                <div className="space-y-2 mb-3">
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <span className="text-xs font-medium text-slate-700">{feat}</span>
                      <button type="button" onClick={() => setFeaturesList(featuresList.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input 
                    value={newFeature} 
                    onChange={e => setNewFeature(e.target.value)} 
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newFeature.trim()) { setFeaturesList([...featuresList, newFeature.trim()]); setNewFeature(''); }
                      }
                    }}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                    placeholder="e.g. Full API Access" 
                  />
                  <button 
                    type="button"
                    onClick={() => { if (newFeature.trim()) { setFeaturesList([...featuresList, newFeature.trim()]); setNewFeature(''); } }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pricing Card Button Redirect URL</label>
                <input value={formData.redirect_url} onChange={e => setFormData({...formData, redirect_url: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="e.g. /onboard/school" />
                <p className="text-[10px] text-slate-400 mt-1">If set, users will be sent to this link when they click the Call-to-Action button on the public pricing page.</p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  <span className="text-xs font-semibold text-slate-700">Plan is Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={formData.highlight} onChange={e => setFormData({...formData, highlight: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  <span className="text-xs font-semibold text-slate-700">Highlight (Most Popular)</span>
                </label>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
