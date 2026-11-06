"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  GlobeAltIcon, 
  LinkIcon, 
  CheckCircleIcon, 
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  CheckBadgeIcon,
  XMarkIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  CodeBracketIcon,
  StarIcon as StarOutline,
  UserCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolid,
  CheckBadgeIcon as CheckBadgeSolid,
  SparklesIcon as SparklesSolid
} from '@heroicons/react/24/solid';
import { 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandX, 
  IconWorld,
  IconCircleCheck
} from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

const SUGGESTED_SKILLS = [
  'TypeScript', 'Next.js', 'React', 'Golang', 'PostgreSQL', 
  'Tailwind CSS', 'Docker', 'Python', 'Node.js', 'GraphQL', 
  'Redis', 'REST APIs', 'System Design', 'Git & CI/CD'
];

interface CaseStudyItem {
  id: string;
  title: string;
  demoUrl?: string;
  repoUrl?: string;
  figmaUrl?: string;
  notes?: string;
  mentorFeedback?: string;
  mentorRating?: number;
  reviewedAt?: string;
}

export default function PortfolioPage() {
  const params = useParams();
  const tenantSlug = (params?.tenant as string) || '';
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    avatar_url: '',
    headline: '',
    bio: '',
    skills: [] as string[],
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
    is_available_for_hire: true,
    is_published: false,
    case_studies: [] as CaseStudyItem[],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/portfolio');
      return res.data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (data?.portfolio) {
      const p = data.portfolio;
      let parsedSkills: string[] = [];
      try {
        parsedSkills = JSON.parse(p.skills_json || '[]');
      } catch {
        parsedSkills = [];
      }

      let parsedSocials = { github: '', linkedin: '', twitter: '', website: '' };
      try {
        parsedSocials = { ...parsedSocials, ...JSON.parse(p.socials_json || '{}') };
      } catch {
        parsedSocials = { github: '', linkedin: '', twitter: '', website: '' };
      }

      let parsedCaseStudies: CaseStudyItem[] = [];
      try {
        parsedCaseStudies = JSON.parse(p.case_studies_json || '[]');
      } catch {
        parsedCaseStudies = [];
      }

      setFormData({
        username: p.username || (user as any)?.username || (user?.email ? user.email.split('@')[0] : ''),
        full_name: p.full_name || (user as any)?.name || (user as any)?.full_name || '',
        avatar_url: p.avatar_url || (user as any)?.avatar || '',
        headline: p.headline || '',
        bio: p.bio || '',
        skills: parsedSkills,
        socials: parsedSocials,
        is_available_for_hire: p.is_available_for_hire ?? true,
        is_published: p.is_published ?? false,
        case_studies: parsedCaseStudies,
      });
    } else if (user) {
      // Initialize defaults from user profile
      const defaultUsername = (user as any)?.username || (user?.email ? user.email.split('@')[0] : `student_${user.id.slice(0, 6)}`);
      setFormData((prev) => ({
        ...prev,
        username: prev.username || defaultUsername,
        full_name: prev.full_name || (user as any)?.name || (user as any)?.full_name || '',
        avatar_url: prev.avatar_url || (user as any)?.avatar || '',
      }));
    }
  }, [data, user]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await coursesApi.post('/api/portfolio', payload);
      return res.data;
    },
    onSuccess: (resData) => {
      toast.success(resData?.message || 'Portfolio updated successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update portfolio');
    },
  });

  const handleSave = (publishState?: boolean) => {
    const isPub = publishState !== undefined ? publishState : formData.is_published;
    
    // Clean username
    const cleanUsername = formData.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanUsername) {
      toast.error('Please specify a valid public username (alphanumeric, dashes, underscores)');
      return;
    }

    const payload = {
      username: cleanUsername,
      full_name: formData.full_name.trim(),
      avatar_url: formData.avatar_url.trim(),
      headline: formData.headline.trim(),
      bio: formData.bio.trim(),
      skills_json: JSON.stringify(formData.skills),
      socials_json: JSON.stringify(formData.socials),
      case_studies_json: JSON.stringify(formData.case_studies),
      is_available_for_hire: formData.is_available_for_hire,
      is_published: isPub,
    };

    mutation.mutate(payload);
  };

  const approvedProjects = useMemo(() => {
    return data?.approved_projects || [];
  }, [data]);

  const toggleProject = (project: any) => {
    const exists = formData.case_studies.find((p) => p.id === project.id);
    let updated: CaseStudyItem[];
    if (exists) {
      updated = formData.case_studies.filter((p) => p.id !== project.id);
      toast.success(`Removed "${project.project_title}" from portfolio`);
    } else {
      updated = [
        ...formData.case_studies,
        {
          id: project.id,
          title: project.project_title,
          demoUrl: project.live_demo_url || '',
          repoUrl: project.repo_url || '',
          figmaUrl: project.figma_url || '',
          notes: project.notes || '',
          mentorFeedback: project.mentor_feedback || '',
          mentorRating: project.mentor_rating || 5.0,
          reviewedAt: project.reviewed_at || '',
        },
      ];
      toast.success(`Added "${project.project_title}" to portfolio`);
    }
    setFormData({ ...formData, case_studies: updated });
  };

  const updateCaseStudyNote = (id: string, notes: string) => {
    const updated = formData.case_studies.map((item) =>
      item.id === id ? { ...item, notes } : item
    );
    setFormData({ ...formData, case_studies: updated });
  };

  const addSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Skill already added');
      return;
    }
    setFormData({ ...formData, skills: [...formData.skills, trimmed] });
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Completeness score
  const completeness = useMemo(() => {
    let score = 0;
    if (formData.username) score += 15;
    if (formData.full_name) score += 15;
    if (formData.headline) score += 20;
    if (formData.bio) score += 20;
    if (formData.skills.length > 0) score += 10;
    if (formData.case_studies.length > 0) score += 15;
    if (formData.socials.github || formData.socials.linkedin) score += 5;
    return Math.min(score, 100);
  }, [formData]);

  const publicUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      return `${origin}/portfolio/${formData.username}`;
    }
    return `/portfolio/${formData.username}`;
  }, [formData.username]);

  const copyPublicUrl = () => {
    if (!formData.username) {
      toast.error('Set a username first');
      return;
    }
    navigator.clipboard.writeText(publicUrl);
    toast.success('Public portfolio link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Loading your portfolio studio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Public Portfolio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Recruiter Showcase
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Curate mentor-evaluated case studies, skills, and codebases into a shareable web portfolio.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setActiveTab('EDITOR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'EDITOR'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PencilSquareIcon className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('PREVIEW')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'PREVIEW'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <EyeIcon className="w-3.5 h-3.5" />
              Live Preview
            </button>
          </div>

          <button
            onClick={() => handleSave(false)}
            disabled={mutation.isPending}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={mutation.isPending}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <GlobeAltIcon className="w-4 h-4" />
            {formData.is_published ? 'Update Live Portfolio' : 'Publish to Web'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      {activeTab === 'EDITOR' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editing Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity & Basic Info Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Profile Identity</h3>
                  <p className="text-xs text-slate-500">Your public introduction seen by employers and peers.</p>
                </div>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  01
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g. Ifeanyi Okafor"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Public Username (Handle)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">@</span>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                          })
                        }
                        placeholder="ifeanyi"
                        className="w-full pl-8 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Full-Stack Engineer | React, Next.js & Golang Distributed Systems"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://cdn.../avatar.jpg (Leave empty to use profile avatar)"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Elevator Pitch / Bio
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell your professional narrative, what problems you solve, and what type of engineering roles you thrive in..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hire"
                      checked={formData.is_available_for_hire}
                      onChange={(e) => setFormData({ ...formData, is_available_for_hire: e.target.checked })}
                      className="w-4 h-4 rounded text-[#146ef5] focus:ring-[#146ef5] border-slate-300"
                    />
                    <label htmlFor="hire" className="text-xs font-semibold text-slate-800 cursor-pointer">
                      Flag as Open for Hire / Available for Contracts
                    </label>
                  </div>
                  {formData.is_available_for_hire && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active Badge Displayed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Core Tech Stack & Skills Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Technical Skills & Toolsets</h3>
                  <p className="text-xs text-slate-500">Highlight frameworks, databases, and languages you build with.</p>
                </div>
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  02
                </span>
              </div>

              {/* Add Skill Field */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Type a skill and press Enter (e.g. Next.js, Golang, PostgreSQL)"
                  className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Selected Skills */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Active Skills ({formData.skills.length})
                </label>
                {formData.skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No skills added yet. Click suggestions below or type above.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-blue-900 focus:outline-none"
                        >
                          <XMarkIcon className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Suggestions */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Popular Suggestions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.filter(
                    (s) => !formData.skills.some((curr) => curr.toLowerCase() === s.toLowerCase())
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Social & Professional Links */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Social & Professional Presence</h3>
                  <p className="text-xs text-slate-500">Provide direct handles for recruiters to inspect your contributions.</p>
                </div>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  03
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <IconBrandGithub className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={formData.socials.github}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/username"
                      className="w-full pl-10 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <IconBrandLinkedin className="w-4 h-4 absolute left-3.5 top-3 text-[#0077b5]" />
                    <input
                      type="text"
                      value={formData.socials.linkedin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-10 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Twitter / X Profile
                  </label>
                  <div className="relative">
                    <IconBrandX className="w-4 h-4 absolute left-3.5 top-3 text-slate-700" />
                    <input
                      type="text"
                      value={formData.socials.twitter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, twitter: e.target.value },
                        })
                      }
                      placeholder="https://x.com/handle"
                      className="w-full pl-10 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Personal Portfolio / Blog
                  </label>
                  <div className="relative">
                    <IconWorld className="w-4 h-4 absolute left-3.5 top-3 text-blue-600" />
                    <input
                      type="text"
                      value={formData.socials.website}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, website: e.target.value },
                        })
                      }
                      placeholder="https://myportfolio.dev"
                      className="w-full pl-10 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Approved Cohort Capstones & Case Studies */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Featured Capstones & Case Studies</h3>
                  <p className="text-xs text-slate-500">
                    Select mentor-evaluated cohort deliverables to showcase on your public profile.
                  </p>
                </div>
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  04
                </span>
              </div>

              {approvedProjects.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 shadow-xs">
                    <CodeBracketIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">No Approved Projects Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Submit your capstones on the Projects hub. Once your mentor reviews and passes your submission, it will appear here for 1-click addition.
                  </p>
                  <Link
                    href={`/dashboard/projects`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    Go to Projects & Deliverables Hub &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedProjects.map((proj: any) => {
                    const isSelected = !!formData.case_studies.find((p) => p.id === proj.id);
                    const currentStudy = formData.case_studies.find((p) => p.id === proj.id);

                    return (
                      <div
                        key={proj.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-blue-50/30 border-blue-200 shadow-xs'
                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{proj.project_title}</h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Approved
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                              {proj.live_demo_url && (
                                <a
                                  href={proj.live_demo_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <GlobeAltIcon className="w-3.5 h-3.5" />
                                  Live Demo
                                </a>
                              )}
                              {proj.repo_url && (
                                <a
                                  href={proj.repo_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-700 hover:underline flex items-center gap-1"
                                >
                                  <IconBrandGithub className="w-3.5 h-3.5" />
                                  Code Repo
                                </a>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleProject(proj)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all self-start sm:self-auto ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4" />
                                Featured
                              </>
                            ) : (
                              '+ Add to Portfolio'
                            )}
                          </button>
                        </div>

                        {/* If selected, allow editing case study notes */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
                            <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                              Custom Case Study Description
                            </label>
                            <textarea
                              rows={2}
                              value={currentStudy?.notes || ''}
                              onChange={(e) => updateCaseStudyNote(proj.id, e.target.value)}
                              placeholder="Describe your architecture choices, database schema, or problems overcome..."
                              className="w-full text-xs border border-blue-200 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            {proj.mentor_feedback && (
                              <div className="text-[11px] bg-white/80 p-2 rounded-lg border border-blue-100 text-slate-600 italic">
                                <span className="font-semibold text-blue-900 not-italic">Mentor Feedback: </span>
                                &ldquo;{proj.mentor_feedback}&rdquo;
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Widget */}
          <div className="space-y-6">
            {/* Live Portfolio Status Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Portfolio Status
                </span>
                <span className="relative flex h-3 w-3">
                  {formData.is_published && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      formData.is_published ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  ></span>
                </span>
              </div>

              <div className="mb-4">
                <div className="text-lg font-bold">
                  {formData.is_published ? 'Live on the Web' : 'Private Draft Mode'}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formData.is_published
                    ? 'Anyone with your link can view your verified credentials and projects.'
                    : 'Only you can view this portfolio until you hit publish.'}
                </p>
              </div>

              {/* Public Link Box */}
              <div className="bg-white/10 rounded-2xl p-3 border border-white/10 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Public Share URL
                </div>
                <div className="text-xs font-mono text-blue-300 truncate select-all">
                  /portfolio/{formData.username || 'username'}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={copyPublicUrl}
                  className="w-full flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/20 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  Copy Shareable Link
                </button>

                {formData.is_published && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    Open Live Public Page
                  </a>
                )}
              </div>
            </div>

            {/* Profile Completeness Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">Completeness</span>
                <span className="text-xs font-extrabold text-blue-600">{completeness}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${formData.username ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓
                  </span>
                  <span className={formData.username ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    Public username set
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${formData.headline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓
                  </span>
                  <span className={formData.headline ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    Professional headline
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${formData.skills.length >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓
                  </span>
                  <span className={formData.skills.length >= 3 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    At least 3 core skills ({formData.skills.length}/3)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${formData.case_studies.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓
                  </span>
                  <span className={formData.case_studies.length > 0 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    At least 1 approved capstone
                  </span>
                </div>
              </div>
            </div>

            {/* Recruiter Visibility Tips */}
            <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-3xl p-6 border border-blue-100/80">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-2">
                <SparklesIcon className="w-4 h-4 text-blue-600" />
                Recruiter Visibility Tips
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Portfolios featuring a verified GitHub codebase and live demo link receive 4.5× more recruiter inquiries.
              </p>
              <div className="text-[11px] text-blue-700 font-semibold">
                Tip: Complete your Stage Capstones to unlock mentor rating badges!
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live Preview Mode Tab */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-1">
                <EyeIcon className="w-3.5 h-3.5" />
                Live Mockup Preview
              </div>
              <h3 className="text-lg font-bold text-slate-900">How Recruiters View Your Profile</h3>
            </div>
            <button
              onClick={() => setActiveTab('EDITOR')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Portfolio Fields
            </button>
          </div>

          {/* Interactive Simulated Public View */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt={formData.full_name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm bg-slate-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                    {(formData.full_name || formData.username || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {formData.full_name || 'Your Full Name'}
                    </h2>
                    {formData.is_available_for_hire && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Available for Hire
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-blue-600 mt-0.5">
                    {formData.headline || 'Your Headline Here'}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 max-w-xl leading-relaxed">
                    {formData.bio || 'Your bio narrative will appear here for employers.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Preview */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Skills & Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                ) : (
                  formData.skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/60"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Case Studies Preview */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Featured Case Studies ({formData.case_studies.length})
              </h4>
              {formData.case_studies.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No projects selected for showcase yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.case_studies.map((proj, i) => (
                    <div
                      key={proj.id || i}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-bold text-slate-900">{proj.title}</h5>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Mentor Approved
                        </span>
                      </div>
                      {proj.notes && (
                        <p className="text-xs text-slate-600 mb-3">{proj.notes}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs">
                        {proj.demoUrl && (
                          <span className="text-blue-600 font-semibold flex items-center gap-1">
                            <GlobeAltIcon className="w-3.5 h-3.5" /> Live Demo
                          </span>
                        )}
                        {proj.repoUrl && (
                          <span className="text-slate-800 font-semibold flex items-center gap-1">
                            <IconBrandGithub className="w-3.5 h-3.5" /> Source Code
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
