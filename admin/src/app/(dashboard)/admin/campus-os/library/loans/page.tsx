'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  BookOpen
} from 'lucide-react';
import { fetchLibraryLoans, LibraryLoan } from '@/lib/campus-api';

const STATUS_OPTIONS = ['All Loans', 'ACTIVE', 'OVERDUE', 'RETURNED'];

export default function LibraryLoansPage() {
  const [loans, setLoans] = useState<LibraryLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All Loans');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newLoan, setNewLoan] = useState({
    book_title: 'Things Fall Apart',
    borrower_name: '',
    borrower_id: '',
    borrower_type: 'STUDENT' as const,
    due_date: '2026-12-05',
  });

  useEffect(() => {
    loadLoans();
  }, []);

  async function loadLoans() {
    setLoading(true);
    const data = await fetchLibraryLoans();
    setLoans(data);
    setLoading(false);
  }

  function handleCreateLoan(e: React.FormEvent) {
    e.preventDefault();
    if (!newLoan.borrower_name || !newLoan.borrower_id) return;

    const created: LibraryLoan = {
      id: `loan-${Date.now()}`,
      tenant_id: 'tenant_default',
      book_id: 'bk-custom',
      book_title: newLoan.book_title,
      borrower_id: newLoan.borrower_id,
      borrower_name: newLoan.borrower_name,
      borrower_type: newLoan.borrower_type,
      borrowed_date: new Date().toISOString().split('T')[0],
      due_date: newLoan.due_date,
      status: 'ACTIVE',
    };

    setLoans((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewLoan({
      book_title: 'Things Fall Apart',
      borrower_name: '',
      borrower_id: '',
      borrower_type: 'STUDENT',
      due_date: '2026-12-05',
    });
  }

  function handleReturnBook(id: string) {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: 'RETURNED',
              return_date: new Date().toISOString().split('T')[0],
            }
          : l
      )
    );
  }

  const filteredLoans = loans.filter((l) => {
    const matchesStatus = selectedStatus === 'All Loans' || l.status === selectedStatus;
    const matchesSearch =
      (l.book_title && l.book_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      l.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.borrower_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, student or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Book Loan</span>
        </button>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Library Book Circulation & Borrowing Log</h3>
            <p className="text-xs text-slate-500">Track student and faculty book loans, return dates, and late penalties</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            {filteredLoans.length} Loans Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Borrower Details</th>
                <th className="py-3 px-4">Borrowed Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Loan Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLoans.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{l.book_title || 'General Library Text'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{l.borrower_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {l.borrower_id} • {l.borrower_type}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{l.borrowed_date}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] font-medium text-slate-700">{l.due_date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      l.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                      l.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {l.status !== 'RETURNED' ? (
                      <button
                        onClick={() => handleReturnBook(l.id)}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors"
                      >
                        Mark Returned
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        Returned {l.return_date || ''}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Loan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Issue Book Loan</h3>
            <p className="text-xs text-slate-500 mb-4">Assign book barcode to student or faculty borrower</p>

            <form onSubmit={handleCreateLoan} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Things Fall Apart"
                  value={newLoan.book_title}
                  onChange={(e) => setNewLoan({ ...newLoan, book_title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Borrower Type</label>
                  <select
                    value={newLoan.borrower_type}
                    onChange={(e) => setNewLoan({ ...newLoan, borrower_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher / Faculty</option>
                    <option value="STAFF">Administrative Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Borrower ID</label>
                  <input
                    type="text"
                    required
                    placeholder="STU-2026-089"
                    value={newLoan.borrower_id}
                    onChange={(e) => setNewLoan({ ...newLoan, borrower_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Borrower Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamsiyochukwu Ani"
                  value={newLoan.borrower_name}
                  onChange={(e) => setNewLoan({ ...newLoan, borrower_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Due Return Date</label>
                <input
                  type="date"
                  required
                  value={newLoan.due_date}
                  onChange={(e) => setNewLoan({ ...newLoan, due_date: e.target.value })}
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
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
