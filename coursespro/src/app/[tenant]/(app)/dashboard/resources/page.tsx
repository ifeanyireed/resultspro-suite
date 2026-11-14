"use client";

import React, { useState, useMemo } from 'react';
import { 
  DocumentDuplicateIcon, 
  ArrowDownTrayIcon, 
  PlayCircleIcon, 
  LinkIcon, 
  DocumentIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowTopRightOnSquareIcon,
  FolderOpenIcon,
  VideoCameraIcon,
  CodeBracketIcon,
  BookOpenIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  SparklesIcon as SparklesSolid 
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface Resource {
  id: string;
  title: string;
  resourceType: string;
  url: string;
  cohortId?: string;
  cohortTitle?: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface CohortSummary {
  id: string;
  title: string;
  slug: string;
}

type CategoryFilter = 'ALL' | 'DOCUMENT' | 'VIDEO' | 'LINK' | 'SLIDES';

export default function ResourcesPage() {
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [selectedCohort, setSelectedCohort] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [activeVideoModal, setActiveVideoModal] = useState<Resource | null>(null);

  // Fetch resources using coursesApi targeting service_coursespro
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['student-resources', user?.id, selectedCohort],
    queryFn: async () => {
      const url = selectedCohort && selectedCohort !== 'ALL'
        ? `/api/student/resources?cohort_id=${selectedCohort}`
        : '/api/student/resources';
      const res = await coursesApi.get(url);
      return res.data;
    },
    enabled: !!user,
  });

  // Normalize response (supports both array and { resources, cohorts } schema)
  const resources: Resource[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.resources || [];
  }, [data]);

  const cohorts: CohortSummary[] = useMemo(() => {
    if (!data || Array.isArray(data)) return [];
    return data.cohorts || [];
  }, [data]);

  // Compute resource category KPIs
  const stats = useMemo(() => {
    let videos = 0;
    let documents = 0;
    let links = 0;
    let slides = 0;

    resources.forEach((r) => {
      const t = (r.resourceType || '').toLowerCase();
      if (t.includes('video') || t.includes('mp4') || t.includes('recording') || t.includes('stream')) {
        videos++;
      } else if (t.includes('pdf') || t.includes('doc') || t.includes('guide') || t.includes('cheatsheet')) {
        documents++;
      } else if (t.includes('link') || t.includes('github') || t.includes('repo') || t.includes('tool')) {
        links++;
      } else if (t.includes('slide') || t.includes('presentation') || t.includes('deck')) {
        slides++;
      } else {
        documents++;
      }
    });

    return { total: resources.length, videos, documents, links, slides };
  }, [resources]);

  // Filtered resources based on category and search query
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const t = (resource.resourceType || '').toLowerCase();
      
      // Category match
      let matchesCategory = true;
      if (activeCategory === 'VIDEO') {
        matchesCategory = t.includes('video') || t.includes('mp4') || t.includes('recording');
      } else if (activeCategory === 'DOCUMENT') {
        matchesCategory = t.includes('doc') || t.includes('pdf') || t.includes('guide') || t === 'document';
      } else if (activeCategory === 'LINK') {
        matchesCategory = t.includes('link') || t.includes('url') || t.includes('repo') || t.includes('github');
      } else if (activeCategory === 'SLIDES') {
        matchesCategory = t.includes('slide') || t.includes('presentation') || t.includes('deck');
      }

      if (!matchesCategory) return false;

      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (resource.title || '').toLowerCase().includes(query);
        const matchesCohort = (resource.cohortTitle || '').toLowerCase().includes(query);
        const matchesType = t.includes(query);
        return matchesTitle || matchesCohort || matchesType;
      }

      return true;
    });
  }, [resources, activeCategory, searchQuery]);

  const getIcon = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('video') || t.includes('mp4') || t.includes('recording')) {
      return <PlayCircleIcon className="w-5 h-5 text-rose-500" />;
    }
    if (t.includes('link') || t.includes('url') || t.includes('github')) {
      return <LinkIcon className="w-5 h-5 text-emerald-500" />;
    }
    if (t.includes('slide') || t.includes('presentation')) {
      return <BookOpenIcon className="w-5 h-5 text-amber-500" />;
    }
    if (t.includes('pdf') || t.includes('doc')) {
      return <DocumentDuplicateIcon className="w-5 h-5 text-blue-500" />;
    }
    return <DocumentIcon className="w-5 h-5 text-slate-500" />;
  };

  const getTypeBadge = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('video') || t.includes('recording')) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">Recording</span>;
    }
    if (t.includes('slide') || t.includes('presentation')) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">Slide Deck</span>;
    }
    if (t.includes('link') || t.includes('url') || t.includes('github')) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">External Resource</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">Document</span>;
  };

  const copyResourceLink = (url: string, title: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success(`Copied link for "${title}"!`);
  };

  const handleResourceClick = (resource: Resource) => {
    const t = (resource.resourceType || '').toLowerCase();
    const url = resource.url || '';

    // If it's a video file, YouTube, Vimeo, or Loom, open in interactive viewer modal
    if (
      t.includes('video') || 
      t.includes('recording') || 
      url.includes('youtube.com') || 
      url.includes('youtu.be') || 
      url.includes('loom.com') || 
      url.includes('vimeo.com') || 
      url.endsWith('.mp4')
    ) {
      setActiveVideoModal(resource);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('loom.com/share/')) {
      const id = url.split('share/')[1]?.split('?')[0];
      return `https://www.loom.com/embed/${id}`;
    }
    return url;
  };

  return (
    <MotionRise className="max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shared Learning Resources
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Session Archive & Materials
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Access curated lecture recordings, workshop slide decks, architectural templates, and repository links.
          </p>
        </div>

        {/* Refresh & Controls */}
        <div className="flex items-center gap-3">
          {cohorts.length > 1 && (
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Enrolled Cohorts</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
            title="Refresh Resources"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <MotionStagger className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderOpenIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 font-medium">Total Resources</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <VideoCameraIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.videos}</div>
            <div className="text-xs text-slate-500 font-medium">Session Recordings</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BookOpenIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.slides}</div>
            <div className="text-xs text-slate-500 font-medium">Slide Decks & Guides</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CodeBracketIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.links}</div>
            <div className="text-xs text-slate-500 font-medium">Code Repos & Links</div>
          </div>
        </div>
      </MotionStagger>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'DOCUMENT', label: 'Documents & PDFs' },
            { id: 'VIDEO', label: 'Recordings' },
            { id: 'SLIDES', label: 'Slide Decks' },
            { id: 'LINK', label: 'Links & Repos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as CategoryFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar & View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-9.5 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'GRID' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-slate-500">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Retrieving cohort learning resources...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpenIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {searchQuery ? 'No matching resources found' : 'No Shared Resources Yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No materials matched "${searchQuery}". Try adjusting your keywords or clearing the filter.`
              : 'Your cohort mentor and instructors have not uploaded downloadable resources yet. Check back after your next live lecture!'}
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
      ) : viewMode === 'GRID' ? (
        /* Grid View Layout */
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getIcon(resource.resourceType)}
                    </div>
                    {getTypeBadge(resource.resourceType)}
                  </div>
                  <button
                    onClick={() => copyResourceLink(resource.url, resource.title)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Copy resource URL"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-2 mb-1.5">
                  {resource.title}
                </h3>

                {resource.cohortTitle && (
                  <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {resource.cohortTitle}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(resource.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>

                <button
                  onClick={() => handleResourceClick(resource)}
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-[#146ef5] hover:bg-[#105bd1] text-white px-3.5 py-1.5 rounded-xl transition-colors shadow-xs"
                >
                  {resource.resourceType.toLowerCase().includes('video') ? (
                    <>
                      <PlayCircleIcon className="w-3.5 h-3.5" />
                      Watch Video
                    </>
                  ) : resource.resourceType.toLowerCase().includes('link') ? (
                    <>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                      Open Link
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </MotionStagger>
      ) : (
        /* Table List View Layout */
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Resource Name
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cohort
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                          {getIcon(resource.resourceType)}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">
                          {resource.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      {resource.cohortTitle || 'General Cohort'}
                    </td>
                    <td className="py-4 px-6">
                      {getTypeBadge(resource.resourceType)}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(resource.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyResourceLink(resource.url, resource.title)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Copy Link"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResourceClick(resource)}
                          className="text-[#146ef5] hover:text-[#105bd1] font-semibold text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100/70 transition-colors"
                        >
                          {resource.resourceType.toLowerCase().includes('video') ? (
                            <>
                              <PlayCircleIcon className="w-3.5 h-3.5" /> Watch
                            </>
                          ) : resource.resourceType.toLowerCase().includes('link') ? (
                            <>
                              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" /> Open
                            </>
                          ) : (
                            <>
                              <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Get
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* In-App Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <PlayCircleIcon className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-md">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Player */}
            <div className="aspect-video bg-black flex items-center justify-center">
              {activeVideoModal.url.includes('youtube') || activeVideoModal.url.includes('loom') ? (
                <iframe
                  src={getEmbedUrl(activeVideoModal.url)}
                  title={activeVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={activeVideoModal.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between bg-white text-xs text-slate-500">
              <span>{activeVideoModal.cohortTitle || 'Cohort Lecture'}</span>
              <a
                href={activeVideoModal.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                Open in External Player
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </MotionRise>
  );
}
