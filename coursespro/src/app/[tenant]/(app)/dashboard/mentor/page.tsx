"use client";
import React from 'react';
import { CalendarDaysIcon, ChatBubbleLeftIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function MentorsPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['student_mentors'],
    queryFn: async () => {
      const res = await api.get('/api/v1/student/mentors');
      return res.data;
    }
  });

  const mentors = data?.mentors || [];

  const handleMessage = async (mentorId: string) => {
    try {
      const res = await api.post(`/api/v1/messages/direct/${mentorId}`);
      if (res.data.conversation_id) {
        router.push(`/dashboard/messages/${res.data.conversation_id}`);
      }
    } catch (e) {
      console.error("Failed to start conversation", e);
      alert("Could not start conversation at this time.");
    }
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Book 1-on-1 sessions with industry experts for code reviews and guidance.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm h-48 animate-pulse">
               <div className="w-16 h-16 rounded-2xl bg-gray-100 mb-4"></div>
               <div className="h-5 bg-gray-100 rounded w-3/4 mb-3"></div>
               <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="text-gray-500 py-12 text-center bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
          No mentors have been assigned to your cohort yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor: any, i: number) => (
            <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                  <img src={mentor.avatar_url || `https://i.pravatar.cc/150?u=${mentor.user_id}`} alt={mentor.full_name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{mentor.full_name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{mentor.specialization || 'Software Engineer'}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <StarSolid className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-gray-900">{mentor.avg_rating > 0 ? mentor.avg_rating.toFixed(1) : 'New'}</span>
                    <span>({mentor.total_reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <a 
                  href={mentor.booking_url || '#'} 
                  target={mentor.booking_url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`${mentor.booking_url ? 'bg-[#146ef5] hover:bg-[#105bd1] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} text-sm font-semibold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2`}
                >
                  <CalendarDaysIcon className="w-4 h-4"/> Book Session
                </a>
                <button 
                  onClick={() => handleMessage(mentor.user_id)}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4"/> Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}