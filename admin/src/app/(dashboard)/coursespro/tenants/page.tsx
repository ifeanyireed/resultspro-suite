'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/Badge';
import { Building2, Search, Filter, ExternalLink, Plus, X } from 'lucide-react';
import { fetchSchools, verifySchool, createTenant, updateTenant } from '@/lib/api';
import { School } from '@/lib/types';

export default function CoursesProTenantManager() {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [editTenantData, setEditTenantData] = useState<any>(null);

  const [newTenantData, setNewTenantData] = useState({
    name: '',
    slug: '',
    contact_email: '',
    primary_color: '#2563eb',
    type: 'COURSESPRO',
    enabled_modules: ['coursepro'] // Default module
  });



  async function load() {
    setLoading(true);
    const data = await fetchSchools();
    setSchools(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const ok = await createTenant({
      ...newTenantData,
      enabled_modules: JSON.stringify(newTenantData.enabled_modules)
    });
    setCreating(false);
    if (ok) {
      setIsModalOpen(false);
      setNewTenantData({ name: '', slug: '', contact_email: '', primary_color: '#2563eb', type: 'COURSESPRO', enabled_modules: ['coursepro'] });
      load();
    } else {
      alert("Failed to create tenant");
    }
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditTenantData({ ...editTenantData, logo_url: data.url });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Something went wrong during upload');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTenantData || !editTenantData.id) return;
    setUpdating(true);
    const ok = await updateTenant(editTenantData.id, editTenantData);
    setUpdating(false);
    if (ok) {
      setIsEditModalOpen(false);
      load();
    } else {
      alert("Failed to update tenant");
    }
  };

  const handleVerify = async (schoolId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      const ok = await verifySchool(schoolId, status);
      if (ok) {
        setSchools((prev) =>
          prev.map((s) => (s.id === schoolId ? { ...s, verification_status: status } : s))
        );
        alert(`Successfully ${status === 'VERIFIED' ? 'approved' : 'rejected'} tenant.`);
      } else {
        alert("Failed to verify tenant. Please try again.");
      }
    } catch (err: any) {
      alert(`Error verifying: ${err.message}`);
    }
  };

  const filtered = schools.filter((s) => {
    const matchType = s.type === 'COURSESPRO';
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.contact_email && s.contact_email.toLowerCase().includes(search.toLowerCase()));
    const matchTier = filterTier === 'ALL' || s.subscription_tier === filterTier;
    const matchStatus = filterStatus === 'ALL' || s.verification_status === filterStatus;
    return matchType && matchSearch && matchTier && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter Controls (Glassmorphism) */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-sm shadow-slate-200/50 p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by tenant name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-full text-slate-700 text-xs font-normal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-100 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <span className="font-medium text-slate-500 text-xs mr-2">Plan:</span>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-transparent text-slate-700 font-medium text-xs focus:outline-none cursor-pointer appearance-none pr-3"
            >
              <option value="ALL">All Plans</option>
              <option value="FREE">Free</option>
              <option value="BASIC">Basic</option>
              <option value="PRO">Pro</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-100 transition-colors">
            <span className="font-medium text-slate-500 text-xs mr-2">Verification:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-700 font-medium text-xs focus:outline-none cursor-pointer appearance-none pr-3"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING_VERIFICATION">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm transition-all text-xs ml-4"
          >
            <Plus className="w-4 h-4" />
            New CoursesPro Tenant
          </button>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Tenant Name</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Contact Email</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Subscription Tier</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Verification</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">State / LGA</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((school) => (
                  <tr key={school.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-medium text-white text-xs shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: school.primary_color || '#2563eb' }}
                      >
                        {school.logo_emoji || school.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-xs">{school.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">{school.slug}.resultspro.ng</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-normal">{school.contact_email || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge status={school.subscription_tier} />
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={school.verification_status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-normal">
                      {school.state ? `${school.state}, ${school.lga || ''}` : 'Nigeria'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {school.verification_status === 'PENDING_VERIFICATION' && (
                          <>
                            <button
                              onClick={() => handleVerify(school.id, 'VERIFIED')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium text-[11px] hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-emerald-500/30"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerify(school.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full font-medium text-[11px] hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-rose-500/30"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setEditTenantData({
                              id: school.id,
                              name: school.name,
                              slug: school.slug,
                              contact_email: school.contact_email || '',
                              logo_url: school.logo_url || '',
                              status: school.status || 'ACTIVE',
                              primary_color: school.primary_color || '#2563eb'
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium text-[11px] hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-500/30"
                        >
                          Edit
                        </button>
                        <a
                          href={`https://${school.slug}.resultspro.ng`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium text-[11px] hover:bg-slate-200 transition-all shadow-sm"
                        >
                          Portal <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 font-bold text-lg mb-1">No Tenants Found</h3>
                      <p className="text-slate-500 text-sm max-w-sm">We couldn't find any tenants matching your current filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Provision CoursesPro Tenant
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CoursesPro Tenant Name</label>
                <input 
                  type="text" required
                  value={newTenantData.name}
                  onChange={e => setNewTenantData({...newTenantData, name: e.target.value})}
                  placeholder="e.g. Greenwood High"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subdomain (Slug)</label>
                <div className="relative">
                  <input 
                    type="text" required
                    value={newTenantData.slug}
                    onChange={e => setNewTenantData({...newTenantData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                    placeholder="greenwood"
                    className="w-full pl-4 pr-28 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-medium">.resultspro.ng</span>
                  </div>
                </div>
              </div>
                            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Logo</label>
                <div className="flex items-center gap-4">
                  {editTenantData.logo_url ? (
                    <img src={editTenantData.logo_url} alt="Logo" className="w-10 h-10 object-contain bg-slate-50 rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">No Logo</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleUploadLogo}
                    disabled={isUploadingLogo}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {isUploadingLogo && <span className="text-xs text-blue-500">Uploading...</span>}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Contact Email</label>
                <input 
                  type="email" required
                  value={newTenantData.contact_email}
                  onChange={e => setNewTenantData({...newTenantData, contact_email: e.target.value})}
                  placeholder="admin@school.com"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Theme Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={newTenantData.primary_color}
                    onChange={e => setNewTenantData({...newTenantData, primary_color: e.target.value})}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-slate-50 border border-slate-200 p-1"
                  />
                  <input 
                    type="text" 
                    value={newTenantData.primary_color}
                    onChange={e => setNewTenantData({...newTenantData, primary_color: e.target.value})}
                    className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Provision Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Tenant Modal */}
      {isEditModalOpen && editTenantData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Edit Tenant
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateTenant} className="p-6 space-y-4">
                            <div className="space-y-1.5 flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl mt-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Account Status</label>
                  <span className="text-xs font-medium text-slate-700">{editTenantData.status === 'ACTIVE' ? 'Active' : 'Suspended'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTenantData({ ...editTenantData, status: editTenantData.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${editTenantData.status === 'ACTIVE' ? 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                >
                  {editTenantData.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                </button>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Name</label>
                <input 
                  type="text" required
                  value={editTenantData.name}
                  onChange={e => setEditTenantData({...editTenantData, name: e.target.value})}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subdomain (Slug)</label>
                <div className="relative">
                  <input 
                    type="text" required
                    value={editTenantData.slug}
                    onChange={e => {
                      const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setEditTenantData({...editTenantData, slug: newSlug, default_subdomain: `${newSlug}.resultspro.ng`});
                    }}
                    className="w-full pl-4 pr-28 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-medium">.resultspro.ng</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Contact Email</label>
                <input 
                  type="email" required
                  value={editTenantData.contact_email}
                  onChange={e => setEditTenantData({...editTenantData, contact_email: e.target.value})}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Theme Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={editTenantData.primary_color}
                    onChange={e => setEditTenantData({...editTenantData, primary_color: e.target.value})}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-slate-50 border border-slate-200 p-1"
                  />
                  <input 
                    type="text" 
                    value={editTenantData.primary_color}
                    onChange={e => setEditTenantData({...editTenantData, primary_color: e.target.value})}
                    className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
