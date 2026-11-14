'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit2,
  Download,
  Building2,
  UserCheck
} from 'lucide-react';
import { fetchTimetableSlots, createTimetableSlot, TimetableSlot } from '@/lib/campus-api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CLASSES = ['All Classes', 'SS3 A', 'SS3 B', 'SS2 Science', 'SS1 Arts', 'JS3 Ruby', 'JS1 Gold'];

export default function AcademicTimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDay, setSelectedDay] = useState('All Days');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newSlot, setNewSlot] = useState({
    class_name: 'SS3 A',
    day_of_week: 'Monday',
    period_index: 1,
    start_time: '08:00',
    end_time: '08:45',
    subject: '',
    teacher_name: '',
    room: 'Hall 3A',
  });

  useEffect(() => {
    loadSlots();
  }, [selectedClass]);

  async function loadSlots() {
    setLoading(true);
    const data = await fetchTimetableSlots(undefined, selectedClass === 'All Classes' ? undefined : selectedClass);
    setSlots(data);
    setLoading(false);
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!newSlot.subject || !newSlot.teacher_name) return;

    const created: TimetableSlot = {
      id: `tt-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newSlot,
    };

    await createTimetableSlot(created);
    setSlots((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewSlot({
      class_name: 'SS3 A',
      day_of_week: 'Monday',
      period_index: 1,
      start_time: '08:00',
      end_time: '08:45',
      subject: '',
      teacher_name: '',
      room: 'Hall 3A',
    });
  }

  const filteredSlots = slots.filter((slot) => {
    const matchesDay = selectedDay === 'All Days' || slot.day_of_week === selectedDay;
    const matchesSearch =
      slot.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDay && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          {/* Day Filter */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All Days">All Days (Mon - Fri)</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subject or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Period Slot</span>
          </button>
        </div>
      </div>

      {/* Timetable Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institutional Bell Schedule & Room Allocation</h3>
            <p className="text-xs text-slate-500">Live roster synchronizing with teacher portals and digital noticeboards</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            {filteredSlots.length} Slots Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Class Arm</th>
                <th className="py-3 px-4">Subject & Curriculum</th>
                <th className="py-3 px-4">Assigned Faculty</th>
                <th className="py-3 px-4">Venue / Hall</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-black">
                        P{slot.period_index}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{slot.day_of_week}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                      {slot.class_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{slot.subject}</td>
                  <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>{slot.teacher_name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200/60 font-medium text-[11px]">
                      {slot.room}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Bell Period Slot</h3>
            <p className="text-xs text-slate-500 mb-4">Allocate subject, instructor, and classroom to the master timetable</p>

            <form onSubmit={handleAddSlot} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Class Arm</label>
                  <select
                    value={newSlot.class_name}
                    onChange={(e) => setNewSlot({ ...newSlot, class_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {CLASSES.filter((c) => c !== 'All Classes').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Day of Week</label>
                  <select
                    value={newSlot.day_of_week}
                    onChange={(e) => setNewSlot({ ...newSlot, day_of_week: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Subject & Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Further Mathematics / Calculus"
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Assigned Teacher</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. D. Adeleke"
                  value={newSlot.teacher_name}
                  onChange={(e) => setNewSlot({ ...newSlot, teacher_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Period Index</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSlot.period_index}
                    onChange={(e) => setNewSlot({ ...newSlot, period_index: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="text"
                    placeholder="08:00"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="text"
                    placeholder="08:45"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Classroom / Lab Venue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Lab 1 or Hall 3A"
                  value={newSlot.room}
                  onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
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
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
