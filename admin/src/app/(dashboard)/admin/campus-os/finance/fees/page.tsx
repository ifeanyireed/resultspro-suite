'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Edit2,
  DollarSign,
  Building2,
  Sparkles
} from 'lucide-react';
import { fetchFeeStructures, FeeStructure } from '@/lib/campus-api';

export default function FinanceFeesPage() {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newFee, setNewFee] = useState({
    class_level: '',
    term: '1st Term 2026/2027',
    tuition_fee: 350000,
    development_levy: 40000,
    ict_stem_fee: 30000,
    exam_materials_fee: 20000,
    due_date: '2026-12-15',
  });

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    setLoading(true);
    const data = await fetchFeeStructures();
    setFees(data);
    setLoading(false);
  }

  function handleCreateFee(e: React.FormEvent) {
    e.preventDefault();
    if (!newFee.class_level) return;

    const total =
      Number(newFee.tuition_fee) +
      Number(newFee.development_levy) +
      Number(newFee.ict_stem_fee) +
      Number(newFee.exam_materials_fee);

    const created: FeeStructure = {
      id: `fee-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newFee,
      total_due: total,
    };

    setFees((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewFee({
      class_level: '',
      term: '1st Term 2026/2027',
      tuition_fee: 350000,
      development_levy: 40000,
      ict_stem_fee: 30000,
      exam_materials_fee: 20000,
      due_date: '2026-12-15',
    });
  }

  const filteredFees = fees.filter((f) =>
    f.class_level.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fee tier or term..."
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
          <span>New Fee Structure</span>
        </button>
      </div>

      {/* Fee Structures Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFees.map((fee) => (
          <div
            key={fee.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  {fee.term}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Due {fee.due_date}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-3">
                {fee.class_level}
              </h3>

              {/* Fee Breakdown List */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-100 py-3 mb-3">
                <div className="flex items-center justify-between">
                  <span>Tuition & Instruction:</span>
                  <span className="font-semibold text-slate-900">₦{fee.tuition_fee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Development & Capital Levy:</span>
                  <span className="font-semibold text-slate-900">₦{fee.development_levy.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ICT & STEM Practical Labs:</span>
                  <span className="font-semibold text-slate-900">₦{fee.ict_stem_fee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Examination & CBT Materials:</span>
                  <span className="font-semibold text-slate-900">₦{fee.exam_materials_fee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Due Per Term</span>
                <div className="text-xl font-black text-blue-600">₦{fee.total_due.toLocaleString()}</div>
              </div>
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center gap-1">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Tier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Fee Structure Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Fee Structure</h3>
            <p className="text-xs text-slate-500 mb-4">Set tuition components and deadline for class arm</p>

            <form onSubmit={handleCreateFee} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Class Level / Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Secondary (SS1 - SS3)"
                  value={newFee.class_level}
                  onChange={(e) => setNewFee({ ...newFee, class_level: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Academic Term</label>
                  <input
                    type="text"
                    required
                    value={newFee.term}
                    onChange={(e) => setNewFee({ ...newFee, term: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={newFee.due_date}
                    onChange={(e) => setNewFee({ ...newFee, due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Tuition Fee (₦)</label>
                  <input
                    type="number"
                    required
                    value={newFee.tuition_fee}
                    onChange={(e) => setNewFee({ ...newFee, tuition_fee: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Development Levy (₦)</label>
                  <input
                    type="number"
                    required
                    value={newFee.development_levy}
                    onChange={(e) => setNewFee({ ...newFee, development_levy: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ICT / STEM Practical (₦)</label>
                  <input
                    type="number"
                    required
                    value={newFee.ict_stem_fee}
                    onChange={(e) => setNewFee({ ...newFee, ict_stem_fee: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Exam & CBT Fee (₦)</label>
                  <input
                    type="number"
                    required
                    value={newFee.exam_materials_fee}
                    onChange={(e) => setNewFee({ ...newFee, exam_materials_fee: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
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
                  Save Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
