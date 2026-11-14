'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AcademicCapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  IdentificationIcon,
  UserPlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';

export interface CampusArmStudent {
  id: string;
  tenant_id: string;
  arm_id: string;
  arm_name: string;
  class_id: string;
  class_name: string;
  student_id: string;
  student_name: string;
  admission_number: string;
  gender: 'MALE' | 'FEMALE' | string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'GRADUATED' | string;
  created_at: string;
}

export interface CampusClassArm {
  id: string;
  tenant_id: string;
  class_id: string;
  name: string;
  arm_code: string;
  form_teacher_name?: string;
  room_number?: string;
  capacity: number;
  enrolled_students: number;
  status: string;
}

export interface CampusClassRecord {
  id: string;
  tenant_id: string;
  name: string;
  level_order: number;
  category: string;
  curriculum: string;
  arms: CampusClassArm[];
  total_arms: number;
  total_pupils: number;
}

export default function StudentManager({ onStudentCountChange }: { onStudentCountChange?: (count: number) => void }) {
  const [students, setStudents] = useState<CampusArmStudent[]>([]);
  const [classes, setClasses] = useState<CampusClassRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [selectedArmId, setSelectedArmId] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<CampusArmStudent | null>(null);

  // Enrollment Form State
  const [enrollForm, setEnrollForm] = useState({
    class_id: '',
    arm_id: '',
    student_name: '',
    admission_number: '',
    gender: 'MALE',
  });
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Fetch classes and arms for filter & enroll dropdowns
  const fetchClassesAndArms = useCallback(async () => {
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
      }
    } catch (err) {
      console.warn('Could not preload classes for dropdowns:', err);
    }
  }, []);

  // Fetch students with strict tenant isolation and zero fallbacks
  const fetchStudents = useCallback(async (isRefresh = false) => {
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
      if (selectedClassId !== 'ALL') params.append('class_id', selectedClassId);
      if (selectedArmId !== 'ALL') params.append('arm_id', selectedArmId);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const qs = params.toString() ? `?${params.toString()}` : '';

      // Try students endpoint or arms students endpoint
      const res = await api.get(`/v1/campus/students${qs}`).catch(async () => {
        return await api.get(`/v1/campus/classes/arms/students${qs}`).catch(async () => {
          return await api.get(`/campus/classes/arms/students${qs}`);
        });
      });

      if (res.data && Array.isArray(res.data)) {
        let list: CampusArmStudent[] = res.data;
        if (selectedGender !== 'ALL') {
          list = list.filter((s) => s.gender === selectedGender);
        }
        setStudents(list);
        if (onStudentCountChange) {
          onStudentCountChange(list.length);
        }
      } else {
        setStudents([]);
      }
    } catch (err: any) {
      console.error('Failed to load students roster:', err);
      // STRICT REQUIREMENT: No fallbacks! Report authoritative error to user
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Unable to load student admissions roster from database. Please verify tenant database connection.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedClassId, selectedArmId, selectedGender, searchTerm, onStudentCountChange]);

  useEffect(() => {
    fetchClassesAndArms();
  }, [fetchClassesAndArms]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Available arms derived from selected class
  const availableArms = useMemo(() => {
    if (selectedClassId === 'ALL') {
      return classes.flatMap((c) => c.arms || []);
    }
    const found = classes.find((c) => c.id === selectedClassId);
    return found ? found.arms || [] : [];
  }, [classes, selectedClassId]);

  // Modal available arms derived from enrollForm.class_id
  const modalAvailableArms = useMemo(() => {
    if (!enrollForm.class_id) {
      return classes.flatMap((c) => c.arms || []);
    }
    const found = classes.find((c) => c.id === enrollForm.class_id);
    return found ? found.arms || [] : [];
  }, [classes, enrollForm.class_id]);

  // Open enroll modal
  const handleOpenEnrollModal = () => {
    const firstClass = classes[0];
    const firstArm = firstClass?.arms?.[0];
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    setEnrollForm({
      class_id: firstClass?.id || '',
      arm_id: firstArm?.id || '',
      student_name: '',
      admission_number: `ADM-${year}-${randomSuffix}`,
      gender: 'MALE',
    });
    setFormError(null);
    setIsEnrollModalOpen(true);
  };

  // Submit Enroll Student
  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.arm_id) {
      setFormError('Please select a class arm for the student');
      return;
    }
    if (!enrollForm.student_name.trim()) {
      setFormError('Student full name is required');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        arm_id: enrollForm.arm_id,
        student_name: enrollForm.student_name.trim(),
        admission_number: enrollForm.admission_number.trim(),
        gender: enrollForm.gender,
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.post('/v1/campus/classes/arms/students', payload).catch(async () => {
        return await api.post('/campus/classes/arms/students', payload);
      });

      setIsEnrollModalOpen(false);
      setBannerSuccess(`Successfully enrolled "${enrollForm.student_name}" with admission ID ${enrollForm.admission_number}.`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchStudents(true);
      fetchClassesAndArms();
    } catch (err: any) {
      console.error('Failed to enroll student:', err);
      setFormError(err?.response?.data?.error || err?.message || 'Failed to save student enrollment into database.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Unenroll
  const handleUnenrollStudent = async () => {
    if (!deleteTarget) return;
    setFormSubmitting(true);
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams({ id: deleteTarget.id });
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);

      await api.delete(`/v1/campus/classes/arms/students?${params.toString()}`).catch(async () => {
        return await api.delete(`/campus/classes/arms/students?${params.toString()}`);
      });

      setBannerSuccess(`Student "${deleteTarget.student_name}" has been unenrolled.`);
      setTimeout(() => setBannerSuccess(null), 5000);
      setDeleteTarget(null);
      fetchStudents(true);
      fetchClassesAndArms();
    } catch (err: any) {
      console.error('Failed to unenroll student:', err);
      alert(err?.response?.data?.error || err?.message || 'Failed to unenroll student.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Aggregates
  const totalCount = students.length;
  const maleCount = students.filter((s) => s.gender === 'MALE').length;
  const femaleCount = students.filter((s) => s.gender === 'FEMALE').length;
  const armsCount = new Set(students.map((s) => s.arm_id)).size;

  return (
    <div className="space-y-6">
      {/* Banner Notifications */}
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
            onClick={() => fetchStudents(true)}
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
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Student Admissions &amp; Roster Registry</h2>
          <p className="text-sm text-gray-500 mt-1">
            Verified student enrollment roster across academic class levels, arms, and admission registers with tenant isolation.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchStudents(true)}
            disabled={loading || refreshing}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#146ef5]' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenEnrollModal}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Enroll New Student
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Enrolled</span>
            <UserGroupIcon className="w-4 h-4 text-[#146ef5]" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Active pupils</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Male Students</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{maleCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {totalCount > 0 ? `${Math.round((maleCount / totalCount) * 100)}% ratio` : '0%'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Female Students</span>
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          </div>
          <div className="text-2xl font-bold text-pink-600">{femaleCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {totalCount > 0 ? `${Math.round((femaleCount / totalCount) * 100)}% ratio` : '0%'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Represented Arms</span>
            <BuildingOffice2Icon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{armsCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Active class streams</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Live Search */}
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5] text-gray-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Class Level Dropdown */}
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedArmId('ALL');
              }}
              aria-label="Filter by class level"
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
            >
              <option value="ALL">All Class Levels</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Arm Dropdown */}
            <select
              value={selectedArmId}
              onChange={(e) => setSelectedArmId(e.target.value)}
              aria-label="Filter by class arm"
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
            >
              <option value="ALL">All Arms / Streams</option>
              {availableArms.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            {/* Gender Toggle */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl text-xs font-medium text-gray-600">
              <button
                onClick={() => setSelectedGender('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedGender === 'ALL' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedGender('MALE')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedGender === 'MALE' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'hover:text-gray-900'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setSelectedGender('FEMALE')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedGender === 'FEMALE' ? 'bg-white text-pink-600 shadow-sm font-semibold' : 'hover:text-gray-900'
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-[#146ef5] mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">Loading student roster from database...</p>
            <p className="text-xs text-gray-400 mt-1">Single-database multi-tenant query</p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center px-4">
            <AcademicCapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No students found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedClassId !== 'ALL' || selectedArmId !== 'ALL' || selectedGender !== 'ALL'
                ? 'No student records match your selected filters. Try resetting the search or filter criteria.'
                : 'No students are enrolled in this institution yet. Click "Enroll New Student" to add your first pupil.'}
            </p>
            <button
              onClick={handleOpenEnrollModal}
              className="mt-4 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Enroll First Student
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Admission Number</th>
                  <th className="px-6 py-4">Class Level &amp; Arm</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Enrolled Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {students.map((student) => {
                  const isMale = student.gender === 'MALE';
                  const initials = student.student_name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isMale ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.student_name}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              ID: {student.student_id ? student.student_id.substring(0, 8) : '—'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Admission Number */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md text-[11px]">
                          {student.admission_number}
                        </span>
                      </td>

                      {/* Class Level & Arm */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5] border border-blue-100">
                              {student.arm_name || 'Class Arm'}
                            </span>
                          </div>
                          {student.class_name && (
                            <div className="text-[10px] text-gray-400">
                              {student.class_name}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isMale ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                          }`}
                        >
                          {student.gender}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {student.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Enrolled Date */}
                      <td className="px-6 py-4 text-gray-500 text-[11px]">
                        {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'Active'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteTarget(student)}
                          title="Unenroll Student"
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enroll Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Enroll New Student</h3>
                <p className="text-xs text-gray-500 mt-0.5">Register pupil into an academic class arm</p>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
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

            <form onSubmit={handleEnrollStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Class Level *</label>
                  <select
                    value={enrollForm.class_id}
                    onChange={(e) => {
                      const newClassId = e.target.value;
                      const c = classes.find((item) => item.id === newClassId);
                      const firstArm = c?.arms?.[0];
                      setEnrollForm({
                        ...enrollForm,
                        class_id: newClassId,
                        arm_id: firstArm ? firstArm.id : '',
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Class Arm / Stream *</label>
                  <select
                    required
                    value={enrollForm.arm_id}
                    onChange={(e) => setEnrollForm({ ...enrollForm, arm_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 font-semibold"
                  >
                    {modalAvailableArms.length === 0 ? (
                      <option value="">No arms available</option>
                    ) : (
                      modalAvailableArms.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.enrolled_students || 0}/{a.capacity || 35})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chukwuemeka Obi, Amina Bello, Oluwaseun Adeleke"
                  value={enrollForm.student_name}
                  onChange={(e) => setEnrollForm({ ...enrollForm, student_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.admission_number}
                    onChange={(e) => setEnrollForm({ ...enrollForm, admission_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Gender *</label>
                  <select
                    value={enrollForm.gender}
                    onChange={(e) => setEnrollForm({ ...enrollForm, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || !enrollForm.arm_id}
                  className="px-6 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-full shadow-sm shadow-[#146ef5]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    'Enroll Student'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unenroll Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Unenroll Student?</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to unenroll <span className="font-semibold text-gray-800">{deleteTarget.student_name}</span> ({deleteTarget.admission_number}) from <span className="font-semibold text-gray-800">{deleteTarget.arm_name}</span>?
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                disabled={formSubmitting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={formSubmitting}
                onClick={handleUnenrollStudent}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-rose-600/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {formSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                    Unenrolling...
                  </>
                ) : (
                  'Confirm Unenroll'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
