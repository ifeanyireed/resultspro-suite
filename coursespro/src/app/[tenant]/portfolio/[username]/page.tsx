import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTenant } from '@/lib/tenant';
import { COURSES_API } from '@/lib/api';
import { 
  ArrowTopRightOnSquareIcon, 
  CheckBadgeIcon, 
  EnvelopeIcon, 
  CodeBracketIcon, 
  GlobeAltIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandX, 
  IconWorld, 
  IconAward,
  IconCircleCheck
} from '@tabler/icons-react';

export const dynamic = 'force-dynamic';

interface PublicPortfolioProps {
  params: Promise<{ tenant: string; username: string }>;
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioProps) {
  const resolvedParams = await params;
  const { tenant: tenantSlug, username } = resolvedParams;

  const tenant = await getTenant(tenantSlug);
  if (!tenant) {
    notFound();
  }

  // Fetch portfolio data from service_coursespro
  let portfolioData: any = null;
  try {
    const res = await fetch(`${COURSES_API}/api/public/portfolio/${username}?tenant_id=${tenant.id}`, {
      headers: {
        'X-Tenant-Domain': tenant.slug || tenantSlug,
        'X-Tenant-ID': tenant.id,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      portfolioData = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch public portfolio:', err);
  }

  if (!portfolioData || !portfolioData.portfolio || !portfolioData.portfolio.is_published) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BriefcaseIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Not Found</h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            The requested portfolio for <span className="font-semibold text-slate-800">@{username}</span> either does not exist, is in private draft mode, or has not been published yet.
          </p>
          <Link
            href={`/`}
            className="inline-flex items-center gap-2 bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to {tenant.name}
          </Link>
        </div>
      </main>
    );
  }

  const { portfolio, user, achievements } = portfolioData;

  // Parse skills
  let skills: string[] = [];
  try {
    skills = JSON.parse(portfolio.skills_json || '[]');
  } catch {
    skills = [];
  }

  // Parse socials
  let socials: { github?: string; linkedin?: string; twitter?: string; website?: string } = {};
  try {
    socials = JSON.parse(portfolio.socials_json || '{}');
  } catch {
    socials = {};
  }

  // Parse case studies
  let caseStudies: Array<{
    id: string;
    title: string;
    demoUrl?: string;
    repoUrl?: string;
    figmaUrl?: string;
    notes?: string;
    mentorFeedback?: string;
    mentorRating?: number;
    mentorName?: string;
    reviewedAt?: string;
  }> = [];
  try {
    caseStudies = JSON.parse(portfolio.case_studies_json || '[]');
  } catch {
    caseStudies = [];
  }

  const displayName = portfolio.full_name || user?.full_name || portfolio.username || 'Student Builder';
  const displayAvatar = portfolio.avatar_url || user?.avatar_url || null;
  const headline = portfolio.headline || 'Software Engineer & Digital Specialist';
  const bio = portfolio.bio || 'Passionate builder crafting scalable solutions and production-ready applications.';
  const emailContact = user?.email || null;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href={`/`}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{tenant.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Verified Graduate Portfolio
            </span>
            {emailContact && (
              <a
                href={`mailto:${emailContact}?subject=Inquiry%20via%20${encodeURIComponent(tenant.name)}%20Portfolio`}
                className="inline-flex items-center gap-1.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                <EnvelopeIcon className="w-3.5 h-3.5" />
                Contact
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Profile Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar / Monogram */}
            <div className="relative">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {portfolio.is_available_for_hire && (
                <span
                  title="Available for hire"
                  className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                >
                  <IconCircleCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {displayName}
                </h1>
                <span className="text-sm font-medium text-slate-400">@{portfolio.username}</span>
                {portfolio.is_available_for_hire && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Available for Hire
                  </span>
                )}
              </div>

              <p className="text-base sm:text-lg font-medium text-blue-600 mb-3">{headline}</p>

              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">{bio}</p>

              {/* Social Links */}
              <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                {socials.github && (
                  <a
                    href={socials.github.startsWith('http') ? socials.github : `https://${socials.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <IconBrandGithub className="w-4 h-4 text-slate-800" />
                    GitHub
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://${socials.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <IconBrandLinkedin className="w-4 h-4 text-[#0077b5]" />
                    LinkedIn
                  </a>
                )}
                {socials.twitter && (
                  <a
                    href={socials.twitter.startsWith('http') ? socials.twitter : `https://${socials.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <IconBrandX className="w-4 h-4 text-slate-900" />
                    Twitter / X
                  </a>
                )}
                {socials.website && (
                  <a
                    href={socials.website.startsWith('http') ? socials.website : `https://${socials.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <IconWorld className="w-4 h-4 text-blue-600" />
                    Website
                  </a>
                )}
                {emailContact && (
                  <a
                    href={`mailto:${emailContact}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <EnvelopeIcon className="w-4 h-4 text-rose-500" />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Case Studies & Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Featured Case Studies</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mentor-evaluated projects and capstones delivered during cohort training.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {caseStudies.length} {caseStudies.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>

            {caseStudies.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <CodeBracketIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-800">No Case Studies Featured</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  This builder is currently preparing and finalizing their verified project showcase.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {caseStudies.map((project, idx) => (
                  <div
                    key={project.id || idx}
                    className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/50 hover:border-blue-300 transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                          {project.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                        <CheckBadgeIcon className="w-3.5 h-3.5" />
                        Mentor Approved
                      </span>
                    </div>

                    {project.notes && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {project.notes}
                      </p>
                    )}

                    {/* Mentor Feedback Highlight if available */}
                    {project.mentorFeedback && (
                      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 mb-4 text-xs text-blue-900">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-950 mb-1">
                          <SparklesIcon className="w-3.5 h-3.5 text-blue-600" />
                          Mentor Evaluation Quote
                          {project.mentorRating && (
                            <span className="ml-auto inline-flex items-center gap-0.5 text-amber-500 font-bold">
                              <StarSolid className="w-3.5 h-3.5" />
                              {project.mentorRating.toFixed(1)} / 5.0
                            </span>
                          )}
                        </div>
                        <p className="italic text-slate-700 leading-relaxed">
                          &ldquo;{project.mentorFeedback}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#146ef5] hover:bg-[#105bd1] text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                        >
                          <GlobeAltIcon className="w-3.5 h-3.5" />
                          Live Demo
                          <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-80" />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                        >
                          <IconBrandGithub className="w-3.5 h-3.5" />
                          Source Code
                          <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-80" />
                        </a>
                      )}
                      {project.figmaUrl && (
                        <a
                          href={project.figmaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3.5 py-2 rounded-xl transition-colors"
                        >
                          <CodeBracketIcon className="w-3.5 h-3.5" />
                          Figma Architecture
                          <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-80" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skills, Endorsements & Academy Info */}
        <div className="space-y-6">
          {/* Skills Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Core Tech Stack & Skills</h3>
            <p className="text-xs text-slate-500 mb-4">Mastered frameworks, languages, and toolsets.</p>

            {skills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mentor Endorsement Quote if present */}
          {portfolio.mentor_endorsement && (
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <SparklesIcon className="w-4 h-4" />
                Lead Mentor Recommendation
              </div>
              <p className="text-sm text-slate-200 italic leading-relaxed mb-4">
                &ldquo;{portfolio.mentor_endorsement}&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-xs text-slate-400">
                <AcademicCapIcon className="w-4 h-4 text-blue-400" />
                <span>Technical Advisory Board, {tenant.name}</span>
              </div>
            </div>
          )}

          {/* Earned Credentials & Badges */}
          {achievements && achievements.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <IconAward className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Earned Badges</h3>
              </div>
              <div className="space-y-3">
                {achievements.map((ach: any) => (
                  <div
                    key={ach.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                      ✦
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Trust Badge */}
          <div className="bg-slate-100/80 rounded-3xl p-6 border border-slate-200/80 text-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xs text-blue-600 font-black">
              ✓
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">Accreditation Verified</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All portfolio capstones and milestones undergo rigorous code reviews and rubric evaluations on {tenant.name} CoursesPRO platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}