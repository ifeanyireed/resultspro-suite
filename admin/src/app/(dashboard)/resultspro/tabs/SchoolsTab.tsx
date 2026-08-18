import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Plus, Search, Eye, Pause, Trash, Play } from 'lucide-react';

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

export default function SchoolsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSchool, setNewSchool] = useState({ name: '', contactEmail: '', planName: '' });

  // Mock data for UI layout
  useEffect(() => {
    setStats({
      totalSchools: 124,
      activeSchools: 118,
      inactiveSchools: 6,
      totalStudents: 45200,
      totalTeachers: 1205,
      totalRevenue: 15400000
    });
    setSchools([
      { id: '1', name: 'Greenwood High', email: 'info@greenwood.edu.ng', plan: 'Pro', studentCount: 1200, revenue: 500000, createdAt: '2026-08-10', status: 'active' },
      { id: '2', name: 'Kings College Lagos', email: 'admin@kingscollege.edu.ng', plan: 'Basic', studentCount: 850, revenue: 0, createdAt: '2026-08-15', status: 'pending' },
      { id: '3', name: 'Queens College Yaba', email: 'contact@qcyaba.edu.ng', plan: 'Enterprise', studentCount: 2500, revenue: 1250000, createdAt: '2026-08-17', status: 'active' },
    ]);
    setLoading(false);
  }, []);

  const handleToggleStatus = async (school: School) => {
    alert(`School ${school.status === 'suspended' ? 'activated' : 'suspended'}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this school?')) return;
    alert('School deleted successfully');
  };

  const handleAddSchool = async () => {
    alert('School added successfully');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search schools by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add School</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-medium mb-1">Total Schools</p>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalSchools || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-medium mb-1">Active Schools</p>
          <p className="text-2xl font-bold text-emerald-600">{stats?.activeSchools || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-medium mb-1">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{(stats?.totalStudents || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-medium mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600">₦{(stats?.totalRevenue || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-500 text-sm">Loading schools...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">School Name</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Plan</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Students</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {schools.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">No schools found</td>
                  </tr>
                ) : (
                  schools.map((school) => (
                    <tr key={school.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 text-xs">{school.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{school.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={school.plan.toUpperCase()} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {(school.studentCount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-800 font-bold">
                        ₦{(school.revenue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={school.status.toUpperCase()} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(school)}
                            title={school.status === 'suspended' ? 'Activate' : 'Suspend'}
                            className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 ${
                              school.status === 'suspended' ? 'hover:text-emerald-600' : 'hover:text-amber-600'
                            }`}
                          >
                            {school.status === 'suspended' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(school.id)}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
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

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Add New School</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">School Name</label>
                <input
                  type="text"
                  placeholder="e.g. Greenwood High"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Email</label>
                <input
                  type="email"
                  placeholder="admin@school.com"
                  value={newSchool.contactEmail}
                  onChange={(e) => setNewSchool({ ...newSchool, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subscription Plan</label>
                <select 
                  value={newSchool.planName}
                  onChange={(e) => setNewSchool({ ...newSchool, planName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Plan...</option>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchool}
                disabled={!newSchool.name || !newSchool.contactEmail}
                className="flex-1 px-4 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Add School
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
