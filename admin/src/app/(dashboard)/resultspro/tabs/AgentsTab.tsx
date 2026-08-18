import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Plus, Search, MoreVertical, UploadCloud, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export default function AgentsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'agents' | 'referrals' | 'assignments'>('agents');
  const [agents, setAgents] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    // Mock data for UI layout
    setLoading(false);
    if (activeSubTab === 'agents') {
      setAgents([
        { id: '1', firstName: 'John', lastName: 'Doe', lga: 'Ikeja', state: 'Lagos', email: 'john@example.com', phoneNumber: '08012345678', uniqueReferralCode: 'JD-9321', subscriptionTier: 'Pro', totalCommissionEarned: 150000, status: 'ACTIVE' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', lga: 'Surulere', state: 'Lagos', email: 'jane@example.com', phoneNumber: '08123456789', uniqueReferralCode: 'JS-4192', subscriptionTier: 'Basic', totalCommissionEarned: 25000, status: 'INACTIVE' },
      ]);
    } else if (activeSubTab === 'referrals') {
      setReferrals([
        { id: '1', agent: { user: { fullName: 'John Doe' }, uniqueReferralCode: 'JD-9321' }, school: { name: 'Greenwood High' }, referredByEmail: 'admin@greenwood.edu.ng', commissionAmount: 50000, commissionRate: 10, createdAt: '2026-08-10', status: 'PENDING' },
      ]);
    } else if (activeSubTab === 'assignments') {
      setAssignments([
        { id: '1', agent: { user: { fullName: 'John Doe' }, uniqueReferralCode: 'JD-9321' }, school: { name: 'Greenwood High', contactEmail: 'info@greenwood.edu.ng' }, role: 'Technical Lead', commissionRate: 7, assignedAt: '2026-08-11' },
      ]);
    }
  }, [activeSubTab]);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-full shadow-inner border border-slate-200">
          <button
            onClick={() => setActiveSubTab('agents')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeSubTab === 'agents' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Agents List
          </button>
          <button
            onClick={() => setActiveSubTab('referrals')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeSubTab === 'referrals' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Referral Approvals
          </button>
          <button
            onClick={() => setActiveSubTab('assignments')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeSubTab === 'assignments' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            School Assignments
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'assignments' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Assign School</span>
            </button>
          )}
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200 shadow-sm">
            <UploadCloud className="w-4 h-4" />
            <span>Bulk Invite</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Agent</span>
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                {activeSubTab === 'agents' && (
                  <>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent Name</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Code</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Earnings</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                  </>
                )}
                {activeSubTab === 'referrals' && (
                  <>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">School Referred</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Commission</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                  </>
                )}
                {activeSubTab === 'assignments' && (
                  <>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Assigned School</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Commission</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Date</th>
                  </>
                )}
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">Loading...</td>
                </tr>
              ) : (
                <>
                  {activeSubTab === 'agents' && agents.map(agent => (
                    <tr key={agent.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-xs">{agent.firstName} {agent.lastName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{agent.lga}, {agent.state}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-600 text-xs">{agent.email}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{agent.phoneNumber}</p>
                      </td>
                      <td className="px-6 py-4"><code className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{agent.uniqueReferralCode}</code></td>
                      <td className="px-6 py-4 font-bold text-slate-800 text-xs">₦{agent.totalCommissionEarned.toLocaleString()}</td>
                      <td className="px-6 py-4"><Badge status={agent.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeSubTab === 'referrals' && referrals.map(ref => (
                    <tr key={ref.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-xs">{ref.agent?.user?.fullName || 'Agent'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{ref.agent?.uniqueReferralCode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700 text-xs">{ref.school?.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{ref.referredByEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-xs">₦{ref.commissionAmount.toLocaleString()}</p>
                        <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{ref.commissionRate}% rate</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(ref.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><Badge status={ref.status} /></td>
                      <td className="px-6 py-4 text-right">
                        {ref.status === 'PENDING' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                            <button className="p-1.5 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors"><XCircle className="w-4 h-4" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {activeSubTab === 'assignments' && assignments.map(asgn => (
                    <tr key={asgn.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-xs">{asgn.agent?.user?.fullName || 'Agent'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{asgn.agent?.uniqueReferralCode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700 text-xs">{asgn.school?.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{asgn.school?.contactEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">{asgn.role}</td>
                      <td className="px-6 py-4 text-xs font-bold text-blue-600">{asgn.commissionRate}%</td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(asgn.assignedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
