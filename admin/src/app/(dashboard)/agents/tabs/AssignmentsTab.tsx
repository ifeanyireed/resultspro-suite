import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function AssignmentsTab() {
  const [assignments, setAssignments] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors text-xs border border-blue-200">
          <Plus className="w-4 h-4" />
          Assign School
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Agent</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Assigned School</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Commission</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No school assignments found</td>
              </tr>
            ) : (
              assignments.map((asgn) => (
                <tr key={asgn.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{asgn.agentName}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{asgn.schoolName}</td>
                  <td className="px-6 py-4 text-slate-600">{asgn.role}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{asgn.commissionRate}%</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(asgn.assignedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-rose-500 hover:text-rose-700"><Trash2 size={16}/></button>
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
