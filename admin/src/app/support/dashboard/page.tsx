"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  ArrowUpRightIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
  TicketIcon,
  FaceSmileIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [staffActive, setStaffActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
    fetchStaffStatus();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/admin/tickets');
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffStatus = async () => {
    try {
      const res = await api.get('/support/staff/status');
      setStaffActive(res.data?.is_active || false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStaffStatus = async (status: boolean) => {
    try {
      await api.post('/support/staff/status', { is_active: status });
      setStaffActive(status);
    } catch (err) {
      console.error(err);
    }
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tickets, resolve issues, and delight our users.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Resolved Tickets</h3>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">{resolvedTickets}</h2>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Open Tickets</h3>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{openTickets}</h2>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Avg Response Time</h3>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">1.5h</h2>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Customer CSAT</h3>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">98%</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-9 flex flex-col gap-3">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-normal text-gray-900">Recent Tickets</h3>
            </div>
            
            {loading ? (
              <div className="text-gray-500 py-8 text-center">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">No tickets found.</div>
            ) : (
              <div className="space-y-4">
                {tickets.map(t => (
                  <div key={t.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                        t.status === 'open' ? 'bg-yellow-50 text-yellow-600' : 
                        t.status === 'resolved' ? 'bg-green-50 text-green-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <TicketIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">{t.subject}</h4>
                        <p className="text-sm text-gray-500 mb-1">{t.user_full_name || 'Unknown User'} • <span className="font-medium text-gray-700 capitalize">{t.category}</span></p>
                        <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded-md">{t.message}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                        t.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                        t.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {t.status}
                      </span>
                      {t.assigned_to && (
                        <span className="text-xs text-gray-500">Assigned</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="rounded-[1.5rem] p-6 text-white relative overflow-hidden aspect-square flex flex-col justify-between shadow-lg group bg-[#041533]">
            <h3 className="text-xl font-normal text-white relative z-10 text-left w-full">Shift Status</h3>
            <div className="relative z-10 flex flex-col items-center justify-center flex-1">
              <div className={`text-3xl font-medium tracking-tight mb-8 font-sans ${staffActive ? 'text-green-400' : 'text-gray-400'}`}>
                {staffActive ? 'ONLINE' : 'OFFLINE'}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => toggleStaffStatus(true)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md ${staffActive ? 'bg-green-500 text-white' : 'bg-white text-gray-900'}`}
                  title="Go Online"
                >
                  <PlayIcon className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => toggleStaffStatus(false)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md ${!staffActive ? 'bg-red-500 text-white' : 'bg-white text-gray-900'}`}
                  title="Go Offline"
                >
                  <StopIcon className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-6">
                When online, new tickets will be auto-assigned to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
