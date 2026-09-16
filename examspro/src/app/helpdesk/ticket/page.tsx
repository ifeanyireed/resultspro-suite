"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconArrowLeft as ArrowLeftIcon, IconSend as PaperAirplaneIcon, IconUser as UserCircleIcon } from '@tabler/icons-react';
import api from '@/lib/api';
import Link from 'next/link';

function TicketContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id');

  const [messages, setMessages] = useState<any[]>([]);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';

  useEffect(() => {
    if (!ticketId) {
      setLoading(false);
      return;
    }
    fetchThread();
  }, [ticketId]);

  const fetchThread = async () => {
    try {
      const tRes = await api.get('/api/v1/support/tickets', { baseURL: USERS_API });
      const current = (tRes.data || []).find((t: any) => t.id === ticketId);
      setTicket(current);

      const res = await api.get(`/api/v1/support/tickets/${ticketId}/messages`, { baseURL: USERS_API });
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !ticketId) return;
    setSending(true);
    try {
      await api.post(`/api/v1/support/tickets/${ticketId}/messages`, {
        message: reply,
        sender_type: 'user'
      }, { baseURL: USERS_API });
      setReply('');
      fetchThread();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading thread...</div>;
  }

  if (!ticket) {
    return <div className="p-8 text-center text-gray-500">Ticket not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/helpdesk" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{ticket.subject}</h2>
            <p className="text-sm text-gray-500 capitalize">Category: {ticket.category}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
          ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
          ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {ticket.status}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-gray-50/30">
        <div className="flex gap-4 max-w-3xl self-end flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
            <UserCircleIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-900">You</span>
              <span className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleTimeString()}</span>
            </div>
            <div className="bg-[#146ef5] text-white p-4 rounded-2xl rounded-tr-sm shadow-sm whitespace-pre-wrap">
              {ticket.message}
            </div>
          </div>
        </div>

        {messages.map(m => {
          const isUser = m.sender_type === 'user';
          return (
            <div key={m.id} className={`flex gap-4 max-w-3xl ${isUser ? 'self-end flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${!isUser ? 'bg-gray-800 text-white' : 'bg-blue-100 text-blue-600'}`}>
                {!isUser ? (
                  <span className="text-sm font-bold uppercase">{m.sender_name.charAt(0)}</span>
                ) : (
                  <UserCircleIcon className="w-6 h-6" />
                )}
              </div>
              <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : ''}`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-900">{isUser ? 'You' : m.sender_name}</span>
                  <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleTimeString()}</span>
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-gray-800 whitespace-pre-wrap ${
                  isUser 
                    ? 'bg-[#146ef5] text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-200 rounded-tl-sm'
                }`}>
                  {m.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Input */}
      {ticket.status !== 'resolved' ? (
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <form onSubmit={handleSendReply} className="flex gap-3">
            <input 
              type="text"
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-gray-50 border border-gray-200 outline-none rounded-xl px-4 py-3 text-sm focus:border-blue-500 transition-colors"
            />
            <button 
              type="submit" 
              disabled={sending || !reply.trim()}
              className="bg-[#146ef5] hover:bg-[#105bd1] disabled:opacity-50 text-white rounded-xl px-6 py-3 font-bold shadow-sm flex items-center gap-2 transition-all"
            >
              {sending ? 'Sending...' : (
                <>
                  <span>Send</span>
                  <PaperAirplaneIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-sm text-gray-500 italic shrink-0">
          This ticket has been marked as resolved and is closed to new replies.
        </div>
      )}
    </div>
  );
}

export default function UserTicketDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading thread...</div>}>
      <TicketContent />
    </Suspense>
  );
}
