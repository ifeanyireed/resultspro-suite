"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FolderOpenIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  VideoCameraIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  PresentationChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  StarIcon as StarSolid,
  CheckBadgeIcon as CheckBadgeSolid,
  SparklesIcon as SparklesSolid
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

type FilterTab = 'ALL' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REVISION';

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  // Modals state
  const [submittingProject, setSubmittingProject] = useState<any | null>(null);
  const [reviewingProject, setReviewingProject] = useState<any | null>(null);

  // Submission Form State
  const [repoUrl, setRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 1. Dashboard summary to get cohort info & terminology
  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ['student-dashboard-summary', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/dashboard/summary');
      return res.data;
    },
    enabled: !!user
  });

  const cohortId = dashboardData?.cohort_id;
  const mentorTitle = dashboardData?.mentor_terminology || 'Mentor';

  // 2. Student Projects List from coursesApi
  const { 
    data: projectsData, 
    isLoading: loadingProjects, 
    refetch: refetchProjects 
  } = useQuery({
    queryKey: ['student_projects', cohortId],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/projects');
      return res.data;
    },
    enabled: !!dashboardData?.has_enrollment
  });

  // 3. User's full project submission history
  const { 
    data: submissionsData, 
    refetch: refetchSubmissions 
  } = useQuery({
    queryKey: ['my_submissions', cohortId],
    queryFn: async () => {
      const res = await coursesApi.get('/api/projects/my-submissions');
      return res.data;
    },
    enabled: !!dashboardData?.has_enrollment
  });

  const projects = projectsData?.projects || [];
  const submissions = submissionsData?.submissions || [];

  // Map submissions by stage_number and lowercase project title
  const submissionMap = useMemo(() => {
    const map: Record<string, any> = {};
    if (Array.isArray(submissions)) {
      submissions.forEach((sub: any) => {
        const key = `${sub.stage_number}-${(sub.project_title || '').trim().toLowerCase()}`;
        map[key] = sub;
      });
    }
    return map;
  }, [submissions]);

  const getSubmissionForProject = (proj: any) => {
    const key = `${proj.stage_number}-${(proj.title || '').trim().toLowerCase()}`;
    return submissionMap[key] || submissions.find((s: any) => s.stage_number === proj.stage_number);
  };

  // Metrics counts
  const allCount = projects.length;
  const submittedCount = projects.filter((p: any) => 
    p.status === 'Submitted' || p.status === 'MENTOR_REVIEW'
  ).length;
  const approvedCount = projects.filter((p: any) => 
    p.status === 'Approved' || p.status === 'APPROVED'
  ).length;
  const revisionCount = projects.filter((p: any) => 
    p.status === 'Needs Revision' || p.status === 'REVISION_REQUESTED'
  ).length;
  const inProgressCount = projects.filter((p: any) => 
    p.status === 'In Progress'
  ).length;

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeTab === 'APPROVED') {
      return projects.filter((p: any) => p.status === 'Approved' || p.status === 'APPROVED');
    }
    if (activeTab === 'SUBMITTED') {
      return projects.filter((p: any) => p.status === 'Submitted' || p.status === 'MENTOR_REVIEW');
    }
    if (activeTab === 'REVISION') {
      return projects.filter((p: any) => p.status === 'Needs Revision' || p.status === 'REVISION_REQUESTED');
    }
    if (activeTab === 'IN_PROGRESS') {
      return projects.filter((p: any) => p.status === 'In Progress');
    }
    return projects;
  }, [projects, activeTab]);

  // Open submission modal
  const openSubmissionModal = (proj: any) => {
    const existing = getSubmissionForProject(proj);
    setSubmittingProject(proj);
    setRepoUrl(existing?.repo_url || '');
    setLiveDemoUrl(existing?.live_demo_url || '');
    setFigmaUrl(existing?.figma_url || '');
    setNotes(existing?.notes || '');
    setSubmitError('');
    setSubmitSuccess(false);
  };

  // Open review details modal
  const openReviewModal = (proj: any) => {
    setReviewingProject(proj);
  };

  // Submit project handler
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim() && !liveDemoUrl.trim() && !notes.trim()) {
      setSubmitError('Please provide at least a Repository URL, Live Demo URL, or Deliverable Summary.');
      return;
    }

    if (!cohortId) {
      setSubmitError('No active cohort found for submission.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await coursesApi.post('/api/projects/submit', {
        cohort_id: cohortId,
        stage_number: submittingProject.stage_number || 1,
        project_title: submittingProject.title,
        repo_url: repoUrl.trim(),
        live_demo_url: liveDemoUrl.trim(),
        figma_url: figmaUrl.trim(),
        notes: notes.trim(),
      });

      setSubmitSuccess(true);
      await refetchProjects();
      await refetchSubmissions();

      setTimeout(() => {
        setSubmittingProject(null);
        setSubmitSuccess(false);
      }, 1200);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.error || err.message || 'Failed to submit project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loadingDashboard || loadingProjects) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-100 rounded-lg w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-56 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Unenrolled State
  if (dashboardData && (!dashboardData.has_enrollment || !dashboardData.cohort_id)) {
    return (
      <div className="w-full py-6">
        <div className="mb-8 mt-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projects & Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">Submit your deliverables and receive direct {mentorTitle} evaluations.</p>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center mx-auto">
            <RocketLaunchIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Cohort Enrollment</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
              You are not currently enrolled in an active learning cohort. Join an active cohort to unlock capstone deliverables, code reviews, and direct {mentorTitle.toLowerCase()} guidance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/courses"
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

  return (
    <MotionRise>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 mt-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projects & Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Build capstone deliverables, submit code, and get evaluated by your {mentorTitle}.
          </p>
        </div>

        <Link
          href="/dashboard/journey"
          className="self-start sm:self-auto px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-full shadow-sm transition-colors flex items-center gap-2"
        >
          <BookOpenIcon className="w-4 h-4 text-gray-400" />
          View Journey Map
        </Link>
      </div>

      {/* Top Velocity Metric Cards */}
      <MotionStagger className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Deliverables</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <FolderOpenIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900 font-sans">{allCount}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Cohort milestones</p>
          </div>
        </div>

        {/* Card 2: Approved */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Approved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckBadgeSolid className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600 font-sans">{approvedCount}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Passed requirements</p>
          </div>
        </div>

        {/* Card 3: Under Review */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Under Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClockIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600 font-sans">{submittedCount}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Awaiting feedback</p>
          </div>
        </div>

        {/* Card 4: Needs Revision */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Revisions</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600 font-sans">{revisionCount}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Action requested</p>
          </div>
        </div>
      </MotionStagger>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'ALL'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Deliverables ({allCount})
        </button>

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-[#146ef5] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Open & In Progress ({inProgressCount})
        </button>

        <button
          onClick={() => setActiveTab('SUBMITTED')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'SUBMITTED'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Under Review ({submittedCount})
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'APPROVED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Approved ({approvedCount})
        </button>

        {revisionCount > 0 && (
          <button
            onClick={() => setActiveTab('REVISION')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'REVISION'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            Needs Revision ({revisionCount})
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-[1.5rem] p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
            <FolderOpenIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No deliverables found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {activeTab === 'ALL'
              ? 'Your instructor is finalizing the milestone deliverables for this cohort.'
              : `There are currently no deliverables matching the "${activeTab.toLowerCase().replace('_', ' ')}" filter.`}
          </p>
        </div>
      ) : (
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj: any, idx: number) => {
            const isLocked = proj.status === 'Locked';
            const submission = getSubmissionForProject(proj);
            const isSubmitted = proj.status === 'Submitted' || proj.status === 'MENTOR_REVIEW' || !!submission;
            const isApproved = proj.status === 'Approved' || proj.status === 'APPROVED' || submission?.status === 'APPROVED';
            const isRevision = proj.status === 'Needs Revision' || proj.status === 'REVISION_REQUESTED' || submission?.status === 'REVISION_REQUESTED';

            return (
              <div 
                key={proj.id || idx}
                className={`bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden ${
                  isLocked ? 'opacity-60 bg-gray-50/50' : ''
                }`}
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isApproved ? 'bg-emerald-50 text-emerald-600' :
                        isRevision ? 'bg-rose-50 text-rose-600' :
                        isSubmitted ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-[#146ef5]'
                      }`}>
                        {proj.type === 'PROJECT' ? (
                          <RocketLaunchIcon className="w-4 h-4" />
                        ) : (
                          <FolderOpenIcon className="w-4 h-4" />
                        )}
                      </div>

                      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        Stage {proj.stage_number || 1}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      isRevision ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      isSubmitted ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      isLocked ? 'bg-gray-100 text-gray-400 border-gray-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {isApproved ? '✓ Approved' :
                       isRevision ? '⚠ Revision Requested' :
                       isSubmitted ? '⏳ Under Review' :
                       isLocked ? 'Locked' : 'In Progress'}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {proj.desc || 'Complete the deliverables for this curriculum stage and submit for mentor evaluation.'}
                  </p>

                  {/* Submission Links Preview (if submitted) */}
                  {submission && (
                    <div className="mb-4 pt-3 border-t border-gray-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block">
                        Submitted Links
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {submission.repo_url && (
                          <a
                            href={submission.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[11px] font-medium text-gray-700 transition-colors"
                          >
                            <CodeBracketIcon className="w-3.5 h-3.5 text-gray-500" />
                            Repository
                            <ArrowTopRightOnSquareIcon className="w-3 h-3 text-gray-400" />
                          </a>
                        )}

                        {submission.live_demo_url && (
                          <a
                            href={submission.live_demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-[11px] font-semibold text-[#146ef5] transition-colors"
                          >
                            <GlobeAltIcon className="w-3.5 h-3.5 text-[#146ef5]" />
                            Live Demo
                            <ArrowTopRightOnSquareIcon className="w-3 h-3 text-blue-400" />
                          </a>
                        )}

                        {submission.figma_url && (
                          <a
                            href={submission.figma_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100/70 border border-purple-200 text-[11px] font-semibold text-purple-700 transition-colors"
                          >
                            <SparklesIcon className="w-3.5 h-3.5 text-purple-500" />
                            Figma
                            <ArrowTopRightOnSquareIcon className="w-3 h-3 text-purple-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mentor Feedback Snippet (if reviewed) */}
                  {submission?.mentor_feedback && (
                    <div 
                      onClick={() => openReviewModal(proj)}
                      className="mb-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 cursor-pointer hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 mb-1">
                        <span className="flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-emerald-600" />
                          {mentorTitle} Review
                        </span>
                        {submission.mentor_rating > 0 && (
                          <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-700">
                            ★ {submission.mentor_rating}/100
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-800 italic line-clamp-2">
                        "{submission.mentor_feedback}"
                      </p>
                      <span className="text-[10px] font-bold text-emerald-700 mt-1 inline-block">
                        Read full evaluation →
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <ClockIcon className="w-3.5 h-3.5" />
                    Due: {proj.due || 'TBD'}
                  </div>

                  <div className="flex items-center gap-2">
                    {submission && (
                      <button
                        onClick={() => openReviewModal(proj)}
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                      >
                        Details
                      </button>
                    )}

                    {!isLocked && (
                      <button
                        onClick={() => openSubmissionModal(proj)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
                          isRevision
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : isSubmitted
                              ? 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                              : 'bg-[#146ef5] hover:bg-[#105bd1] text-white shadow-[#146ef5]/20'
                        }`}
                      >
                        {isRevision ? (
                          <>
                            <ArrowPathIcon className="w-3.5 h-3.5" />
                            Resubmit
                          </>
                        ) : isSubmitted ? (
                          <>
                            <ArrowPathIcon className="w-3.5 h-3.5" />
                            Update
                          </>
                        ) : (
                          <>
                            <RocketLaunchIcon className="w-3.5 h-3.5" />
                            Submit Deliverable
                          </>
                        )}
                      </button>
                    )}

                    {isLocked && (
                      <span className="text-xs font-medium text-gray-400">
                        Unlock in Journey
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </MotionStagger>
      )}

      {/* 1. Project Submission Modal */}
      {submittingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Submit Project Deliverable
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">
                  Stage {submittingProject.stage_number || 1} • {submittingProject.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmittingProject(null)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-3.5">
              {/* Repo URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  GitHub / Git Repository URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <CodeBracketIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Live Demo URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Live Deployment / Preview URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <GlobeAltIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://my-project.vercel.app"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Figma / Design Spec URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Design Spec / Figma URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <SparklesIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Student Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Notes & Walkthrough for your {mentorTitle}
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your implementation, design choices, testing credentials, or questions..."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent font-sans"
                />
              </div>

              {/* Error banner */}
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {submitError}
                </div>
              )}

              {/* Success banner */}
              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                  Deliverable successfully submitted to your {mentorTitle.toLowerCase()}!
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSubmittingProject(null)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || submitSuccess}
                  className="px-5 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    `Submit to ${mentorTitle}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Review Details Modal */}
      {reviewingProject && (() => {
        const submission = getSubmissionForProject(reviewingProject);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Project Deliverable Details
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">
                    {reviewingProject.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewingProject(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Status Bar */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500">Evaluation Status</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    submission?.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    submission?.status === 'REVISION_REQUESTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {submission?.status === 'APPROVED' ? '✓ Approved' :
                     submission?.status === 'REVISION_REQUESTED' ? '⚠ Revision Requested' :
                     '⏳ Under Mentor Review'}
                  </span>
                </div>

                {/* Mentor Feedback Block */}
                {submission?.mentor_feedback ? (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs uppercase font-bold text-emerald-900 flex items-center gap-1.5">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
                        {mentorTitle} Feedback
                      </h4>
                      {submission.mentor_rating > 0 && (
                        <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          Rating: {submission.mentor_rating}/100
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-900 italic leading-relaxed pt-1 whitespace-pre-wrap">
                      "{submission.mentor_feedback}"
                    </p>
                    {submission.video_review_url && (
                      <div className="pt-2">
                        <a
                          href={submission.video_review_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <VideoCameraIcon className="w-3.5 h-3.5" />
                          Watch Video Review Walkthrough
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-800">
                    Your {mentorTitle.toLowerCase()} has received your deliverables and is scheduled to review them shortly.
                  </div>
                )}

                {/* Submitted Links */}
                {submission && (
                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <h4 className="text-xs uppercase font-bold text-gray-500">
                      Your Submitted Deliverables
                    </h4>

                    <div className="space-y-1.5">
                      {submission.repo_url && (
                        <a
                          href={submission.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-gray-700 font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <CodeBracketIcon className="w-4 h-4 text-gray-500 shrink-0" />
                            {submission.repo_url}
                          </span>
                          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        </a>
                      )}

                      {submission.live_demo_url && (
                        <a
                          href={submission.live_demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/50 hover:bg-blue-50 border border-blue-200 text-xs text-[#146ef5] font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <GlobeAltIcon className="w-4 h-4 text-[#146ef5] shrink-0" />
                            {submission.live_demo_url}
                          </span>
                          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        </a>
                      )}

                      {submission.figma_url && (
                        <a
                          href={submission.figma_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/50 hover:bg-purple-50 border border-purple-200 text-xs text-purple-700 font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <SparklesIcon className="w-4 h-4 text-purple-500 shrink-0" />
                            {submission.figma_url}
                          </span>
                          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        </a>
                      )}
                    </div>

                    {submission.notes && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-gray-400 block mb-1">
                          Submission Notes
                        </span>
                        <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 whitespace-pre-wrap">
                          {submission.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    const proj = reviewingProject;
                    setReviewingProject(null);
                    openSubmissionModal(proj);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#146ef5] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  {submission?.status === 'REVISION_REQUESTED' ? 'Resubmit Deliverables' : 'Edit Submission'}
                </button>

                <button
                  type="button"
                  onClick={() => setReviewingProject(null)}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </MotionRise>
  );
}
