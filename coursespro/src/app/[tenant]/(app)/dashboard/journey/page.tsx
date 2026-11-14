"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PlayIcon, 
  CheckCircleIcon, 
  LockClosedIcon, 
  DocumentTextIcon, 
  ArrowRightIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  CodeBracketIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon,
  VideoCameraIcon,
  CalendarIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  CheckBadgeIcon as CheckBadgeSolid,
  SparklesIcon as SparklesSolid,
  FireIcon as FireSolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default function JourneyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleStageExpand = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

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

  if (!mounted || !user || loadingDashboard || (dashboardData?.cohort_id && loadingJourney)) {
    return (
      <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 1. Unenrolled / No Active Cohort State
  if (dashboardData && (!dashboardData.has_enrollment || !dashboardData.cohort_id)) {
    return (
      <div className="w-full py-6">
        <div className="mb-8 mt-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">The Learning Journey</h1>
          <p className="text-sm text-gray-500 mt-1">Master the curriculum step-by-step through guided mentorship.</p>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center mx-auto">
            <AcademicCapIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Cohort Enrollment</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
              You are not currently enrolled in an active learning cohort. Join an active cohort to unlock the step-by-step curriculum, submit assignments, and work directly with your mentor.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center justify-center gap-2"
            >
              <BookOpenIcon className="w-4 h-4" />
              Explore Available Cohorts
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold px-6 py-3 rounded-full border border-gray-200 transition-colors flex items-center justify-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStage = dashboardData?.enrollment?.current_stage || 1;
  const stages = journeyData?.stages || [];

  // Helper to retrieve stage items from contents_json
  const getStageItems = (stage: any) => {
    if (!stage.contents_json) return [];
    try {
      const parsed = JSON.parse(stage.contents_json);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to retrieve list of completed item indices
  const getCompletedItems = (stage: any): number[] => {
    const progressObj = journeyData?.progress?.find((p: any) => p.module_id === stage.id);
    if (!progressObj?.completed_items) return [];
    try {
      const parsed = JSON.parse(progressObj.completed_items);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to determine whether a stage has been completed
  const isStageCompleted = (stage: any) => {
    const progressObj = journeyData?.progress?.find((p: any) => p.module_id === stage.id);
    if (progressObj?.completed) return true;
    const completedList = getCompletedItems(stage);
    const items = getStageItems(stage);
    if (items.length > 0 && completedList.length >= items.length) {
      return true;
    }
    return false;
  };

  // Helper to get stage schedule dates
  const getStageSchedule = (stageId: string) => {
    const sched = journeyData?.schedules?.[stageId];
    if (!sched) return null;
    const start = sched.start_date || sched.start;
    const end = sched.end_date || sched.end || sched.live;
    return { start, end };
  };

  // Helper to format schedule dates
  const formatScheduleDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper to check if future drip-locked
  const isFutureLocked = (stage: any) => {
    const sched = getStageSchedule(stage.id);
    if (sched?.start) {
      const startDate = new Date(sched.start);
      if (!isNaN(startDate.getTime()) && startDate.getTime() > Date.now()) {
        return { isLocked: true, date: formatScheduleDate(sched.start) };
      }
    }
    return { isLocked: false, date: '' };
  };

  // Helper for item icons
  const getItemIcon = (type: string, isDone: boolean) => {
    if (isDone) return <CheckCircleSolid className="w-4 h-4 text-emerald-600 shrink-0" />;
    switch (type) {
      case 'VIDEO': return <PlayIcon className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'QUIZ': return <QuestionMarkCircleIcon className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'ASSIGNMENT': return <ClipboardDocumentCheckIcon className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'PROJECT': return <RocketLaunchIcon className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'LIVE_CLASS': return <VideoCameraIcon className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'COMPILER': return <CodeBracketIcon className="w-4 h-4 text-sky-500 shrink-0" />;
      default: return <DocumentTextIcon className="w-4 h-4 text-gray-400 shrink-0" />;
    }
  };

  const allCompleted = stages.length > 0 && stages.every((s: any) => isStageCompleted(s));
  const completedStagesCount = stages.filter((s: any) => isStageCompleted(s)).length;
  const overallProgress = Math.round(dashboardData?.enrollment?.progress ?? (stages.length > 0 ? (completedStagesCount / stages.length) * 100 : 0));
  const mentorTitle = dashboardData?.mentor_terminology || 'Mentor';

  // Determine smart resume target
  const activeResumeStage = (() => {
    if (stages.length === 0) return null;
    const currentObj = stages.find((s: any) => s.stage_number === currentStage);
    if (currentObj && !isStageCompleted(currentObj)) {
      return currentObj;
    }
    const firstIncomplete = stages.find((s: any) => !isStageCompleted(s));
    if (firstIncomplete) {
      return firstIncomplete;
    }
    return currentObj || stages[0];
  })();

  return (
    <MotionRise>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 mt-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">The Learning Journey</h1>
          <p className="text-sm text-gray-500 mt-1">Master the curriculum step-by-step through guided mentorship.</p>
        </div>

        {allCompleted ? (
          <button 
            onClick={() => router.push('/dashboard/certificates')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <CheckBadgeSolid className="w-4 h-4" />
            View Certificate
          </button>
        ) : activeResumeStage ? (
          <button 
            onClick={() => router.push(`/dashboard/journey/${activeResumeStage.id}`)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <PlayIcon className="w-4 h-4" />
            Resume Module
          </button>
        ) : (
          <button 
            disabled
            className="bg-gray-100 text-gray-400 text-sm font-semibold px-5 py-2.5 rounded-full cursor-not-allowed flex items-center gap-2 self-start sm:self-auto"
          >
            <LockClosedIcon className="w-4 h-4" />
            No Active Module
          </button>
        )}
      </div>

      {allCompleted && (
        <div className="mb-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <SparklesSolid className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Curriculum Completed! 🎉</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                You have finished all required modules in this journey. Make sure all your capstone projects are submitted for mentor sign-off.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard/certificates"
              className="text-xs font-bold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckBadgeIcon className="w-4 h-4" />
              Claim Certificate
            </Link>
            <Link
              href="/dashboard/projects"
              className="text-xs font-bold px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-colors"
            >
              My Projects
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MotionStagger className="lg:col-span-2 space-y-4">
          {stages.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-8 sm:p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <ClockIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Curriculum Being Prepared</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Your instructor is finalizing the modules and lesson materials for <strong className="text-gray-700">{dashboardData?.cohort_name || 'this cohort'}</strong>. Please check back shortly or connect with your peers.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/dashboard/classroom"
                  className="px-5 py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold border border-gray-200 transition-colors"
                >
                  Join Classroom
                </Link>
                <Link
                  href="/dashboard/mentor"
                  className="px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#146ef5] text-sm font-semibold transition-colors"
                >
                  Contact Mentor
                </Link>
              </div>
            </div>
          ) : (
            stages.map((stage: any, i: number) => {
              const items = getStageItems(stage);
              const completedList = getCompletedItems(stage);
              const isCompleted = isStageCompleted(stage);
              const totalItems = items.length;
              const completedCount = completedList.length;
              const progressPercent = totalItems > 0 
                ? Math.min(100, Math.round((completedCount / totalItems) * 100))
                : (isCompleted ? 100 : 0);

              const schedule = getStageSchedule(stage.id);
              const futureLock = isFutureLocked(stage);
              
              let status = 'locked';
              if (isCompleted) {
                status = 'completed';
              } else if (stage.stage_number <= currentStage && !futureLock.isLocked) {
                status = 'current';
              }

              const isExpanded = !!expandedStages[stage.id];

              // Counts & Categories
              const quizCount = items.filter((it: any) => it.type === 'QUIZ').length;
              const assignmentCount = items.filter((it: any) => it.type === 'ASSIGNMENT').length;
              const projectCount = items.filter((it: any) => it.type === 'PROJECT').length;
              const liveCount = items.filter((it: any) => it.type === 'LIVE_CLASS').length;
              const childModules = journeyData?.modules?.filter((m: any) => m.stage_id === stage.id) || [];

              return (
                <div 
                  key={stage.id || i}
                  className={`bg-white rounded-[1.5rem] border shadow-sm transition-all duration-200 overflow-hidden ${
                    status === 'locked' 
                      ? 'border-gray-100 opacity-70 bg-gray-50/40' 
                      : 'border-gray-100 hover:border-blue-100 hover:shadow-md'
                  }`}
                >
                  <div 
                    onClick={() => {
                      if (status !== 'locked') {
                        router.push(`/dashboard/journey/${stage.id}`);
                      }
                    }}
                    className={`p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 ${
                      status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      status === 'current' ? 'bg-blue-50 text-[#146ef5] border border-blue-100' : 
                      'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}>
                      {status === 'completed' && <CheckCircleSolid className="w-6 h-6" />}
                      {status === 'current' && <DocumentTextIcon className="w-6 h-6" />}
                      {status === 'locked' && <LockClosedIcon className="w-6 h-6" />}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md">
                            Module {stage.stage_number}
                          </span>

                          {status === 'completed' && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              ✓ Completed
                            </span>
                          )}

                          {status === 'current' && (
                            <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                              In Progress
                            </span>
                          )}

                          {futureLock.isLocked && (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              Unlocks {futureLock.date}
                            </span>
                          )}

                          {status === 'locked' && !futureLock.isLocked && (
                            <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <LockClosedIcon className="w-3.5 h-3.5" />
                              Locked
                            </span>
                          )}
                        </div>

                        {schedule?.end && (
                          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                            Due: {formatScheduleDate(schedule.end)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug">
                        {(stage.title || '').replace(/LIVE_CLASS/gi, 'LIVE CLASS')}
                      </h3>

                      {stage.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {stage.description.replace(/LIVE_CLASS/gi, 'LIVE CLASS')}
                        </p>
                      )}

                      {/* Content Breakdown Tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                        {totalItems > 0 && (
                          <span className="font-medium text-gray-600 bg-gray-50 border border-gray-200/60 px-2.5 py-1 rounded-lg">
                            {totalItems} {totalItems === 1 ? 'Activity' : 'Activities'}
                          </span>
                        )}

                        {childModules.length > 0 && (
                          <span className="font-medium text-slate-700 bg-slate-100/70 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                            {childModules.length} {childModules.length === 1 ? 'Submodule' : 'Submodules'}
                          </span>
                        )}

                        {projectCount > 0 && (
                          <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <RocketLaunchIcon className="w-3.5 h-3.5 text-indigo-500" />
                            Capstone Project
                          </span>
                        )}

                        {quizCount > 0 && (
                          <span className="font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-purple-500" />
                            {quizCount} {quizCount === 1 ? 'Quiz' : 'Quizzes'}
                          </span>
                        )}

                        {assignmentCount > 0 && (
                          <span className="font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-amber-500" />
                            {assignmentCount} {assignmentCount === 1 ? 'Assignment' : 'Assignments'}
                          </span>
                        )}

                        {liveCount > 0 && (
                          <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <VideoCameraIcon className="w-3.5 h-3.5 text-emerald-500" />
                            LIVE CLASS
                          </span>
                        )}
                      </div>

                      {/* Per-Stage Progress Bar */}
                      {totalItems > 0 && (status === 'current' || completedCount > 0) && (
                        <div className="mt-3.5 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                            <span className="text-gray-500">
                              {completedCount} of {totalItems} completed
                            </span>
                            <span className={status === 'completed' ? 'text-emerald-600 font-bold' : 'text-[#146ef5] font-bold'}>
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                status === 'completed' ? 'bg-emerald-500' : 'bg-[#146ef5]'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Arrow Icon */}
                    {status === 'current' && (
                      <div className="w-10 h-10 rounded-full bg-gray-50 hover:bg-[#146ef5] hover:text-white flex items-center justify-center text-gray-900 transition-colors shrink-0 self-end sm:self-center shadow-sm">
                        <ArrowRightIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Expandable Lessons & Activities Accordion */}
                  {items.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <div className="px-6 py-2.5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => toggleStageExpand(stage.id, e)}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUpIcon className="w-3.5 h-3.5" />
                              Hide Lesson Outline
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="w-3.5 h-3.5" />
                              View Lesson Outline ({items.length} {items.length === 1 ? 'Activity' : 'Activities'})
                            </>
                          )}
                        </button>

                        {childModules.length > 0 && (
                          <span className="text-[11px] text-gray-400">
                            {childModules.length} {childModules.length === 1 ? 'sub-module' : 'sub-modules'}
                          </span>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="px-6 pb-4 pt-1 space-y-1.5 border-t border-gray-100/60 bg-white">
                          {items.map((item: any, itemIdx: number) => {
                            const isItemCompleted = completedList.includes(itemIdx);
                            return (
                              <div
                                key={item.id || itemIdx}
                                onClick={(e) => {
                                  if (status !== 'locked') {
                                    e.stopPropagation();
                                    router.push(`/dashboard/journey/${stage.id}`);
                                  }
                                }}
                                className={`flex items-center justify-between py-2 px-3 rounded-xl text-xs transition-colors ${
                                  status !== 'locked' 
                                    ? 'hover:bg-blue-50/50 cursor-pointer text-gray-700' 
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {getItemIcon(item.type, isItemCompleted)}
                                  <span className="font-mono text-[11px] text-gray-400">
                                    {itemIdx + 1}.
                                  </span>
                                  <span className={`truncate ${isItemCompleted ? 'line-through text-gray-400' : 'font-medium text-gray-800'}`}>
                                    {(item.title || (String(item.type).toUpperCase() === 'LIVE_CLASS' ? 'LIVE CLASS' : item.type) || `Activity ${itemIdx + 1}`).replace(/LIVE_CLASS/gi, 'LIVE CLASS')}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                    {String(item.type).toUpperCase() === 'LIVE_CLASS' ? 'LIVE CLASS' : (item.type || '').replace(/_/g, ' ')}
                                  </span>
                                  {isItemCompleted && (
                                    <span className="text-[11px] font-semibold text-emerald-600">
                                      Done
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </MotionStagger>
        
        <div className="space-y-6">
          {/* 1. Enhanced Journey Progress Card */}
          <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full filter blur-[2rem] opacity-30"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
                Curriculum Track
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                Stage {currentStage}
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-3 relative z-10">
              <h2 className="text-5xl font-extrabold tracking-tight text-white font-sans">
                {overallProgress}%
              </h2>
              <span className="text-xs font-medium text-blue-100">
                {completedStagesCount} of {stages.length} {stages.length === 1 ? 'module' : 'modules'} done
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-4 relative z-10">
              <div 
                className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>

            <div className="relative z-10 pt-3 border-t border-white/10">
              {allCompleted ? (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-emerald-200 flex items-center gap-1.5 font-semibold">
                    <CheckBadgeSolid className="w-4 h-4 text-emerald-300" />
                    All modules completed!
                  </p>
                  <Link
                    href="/dashboard/certificates"
                    className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                  >
                    View Credential
                  </Link>
                </div>
              ) : activeResumeStage ? (
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] text-blue-200 uppercase tracking-wide font-medium">Up Next</p>
                    <p className="text-xs text-white font-semibold truncate">
                      {(activeResumeStage.title || `Module ${activeResumeStage.stage_number}`).replace(/LIVE_CLASS/gi, 'LIVE CLASS')}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/journey/${activeResumeStage.id}`}
                    className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1"
                  >
                    Resume <ArrowRightIcon className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-blue-100">Keep up the steady pace!</p>
              )}
            </div>
          </div>

          {/* 2. Consistency & Builder XP (Gamification) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Streak Days */}
            <div className="bg-white rounded-[1.25rem] p-4 border border-gray-100 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Streak</span>
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <FireSolid className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 font-sans">
                  {dashboardData?.enrollment?.streak_days || 0}
                </span>
                <span className="text-xs text-gray-500 font-medium">Days</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 truncate">Daily habit streak</p>
            </div>

            {/* Builder XP */}
            <div className="bg-white rounded-[1.25rem] p-4 border border-gray-100 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Builder XP</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrophyIcon className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 font-sans">
                  {(dashboardData?.enrollment?.current_xp || 0).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 font-medium">XP</span>
              </div>
              <p className="text-[11px] font-semibold text-purple-600 mt-1 flex items-center gap-1">
                <StarSolid className="w-3 h-3 text-amber-400" />
                {dashboardData?.enrollment?.level || 'Novice'}
              </p>
            </div>
          </div>

          {/* 3. Upcoming Milestone */}
          {dashboardData?.upcoming_milestone && (
            <div className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#146ef5] flex items-center justify-center">
                    <ClockIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500">Next Milestone</h4>
                </div>
                {dashboardData.upcoming_milestone.time && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#146ef5]">
                    {dashboardData.upcoming_milestone.time}
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-gray-900 mb-1">
                {(dashboardData.upcoming_milestone.title || '').replace(/LIVE_CLASS/gi, 'LIVE CLASS')}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                {(dashboardData.upcoming_milestone.description || '').replace(/LIVE_CLASS/gi, 'LIVE CLASS')}
              </p>

              {dashboardData.upcoming_milestone.title?.toLowerCase().includes('project') ? (
                <Link
                  href="/dashboard/projects"
                  className="w-full bg-gray-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RocketLaunchIcon className="w-4 h-4 text-amber-400" />
                  View Capstone Projects
                </Link>
              ) : dashboardData.upcoming_milestone.title?.toLowerCase().includes('live') ? (
                <Link
                  href="/dashboard"
                  className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#146ef5]/20"
                >
                  <VideoCameraIcon className="w-4 h-4" />
                  Join Live Room
                </Link>
              ) : (
                <button
                  onClick={() => {
                    if (activeResumeStage) {
                      router.push(`/dashboard/journey/${activeResumeStage.id}`);
                    }
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  Continue Milestone Task
                </button>
              )}
            </div>
          )}

          {/* 4. Mentor Guidance & Review */}
          <div className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                </div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  {mentorTitle} Guidance
                </h4>
              </div>
            </div>

            {dashboardData?.recent_feedback ? (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {(dashboardData.recent_feedback.mentor_name || mentorTitle).charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        {dashboardData.recent_feedback.mentor_name || mentorTitle}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {dashboardData.recent_feedback.project_name || 'Project Review'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dashboardData.recent_feedback.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {dashboardData.recent_feedback.status === 'APPROVED' ? 'Approved' : 'Revision'}
                  </span>
                </div>

                <p className="text-xs text-gray-700 italic border-l-2 border-emerald-400 pl-2.5 py-0.5 leading-relaxed line-clamp-3">
                  "{dashboardData.recent_feedback.content}"
                </p>

                <Link
                  href="/dashboard/projects"
                  className="inline-flex text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors pt-1"
                >
                  View full project review →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Need unblocking or feedback on your assignments? Submit your stage deliverables or reach out to your {mentorTitle.toLowerCase()} for direct guidance.
                </p>
                <Link
                  href="/dashboard/projects"
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <RocketLaunchIcon className="w-3.5 h-3.5 text-gray-500" />
                  View Project Submissions
                </Link>
              </div>
            )}
          </div>

          {/* 5. Cohort Info & Quick Links */}
          <div className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">
              Cohort Navigation
            </h4>

            {dashboardData?.cohort_name && (
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-400">Enrolled In</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {dashboardData.cohort_name}
                </p>
                {journeyData?.cohort_end_date && (
                  <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                    Ends: {formatScheduleDate(journeyData.cohort_end_date)}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Link
                href="/dashboard/projects"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#146ef5] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RocketLaunchIcon className="w-4 h-4 text-gray-400" />
                  Capstone Projects
                </span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/certificates"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#146ef5] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-gray-400" />
                  Certificates & Badges
                </span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#146ef5] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  Cohort Classroom & Peers
                </span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MotionRise>
  );
}
