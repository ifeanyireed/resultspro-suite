"use client";

import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  UserMinus,
  Eye,
  Mail,
  Building2,
  GraduationCap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getUsers, updateUserStatus } from '@/lib/platform.api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('All Users');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: number, status: string) => {
    const toastId = toast.loading(`Updating user status to ${status}...`);
    try {
      const response = await updateUserStatus(String(userId), status);
      toast.success(response.message || "User status updated!", { id: toastId });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.", { id: toastId });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Student': return GraduationCap;
      case 'Tutor': return ShieldCheck;
      case 'School': return Building2;
      default: return Users;
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Search, filter, and manage all user accounts across the platform.</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500">Loading users...</td></tr>
              ) : (
                users.map((user) => {
                const Icon = getRoleIcon(user.role);
                return (
                  <tr key={user.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 group-hover:border-green/30 group-hover:text-green transition-all">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-gray-400 font-medium">{user.role}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        user.status === 'Active' ? 'bg-green/10 text-green' : user.status === 'Pending' ? 'bg-amber/10 text-amber' : 'bg-rose/10 text-rose'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-mono">{user.joined}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleUpdateStatus(user.id, 'Active')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-green transition-all" title="Activate User">
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleUpdateStatus(user.id, 'Suspended')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-rose transition-all" title="Suspend User">
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
