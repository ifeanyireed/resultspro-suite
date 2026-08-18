import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import {
  Plus,
  Search,
  MoreVertical,
  Download01,
  Upload01,
  Trash01,
  Shield,
  Eye,
  Edit02,
  ChevronDown,
  X,
  CheckCircle,
  XCircle,
  Building2,
  UserGroup,
} from '@/lib/hugeicons-compat';
import { agentAPI } from '@/lib/api-user-management';
import { Agent, BulkInvitePayload } from '@/types/user-management';
import api from '@/lib/api';

const AgentsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'referrals' | 'assignments'>('agents');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadData();
  }, [page, searchTerm, filterStatus, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'agents') {
        const response = await agentAPI.listAgents(page, 20, {
          search: searchTerm,
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
        });
        setAgents(response.data as Agent[]);
        setTotalPages(response.pagination?.pages || 1);
      } else if (activeTab === 'referrals') {
        const response: any = await agentAPI.listReferrals(page, 20, {
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
        });
        setReferrals(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      } else if (activeTab === 'assignments') {
        const response: any = await agentAPI.listAssignments(page, 20);
        setAssignments(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      }
    } catch (error) {
      console.error(`Failed to load ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReferral = async (referralId: string) => {
    if (confirm('Approve commission for this referral?')) {
      try {
        await agentAPI.approveReferral(referralId);
        loadData();
        alert('Referral approved successfully');
      } catch (error) {
        console.error('Failed to approve referral:', error);
      }
    }
  };

  const handleRejectReferral = async (reason: string) => {
    try {
      await agentAPI.rejectReferral(selectedItem.id, reason);
      setShowRejectModal(false);
      loadData();
      alert('Referral rejected');
    } catch (error) {
      console.error('Failed to reject referral:', error);
    }
  };

  const handleAssignSchool = async (data: any) => {
    try {
      await agentAPI.assignSchool(data.agentId, data.schoolId, data.role, data.commissionRate);
      setShowAssignModal(false);
      loadData();
      alert('School assigned successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to assign school');
    }
  };

  const handleRemoveAssignment = async (id: string) => {
    if (confirm('Remove this school assignment?')) {
      try {
        await agentAPI.removeAssignment(id);
        loadData();
      } catch (error) {
        console.error('Failed to remove assignment:', error);
      }
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Agents Management</h1>
            <p className="text-gray-400">Manage agents, track referrals, and handle school assignments</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'assignments' && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
                Assign School
              </button>
            )}
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-400 font-medium transition-all"
            >
              <Upload01 className="w-5 h-5" />
              Bulk Invite
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Agent
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
          <button
            onClick={() => { setActiveTab('agents'); setPage(1); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'agents' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Agents List
          </button>
          <button
            onClick={() => { setActiveTab('referrals'); setPage(1); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'referrals' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Referral Approvals
          </button>
          <button
            onClick={() => { setActiveTab('assignments'); setPage(1); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'assignments' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            School Assignments
          </button>
        </div>

        {/* Content */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'agents' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)] bg-white/5 text-left">
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Agent Name</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Contact</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Code</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Tier</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Earnings</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                    <th className="py-4 px-6 text-right text-gray-400 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr> : 
                    agents.map((agent) => (
                      <tr key={agent.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-white font-bold">{agent.firstName} {agent.lastName}</div>
                          <div className="text-xs text-gray-500">{agent.lga}, {agent.state}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300 text-sm">{agent.email}</div>
                          <div className="text-gray-500 text-xs">{agent.phoneNumber}</div>
                        </td>
                        <td className="py-4 px-6"><code className="text-blue-400 text-xs">{agent.uniqueReferralCode}</code></td>
                        <td className="py-4 px-6 text-gray-300 text-sm">{agent.subscriptionTier}</td>
                        <td className="py-4 px-6 text-white font-bold">₦{agent.totalCommissionEarned.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${agent.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {agent.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )}

            {activeTab === 'referrals' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)] bg-white/5 text-left">
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Agent</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">School Referred</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Commission</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Date</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                    <th className="py-4 px-6 text-right text-gray-400 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr> : 
                    referrals.map((ref) => (
                      <tr key={ref.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-white font-bold">{ref.agent?.user?.fullName || 'Agent'}</div>
                          <div className="text-xs text-gray-500">{ref.agent?.uniqueReferralCode}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300 font-bold">{ref.school?.name}</div>
                          <div className="text-xs text-gray-500">{ref.referredByEmail}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white font-bold">₦{ref.commissionAmount.toLocaleString()}</div>
                          <div className="text-xs text-blue-400">{ref.commissionRate}% rate</div>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${ref.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : ref.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {ref.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {ref.status === 'PENDING' && (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleApproveReferral(ref.id)} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"><CheckCircle size={18} /></button>
                              <button onClick={() => { setSelectedItem(ref); setShowRejectModal(true); }} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"><XCircle size={18} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )}

            {activeTab === 'assignments' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)] bg-white/5 text-left">
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Agent</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Assigned School</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Role</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Commission</th>
                    <th className="py-4 px-6 text-gray-400 font-semibold text-sm">Date</th>
                    <th className="py-4 px-6 text-right text-gray-400 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr> : 
                    assignments.map((asgn) => (
                      <tr key={asgn.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-white font-bold">{asgn.agent?.user?.fullName || 'Agent'}</div>
                          <div className="text-xs text-gray-500">{asgn.agent?.uniqueReferralCode}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300 font-bold">{asgn.school?.name}</div>
                          <div className="text-xs text-gray-500">{asgn.school?.contactEmail}</div>
                        </td>
                        <td className="py-4 px-6 text-gray-300 text-sm">{asgn.role}</td>
                        <td className="py-4 px-6 text-blue-400 font-bold">{asgn.commissionRate}%</td>
                        <td className="py-4 px-6 text-gray-400 text-sm">
                          {new Date(asgn.assignedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => handleRemoveAssignment(asgn.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">
                            <Trash01 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRejectModal && (
        <RejectReferralModal
          onClose={() => setShowRejectModal(false)}
          onReject={handleRejectReferral}
        />
      )}

      {showAssignModal && (
        <AssignSchoolModal
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignSchool}
        />
      )}
    </SuperAdminLayout>
  );
};

const RejectReferralModal: React.FC<{ onClose: () => void, onReject: (reason: string) => void }> = ({ onClose, onReject }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-[30px] p-8 max-w-md w-full border border-white/10">
        <h3 className="text-2xl font-bold text-white mb-4">Reject Referral</h3>
        <p className="text-gray-400 text-sm mb-6">Please provide a reason for rejecting this commission.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white mb-6 h-32 focus:outline-none focus:border-red-500/50"
        />
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold border border-white/10 text-white">Cancel</button>
          <button onClick={() => onReject(reason)} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white shadow-lg shadow-red-500/20">Reject</button>
        </div>
      </div>
    </div>
  );
};

const AssignSchoolModal: React.FC<{ onClose: () => void, onAssign: (data: any) => void }> = ({ onClose, onAssign }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    agentId: '',
    schoolId: '',
    role: 'Technical Lead',
    commissionRate: 7
  });

  useEffect(() => {
    // Fetch all agents and schools for selection
    const loadSelectionData = async () => {
      const [agentsRes, schoolsRes] = await Promise.all([
        agentAPI.listAgents(1, 100),
        api.get('/super-admin/schools', { params: { limit: 100 } })
      ]);
      setAgents(agentsRes.data);
      setSchools(schoolsRes.data.data);
    };
    loadSelectionData();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-[30px] p-8 max-w-lg w-full border border-white/10">
        <h3 className="text-2xl font-bold text-white mb-6">Assign School to Agent</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Select Agent</label>
            <select
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <option value="">Select Agent...</option>
              {agents.map(a => <option key={a.id} value={a.agent?.id}>{a.fullName} ({a.agent?.uniqueReferralCode})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Select School</label>
            <select
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <option value="">Select School...</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Commission Rate (%)</label>
            <input
              type="number"
              value={formData.commissionRate}
              onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold border border-white/10 text-white">Cancel</button>
          <button onClick={() => onAssign(formData)} className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20">Assign</button>
        </div>
      </div>
    </div>
  );
};

export default AgentsManagement;
