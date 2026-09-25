"use client";
import React, { useEffect, useState } from 'react';
import { PlayIcon, CheckCircleIcon, LockClosedIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function JourneyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ['student-dashboard-summary', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/dashboard/summary');
      return res.data;
    },
    enabled: !!user && mounted
  });

  const { data: journeyData, isLoading: loadingJourney } = useQuery({
    queryKey: ['cohort-journey', dashboardData?.cohort_id],
    queryFn: async () => {
      const res = await coursesApi.get(`/api/cohorts/${dashboardData.cohort_id}/journey`);
      return res.data;
    },
    enabled: !!dashboardData?.cohort_id
  });

  if (!mounted || !user || loadingDashboard || loadingJourney) {
    return (
      <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentStage = dashboardData?.enrollment?.current_stage || 1;
  const stages = journeyData?.stages || [];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">The Learning Journey</h1>
          <p className="text-sm text-gray-500 mt-1">Master the curriculum step-by-step through guided mentorship.</p>
        </div>
        <button 
          onClick={() => {
            const currentStageObj = stages.find((s: any) => s.stage_number === currentStage);
            if (currentStageObj) {
              router.push(`/dashboard/journey/${currentStageObj.id}`);
            }
          }}
          className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
          <PlayIcon className="w-4 h-4" />
          Resume Module
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {stages.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-8 text-center border border-gray-100 text-gray-500">
              Your instructor hasn't added any modules to this journey yet!
            </div>
          ) : (
            stages.map((stage: any, i: number) => {
              let status = 'locked';
              const progressObj = journeyData?.progress?.find((p: any) => p.module_id === stage.id);
              
              if (progressObj?.completed) {
                status = 'completed';
              } else if (stage.stage_number <= currentStage) {
                status = 'current';
              }

              return (
                <div key={i} 
                     onClick={() => {
                       if (status !== 'locked') {
                         router.push(`/dashboard/journey/${stage.id}`);
                       }
                     }}
                     className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6 ${status === 'locked' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md transition-shadow'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    status === 'current' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {status === 'completed' && <CheckCircleIcon className="w-6 h-6" />}
                    {status === 'current' && <DocumentTextIcon className="w-6 h-6" />}
                    {status === 'locked' && <LockClosedIcon className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-medium text-gray-900">{stage.title}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Module {stage.stage_number}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{stage.description}</p>
                  </div>
                  {status === 'current' && (
                    <div className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-900 transition-colors">
                      <ArrowRightIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 relative overflow-hidden group">
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full filter blur-[2rem] opacity-30"></div>
             <h3 className="text-xl font-normal text-white mb-6">Journey Progress</h3>
             <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{Math.round(dashboardData?.enrollment?.progress || 0)}%</h2>
             {dashboardData?.current_module?.content_title ? (
                <p className="text-sm text-white/80">Next: {dashboardData.current_module.content_title}</p>
             ) : (
                <p className="text-sm text-white/80">Keep up the great work!</p>
             )}
          </div>
        </div>
      </div>
    </>
  );
}
