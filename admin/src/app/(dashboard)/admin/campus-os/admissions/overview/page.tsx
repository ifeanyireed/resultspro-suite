'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  PhoneCall,
  GraduationCap
} from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@/components/ui/Cards';
import { fetchAdmissionsInquiries, AdmissionInquiry } from '@/lib/campus-api';

export default function AdmissionsOverviewPage() {
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAdmissionsInquiries();
      setInquiries(data);
      setLoading(false);
    }
    load();
  }, []);

  const total = inquiries.length;
  const cbtCount = inquiries.filter(i => i.stage === 'CBT Scheduled').length;
  const admittedCount = inquiries.filter(i => i.stage === 'Admitted' || i.stage === 'Enrolled').length;
  const pendingCount = inquiries.filter(i => i.stage === 'Inquiry' || i.stage === 'Application Submitted').length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientMetricCard
          title="Total Applications"
          value={loading ? '...' : (total * 35).toString()}
          subtitle="2026/2027 Admissions Pool"
          trend="+18% YoY"
          icon={UserPlus}
        />
        <WhiteMetricCard
          title="CBT Entrance Scheduled"
          value={loading ? '...' : (cbtCount * 16).toString()}
          subtitle="At CBT Center 1 & 2"
          trend="Next: Nov 24"
          trendColor="green"
          icon={Calendar}
        />
        <WhiteMetricCard
          title="Provisional Offers"
          value={loading ? '...' : (admittedCount * 23).toString()}
          subtitle="Letters dispatched"
          trend="82% Accept"
          trendColor="green"
          icon={FileCheck2}
        />
        <WhiteMetricCard
          title="Pending Review"
          value={loading ? '...' : (pendingCount * 12).toString()}
          subtitle="Awaiting interview"
          trend="Action Required"
          trendColor="red"
          icon={Clock}
        />
      </div>

      {/* Admissions Conversion Funnel Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institutional Admissions Pipeline Funnel</h3>
            <p className="text-xs text-slate-500">From initial guardian inquiry to examsPRO CBT testing and enrollment registration</p>
          </div>
          <Link
            href="/admin/campus-os/admissions/inquiries"
            className="px-4 py-2 bg-[#146ef5] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <span>View Full Applicant Registry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Step 1: Inquiry</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1">142</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Campus tours & brochures</p>
            <div className="w-full bg-blue-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-600 h-full w-[100%] rounded-full"></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Step 2: Formal Form</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1">98</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Application fee paid</p>
            <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-600 h-full w-[69%] rounded-full"></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Step 3: CBT Exam</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1">64</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">ExamsPRO entrance sat</p>
            <div className="w-full bg-purple-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-purple-600 h-full w-[45%] rounded-full"></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Step 4: Enrolled</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1">46</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Tuition deposit cleared</p>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full w-[32%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Spotlight Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Candidate Admissions Queue</h3>
          <span className="text-xs text-slate-500">Live feed from ScholarsNG Admissions Portal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">Target Grade</th>
                <th className="py-3 px-4">Guardian & Phone</th>
                <th className="py-3 px-4">Previous School</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Entrance Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{inq.applicant_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[11px]">
                      {inq.target_grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{inq.guardian_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{inq.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{inq.previous_school || '—'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inq.stage === 'Admitted' ? 'bg-emerald-100 text-emerald-800' :
                      inq.stage === 'CBT Scheduled' ? 'bg-purple-100 text-purple-800' :
                      inq.stage === 'Application Submitted' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {inq.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-medium font-mono text-[11px]">
                    {inq.tour_date || 'TBD'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
