"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { TrophyIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function AchievementsPage() {
  const { user } = useAuthStore();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/achievements');
      return res.data?.achievements || [];
    },
    enabled: !!user
  });

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Achievements</h1>
          <p className="text-sm text-gray-500 mt-1">Badges and certificates you've earned.</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center text-gray-500 mt-10">Loading achievements...</div>
      ) : achievements?.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No achievements available yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((a: any) => (
            <div 
              key={a.id} 
              className={`bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center transition-all ${
                a.earned ? 'hover:shadow-md' : 'opacity-60 grayscale'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                a.earned ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-400'
              }`}>
                {a.icon_url ? (
                  <img src={a.icon_url} alt={a.title} className="w-10 h-10 object-contain" />
                ) : (
                  <TrophyIcon className="w-8 h-8" />
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{a.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">{a.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-50 w-full">
                {a.earned ? (
                  <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                    Earned {new Date(a.earned_at).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1">
                    <LockClosedIcon className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}