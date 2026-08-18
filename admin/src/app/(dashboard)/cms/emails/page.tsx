'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Mail, Send, CheckCircle2, RefreshCw } from 'lucide-react';

export default function EmailsPage() {
  const [recipientGroup, setRecipientGroup] = useState('ALL_SCHOOL_ADMINS');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const logs = [
    { id: '1', title: 'Term 1 Results Processing Deadline Reminder', audience: 'All School Admins (142)', delivered: 142, bounced: 0, date: '2026-08-15 10:00' },
    { id: '2', title: 'New WAEC CBT Mock Question Bank Released', audience: 'All Candidates (4,850)', delivered: 4838, bounced: 12, date: '2026-08-12 16:30' },
    { id: '3', title: 'Monthly Agent Commission Settlement Notification', audience: 'All Sales Agents (38)', delivered: 38, bounced: 0, date: '2026-08-01 09:00' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="Email Broadcasts & SES Deliveries"
        subtitle="Dispatch system-wide notifications and announcements via AWS Simple Email Service (SES)"
      />

      <div className="p-8 space-y-8">
        {/* Compose Broadcast */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Compose System-Wide Broadcast</h3>
          </div>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Audience Target</label>
              <select
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
              >
                <option value="ALL_SCHOOL_ADMINS">All School Administrators (142)</option>
                <option value="ALL_TEACHERS">All Enrolled Teachers (850)</option>
                <option value="ALL_PARENTS">All Registered Parents (2,400)</option>
                <option value="ALL_AGENTS">All Sales Agents (38)</option>
                <option value="ALL_USERS">Entire ResultsPRO Ecosystem (4,850+)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Important: 2025/2026 Academic Session Setup"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Content (HTML supported)</label>
              <textarea
                rows={5}
                required
                placeholder="Write your announcement or notification body here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Dispatched from verified AWS SES sender: <strong>noreply@resultspro.ng</strong>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast</span>
              </button>
            </div>
          </form>

          {sent && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Broadcast queued and dispatched to AWS SES worker queue successfully!</span>
            </div>
          )}
        </div>

        {/* Broadcast History */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">Broadcast Dispatch History</h3>

          <div className="divide-y divide-slate-50 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 text-xs">{log.title}</p>
                  <p className="text-[11px] text-slate-500">{log.audience} • Sent: {log.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right text-[11px]">
                    <span className="font-bold text-emerald-600">{log.delivered} Delivered</span>
                    {log.bounced > 0 && <span className="text-rose-500 font-semibold ml-2">({log.bounced} Bounced)</span>}
                  </div>
                  <Badge status="COMPLETED" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
