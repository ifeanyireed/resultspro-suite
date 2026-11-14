'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  CheckCircle2,
  Users,
  Filter,
  UserCheck,
  Phone,
  BedDouble
} from 'lucide-react';
import { fetchHostelAllocations, HostelAllocation } from '@/lib/campus-api';

const HOSTELS = ['All Hostels', 'Nelson Mandela Hall (Boys Senior)', 'Queen Amina Hall (Girls Senior)', 'Tafawa Balewa Hall (Boys Junior)'];

export default function LogisticsHostelPage() {
  const [allocations, setAllocations] = useState<HostelAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHostel, setSelectedHostel] = useState('All Hostels');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newBed, setNewBed] = useState({
    hostel_name: 'Nelson Mandela Hall (Boys Senior)',
    gender: 'MALE' as const,
    room_number: 'Room 301',
    bed_number: 'Bed 301-A (Lower)',
    student_id: '',
    student_name: '',
    class_name: 'SS2 Science',
    guardian_phone: '',
    session: '2026/2027',
    term: '1st Term',
    status: 'OCCUPIED' as const,
  });

  useEffect(() => {
    loadAllocations();
  }, []);

  async function loadAllocations() {
    setLoading(true);
    const data = await fetchHostelAllocations();
    setAllocations(data);
    setLoading(false);
  }

  function handleCreateAllocation(e: React.FormEvent) {
    e.preventDefault();
    if (!newBed.student_name || !newBed.room_number) return;

    const created: HostelAllocation = {
      id: `hst-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newBed,
    };

    setAllocations((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewBed({
      hostel_name: 'Nelson Mandela Hall (Boys Senior)',
      gender: 'MALE',
      room_number: 'Room 301',
      bed_number: 'Bed 301-A (Lower)',
      student_id: '',
      student_name: '',
      class_name: 'SS2 Science',
      guardian_phone: '',
      session: '2026/2027',
      term: '1st Term',
      status: 'OCCUPIED',
    });
  }

  const filteredAllocations = allocations.filter((a) => {
    const matchesHostel = selectedHostel === 'All Hostels' || a.hostel_name === selectedHostel;
    const matchesSearch =
      a.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bed_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.class_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesHostel && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Hostel Filter */}
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {HOSTELS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, room, bed number..."
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
          <span>Allocate Bed</span>
        </button>
      </div>

      {/* Bed Allocations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hostel Halls & Boarding Bed Register</h3>
            <p className="text-xs text-slate-500">Boarding accommodations, warden records, and guardian contact registry</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            {filteredAllocations.length} Beds Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Hall & Gender</th>
                <th className="py-3 px-4">Room & Bed Slot</th>
                <th className="py-3 px-4">Resident Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Guardian Emergency Phone</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAllocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{alloc.hostel_name}</div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{alloc.gender}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{alloc.room_number}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{alloc.bed_number}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{alloc.student_name}</div>
                    {alloc.student_id && (
                      <div className="text-[11px] text-slate-400 font-mono">{alloc.student_id}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{alloc.class_name}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {alloc.guardian_phone !== '—' ? (
                      <div className="flex items-center gap-1 text-slate-700">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {alloc.guardian_phone}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      alloc.status === 'OCCUPIED' ? 'bg-emerald-100 text-emerald-800' :
                      alloc.status === 'VACANT' ? 'bg-slate-100 text-slate-700' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {alloc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocate Bed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Allocate Hostel Bed</h3>
            <p className="text-xs text-slate-500 mb-4">Assign boarding resident to room and bed space</p>

            <form onSubmit={handleCreateAllocation} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Hostel Hall</label>
                <select
                  value={newBed.hostel_name}
                  onChange={(e) => setNewBed({ ...newBed, hostel_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {HOSTELS.filter((h) => h !== 'All Hostels').map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="Room 204"
                    value={newBed.room_number}
                    onChange={(e) => setNewBed({ ...newBed, room_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Bed Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="Bed 204-A (Lower)"
                    value={newBed.bed_number}
                    onChange={(e) => setNewBed({ ...newBed, bed_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Student ID</label>
                  <input
                    type="text"
                    placeholder="STU-2026-089"
                    value={newBed.student_id}
                    onChange={(e) => setNewBed({ ...newBed, student_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Kamsiyochukwu Ani"
                    value={newBed.student_name}
                    onChange={(e) => setNewBed({ ...newBed, student_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Class Arm</label>
                  <input
                    type="text"
                    value={newBed.class_name}
                    onChange={(e) => setNewBed({ ...newBed, class_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Guardian Emergency Phone</label>
                  <input
                    type="text"
                    placeholder="+234 803 442 1190"
                    value={newBed.guardian_phone}
                    onChange={(e) => setNewBed({ ...newBed, guardian_phone: e.target.value })}
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
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
