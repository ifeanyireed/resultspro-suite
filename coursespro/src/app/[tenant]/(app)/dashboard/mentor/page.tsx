"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CalendarDaysIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  VideoCameraIcon,
  ArrowPathIcon,
  SparklesIcon,
  ChatBubbleLeftIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolid,
  CheckBadgeIcon as CheckBadgeSolid,
  SparklesIcon as SparklesSolid 
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface MentorProfile {
  user_id: string;
  tenant_id: string;
  full_name: string;
  avatar_url?: string;
  specialization?: string;
  total_reviews: number;
  pending_reviews: number;
  avg_rating: number;
  booking_url?: string;
  created_at?: string;
}

export default function MentorsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('ALL');

  // Fetch student mentors from service_coursespro
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['student_mentors', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/mentors');
      return res.data;
    },
    enabled: !!user,
  });

  const rawMentors: MentorProfile[] = useMemo(() => {
    return data?.mentors || [];
  }, [data]);

  const term = data?.terminology || 'Mentor';
  const termPlural = term + 's';

  // Extract unique specializations for filter pills
  const specializations = useMemo(() => {
    const set = new Set<string>();
    rawMentors.forEach((m) => {
      if (m.specialization) {
        set.add(m.specialization);
      }
    });
    return Array.from(set);
  }, [rawMentors]);

  // Filter mentors based on search query and specialization
  const filteredMentors = useMemo(() => {
    return rawMentors.filter((m) => {
      if (selectedSpecialization !== 'ALL' && m.specialization !== selectedSpecialization) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = (m.full_name || '').toLowerCase().includes(q);
        const specMatch = (m.specialization || '').toLowerCase().includes(q);
        return nameMatch || specMatch;
      }
      return true;
    });
  }, [rawMentors, selectedSpecialization, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalReviews = 0;
    let sumRating = 0;
    let ratedCount = 0;

    rawMentors.forEach((m) => {
      totalReviews += m.total_reviews || 0;
      if (m.avg_rating > 0) {
        sumRating += m.avg_rating;
        ratedCount++;
      }
    });

    const avgRating = ratedCount > 0 ? (sumRating / ratedCount).toFixed(1) : '4.9';

    return {
      total: rawMentors.length,
      avgRating,
      totalReviews,
    };
  }, [rawMentors]);

  const handleMessage = (mentorId: string) => {
    router.push(`/dashboard/messages?user=${mentorId}`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {term} & Instructor Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Technical Advisory Board
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Book 1-on-1 office hours, request architectural code reviews, and receive career mentorship.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs self-start sm:self-auto"
          title="Refresh Directory"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <AcademicCapIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 font-medium">Assigned {termPlural}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <StarSolid className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.avgRating} ★</div>
            <div className="text-xs text-slate-500 font-medium">Average Evaluation Rating</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckBadgeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalReviews}</div>
            <div className="text-xs text-slate-500 font-medium">Completed Code Reviews</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSpecialization('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSpecialization === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All {termPlural}
          </button>
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialization === spec
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${termPlural.toLowerCase()}...`}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
          />
        </div>
      </div>

      {/* Main Mentors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs h-56 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl mt-6"></div>
            </div>
          ))}
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AcademicCapIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {searchQuery ? `No ${termPlural.toLowerCase()} matched your search` : `No ${termPlural.toLowerCase()} assigned yet`}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No instructor matched "${searchQuery}". Try searching by another keyword.`
              : `Your instructors are currently being configured for your cohort track. They will appear here shortly!`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.user_id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all relative"
            >
              <div>
                {/* Header: Avatar, Name & Rating */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-xs flex items-center justify-center text-slate-700 font-bold text-xl">
                    {mentor.avatar_url ? (
                      <img
                        src={mentor.avatar_url}
                        alt={mentor.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                        {(mentor.full_name || 'M').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <h3 className="text-base font-bold text-slate-900 truncate tracking-tight">
                        {mentor.full_name}
                      </h3>
                      <CheckBadgeSolid className="w-4 h-4 text-blue-600 shrink-0" title="Accredited Mentor" />
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-medium">
                      {mentor.specialization || 'Technical Instructor'}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <StarSolid className="w-3.5 h-3.5" />
                        <span>{mentor.avg_rating > 0 ? mentor.avg_rating.toFixed(1) : '5.0'}</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500 text-[11px]">
                        {mentor.total_reviews || 0} reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submissions & Code Reviews Badge */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-6 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Evaluation SLA</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    &lt; 24h Turnaround
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {mentor.booking_url ? (
                  <a
                    href={mentor.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-1.5 shadow-xs"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    Book 1-on-1
                  </a>
                ) : (
                  <button
                    disabled
                    className="bg-slate-100 text-slate-400 cursor-not-allowed text-xs font-medium py-2.5 rounded-xl flex justify-center items-center gap-1.5"
                    title="Direct booking URL not set"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    Office Hours
                  </button>
                )}

                <button
                  onClick={() => handleMessage(mentor.user_id)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-1.5 shadow-xs"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-600" />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
