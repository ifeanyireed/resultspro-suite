"use client";
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { 
  UserCircleIcon, 
  CalendarIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function MentorSettings() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['mentor-profile-settings', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/profile');
      return res.data;
    },
    enabled: !!user
  });

  const profile = profileData?.profile || {};
  const cohortAssignments = profileData?.cohort_assignments || [];

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.name || '');
      setAvatarUrl(profile.avatar_url || '');
      setSpecialization(profile.specialization || '');
      setBookingUrl(profile.booking_url || '');
    }
  }, [profile, user]);

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      full_name: string;
      avatar_url: string;
      specialization: string;
      booking_url: string;
    }) => {
      const res = await coursesApi.put('/api/mentor/profile', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Mentor profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['mentor-profile-settings'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-profile-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
    },
    onError: (err) => {
      toast.error('Failed to update mentor profile');
      console.error(err);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      full_name: fullName.trim(),
      avatar_url: avatarUrl.trim(),
      specialization: specialization.trim(),
      booking_url: bookingUrl.trim()
    });
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#146ef5] border border-blue-100">
              <AcademicCapIcon className="w-3.5 h-3.5 text-[#146ef5]" />
              Instructor Configuration
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure your public mentor showcase, 1:1 office hours booking link, and cohort availability.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 font-medium text-xs">Loading mentor profile...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Professional Identity */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xs border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <UserCircleIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="font-bold text-gray-900 text-base">Professional Identity</h3>
              </div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Public on Campus
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-gray-200 bg-gray-50 shadow-2xs">
                <img 
                  src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Mentor')}&background=146ef5&color=fff`} 
                  alt={fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="flex-1 w-full space-y-1">
                <label className="block text-xs font-bold text-gray-700">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://cdn.example.com/avatar.jpg"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
                <p className="text-[11px] text-gray-400">Provide an image URL or leave blank for automatic monogram initials.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chidi Okonkwo"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Domain Specialization</label>
                <input
                  type="text"
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Senior Full-Stack React & Go Architect"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 1:1 Office Hours Booking Link */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xs border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 text-base">1:1 Mentorship Scheduling Link</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                Student Visible
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Calendly or Cal.com Booking URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={bookingUrl}
                  onChange={(e) => setBookingUrl(e.target.value)}
                  placeholder="https://cal.com/your-handle/office-hours"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                This URL powers the &quot;Book 1:1 Session&quot; action on the student directory. Students can schedule 30-minute sprint consultations directly on your calendar.
              </p>

              {bookingUrl && (
                <div className="pt-2">
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#146ef5] hover:underline"
                  >
                    Test Your Booking Page <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Cohort Assignments Overview */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-base">Assigned Mentorship Cohorts</h3>
              </div>
              <span className="text-[11px] font-bold text-gray-500">
                {cohortAssignments.length} Cohort{cohortAssignments.length === 1 ? '' : 's'}
              </span>
            </div>

            {cohortAssignments.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">
                You have not been assigned to any specific cohorts yet. Contact your campus administrator.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {cohortAssignments.map((cohortName: string, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-gray-800">{cohortName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-3 rounded-xl bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
            >
              {updateMutation.isPending ? 'Saving Profile...' : 'Save Mentor Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
