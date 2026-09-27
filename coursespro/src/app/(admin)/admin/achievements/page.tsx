'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilSquareIcon, TrashIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminAchievementsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    code_name: '',
    description: '',
    type: 'BADGE',
    icon_url: '',
    is_active: true
  });

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['admin_achievements'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/admin/achievements');
      return res.data || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingAchievement?.id) {
        return coursesApi.put(`/api/admin/achievements/${editingAchievement.id}`, data);
      } else {
        return coursesApi.post('/api/admin/achievements', data);
      }
    },
    onSuccess: () => {
      toast.success(editingAchievement ? 'Achievement updated' : 'Achievement created');
      queryClient.invalidateQueries({ queryKey: ['admin_achievements'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return coursesApi.delete(`/api/admin/achievements/${id}`);
    },
    onSuccess: () => {
      toast.success('Achievement deleted');
      queryClient.invalidateQueries({ queryKey: ['admin_achievements'] });
    },
    onError: () => toast.error('Failed to delete achievement')
  });

  const openNewModal = () => {
    setEditingAchievement(null);
    setFormData({ title: '', code_name: '', description: '', type: 'BADGE', icon_url: '', is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (ach: any) => {
    setEditingAchievement(ach);
    setFormData({
      title: ach.title,
      code_name: ach.code_name,
      description: ach.description,
      type: ach.type,
      icon_url: ach.icon_url,
      is_active: ach.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this achievement? This will not remove it from users who already earned it, but it may break their public UI if not handled carefully.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
          <p className="text-sm text-gray-500 mt-1">Manage badges and certificates for your tenant.</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Create Achievement
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">Loading achievements...</div>
      ) : achievements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">No achievements defined yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach: any) => (
            <div key={ach.id} className="bg-white border border-gray-200 rounded-xl p-6 relative group">
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(ach)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ach.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  {ach.icon_url ? (
                    <img src={ach.icon_url} alt={ach.title} className="w-8 h-8 object-contain" />
                  ) : (
                    <TrophyIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{ach.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {ach.type}
                    </span>
                    {!ach.is_active && (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">{ach.description}</p>
              <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded border border-gray-100">
                Code: {ach.code_name || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingAchievement ? 'Edit Achievement' : 'New Achievement'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code Name
                  <span className="text-xs text-gray-400 font-normal ml-2">(Used for automated triggers)</span>
                </label>
                <input
                  type="text"
                  value={formData.code_name}
                  onChange={e => setFormData({ ...formData, code_name: e.target.value.toUpperCase() })}
                  placeholder="e.g. COURSE_GRADUATE"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="BADGE">Badge</option>
                    <option value="CERTIFICATE">Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={e => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL (Optional)</label>
                <input
                  type="text"
                  value={formData.icon_url}
                  onChange={e => setFormData({ ...formData, icon_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
