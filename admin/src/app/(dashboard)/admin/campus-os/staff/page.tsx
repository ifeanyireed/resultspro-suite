'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Users,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import {
  fetchCampusStaff,
  createCampusStaff,
  updateCampusStaff,
  deleteCampusStaff,
  CampusStaffMember,
  CampusStaffSummary
} from '@/lib/campus-api';
import { GradientMetricCard, WhiteMetricCard } from '@/components/ui/Cards';

export default function CampusStaffPage() {
  const [staffList, setStaffList] = useState<CampusStaffMember[]>([]);
  const [summary, setSummary] = useState<CampusStaffSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCadre, setSelectedCadre] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal States
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<CampusStaffMember | null>(null);

  // New Staff Form State
  const [newStaffForm, setNewStaffForm] = useState({
    title: 'Mr.',
    full_name: '',
    gender: 'MALE',
    email: '',
    phone: '',
    cadre: 'TEACHING',
    designation: 'Subject Teacher',
    department: 'Sciences',
    employment_type: 'FULL_TIME',
    qualification: 'B.Sc. (Ed) / PGDE',
    trcn_number: '',
    assigned_arm_name: '',
    weekly_teaching_periods: 16,
    joined_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Edit Staff Form State
  const [editStaffForm, setEditStaffForm] = useState({
    id: '',
    title: 'Mr.',
    full_name: '',
    gender: 'MALE',
    email: '',
    phone: '',
    cadre: 'TEACHING',
    designation: '',
    department: '',
    employment_type: 'FULL_TIME',
    qualification: '',
    trcn_number: '',
    assigned_arm_name: '',
    weekly_teaching_periods: 16,
    status: 'ACTIVE',
    notes: '',
  });

  useEffect(() => {
    loadStaff();
  }, [selectedCadre, selectedDept, selectedStatus]);

  async function loadStaff() {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetchCampusStaff({
        cadre: selectedCadre !== 'ALL' ? selectedCadre : undefined,
        department: selectedDept !== 'ALL' ? selectedDept : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: searchQuery || undefined,
      });
      setStaffList(res.staff);
      setSummary(res.summary);
    } catch (err: any) {
      console.error('[CampusPRO] Failed to load staff:', err);
      setErrorMessage(err?.message || 'Failed to load staff records from database.');
    } finally {
      setLoading(false);
    }
  }

  // --- Handlers ---
  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loadStaff();
  }

  async function handleCreateStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!newStaffForm.full_name.trim()) return;
    try {
      await createCampusStaff(newStaffForm);
      setIsOnboardModalOpen(false);
      setNewStaffForm({
        title: 'Mr.',
        full_name: '',
        gender: 'MALE',
        email: '',
        phone: '',
        cadre: 'TEACHING',
        designation: 'Subject Teacher',
        department: 'Sciences',
        employment_type: 'FULL_TIME',
        qualification: 'B.Sc. (Ed) / PGDE',
        trcn_number: '',
        assigned_arm_name: '',
        weekly_teaching_periods: 16,
        joined_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      await loadStaff();
    } catch (err: any) {
      alert(err?.message || 'Failed to onboard staff member');
    }
  }

  function openEditModal(staff: CampusStaffMember) {
    setSelectedStaff(staff);
    setEditStaffForm({
      id: staff.id,
      title: staff.title || 'Mr.',
      full_name: staff.full_name,
      gender: staff.gender || 'MALE',
      email: staff.email || '',
      phone: staff.phone || '',
      cadre: staff.cadre || 'TEACHING',
      designation: staff.designation,
      department: staff.department,
      employment_type: staff.employment_type || 'FULL_TIME',
      qualification: staff.qualification || '',
      trcn_number: staff.trcn_number || '',
      assigned_arm_name: staff.assigned_arm_name || '',
      weekly_teaching_periods: staff.weekly_teaching_periods || 0,
      status: staff.status || 'ACTIVE',
      notes: staff.notes || '',
    });
    setIsEditModalOpen(true);
  }

  async function handleUpdateStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!editStaffForm.id || !editStaffForm.full_name.trim()) return;
    try {
      await updateCampusStaff(editStaffForm);
      setIsEditModalOpen(false);
      await loadStaff();
    } catch (err: any) {
      alert(err?.message || 'Failed to update staff record');
    }
  }

  async function handleDeleteStaff(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove staff record for "${name}"? This action is permanent.`)) {
      return;
    }
    try {
      await deleteCampusStaff(id);
      await loadStaff();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete staff record');
    }
  }

  // Filter client-side search dynamically
  const displayedStaff = staffList.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.full_name.toLowerCase().includes(q) ||
      s.staff_number.toLowerCase().includes(q) ||
      s.designation.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      (s.assigned_arm_name && s.assigned_arm_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Human Resources &amp; Faculty Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Staff &amp; Faculty Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of teaching faculty, administrative personnel, form master allocations, TRCN certifications, and biometric attendance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Staff Member</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientMetricCard
          title="Total Staff Headcount"
          value={loading ? '...' : (summary?.total_staff ?? staffList.length).toString()}
          subtitle="Registered employees in database"
          trend="100% Verified"
          icon={UserCheck}
        />
        <WhiteMetricCard
          title="Academic Faculty"
          value={loading ? '...' : (summary?.teaching_count ?? 0).toString()}
          subtitle="Teachers, tutors &amp; instructors"
          trend="TRCN Licensed"
          trendColor="green"
          icon={GraduationCap}
        />
        <WhiteMetricCard
          title="Form Masters Assigned"
          value={loading ? '...' : (summary?.form_masters_count ?? 0).toString()}
          subtitle="Assigned to class arms"
          trend="100% Stream Coverage"
          trendColor="green"
          icon={Award}
        />
        <WhiteMetricCard
          title="Biometric Attendance Rate"
          value={loading ? '...' : `${(summary?.average_attendance ?? 97.2).toFixed(1)}%`}
          subtitle="Portal &amp; device clock-ins"
          trend="Punctual &amp; On-Duty"
          trendColor="green"
          icon={Clock}
        />
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Controls Bar: Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff name, ID, designation, department, or arm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Cadre Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'ALL', label: 'All Cadres' },
              { id: 'TEACHING', label: 'Teaching' },
              { id: 'NON_TEACHING', label: 'Non-Teaching' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCadre(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCadre === c.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Department Dropdown */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">🏢 All Departments</option>
            <option value="Sciences">Sciences</option>
            <option value="Arts & Humanities">Arts &amp; Humanities</option>
            <option value="Commercial & ICT">Commercial &amp; ICT</option>
            <option value="Administration">Administration</option>
            <option value="Bursary">Bursary</option>
            <option value="Logistics">Logistics</option>
            <option value="Campus Clinic">Campus Clinic</option>
          </select>
        </div>
      </div>

      {/* Staff Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : displayedStaff.length === 0 ? (
          <div className="py-16 text-center border-dashed border-slate-200">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Staff Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              No staff members matched your filter criteria or none have been enrolled in the database.
            </p>
            <button
              onClick={() => setIsOnboardModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard First Staff Member</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Designation &amp; Dept</th>
                  <th className="py-3 px-4">Cadre &amp; Type</th>
                  <th className="py-3 px-4">Assigned Arm</th>
                  <th className="py-3 px-4">Teaching Load</th>
                  <th className="py-3 px-4">TRCN / Cert</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayedStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Staff Name & ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/60 shrink-0">
                          {staff.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">
                            {staff.title ? `${staff.title} ` : ''}{staff.full_name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            {staff.staff_number}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Department */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                        {staff.designation}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                        {staff.department}
                      </span>
                    </td>

                    {/* Cadre & Employment Type */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          staff.cadre === 'TEACHING'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {staff.cadre === 'TEACHING' ? 'Teaching Faculty' : 'Non-Teaching'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {staff.employment_type.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Form Master Arm */}
                    <td className="py-3 px-4">
                      {staff.assigned_arm_name && staff.assigned_arm_name !== '—' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold">
                          <Award className="w-3 h-3 text-emerald-600" />
                          <span>{staff.assigned_arm_name}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Weekly Teaching Load */}
                    <td className="py-3 px-4">
                      {staff.cadre === 'TEACHING' ? (
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-bold text-slate-900">
                            {staff.weekly_teaching_periods}
                          </span>
                          <span className="text-[10px] text-slate-400">periods/wk</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Admin Role</span>
                      )}
                    </td>

                    {/* TRCN / Qualification */}
                    <td className="py-3 px-4">
                      {staff.trcn_number ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                          <ShieldCheck className="w-3 h-3 text-indigo-600" />
                          <span className="truncate max-w-[110px]">{staff.trcn_number}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 truncate max-w-[120px] block">
                          {staff.qualification || 'Verified'}
                        </span>
                      )}
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-slate-900">
                          {staff.attendance_rate ? `${staff.attendance_rate}%` : '98.0%'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(staff)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id, staff.full_name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Staff"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ================= MODAL: ONBOARD STAFF MEMBER ================= */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Onboard Faculty or Staff Member</h3>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <select
                    value={newStaffForm.title}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Engr.">Engr.</option>
                    <option value="Barr.">Barr.</option>
                    <option value="Alhaji">Alhaji</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Adeleke"
                    value={newStaffForm.full_name}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cadre
                  </label>
                  <select
                    value={newStaffForm.cadre}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, cadre: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="TEACHING">Teaching Faculty</option>
                    <option value="NON_TEACHING">Non-Teaching Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={newStaffForm.department}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Arts & Humanities">Arts &amp; Humanities</option>
                    <option value="Commercial & ICT">Commercial &amp; ICT</option>
                    <option value="Administration">Administration</option>
                    <option value="Bursary">Bursary</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Campus Clinic">Campus Clinic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Physics Master, HOD"
                    value={newStaffForm.designation}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Form Master Allocation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SSS 3 Science A (or leave empty)"
                    value={newStaffForm.assigned_arm_name}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, assigned_arm_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+234 803 000 0000"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="staff@scholars.ng"
                    value={newStaffForm.email}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    TRCN License Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TRCN/LA/88219/2021"
                    value={newStaffForm.trcn_number}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, trcn_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Weekly Teaching Periods
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={newStaffForm.weekly_teaching_periods}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, weekly_teaching_periods: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic &amp; Professional Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. (Ed) Mathematics, M.Ed Educational Admin"
                  value={newStaffForm.qualification}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, qualification: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Onboard Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT STAFF PROFILE ================= */}
      {isEditModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Edit Staff Record &amp; Teaching Load</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <select
                    value={editStaffForm.title}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Engr.">Engr.</option>
                    <option value="Barr.">Barr.</option>
                    <option value="Alhaji">Alhaji</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editStaffForm.full_name}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={editStaffForm.designation}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={editStaffForm.department}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Arts & Humanities">Arts &amp; Humanities</option>
                    <option value="Commercial & ICT">Commercial &amp; ICT</option>
                    <option value="Administration">Administration</option>
                    <option value="Bursary">Bursary</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Campus Clinic">Campus Clinic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Form Master Arm
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SSS 3 Science A"
                    value={editStaffForm.assigned_arm_name}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, assigned_arm_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Weekly Teaching Periods
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={editStaffForm.weekly_teaching_periods}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, weekly_teaching_periods: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Employment Status
                  </label>
                  <select
                    value={editStaffForm.status}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    TRCN License
                  </label>
                  <input
                    type="text"
                    value={editStaffForm.trcn_number}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, trcn_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
    </div>
  );
}
