'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function MentorApplicationsSection() {
  const queryClient = useQueryClient();

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
      toast.success('Application approved. They can now be invited as a mentor.');
      queryClient.invalidateQueries({ queryKey: ['admin_mentor_applications'] });
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
    }
  });

  if (isLoading) return null;

  const pendingApps = applications.filter((a: any) => a.status === 'PENDING');

  if (pendingApps.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <ClockIcon className="w-5 h-5 text-orange-500" />
        Pending Applications ({pendingApps.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingApps.map((app: any) => (
          <div key={app.id} className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">
                {app.first_name} {app.last_name}
              </h4>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                Pending
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{app.email}</p>
            <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
              <BriefcaseIcon className="w-4 h-4" />
              {app.expertise}
            </p>
            {app.linkedin_url && (
              <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mb-4 block">
                View LinkedIn Profile
              </a>
            )}
            <div className="flex gap-2 mt-4 pt-4 border-t border-orange-100/50">
              <button
                onClick={() => approveMutation.mutate(app.id)}
                className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-1 hover:bg-gray-800"
              >
                <CheckCircleIcon className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => rejectMutation.mutate(app.id)}
                className="flex-1 bg-white text-gray-700 border border-gray-200 py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-1 hover:bg-gray-50"
              >
                <XCircleIcon className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
