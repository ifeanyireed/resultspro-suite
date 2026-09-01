"use client";
import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Mock user_id header since auth isn't fully wired yet
      const res = await fetch('http://localhost:8080/mentor/submissions', {
        headers: {
          'x-user-id': 'mentor-user-1',
          'x-tenant-id': 'tenant-1'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleReview = async (status: 'APPROVED' | 'REVISION_REQUESTED') => {
    if (!selectedSub) return;
    setSubmitting(selectedSub.id);
    
    try {
      const res = await fetch(`http://localhost:8080/mentor/submissions/${selectedSub.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'mentor-user-1',
          'x-tenant-id': 'tenant-1'
        },
        body: JSON.stringify({
          status,
          mentor_rating: rating,
          mentor_feedback: feedback,
          video_review_url: videoUrl
        })
      });

      if (res.ok) {
        setSubmissions(submissions.filter(s => s.id !== selectedSub.id));
        setSelectedSub(null);
        setFeedback('');
        setVideoUrl('');
        setRating(5);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Evaluate and grade builder project submissions.</p>
        </div>
        <button 
          onClick={fetchSubmissions}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 mb-4 px-2">Submissions ({submissions.length})</h3>
            {submissions.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => setSelectedSub(sub)}
                className={`bg-white rounded-xl p-5 border cursor-pointer transition-all shadow-sm ${selectedSub?.id === sub.id ? 'border-[#146ef5] ring-1 ring-[#146ef5]' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{sub.project_title}</h4>
                  <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded text-uppercase tracking-wider">Review Required</span>
                </div>
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <span>Student ID: {sub.user_id.slice(0, 8)}...</span>
                  <span>•</span>
                  <span>Stage {sub.stage_number}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#146ef5]">
                  {sub.repo_url && (
                    <a href={sub.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline" onClick={e => e.stopPropagation()}>
                      <CodeBracketIcon className="w-4 h-4" /> Code
                    </a>
                  )}
                  {sub.live_demo_url && (
                    <a href={sub.live_demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline" onClick={e => e.stopPropagation()}>
                      <LinkIcon className="w-4 h-4" /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedSub && (
            <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col h-fit sticky top-6">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedSub.project_title}</h3>
                <p className="text-sm text-gray-500">Submitted on {new Date(selectedSub.submitted_at).toLocaleDateString()}</p>
                
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
