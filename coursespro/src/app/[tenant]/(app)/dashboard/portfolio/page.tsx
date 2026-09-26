"use client";
import React, { useState, useEffect } from 'react';
import { GlobeAltIcon, LinkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function PortfolioPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    headline: '',
    bio: '',
    is_available_for_hire: true,
    is_published: false,
    case_studies_json: '[]'
  });

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/portfolio');
      return res.data;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (data?.portfolio) {
      setFormData({
        username: data.portfolio.username || user?.username || '',
        headline: data.portfolio.headline || '',
        bio: data.portfolio.bio || '',
        is_available_for_hire: data.portfolio.is_available_for_hire,
        is_published: data.portfolio.is_published,
        case_studies_json: data.portfolio.case_studies_json || '[]'
      });
    }
  }, [data, user]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await coursesApi.post('/api/portfolio', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Portfolio updated successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update portfolio');
    }
  });

  const handleSave = (publishState?: boolean) => {
    const isPub = publishState !== undefined ? publishState : formData.is_published;
    mutation.mutate({
      ...formData,
      is_published: isPub,
      // If the user hasn't set a username, default to their ID or generic name to avoid errors
      username: formData.username || `user_${user?.id?.substring(0, 8)}`
    });
  };

  const approvedProjects = data?.approved_projects || [];
  let caseStudies: any[] = [];
  try {
    caseStudies = JSON.parse(formData.case_studies_json || '[]');
  } catch (e) { }

  const toggleProject = (project: any) => {
    const exists = caseStudies.find(p => p.id === project.id);
    let newStudies = [...caseStudies];
    if (exists) {
      newStudies = newStudies.filter(p => p.id !== project.id);
    } else {
      newStudies.push({
        id: project.id,
        title: project.project_title,
        demoUrl: project.live_demo_url,
        repoUrl: project.repo_url,
        notes: project.notes
      });
    }
    setFormData({ ...formData, case_studies_json: JSON.stringify(newStudies) });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase your best mentor-approved work.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleSave()}
            disabled={mutation.isPending}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-full shadow-sm hover:bg-gray-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={mutation.isPending}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2"
          >
            <GlobeAltIcon className="w-4 h-4" />
            {formData.is_published ? 'Update Live Portfolio' : 'Publish to Web'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Public Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="e.g. johndoe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input 
                  type="text" 
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  placeholder="e.g. Full Stack Developer | React & Go"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell your story..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#146ef5]"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="hire" 
                  checked={formData.is_available_for_hire}
                  onChange={(e) => setFormData({...formData, is_available_for_hire: e.target.checked})}
                  className="rounded text-[#146ef5] focus:ring-[#146ef5]"
                />
                <label htmlFor="hire" className="text-sm text-gray-700">Available for hire</label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Case Studies</h3>
            {approvedProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No approved projects yet</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">Complete your projects and get them approved by a mentor to showcase them here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedProjects.map((proj: any) => {
                  const isSelected = !!caseStudies.find(p => p.id === proj.id);
                  return (
                    <div key={proj.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-gray-50/50">
                      <div>
                        <h4 className="font-medium text-gray-900">{proj.project_title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{proj.notes || 'No description provided'}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {proj.live_demo_url && <a href={proj.live_demo_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Live Demo</a>}
                          {proj.repo_url && <a href={proj.repo_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Repo</a>}
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleProject(proj)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {isSelected ? <><CheckCircleIcon className="w-4 h-4" /> Added</> : 'Add to Portfolio'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gray-900 rounded-[1.5rem] p-6 text-white">
             <h3 className="text-lg font-medium mb-2">Portfolio Status</h3>
             <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-3 w-3">
                  {formData.is_published && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${formData.is_published ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                </span>
                <span className="text-sm font-medium text-gray-300">
                  {formData.is_published ? 'Live (Public)' : 'Draft (Private)'}
                </span>
             </div>
             {formData.is_published && data?.portfolio?.username && (
               <a 
                 href={`/portfolio/${data.portfolio.username}`}
                 target="_blank"
                 className="block w-full text-center bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 rounded-xl transition-colors"
               >
                 View Public Page
               </a>
             )}
           </div>
        </div>
      </div>
    </>
  );
}