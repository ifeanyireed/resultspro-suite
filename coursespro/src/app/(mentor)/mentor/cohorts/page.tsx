"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function MentorCohorts() {
  const { data: mentorProfile, isLoading } = useQuery({
    queryKey: ['mentor-profile'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/profile');
      return res.data;
    }
  });

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Cohorts</h1>
          <p className="text-sm text-gray-500 mt-1">Cohorts you are currently assigned to mentor.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146ef5]"></div>
        </div>
      ) : mentorProfile?.cohort_assignments?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentorProfile.cohort_assignments.map((cohort: string, idx: number) => (
            <div key={idx} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{cohort}</h3>
              <p className="text-sm text-gray-500">Active Mentorship</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[1.5rem] p-12 border border-gray-100 shadow-sm text-center">
          <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Cohorts Assigned</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">You have not been assigned to any cohorts yet. Check back later or contact an administrator.</p>
        </div>
      )}
    </>
  );
}