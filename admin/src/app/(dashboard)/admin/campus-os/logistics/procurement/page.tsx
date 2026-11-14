'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  FileCheck2,
  Building2
} from 'lucide-react';
import { fetchInventoryItems, fetchProcurementRequests, InventoryItem, ProcurementRequest } from '@/lib/campus-api';

export default function LogisticsProcurementPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newRequest, setNewRequest] = useState({
    requested_by: '',
    department: 'Science & Robotics Lab',
    title: '',
    estimated_cost: 150000,
    approval_notes: '',
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [inv, reqs] = await Promise.all([
        fetchInventoryItems(),
        fetchProcurementRequests(),
      ]);
      setInventory(inv);
      setRequests(reqs);
      setLoading(false);
    }
    load();
  }, []);

  function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!newRequest.title || !newRequest.requested_by) return;

    const created: ProcurementRequest = {
      id: `pr-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newRequest,
      status: 'PENDING',
      created_at: new Date().toISOString().split('T')[0],
    };

    setRequests((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewRequest({
      requested_by: '',
      department: 'Science & Robotics Lab',
      title: '',
      estimated_cost: 150000,
      approval_notes: '',
    });
  }

  function handleApprove(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED', approval_notes: 'Approved by Super Admin' } : r))
    );
  }

  const filteredInventory = inventory.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory supplies, chemicals, hardware..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Procurement Requisition</span>
        </button>
      </div>

      {/* Procurement Approval Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Procurement Requisitions & Approval Pipeline</h3>
            <p className="text-xs text-slate-500">Departmental purchase requests awaiting Bursar and Principal sign-off</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg">
            {requests.filter(r => r.status === 'PENDING').length} Pending Approval
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Requisition Title</th>
                <th className="py-3 px-4">Department & Requester</th>
                <th className="py-3 px-4">Estimated Cost</th>
                <th className="py-3 px-4">Status & Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-sm">
                    <div>{req.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Date: {req.created_at}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{req.department}</div>
                    <div className="text-[11px] text-slate-500">{req.requested_by}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">
                    ₦{req.estimated_cost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block mb-1 ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {req.status}
                    </span>
                    {req.approval_notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">{req.approval_notes}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {req.status === 'PENDING' ? (
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Signed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Central Asset Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Campus Asset & Stores Inventory Roster</h3>
            <p className="text-xs text-slate-500">Live stock counts with automatic low-quantity alerts</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            {filteredInventory.length} Stock Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInventory.map((item) => {
                const isLow = item.current_stock <= item.reorder_threshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.item_name}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{item.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 font-mono text-sm">{item.current_stock}</span>
                      <span className="text-slate-400 text-[11px] ml-1">(Min: {item.reorder_threshold})</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">₦{item.unit_price.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.location}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isLow ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isLow ? 'REORDER NEEDED' : 'IN STOCK'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Procurement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">New Procurement Request</h3>
            <p className="text-xs text-slate-500 mb-4">Submit item requisition to the institutional bursary</p>

            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Item / Requisition Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Cartons A4 White Printing Paper"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Requester Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Mrs. F. Alabi"
                    value={newRequest.requested_by}
                    onChange={(e) => setNewRequest({ ...newRequest, requested_by: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="Languages & Arts"
                    value={newRequest.department}
                    onChange={(e) => setNewRequest({ ...newRequest, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Estimated Cost (₦)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={newRequest.estimated_cost}
                  onChange={(e) => setNewRequest({ ...newRequest, estimated_cost: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Justification / Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Required for terminal exam papers printing..."
                  value={newRequest.approval_notes}
                  onChange={(e) => setNewRequest({ ...newRequest, approval_notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
