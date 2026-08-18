import React, { useState } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { CheckSquare, Clock, AlertCircle } from '@/lib/hugeicons-compat';

const SupportTickets: React.FC = () => {
  const tickets = [
    { id: 'TK001', school: 'Lagos Central High School', subject: 'CSV Upload Issue', priority: 'high', created: '2024-02-15', status: 'open' },
    { id: 'TK002', school: 'Abuja International School', subject: 'Result Publishing Help', priority: 'medium', created: '2024-02-14', status: 'in-progress' },
    { id: 'TK003', school: 'Port Harcourt Academy', subject: 'Mobile App Bug', priority: 'high', created: '2024-02-13', status: 'open' },
    { id: 'TK004', school: 'Kano Educational Institute', subject: 'Analytics Dashboard', priority: 'low', created: '2024-02-12', status: 'closed' },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
          <p className="text-gray-400">Manage and resolve customer support requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Open', value: '24', icon: AlertCircle, color: 'from-red-500 to-red-600' },
            { label: 'In Progress', value: '8', icon: Clock, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Resolved', value: '156', icon: Check, color: 'from-green-500 to-green-600' },
            { label: 'Avg. Response', value: '2.5h', icon: Clock, color: 'from-blue-500 to-blue-600' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative rounded-[20px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-4 hover:bg-white/5 transition-all duration-300">
                <Icon className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tickets Table */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden hover:bg-white/5 transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)] bg-white/5">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Ticket ID</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">School</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Subject</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Priority</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Created</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-mono font-bold">{ticket.id}</td>
                    <td className="py-4 px-6 text-gray-400">{ticket.school}</td>
                    <td className="py-4 px-6 text-white">{ticket.subject}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{ticket.created}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === 'open' ? 'bg-red-500/20 text-red-300' :
                        ticket.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {ticket.status === 'open' ? 'Open' :
                         ticket.status === 'in-progress' ? 'In Progress' :
                         'Closed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SupportTickets;