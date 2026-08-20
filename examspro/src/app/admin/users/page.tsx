"use client";

import { IconSearch as Search, IconFilter as Filter, IconDotsVertical as MoreVertical, IconUserPlus as UserPlus, IconLoader2 as Loader2, IconUpload as Upload, IconDownload as Download, IconX as X, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import { useRouter } from 'next/navigation';

export default function AdminUserListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [isCreating, setIsCreating] = useState(false);

  // Bulk Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, planFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', {
        params: {
          search: searchTerm,
          plan: planFilter,
          status: statusFilter
        }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password) {
      toast.error("Email and Password are required");
      return;
    }

    setIsCreating(true);
    try {
      await api.post('/admin/users', newUserData);
      toast.success("User created successfully");
      setIsAddModalOpen(false);
      setNewUserData({ name: '', email: '', password: '', role: 'STUDENT' });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsImporting(true);
    setImportResult(null);
    try {
      const res = await api.post('/admin/users/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportResult(res.data);
      toast.success("Import completed");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to import users");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,name,email,password,role\nJohn Doe,john@example.com,password123,STUDENT\nJane Smith,jane@example.com,password456,MODERATOR";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <AdminHeader title="User Management" />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Users</h2>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsImportModalOpen(true)}
              variant="outline"
              className="rounded-xl border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 font-bold text-xs gap-2"
            >
              <Upload className="w-4 h-4" /> Bulk Import
            </Button>
            <Button 
              onClick={() => {
                setNewUserData({ name: '', email: '', password: '', role: 'STUDENT' });
                setIsAddModalOpen(true);
              }}
              className="rounded-xl bg-green text-navy hover:bg-green/90 font-bold text-xs gap-2"
            >
              <UserPlus className="w-4 h-4" /> Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name, email, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-xl px-4 py-2.5 text-sm font-bold text-white outline-none focus:border-green/50"
            >
              <option value="" className="bg-navy">All Plans</option>
              <option value="Pro" className="bg-navy">Pro</option>
              <option value="Free" className="bg-navy">Free</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] rounded-xl px-4 py-2.5 text-sm font-bold text-white outline-none focus:border-green/50"
            >
              <option value="" className="bg-navy">All Status</option>
              <option value="Active" className="bg-navy">Active</option>
              <option value="Suspended" className="bg-navy">Suspended</option>
            </select>
            <Button variant="outline" className="rounded-xl border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] text-white hover:bg-white/5">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden group hover:border-white/10 transition-all">
          {loading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="w-8 h-8 text-green animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/[0.05] border-t-white/[0.1]">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User Info</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plan</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balance</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u, i) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/users/profile?userId=${u.id}`)}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${u.name || u.email}&background=random`} className="w-10 h-10 rounded-xl border border-white/10" alt="" />
                        <div>
                          <div className="text-sm font-bold text-white">{u.name || 'No Name'}</div>
                          <div className="text-[10px] text-gray-500 font-medium">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${u.isPremium ? 'bg-green/10 text-green' : 'bg-white/5 text-gray-400'}`}>
                        {u.isPremium ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-white">{u.coinBalance} coins</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${!u.isBanned ? 'bg-blue-400/10 text-blue-400' : 'bg-red-500/10 text-red-500'}`}>
                        {!u.isBanned ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] text-gray-500 font-bold uppercase">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-500 text-sm italic">
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          
          <div className="px-8 py-4 bg-white/5 border-t border-white/[0.05] border-t-white/[0.1] flex items-center justify-between">
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Showing {users.length} users</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg h-8 px-3 text-[10px] font-bold border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 uppercase tracking-tighter">Previous</Button>
              <Button variant="outline" size="sm" className="rounded-lg h-8 px-3 text-[10px] font-bold border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 uppercase tracking-tighter">Next</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Create New User"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              value={newUserData.name}
              onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
              placeholder="e.g. John Doe"
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={newUserData.email}
              onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
              placeholder="user@example.com"
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={newUserData.password}
              onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">User Role</label>
            <select 
              value={newUserData.role}
              onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
            >
              <option value="STUDENT" className="bg-navy">Student</option>
              <option value="MODERATOR" className="bg-navy">Moderator</option>
              <option value="ADMIN" className="bg-navy">Administrator</option>
            </select>
          </div>

          <Button 
            onClick={handleCreateUser}
            disabled={isCreating}
            className="w-full bg-green text-navy font-bold py-4 rounded-xl shadow-lg shadow-green/20 mt-4"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Create User Account'
            )}
          </Button>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal 
        isOpen={isImportModalOpen} 
        onClose={() => {
          setIsImportModalOpen(false);
          setImportResult(null);
        }} 
        title="Bulk Import Users"
      >
        <div className="space-y-6">
          {!importResult ? (
            <>
              <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/[0.1] border-t-white/[0.15] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mx-auto text-green">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Upload User CSV</p>
                  <p className="text-xs text-gray-500 mt-1">Select a CSV file with name, email, password, role</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv"
                  className="hidden"
                />
                <Button 
                  disabled={isImporting}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6"
                >
                  {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Choose File"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-400/5 border border-blue-400/10">
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Need a template?</span>
                </div>
                <button 
                  onClick={downloadTemplate}
                  className="text-[10px] font-black text-blue-400 hover:underline uppercase tracking-widest"
                >
                  Download CSV
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                <div className="flex items-center gap-3 text-green">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Success: {importResult.successCount}</span>
                </div>
                <div className="flex items-center gap-3 text-red-500">
                  <X className="w-5 h-5" />
                  <span className="text-sm font-bold">Failed: {importResult.errorCount}</span>
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Import Errors</p>
                  {importResult.errors.map((err: string, i: number) => (
                    <p key={i} className="text-[10px] text-gray-400 font-medium">{err}</p>
                  ))}
                </div>
              )}

              <Button 
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportResult(null);
                }}
                className="w-full bg-green text-navy font-bold py-4 rounded-xl"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
