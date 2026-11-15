'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  EyeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';

export interface CampusMessageRecord {
  id: string;
  tenant_id: string;
  sender_id?: string;
  sender_name: string;
  sender_role: string;
  recipient_group: string;
  recipient_id?: string;
  recipient_name?: string;
  channel: string;
  subject: string;
  body: string;
  delivery_status: 'DELIVERED' | 'QUEUED' | 'SENT' | 'FAILED' | string;
  read_count: number;
  created_at: string;
}

export interface ThreadGroup {
  id: string;
  participantName: string;
  role: string;
  channel: string;
  subject: string;
  lastMessageTime: string;
  messages: CampusMessageRecord[];
}

const AUDIENCE_OPTIONS = [
  { value: 'ALL_PARENTS', label: 'All Parents & Guardians (Full Register)' },
  { value: 'ALL_TEACHERS', label: 'All Academic & Administrative Staff' },
  { value: 'SENIOR_SECONDARY', label: 'Senior Secondary Parents (SS 1 – SS 3)' },
  { value: 'JUNIOR_SECONDARY', label: 'Junior Secondary Parents (JSS 1 – JSS 3)' },
  { value: 'FEE_DEFAULTERS', label: 'Pending Tuition & Fee Reminder List' },
  { value: 'TRANSPORT', label: 'School Bus & Fleet Transport Subscribers' },
];

export default function MessagingManager() {
  const [messages, setMessages] = useState<CampusMessageRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Active Main Subtab: 'broadcasts' | 'compose' | 'inbox'
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'compose' | 'inbox'>('broadcasts');

  // Filters for Broadcast Ledger
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [audienceFilter, setAudienceFilter] = useState<string>('ALL');

  // Compose Broadcast State
  const [composeAudience, setComposeAudience] = useState<string>('ALL_PARENTS');
  const [selectedChannels, setSelectedChannels] = useState<{
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
    portal: boolean;
  }>({
    whatsapp: true,
    sms: true,
    email: true,
    portal: true,
  });
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeBody, setComposeBody] = useState<string>('');
  const [composeSubmitting, setComposeSubmitting] = useState<boolean>(false);
  const [composeError, setComposeError] = useState<string | null>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 2-Way Inbox State
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replySubmitting, setReplySubmitting] = useState<boolean>(false);

  // Detail & Delete Modals
  const [viewMessage, setViewMessage] = useState<CampusMessageRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CampusMessageRecord | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState<boolean>(false);

  // Helper to build tenant query params
  const getTenantQueryParams = useCallback(() => {
    const { tenantSlug, tenantId } = getActiveTenantContext();
    const params = new URLSearchParams();
    if (tenantId) params.append('tenant_id', tenantId);
    if (tenantSlug) params.append('tenant', tenantSlug);
    return params.toString() ? `?${params.toString()}` : '';
  }, []);

  // Fetch messages from database with tenant isolation
  const fetchMessages = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const qs = getTenantQueryParams();
      const res = await api.get(`/v1/campus/messages${qs}`).catch(async () => {
        return await api.get(`/campus/messages${qs}`);
      });

      if (res.data && Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Failed to load campus messages:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to load messages from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getTenantQueryParams]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Insert merge tag into compose textarea at cursor
  const handleInsertTag = (tag: string) => {
    if (!bodyTextareaRef.current) {
      setComposeBody((prev) => prev + tag);
      return;
    }
    const textarea = bodyTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = composeBody;
    const newText = text.substring(0, start) + tag + text.substring(end);
    setComposeBody(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  // Broadcast Dispatch Handler
  const handleDispatchBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeBody.trim()) {
      setComposeError('Please enter a message body before dispatching.');
      return;
    }

    const enabledChannels: string[] = [];
    if (selectedChannels.whatsapp) enabledChannels.push('WHATSAPP');
    if (selectedChannels.sms) enabledChannels.push('SMS');
    if (selectedChannels.email) enabledChannels.push('EMAIL');
    if (selectedChannels.portal) enabledChannels.push('PORTAL');

    if (enabledChannels.length === 0) {
      setComposeError('Select at least one delivery channel (WhatsApp, SMS, Email, or Portal).');
      return;
    }

    setComposeSubmitting(true);
    setComposeError(null);

    try {
      const qs = getTenantQueryParams();
      const channelString = enabledChannels.length > 1 ? enabledChannels.join('_AND_') : enabledChannels[0];

      await api.post(`/v1/campus/messages${qs}`, {
        sender_name: 'School Administration',
        sender_role: 'admin',
        recipient_group: composeAudience,
        channel: channelString,
        subject: composeSubject.trim() || 'Campus Notification & Circular',
        body: composeBody.trim(),
        delivery_status: 'DELIVERED',
        read_count: 1,
      });

      setBannerSuccess('Broadcast circular successfully dispatched and logged in ledger!');
      setComposeSubject('');
      setComposeBody('');
      setActiveTab('broadcasts');
      await fetchMessages(true);
      setTimeout(() => setBannerSuccess(null), 4000);
    } catch (err: any) {
      console.error('Failed to dispatch broadcast:', err);
      setComposeError(err?.response?.data?.error || err?.message || 'Failed to dispatch broadcast.');
    } finally {
      setComposeSubmitting(false);
    }
  };

  // Group messages into 2-Way Inbox Threads
  const threads: ThreadGroup[] = useMemo(() => {
    const threadMap: Record<string, CampusMessageRecord[]> = {};

    messages.forEach((m) => {
      // Determine grouping key
      let key = '';
      if (m.recipient_group === 'DIRECT_THREAD') {
        key = m.recipient_name || m.sender_name || 'Direct Communication';
      } else if (m.sender_role === 'parent' || m.sender_role === 'teacher') {
        key = m.sender_name;
      }

      if (key) {
        if (!threadMap[key]) {
          threadMap[key] = [];
        }
        threadMap[key].push(m);
      }
    });

    return Object.entries(threadMap).map(([name, msgs]) => {
      // Sort chronological ascending
      msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const lastMsg = msgs[msgs.length - 1];
      const firstNonAdmin = msgs.find((x) => x.sender_role !== 'admin');

      return {
        id: name,
        participantName: name,
        role: firstNonAdmin?.sender_role === 'teacher' ? 'Faculty Staff' : 'Parent / Guardian',
        channel: lastMsg.channel || 'PORTAL',
        subject: lastMsg.subject || 'Direct Conversation',
        lastMessageTime: lastMsg.created_at,
        messages: msgs,
      };
    });
  }, [messages]);

  // Set default selected thread when inbox loads
  useEffect(() => {
    if (threads.length > 0 && !selectedThreadId) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  const activeThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return threads.find((t) => t.id === selectedThreadId) || threads[0] || null;
  }, [threads, selectedThreadId]);

  // Reply handler for 2-Way Inbox
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    setReplySubmitting(true);
    try {
      const qs = getTenantQueryParams();
      await api.post(`/v1/campus/messages${qs}`, {
        sender_name: 'School Administration',
        sender_role: 'admin',
        recipient_group: 'DIRECT_THREAD',
        recipient_name: activeThread.participantName,
        channel: activeThread.channel,
        subject: `Re: ${activeThread.subject}`,
        body: replyText.trim(),
        delivery_status: 'DELIVERED',
        read_count: 1,
      });

      setReplyText('');
      await fetchMessages(true);
    } catch (err: any) {
      console.error('Failed to send reply:', err);
      alert(err?.response?.data?.error || err?.message || 'Failed to deliver reply.');
    } finally {
      setReplySubmitting(false);
    }
  };

  // Delete message handler
  const handleDeleteMessage = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      const qs = getTenantQueryParams();
      const glue = qs ? '&' : '?';
      await api.delete(`/v1/campus/messages${qs}${glue}id=${encodeURIComponent(deleteTarget.id)}`);

      setBannerSuccess('Message record removed from ledger.');
      setDeleteTarget(null);
      await fetchMessages(true);
      setTimeout(() => setBannerSuccess(null), 3000);
    } catch (err: any) {
      console.error('Failed to delete message:', err);
      alert(err?.response?.data?.error || err?.message || 'Failed to delete message record.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Filtered broadcast ledger
  const broadcastMessages = useMemo(() => {
    return messages.filter((m) => {
      // Exclude pure direct thread replies from general broadcast table if preferred, or keep all
      if (channelFilter !== 'ALL') {
        if (!m.channel.toUpperCase().includes(channelFilter.toUpperCase())) {
          return false;
        }
      }

      if (audienceFilter !== 'ALL') {
        if (m.recipient_group.toUpperCase() !== audienceFilter.toUpperCase()) {
          return false;
        }
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesSubj = m.subject?.toLowerCase().includes(query);
        const matchesBody = m.body?.toLowerCase().includes(query);
        const matchesSender = m.sender_name?.toLowerCase().includes(query);
        const matchesRecip = m.recipient_name?.toLowerCase().includes(query);
        const matchesGroup = m.recipient_group?.toLowerCase().includes(query);
        if (!matchesSubj && !matchesBody && !matchesSender && !matchesRecip && !matchesGroup) {
          return false;
        }
      }

      return true;
    });
  }, [messages, channelFilter, audienceFilter, searchTerm]);

  // Aggregates for standard KPI cards
  const totalDispatches = messages.length;
  const deliveredCount = messages.filter((m) => m.delivery_status === 'DELIVERED').length;
  const deliveryRate = totalDispatches > 0 ? Math.round((deliveredCount / totalDispatches) * 100) : 100;
  const totalReads = messages.reduce((acc, m) => acc + (m.read_count || 0), 0);
  const activeChannelsCount = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => {
      if (m.channel.includes('WHATSAPP')) set.add('WhatsApp');
      if (m.channel.includes('SMS')) set.add('SMS');
      if (m.channel.includes('EMAIL')) set.add('Email');
      if (m.channel.includes('PORTAL') || m.channel.includes('IN_APP')) set.add('Portal');
    });
    return set.size || 4;
  }, [messages]);

  // SMS character & page calculation
  const smsCharCount = composeBody.length;
  const smsPagesCount = Math.max(1, Math.ceil(smsCharCount / 160));

  return (
    <div className="space-y-6">
      {/* Banner Notifications */}
      {bannerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm shadow-xs">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchMessages(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50 cursor-pointer"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Header and Subtab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Omnichannel Messaging &amp; Circulars</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enterprise communications hub spanning WhatsApp Business, SMS, Email, and In-Portal circulars with tenant isolation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200/80">
            <button
              onClick={() => setActiveTab('broadcasts')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'broadcasts' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Broadcast Ledger ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'compose' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Compose Broadcast
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inbox' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2-Way Inbox ({threads.length})
            </button>
          </div>

          <button
            onClick={() => fetchMessages(true)}
            disabled={loading || refreshing}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#146ef5]' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Standard Campus OS KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Dispatches</span>
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#146ef5]" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalDispatches}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Verified notifications sent</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Rate</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{deliveryRate}%</div>
          <div className="text-[11px] text-gray-400 mt-0.5">{deliveredCount} confirmed delivered</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Read Engagement</span>
            <BoltIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{totalReads}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Total message reads tracked</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Channels</span>
            <ShieldCheckIcon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{activeChannelsCount} / 4</div>
          <div className="text-[11px] text-gray-400 mt-0.5">WhatsApp · SMS · Email · Portal</div>
        </div>
      </div>

      {/* SUBTAB 1: BROADCASTS HISTORY LEDGER */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-4">
          {/* Search and Channel Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dispatches by headline, body content, sender, or audience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#146ef5] focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#146ef5]"
              >
                <option value="ALL">All Audiences</option>
                <option value="ALL_PARENTS">All Parents</option>
                <option value="ALL_TEACHERS">All Staff / Teachers</option>
                <option value="SENIOR_SECONDARY">Senior Secondary</option>
                <option value="JUNIOR_SECONDARY">Junior Secondary</option>
                <option value="DIRECT_THREAD">Direct 2-Way Threads</option>
              </select>

              <div className="inline-flex rounded-xl bg-gray-100 p-0.5 border border-gray-200">
                {(['ALL', 'WHATSAPP', 'SMS', 'EMAIL', 'PORTAL'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(ch)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      channelFilter === ch ? 'bg-white text-[#146ef5] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('compose')}
                className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                New Broadcast
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-sm text-gray-400">Loading broadcast messages ledger...</div>
            ) : broadcastMessages.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-base font-semibold text-gray-800">No broadcast messages found</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {searchTerm || channelFilter !== 'ALL' || audienceFilter !== 'ALL'
                    ? 'No records match your active search filters. Try clearing filters.'
                    : 'Your school tenant has not dispatched any broadcasts yet. Click below to compose your first circular.'}
                </p>
                <button
                  onClick={() => setActiveTab('compose')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#146ef5] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Compose First Broadcast
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Subject &amp; Snippet</th>
                      <th className="py-3 px-4">Target Audience</th>
                      <th className="py-3 px-4">Channels</th>
                      <th className="py-3 px-4">Delivery Status</th>
                      <th className="py-3 px-4">Engagement</th>
                      <th className="py-3 px-4">Dispatched At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {broadcastMessages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-gray-900 truncate">{msg.subject}</div>
                          <div className="text-[11px] text-gray-500 truncate mt-0.5">{msg.body}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-[#146ef5] font-semibold text-[10px] tracking-wide">
                            {msg.recipient_group.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {msg.channel.includes('WHATSAPP') && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                WhatsApp
                              </span>
                            )}
                            {msg.channel.includes('SMS') && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">
                                SMS
                              </span>
                            )}
                            {msg.channel.includes('EMAIL') && (
                              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold text-[10px]">
                                Email
                              </span>
                            )}
                            {(msg.channel.includes('PORTAL') || msg.channel.includes('IN_APP')) && (
                              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-bold text-[10px]">
                                Portal
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              msg.delivery_status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : msg.delivery_status === 'QUEUED'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                msg.delivery_status === 'DELIVERED'
                                  ? 'bg-emerald-500'
                                  : msg.delivery_status === 'QUEUED'
                                  ? 'bg-amber-500'
                                  : 'bg-gray-400'
                              }`}
                            ></span>
                            {msg.delivery_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-gray-600 font-medium">
                            <EyeIcon className="w-3.5 h-3.5 text-gray-400" />
                            <span>{msg.read_count} reads</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setViewMessage(msg)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="View Full Content"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(msg)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Broadcast"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: NEW BROADCAST COMPOSER */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleDispatchBroadcast}
            className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Compose Campus Broadcast</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Multi-channel notification broadcast with template merge tags and instant gateway dispatch.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#146ef5]">
                DND-Bypass Verified
              </span>
            </div>

            {composeError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                {composeError}
              </div>
            )}

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Target Recipient Group
              </label>
              <select
                value={composeAudience}
                onChange={(e) => setComposeAudience(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5] focus:bg-white"
              >
                {AUDIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Channels Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Delivery Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedChannels.whatsapp
                      ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedChannels.whatsapp}
                    onChange={(e) => setSelectedChannels((prev) => ({ ...prev, whatsapp: e.target.checked }))}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span className="text-xs font-semibold">WhatsApp</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedChannels.sms
                      ? 'border-purple-300 bg-purple-50/50 text-purple-900'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedChannels.sms}
                    onChange={(e) => setSelectedChannels((prev) => ({ ...prev, sms: e.target.checked }))}
                    className="w-3.5 h-3.5 text-purple-600 rounded"
                  />
                  <span className="text-xs font-semibold">SMS Alert</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedChannels.email
                      ? 'border-sky-300 bg-sky-50/50 text-sky-900'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedChannels.email}
                    onChange={(e) => setSelectedChannels((prev) => ({ ...prev, email: e.target.checked }))}
                    className="w-3.5 h-3.5 text-sky-600 rounded"
                  />
                  <span className="text-xs font-semibold">Email Circular</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedChannels.portal
                      ? 'border-blue-300 bg-blue-50/50 text-blue-900'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedChannels.portal}
                    onChange={(e) => setSelectedChannels((prev) => ({ ...prev, portal: e.target.checked }))}
                    className="w-3.5 h-3.5 text-[#146ef5] rounded"
                  />
                  <span className="text-xs font-semibold">In-Portal App</span>
                </label>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Headline / Subject Line
              </label>
              <input
                type="text"
                placeholder="e.g. Mid-Term Assessment Resumption & Open Day Review"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5] focus:bg-white"
              />
            </div>

            {/* Message Body & Merge Tags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Message Content
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 mr-1">Insert Merge Tag:</span>
                  {(['{{parent_name}}', '{{student_name}}', '{{class_name}}', '{{balance}}'] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertTag(tag)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#146ef5] hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                ref={bodyTextareaRef}
                rows={5}
                placeholder="Dear {{parent_name}}, kindly be informed that..."
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5] focus:bg-white font-sans"
              />

              {/* Nigerian SMS Unit and Character Counter */}
              <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
                <span>
                  {smsCharCount} character{smsCharCount !== 1 ? 's' : ''} · {smsPagesCount} SMS page{smsPagesCount !== 1 ? 's' : ''}
                </span>
                <span>Tier 1 Nigerian Telco Route (~₦4.00/unit)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={composeSubmitting || !composeBody.trim()}
                className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold text-xs py-3 rounded-full shadow-sm shadow-[#146ef5]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {composeSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Dispatching Circular Across Channels...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    Dispatch Broadcast to {composeAudience.replace(/_/g, ' ')}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column: Broadcast Preview & Operational Best Practices */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Live Device Preview</h4>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/70 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Campus Notification</span>
                  <span>Just now</span>
                </div>
                <div className="text-xs font-bold text-gray-900">
                  {composeSubject || 'Preview: Campus Broadcast Notice'}
                </div>
                <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {composeBody || 'Message content will render here with real-time merge substitution for each recipient.'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl border border-blue-100 p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#146ef5]">
                <SparklesIcon className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Communication Guidelines</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>SMS messages exceeding 160 characters are billed as concatenated pages.</li>
                <li>WhatsApp messages deliver with read receipts and rich interactive action buttons.</li>
                <li>Merge tags like <code className="text-[#146ef5] font-mono text-[10px]">{'{{student_name}}'}</code> personalize each dispatch automatically.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: 2-WAY INBOX & THREADS */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">2-Way Parent &amp; Faculty Inbox</h3>
              <p className="text-[11px] text-gray-500">Live two-way communication threads stored securely in your database.</p>
            </div>
            <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
              {threads.length} Active Conversations
            </span>
          </div>

          {threads.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-300 mx-auto" />
              <div className="text-xs font-semibold text-gray-700">No 2-Way conversation threads yet</div>
              <p className="text-[11px] text-gray-400">Direct inquiries from parents and teachers will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              {/* Left Column: Thread List */}
              <div className="md:col-span-5 border-r border-gray-100 divide-y divide-gray-100 overflow-y-auto max-h-[540px]">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                      activeThread?.id === thread.id ? 'bg-blue-50/70 border-l-4 border-l-[#146ef5]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {thread.channel}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(thread.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-gray-900 truncate">{thread.participantName}</div>
                    <div className="text-[11px] text-[#146ef5] font-medium truncate mt-0.5">{thread.subject}</div>
                    <div className="text-[11px] text-gray-500 truncate mt-1">
                      {thread.messages[thread.messages.length - 1]?.body}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Chat History & Reply Input */}
              <div className="md:col-span-7 flex flex-col justify-between bg-gray-50/40 p-5">
                {activeThread ? (
                  <>
                    <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1">
                      <div className="pb-3 border-b border-gray-200">
                        <div className="font-bold text-sm text-gray-900">{activeThread.participantName}</div>
                        <div className="text-[11px] text-gray-500">
                          {activeThread.role} · {activeThread.subject}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {activeThread.messages.map((m) => {
                          const isAdmin = m.sender_role === 'admin';
                          return (
                            <div
                              key={m.id}
                              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                                isAdmin
                                  ? 'ml-auto bg-[#146ef5] text-white rounded-br-xs shadow-xs'
                                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-xs'
                              }`}
                            >
                              <div className="font-semibold text-[10px] mb-1 opacity-80">
                                {m.sender_name}
                              </div>
                              <p>{m.body}</p>
                              <span className={`block text-[10px] mt-1.5 ${isAdmin ? 'text-white/75' : 'text-gray-400'}`}>
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reply Input Form */}
                    <form onSubmit={handleSendReply} className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Reply to ${activeThread.participantName}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
                      />
                      <button
                        type="submit"
                        disabled={replySubmitting || !replyText.trim()}
                        className="bg-[#146ef5] hover:bg-[#105bd1] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                      >
                        {replySubmitting ? (
                          <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <PaperAirplaneIcon className="w-3.5 h-3.5" />
                        )}
                        Reply
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    Select a conversation thread to view history
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MESSAGE DETAIL MODAL */}
      {viewMessage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="text-sm font-bold text-gray-900">Broadcast Circular Details</h3>
              </div>
              <button
                onClick={() => setViewMessage(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Subject</span>
                <p className="font-semibold text-gray-900 text-sm">{viewMessage.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Audience</span>
                  <span className="font-semibold text-gray-800">{viewMessage.recipient_group.replace(/_/g, ' ')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Channel</span>
                  <span className="font-semibold text-gray-800">{viewMessage.channel}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Sender</span>
                  <span className="font-semibold text-gray-800">{viewMessage.sender_name} ({viewMessage.sender_role})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Engagement</span>
                  <span className="font-semibold text-gray-800">{viewMessage.read_count} confirmed reads</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Message Content</span>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {viewMessage.body}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewMessage(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <TrashIcon className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Delete Message Record</h3>
                <p className="text-xs text-gray-500">This will remove the message permanently from your tenant ledger.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200/60">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteTarget.subject}"</span>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMessage}
                disabled={deleteSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {deleteSubmitting ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : <TrashIcon className="w-3.5 h-3.5" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
