'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { coursesApi, getTenantSlug } from '@/lib/api';
import { UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const getDeterministicAvatar = (id: string) => {
  if (!id) return '/avatars/character1.jpg';
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = (Math.abs(hash) % 20) + 1;
  return `/avatars/character${index}.jpg`;
};

export default function StudentsPage() {
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [managingStudent, setManagingStudent] = useState<any>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [targetCohortId, setTargetCohortId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const openManageModal = (student: any) => {
    setManagingStudent(student);
    const currentEnrollment = data?.enrollments?.find((e: any) => e.user_id === student.user_id);
    setTargetCohortId(currentEnrollment ? currentEnrollment.cohort_id : '');
    setIsManageModalOpen(true);
  };

  const handleAssignCohort = async () => {
    if (!targetCohortId || !managingStudent) return;
    setIsAssigning(true);
    try {
      await coursesApi.post('/api/admin/enrollments', {
        user_id: managingStudent.user_id,
        cohort_id: targetCohortId
      });
      setIsManageModalOpen(false);
      refetch();
    } catch (e: any) {
      alert(e.response?.data?.error || "Failed to assign cohort");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveCohort = async () => {
    if (!managingStudent) return;
    const currentEnrollment = data?.enrollments?.find((e: any) => e.user_id === managingStudent.user_id);
    if (!currentEnrollment) return;

    if (!confirm("Are you sure you want to remove this student from their current cohort?")) return;

    setIsAssigning(true);
    try {
      await coursesApi.delete(`/api/admin/enrollments/${currentEnrollment.id}`);
      setIsManageModalOpen(false);
      refetch();
    } catch (e: any) {
      alert("Failed to remove cohort");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleResetProgress = async () => {
    if (!managingStudent) return;
    const currentEnrollment = data?.enrollments?.find((e: any) => e.user_id === managingStudent.user_id);
    if (!currentEnrollment) {
      alert("Student is not enrolled in any cohort");
      return;
    }

    if (!confirm("Are you sure you want to reset all progress for this student? This includes XP and stages and cannot be undone.")) return;

    setIsAssigning(true);
    try {
      await coursesApi.post(`/api/admin/enrollments/${currentEnrollment.id}/reset`);
      setIsManageModalOpen(false);
      refetch();
    } catch (e: any) {
      alert("Failed to reset student progress");
    } finally {
      setIsAssigning(false);
    }
  };


  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteStudent = async () => {
    if (!managingStudent) return;
    
    if (!confirm(`Are you sure you want to completely delete ${managingStudent.user?.full_name || 'this student'} from this tenant? This action cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      if (managingStudent.enrollment_id) {
        try {
          await coursesApi.delete(`/api/admin/enrollments/${managingStudent.enrollment_id}`);
        } catch(e) {
          console.warn("Enrollment delete failed/skipped", e);
        }
      }
      
      if (managingStudent.role_id) {
        try {
          await api.delete(`/api/v1/tenants/roles/${managingStudent.role_id}`);
        } catch(e) {
          console.warn("Role delete failed/skipped", e);
        }
      }

      setIsManageModalOpen(false);
      refetch();
    } catch (e: any) {
      alert("Failed to delete student completely");
    } finally {
      setIsDeleting(false);
    }
  };


  // Fetch cohorts and enrollments
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin_students_data'],
    queryFn: async () => {
      const slug = getTenantSlug();
      const [cohortsRes, enrollmentsRes, tenantRes] = await Promise.all([
        coursesApi.get('/api/admin/cohorts'),
        coursesApi.get('/api/admin/enrollments'),
        api.get(`/api/public/tenant/resolve?domain=${slug}`)
      ]);
      
      const cohorts = cohortsRes.data.cohorts || [];
      const enrollments = enrollmentsRes.data.enrollments || [];
      const tenantId = tenantRes.data?.tenant?.id;
      
      let allStudents = [];
      if (tenantId) {
        try {
          const rolesRes = await api.get(`/api/v1/tenants/roles/${tenantId}?role=student`);
          allStudents = rolesRes.data || [];
        } catch (e) {
          console.error("Failed to fetch tenant roles", e);
        }
      }
      
      // Extract unique user IDs
      const enrolledUserIds = enrollments.map((e: any) => e.user_id);
      const studentRoleUserIds = allStudents.map((s: any) => s.user_id);
      const userIds = [...new Set([...enrolledUserIds, ...studentRoleUserIds])];
      
      // Fetch user profiles in bulk
      let users: Record<string, any> = {};
      if (userIds.length > 0) {
        try {
          const profilesRes = await api.post('/api/v1/users/profiles/bulk', { user_ids: userIds });
          const profilesList = profilesRes.data.profiles || [];
          profilesList.forEach((p: any) => {
            users[p.id] = p;
          });
        } catch (e) {
          console.error("Failed to fetch user profiles", e);
        }
      }

      return { cohorts, enrollments, allStudents, users, tenantId };
    }
  });

  const cohorts = data?.cohorts || [];
  const enrollments = data?.enrollments || [];
  const allStudents = data?.allStudents || [];
  const users = data?.users || {};
  const tenantId = data?.tenantId || '';

  // Default to 'all' if none selected
  React.useEffect(() => {
    if (!selectedCohortId) {
      setSelectedCohortId('all');
    }
  }, [selectedCohortId]);

  const enrolledUserIds = enrollments.map((e: any) => e.user_id);
  const studentRoleUserIds = allStudents.map((s: any) => s.user_id);
  const userIds = [...new Set([...enrolledUserIds, ...studentRoleUserIds])];

  // Map to student data and apply search filter
  const students = (selectedCohortId === 'all' 
    ? userIds.map((userId: any) => {
        const enrollment = enrollments.find((e: any) => e.user_id === userId) || {};
        const roleUser = allStudents.find((s: any) => s.user_id === userId) || {};
        return {
          id: enrollment.id || roleUser.id || userId,
          user_id: userId,
          enrolled_at: enrollment.enrolled_at || roleUser.created_at || null,
          payment_status: enrollment.payment_status || 'UNENROLLED',
          plan_type: enrollment.plan_type || 'N/A',
          billing_cycle: enrollment.billing_cycle || 'N/A',
          current_stage_number: enrollment.current_stage_number || 0,
          cohort_id: enrollment.cohort_id || null,
          role_id: roleUser.id || null,
          enrollment_id: enrollment.id || null,
          user: users[userId] || { full_name: roleUser.full_name || 'Unknown User', email: roleUser.email || 'N/A', avatar_url: null }
        };
      })
    : enrollments
        .filter((e: any) => e.cohort_id === selectedCohortId)
        .map((e: any) => {
          const roleUser = allStudents.find((s: any) => s.user_id === e.user_id) || {};
          return {
            ...e,
            role_id: roleUser.id || null,
            enrollment_id: e.id,
            user: users[e.user_id] || { full_name: 'Unknown User', email: 'N/A' }
          };
        })
  ).filter((s: any) => {
    const searchString = `${s.user.full_name || ''} ${s.user.email || ''}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Student Management</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage enrolled students across your cohorts.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedCohortId}
              onChange={(e) => setSelectedCohortId(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#146ef5] bg-white text-gray-900 shadow-sm font-medium min-w-[250px]"
            >
              <option value="all">All Students (Tenant)</option>
              <option value="" disabled>--- Cohorts ---</option>
              {cohorts.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.program?.title ? `${c.program.title} - ${c.title}` : c.title} ({c.status})
                </option>
              ))}
            </select>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search students..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] shadow-sm"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          
          <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            {students.length} Student{students.length !== 1 ? 's' : ''}
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Cohort</th>
              <th className="px-6 py-4">Enrollment Date</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4">Plan / Cycle</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#146ef5] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading students...</span>
                  </div>
                </td>
              </tr>
            ) : cohorts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <UserGroupIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-base font-medium text-gray-900">No cohorts found</p>
                  <p className="text-sm mt-1">Create a cohort first to manage students.</p>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <UserGroupIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-base font-medium text-gray-900">No students enrolled</p>
                  <p className="text-sm mt-1">This cohort doesn't have any students yet.</p>
                </td>
              </tr>
            ) : (
              students.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img 
                          src={s.user.avatar_url || getDeterministicAvatar(s.user_id || s.id)} 
                          alt="" 
                          className="w-full h-full object-cover bg-blue-50" 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{s.user.full_name || 'Unnamed Student'}</p>
                        <p className="text-xs text-gray-500">{s.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 font-medium whitespace-nowrap">
                      {s.cohort_id ? (cohorts.find((c: any) => c.id === s.cohort_id)?.title || 'Unknown Cohort') : <span className="text-gray-400 italic">Unassigned</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {new Date(s.enrolled_at || s.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      s.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 
                      s.payment_status === 'PENDING' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' : 
                      'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                    }`}>
                      {s.payment_status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.plan_type || 'STANDARD'}</p>
                      <p className="text-xs text-gray-500 capitalize">{s.billing_cycle || 'one-time'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#146ef5] rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(5, (s.current_stage_number / 10) * 100))}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">Stage {s.current_stage_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openManageModal(s)}
                      className="text-[#146ef5] hover:text-[#105bd1] font-semibold text-xs bg-[#146ef5]/10 hover:bg-[#146ef5]/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isManageModalOpen && managingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800">
                Manage Cohort Assignment
              </h3>
              <button onClick={() => setIsManageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Assign <span className="font-semibold text-gray-900">{managingStudent.user.full_name}</span> to a cohort.
              </p>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Cohort</label>
                <select
                  value={targetCohortId}
                  onChange={(e) => setTargetCohortId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#146ef5] bg-slate-50 text-slate-800"
                >
                  <option value="" disabled>Select a cohort to assign...</option>
                  {cohorts.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between gap-3 shrink-0">
              <div className="flex gap-2 flex-wrap">
                <button 
                  type="button" 
                  onClick={handleResetProgress}
                  disabled={isAssigning || !managingStudent.enrollment_id}
                  className="px-4 py-2.5 rounded-xl border border-yellow-200 text-yellow-700 font-bold text-xs hover:bg-yellow-50 disabled:opacity-50"
                  title="Reset student progress (XP and stages)"
                >
                  Reset Progress
                </button>
                <button 
                  type="button" 
                  onClick={handleRemoveCohort}
                  disabled={isAssigning || !managingStudent.enrollment_id}
                  className="px-4 py-2.5 rounded-xl border border-orange-200 text-orange-600 font-bold text-xs hover:bg-orange-50 disabled:opacity-50"
                  title="Remove from current cohort"
                >
                  Unassign
                </button>
                <button 
                  type="button" 
                  onClick={handleDeleteStudent}
                  disabled={isDeleting || isAssigning}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 disabled:opacity-50"
                  title="Delete student from tenant completely"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Student'}
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsManageModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleAssignCohort}
                  disabled={isAssigning || !targetCohortId}
                  className="px-4 py-2.5 rounded-xl bg-[#146ef5] text-white font-bold text-xs hover:bg-[#105bd1] disabled:opacity-50"
                >
                  {isAssigning ? 'Saving...' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
