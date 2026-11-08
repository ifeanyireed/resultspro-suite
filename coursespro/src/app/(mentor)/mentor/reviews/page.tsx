"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  DocumentTextIcon, 
  CodeBracketIcon, 
  LinkIcon, 
  ArrowPathIcon,
  XMarkIcon,
  VideoCameraIcon,
  SparklesIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface ProjectSubmission {
  id: string;
  user_id: string;
  student_name?: string;
  student_avatar?: string;
  cohort_id: string;
  cohort_title?: string;
  stage_number: number;
  project_title: string;
  repo_url: string;
  figma_url: string;
  live_demo_url: string;
  notes: string;
  submitted_at: string;
}

interface BlockSubmission {
  id: string;
  user_id: string;
  student_name?: string;
  student_avatar?: string;
  module_id: string;
  module_title?: string;
  block_id: string;
  block_type: string;
  submission_type: string;
  content: string;
  score?: number;
  status: string;
  submitted_at: string;
}

export default function MentorReviews() {
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'BLOCKS'>('PROJECTS');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Project review modal state
  const [selectedSub, setSelectedSub] = useState<ProjectSubmission | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Block review modal state
  const [selectedBlock, setSelectedBlock] = useState<BlockSubmission | null>(null);
  const [blockScore, setBlockScore] = useState<number>(100);
  const [blockFeedback, setBlockFeedback] = useState('');

  const queryClient = useQueryClient();

  // 1. Fetch Capstone Project Submissions
  const { 
    data: projectSubmissions = [], 
    isLoading: loadingProjects, 
    refetch: refetchProjects 
  } = useQuery<ProjectSubmission[]>({
    queryKey: ['mentor-submissions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/submissions');
      return res.data.submissions || [];
    }
  });

  // 2. Fetch Module Block Submissions (Assignments, Compiler code, Quizzes)
  const { 
    data: blockSubmissions = [], 
    isLoading: loadingBlocks, 
    refetch: refetchBlocks 
  } = useQuery<BlockSubmission[]>({
    queryKey: ['mentor-block-submissions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/submissions/blocks');
      return res.data.submissions || [];
    }
  });

  // Review mutation for Project Capstones
  const projectReviewMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'APPROVED' | 'REVISION_REQUESTED' }) => {
      const res = await coursesApi.post(`/api/mentor/submissions/${id}/review`, {
        status,
        mentor_rating: rating,
        mentor_feedback: feedback,
        video_review_url: videoUrl
      });
      return res.data;
    },
    onMutate: (variables) => {
      setSubmittingId(variables.id);
    },
    onSuccess: (_, variables) => {
      toast.success(variables.status === 'APPROVED' ? 'Project approved & XP awarded!' : 'Revision requested from student');
      queryClient.invalidateQueries({ queryKey: ['mentor-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-profile-dashboard'] });
      setSelectedSub(null);
      setFeedback('');
      setVideoUrl('');
      setRating(5);
    },
    onError: (err) => {
      toast.error('Failed to record review evaluation');
      console.error('Failed to submit project review', err);
    },
    onSettled: () => {
      setSubmittingId(null);
    }
  });

  // Review mutation for Module Block Submissions
  const blockReviewMutation = useMutation({
    mutationFn: async ({ id, score, feedback }: { id: string, score: number, feedback: string }) => {
      const res = await coursesApi.post(`/api/mentor/submissions/blocks/${id}/review`, {
        mentor_feedback: feedback,
        score,
        status: 'REVIEWED'
      });
      return res.data;
    },
    onMutate: (variables) => {
      setSubmittingId(variables.id);
    },
    onSuccess: () => {
      toast.success('Assignment graded & feedback sent to student!');
      queryClient.invalidateQueries({ queryKey: ['mentor-block-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-profile-dashboard'] });
      setSelectedBlock(null);
      setBlockFeedback('');
      setBlockScore(100);
    },
    onError: (err) => {
      toast.error('Failed to record block submission review');
      console.error('Failed to submit block review', err);
    },
    onSettled: () => {
      setSubmittingId(null);
    }
  });

  const handleProjectReview = (status: 'APPROVED' | 'REVISION_REQUESTED') => {
    if (!selectedSub) return;
    if (!feedback.trim()) {
      toast.error('Please provide actionable feedback for the student');
      return;
    }
    projectReviewMutation.mutate({ id: selectedSub.id, status });
  };

  const handleBlockReview = () => {
    if (!selectedBlock) return;
    if (!blockFeedback.trim()) {
      toast.error('Please provide constructive feedback for the student');
      return;
    }
    blockReviewMutation.mutate({ 
      id: selectedBlock.id, 
      score: Number(blockScore), 
      feedback: blockFeedback 
    });
  };

  const isCurrentLoading = activeTab === 'PROJECTS' ? loadingProjects : loadingBlocks;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
              Code Review Evaluation Studio
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            Inspect student GitHub repositories, evaluate design specs, and grade module assignment submissions.
          </p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'PROJECTS') refetchProjects();
            else refetchBlocks();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-xs text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isCurrentLoading ? 'animate-spin text-[#146ef5]' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab('PROJECTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PROJECTS' 
              ? 'bg-[#146ef5] text-white shadow-xs' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CodeBracketIcon className="w-4 h-4" />
          Capstone Projects
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'PROJECTS' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {projectSubmissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('BLOCKS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'BLOCKS' 
              ? 'bg-[#146ef5] text-white shadow-xs' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ClipboardDocumentCheckIcon className="w-4 h-4" />
          Module Assignments & Tasks
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'BLOCKS' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {blockSubmissions.length}
          </span>
        </button>
      </div>

      {/* Main Review Queue */}
      {isCurrentLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 font-medium text-xs">Loading pending submissions...</p>
        </div>
      ) : activeTab === 'PROJECTS' ? (
        // 1. Projects Queue
        projectSubmissions.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-xs text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">All Project Reviews Completed!</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              Your capstone evaluation queue is completely clear. Student project submissions will appear here automatically when submitted.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xs">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Project Submission Backlog</h3>
                <p className="text-xs text-gray-400 mt-0.5">Click any row to open the grading studio.</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-amber-100 text-amber-800 rounded-full uppercase tracking-wider">
                {projectSubmissions.length} Awaiting Signoff
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="px-6 py-4">Student Builder</th>
                    <th className="px-6 py-4">Project Title</th>
                    <th className="px-6 py-4">Cohort Track</th>
                    <th className="px-6 py-4">Stage</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projectSubmissions.map((sub) => (
                    <tr 
                      key={sub.id} 
                      onClick={() => setSelectedSub(sub)}
                      className={`cursor-pointer transition-colors ${
                        selectedSub?.id === sub.id ? 'bg-blue-50/40' : 'hover:bg-gray-50/70'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                            <img 
                              src={sub.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.student_name || 'Student')}&background=146ef5&color=fff`} 
                              alt={sub.student_name || 'Student'} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span className="font-bold text-gray-900">
                            {sub.student_name || 'Student Builder'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {sub.project_title}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                          <AcademicCapIcon className="w-3.5 h-3.5 text-gray-500" />
                          {sub.cohort_title || 'Enrolled Cohort'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5] uppercase">
                          Stage {sub.stage_number}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#146ef5] text-[#146ef5] hover:text-white font-bold transition-all text-xs">
                          Review →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        // 2. Block Submissions Queue
        blockSubmissions.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-xs text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckBadgeIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">All Assignment Reviews Completed!</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              No module block exercises or code submissions are currently pending your evaluation.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xs">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Module Task Submissions</h3>
                <p className="text-xs text-gray-400 mt-0.5">Click any item to inspect code, view student answers, and assign scores.</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-blue-100 text-[#146ef5] rounded-full uppercase tracking-wider">
                {blockSubmissions.length} Pending Evaluation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Module / Stage</th>
                    <th className="px-6 py-4">Task Type</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blockSubmissions.map((bSub) => (
                    <tr 
                      key={bSub.id} 
                      onClick={() => {
                        setSelectedBlock(bSub);
                        setBlockScore(bSub.score ?? 100);
                      }}
                      className={`cursor-pointer transition-colors ${
                        selectedBlock?.id === bSub.id ? 'bg-blue-50/40' : 'hover:bg-gray-50/70'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                            <img 
                              src={bSub.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(bSub.student_name || 'Student')}&background=146ef5&color=fff`} 
                              alt={bSub.student_name || 'Student'} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span className="font-bold text-gray-900">
                            {bSub.student_name || 'Student Builder'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {bSub.module_title || 'Module Curriculum Task'}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase">
                          {bSub.block_type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                        {bSub.submission_type || 'TEXT'}
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {new Date(bSub.submitted_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#146ef5] text-[#146ef5] hover:text-white font-bold transition-all text-xs">
                          Grade →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* 1. Capstone Project Review Modal Studio */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setSelectedSub(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[92vh] border border-gray-100"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Project Evaluation Studio</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedSub.student_name || 'Student Builder'} · Stage {selectedSub.stage_number} Capstone
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedSub(null)} 
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Project Overview & Deliverables */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{selectedSub.project_title}</h4>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        Submitted {new Date(selectedSub.submitted_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedSub.repo_url && (
                        <a 
                          href={selectedSub.repo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-gray-800 border border-gray-200 hover:border-blue-400 font-bold transition-colors shadow-2xs"
                        >
                          <CodeBracketIcon className="w-3.5 h-3.5 text-[#146ef5]" /> GitHub
                        </a>
                      )}
                      {selectedSub.live_demo_url && (
                        <a 
                          href={selectedSub.live_demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-gray-800 border border-gray-200 hover:border-emerald-400 font-bold transition-colors shadow-2xs"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-emerald-600" /> Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {selectedSub.notes && (
                    <div className="pt-2 border-t border-gray-200/60">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Student Implementation Notes</p>
                      <p className="text-gray-700 mt-1 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 whitespace-pre-wrap">
                        {selectedSub.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Rating Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Instructor Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <StarIcon 
                          className={`w-7 h-7 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-600 ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Written Feedback Textarea */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Written Technical Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide specific feedback on code architecture, test coverage, UI polish, or revision requirements..."
                    className="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5] transition-all"
                  />
                </div>

                {/* Optional Loom / Video Feedback */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Video Code Walkthrough URL (Loom, YouTube, MP4 - Optional)
                  </label>
                  <div className="relative">
                    <VideoCameraIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.loom.com/share/..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleProjectReview('REVISION_REQUESTED')}
                    disabled={projectReviewMutation.isPending}
                    className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Request Revision
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProjectReview('APPROVED')}
                    disabled={projectReviewMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Approve & Award XP
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Module Block Submission Evaluation Modal Studio */}
      <AnimatePresence>
        {selectedBlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setSelectedBlock(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[92vh] border border-gray-100"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Module Assignment Evaluation</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedBlock.student_name || 'Student Builder'} · {selectedBlock.module_title || 'Module Exercise'}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedBlock(null)} 
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Submission Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Student Work ({selectedBlock.block_type} · {selectedBlock.submission_type || 'TEXT'})
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Submitted {new Date(selectedBlock.submitted_at).toLocaleString()}
                    </span>
                  </div>

                  {selectedBlock.submission_type === 'CODE' ? (
                    <div className="bg-gray-950 text-gray-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-gray-800 max-h-64">
                      <pre>{selectedBlock.content}</pre>
                    </div>
                  ) : selectedBlock.content?.startsWith('http') ? (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                      <span className="truncate text-gray-700 font-mono text-xs max-w-md">{selectedBlock.content}</span>
                      <a 
                        href={selectedBlock.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#146ef5] text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0 hover:bg-blue-600 transition-colors"
                      >
                        <LinkIcon className="w-3.5 h-3.5" /> View Deliverable
                      </a>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-gray-800 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                      {selectedBlock.content}
                    </div>
                  )}
                </div>

                {/* Score Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Assignment Score (0 - 100 Points)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={blockScore}
                    onChange={(e) => setBlockScore(Number(e.target.value))}
                    className="w-32 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                  />
                </div>

                {/* Written Feedback Textarea */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Instructor Evaluation & Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={blockFeedback}
                    onChange={(e) => setBlockFeedback(e.target.value)}
                    placeholder="Provide constructive feedback, notes on strengths, and actionable improvements for the student..."
                    className="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5] transition-all"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedBlock(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleBlockReview}
                  disabled={blockReviewMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#146ef5] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Submit Grade & Evaluation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
