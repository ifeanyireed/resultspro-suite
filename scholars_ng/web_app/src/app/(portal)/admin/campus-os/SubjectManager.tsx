'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  ClockIcon,
  ChevronDownIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';

export interface SubjectRecord {
  id: string;
  tenant_id: string;
  code: string;
  title: string;
  department: string;
  category: string;
  curriculum: string;
  level_category: string;
  periods_per_week: number;
  credit_units: number;
  ca_weight: number;
  exam_weight: number;
  pass_mark: number;
  status: 'ACTIVE' | 'INACTIVE' | string;
  description: string;
  tutors_count: number;
  arms_count: number;
  assigned_tutors?: SubjectTeacherRecord[];
  assigned_arms?: ClassSubjectRecord[];
  created_at?: string;
  updated_at?: string;
}

export interface ClassSubjectRecord {
  id: string;
  tenant_id: string;
  subject_id: string;
  class_id: string;
  class_name: string;
  arm_id?: string;
  arm_name?: string;
  is_compulsory: boolean;
  created_at?: string;
}

export interface SubjectTeacherRecord {
  id: string;
  tenant_id: string;
  subject_id: string;
  arm_id?: string;
  arm_name?: string;
  teacher_id?: string;
  teacher_name: string;
  role: string;
  weekly_periods: number;
  created_at?: string;
}

const DEPARTMENTS = [
  'ALL',
  'STEM & Sciences',
  'Humanities',
  'Commercial',
  'Future Skills',
  'Languages',
  'Vocational & Trade',
  'Health & Sports',
  'Creative Arts',
];

const CURRICULUMS = [
  'ALL',
  'NERDC / WAEC / IGCSE',
  'NERDC Standard',
  'WAEC / NECO',
  'Cambridge IGCSE',
  'NERDC / BECE',
  'NERDC / WAEC Trade',
  'NERDC / PuzzlePRO',
];

const CATEGORIES = [
  'Core Compulsory',
  'Science Core',
  'Commercial Core',
  'Arts Core',
  'Elective',
  'Trade / Entrepreneurship',
  'Junior Secondary Core',
  'Social Science Core',
  'Science / Tech Core',
  'Science / Voc Core',
];

export default function SubjectManager({ onSubjectsCountChange }: { onSubjectsCountChange?: (count: number) => void }) {
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<SubjectRecord | null>(null);
  const [deleteSubjectTarget, setDeleteSubjectTarget] = useState<SubjectRecord | null>(null);

  // Allocations Sub-Modals
  const [allocationsTargetSubject, setAllocationsTargetSubject] = useState<SubjectRecord | null>(null);
  const [allocationsTab, setAllocationsTab] = useState<'tutors' | 'arms'>('tutors');
  const [assignedTutors, setAssignedTutors] = useState<SubjectTeacherRecord[]>([]);
  const [assignedArms, setAssignedArms] = useState<ClassSubjectRecord[]>([]);
  const [allocationsLoading, setAllocationsLoading] = useState<boolean>(false);

  // Form states for adding tutor
  const [newTutorName, setNewTutorName] = useState<string>('');
  const [newTutorRole, setNewTutorRole] = useState<string>('Subject Specialist');
  const [newTutorPeriods, setNewTutorPeriods] = useState<number>(4);

  // Form states for adding class arm
  const [newClassName, setNewClassName] = useState<string>('JSS 1');
  const [newArmName, setNewArmName] = useState<string>('Gold');
  const [newIsCompulsory, setNewIsCompulsory] = useState<boolean>(true);

  // Form states for Subject Add/Edit
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    department: 'STEM & Sciences',
    category: 'Core Compulsory',
    curriculum: 'NERDC / WAEC / IGCSE',
    level_category: 'ALL',
    periods_per_week: 4,
    credit_units: 3,
    ca_weight: 40,
    exam_weight: 60,
    pass_mark: 50,
    status: 'ACTIVE',
    description: '',
  });

  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Fetch subjects with strict tenant isolation and no mock fallback
  const fetchSubjects = useCallback(async (isRefresh = false) => {
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

      const res = await api.get(`/v1/campus/subjects${qs}`).catch(async () => {
        return await api.get(`/campus/subjects${qs}`);
      });

      if (res.data && res.data.subjects) {
        setSubjects(res.data.subjects);
        if (onSubjectsCountChange) {
          onSubjectsCountChange(res.data.subjects.length);
        }
      } else {
        setSubjects([]);
      }
    } catch (err: any) {
      console.error('Failed to load subjects:', err);
      // STRICT REQUIREMENT: No fallbacks! Report authoritative error to user
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Unable to load curriculum subjects from the server. Please verify database connectivity.'
      );
      setSubjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [onSubjectsCountChange]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Load allocations (teachers and class arms) for a subject
  const loadAllocations = useCallback(async (subjectId: string) => {
    setAllocationsLoading(true);
    try {
      const res = await api.get(`/v1/campus/subjects/allocations?subject_id=${subjectId}`).catch(async () => {
        return await api.get(`/campus/subjects/allocations?subject_id=${subjectId}`);
      });
      if (res.data) {
        setAssignedTutors(res.data.teachers || []);
        setAssignedArms(res.data.arms || []);
      }
    } catch (err: any) {
      console.error('Failed to load allocations:', err);
    } finally {
      setAllocationsLoading(false);
    }
  }, []);

  const openAllocationsModal = (subject: SubjectRecord, tab: 'tutors' | 'arms' = 'tutors') => {
    setAllocationsTargetSubject(subject);
    setAllocationsTab(tab);
    loadAllocations(subject.id);
  };

  const handleAddTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocationsTargetSubject || !newTutorName.trim()) return;

    try {
      await api.post('/v1/campus/subjects/allocations', {
        action: 'assign_teacher',
        subject_id: allocationsTargetSubject.id,
        teacher_name: newTutorName.trim(),
        role: newTutorRole,
        weekly_periods: Number(newTutorPeriods) || 4,
      }).catch(async () => {
        return await api.post('/campus/subjects/allocations', {
          action: 'assign_teacher',
          subject_id: allocationsTargetSubject.id,
          teacher_name: newTutorName.trim(),
          role: newTutorRole,
          weekly_periods: Number(newTutorPeriods) || 4,
        });
      });

      setNewTutorName('');
      loadAllocations(allocationsTargetSubject.id);
      fetchSubjects(true);
    } catch (err: any) {
      alert('Failed to assign teacher: ' + (err?.response?.data?.error || err.message));
    }
  };

  const handleRemoveTutor = async (tutorAllocationId: string) => {
    if (!confirm('Remove this teacher from this subject allocation?')) return;
    try {
      await api.delete(`/v1/campus/subjects/allocations?type=teacher&id=${tutorAllocationId}`).catch(async () => {
        return await api.delete(`/campus/subjects/allocations?type=teacher&id=${tutorAllocationId}`);
      });
      if (allocationsTargetSubject) {
        loadAllocations(allocationsTargetSubject.id);
        fetchSubjects(true);
      }
    } catch (err: any) {
      alert('Failed to remove teacher: ' + (err?.response?.data?.error || err.message));
    }
  };

  const handleAddArm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocationsTargetSubject) return;

    try {
      await api.post('/v1/campus/subjects/allocations', {
        action: 'assign_arm',
        subject_id: allocationsTargetSubject.id,
        class_id: newClassName.toLowerCase().replace(/\s+/g, '-'),
        class_name: newClassName,
        arm_id: `${newClassName}-${newArmName}`.toLowerCase().replace(/\s+/g, '-'),
        arm_name: `${newClassName} ${newArmName}`,
        is_compulsory: newIsCompulsory,
      }).catch(async () => {
        return await api.post('/campus/subjects/allocations', {
          action: 'assign_arm',
          subject_id: allocationsTargetSubject.id,
          class_id: newClassName.toLowerCase().replace(/\s+/g, '-'),
          class_name: newClassName,
          arm_id: `${newClassName}-${newArmName}`.toLowerCase().replace(/\s+/g, '-'),
          arm_name: `${newClassName} ${newArmName}`,
          is_compulsory: newIsCompulsory,
        });
      });

      loadAllocations(allocationsTargetSubject.id);
      fetchSubjects(true);
    } catch (err: any) {
      alert('Failed to map class arm: ' + (err?.response?.data?.error || err.message));
    }
  };

  const handleRemoveArm = async (armAllocationId: string) => {
    if (!confirm('Remove this class arm mapping?')) return;
    try {
      await api.delete(`/v1/campus/subjects/allocations?type=arm&id=${armAllocationId}`).catch(async () => {
        return await api.delete(`/campus/subjects/allocations?type=arm&id=${armAllocationId}`);
      });
      if (allocationsTargetSubject) {
        loadAllocations(allocationsTargetSubject.id);
        fetchSubjects(true);
      }
    } catch (err: any) {
      alert('Failed to remove arm: ' + (err?.response?.data?.error || err.message));
    }
  };

  // Open Add modal
  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({
      code: '',
      title: '',
      department: 'STEM & Sciences',
      category: 'Core Compulsory',
      curriculum: 'NERDC / WAEC / IGCSE',
      level_category: 'ALL',
      periods_per_week: 4,
      credit_units: 3,
      ca_weight: 40,
      exam_weight: 60,
      pass_mark: 50,
      status: 'ACTIVE',
      description: '',
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open Edit modal
  const openEditModal = (s: SubjectRecord) => {
    setEditingSubject(s);
    setFormData({
      code: s.code,
      title: s.title,
      department: s.department,
      category: s.category,
      curriculum: s.curriculum,
      level_category: s.level_category || 'ALL',
      periods_per_week: s.periods_per_week || 4,
      credit_units: s.credit_units || 3,
      ca_weight: s.ca_weight || 40,
      exam_weight: s.exam_weight || 60,
      pass_mark: s.pass_mark || 50,
      status: s.status || 'ACTIVE',
      description: s.description || '',
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Submit Add or Edit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim()) {
      setFormError('Subject code and title are required.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      if (editingSubject) {
        await api.put('/v1/campus/subjects', {
          id: editingSubject.id,
          ...formData,
        }).catch(async () => {
          return await api.put('/campus/subjects', {
            id: editingSubject.id,
            ...formData,
          });
        });
        setBannerSuccess(`Subject "${formData.title}" updated successfully.`);
      } else {
        await api.post('/v1/campus/subjects', formData).catch(async () => {
          return await api.post('/campus/subjects', formData);
        });
        setBannerSuccess(`Subject "${formData.title}" registered successfully.`);
      }

      setIsAddModalOpen(false);
      fetchSubjects(true);
      setTimeout(() => setBannerSuccess(null), 4000);
    } catch (err: any) {
      setFormError(err?.response?.data?.error || err.message || 'Operation failed. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete subject
  const handleDeleteConfirm = async () => {
    if (!deleteSubjectTarget) return;

    try {
      await api.delete(`/v1/campus/subjects?id=${deleteSubjectTarget.id}`).catch(async () => {
        return await api.delete(`/campus/subjects?id=${deleteSubjectTarget.id}`);
      });
      setBannerSuccess(`Subject "${deleteSubjectTarget.title}" deleted.`);
      setDeleteSubjectTarget(null);
      fetchSubjects(true);
      setTimeout(() => setBannerSuccess(null), 4000);
    } catch (err: any) {
      alert('Failed to delete subject: ' + (err?.response?.data?.error || err.message));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!subjects.length) return;
    const headers = ['Code', 'Title', 'Department', 'Category', 'Curriculum', 'Level', 'Periods/Wk', 'Credits', 'CA Weight', 'Exam Weight', 'Pass Mark', 'Status', 'Tutors Count'];
    const rows = filteredSubjects.map((s) => [
      `"${s.code}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.department}"`,
      `"${s.category}"`,
      `"${s.curriculum}"`,
      `"${s.level_category}"`,
      s.periods_per_week,
      s.credit_units,
      s.ca_weight,
      s.exam_weight,
      s.pass_mark,
      `"${s.status}"`,
      s.tutors_count,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `curriculum_subjects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      // Dept filter
      if (selectedDept !== 'ALL' && s.department !== selectedDept) {
        return false;
      }
      // Curriculum filter
      if (selectedCurriculum !== 'ALL' && !s.curriculum.toLowerCase().includes(selectedCurriculum.toLowerCase())) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'ALL' && s.level_category !== 'ALL' && s.level_category !== selectedLevel) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchCode = s.code.toLowerCase().includes(q);
        const matchDept = s.department.toLowerCase().includes(q);
        const matchCurr = s.curriculum.toLowerCase().includes(q);
        return matchTitle || matchCode || matchDept || matchCurr;
      }
      return true;
    });
  }, [subjects, selectedDept, selectedCurriculum, selectedLevel, searchTerm]);

  // Department counts
  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: subjects.length };
    subjects.forEach((s) => {
      counts[s.department] = (counts[s.department] || 0) + 1;
    });
    return counts;
  }, [subjects]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = subjects.length;
    const stem = subjects.filter((s) => s.department === 'STEM & Sciences').length;
    const core = subjects.filter((s) => s.category.includes('Core')).length;
    const totalPeriods = subjects.reduce((acc, curr) => acc + (curr.periods_per_week || 0), 0);
    return { total, stem, core, totalPeriods };
  }, [subjects]);

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {bannerSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Action Hub */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Curriculum Subjects &amp; Allocation</h2>
            <span className="bg-blue-50 text-[#146ef5] border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Persistent DB
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            NERDC, WAEC/NECO, and Cambridge IGCSE subjects with department classification, credit units, and teacher assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchSubjects(true)}
            disabled={refreshing || loading}
            title="Refresh from server"
            className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!subjects.length}
            className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={openAddModal}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Subject
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Registered Subjects</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">STEM &amp; Sciences</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#146ef5]">{stats.stem}</span>
            <span className="text-[10px] font-semibold text-gray-400">Practicals &amp; Labs</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Core Compulsory</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{stats.core}</span>
            <span className="text-[10px] font-semibold text-gray-400">All Students</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-gray-500">Total Weekly Periods</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-700">{stats.totalPeriods}</span>
            <span className="text-[10px] font-semibold text-gray-400">Timetable Load</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, title, or department..."
              className="w-full bg-gray-50 border border-gray-200 text-xs rounded-full pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Curriculum & Level Selectors */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="text-gray-400 font-medium">Curriculum:</span>
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs rounded-full px-3 py-1.5 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                {CURRICULUMS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="text-gray-400 font-medium">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs rounded-full px-3 py-1.5 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                <option value="ALL">All Levels</option>
                <option value="JUNIOR_SECONDARY">Junior Secondary (JSS)</option>
                <option value="SENIOR_SECONDARY">Senior Secondary (SSS)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DEPARTMENTS.map((dept) => {
            const active = selectedDept === dept;
            const count = deptCounts[dept] || 0;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#146ef5] text-white shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <span>{dept}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Authoritative Error State (STRICT: NO MOCK FALLBACKS) */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
              <ExclamationTriangleIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Database Connectivity / Retrieval Issue</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchSubjects()}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition-colors cursor-pointer self-end sm:self-auto"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-[1.5rem] p-12 border border-gray-100 shadow-sm text-center">
          <div className="w-8 h-8 border-2 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-gray-500">Querying institutional curriculum database...</p>
        </div>
      )}

      {/* Main Subjects Table */}
      {!loading && !error && (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {filteredSubjects.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-12 h-12 bg-blue-50 text-[#146ef5] rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No subjects found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                {searchTerm || selectedDept !== 'ALL' || selectedCurriculum !== 'ALL' || selectedLevel !== 'ALL'
                  ? 'No registered subjects matched your current search and filter criteria.'
                  : 'No curriculum subjects have been registered for this school tenant yet.'}
              </p>
              {searchTerm || selectedDept !== 'ALL' || selectedCurriculum !== 'ALL' || selectedLevel !== 'ALL' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDept('ALL');
                    setSelectedCurriculum('ALL');
                    setSelectedLevel('ALL');
                  }}
                  className="text-xs font-semibold text-[#146ef5] hover:underline"
                >
                  Clear all filters
                </button>
              ) : (
                <button
                  onClick={openAddModal}
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition-all inline-flex items-center gap-1.5"
                >
                  <PlusIcon className="w-4 h-4" />
                  Register First Subject
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-5 py-3.5">Code</th>
                    <th className="px-5 py-3.5">Subject Title</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Curriculum</th>
                    <th className="px-5 py-3.5 text-center">Load</th>
                    <th className="px-5 py-3.5 text-center">Weight</th>
                    <th className="px-5 py-3.5">Assigned Tutors</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredSubjects.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Code */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#146ef5] bg-blue-50 px-2 py-1 rounded-md text-[11px]">
                          {s.code}
                        </span>
                      </td>

                      {/* Title & Desc */}
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-900 group-hover:text-[#146ef5] transition-colors">
                          {s.title}
                        </div>
                        {s.description && (
                          <div className="text-[10px] text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                            {s.description}
                          </div>
                        )}
                      </td>

                      {/* Department */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-gray-700 font-medium">
                          {s.department}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.category.includes('Core')
                            ? 'bg-blue-50 text-[#146ef5] border border-blue-200/50'
                            : s.category.includes('Trade')
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {s.category}
                        </span>
                      </td>

                      {/* Curriculum */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-500 font-medium">
                        {s.curriculum}
                      </td>

                      {/* Load: Periods & Credits */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <div className="font-semibold text-gray-800">{s.periods_per_week} pds/wk</div>
                        <div className="text-[10px] text-gray-400">{s.credit_units} Units</div>
                      </td>

                      {/* Weight: CA / Exam */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <span className="font-mono font-semibold text-gray-700">
                          {s.ca_weight}/{s.exam_weight}
                        </span>
                        <div className="text-[10px] text-gray-400">Pass: {s.pass_mark}%</div>
                      </td>

                      {/* Assigned Tutors */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openAllocationsModal(s, 'tutors')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-blue-50 hover:text-[#146ef5] text-gray-700 transition-colors cursor-pointer group/btn"
                        >
                          <UserGroupIcon className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-[#146ef5]" />
                          <span>{s.tutors_count} {s.tutors_count === 1 ? 'Tutor' : 'Tutors'}</span>
                          <span className="text-[10px] text-gray-400">→</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openAllocationsModal(s, 'arms')}
                            title="Class Arm Mappings"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <BuildingLibraryIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(s)}
                            title="Edit Subject"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#146ef5] hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteSubjectTarget(s)}
                            title="Delete Subject"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. ADD / EDIT SUBJECT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingSubject ? `Edit Subject · ${editingSubject.code}` : 'Register New Curriculum Subject'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Institutional course metadata, examination weights, and period parameters.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Code */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. MTH-101, PHY-201"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Subject Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. General Mathematics"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Department */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
                  >
                    {DEPARTMENTS.filter((d) => d !== 'ALL').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category / Stream</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Curriculum */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Curriculum Standard</label>
                  <select
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
                  >
                    {CURRICULUMS.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Level Category */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Level Applicability</label>
                  <select
                    value={formData.level_category}
                    onChange={(e) => setFormData({ ...formData, level_category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
                  >
                    <option value="ALL">All Levels (JSS &amp; SSS)</option>
                    <option value="JUNIOR_SECONDARY">Junior Secondary (JSS 1 - JSS 3)</option>
                    <option value="SENIOR_SECONDARY">Senior Secondary (SS 1 - SS 3)</option>
                  </select>
                </div>
              </div>

              {/* Teaching Periods & Credit Units */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Periods / Wk</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.periods_per_week}
                    onChange={(e) => setFormData({ ...formData, periods_per_week: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Credit Units</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.credit_units}
                    onChange={(e) => setFormData({ ...formData, credit_units: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">CA % Weight</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.ca_weight}
                    onChange={(e) => {
                      const ca = Number(e.target.value);
                      setFormData({ ...formData, ca_weight: ca, exam_weight: Math.max(0, 100 - ca) });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Exam % Weight</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.exam_weight}
                    onChange={(e) => {
                      const exam = Number(e.target.value);
                      setFormData({ ...formData, exam_weight: exam, ca_weight: Math.max(0, 100 - exam) });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 font-semibold"
                  />
                </div>
              </div>

              {/* Pass mark and status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Pass Mark Benchmark (%)</label>
                  <input
                    type="number"
                    min={30}
                    max={100}
                    value={formData.pass_mark}
                    onChange={(e) => setFormData({ ...formData, pass_mark: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Syllabus Overview</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline topics, laboratory prerequisites, or learning objectives..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold px-5 py-2 rounded-full shadow-sm shadow-[#146ef5]/20 disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving to Database...' : editingSubject ? 'Update Subject' : 'Register Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ALLOCATIONS MODAL (Tutors & Class Arms) */}
      {/* ------------------------------------------------------------- */}
      {allocationsTargetSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#146ef5] bg-blue-50 px-2 py-0.5 rounded">
                    {allocationsTargetSubject.code}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{allocationsTargetSubject.title}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage educator assignments and classroom arm offerings.
                </p>
              </div>
              <button
                onClick={() => setAllocationsTargetSubject(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switch inside modal */}
            <div className="flex items-center gap-2 mt-4 mb-4 border-b border-gray-100 pb-2">
              <button
                type="button"
                onClick={() => setAllocationsTab('tutors')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  allocationsTab === 'tutors'
                    ? 'bg-[#146ef5] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                Assigned Tutors ({assignedTutors.length})
              </button>
              <button
                type="button"
                onClick={() => setAllocationsTab('arms')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  allocationsTab === 'arms'
                    ? 'bg-[#146ef5] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                Mapped Class Arms ({assignedArms.length})
              </button>
            </div>

            {/* Content for Tutors Tab */}
            {allocationsTab === 'tutors' && (
              <div className="space-y-4">
                <form onSubmit={handleAddTutor} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                  <h4 className="font-bold text-gray-800 mb-2">Assign Educator to {allocationsTargetSubject.title}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={newTutorName}
                      onChange={(e) => setNewTutorName(e.target.value)}
                      placeholder="Educator full name (e.g. Dr. Samuel Eze)"
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                    />
                    <input
                      type="text"
                      value={newTutorRole}
                      onChange={(e) => setNewTutorRole(e.target.value)}
                      placeholder="Role (e.g. HOD Science, Lead Tutor)"
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={newTutorPeriods}
                        onChange={(e) => setNewTutorPeriods(Number(e.target.value))}
                        title="Weekly teaching periods"
                        className="w-20 bg-white border border-gray-200 rounded-xl px-2 py-2 text-gray-900 font-semibold"
                      />
                      <button
                        type="submit"
                        className="flex-1 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-xl px-3 py-2"
                      >
                        + Assign
                      </button>
                    </div>
                  </div>
                </form>

                {allocationsLoading ? (
                  <p className="text-center py-6 text-xs text-gray-400">Loading educators...</p>
                ) : assignedTutors.length === 0 ? (
                  <p className="text-center py-6 text-xs text-gray-400">
                    No tutors currently assigned to this subject. Add an educator above.
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {assignedTutors.map((t) => (
                      <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-gray-900">{t.teacher_name}</div>
                          <div className="text-[10px] text-gray-400">{t.role} · {t.weekly_periods} Periods/wk</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTutor(t.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 hover:bg-red-50 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content for Class Arms Tab */}
            {allocationsTab === 'arms' && (
              <div className="space-y-4">
                <form onSubmit={handleAddArm} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                  <h4 className="font-bold text-gray-800 mb-2">Map Subject to Classroom Arm</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                    >
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SSS 1">SSS 1</option>
                      <option value="SSS 2">SSS 2</option>
                      <option value="SSS 3">SSS 3</option>
                    </select>

                    <input
                      type="text"
                      required
                      value={newArmName}
                      onChange={(e) => setNewArmName(e.target.value)}
                      placeholder="Arm name (e.g. Gold, Science 1)"
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                    />

                    <button
                      type="submit"
                      className="bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-xl px-3 py-2"
                    >
                      + Map Arm
                    </button>
                  </div>
                </form>

                {allocationsLoading ? (
                  <p className="text-center py-6 text-xs text-gray-400">Loading mapped arms...</p>
                ) : assignedArms.length === 0 ? (
                  <p className="text-center py-6 text-xs text-gray-400">
                    No class arms mapped to this subject yet.
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {assignedArms.map((a) => (
                      <div key={a.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-gray-900">{a.class_name} · {a.arm_name}</div>
                          <div className="text-[10px] text-gray-400">
                            {a.is_compulsory ? 'Compulsory Subject for this Arm' : 'Elective Choice'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveArm(a.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 hover:bg-red-50 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setAllocationsTargetSubject(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-full"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {deleteSubjectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrashIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Delete Subject?</h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              Are you sure you want to delete <span className="font-bold text-gray-800">{deleteSubjectTarget.code} · {deleteSubjectTarget.title}</span>?
              This will also unassign associated tutors and class arm allocations from the database.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteSubjectTarget(null)}
                className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2 rounded-full shadow-sm"
              >
                Yes, Delete Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
