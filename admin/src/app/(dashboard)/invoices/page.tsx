'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus, Copy, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Receipt, Search, Filter } from 'lucide-react';

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState('Invoices');
  const [invoices] = useState([
    { id: 'INV-001', tenant: 'Greenwood High', amount: '₦150,000', status: 'Paid', date: 'Oct 12, 2026' },
    { id: 'INV-002', tenant: 'Ivy League Academy', amount: '₦80,000', status: 'Pending', date: 'Oct 10, 2026' },
    { id: 'INV-003', tenant: 'Springfield Elementary', amount: '₦45,000', status: 'Paid', date: 'Oct 08, 2026' },
    { id: 'INV-004', tenant: 'Lakeside Tech College', amount: '₦350,000', status: 'Overdue', date: 'Sep 25, 2026' },
  ]);

  const [links, setLinks] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    plan_id: '',
    discount_percentage: 0,
    max_uses: 0,
    is_active: true,
    pre_assigned_emails: '',
    validity_days: 30
  });

  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultsproserviceusers.vercel.app';

  useEffect(() => {
    fetchPlans();
    if (activeTab === 'Discount Links') {
      fetchLinks();
    }
  }, [activeTab]);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${USERS_API}/api/v1/billing/plans`);
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || data || []);
      }
    } catch (err) {}
  };

  const fetchLinks = async () => {
    setLoadingLinks(true);
    try {
      const res = await fetch(`${USERS_API}/api/v1/billing/discount-links`);
      if (res.ok) {
        const data = await res.json();
        setLinks(data || []);
      }
    } catch (err) {}
    setLoadingLinks(false);
  };

  const handleSave = async () => {
    if (!formData.plan_id) {
      toast.error('Please select a plan');
      return;
    }
    try {
      const res = await fetch(`${USERS_API}/api/v1/billing/discount-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          plan_id: formData.plan_id,
          discount_percentage: Number(formData.discount_percentage),
          max_uses: Number(formData.max_uses),
          is_active: formData.is_active,
          pre_assigned_emails: formData.pre_assigned_emails,
          validity_days: Number(formData.validity_days)
        })
      });
      if (!res.ok) throw new Error('Failed to create link');
      toast.success('Discount link created!');
      setIsModalOpen(false);
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      const res = await fetch(`${USERS_API}/api/v1/billing/discount-links/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Link deleted');
        fetchLinks();
      }
    } catch (err) {}
  };

  const copyLink = (code: string) => {
    const link = `https://resultspro.ng/d/${code}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Billing & Invoices
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage global tenant subscriptions, payment history, and discount links.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('Invoices')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'Invoices' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Invoices
          </button>
          <button 
            onClick={() => setActiveTab('Discount Links')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'Discount Links' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Discount Links
          </button>
        </div>
      </div>

      {activeTab === 'Invoices' && (
        <>
          <div className="flex space-x-3 w-full md:w-auto mb-4 justify-end">
            <div className="relative flex-1 md:w-64 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search invoices..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-semibold">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant / School</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{inv.tenant}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{inv.amount}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                          ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                            inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 font-semibold hover:text-blue-800">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Discount Links' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500">Create shareable links that auto-apply a discount to a specific plan.</p>
            <button onClick={() => {
              setFormData({ code: '', plan_id: '', discount_percentage: 0, max_uses: 0, is_active: true, pre_assigned_emails: '', validity_days: 30 });
              setIsModalOpen(true);
            }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> New Link
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loadingLinks ? (
              <div className="p-12 text-center text-slate-400 font-semibold text-sm">Loading links...</div>
            ) : links.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold text-sm">No discount links generated yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Link Code</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Plan</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Uses</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {links.map((link) => {
                      const plan = plans.find(p => p.id === link.plan_id);
                      return (
                        <tr key={link.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-900 flex items-center gap-2">
                            {link.code}
                            <button onClick={() => copyLink(link.code)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Copy Link">
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">
                            {plan ? `${plan.name} (${plan.app_module || 'Unknown'})` : 'Deleted Plan'}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">{link.discount_percentage}% OFF</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{link.uses} / {link.max_uses === 0 ? '∞' : link.max_uses}</td>
                          <td className="px-6 py-4 text-sm flex gap-3">
                            <button onClick={() => handleDelete(link.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Generate Discount Link</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Subscription Plan</label>
                <select 
                  value={formData.plan_id} 
                  onChange={e => setFormData({...formData, plan_id: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select a plan...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.app_module} ({p.currency === 'USD' ? '$' : '₦'}{p.monthly_price || p.price || 0}/mo)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Code (Optional)</label>
                  <input 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. SUMMER50"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Discount (%)</label>
                  <input 
                    type="number"
                    value={formData.discount_percentage} 
                    onChange={e => setFormData({...formData, discount_percentage: Number(e.target.value)})}
                    placeholder="e.g. 20"
                    min="0" max="100"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Uses (0 = Infinite)</label>
                  <input 
                    type="number"
                    value={formData.max_uses} 
                    onChange={e => setFormData({...formData, max_uses: Number(e.target.value)})}
                    placeholder="e.g. 100"
                    min="0"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Validity Days</label>
                  <input 
                    type="number"
                    value={formData.validity_days} 
                    onChange={e => setFormData({...formData, validity_days: Number(e.target.value)})}
                    placeholder="e.g. 30"
                    min="1"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pre-Assigned Emails (Optional)</label>
                <textarea 
                  value={formData.pre_assigned_emails} 
                  onChange={e => setFormData({...formData, pre_assigned_emails: e.target.value})}
                  placeholder="student1@school.com, student2@school.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  rows={2}
                />
                <p className="text-[10px] text-slate-400 mt-1">If provided, only these emails will be upgraded automatically upon signing up or logging in with this link.</p>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-6 hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" /> Generate Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
