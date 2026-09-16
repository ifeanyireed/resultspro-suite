"use client";

import React, { useState, useEffect } from 'react';
import { TicketIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/api/v1/support/admin/tickets', { baseURL: USERS_API });
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase()) && !(t.user_full_name || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">All Tickets</h2>
          <p className="text-sm text-gray-500">Manage and resolve user issues</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 outline-none rounded-lg py-2 pl-9 pr-4 text-sm text-gray-700 focus:border-[#146ef5] transition-colors"
            />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 outline-none rounded-lg py-2 px-3 text-sm text-gray-700 focus:border-[#146ef5]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 py-12 text-center">Loading tickets...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-gray-500 py-12 text-center">No tickets match your filters.</div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map(t => (
            <Link key={t.id} href={`/support/tickets/${t.id}`}>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer bg-white">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    t.status === 'open' ? 'bg-yellow-50 text-yellow-600' : 
                    t.status === 'resolved' ? 'bg-green-50 text-green-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <TicketIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-[#146ef5] transition-colors">{t.subject}</h4>
                    <p className="text-sm text-gray-500 mb-1">{t.user_full_name || 'Unknown User'} • <span className="font-medium text-gray-700 capitalize">{t.category}</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                    t.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                    t.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {t.status}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
