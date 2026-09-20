"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { 
  CheckCircleIcon,
  DocumentDuplicateIcon, 
  XCircleIcon,
  DocumentTextIcon, 
  CodeBracketIcon, 
  LinkIcon, 
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface Submission {
  id: string;
  user_id: string;
  project_title: string;
  cohort_id: string;
  stage_number: number;
  repo_url: string;
  figma_url: string;
  live_demo_url: string;
  notes: string;
  submitted_at: string;
}

export default function MentorReviews() {
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['mentor-submissions'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/submissions');
      return res.data.submissions || [];
    }
  });

  const reviewMutation = useMutation({
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
      setSubmitting(variables.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-submissions'] });
      setSelectedSub(null);
      setFeedback('');
      setVideoUrl('');
      setRating(5);
    },
    onError: (err) => {
      console.error('Failed to submit review', err);
    },
    onSettled: () => {
      setSubmitting(null);
    }
  });

  const handleReview = (status: 'APPROVED' | 'REVISION_REQUESTED') => {
    if (!selectedSub) return;
    reviewMutation.mutate({ id: selectedSub.id, status });
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Evaluate and grade builder project submissions.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Pending Reviews</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><DocumentDuplicateIcon className="w-4 h-4"/></div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{submissions?.length || 0}</h2>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Evaluated Today</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><CheckCircleIcon className="w-4 h-4" /></div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">0</h2>
          </div>
        </div>
      </div>

{loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146ef5]"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-[1.5rem] p-12 border border-gray-100 shadow-sm text-center">
          <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No pending reviews</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">Your queue is completely clear! Take a break or check back later for new submissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden shadow-sm h-fit">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-semibold text-gray-900">Submissions Queue</h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full uppercase tracking-wider">{submissions.length} Pending</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Project</th>
                    <th className="px-6 py-4 font-medium">Student</th>
                    <th className="px-6 py-4 font-medium">Stage</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.map((sub: any) => (
                    <tr 
                      key={sub.id} 
                      onClick={() => setSelectedSub(sub)}
                      className={`cursor-pointer transition-colors ${selectedSub?.id === sub.id ? 'bg-[#f6f9f8]' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{sub.project_title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono bg-gray-100 px-2 py-1 rounded inline-block">{sub.user_id.slice(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          Stage {sub.stage_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-semibold text-[#146ef5] hover:text-blue-700 transition-colors">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedSub && (
            <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col h-fit sticky top-6">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedSub.project_title}</h3>
                    <p className="text-sm text-gray-500">Submitted on {new Date(selectedSub.submitted_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedSub.repo_url && (
                      <a href={selectedSub.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        <CodeBracketIcon className="w-4 h-4 stroke-2" /> Code
                      </a>
                    )}
                    {selectedSub.live_demo_url && (
                      <a href={selectedSub.live_demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        <LinkIcon className="w-4 h-4 stroke-2" /> Demo
                      </a>
                    )}
                  </div>
                </div>
                
                {selectedSub.notes && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    <span className="font-semibold text-gray-900 block mb-1">Student Notes:</span>
                    {selectedSub.notes}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (Out of 5)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <StarIcon 
                        key={star} 
                        className={`w-8 h-8 cursor-pointer ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback / Critique</label>
                  <textarea 
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl p-3 text-sm text-gray-700 shadow-sm transition-colors"
                    placeholder="Provide constructive feedback..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Review URL (Loom, Optional)</label>
                  <input 
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl p-3 text-sm text-gray-700 shadow-sm transition-colors"
                    placeholder="https://loom.com/share/..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <button 
                  disabled={submitting === selectedSub.id}
                  onClick={() => handleReview('APPROVED')}
                  className="flex-1 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Approve Project
                </button>
                <button 
                  disabled={submitting === selectedSub.id}
                  onClick={() => handleReview('REVISION_REQUESTED')}
                  className="flex-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <XCircleIcon className="w-5 h-5" />
                  Request Revision
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
