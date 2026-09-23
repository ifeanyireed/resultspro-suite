'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { coursesApi } from '@/lib/api';
import { UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function StudentsPage() {
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch cohorts and enrollments
  const { data, isLoading } = useQuery({
    queryKey: ['admin_students_data'],
    queryFn: async () => {
      const [cohortsRes, enrollmentsRes] = await Promise.all([
        coursesApi.get('/api/admin/cohorts'),
        coursesApi.get('/api/admin/enrollments')
      ]);
      
      const cohorts = cohortsRes.data.cohorts || [];
      const enrollments = enrollmentsRes.data.enrollments || [];
      
      // Extract unique user IDs
      const userIds = [...new Set(enrollments.map((e: any) => e.user_id))];
      
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

      return { cohorts, enrollments, users };
    }
  });

  const cohorts = data?.cohorts || [];
  const enrollments = data?.enrollments || [];
  const users = data?.users || {};

  // Default to first cohort if none selected and cohorts exist
  React.useEffect(() => {
    if (!selectedCohortId && cohorts.length > 0) {
      setSelectedCohortId(cohorts[0].id);
    }
  }, [cohorts, selectedCohortId]);

  // Filter enrollments by selected cohort
  const cohortEnrollments = enrollments.filter((e: any) => e.cohort_id === selectedCohortId);

  // Map to student data and apply search filter
  const students = cohortEnrollments.map((e: any) => ({
    ...e,
    user: users[e.user_id] || { full_name: 'Unknown User', email: 'N/A' }
  })).filter((s: any) => {
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
              <option value="" disabled>Select a Cohort</option>
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
              <th className="px-6 py-4">Enrollment Date</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4">Plan / Cycle</th>
              <th className="px-6 py-4">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#146ef5] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading students...</span>
                  </div>
                </td>
              </tr>
            ) : cohorts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <UserGroupIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-base font-medium text-gray-900">No cohorts found</p>
                  <p className="text-sm mt-1">Create a cohort first to manage students.</p>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
                        {s.user.avatar_url ? (
                          <img src={s.user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-sm">
                            {(s.user.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{s.user.full_name || 'Unnamed Student'}</p>
                        <p className="text-xs text-gray-500">{s.user.email}</p>
                      </div>
                    </div>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
