'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { CheckCircle2, XCircle, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { fetchSchools, verifySchool } from '@/lib/api';
import { School } from '@/lib/types';

export default function SchoolVerificationsPage() {
  const [pendingSchools, setPendingSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchSchools();
      setPendingSchools(data.filter((s) => s.verification_status === 'PENDING_VERIFICATION'));
      setLoading(false);
    }
    load();
  }, []);

  const handleApprove = async (schoolId: string) => {
    const ok = await verifySchool(schoolId, 'VERIFIED');
    if (ok) {
      setPendingSchools((prev) => prev.filter((s) => s.id !== schoolId));
    }
  };

  const handleReject = async (schoolId: string) => {
    const ok = await verifySchool(schoolId, 'REJECTED', rejectReason);
    if (ok) {
      setPendingSchools((prev) => prev.filter((s) => s.id !== schoolId));
      setSelectedSchool(null);
      setRejectReason('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="School Verification Queue"
        subtitle="Review CAC incorporation documents, Ministry of Education licenses, and approve tenant onboarding"
      />

      <div className="p-8 space-y-6">
        {/* Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Compliance Notice:</strong> Unverified schools cannot publish report cards or receive scratch card PIN allocations.
            </span>
          </div>
          <span className="font-bold bg-amber-200/60 px-2.5 py-1 rounded-full text-[11px]">
            {pendingSchools.length} Pending Actions
          </span>
        </div>

        {/* Verification Queue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSchools.length > 0 ? (
            pendingSchools.map((school) => (
              <div key={school.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{school.name}</h4>
                    <p className="text-xs text-slate-500">{school.contact_email || 'No email'}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{school.state || 'Lagos'}, {school.lga || 'Nigeria'}</p>
                  </div>
                  <Badge status="PENDING_VERIFICATION" />
                </div>

                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 text-slate-600 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">School Code:</span>
                    <span className="font-semibold text-slate-800">{school.school_code || 'GHS-001'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Referred By Agent:</span>
                    <span className="font-semibold text-blue-600">{school.referred_by_agent_id ? 'Agent Registered' : 'Organic Direct'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Selected Tier:</span>
                    <span className="font-semibold text-slate-800">{school.subscription_tier}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between space-x-3">
                  <button
                    onClick={() => handleApprove(school.id)}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Verify</span>
                  </button>
                  <button
                    onClick={() => setSelectedSchool(school)}
                    className="px-3 py-2 border border-rose-200 text-rose-600 rounded-lg font-bold text-xs hover:bg-rose-50 transition-colors flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 bg-white rounded-xl border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Verification Queue Clear</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All submitted school registrations have been reviewed. New onboarding requests will appear here in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
