'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  BriefcaseIcon, 
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function MentorApplicationsSection() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'ALL'>('PENDING');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin_mentor_applications'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/admin/mentor-applications');
      return res.data || [];
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return coursesApi.post(`/api/admin/mentor-applications/${id}/approve`);
    },
    onSuccess: () => {
      toast.success('Application approved and mentor profile created.');
      queryClient.invalidateQueries({ queryKey: ['admin_mentor_applications'] });
      queryClient.invalidateQueries({ queryKey: ['mentors_dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to approve application');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return coursesApi.post(`/api/admin/mentor-applications/${id}/reject`, { notes: 'Rejected by admin' });
    },
    onSuccess: () => {
      toast.success('Application rejected');
      queryClient.invalidateQueries({ queryKey: ['admin_mentor_applications'] });
      queryClient.invalidateQueries({ queryKey: ['mentors_dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to reject application');
    }
  });

  if (isLoading) return null;
  if (!applications || applications.length === 0) return null;

  const pendingApps = applications.filter((a: any) => a.status === 'PENDING');
  const approvedApps = applications.filter((a: any) => a.status === 'APPROVED');
  const rejectedApps = applications.filter((a: any) => a.status === 'REJECTED');

  const displayedApps = filter === 'PENDING'
    ? pendingApps
    : filter === 'APPROVED'
      ? approvedApps
      : applications;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AcademicCapIcon className="w-5 h-5 text-[#146ef5]" />
          Mentor Applications
        </h2>
        
        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'PENDING'
                ? 'bg-white text-gray-900 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Pending ({pendingApps.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'APPROVED'
                ? 'bg-white text-gray-900 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Approved ({approvedApps.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'ALL'
                ? 'bg-white text-gray-900 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All ({applications.length})
          </button>
        </div>
      </div>

      {displayedApps.length === 0 ? (
        <div className="text-center py-6 bg-gray-50/60 rounded-2xl border border-gray-100 text-sm text-gray-500">
          No {filter.toLowerCase()} applications found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedApps.map((app: any) => {
            const isPending = app.status === 'PENDING';
            const isApproved = app.status === 'APPROVED';
            const isRejected = app.status === 'REJECTED';

            return (
              <div 
                key={app.id} 
                className={`rounded-2xl p-5 border shadow-sm transition-all ${
                  isPending 
                    ? 'bg-orange-50/40 border-orange-100' 
                    : isApproved
                      ? 'bg-emerald-50/30 border-emerald-100'
                      : 'bg-gray-50/60 border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {app.first_name} {app.last_name}
                  </h4>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                    isPending 
                      ? 'bg-orange-100 text-orange-700' 
                      : isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-700'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-1">{app.email}</p>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                  <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                  {app.expertise || 'Specialist'}
                </p>

                {app.linkedin_url && (
                  <a 
                    href={app.linkedin_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-[#146ef5] hover:underline mb-4 inline-block font-medium"
                  >
                    View LinkedIn Profile →
                  </a>
                )}

                {isApproved && (
                  <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                    Active in Mentors Directory
                  </div>
                )}

                {isRejected && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    {app.admin_notes || 'Application declined'}
                  </div>
                )}

                {isPending && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-orange-100/60">
                    <button
                      onClick={() => approveMutation.mutate(app.id)}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-gray-950 text-white py-2 rounded-xl text-sm font-medium flex justify-center items-center gap-1.5 hover:bg-black transition-colors disabled:opacity-50"
                    >
                      <CheckCircleIcon className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(app.id)}
                      disabled={rejectMutation.isPending}
                      className="flex-1 bg-white text-gray-700 border border-gray-200 py-2 rounded-xl text-sm font-medium flex justify-center items-center gap-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <XCircleIcon className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
