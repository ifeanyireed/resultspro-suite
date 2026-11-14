'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  useLandingConfig,
  NoticeItem,
  FacilityItem,
  NewsEventItem,
  TeamMemberItem
} from '@/lib/landingConfig';
import {
  ComputerDesktopIcon,
  BellAlertIcon,
  BuildingOffice2Icon,
  NewspaperIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

type CmsTab = 'hero' | 'notices' | 'facilities' | 'news' | 'team' | 'admissions';

export default function AdminLandingCmsPage() {
  const { config, setConfig, saveConfig, resetConfig, saving } = useLandingConfig();
  const [activeTab, setActiveTab] = useState<CmsTab>('hero');
  const [savedToast, setSavedToast] = useState(false);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const scrollHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollMetrics, setScrollMetrics] = useState({ thumbWidth: 100, thumbLeft: 0, hasOverflow: false });
  const [isScrollActive, setIsScrollActive] = useState(false);

  const triggerScrollbarActivity = useCallback(() => {
    setIsScrollActive(true);
    if (scrollHideTimerRef.current) {
      clearTimeout(scrollHideTimerRef.current);
    }
    scrollHideTimerRef.current = setTimeout(() => {
      setIsScrollActive(false);
    }, 1000);
  }, []);

  const updateScrollMetrics = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth + 1) {
      setScrollMetrics({ thumbWidth: 100, thumbLeft: 0, hasOverflow: false });
      return;
    }
    const widthPct = Math.max((clientWidth / scrollWidth) * 100, 15);
    const maxScroll = scrollWidth - clientWidth;
    const leftPct = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - widthPct) : 0;
    setScrollMetrics({ thumbWidth: widthPct, thumbLeft: leftPct, hasOverflow: true });
  }, []);

  const handleTabsScroll = useCallback(() => {
    updateScrollMetrics();
    triggerScrollbarActivity();
  }, [updateScrollMetrics, triggerScrollbarActivity]);

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener('resize', updateScrollMetrics);
    return () => {
      window.removeEventListener('resize', updateScrollMetrics);
      if (scrollHideTimerRef.current) clearTimeout(scrollHideTimerRef.current);
    };
  }, [updateScrollMetrics]);

  const handleSave = async () => {
    await saveConfig(config);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const tabs: { id: CmsTab; label: string; icon: any; count?: number }[] = [
    { id: 'hero', label: 'Hero & About', icon: ComputerDesktopIcon },
    { id: 'notices', label: 'Notice Board', icon: BellAlertIcon, count: config.notices.length },
    { id: 'facilities', label: 'Facilities', icon: BuildingOffice2Icon, count: config.facilities.length },
    { id: 'news', label: 'News & Events', icon: NewspaperIcon, count: config.newsAndEvents.length },
    { id: 'team', label: 'Leadership Team', icon: UserGroupIcon, count: config.leadershipTeam.length },
    { id: 'admissions', label: 'Admissions Steps', icon: AcademicCapIcon, count: config.admissionSteps.length }
  ];

  // Helpers to update nested arrays
  const updateNotice = (idx: number, patch: Partial<NoticeItem>) => {
    const next = [...config.notices];
    next[idx] = { ...next[idx], ...patch };
    setConfig({ ...config, notices: next });
  };

  const addNotice = () => {
    const newNotice: NoticeItem = {
      id: `NOT-2026-0${config.notices.length + 1}`,
      category: 'academic',
      pinned: false,
      date: 'Nov 20, 2026',
      title: 'New Campus Circular Announcement',
      summary: 'Enter the official announcement details here for parents, students, and staff.',
      tag: 'Official Notice'
    };
    setConfig({ ...config, notices: [newNotice, ...config.notices] });
  };

  const removeNotice = (idx: number) => {
    setConfig({ ...config, notices: config.notices.filter((_, i) => i !== idx) });
  };

  const updateFacility = (idx: number, patch: Partial<FacilityItem>) => {
    const next = [...config.facilities];
    next[idx] = { ...next[idx], ...patch };
    setConfig({ ...config, facilities: next });
  };

  const addFacility = () => {
    setConfig({
      ...config,
      facilities: [
        ...config.facilities,
        {
          title: 'New Campus Facility',
          category: 'Campus Infrastructure',
          image: '/photo04.jpeg',
          desc: 'Describe how this facility enhances learning and student development.',
          specs: ['Modern equipment', 'Supervised access', 'High capacity']
        }
      ]
    });
  };

  const removeFacility = (idx: number) => {
    setConfig({ ...config, facilities: config.facilities.filter((_, i) => i !== idx) });
  };

  const updateNews = (idx: number, patch: Partial<NewsEventItem>) => {
    const next = [...config.newsAndEvents];
    next[idx] = { ...next[idx], ...patch };
    setConfig({ ...config, newsAndEvents: next });
  };

  const addNews = () => {
    setConfig({
      ...config,
      newsAndEvents: [
        {
          type: 'Upcoming Event',
          date: 'Dec 05, 2026 · 10:00 AM',
          image: '/photo10.jpeg',
          title: 'New School Event or Achievement Headline',
          excerpt: 'Provide a concise summary of the campus event, competition victory, or ceremony.',
          location: 'Main Campus Auditorium'
        },
        ...config.newsAndEvents
      ]
    });
  };

  const removeNews = (idx: number) => {
    setConfig({ ...config, newsAndEvents: config.newsAndEvents.filter((_, i) => i !== idx) });
  };

  const updateTeam = (idx: number, patch: Partial<TeamMemberItem>) => {
    const next = [...config.leadershipTeam];
    next[idx] = { ...next[idx], ...patch };
    setConfig({ ...config, leadershipTeam: next });
  };

  const addTeamMember = () => {
    setConfig({
      ...config,
      leadershipTeam: [
        ...config.leadershipTeam,
        {
          name: 'New Faculty Leader',
          role: 'Department Head',
          qualification: 'M.Ed. / B.Sc.',
          image: '/avatars/character5.jpg',
          bio: 'Brief professional profile and academic leadership responsibilities.'
        }
      ]
    });
  };

  const removeTeamMember = (idx: number) => {
    setConfig({ ...config, leadershipTeam: config.leadershipTeam.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Header Bar */}
      <MotionRise className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Website CMS</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure the public school website (`/`): Hero, Notice Board, Facilities, News &amp; Events, Leadership Team, and Admissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {savedToast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <CheckCircleIcon className="w-4 h-4" /> Published to Live Site!
            </span>
          )}
          <button
            type="button"
            onClick={resetConfig}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Reset Defaults
          </button>
          <Link
            href="/"
            target="_blank"
            className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-blue-50 text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            Preview Live Site
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#146ef5] hover:bg-[#105bd1] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircleIcon className="w-4 h-4" />
            {saving ? 'Saving to Database...' : 'Save & Publish Changes'}
          </button>
        </div>
      </MotionRise>

      {/* Horizontal Subtabs Bar — Sticky Outer Pill Container with Auto-Hiding 2px Scrollbar Underneath */}
      <div
        onMouseEnter={triggerScrollbarActivity}
        onMouseMove={triggerScrollbarActivity}
        onTouchStart={triggerScrollbarActivity}
        className="sticky top-24 z-20 w-full min-w-0 max-w-full"
      >
        <div className="w-full min-w-0 max-w-full bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="w-full rounded-full overflow-hidden [clip-path:inset(0_round_9999px)]">
            <div
              ref={tabsScrollRef}
              onScroll={handleTabsScroll}
              className="w-full flex items-center gap-1.5 overflow-x-auto rounded-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/25'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    {typeof tab.count === 'number' && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2px Auto-Hiding Scrollbar Positioned Just Under the Toggle Container */}
        <div
          onClick={(e) => {
            const el = tabsScrollRef.current;
            if (!el) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickRatio = (e.clientX - rect.left) / rect.width;
            el.scrollTo({ left: clickRatio * (el.scrollWidth - el.clientWidth), behavior: 'smooth' });
            triggerScrollbarActivity();
          }}
          className={`mt-1.5 mx-6 h-[2px] bg-gray-200/80 rounded-full relative overflow-hidden cursor-pointer transition-opacity duration-300 ${
            isScrollActive && scrollMetrics.hasOverflow
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute top-0 bottom-0 h-[2px] bg-gray-400 hover:bg-[#146ef5] rounded-full transition-all duration-75"
            style={{
              width: `${scrollMetrics.thumbWidth}%`,
              left: `${scrollMetrics.thumbLeft}%`,
            }}
          />
        </div>
      </div>

      {/* ── TAB 1: HERO & ABOUT ── */}
      {activeTab === 'hero' && (
        <MotionRise className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Hero Section &amp; Branding</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  School Name
                </label>
                <input
                  type="text"
                  value={config.schoolName}
                  onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Academic Session
                </label>
                <input
                  type="text"
                  value={config.academicSession}
                  onChange={(e) => setConfig({ ...config, academicSession: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Hero Overline Badge
              </label>
              <input
                type="text"
                value={config.heroOverline}
                onChange={(e) => setConfig({ ...config, heroOverline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Headline Line 1
                </label>
                <input
                  type="text"
                  value={config.heroTitleTop}
                  onChange={(e) => setConfig({ ...config, heroTitleTop: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Headline Bold Highlight
                </label>
                <input
                  type="text"
                  value={config.heroTitleHighlight}
                  onChange={(e) => setConfig({ ...config, heroTitleHighlight: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Headline Line 3
                </label>
                <input
                  type="text"
                  value={config.heroTitleBottom}
                  onChange={(e) => setConfig({ ...config, heroTitleBottom: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={config.heroDescription}
                onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Hero Background Image Path
              </label>
              <input
                type="text"
                value={config.heroImage}
                onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Why Choose Us (Lower Split Section) &amp; Contact</h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Section Overline
              </label>
              <input
                type="text"
                value={config.aboutOverline}
                onChange={(e) => setConfig({ ...config, aboutOverline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Section Headline
              </label>
              <input
                type="text"
                value={config.aboutTitle}
                onChange={(e) => setConfig({ ...config, aboutTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Section Narrative
              </label>
              <textarea
                rows={4}
                value={config.aboutDescription}
                onChange={(e) => setConfig({ ...config, aboutDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Lower Feature Image Path
              </label>
              <input
                type="text"
                value={config.aboutImage}
                onChange={(e) => setConfig({ ...config, aboutImage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Admissions Contact Email
                </label>
                <input
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Campus Location
                </label>
                <input
                  type="text"
                  value={config.campusLocation}
                  onChange={(e) => setConfig({ ...config, campusLocation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Tenant Domain &amp; Custom Domain Routing</h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#146ef5]">
                  Edge Isolated
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Default Scholars Subdomain
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={config.defaultSubdomain || 'greenwoodhigh.scholars.ng'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Custom School Domain
                  </label>
                  <input
                    type="text"
                    placeholder="portal.greenwoodhigh.edu.ng"
                    value={config.customDomain || ''}
                    onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 font-mono"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Point your DNS <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">CNAME</code> record to{' '}
                <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[#146ef5]">cname.scholars.ng</code> to serve this school portal on your custom domain with strict tenant data isolation.
              </p>
            </div>
          </div>
        </MotionRise>
      )}

      {/* ── TAB 2: NOTICE BOARD ── */}
      {activeTab === 'notices' && (
        <MotionRise className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Official Notice Board Circulars</h2>
            <button
              type="button"
              onClick={addNotice}
              className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" /> Add Notice Circular
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.notices.map((notice, idx) => (
              <div key={idx} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{notice.id}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notice.pinned}
                        onChange={(e) => updateNotice(idx, { pinned: e.target.checked })}
                      />
                      Pinned Notice
                    </label>
                    <button
                      type="button"
                      onClick={() => removeNotice(idx)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="Delete Notice"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category</label>
                    <select
                      value={notice.category}
                      onChange={(e) => updateNotice(idx, { category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    >
                      <option value="admissions">Admissions</option>
                      <option value="academic">Academic</option>
                      <option value="events">PTA &amp; Events</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Tag Label</label>
                    <input
                      type="text"
                      value={notice.tag}
                      onChange={(e) => updateNotice(idx, { tag: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Date</label>
                    <input
                      type="text"
                      value={notice.date}
                      onChange={(e) => updateNotice(idx, { date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Headline</label>
                  <input
                    type="text"
                    value={notice.title}
                    onChange={(e) => updateNotice(idx, { title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Summary</label>
                  <textarea
                    rows={2}
                    value={notice.summary}
                    onChange={(e) => updateNotice(idx, { summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </MotionRise>
      )}

      {/* ── TAB 3: FACILITIES ── */}
      {activeTab === 'facilities' && (
        <MotionRise className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Campus Facilities Showcase</h2>
            <button
              type="button"
              onClick={addFacility}
              className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" /> Add Facility Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.facilities.map((fac, idx) => (
              <div key={idx} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">Facility #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFacility(idx)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={fac.title}
                    onChange={(e) => updateFacility(idx, { title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category Badge</label>
                    <input
                      type="text"
                      value={fac.category}
                      onChange={(e) => updateFacility(idx, { category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Image Path</label>
                    <input
                      type="text"
                      value={fac.image}
                      onChange={(e) => updateFacility(idx, { image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={fac.desc}
                    onChange={(e) => updateFacility(idx, { desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Highlight Specs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={fac.specs.join(', ')}
                    onChange={(e) =>
                      updateFacility(idx, {
                        specs: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </MotionRise>
      )}

      {/* ── TAB 4: NEWS & EVENTS ── */}
      {activeTab === 'news' && (
        <MotionRise className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Campus News &amp; Upcoming Events</h2>
            <button
              type="button"
              onClick={addNews}
              className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" /> Add News / Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.newsAndEvents.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">{item.type}</span>
                  <button
                    type="button"
                    onClick={() => removeNews(idx)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Badge Type</label>
                    <input
                      type="text"
                      value={item.type}
                      onChange={(e) => updateNews(idx, { type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Date / Time</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => updateNews(idx, { date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Headline</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateNews(idx, { title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Summary Excerpt</label>
                  <textarea
                    rows={3}
                    value={item.excerpt}
                    onChange={(e) => updateNews(idx, { excerpt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Venue / Location</label>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => updateNews(idx, { location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Image Path</label>
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateNews(idx, { image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MotionRise>
      )}

      {/* ── TAB 5: LEADERSHIP TEAM ── */}
      {activeTab === 'team' && (
        <MotionRise className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Leadership &amp; Faculty Team Profiles</h2>
            <button
              type="button"
              onClick={addTeamMember}
              className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" /> Add Team Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.leadershipTeam.map((member, idx) => (
              <div key={idx} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-sm font-bold text-gray-900">{member.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(idx)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeam(idx, { name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateTeam(idx, { role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Qualifications</label>
                    <input
                      type="text"
                      value={member.qualification}
                      onChange={(e) => updateTeam(idx, { qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Avatar / Photo Path</label>
                    <input
                      type="text"
                      value={member.image}
                      onChange={(e) => updateTeam(idx, { image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Short Bio</label>
                  <textarea
                    rows={2}
                    value={member.bio}
                    onChange={(e) => updateTeam(idx, { bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </MotionRise>
      )}

      {/* ── TAB 6: ADMISSIONS STEPS ── */}
      {activeTab === 'admissions' && (
        <MotionRise className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admissions Process Steps</h2>
              <p className="text-xs text-gray-500 mt-1">
                Customize the 4-step enrollment pipeline displayed above the online application form.
              </p>
            </div>
            <Link
              href="/admin/admissions"
              className="text-xs font-semibold text-[#146ef5] hover:underline"
            >
              Open Admissions CRM Pipeline &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.admissionSteps.map((st, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#146ef5] text-xs font-bold">
                    Step {st.step}
                  </span>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const next = [...config.admissionSteps];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setConfig({ ...config, admissionSteps: next });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
                  />
                </div>
                <textarea
                  rows={2}
                  value={st.desc}
                  onChange={(e) => {
                    const next = [...config.admissionSteps];
                    next[idx] = { ...next[idx], desc: e.target.value };
                    setConfig({ ...config, admissionSteps: next });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700"
                />
              </div>
            ))}
          </div>
        </MotionRise>
      )}
    </div>
  );
}
