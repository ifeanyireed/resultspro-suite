'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  Building2,
  Sparkles,
  Edit2
} from 'lucide-react';
import { fetchAdmissionsInquiries, createAdmissionInquiry, AdmissionInquiry } from '@/lib/campus-api';

const STAGES = ['All Stages', 'Inquiry', 'Application Submitted', 'CBT Scheduled', 'Admitted', 'Rejected'];

export default function AdmissionsInquiriesPage() {
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newInquiry, setNewInquiry] = useState({
    applicant_name: '',
    guardian_name: '',
    email: '',
    phone: '',
    target_grade: 'JS1 (Boarding)',
    previous_school: '',
    stage: 'Inquiry' as const,
    tour_date: '2026-11-28',
    notes: '',
  });

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    setLoading(true);
    const data = await fetchAdmissionsInquiries();
    setInquiries(data);
    setLoading(false);
  }

  async function handleCreateInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!newInquiry.applicant_name || !newInquiry.phone) return;

    const created: AdmissionInquiry = {
      id: `adm-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newInquiry,
      created_at: new Date().toISOString().split('T')[0],
    };

    await createAdmissionInquiry(created);
    setInquiries((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewInquiry({
      applicant_name: '',
      guardian_name: '',
      email: '',
      phone: '',
      target_grade: 'JS1 (Boarding)',
      previous_school: '',
      stage: 'Inquiry',
      tour_date: '2026-11-28',
      notes: '',
    });
  }

  function handleStageChange(id: string, stage: any) {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stage } : item))
    );
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStage = selectedStage === 'All Stages' || inq.stage === selectedStage;
    const matchesSearch =
      inq.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.guardian_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm);
    return matchesStage && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, guardian, phone..."
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
          <span>Register Applicant</span>
        </button>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Applicant Registry & Entrance Queue</h3>
            <p className="text-xs text-slate-500">Manage candidate files, interview schedules, and CBT status</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            {filteredInquiries.length} Applicants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Grade & Mode</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4">Notes & CBT Venue</th>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{inq.applicant_name}</div>
                    <div className="text-[11px] text-slate-400">Prev: {inq.previous_school || 'Private Tutoring'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[11px]">
                      {inq.target_grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="font-medium text-slate-800">{inq.guardian_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {inq.phone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                    <p className="line-clamp-1 text-[11px]">{inq.notes || 'Tour scheduled'}</p>
                    {inq.tour_date && (
                      <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {inq.tour_date}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={inq.stage}
                      onChange={(e) => handleStageChange(inq.id, e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Inquiry">Inquiry</option>
                      <option value="Application Submitted">Application Submitted</option>
                      <option value="CBT Scheduled">CBT Scheduled</option>
                      <option value="Admitted">Admitted</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                    {inq.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Applicant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Register New Candidate</h3>
            <p className="text-xs text-slate-500 mb-4">Add candidate details to initiate admissions screening</p>

            <form onSubmit={handleCreateInquiry} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chidera Emmanuel Okonkwo"
                  value={newInquiry.applicant_name}
                  onChange={(e) => setNewInquiry({ ...newInquiry, applicant_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Guardian Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief & Mrs. Okonkwo"
                    value={newInquiry.guardian_name}
                    onChange={(e) => setNewInquiry({ ...newInquiry, guardian_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+234 803 442 1190"
                    value={newInquiry.phone}
                    onChange={(e) => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Guardian Email</label>
                  <input
                    type="email"
                    placeholder="guardian@example.com"
                    value={newInquiry.email}
                    onChange={(e) => setNewInquiry({ ...newInquiry, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Class Grade</label>
                  <input
                    type="text"
                    placeholder="JS1 (Boarding)"
                    value={newInquiry.target_grade}
                    onChange={(e) => setNewInquiry({ ...newInquiry, target_grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Previous Primary/Secondary School</label>
                  <input
                    type="text"
                    placeholder="e.g. Corona Primary Gbagada"
                    value={newInquiry.previous_school}
                    onChange={(e) => setNewInquiry({ ...newInquiry, previous_school: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Entrance CBT Date</label>
                  <input
                    type="date"
                    value={newInquiry.tour_date}
                    onChange={(e) => setNewInquiry({ ...newInquiry, tour_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Internal Screening Notes</label>
                <textarea
                  rows={2}
                  placeholder="Scholarship applicant, sibling discount, boarding preferences..."
                  value={newInquiry.notes}
                  onChange={(e) => setNewInquiry({ ...newInquiry, notes: e.target.value })}
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
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
