'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Pin,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { fetchCampusNotices, CampusNotice } from '@/lib/campus-api';

const CATEGORIES = ['All Categories', 'CIRCULAR', 'EXAM', 'HOLIDAY', 'PTA', 'GENERAL'];

export default function CommunicationsNoticesPage() {
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'CIRCULAR' as const,
    body: '',
    event_date: '2026-12-10',
    target_audience: 'ALL' as const,
    is_pinned: false,
  });

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);
    const data = await fetchCampusNotices();
    setNotices(data);
    setLoading(false);
  }

  function handleCreateNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!newNotice.title || !newNotice.body) return;

    const created: CampusNotice = {
      id: `ntc-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newNotice,
      created_at: new Date().toISOString().split('T')[0],
    };

    setNotices((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewNotice({
      title: '',
      category: 'CIRCULAR',
      body: '',
      event_date: '2026-12-10',
      target_audience: 'ALL',
      is_pinned: false,
    });
  }

  function handleTogglePin(id: string) {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_pinned: !n.is_pinned } : n))
    );
  }

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCat === 'All Categories' || n.category === selectedCat;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.body.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars and event announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice / Circular</span>
        </button>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${
              n.is_pinned ? 'border-blue-400/80 ring-2 ring-blue-500/10' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                  n.category === 'CIRCULAR' ? 'bg-blue-100 text-blue-800' :
                  n.category === 'EXAM' ? 'bg-purple-100 text-purple-800' :
                  n.category === 'PTA' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {n.category}
                </span>

                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Target: {n.target_audience}
                </span>

                {n.event_date && (
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    Event Date: {n.event_date}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleTogglePin(n.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  n.is_pinned ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={n.is_pinned ? 'Unpin Notice' : 'Pin to Top'}
              >
                <Pin className={`w-4 h-4 ${n.is_pinned ? 'fill-blue-600' : ''}`} />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              {n.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {n.body}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Published: {n.created_at}</span>
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live on Mobile App & Web
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Publish Notice / Circular</h3>
            <p className="text-xs text-slate-500 mb-4">Broadcast circular to students, parents, or faculty</p>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Annual Speech Day & Prize-Giving Ceremony"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="CIRCULAR">CIRCULAR</option>
                    <option value="EXAM">EXAM</option>
                    <option value="HOLIDAY">HOLIDAY</option>
                    <option value="PTA">PTA</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={newNotice.target_audience}
                    onChange={(e) => setNewNotice({ ...newNotice, target_audience: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="ALL">Everyone (Parents, Staff & Students)</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="STAFF">Teaching & Admin Staff</option>
                    <option value="STUDENTS">Students Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Event Date (Optional)</label>
                  <input
                    type="date"
                    value={newNotice.event_date}
                    onChange={(e) => setNewNotice({ ...newNotice, event_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={newNotice.is_pinned}
                      onChange={(e) => setNewNotice({ ...newNotice, is_pinned: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Pin to top of feed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Notice Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter full announcement details, directives, or schedule..."
                  value={newNotice.body}
                  onChange={(e) => setNewNotice({ ...newNotice, body: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
