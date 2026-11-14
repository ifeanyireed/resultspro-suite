"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { 
  CheckBadgeIcon, 
  ArrowDownTrayIcon, 
  ShareIcon, 
  LockClosedIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface EarnedCertificate {
  id: string;
  title: string;
  credential_id: string;
  recipient_name: string;
  issued_by: string;
  issue_date: string;
  cohort_title: string;
  badge_level: string;
  verification_url: string;
  type: string;
}

interface UpcomingCertificate {
  id: string;
  title: string;
  cohort_title: string;
  progress: number;
  criteria: string;
  lock_reason: string;
}

export default function CertificatesPage() {
  const { user } = useAuthStore();
  const [selectedCert, setSelectedCert] = useState<EarnedCertificate | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['student-certificates', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/certificates');
      return res.data || { earned: [], upcoming: [], stats: { total_earned: 0, in_progress: 0 } };
    },
    enabled: !!user,
  });

  const earned: EarnedCertificate[] = data?.earned || [];
  const upcoming: UpcomingCertificate[] = data?.upcoming || [];
  const stats = data?.stats || { total_earned: earned.length, in_progress: upcoming.length };

  const handleCopyCredential = (credId: string) => {
    navigator.clipboard.writeText(credId);
    toast.success('Credential ID copied to clipboard!');
  };

  const handleShareLinkedIn = (cert: EarnedCertificate) => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.title)}&organizationName=${encodeURIComponent(cert.issued_by)}&issueYear=${new Date().getFullYear()}&certId=${encodeURIComponent(cert.credential_id)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = (cert: EarnedCertificate) => {
    setSelectedCert(cert);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <MotionRise className="space-y-10 pb-16">
      {/* Header & KPI Summary */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              Accredited Diplomas & Credentials
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Certificates</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Cryptographically verifiable academic credentials and specialization certificates issued upon successful program graduation and mentor signoff.
          </p>
        </div>

        {/* Credential Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-emerald-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckBadgeSolid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Earned Credentials</p>
              <p className="font-extrabold text-sm">{stats.total_earned} Certificate{stats.total_earned === 1 ? '' : 's'}</p>
            </div>
          </div>

          <div className="bg-blue-50 text-[#146ef5] px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-blue-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#146ef5]">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">In Progress</p>
              <p className="font-extrabold text-sm">{stats.in_progress} Pending</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-3 border-[#146ef5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 font-medium text-sm">Verifying graduation credentials...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* SECTION 1: EARNED CERTIFICATES */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckBadgeSolid className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Earned Diplomas & Badges</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {earned.length} Available for Export
              </span>
            </div>

            {earned.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[2rem] p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                  <CheckBadgeIcon className="w-8 h-8 text-gray-300 stroke-1" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No credentials earned yet</h3>
                <p className="text-gray-500 text-xs max-w-md mx-auto mb-6">
                  Complete your curriculum stages, pass capstone project evaluations, and receive mentor signoff to generate your verified certificate.
                </p>
                <Link
                  href="/dashboard/journey"
                  className="inline-flex items-center gap-2 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  <AcademicCapIcon className="w-4 h-4" /> Go to Learning Journey
                </Link>
              </div>
            ) : (
              <MotionStagger className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {earned.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white border border-gray-200/90 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    {/* Digital Diploma Canvas */}
                    <div className="relative p-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
                      {/* Geometric Background Accents */}
                      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

                      {/* Header Badge */}
                      <div className="flex items-center justify-between relative z-10 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
                            <SparklesIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-amber-300/90 font-bold block">
                              Official Credential
                            </span>
                            <span className="text-xs text-white/70 font-medium">
                              {cert.issued_by}
                            </span>
                          </div>
                        </div>

                        {/* Verified Stamp */}
                        <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full text-emerald-300 text-[11px] font-bold">
                          <CheckBadgeSolid className="w-3.5 h-3.5" />
                          <span>VERIFIED</span>
                        </div>
                      </div>

                      {/* Certificate Core Information */}
                      <div className="relative z-10 space-y-2 mb-6">
                        <p className="text-xs text-indigo-200 font-mono">This is to certify that</p>
                        <h4 className="text-2xl font-extrabold text-white tracking-tight">
                          {cert.recipient_name}
                        </h4>
                        <p className="text-xs text-indigo-200 leading-relaxed pt-1">
                          has successfully fulfilled all curriculum requirements, evaluations, and practical sprint projects for
                        </p>
                        <h3 className="text-lg font-bold text-amber-300 tracking-tight">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Footer Metadata */}
                      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">Credential ID</p>
                          <p className="font-mono font-bold text-white/90">{cert.credential_id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-white/40">Date Issued</p>
                          <p className="font-semibold text-white/90">{cert.issue_date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-5 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCredential(cert.credential_id)}
                          className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-200/80"
                          title="Copy Credential ID"
                        >
                          <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span>Copy ID</span>
                        </button>
                        <button
                          onClick={() => handlePrint(cert)}
                          className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-200/80"
                          title="Print or Save PDF"
                        >
                          <ArrowDownTrayIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span>Print / PDF</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShareLinkedIn(cert)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#146ef5] text-xs font-bold flex items-center gap-1.5 transition-colors"
                          title="Add to LinkedIn Profile"
                        >
                          <ShareIcon className="w-3.5 h-3.5" />
                          <span>Share to LinkedIn</span>
                        </button>
                        {user && (
                          <Link
                            href="/dashboard/portfolio"
                            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                            title="View in Public Portfolio"
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </MotionStagger>
            )}
          </section>

          {/* SECTION 2: UPCOMING & LOCKED CERTIFICATES */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LockClosedIcon className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Upcoming & Locked Credentials</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {upcoming.length} In Progress
              </span>
            </div>

            {upcoming.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-xs">
                <DocumentCheckIcon className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-gray-900">All Available Certifications Completed!</h4>
                <p className="text-xs text-gray-500 mt-1">
                  You have earned all credentials linked to your current cohort enrollments.
                </p>
              </div>
            ) : (
              <MotionStagger className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcoming.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xs flex flex-col sm:flex-row gap-6 hover:shadow-sm transition-all"
                  >
                    {/* Badge Icon With Progress Ring */}
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden self-center sm:self-start">
                      <AcademicCapIcon className="w-8 h-8 text-gray-400 stroke-1" />
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
                        <div
                          className="h-full bg-[#146ef5] transition-all"
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                              {cert.cohort_title}
                            </span>
                            <h3 className="font-bold text-gray-900 text-base">{cert.title}</h3>
                          </div>
                          <span className="text-xs font-bold text-[#146ef5] bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                            {cert.progress}% Complete
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{cert.criteria}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
                          <LockClosedIcon className="w-3.5 h-3.5 text-amber-600" />
                          <span>{cert.lock_reason}</span>
                        </div>
                        <Link
                          href="/dashboard/journey"
                          className="text-xs font-bold text-[#146ef5] hover:text-[#105bd1] transition-colors"
                        >
                          Continue Sprint →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </MotionStagger>
            )}
          </section>
        </div>
      )}
    </MotionRise>
  );
}
