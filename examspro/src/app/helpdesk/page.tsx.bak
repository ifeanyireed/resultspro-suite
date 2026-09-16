"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function DashboardSupport() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';

  const fetchTickets = async () => {
    try {
      const res = await api.get('/api/v1/support/tickets', { baseURL: USERS_API });
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/v1/support/tickets', {
        subject,
        category,
        message,
        priority,
        app_module: "ExamsPRO"
      }, { baseURL: USERS_API });
      setSubject('');
      setMessage('');
      fetchTickets();
      alert('Ticket submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-black text-navy mb-2">Support Center</h1>
        <p className="text-gray-500">Need help? Submit a ticket and our team will get back to you shortly.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-navy mb-6">Create New Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none" 
                placeholder="Brief summary of the issue"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none"
              >
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing & Payment</option>
                <option value="account">Account Access</option>
                <option value="content">Course Content</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
            <textarea 
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none resize-none" 
              placeholder="Describe your issue in detail..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold">
              {submitting ? <IconLoader2 className="w-5 h-5 animate-spin" /> : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-navy mb-6">Your Tickets</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <IconLoader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            You haven't submitted any tickets yet.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((t: any) => (
              <Link key={t.id} href={`/helpdesk/${t.id}`} className="block">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-2xl gap-4 hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{t.subject}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                        t.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                        t.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        t.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{t.message}</p>
                  </div>
                  <div className="text-sm text-gray-400 shrink-0 font-medium">
                    {new Date(t.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
