"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface OtherUser {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  username?: string;
  is_group?: boolean;
}

interface ConversationItem {
  id: string;
  type: 'DIRECT' | 'COHORT' | 'GROUP';
  other_user: OtherUser;
  last_message?: {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
  };
  unread_count: number;
  updated_at: string;
}

interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  content: string;
  created_at: string;
}

type ChannelTab = 'ALL' | 'DIRECT' | 'COHORT';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const targetUserParam = searchParams.get('user');

  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ChannelTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  // 1. Fetch conversations list
  const { data: convData, isLoading: convsLoading, refetch: refetchConvs } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/messages/conversations');
      return (res.data?.conversations || []) as ConversationItem[];
    },
    enabled: !!user,
    refetchInterval: 6000,
  });

  // 2. Automatically handle ?user={id} query param from Peers or Mentors page
  useEffect(() => {
    if (!targetUserParam || !user) return;

    coursesApi.post(`/api/messages/direct/${targetUserParam}`)
      .then((res) => {
        const convId = res.data?.conversation_id;
        if (convId) {
          setActiveConvId(convId);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      })
      .catch((err) => {
        console.error("Failed to start direct conversation", err);
      });
  }, [targetUserParam, user, queryClient]);

  // Set default active conversation if none selected
  useEffect(() => {
    if (!activeConvId && convData && convData.length > 0 && !targetUserParam) {
      setActiveConvId(convData[0].id);
    }
  }, [convData, activeConvId, targetUserParam]);

  // 3. Fetch messages for active conversation
  const { data: messagesData, isLoading: msgsLoading } = useQuery({
    queryKey: ['messages', activeConvId],
    queryFn: async () => {
      if (!activeConvId) return [];
      const res = await coursesApi.get(`/api/messages/conversations/${activeConvId}`);
      return (res.data?.messages || []) as MessageItem[];
    },
    enabled: !!activeConvId,
    refetchInterval: 3000,
  });

  // 4. Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!activeConvId) throw new Error('No active conversation');
      const res = await coursesApi.post(`/api/messages/conversations/${activeConvId}`, { content });
      return res.data;
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['messages', activeConvId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
    },
    onError: () => toast.error('Failed to send message'),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvId || sendMutation.isPending) return;
    sendMutation.mutate(messageText.trim());
  };

  const conversations: ConversationItem[] = convData || [];
  const messages: MessageItem[] = messagesData || [];

  // Filter conversations by tab and search
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Tab filter
      if (activeTab === 'DIRECT' && conv.type !== 'DIRECT') return false;
      if (activeTab === 'COHORT' && conv.type !== 'COHORT') return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = (conv.other_user?.name || '').toLowerCase().includes(q);
        const lastMsgMatch = (conv.last_message?.content || '').toLowerCase().includes(q);
        const roleMatch = (conv.other_user?.role || '').toLowerCase().includes(q);
        return nameMatch || lastMsgMatch || roleMatch;
      }

      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const formatMessageTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Messages & Discussions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Live Channels
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Direct communication with study buddies, cohort channels, and instructors.
          </p>
        </div>

        <button
          onClick={() => refetchConvs()}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs self-start sm:self-auto"
          title="Refresh Messages"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex h-[680px] overflow-hidden">
        {/* Left Sidebar: Conversations & Channels */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200/80 bg-slate-50/40 flex flex-col">
          {/* Channel Tabs */}
          <div className="p-3 border-b border-slate-200/80 bg-white">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-3">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'DIRECT', label: 'Direct' },
                { id: 'COHORT', label: 'Cohorts' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ChannelTab)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/70 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {convsLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <ChatBubbleOvalLeftIcon className="w-8 h-8 opacity-40 mx-auto mb-2 text-slate-400" />
                {searchQuery ? 'No conversations match your search.' : 'No conversations active yet.'}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const name = conv.other_user?.name || (conv.type === 'COHORT' ? 'Cohort Channel' : 'Direct Chat');
                const avatar = conv.other_user?.avatar;
                const role = conv.other_user?.role;
                const isGroup = conv.type === 'COHORT' || conv.other_user?.is_group;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-colors flex items-start gap-3 relative ${
                      isActive
                        ? 'bg-blue-50/60 border-l-4 border-[#146ef5]'
                        : 'hover:bg-slate-100/60 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200/80 bg-white"
                        />
                      ) : (
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white ${
                          isGroup ? 'bg-indigo-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                        }`}>
                          {isGroup ? <UserGroupIcon className="w-5 h-5" /> : name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {conv.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#146ef5] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {name}
                        </span>
                        {conv.last_message && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      {role && (
                        <p className="text-[11px] text-blue-600 font-medium truncate mb-1">
                          {role}
                        </p>
                      )}

                      {conv.last_message ? (
                        <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                          {conv.last_message.content}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No messages yet</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Chat Window */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {activeConv.other_user?.avatar ? (
                      <img
                        src={activeConv.other_user.avatar}
                        alt={activeConv.other_user.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-200 bg-slate-50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {activeConv.type === 'COHORT' ? (
                          <UserGroupIcon className="w-5 h-5" />
                        ) : (
                          (activeConv.other_user?.name || 'U').charAt(0).toUpperCase()
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {activeConv.other_user?.name || 'Chat Channel'}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {activeConv.other_user?.role || (activeConv.type === 'COHORT' ? 'Cohort Live Channel' : 'Active Discussion')}
                    </p>
                  </div>
                </div>

                {/* Profile Link if Direct Chat */}
                {activeConv.type === 'DIRECT' && activeConv.other_user?.username && (
                  <Link
                    href={`/portfolio/${activeConv.other_user.username}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-100/60 px-3 py-1.5 rounded-xl transition-colors shrink-0"
                  >
                    View Portfolio
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/40 space-y-4">
                {msgsLoading ? (
                  <div className="text-center text-slate-400 text-xs py-8">
                    <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
                    Loading discussion history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-16 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
                      <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-700 mb-1">Start of Conversation</p>
                    <p className="text-[11px] text-slate-400">Say hello and introduce yourself to break the ice!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isMine ? 'self-end flex-row-reverse ml-auto' : 'self-start mr-auto'}`}
                      >
                        {/* Sender Monogram */}
                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                          isMine ? 'bg-[#146ef5] text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isMine ? 'Me' : (msg.sender_name || 'U').charAt(0).toUpperCase()}
                        </div>

                        {/* Message Bubble */}
                        <div className={`p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                          isMine
                            ? 'bg-[#146ef5] text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                        }`}>
                          {!isMine && msg.sender_name && activeConv.type === 'COHORT' && (
                            <p className="text-[10px] font-bold text-blue-600 mb-1">
                              {msg.sender_name}
                            </p>
                          )}
                          <p className="text-xs break-words whitespace-pre-wrap">{msg.content}</p>
                          <span className={`text-[10px] mt-1.5 block ${
                            isMine ? 'text-blue-100 text-right' : 'text-slate-400 text-left'
                          }`}>
                            {formatMessageTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message... (Press Enter to send)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full py-2.5 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sendMutation.isPending}
                    className="w-10 h-10 rounded-full bg-[#146ef5] hover:bg-[#105bd1] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
                    title="Send message"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/40 p-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
                <ChatBubbleOvalLeftIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No Active Discussion Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Choose a direct message or cohort discussion from the sidebar to start collaborating.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
