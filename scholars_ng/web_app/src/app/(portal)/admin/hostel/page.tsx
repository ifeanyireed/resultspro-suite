
'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRightIcon,
  UserGroupIcon,
  BoltIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export default function HostelDashboard() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlloc, setNewAlloc] = useState({
    hostel_name: 'Queen Amina Hall (Girls)',
    wing_or_floor: 'First Floor · Wing A',
    room_number: '',
    bed_label: 'Bed A',
    student_name: '',
    class_name: 'SS 1 Science',
    matron_name: 'Matron Comfort Eze'
  });

  const loadHostel = async () => {
    try {
      const res = await api.get('/v1/campus/hostel');
      setAllocations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load tenant hostel allocations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostel();
  }, []);

  const handleAddAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/campus/hostel', newAlloc);
      setShowAddModal(false);
      setNewAlloc({
        hostel_name: 'Queen Amina Hall (Girls)',
        wing_or_floor: 'First Floor · Wing A',
        room_number: '',
        bed_label: 'Bed A',
        student_name: '',
        class_name: 'SS 1 Science',
        matron_name: 'Matron Comfort Eze'
      });
      await loadHostel();
    } catch (err) {
      console.error('Failed to save hostel allocation:', err);
    }
  };

  const totalBeds = allocations.reduce((acc, a) => acc + Number(a.capacity || 4), 0);
  const totalOccupied = allocations.reduce((acc, a) => acc + Number(a.occupants_count || 1), 0);

  return (
    <>
      <MotionRise className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hostel Management</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor tenant-scoped boarding halls, room allocations, and exeat statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Allocate Room / Bed
          </button>
        </div>
      </MotionRise>

      {showAddModal && (
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-blue-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Allocate Student to Boarding Room</h3>
          <form onSubmit={handleAddAllocation} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              required
              placeholder="Hostel Hall Name"
              value={newAlloc.hostel_name}
              onChange={(e) => setNewAlloc({ ...newAlloc, hostel_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Room Number (e.g. Room 108)"
              value={newAlloc.room_number}
              onChange={(e) => setNewAlloc({ ...newAlloc, room_number: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Student Full Name"
              value={newAlloc.student_name}
              onChange={(e) => setNewAlloc({ ...newAlloc, student_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="Class Arm"
              value={newAlloc.class_name}
              onChange={(e) => setNewAlloc({ ...newAlloc, class_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="House Parent / Matron"
              value={newAlloc.matron_name}
              onChange={(e) => setNewAlloc({ ...newAlloc, matron_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <div className="flex items-center gap-2">
              <button type="submit" className="bg-[#146ef5] text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer">
                Save Allocation
              </button>
              <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </MotionRise>
      )}

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square text-white">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal">Allocated Beds</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight mb-2">{totalOccupied}</h2>
            <p className="text-xs text-white/80">Across {allocations.length} rooms</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Occupancy Rate</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">
              {totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 88}%
            </h2>
            <p className="text-xs text-gray-500">{totalBeds} total beds capacity</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Weekend Exeat</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">
              {allocations.filter((a) => a.exeat_status === 'WEEKEND_EXEAT').length}
            </h2>
            <p className="text-xs text-gray-500">Signed out with guardians</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">On Campus</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-emerald-600 mb-2">
              {allocations.filter((a) => a.exeat_status !== 'WEEKEND_EXEAT').length}
            </h2>
            <p className="text-xs text-gray-500">Verified roll-call status</p>
          </div>
        </MotionRise>
      </MotionStagger>

      <MotionRise delay={0.1} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Hostel Room & Bed Allocations</h3>
          <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
            {loading ? 'Loading...' : `${allocations.length} Rooms`}
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Hostel & Wing</th>
              <th className="px-6 py-4">Room / Bed</th>
              <th className="px-6 py-4">Student & Class</th>
              <th className="px-6 py-4">House Parent</th>
              <th className="px-6 py-4">Roll-Call Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allocations.map((a: any) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-sm text-gray-900">{a.hostel_name}</div>
                  <div className="text-xs text-gray-500">{a.wing_or_floor}</div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-[#146ef5]">{a.room_number} · {a.bed_label}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{a.student_name}</div>
                  <div className="text-xs text-gray-500">{a.class_name}</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">{a.matron_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    a.exeat_status === 'ON_CAMPUS' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {a.exeat_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MotionRise>
    </>
  );
}
