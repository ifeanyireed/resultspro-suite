'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Plus,
  Search,
  Filter,
  Send,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Users
} from 'lucide-react';
import { fetchCampusMessages, CampusMessage } from '@/lib/campus-api';

const CHANNELS = ['All Channels', 'PORTAL', 'SMS', 'EMAIL', 'PUSH'];

export default function CommunicationsMessagesPage() {
  const [messages, setMessages] = useState<CampusMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newMessage, setNewMessage] = useState({
    sender_name: 'Super Administrator',
    sender_role: 'PRINCIPAL',
    recipient_group: 'All Registered Parents',
    subject: '',
    message: '',
    channel: 'SMS' as const,
  });

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    const data = await fetchCampusMessages();
    setMessages(data);
    setLoading(false);
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.subject || !newMessage.message) return;

    const created: CampusMessage = {
      id: `msg-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newMessage,
      sent_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setMessages((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewMessage({
      sender_name: 'Super Administrator',
      sender_role: 'PRINCIPAL',
      recipient_group: 'All Registered Parents',
      subject: '',
      message: '',
      channel: 'SMS',
    });
  }

  const filteredMessages = messages.filter((m) => {
    const matchesChannel = selectedChannel === 'All Channels' || m.channel === selectedChannel;
    const matchesSearch =
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.recipient_group.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {CHANNELS.map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search broadcast subject or recipient group..."
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
          <Send className="w-4 h-4" />
          <span>Send Broadcast Dispatch</span>
        </button>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Broadcast Messaging Dispatch Log</h3>
            <p className="text-xs text-slate-500">Multi-channel messaging history across SMS gateways, push notifications, and email</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            {filteredMessages.length} Messages Dispatched
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Subject & Message</th>
                <th className="py-3 px-4">Recipient Audience</th>
                <th className="py-3 px-4">Sender Profile</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-bold text-slate-900 leading-snug">{msg.subject}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{msg.message}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-[11px]">
                      {msg.recipient_group}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{msg.sender_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">{msg.sender_role}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.channel === 'SMS' ? 'bg-amber-100 text-amber-800' :
                      msg.channel === 'PUSH' ? 'bg-purple-100 text-purple-800' :
                      msg.channel === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {msg.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                    {msg.sent_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Send Broadcast Message</h3>
            <p className="text-xs text-slate-500 mb-4">Send multi-channel notification to parents, students, or faculty</p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Delivery Channel</label>
                  <select
                    value={newMessage.channel}
                    onChange={(e) => setNewMessage({ ...newMessage, channel: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="SMS">SMS Gateway</option>
                    <option value="PUSH">Mobile App Push Notification</option>
                    <option value="EMAIL">Email Dispatch</option>
                    <option value="PORTAL">Student/Parent Portal</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={newMessage.recipient_group}
                    onChange={(e) => setNewMessage({ ...newMessage, recipient_group: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="All Registered Parents">All Registered Parents</option>
                    <option value="All SS3 Parents">All SS3 Parents</option>
                    <option value="Parents with Outstanding Fee Balances">Parents with Fee Balances</option>
                    <option value="All Boarding Students & Guardians">Boarding Students & Guardians</option>
                    <option value="All Teaching Staff">All Teaching Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Message Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Update: Mid-Term Parent Consultation"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type dispatch content..."
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
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
                  className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
