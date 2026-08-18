'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Building2, Search, Filter, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { fetchSchools, verifySchool } from '@/lib/api';
import { School } from '@/lib/types';

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchSchools();
      setSchools(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleVerify = async (schoolId: string, status: 'VERIFIED' | 'REJECTED') => {
    const ok = await verifySchool(schoolId, status);
    if (ok) {
      setSchools((prev) =>
        prev.map((s) => (s.id === schoolId ? { ...s, verification_status: status } : s))
      );
    }
  };

  const filtered = schools.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.contact_email && s.contact_email.toLowerCase().includes(search.toLowerCase()));
    const matchTier = filterTier === 'ALL' || s.subscription_tier === filterTier;
    const matchStatus = filterStatus === 'ALL' || s.verification_status === filterStatus;
    return matchSearch && matchTier && matchStatus;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Organizations & Schools"
        subtitle="Manage multi-tenant school institutions, tiers, and white-label branding"
      />

      <div className="p-8 space-y-6">
        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by school name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-600">Plan:</span>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Plans</option>
                <option value="FREE">Free</option>
                <option value="BASIC">Basic</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-600">Verification:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING_VERIFICATION">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schools Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">School Name</th>
                  <th className="px-6 py-3.5">Contact Email</th>
                  <th className="px-6 py-3.5">Subscription Tier</th>
                  <th className="px-6 py-3.5">Verification</th>
                  <th className="px-6 py-3.5">State / LGA</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((school) => (
                    <tr key={school.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-sm"
                          style={{ backgroundColor: school.primary_color || '#2563eb' }}
                        >
                          {school.logo_emoji || school.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{school.name}</p>
                          <p className="text-[11px] text-slate-400 font-normal">slug: {school.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{school.contact_email || '—'}</td>
                      <td className="px-6 py-4">
                        <Badge status={school.subscription_tier} />
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={school.verification_status} />
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {school.state ? `${school.state}, ${school.lga || ''}` : 'Nigeria'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {school.verification_status === 'PENDING_VERIFICATION' && (
                          <>
                            <button
                              onClick={() => handleVerify(school.id, 'VERIFIED')}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded font-semibold text-[11px] hover:bg-emerald-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerify(school.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded font-semibold text-[11px] hover:bg-rose-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <a
                          href={`https://schoolhub.resultspro.ng/school/${school.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded font-semibold text-[11px] hover:bg-slate-200 transition-colors"
                        >
                          Portal <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No schools found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
