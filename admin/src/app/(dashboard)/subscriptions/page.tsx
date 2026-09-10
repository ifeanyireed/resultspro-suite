'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Check, Edit, Trash2, Plus, School, Users, UserCog, Building, LayoutDashboard, Receipt, GraduationCap, Map, Home, Briefcase } from 'lucide-react';
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
    features: '[]'
  });

  const tabs = [
    { id: 'SchoolHub', label: 'SchoolHub', icon: School },
    { id: 'ResultsPRO', label: 'ResultsPRO', icon: LayoutDashboard },
    { id: 'ExamsPRO', label: 'ExamsPRO', icon: Edit },
    { id: 'ClassroomPRO', label: 'ClassroomPRO', icon: Users },
    { id: 'TutorsPRO', label: 'TutorsPRO', icon: GraduationCap },
    { id: 'CoursesPRO', label: 'CoursesPRO', icon: Map },
    { id: 'FamilyHub', label: 'FamilyHub', icon: Home },
    { id: 'AgentNetwork', label: 'Agent Network', icon: Briefcase },
    { id: 'Invoices', label: 'Invoices', icon: Receipt },
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
        features: typeof plan.features === 'string' ? plan.features : JSON.stringify(plan.features || [])
      });
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
        features: '[]'
      });
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
           annual_price: Number(formData.annual_price)
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
              
              {filteredPlans.length === 0 && (
                <div className="col-span-3 text-center py-12 text-slate-400">
                  No plans configured for {activeTab} yet.
                </div>
              )}
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
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Access Level (e.g., PREMIUM, ICAN_SINGLE)</label>
                <input required value={formData.access_level} onChange={e => setFormData({...formData, access_level: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Features (JSON Array)</label>
                <textarea rows={4} required value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 font-mono text-xs" />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
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
