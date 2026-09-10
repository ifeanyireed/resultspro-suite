'use client';

import { useState } from 'react';
import { Receipt, Search, Filter } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices] = useState([
    { id: 'INV-001', tenant: 'Greenwood High', amount: '₦150,000', status: 'Paid', date: 'Oct 12, 2026' },
    { id: 'INV-002', tenant: 'Ivy League Academy', amount: '₦80,000', status: 'Pending', date: 'Oct 10, 2026' },
    { id: 'INV-003', tenant: 'Springfield Elementary', amount: '₦45,000', status: 'Paid', date: 'Oct 08, 2026' },
    { id: 'INV-004', tenant: 'Lakeside Tech College', amount: '₦350,000', status: 'Overdue', date: 'Sep 25, 2026' },
  ]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Billing & Invoices
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage global tenant subscriptions and payment history.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-semibold">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant / School</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{inv.tenant}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{inv.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                      ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                        inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 font-semibold hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
