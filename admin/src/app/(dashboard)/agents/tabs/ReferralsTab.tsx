import React, { useState } from 'react';
import { Badge } from '@/components/Badge';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ReferralsTab() {
  const [referrals, setReferrals] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">School Referred</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Commission</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {referrals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No referral approvals pending</td>
              </tr>
            ) : (
              referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{ref.agentName}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{ref.schoolName}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₦{ref.commissionAmount}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(ref.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><Badge status={ref.status} /></td>
                  <td className="px-6 py-4 text-right">
                    {ref.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-emerald-500 hover:text-emerald-700"><CheckCircle size={16}/></button>
                        <button className="text-rose-500 hover:text-rose-700"><XCircle size={16}/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
