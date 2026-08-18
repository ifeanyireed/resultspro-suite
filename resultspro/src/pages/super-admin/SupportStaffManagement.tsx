import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import {
  Plus,
  Search,
  Users,
  MoreVertical,
  Upload01,
  Trash01,
  Shield,
  Eye,
  Edit02,
  ChevronDown,
  CheckCircle,
} from '@/lib/hugeicons-compat';
import { supportStaffAPI } from '@/lib/api-user-management';
import { SupportStaff, BulkInvitePayload } from '@/types/user-management';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const SupportStaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<SupportStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<SupportStaff | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  // Load support staff
  useEffect(() => {
    loadStaff();
  }, [page, searchTerm, filterDepartment, filterLevel]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await supportStaffAPI.listStaff(page, 20, {
        search: searchTerm,
        department: filterDepartment !== 'ALL' ? filterDepartment : undefined,
        permissionLevel: filterLevel !== 'ALL' ? filterLevel : undefined,
      });

      const staffData = Array.isArray(response) ? response : (response.data || []);
      setStaff(staffData as SupportStaff[]);
      const pages = Array.isArray(response) ? 1 : (response.pagination?.pages || 1);
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to load support staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: string) => {
    try {
      const newStatus = (currentStatus || 'ACTIVE') === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await supportStaffAPI.toggleStaffStatus(staffId, newStatus as any);
      loadStaff();
    } catch (error) {
      console.error('Failed to update staff status:', error);
    }
  };

  const handleUpdatePermissionLevel = async (staffId: string, newLevel: string) => {
    try {
      await supportStaffAPI.updatePermissionLevel(staffId, newLevel);
      loadStaff();
    } catch (error) {
      console.error('Failed to update permission level:', error);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await supportStaffAPI.deleteStaffMember(staffId);
        loadStaff();
      } catch (error) {
        console.error('Failed to delete staff member:', error);
      }
    }
  };

  const handleBulkInvite = async (emails: string[], department: string) => {
    try {
      const payload: BulkInvitePayload = {
        emails,
        role: 'SUPPORT_AGENT',
        department,
        message: `You have been invited to join ResultsPRO Support Team in the ${department} department.`,
      };

      const result = await supportStaffAPI.bulkInviteStaff(payload);
      setShowBulkModal(false);
      loadStaff();

      alert(`Successfully invited ${result.data.success} staff members. ${result.data.failed} failed.`);
    } catch (error) {
      console.error('Failed to bulk invite staff:', error);
      alert('Failed to send bulk invites');
    }
  };

  const handleCSVUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const emailIndex = headers.indexOf('email');
        const departmentIndex = headers.indexOf('department');

        if (emailIndex === -1 || departmentIndex === -1) {
          alert('CSV must have "email" and "department" columns');
          return;
        }

        const emails = lines.slice(1).map((line) => line.split(',')[emailIndex]?.trim()).filter(Boolean);
        const departments = lines.slice(1).map((line) => line.split(',')[departmentIndex]?.trim()).filter(Boolean);

        if (emails.length > 0) {
          await handleBulkInvite(emails, departments[0] || 'Support');
        }
      } catch (error) {
        console.error('Failed to process CSV:', error);
        alert('Failed to process CSV file');
      }
    };
    reader.readAsText(file);
  };

  const filteredStaff = staff.filter((member) =>
    (member.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (member.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departments = Array.from(new Set(staff.map((s) => s.department).filter(Boolean)));

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Support Staff</h1>
            <p className="text-gray-400">Manage support team members, departments, and permissions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium"
            >
              <Upload01 className="w-5 h-5" />
              Bulk Invite
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Staff
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Staff', value: staff.length, icon: Users, color: 'text-blue-400' },
            { label: 'Active Agents', value: staff.filter((s) => s.status === 'ACTIVE').length, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Departments', value: departments.length || 1, icon: Shield, color: 'text-purple-400' },
            { label: 'Admins', value: staff.filter((s) => s.permissionLevel === 'ADMIN').length, icon: Shield, color: 'text-red-400' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-all duration-300"
              >
                <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-bold">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{(stat.value || 0).toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer font-medium"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer font-medium"
          >
            <option value="ALL">All Permission Levels</option>
            <option value="ADMIN">Administrator</option>
            <option value="MANAGER">Manager</option>
            <option value="AGENT">Support Agent</option>
            <option value="VIEWER">Viewer Only</option>
          </select>
        </div>

        {/* Staff Table */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Support Team List</h2>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold font-mono">
              {staff.length} Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)] bg-white/5">
                  <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Staff Member</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Department</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Permission</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Tickets</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-12"><LoadingSpinner size="lg" /></td></tr>
                ) : filteredStaff.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-500 font-medium">No staff members found</td></tr>
                ) : (
                  filteredStaff.map((member) => (
                    <tr key={member.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="text-white font-bold text-sm">{member.firstName || 'N/A'} {member.lastName || ''}</div>
                        <div className="text-gray-500 text-xs font-mono">{member.email}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-300 text-sm font-medium">{member.department || 'General'}</td>
                      <td className="py-4 px-6">
                        <select
                          value={member.permissionLevel || 'VIEWER'}
                          onChange={(e) => handleUpdatePermissionLevel(member.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border-0 focus:outline-none cursor-pointer ${
                            member.permissionLevel === 'ADMIN' ? 'bg-red-500/20 text-red-300' :
                            member.permissionLevel === 'MANAGER' ? 'bg-orange-500/20 text-orange-300' :
                            member.permissionLevel === 'AGENT' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="MANAGER">Manager</option>
                          <option value="AGENT">Agent</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-white font-mono text-sm">{member.assignedTicketCount || 0}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          (member.status || 'PENDING') === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {member.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setSelectedStaff(member); setShowPermissionModal(true); }} className="p-2 hover:bg-purple-500/10 text-purple-400 rounded-lg transition-colors">
                            <Shield className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleToggleStatus(member.id, member.status)} className={`p-2 rounded-lg transition-colors ${member.status === 'ACTIVE' ? 'hover:bg-yellow-500/10 text-yellow-400' : 'hover:bg-green-500/10 text-green-400'}`}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteStaff(member.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                            <Trash01 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals - Standard ResultPRO style */}
      {showBulkModal && (
        <BulkInviteModal onClose={() => setShowBulkModal(false)} onInvite={handleBulkInvite} onCSVUpload={handleCSVUpload} />
      )}

      {showPermissionModal && selectedStaff && (
        <PermissionModal
          staff={selectedStaff}
          onClose={() => { setShowPermissionModal(false); setSelectedStaff(null); }}
          onSave={() => { setShowPermissionModal(false); loadStaff(); }}
        />
      )}
    </SuperAdminLayout>
  );
};

interface BulkInviteModalProps {
  onClose: () => void;
  onInvite: (emails: string[], department: string) => Promise<void>;
  onCSVUpload: (file: File) => Promise<void>;
}

const BulkInviteModal: React.FC<BulkInviteModalProps> = ({ onClose, onInvite, onCSVUpload }) => {
  const [emailText, setEmailText] = useState('');
  const [department, setDepartment] = useState('Support');
  const [uploading, setUploading] = useState(false);

  const handleInvite = async () => {
    const emails = emailText.split('\n').map((e) => e.trim()).filter((e) => e && e.includes('@'));
    if (emails.length === 0) { alert('Please enter at least one valid email'); return; }
    setUploading(true);
    try { await onInvite(emails, department); } finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Bulk Invite Support Staff</h2>
        <div className="space-y-6">
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all cursor-pointer bg-white/5">
            <input type="file" accept=".csv" onChange={(e) => { if (e.target.files?.[0]) { onCSVUpload(e.target.files[0]); onClose(); } }} className="hidden" id="csv-upload-staff" />
            <label htmlFor="csv-upload-staff" className="cursor-pointer">
              <Upload01 className="w-10 h-10 mx-auto mb-3 text-gray-500" />
              <p className="text-sm font-bold text-white">Click to upload CSV</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Columns: email, department</p>
            </label>
          </div>
          <div className="text-center text-gray-600 font-bold text-xs uppercase tracking-widest">or invite manually</div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Assign to Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/50">
                <option>Support</option><option>Technical</option><option>Billing</option><option>Training</option><option>QA</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Email Addresses</label>
              <textarea value={emailText} onChange={(e) => setEmailText(e.target.value)} placeholder="One email per line..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white h-32 focus:outline-none focus:border-blue-500/50 resize-none" />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all">Cancel</button>
            <button onClick={handleInvite} disabled={uploading} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
              {uploading ? 'Sending...' : 'Invite Team'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PermissionModalProps {
  staff: SupportStaff;
  onClose: () => void;
  onSave: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ staff, onClose, onSave }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const allPermissions = [
    { id: 'VIEW_TICKETS', label: 'View Support Tickets' },
    { id: 'MANAGE_TICKETS', label: 'Manage Support Tickets' },
    { id: 'MANAGE_USERS', label: 'Manage Users' },
    { id: 'VIEW_ANALYTICS', label: 'View Analytics' },
    { id: 'MANAGE_SETTINGS', label: 'Manage Settings' },
    { id: 'MANAGE_STAFF', label: 'Manage Other Staff' },
  ];
  const handleSave = async () => {
    setSaving(true);
    try { await supportStaffAPI.updatePermissions(staff.id, permissions); onSave(); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Granular Permissions</h2>
        <p className="text-gray-500 text-sm font-medium mb-6">{staff.email}</p>
        <div className="space-y-3 mb-8">
          {allPermissions.map((perm) => (
            <label key={perm.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all">
              <input type="checkbox" checked={permissions.includes(perm.id)} onChange={(e) => {
                if (e.target.checked) { setPermissions([...permissions, perm.id]); }
                else { setPermissions(permissions.filter((p) => p !== perm.id)); }
              }} className="w-5 h-5 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500/50" />
              <span className="text-sm font-bold text-gray-300">{perm.label}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
            {saving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportStaffManagement;
