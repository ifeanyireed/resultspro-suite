"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  IconAlertCircle, 
  IconCheckCircle, 
  IconClock, 
  IconLoader2, 
  IconMessageSquare, 
  IconSend, 
  IconX, 
  IconUpload, 
  IconFileText, 
  IconUserCheck 
} from '@tabler/icons-react';

// Mock Interfaces
interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdBy: string;
  createdByUser: { firstName: string; lastName: string; email: string };
  assignedToAgent?: string;
  school: { name: string };
  messages: any[];
  createdAt: string;
}

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  
  useEffect(() => {
    // Mock Data
    setTimeout(() => {
      setTickets([
        {
          id: '1', ticketNumber: 'TK-1001', title: 'Cannot access ResultsPRO dashboard', description: 'When I try to login, it shows a 500 error.', category: 'Technical', priority: 'HIGH', status: 'OPEN', createdBy: 'u1', createdByUser: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' }, school: { name: 'Greenwood High' }, messages: [], createdAt: new Date().toISOString()
        },
        {
          id: '2', ticketNumber: 'TK-1002', title: 'Billing issue for Term 3', description: 'My card was charged twice.', category: 'Billing', priority: 'CRITICAL', status: 'PENDING', createdBy: 'u2', createdByUser: { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' }, school: { name: 'Kings College' }, messages: [], createdAt: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    pending: tickets.filter(t => t.status === 'PENDING').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative pb-20 font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md px-4 md:px-8 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">R</div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">ResultsPRO</div>
              <div className="text-sm font-semibold text-white">Support Agent</div>
            </div>
          </div>
          <div className="flex-1 text-center hidden md:block">
            <div className="text-lg font-bold text-white">Support Tickets</div>
            <div className="text-xs text-gray-400 mt-1">Manage and resolve requests</div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/support/profile" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all">
               <div className="w-8 h-8 rounded-full bg-gray-600"></div>
            </Link>
          </div>
        </div>
      </div>

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">My Tickets</h1>
            <p className="text-gray-400 mt-2">Manage and respond to your assigned tickets</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="text-3xl font-bold text-white text-center">{stats.total}</div>
              <p className="text-sm text-gray-400 mt-1 text-center">Total</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="text-3xl font-bold text-blue-400 text-center">{stats.open}</div>
              <p className="text-sm text-gray-400 mt-1 text-center">Open</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="text-3xl font-bold text-yellow-400 text-center">{stats.pending}</div>
              <p className="text-sm text-gray-400 mt-1 text-center">Pending</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="text-3xl font-bold text-purple-400 text-center">{stats.inProgress}</div>
              <p className="text-sm text-gray-400 mt-1 text-center">In Progress</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="text-3xl font-bold text-green-400 text-center">{stats.resolved}</div>
              <p className="text-sm text-gray-400 mt-1 text-center">Resolved</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Status Filter</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Priority Filter</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold mb-6">Assigned Tickets</h2>
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <div key={ticket.id} onClick={() => { setSelectedTicket(ticket); setDialogOpen(true); }} className="w-full text-left p-4 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer bg-black/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm font-semibold text-blue-400">{ticket.ticketNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{ticket.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-1">{ticket.description}</p>
                        <div className="flex gap-4 mt-3 text-xs text-gray-500">
                          <span>📍 {ticket.school.name}</span>
                          <span>👤 {ticket.createdByUser.firstName} {ticket.createdByUser.lastName}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">View</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Dialog Overlay */}
      {dialogOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedTicket.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{selectedTicket.ticketNumber}</p>
              </div>
              <button onClick={() => setDialogOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                <IconX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Priority</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Category</p>
                    <p className="mt-1 text-sm">{selectedTicket.category}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs uppercase text-gray-500 mb-2">Description</h4>
                <p className="text-sm bg-black/40 p-4 rounded-xl border border-white/5">{selectedTicket.description}</p>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/40">
               <textarea 
                 value={messageInput}
                 onChange={e => setMessageInput(e.target.value)}
                 placeholder="Type your response..."
                 className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[100px]"
               />
               <div className="flex justify-between items-center mt-4">
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
                   <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} className="rounded bg-black border-white/20" />
                   Internal Note
                 </label>
                 <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                   <IconSend className="w-4 h-4" /> Send Reply
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
