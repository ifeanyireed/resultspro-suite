'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  HomeModernIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import type { CampusBranch } from './components';

interface CampusBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  campuses: CampusBranch[];
  onRefresh: () => Promise<void>;
  selectedCampusId: string;
  onSelectCampusId: (id: string) => void;
}

export default function CampusBranchModal({
  isOpen,
  onClose,
  campuses,
  onRefresh,
  selectedCampusId,
  onSelectCampusId,
}: CampusBranchModalProps) {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingBranch, setEditingBranch] = useState<CampusBranch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    principal_name: '',
    principal_email: '',
    is_main: false,
    status: 'ACTIVE',
  });

  if (!isOpen) return null;

  const showBannerMessage = (type: 'error' | 'success', msg: string) => {
    if (type === 'error') {
      setErrorBanner(msg);
      setSuccessBanner(null);
    } else {
      setSuccessBanner(msg);
      setErrorBanner(null);
    }
    setTimeout(() => {
      setErrorBanner(null);
      setSuccessBanner(null);
    }, 4000);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: 'Lagos',
      state: 'Lagos State',
      phone: '',
      email: '',
      principal_name: '',
      principal_email: '',
      is_main: campuses.length === 0,
      status: 'ACTIVE',
    });
    setEditingBranch(null);
    setActiveView('create');
  };

  const handleOpenEdit = (branch: CampusBranch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address || '',
      city: branch.city || '',
      state: branch.state || '',
      phone: branch.phone || '',
      email: branch.email || '',
      principal_name: branch.principal_name || '',
      principal_email: branch.principal_email || '',
      is_main: branch.is_main,
      status: branch.status,
    });
    setActiveView('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showBannerMessage('error', 'Campus branch name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorBanner(null);

    try {
      if (activeView === 'create') {
        const res = await api
          .post('/v1/campus/branches', formData)
          .catch(async () => await api.post('/campus/branches', formData));

        if (res?.data?.success) {
          showBannerMessage('success', 'New campus branch created successfully.');
          await onRefresh();
          setActiveView('list');
        } else {
          showBannerMessage('error', res?.data?.error || 'Failed to create campus branch.');
        }
      } else if (activeView === 'edit' && editingBranch) {
        const payload = {
          id: editingBranch.id,
          ...formData,
        };
        const res = await api
          .put('/v1/campus/branches', payload)
          .catch(async () => await api.put('/campus/branches', payload));

        if (res?.data?.success) {
          showBannerMessage('success', 'Campus branch updated successfully.');
          await onRefresh();
          setActiveView('list');
        } else {
          showBannerMessage('error', res?.data?.error || 'Failed to update campus branch.');
        }
      }
    } catch (err: any) {
      showBannerMessage(
        'error',
        err.response?.data?.error || err.message || 'An error occurred while saving the campus.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetAsMain = async (branch: CampusBranch) => {
    if (branch.is_main) return;
    setIsSubmitting(true);
    try {
      const payload = {
        id: branch.id,
        name: branch.name,
        code: branch.code,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        phone: branch.phone,
        email: branch.email,
        principal_name: branch.principal_name,
        principal_email: branch.principal_email,
        is_main: true,
        status: branch.status,
      };
      const res = await api
        .put('/v1/campus/branches', payload)
        .catch(async () => await api.put('/campus/branches', payload));

      if (res?.data?.success) {
        showBannerMessage('success', `${branch.name} is now the primary headquarters campus.`);
        await onRefresh();
      } else {
        showBannerMessage('error', res?.data?.error || 'Failed to update primary campus.');
      }
    } catch (err: any) {
      showBannerMessage('error', err.response?.data?.error || 'Failed to set primary campus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (branch: CampusBranch) => {
    if (campuses.length <= 1) {
      showBannerMessage('error', 'Cannot delete the only campus branch of this institution.');
      return;
    }

    if (!confirm(`Are you sure you want to remove ${branch.name}? Associated records will be unassigned.`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api
        .delete(`/v1/campus/branches?id=${encodeURIComponent(branch.id)}`)
        .catch(async () => await api.delete(`/campus/branches?id=${encodeURIComponent(branch.id)}`));

      if (res?.data?.success) {
        showBannerMessage('success', `Branch "${branch.name}" was successfully removed.`);
        if (selectedCampusId === branch.id) {
          onSelectCampusId('all');
        }
        await onRefresh();
      } else {
        showBannerMessage('error', res?.data?.error || 'Failed to delete campus branch.');
      }
    } catch (err: any) {
      showBannerMessage('error', err.response?.data?.error || 'Failed to delete branch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <HomeModernIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Multi-Campus & Branch Management
              </h2>
              <p className="text-xs text-gray-500">
                Institutional sites, physical locations, campus directors, and branch registers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Banners */}
        {errorBanner && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorBanner}</span>
          </div>
        )}
        {successBanner && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between mt-4 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'list'
                  ? 'bg-blue-50 text-[#146ef5] border border-blue-200/80 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All Campuses ({campuses.length})
            </button>
            <button
              onClick={handleOpenCreate}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'create'
                  ? 'bg-blue-50 text-[#146ef5] border border-blue-200/80 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add Campus Site
            </button>
          </div>

          {activeView === 'list' && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#146ef5] text-white text-xs font-semibold hover:bg-[#105bd1] transition-colors shadow-xs"
            >
              <PlusIcon className="w-3.5 h-3.5" /> New Branch
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto mt-2 pr-1 space-y-4 flex-1">
          {/* VIEW: BRANCH LIST */}
          {activeView === 'list' && (
            <div className="space-y-3">
              {campuses.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  <HomeModernIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  No campus branches registered yet. Click &quot;Add Campus Site&quot; to begin.
                </div>
              ) : (
                campuses.map((branch) => {
                  const isSelected = selectedCampusId === branch.id;
                  return (
                    <div
                      key={branch.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-[#146ef5] bg-blue-50/20 shadow-xs'
                          : 'border-gray-200/80 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-gray-900 text-base">{branch.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-mono font-semibold">
                              {branch.code}
                            </span>
                            {branch.is_main && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                <StarIcon className="w-3 h-3 fill-amber-500 text-amber-500" /> Primary Headquarters
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                branch.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {branch.status}
                            </span>
                          </div>

                          {/* Address & City */}
                          {(branch.address || branch.city) && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <MapPinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>
                                {branch.address}
                                {branch.address && branch.city ? ', ' : ''}
                                {branch.city}
                                {branch.state ? ` (${branch.state})` : ''}
                              </span>
                            </div>
                          )}

                          {/* Principal & Contacts */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                            {branch.principal_name && (
                              <div className="flex items-center gap-1 text-gray-700 font-medium">
                                <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span>{branch.principal_name}</span>
                              </div>
                            )}
                            {branch.phone && (
                              <div className="flex items-center gap-1">
                                <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span>{branch.phone}</span>
                              </div>
                            )}
                            {branch.email && (
                              <div className="flex items-center gap-1">
                                <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span>{branch.email}</span>
                              </div>
                            )}
                          </div>

                          {/* Quick KPIs */}
                          <div className="flex items-center gap-3 pt-2 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 font-medium text-gray-700">
                              Students: <strong className="text-gray-900">{branch.student_count || 0}</strong>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 font-medium text-gray-700">
                              Staff: <strong className="text-gray-900">{branch.staff_count || 0}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectCampusId(branch.id);
                              onClose();
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-100 text-[#146ef5]'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-[#146ef5]'
                            }`}
                          >
                            {isSelected ? '✓ Active Filter' : 'Select Branch'}
                          </button>

                          <div className="flex items-center gap-1">
                            {!branch.is_main && (
                              <button
                                type="button"
                                onClick={() => handleSetAsMain(branch)}
                                title="Promote to Primary Headquarters"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <StarIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(branch)}
                              title="Edit Campus Details"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#146ef5] hover:bg-blue-50 transition-colors"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            {!branch.is_main && (
                              <button
                                type="button"
                                onClick={() => handleDelete(branch)}
                                title="Delete Campus"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW: CREATE / EDIT FORM */}
          {(activeView === 'create' || activeView === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div className="font-bold text-gray-900 text-sm">
                  {activeView === 'create' ? 'Register New Campus Location' : `Edit ${editingBranch?.name}`}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">Campus Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lekki Junior High Campus"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Short Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LEK-JH"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Lekki / Ikeja / Maitama"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Lagos State / Abuja FCT"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Physical Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Plot 12, Admiralty Way, Lekki Phase 1"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Official Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +234 1 280 4400"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      placeholder="e.g. lekki@scholars.ng"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Head of Campus / Principal</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Olufemi Adeleke"
                      value={formData.principal_name}
                      onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Principal Email</label>
                    <input
                      type="email"
                      placeholder="e.g. principal.lekki@scholars.ng"
                      value={formData.principal_email}
                      onChange={(e) => setFormData({ ...formData, principal_email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="is_main_checkbox"
                      checked={formData.is_main}
                      onChange={(e) => setFormData({ ...formData, is_main: e.target.checked })}
                      className="w-4 h-4 text-[#146ef5] rounded border-gray-300 focus:ring-[#146ef5]"
                    />
                    <label htmlFor="is_main_checkbox" className="font-semibold text-gray-700 cursor-pointer">
                      Designate as Primary Headquarters Campus
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Operational Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#146ef5] text-white font-semibold rounded-xl hover:bg-[#105bd1] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />}
                  {activeView === 'create' ? 'Register Campus' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <div>
            Multi-Campus Scoping:{' '}
            <span className="font-semibold text-gray-700">
              {selectedCampusId === 'all'
                ? 'All Campuses (Consolidated Multi-Campus View)'
                : campuses.find((c) => c.id === selectedCampusId)?.name || 'Filtered'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
