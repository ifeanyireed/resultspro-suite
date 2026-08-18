"use client";

import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  User,
  Plus,
  Send,
  Flag,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSupportTickets } from '@/lib/platform.api';

export default function SupportTickets() {
  const [activeStatus, setActiveStatus] = useState('Open');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getSupportTickets();
        setTickets(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch support tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-green animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-rose/10 text-rose p-6 rounded-3xl inline-block">
          <p className="font-bold mb-2">Error Loading Tickets</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Support Tickets</h1>
            <p className="text-gray-400">Unified helpdesk for managing all inbound support inquiries.</p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-green text-navy font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all text-sm">
            <Plus className="w-5 h-5" /> Create New Ticket
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Unassigned', value: '12', color: 'text-rose' },
             { label: 'Open Tickets', value: '28', color: 'text-amber' },
             { label: 'Avg Resolution', value: '4.2h', color: 'text-green' },
             { label: 'SLA Status', value: '98%', color: 'text-blue' },
           ].map((stat, i) => (
             <div key={i} className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 text-center">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
             </div>
           ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/5">
            {['All', 'Open', 'In Progress', 'Pending', 'Closed'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveStatus(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeStatus === tab ? 'bg-green text-navy' : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-4 w-full md:w-auto flex-1 md:flex-none max-w-md">
             <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-green transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search tickets..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-green/50 transition-all"
                />
             </div>
             <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <Filter className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ticket ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subject / User</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Priority</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assigned To</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/[0.04] transition-colors group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="text-sm font-mono text-gray-500 group-hover:text-green transition-colors">{ticket.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-white font-bold mb-1">{ticket.subject}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                       <User className="w-3 h-3" /> {ticket.user} • {ticket.submitted}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                      ticket.priority === 'High' ? 'bg-rose/10 text-rose' : ticket.priority === 'Medium' ? 'bg-amber/10 text-amber' : 'bg-blue/10 text-blue'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm text-white">
                       <div className="w-6 h-6 rounded-full bg-green/20 flex items-center justify-center text-[10px] text-green font-bold">
                          {ticket.assigned.charAt(0)}
                       </div>
                       {ticket.assigned}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-green transition-all">
                          <Send className="w-4 h-4" />
                       </button>
                       <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-rose transition-all">
                          <Flag className="w-4 h-4" />
                       </button>
                       <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
