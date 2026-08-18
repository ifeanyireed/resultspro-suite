import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Plus, Search, Eye, Pause, Trash01, Play } from '@/lib/hugeicons-compat';
import api from '@/lib/api';
import { toast } from 'sonner';

interface School {
  id: string;
  name: string;
  email: string;
  plan: string;
  studentCount: number;
  revenue: number;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending';
}

interface OverviewStats {
  totalSchools: number;
  activeSchools: number;
  inactiveSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
}

const SchoolsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSchool, setNewSchool] = useState({ name: '', contactEmail: '', planName: '' });

  const fetchSchools = async () => {
    try {
      const response = await api.get('/admin/schools/list', {
        params: { search: searchTerm }
      });
      if (response.data.success) {
        setSchools(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to fetch schools');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/schools/overview');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchools();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    Promise.all([fetchSchools(), fetchStats()]).finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (school: School) => {
    const action = school.status === 'suspended' ? 'ACTIVATE_SCHOOL' : 'SUSPEND_SCHOOL';
    try {
      const response = await api.post(`/admin/schools/${school.id}/bulk-action`, { action });
      if (response.data.success) {
        toast.success(response.data.data.message);
        fetchSchools();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to update school status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this school?')) return;
    try {
      const response = await api.delete(`/admin/schools/${id}`);
      if (response.data.success) {
        toast.success('School deleted successfully');
        fetchSchools();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to delete school');
    }
  };

  const handleAddSchool = async () => {
    try {
      const response = await api.post('/admin/schools', newSchool);
      if (response.data.success) {
        toast.success('School added successfully');
        setShowAddModal(false);
        setNewSchool({ name: '', contactEmail: '', planName: '' });
        fetchSchools();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to add school');
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Schools Management</h1>
            <p className="text-gray-400">Manage all registered schools and their accounts</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add School
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-4 hover:bg-white/5 transition-all duration-300">
            <p className="text-gray-400 text-sm mb-1">Total Schools</p>
            <p className="text-2xl font-bold">{stats?.totalSchools || 0}</p>
          </div>
          <div className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-4 hover:bg-white/5 transition-all duration-300">
            <p className="text-gray-400 text-sm mb-1">Active</p>
            <p className="text-2xl font-bold text-green-400">{stats?.activeSchools || 0}</p>
          </div>
          <div className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-4 hover:bg-white/5 transition-all duration-300">
            <p className="text-gray-400 text-sm mb-1">Students</p>
            <p className="text-2xl font-bold text-blue-400">{(stats?.totalStudents || 0).toLocaleString()}</p>
          </div>
          <div className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-4 hover:bg-white/5 transition-all duration-300">
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-400">₦{(stats?.totalRevenue || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search schools by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Schools Table */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden hover:bg-white/5 transition-all duration-300">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-gray-400">Loading schools...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.07)] bg-white/5">
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">School Name</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Email</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Plan</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Students</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Revenue</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-400">No schools found</td>
                    </tr>
                  ) : (
                    schools.map((school) => (
                      <tr key={school.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 text-white font-medium">{school.name}</td>
                        <td className="py-4 px-6 text-gray-400 text-sm">{school.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            school.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-300' :
                            school.plan === 'Pro' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {school.plan}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400">{(school.studentCount || 0).toLocaleString()}</td>
                        <td className="py-4 px-6 text-white font-medium">₦{(school.revenue || 0).toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            school.status === 'active' ? 'bg-green-500/20 text-green-300' :
                            school.status === 'suspended' ? 'bg-red-500/20 text-red-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(school)}
                              title={school.status === 'suspended' ? 'Activate' : 'Suspend'}
                              className={`p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 ${
                                school.status === 'suspended' ? 'hover:text-green-400' : 'hover:text-yellow-400'
                              }`}
                            >
                              {school.status === 'suspended' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(school.id)}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
                            >
                              <Trash01 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-blue-500/20 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add New School</h2>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="School Name"
                value={newSchool.name}
                onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <input
                type="email"
                placeholder="School Email"
                value={newSchool.contactEmail}
                onChange={(e) => setNewSchool({ ...newSchool, contactEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <select 
                value={newSchool.planName}
                onChange={(e) => setNewSchool({ ...newSchool, planName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="" className="bg-gray-900">Select Plan</option>
                <option value="Free" className="bg-gray-900">Free</option>
                <option value="Pro" className="bg-gray-900">Pro</option>
                <option value="Enterprise" className="bg-gray-900">Enterprise</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchool}
                disabled={!newSchool.name || !newSchool.contactEmail}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add School
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SchoolsManagement;
