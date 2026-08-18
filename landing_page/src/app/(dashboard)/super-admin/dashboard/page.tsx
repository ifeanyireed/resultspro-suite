import React from 'react';
import { 
  BuildingLibraryIcon, 
  UsersIcon, 
  BanknotesIcon, 
  ChartBarIcon, 
  ShieldExclamationIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function SuperAdminDashboard() {
  return (
    <div className="dashboard-page min-h-screen bg-[#F5F3FF] p-8 font-sans text-[#1E1B4B]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Admin Dashboard</h1>
            <p className="text-[#475569] mt-1">ResultPRO HQ Command Center</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
              Export Ledger
            </button>
            <button className="px-4 py-2 bg-[#6366F1] text-white rounded-lg shadow-sm hover:bg-[#4F46E5] transition-colors duration-200 text-sm font-medium">
              System Settings
            </button>
          </div>
        </div>

        {/* Tab Navigation (Placeholder for now) */}
        <div className="flex space-x-1 border-b border-gray-200">
          <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-[#6366F1] text-[#6366F1]">
            School Command Center
          </button>
          <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors cursor-pointer">
            Agent & Agency Mgmt
          </button>
          <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors cursor-pointer">
            Revenue Ledger
          </button>
        </div>

        {/* Dashboard Content - Screen A: School Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Master List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BuildingLibraryIcon className="w-5 h-5 text-[#6366F1]" />
                  Master School List
                </h3>
                <select className="text-sm border-gray-200 rounded-md shadow-sm focus:ring-[#6366F1] focus:border-[#6366F1] py-1.5 pl-3 pr-8 cursor-pointer">
                  <option>All Statuses</option>
                  <option>Pending Verification</option>
                  <option>Active</option>
                  <option>Churned</option>
                </select>
              </div>
              <div className="p-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Agent</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Placeholder Row 1 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Greenwood High</div>
                        <div className="text-sm text-gray-500">Lagos, Nigeria</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4" />
                        Agent John Doe
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#6366F1] hover:text-[#4F46E5] mr-3 cursor-pointer">Reassign</button>
                        <button className="text-[#10B981] hover:text-[#059669] cursor-pointer">Impersonate</button>
                      </td>
                    </tr>
                    {/* Placeholder Row 2 */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Excel Academy</div>
                        <div className="text-sm text-gray-500">Abuja, Nigeria</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4" />
                        In-House (HQ)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#6366F1] hover:text-[#4F46E5] mr-3 cursor-pointer">Reassign</button>
                        <button className="text-[#10B981] hover:text-[#059669] cursor-pointer">Impersonate</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <div className="bg-[#6366F1] text-white rounded-xl shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ChartBarIcon className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-medium opacity-90 mb-1">System Health</h3>
              <div className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-fira-code, monospace)' }}>
                98.9%
              </div>
              <div className="space-y-2 text-sm opacity-80">
                <div className="flex justify-between">
                  <span>Active Schools</span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Agents</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </div>

            {/* Edge Cases / Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ShieldExclamationIcon className="w-5 h-5 text-red-500" />
                Action Required
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-red-50 rounded-lg text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-red-800">Dispute: Stolen Lead</p>
                    <p className="text-red-600 mt-0.5">Agent Sarah claims Excel Academy.</p>
                  </div>
                  <button className="text-xs font-bold text-red-700 uppercase cursor-pointer hover:underline">Resolve</button>
                </li>
                <li className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">Payout Queue</p>
                    <p className="text-yellow-600 mt-0.5">5 agents awaiting withdrawal.</p>
                  </div>
                  <button className="text-xs font-bold text-yellow-700 uppercase cursor-pointer hover:underline">Review</button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
