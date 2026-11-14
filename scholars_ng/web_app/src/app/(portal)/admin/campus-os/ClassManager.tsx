'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AcademicCapIcon,
  PlusIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';

export interface ClassArmRecord {
  id: string;
  tenant_id: string;
  class_id: string;
  name: string;
  arm_code: string;
  form_teacher_id?: string;
  form_teacher_name?: string;
  room_number?: string;
  capacity: number;
  enrolled_students: number;
  status: string;
}

export interface ClassRecord {
  id: string;
  tenant_id: string;
  name: string;
  level_order: number;
  category: string;
  curriculum: string;
  description?: string;
  arms: ClassArmRecord[];
  total_arms: number;
  total_pupils: number;
}

const CATEGORIES = [
  'JUNIOR_SECONDARY',
  'SENIOR_SECONDARY',
  'PRIMARY',
  'NURSERY',
  'VOCATIONAL',
];

const CURRICULUMS = [
  'NERDC / WAEC Standard',
  'NERDC / BECE Standard',
  'Cambridge IGCSE & WAEC',
  'Universal Basic Education (UBE)',
  'Early Years Foundation Stage (EYFS)',
];

export default function ClassManager({ onClassesCountChange }: { onClassesCountChange?: (count: number) => void }) {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState<boolean>(false);
  const [isAddArmModalOpen, setIsAddArmModalOpen] = useState<boolean>(false);
  const [editingArm, setEditingArm] = useState<ClassArmRecord | null>(null);
  const [targetClassForArm, setTargetClassForArm] = useState<ClassRecord | null>(null);
  const [deleteArmTarget, setDeleteArmTarget] = useState<ClassArmRecord | null>(null);

  // Class Form
  const [classForm, setClassForm] = useState({
    name: '',
    level_order: 1,
    category: 'SENIOR_SECONDARY',
    curriculum: 'NERDC / WAEC Standard',
    description: '',
  });

  // Arm Form
  const [armForm, setArmForm] = useState({
    class_id: '',
    name: '',
    arm_code: '',
    form_teacher_name: '',
    room_number: '',
    capacity: 35,
    status: 'ACTIVE',
  });

  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Fetch classes & arms with strict tenant isolation and zero fallbacks
  const fetchClasses = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      const res = await api.get(`/v1/campus/classes${qs}`).catch(async () => {
        return await api.get(`/campus/classes${qs}`);
      });

      if (res.data && Array.isArray(res.data)) {
        setClasses(res.data);
        if (onClassesCountChange) {
          onClassesCountChange(res.data.length);
        }
      } else {
        setClasses([]);
      }
    } catch (err: any) {
      console.error('Failed to load campus classes:', err);
      // STRICT REQUIREMENT: No fallbacks! Report authoritative error to user
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Unable to load classes from database. Please verify tenant database connection.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [onClassesCountChange]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Open Add Arm Modal
  const handleOpenAddArm = (c: ClassRecord) => {
    setTargetClassForArm(c);
    setArmForm({
      class_id: c.id,
      name: '',
      arm_code: '',
      form_teacher_name: '',
      room_number: `Block A · Room ${Math.floor(100 + Math.random() * 200)}`,
      capacity: 35,
      status: 'ACTIVE',
    });
    setFormError(null);
    setIsAddArmModalOpen(true);
  };

  // Open Edit Arm Modal
  const handleOpenEditArm = (arm: ClassArmRecord) => {
    setEditingArm(arm);
    setArmForm({
      class_id: arm.class_id,
      name: arm.name,
      arm_code: arm.arm_code,
      form_teacher_name: arm.form_teacher_name || '',
      room_number: arm.room_number || '',
      capacity: arm.capacity || 35,
      status: arm.status || 'ACTIVE',
    });
    setFormError(null);
  };

  // Submit Create Class Level
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name.trim()) {
      setFormError('Class name is required');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        ...classForm,
        level_order: Number(classForm.level_order) || 1,
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.post('/v1/campus/classes', payload).catch(async () => {
        return await api.post('/campus/classes', payload);
      });

      setIsAddClassModalOpen(false);
      setBannerSuccess(`Successfully created class level "${classForm.name}".`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchClasses(true);
    } catch (err: any) {
      console.error('Failed to create class:', err);
      setFormError(err?.response?.data?.error || err?.message || 'Failed to create class level.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Create Arm
  const handleCreateArm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!armForm.name.trim()) {
      setFormError('Arm name is required');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        ...armForm,
        capacity: Number(armForm.capacity) || 35,
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.post('/v1/campus/classes/arms', payload).catch(async () => {
        return await api.post('/campus/classes/arms', payload);
      });

      setIsAddArmModalOpen(false);
      setBannerSuccess(`Successfully created class arm "${armForm.name}".`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchClasses(true);
    } catch (err: any) {
      console.error('Failed to create arm:', err);
      setFormError(err?.response?.data?.error || err?.message || 'Failed to create class arm.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Update Arm
  const handleUpdateArm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArm) return;
    if (!armForm.name.trim()) {
      setFormError('Arm name is required');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        id: editingArm.id,
        ...armForm,
        capacity: Number(armForm.capacity) || 35,
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.put('/v1/campus/classes/arms', payload).catch(async () => {
        return await api.put('/campus/classes/arms', payload);
      });

      setEditingArm(null);
      setBannerSuccess(`Successfully updated arm "${armForm.name}".`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchClasses(true);
    } catch (err: any) {
      console.error('Failed to update arm:', err);
      setFormError(err?.response?.data?.error || err?.message || 'Failed to update class arm.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Arm
  const handleDeleteArm = async () => {
    if (!deleteArmTarget) return;
    setFormSubmitting(true);
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams({ id: deleteArmTarget.id });
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);

      await api.delete(`/v1/campus/classes/arms?${params.toString()}`).catch(async () => {
        return await api.delete(`/campus/classes/arms?${params.toString()}`);
      });

      setBannerSuccess(`Arm "${deleteArmTarget.name}" has been deleted.`);
      setTimeout(() => setBannerSuccess(null), 5000);
      setDeleteArmTarget(null);
      fetchClasses(true);
    } catch (err: any) {
      console.error('Failed to delete arm:', err);
      alert(err?.response?.data?.error || err?.message || 'Failed to delete class arm.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Aggregates
  const totalPupils = classes.reduce((acc, c) => acc + (c.total_pupils || 0), 0);
  const totalArms = classes.reduce((acc, c) => acc + (c.arms?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {bannerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchClasses(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Classes &amp; Class Arms Operations</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure Nigerian K-12 academic levels, classroom blocks, capacity limits, and form teachers with single-database multi-tenancy.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchClasses(true)}
            disabled={loading || refreshing}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#146ef5]' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setClassForm({
                name: '',
                level_order: classes.length + 1,
                category: 'SENIOR_SECONDARY',
                curriculum: 'NERDC / WAEC Standard',
                description: '',
              });
              setFormError(null);
              setIsAddClassModalOpen(true);
            }}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Class Level
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Class Levels</span>
            <AcademicCapIcon className="w-4 h-4 text-[#146ef5]" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Tier cohorts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Arms</span>
            <BuildingOffice2Icon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{totalArms}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Classroom streams</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Pupils</span>
            <UserGroupIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalPupils}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Assigned to arms</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Stream Size</span>
            <SparklesIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {totalArms > 0 ? Math.round(totalPupils / totalArms) : 0} Pupils
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Optimal capacity: 35</div>
        </div>
      </div>

      {/* Classes & Arms Grid */}
      {loading ? (
        <div className="py-24 text-center bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-[#146ef5] mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">Loading academic classes from database...</p>
          <p className="text-xs text-gray-400 mt-1">Tenant isolated Lakebase Postgres</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="py-20 text-center px-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
          <AcademicCapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No classes registered yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Get started by adding your institution's class levels (e.g. JSS 1, SSS 1).
          </p>
          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="mt-4 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Create First Class Level
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
              {/* Class Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#146ef5] flex items-center justify-center font-bold text-sm">
                    L{cls.level_order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {cls.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{cls.curriculum || 'NERDC Standard'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right sm:text-right">
                    <span className="text-xs font-semibold text-gray-700">
                      {cls.arms?.length || 0} Arms · {cls.total_pupils || 0} Students
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenAddArm(cls)}
                    className="bg-blue-50 hover:bg-blue-100 text-[#146ef5] text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Add Arm
                  </button>
                </div>
              </div>

              {/* Arms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {(cls.arms || []).length === 0 ? (
                  <div className="col-span-full py-8 text-center text-xs text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    No streams or arms created under this class level yet.
                  </div>
                ) : (
                  cls.arms.map((arm) => {
                    const capacity = arm.capacity || 35;
                    const enrolled = arm.enrolled_students || 0;
                    const pct = Math.min(100, Math.round((enrolled / capacity) * 100));

                    return (
                      <div
                        key={arm.id}
                        className="bg-gray-50/60 hover:bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#146ef5] bg-blue-50 px-2.5 py-0.5 rounded-full">
                              {arm.room_number || 'Room TBD'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditArm(arm)}
                                title="Edit Arm"
                                className="p-1 text-gray-400 hover:text-[#146ef5] transition-colors"
                              >
                                <PencilSquareIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteArmTarget(arm)}
                                title="Delete Arm"
                                className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                              >
                                <TrashIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-base font-bold text-gray-900">{arm.name}</h4>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{arm.arm_code}</p>

                          <div className="text-xs text-gray-600 space-y-1.5 mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Form Teacher:</span>
                              <span className="font-semibold text-gray-800">
                                {arm.form_teacher_name || 'Unassigned'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Enrollment:</span>
                              <span className="font-semibold text-emerald-600">
                                {enrolled} / {capacity} Pupils
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-2">
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 95 ? 'bg-rose-500' : pct >= 80 ? 'bg-[#146ef5]' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Level Modal */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Create Class Level</h3>
                <p className="text-xs text-gray-500 mt-0.5">Register a new academic grade or cohort tier</p>
              </div>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Class Level Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Secondary 1 (SSS 1)"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Level Order (Sequence)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={classForm.level_order}
                    onChange={(e) => setClassForm({ ...classForm, level_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={classForm.category}
                    onChange={(e) => setClassForm({ ...classForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Curriculum Standard</label>
                <select
                  value={classForm.curriculum}
                  onChange={(e) => setClassForm({ ...classForm, curriculum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                >
                  {CURRICULUMS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={classForm.description}
                  onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                  placeholder="Notes about cohort specialization or exam objectives..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-full shadow-sm shadow-[#146ef5]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Class Level'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Arm Modal */}
      {(isAddArmModalOpen || editingArm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingArm ? 'Edit Class Arm' : `Add Arm to ${targetClassForArm?.name || 'Class'}`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Configure room block, form teacher, and capacity</p>
              </div>
              <button
                onClick={() => {
                  setIsAddArmModalOpen(false);
                  setEditingArm(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={editingArm ? handleUpdateArm : handleCreateArm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Arm Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science A, Gold, Arts"
                    value={armForm.name}
                    onChange={(e) => setArmForm({ ...armForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Arm Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SS3-SCIA"
                    value={armForm.arm_code}
                    onChange={(e) => setArmForm({ ...armForm, arm_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Form Teacher Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Funke Adebayo"
                    value={armForm.form_teacher_name}
                    onChange={(e) => setArmForm({ ...armForm, form_teacher_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Room / Classroom Block</label>
                  <input
                    type="text"
                    placeholder="e.g. Block A · Room 101"
                    value={armForm.room_number}
                    onChange={(e) => setArmForm({ ...armForm, room_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Capacity (Max Pupils)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={armForm.capacity}
                    onChange={(e) => setArmForm({ ...armForm, capacity: parseInt(e.target.value) || 35 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={armForm.status}
                    onChange={(e) => setArmForm({ ...armForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 font-semibold"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddArmModalOpen(false);
                    setEditingArm(null);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-full shadow-sm shadow-[#146ef5]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingArm ? (
                    'Save Arm Changes'
                  ) : (
                    'Add Class Arm'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Arm Confirmation */}
      {deleteArmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Class Arm?</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteArmTarget.name}</span> ({deleteArmTarget.arm_code})? Any enrolled students will lose their arm association.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                disabled={formSubmitting}
                onClick={() => setDeleteArmTarget(null)}
                className="px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={formSubmitting}
                onClick={handleDeleteArm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-rose-600/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {formSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
