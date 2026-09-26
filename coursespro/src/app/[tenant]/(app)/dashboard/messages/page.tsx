"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Fetch conversations
  const { data: convData, isLoading: convsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/messages/conversations');
      return res.data?.conversations || [];
    },
    enabled: !!user,
    refetchInterval: 10000, // naive polling for now
  });

  // Fetch messages for active conversation
  const { data: messagesData, isLoading: msgsLoading } = useQuery({
    queryKey: ['messages', activeConvId],
    queryFn: async () => {
      if (!activeConvId) return [];
      const res = await coursesApi.get(`/api/messages/conversations/${activeConvId}`);
      return res.data?.messages || [];
    },
    enabled: !!activeConvId,
    refetchInterval: 3000, // fast poll for active chat
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!activeConvId) throw new Error('No active conversation');
      const res = await coursesApi.post(`/api/messages/conversations/${activeConvId}`, { content });
      return res.data;
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['messages', activeConvId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => toast.error('Failed to send message'),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvId) return;
    sendMutation.mutate(messageText);
  };

  const conversations = convData || [];
  const messages = messagesData || [];
  const activeConv = conversations.find((c: any) => c.id === activeConvId);

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Direct communication with peers and mentors.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex h-[600px] overflow-hidden">
        {/* Left Sidebar - Conversations */}
        <div className="w-1/3 border-r border-gray-100 bg-gray-50/50 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <input type="text" placeholder="Search messages..." className="w-full bg-white border border-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-[#146ef5]" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {convsLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No conversations yet.</div>
            ) : (
              conversations.map((conv: any) => {
                const isActive = conv.id === activeConvId;
                return (
                  <div 
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${isActive ? 'bg-white border-[#146ef5]' : 'border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-gray-900 truncate pr-2">
                        {conv.other_user?.name || 'Unknown User'}
                      </span>
                      {conv.last_message && (
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {conv.last_message && (
                      <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conv.last_message.content}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConvId ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase">
                    {activeConv?.other_user?.name?.[0] || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{activeConv?.other_user?.name || 'Chat'}</h3>
                  </div>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 flex flex-col gap-4">
                {msgsLoading ? (
                  <div className="text-center text-gray-400 text-sm mt-4">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-4 flex flex-col items-center">
                    <ChatBubbleLeftEllipsisIcon className="w-8 h-8 mb-2 opacity-50" />
                    Say hello!
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${isMine ? 'bg-[#146ef5] text-white' : 'bg-gray-200 text-gray-700'}`}>
                          {isMine ? 'Me' : activeConv?.other_user?.name?.[0] || 'U'}
                        </div>
                        <div className={`p-3 rounded-2xl shadow-sm border ${isMine ? 'bg-[#146ef5] text-white border-transparent rounded-tr-sm' : 'bg-white text-gray-700 border-gray-100 rounded-tl-sm'}`}>
                          <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                          <span className={`text-[10px] mt-1 block ${isMine ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message..." 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]" 
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={!messageText.trim() || sendMutation.isPending}
                    className="w-10 h-10 rounded-full bg-[#146ef5] text-white flex items-center justify-center shrink-0 hover:bg-[#105bd1] transition-colors shadow-sm disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
              <ChatBubbleLeftEllipsisIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}