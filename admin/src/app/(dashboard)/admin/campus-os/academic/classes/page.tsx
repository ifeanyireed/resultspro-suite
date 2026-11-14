'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Users,
  Building2,
  UserCheck,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  X,
  UserPlus
} from 'lucide-react';
import {
  fetchCampusClasses,
  createCampusClass,
  deleteCampusClass,
  createCampusArm,
  updateCampusArm,
  deleteCampusArm,
  fetchArmStudents,
  enrollStudentInArm,
  CampusClass,
  CampusClassArm,
  CampusArmStudent,
  getActiveTenantId
} from '@/lib/campus-api';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@/components/ui/Cards';

export default function AcademicClassesPage() {
  const [classes, setClasses] = useState<CampusClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isArmModalOpen, setIsArmModalOpen] = useState(false);
  const [isEditArmModalOpen, setIsEditArmModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);

  // Active Selected Entity for Modals
  const [targetClassId, setTargetClassId] = useState('');
  const [selectedArm, setSelectedArm] = useState<CampusClassArm | null>(null);
  const [armStudents, setArmStudents] = useState<CampusArmStudent[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  // Forms State
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    level_order: 1,
    category: 'JUNIOR_SECONDARY',
    curriculum: 'NERDC Standard (Universal Basic Education)',
    description: '',
  });

  const [newArmForm, setNewArmForm] = useState({
    name: '',
    arm_code: '',
    room_number: '',
    form_teacher_name: '',
    capacity: 35,
  });

  const [editArmForm, setEditArmForm] = useState({
    id: '',
    name: '',
    arm_code: '',
    room_number: '',
    form_teacher_name: '',
    capacity: 35,
    status: 'ACTIVE',
  });

  const [newStudentForm, setNewStudentForm] = useState({
    student_name: '',
    admission_number: '',
    gender: 'MALE',
  });
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchCampusClasses();
      setClasses(data);
    } catch (err: any) {
      console.error('[CampusPRO] Failed to load classes:', err);
      setErrorMessage(err?.message || 'Failed to load classes from database.');
    } finally {
      setLoading(false);
    }
  }

  // --- Handlers: Class Level ---
  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassForm.name.trim()) return;
    try {
      await createCampusClass(newClassForm);
      setIsClassModalOpen(false);
      setNewClassForm({
        name: '',
        level_order: classes.length + 1,
        category: 'JUNIOR_SECONDARY',
        curriculum: 'NERDC Standard (Universal Basic Education)',
        description: '',
      });
      await loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Error creating class');
    }
  }

  async function handleDeleteClass(classId: string, name: string) {
    if (!confirm(`Are you sure you want to delete class level "${name}" and all its arms? This action is permanent.`)) {
      return;
    }
    try {
      await deleteCampusClass(classId);
      await loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Error deleting class');
    }
  }

  // --- Handlers: Arms ---
  function openAddArmModal(classId: string) {
    setTargetClassId(classId);
    setNewArmForm({
      name: '',
      arm_code: '',
      room_number: '',
      form_teacher_name: '',
      capacity: 35,
    });
    setIsArmModalOpen(true);
  }

  async function handleCreateArm(e: React.FormEvent) {
    e.preventDefault();
    if (!newArmForm.name.trim() || !targetClassId) return;
    try {
      await createCampusArm({
        class_id: targetClassId,
        ...newArmForm,
      });
      setIsArmModalOpen(false);
      await loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Error creating arm');
    }
  }

  function openEditArmModal(arm: CampusClassArm) {
    setSelectedArm(arm);
    setEditArmForm({
      id: arm.id,
      name: arm.name,
      arm_code: arm.arm_code || '',
      room_number: arm.room_number || '',
      form_teacher_name: arm.form_teacher_name || '',
      capacity: arm.capacity || 35,
      status: arm.status || 'ACTIVE',
    });
    setIsEditArmModalOpen(true);
  }

  async function handleUpdateArm(e: React.FormEvent) {
    e.preventDefault();
    if (!editArmForm.id) return;
    try {
      await updateCampusArm(editArmForm);
      setIsEditArmModalOpen(false);
      await loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Error updating arm');
    }
  }

  async function handleDeleteArm(armId: string, name: string) {
    if (!confirm(`Delete arm "${name}"? Associated timetables and rosters will be removed.`)) {
      return;
    }
    try {
      await deleteCampusArm(armId);
      await loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Error deleting arm');
    }
  }

  // --- Handlers: Roster ---
  async function openRosterModal(arm: CampusClassArm) {
    setSelectedArm(arm);
    setIsRosterModalOpen(true);
    setIsEnrollFormOpen(false);
    setNewStudentForm({
      student_name: '',
      admission_number: `ADM-2026-${arm.arm_code || 'ARM'}-${Math.floor(100 + Math.random() * 900)}`,
      gender: 'MALE',
    });
    setRosterLoading(true);
    try {
      const students = await fetchArmStudents(arm.id);
      setArmStudents(students);
    } catch (err) {
      console.error(err);
      setArmStudents([]);
    } finally {
      setRosterLoading(false);
    }
  }

  async function handleEnrollStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedArm || !newStudentForm.student_name.trim()) return;
    try {
      await enrollStudentInArm({
        arm_id: selectedArm.id,
        student_name: newStudentForm.student_name.trim(),
        admission_number: newStudentForm.admission_number,
        gender: newStudentForm.gender,
      });
      // Refresh students
      const updated = await fetchArmStudents(selectedArm.id);
      setArmStudents(updated);
      setIsEnrollFormOpen(false);
      setNewStudentForm({
        student_name: '',
        admission_number: `ADM-2026-${selectedArm.arm_code || 'ARM'}-${Math.floor(100 + Math.random() * 900)}`,
        gender: 'MALE',
      });
      await loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Failed to enroll student');
    }
  }

  // --- Calculations ---
  const totalClassesCount = classes.length;
  const totalArmsCount = classes.reduce((sum, c) => sum + (c.arms ? c.arms.length : 0), 0);
  const totalStudentsEnrolled = classes.reduce((sum, c) => sum + (c.total_pupils || 0), 0);
  const totalCapacity = classes.reduce((sum, c) => {
    return sum + (c.arms ? c.arms.reduce((aSum, arm) => aSum + (arm.capacity || 0), 0) : 0);
  }, 0);
  const utilizationRate = totalCapacity > 0 ? Math.round((totalStudentsEnrolled / totalCapacity) * 100) : 0;

  // Filtered Classes
  const filteredClasses = classes.filter((cls) => {
    const matchesCategory =
      selectedCategory === 'ALL' || cls.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.curriculum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.arms?.some(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.form_teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.room_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Top Banner / Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Academic Architecture &amp; Roster Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Classes, Arms &amp; Student Rosters
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure academic class levels, arm/stream allocations, assign form teachers, and manage real-time enrollments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsClassModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Class Level</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientMetricCard
          title="Total Enrolled Students"
          value={loading ? '...' : totalStudentsEnrolled.toLocaleString()}
          subtitle={`Across ${totalArmsCount} active arms`}
          trend="+8.4% YoY"
          icon={GraduationCap}
        />
        <WhiteMetricCard
          title="Master Class Levels"
          value={loading ? '...' : totalClassesCount.toString()}
          subtitle="NERDC & WAEC accredited"
          trend="JSS 1 - SSS 3"
          trendColor="green"
          icon={Layers}
        />
        <WhiteMetricCard
          title="Active Arms & Streams"
          value={loading ? '...' : totalArmsCount.toString()}
          subtitle="Assigned to Form Masters"
          trend="100% Staffed"
          trendColor="green"
          icon={Users}
        />
        <WhiteMetricCard
          title="Campus Capacity Utilization"
          value={loading ? '...' : `${utilizationRate}%`}
          subtitle={`${totalStudentsEnrolled} of ${totalCapacity} available seats`}
          trend={utilizationRate > 90 ? 'Near Capacity' : 'Optimal'}
          trendColor={utilizationRate > 90 ? 'yellow' : 'green'}
          icon={Building2}
        />
      </div>

      {/* Error banner if database query fails */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Controls Bar: Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search class level, arm name, form master, or room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Levels' },
            { id: 'JUNIOR_SECONDARY', label: 'Junior Sec (JSS)' },
            { id: 'SENIOR_SECONDARY', label: 'Senior Sec (SSS)' },
            { id: 'PRIMARY', label: 'Primary' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Classes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No class levels matched your filter criteria or none have been provisioned yet for this tenant.
          </p>
          <button
            onClick={() => setIsClassModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Class Level</span>
          </button>
        </div>
      ) : (
        /* Classes & Arms Architecture List */
        <div className="space-y-6">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Class Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/60 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {cls.name.replace(/\s+/g, '')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                        {cls.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cls.curriculum} • <span className="font-semibold text-slate-700">{cls.total_arms || cls.arms?.length || 0} Active Arms</span> • <span className="font-semibold text-emerald-700">{cls.total_pupils || 0} Students</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAddArmModal(cls.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Arm</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Class Level"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arms Grid */}
              <div className="p-6">
                {!cls.arms || cls.arms.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <p className="text-xs text-slate-500">
                      No arms configured for {cls.name}. Click &quot;Add Arm&quot; to assign streams (e.g. Gold, Diamond, Science).
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cls.arms.map((arm) => {
                      const armUtil = arm.capacity > 0 ? Math.round((arm.enrolled_students / arm.capacity) * 100) : 0;
                      return (
                        <div
                          key={arm.id}
                          className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
                        >
                          <div>
                            {/* Arm Top Row */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {cls.name} {arm.name}
                                  </h4>
                                  {arm.arm_code && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                                      {arm.arm_code}
                                    </span>
                                  )}
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                  <Building2 className="w-3 h-3 text-slate-400" />
                                  <span>{arm.room_number || 'Room unassigned'}</span>
                                </span>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  arm.status === 'ACTIVE'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {arm.status}
                              </span>
                            </div>

                            {/* Form Teacher Details */}
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                Form Master / Class Teacher
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 font-semibold truncate">
                                <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="truncate">{arm.form_teacher_name || 'Unassigned'}</span>
                              </div>
                            </div>

                            {/* Capacity Utilization Bar */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                                <span>Enrolled: {arm.enrolled_students} / {arm.capacity}</span>
                                <span className={armUtil >= 95 ? 'text-amber-600 font-bold' : 'text-slate-500'}>
                                  {armUtil}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    armUtil >= 95
                                      ? 'bg-amber-500'
                                      : armUtil >= 80
                                      ? 'bg-blue-600'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(armUtil, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Arm Action Footer */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => openRosterModal(arm)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Roster</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditArmModal(arm)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit Arm Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteArm(arm.id, `${cls.name} ${arm.name}`)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Arm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: CREATE CLASS LEVEL ================= */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Class Level</h3>
              </div>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JSS 1, SSS 2, Basic 5"
                  value={newClassForm.name}
                  onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Level Sequence Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newClassForm.level_order}
                    onChange={(e) => setNewClassForm({ ...newClassForm, level_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Category
                  </label>
                  <select
                    value={newClassForm.category}
                    onChange={(e) => setNewClassForm({ ...newClassForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="JUNIOR_SECONDARY">Junior Secondary (JSS)</option>
                    <option value="SENIOR_SECONDARY">Senior Secondary (SSS)</option>
                    <option value="PRIMARY">Primary / Basic</option>
                    <option value="TERTIARY">Tertiary Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Curriculum Track / Standard
                </label>
                <input
                  type="text"
                  placeholder="e.g. NERDC Standard (Universal Basic Education)"
                  value={newClassForm.curriculum}
                  onChange={(e) => setNewClassForm({ ...newClassForm, curriculum: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional notes regarding syllabus, exam boards, or requirements..."
                  value={newClassForm.description}
                  onChange={(e) => setNewClassForm({ ...newClassForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Save Class Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE ARM / STREAM ================= */}
      {isArmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Add Arm / Section</h3>
              </div>
              <button
                onClick={() => setIsArmModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateArm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Arm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gold, Diamond, Science A"
                    value={newArmForm.name}
                    onChange={(e) => setNewArmForm({ ...newArmForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Arm Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JSS1-GLD"
                    value={newArmForm.arm_code}
                    onChange={(e) => setNewArmForm({ ...newArmForm, arm_code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Form Master / Class Teacher
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mrs. Ngozi Okafor, Engr. D. Adeleke"
                  value={newArmForm.form_teacher_name}
                  onChange={(e) => setNewArmForm({ ...newArmForm, form_teacher_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Room / Hall Allocation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 101, Hall 3A"
                    value={newArmForm.room_number}
                    onChange={(e) => setNewArmForm({ ...newArmForm, room_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newArmForm.capacity}
                    onChange={(e) => setNewArmForm({ ...newArmForm, capacity: parseInt(e.target.value) || 35 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsArmModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Create Arm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ARM ================= */}
      {isEditArmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Edit Class Arm</h3>
              </div>
              <button
                onClick={() => setIsEditArmModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateArm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Arm Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editArmForm.name}
                    onChange={(e) => setEditArmForm({ ...editArmForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Arm Code
                  </label>
                  <input
                    type="text"
                    value={editArmForm.arm_code}
                    onChange={(e) => setEditArmForm({ ...editArmForm, arm_code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Form Master / Class Teacher
                </label>
                <input
                  type="text"
                  value={editArmForm.form_teacher_name}
                  onChange={(e) => setEditArmForm({ ...editArmForm, form_teacher_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Room / Hall Number
                  </label>
                  <input
                    type="text"
                    value={editArmForm.room_number}
                    onChange={(e) => setEditArmForm({ ...editArmForm, room_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={editArmForm.capacity}
                    onChange={(e) => setEditArmForm({ ...editArmForm, capacity: parseInt(e.target.value) || 35 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditArmModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ARM ROSTER ================= */}
      {isRosterModalOpen && selectedArm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Roster Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {selectedArm.arm_code || 'ARM'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedArm.class_name ? `${selectedArm.class_name} ` : ''}{selectedArm.name} — Class Roster
                  </h3>
                  <p className="text-xs text-slate-500">
                    Form Master: <span className="font-semibold text-slate-700">{selectedArm.form_teacher_name || 'Unassigned'}</span> • {selectedArm.room_number || 'Room TBD'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRosterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Bar inside Roster */}
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {armStudents.length} Students Enrolled ({selectedArm.capacity} max capacity)
              </span>
              <button
                onClick={() => setIsEnrollFormOpen(!isEnrollFormOpen)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isEnrollFormOpen ? 'Cancel' : 'Enroll Student'}</span>
              </button>
            </div>

            {/* Enroll New Student Inline Box */}
            {isEnrollFormOpen && (
              <form onSubmit={handleEnrollStudent} className="p-4 bg-blue-50/70 border-b border-blue-200/60 space-y-3">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Quick Enroll Student into {selectedArm.name}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Student Name *"
                    value={newStudentForm.student_name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, student_name: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Admission Number"
                    value={newStudentForm.admission_number}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, admission_number: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newStudentForm.gender}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, gender: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex-1"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Students Table */}
            <div className="flex-1 overflow-y-auto p-6">
              {rosterLoading ? (
                <div className="py-12 text-center text-xs text-slate-500 animate-pulse">
                  Loading student roster from database...
                </div>
              ) : armStudents.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No students currently enrolled in this arm.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Enroll Student&quot; above to add pupils.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Admission No</th>
                        <th className="py-2.5 px-3">Gender</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {armStudents.map((st, idx) => (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{st.student_name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{st.admission_number}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                st.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {st.gender}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{st.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Roster Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsRosterModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
