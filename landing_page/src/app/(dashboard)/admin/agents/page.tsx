"use client";

import React from 'react';
import { 
  PlusIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

export default function ManageAgentsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Agents</h1>
          <p className="text-sm text-gray-500 mt-1">Add, suspend, and view performance of your sales agents.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add New Agent
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-64 bg-white border border-gray-200 outline-none rounded-lg py-2 px-4 text-sm text-gray-700 shadow-sm"
            />
            <select className="bg-white border border-gray-200 outline-none rounded-lg py-2 px-4 text-sm text-gray-700 shadow-sm appearance-none">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total: 48 Agents</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs text-gray-500 font-semibold border-b border-gray-100 uppercase tracking-wider">
                <th className="p-4 pl-6">Agent Details</th>
                <th className="p-4">Region</th>
                <th className="p-4">Schools</th>
                <th className="p-4">Total Revenue</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                      <img src="/character1.jpg" alt="Agent Avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">Totok Michael</p>
                      <p className="text-[10px] text-gray-500">tmichael20@gmail.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">Lagos State</td>
                <td className="p-4 font-bold text-gray-900">12</td>
                <td className="p-4 font-bold text-[#146ef5]">₦1,250,000</td>
                <td className="p-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">Active</span></td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-gray-400 hover:text-gray-900"><EllipsisVerticalIcon className="w-5 h-5 inline" /></button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                      <img src="/character2.jpg" alt="Agent Avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">Sarah Johnson</p>
                      <p className="text-[10px] text-gray-500">sarah.j@resultspro.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">Abuja (FCT)</td>
                <td className="p-4 font-bold text-gray-900">9</td>
                <td className="p-4 font-bold text-[#146ef5]">₦850,000</td>
                <td className="p-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">Active</span></td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-gray-400 hover:text-gray-900"><EllipsisVerticalIcon className="w-5 h-5 inline" /></button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                      <img src="/character3.jpg" alt="Agent Avatar" className="w-8 h-8 rounded-full object-cover grayscale opacity-50" />
                    <div>
                      <p className="font-bold text-gray-500 line-through">David Adebayo</p>
                      <p className="text-[10px] text-gray-400">david@resultspro.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-400">Ogun State</td>
                <td className="p-4 font-bold text-gray-400">2</td>
                <td className="p-4 font-bold text-gray-400">₦150,000</td>
                <td className="p-4"><span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-md">Suspended</span></td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-gray-400 hover:text-gray-900"><EllipsisVerticalIcon className="w-5 h-5 inline" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
