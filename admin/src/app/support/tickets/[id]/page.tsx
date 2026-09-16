"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;
  
  const [messages, setMessages] = useState<any[]>([]);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';

  useEffect(() => {
    fetchThread();
  }, [ticketId]);

  const fetchThread = async () => {
    try {
      // Fetch all tickets to find the current one (quick hack for now)
      const tRes = await api.get('/api/v1/support/admin/tickets', { baseURL: USERS_API });
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
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.post(`/api/v1/support/tickets/${ticketId}/messages`, {
        message: reply,
        sender_type: 'staff'
      }, { baseURL: USERS_API });
      setReply('');
      fetchThread();
      
      // Auto-update status to in-progress if it was open
      if (ticket?.status === 'open') {
        updateStatus('in-progress');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      await api.put(`/api/v1/support/tickets/${ticketId}/status`, { status }, { baseURL: USERS_API });
      setTicket((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading thread...</div>;
  }

  if (!ticket) {
    return <div className="p-8 text-center text-gray-500">Ticket not found.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-white rounded-t-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/support/tickets" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{ticket.subject}</h2>
            <p className="text-sm text-gray-500">From: <span className="font-medium text-gray-700">{ticket.user_full_name}</span> • {new Date(ticket.created_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <select 
            value={ticket.status}
            onChange={e => updateStatus(e.target.value)}
            disabled={updating}
            className={`font-bold text-sm px-4 py-2 rounded-full border outline-none appearance-none cursor-pointer ${
              ticket.status === 'open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              ticket.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto flex flex-col gap-6 border-x border-gray-100">
        {/* Original Ticket Message */}
        <div className="flex gap-4 max-w-3xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
            <UserCircleIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-900">{ticket.user_full_name}</span>
              <span className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleTimeString()}</span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-gray-800 whitespace-pre-wrap">
              {ticket.message}
            </div>
          </div>
        </div>

        {/* Thread Messages */}
        {messages.map(m => {
          const isStaff = m.sender_type === 'staff';
          return (
            <div key={m.id} className={`flex gap-4 max-w-3xl ${isStaff ? 'self-end flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${isStaff ? 'bg-gray-800 text-white' : 'bg-blue-100 text-blue-600'}`}>
                {isStaff ? (
                  <span className="text-sm font-bold uppercase">{m.sender_name.charAt(0)}</span>
                ) : (
                  <UserCircleIcon className="w-6 h-6" />
                )}
              </div>
              <div className={`flex flex-col gap-1 ${isStaff ? 'items-end' : ''}`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-900">{isStaff ? m.sender_name : ticket.user_full_name}</span>
                  <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleTimeString()}</span>
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-gray-800 whitespace-pre-wrap ${
                  isStaff 
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
      <div className="bg-white rounded-b-[1.5rem] p-4 shadow-sm border border-gray-100 shrink-0 z-10">
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
    </div>
  );
}
