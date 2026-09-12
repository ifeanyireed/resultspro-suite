import React, { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Search, MoreVertical, Plus, X } from 'lucide-react';
import { fetchAgents } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AgentsListTab() {
  const [agents, setAgents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    tier: 'STANDARD',
    commission_rate: 10,
    bank_name: '',
    account_number: ''
  });

  const loadAgents = () => {
    fetchAgents().then(setAgents);
  };

  React.useEffect(() => {
    loadAgents();
  }, []);

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('resultspro_admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com'}/api/v1/admin/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Agent created successfully!");
        setShowModal(false);
        loadAgents();
        setFormData({ full_name: '', email: '', tier: 'STANDARD', commission_rate: 10, bank_name: '', account_number: '' });
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create agent");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-xs"
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent Name</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Code</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Tier</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Earnings</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {agents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No agents found</td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-medium">{agent.firstName} {agent.lastName}</td>
                  <td className="px-6 py-4 text-slate-500">{agent.email}</td>
                  <td className="px-6 py-4"><code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{agent.uniqueReferralCode}</code></td>
                  <td className="px-6 py-4">{agent.subscriptionTier}</td>
                  <td className="px-6 py-4 font-bold">₦{agent.totalCommissionEarned}</td>
                  <td className="px-6 py-4"><Badge status={agent.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600"><MoreVertical size={16}/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Add New Field Agent</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddAgent} className="p-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input required type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tier</label>
                    <select value={formData.tier} onChange={(e) => setFormData({...formData, tier: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                      <option value="STANDARD">Standard</option>
                      <option value="PRO">Pro</option>
                      <option value="SUPER">Super</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Commission Rate (%)</label>
                    <input required type="number" step="0.1" value={formData.commission_rate} onChange={(e) => setFormData({...formData, commission_rate: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bank Name</label>
                  <input type="text" value={formData.bank_name} onChange={(e) => setFormData({...formData, bank_name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Zenith Bank" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Account Number</label>
                  <input type="text" value={formData.account_number} onChange={(e) => setFormData({...formData, account_number: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="0123456789" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                  Save Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
