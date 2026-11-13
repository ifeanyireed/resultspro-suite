'use client';

import React, { useState, useEffect } from 'react';
import { CompactGradebook } from './gradebook/CompactGradebook';
import { getTemplate } from '../lib/gradebookTemplates';
import type { School, SchoolResult } from '../lib/schoolData';

export interface ResultCheckerViewProps {
  standalone?: boolean;
  schoolSlug?: string;
  initialAdmissionNumber?: string;
  apiBaseUrl?: string;
  onSuccess?: (result: any) => void;
}

export const ResultCheckerView: React.FC<ResultCheckerViewProps> = ({
  standalone = false,
  schoolSlug,
  initialAdmissionNumber = '',
  apiBaseUrl,
  onSuccess,
}) => {
  const [admissionNumber, setAdmissionNumber] = useState(initialAdmissionNumber);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [school, setSchool] = useState<School | null>(null);

  // If schoolSlug is provided, attempt to fetch school details
  useEffect(() => {
    if (schoolSlug) {
      const base = apiBaseUrl || '';
      fetch(`${base}/onboarding/school/slug/${schoolSlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.data) {
            setSchool(data.data);
          }
        })
        .catch((err) => console.error('Failed to fetch school info:', err));
    }
  }, [schoolSlug, apiBaseUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!admissionNumber.trim() || !pin.trim()) {
      setError('Please provide both your Admission Number and Scratch Card PIN.');
      return;
    }

    setLoading(true);

    try {
      const base = apiBaseUrl || (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || '') : '');
      const response = await fetch(`${base}/scratch-cards/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pin: pin.trim(),
          studentAdmissionNumber: admissionNumber.trim(),
        }),
      });

      const json = await response.json().catch(() => null);

      if (response.ok && json?.success) {
        setResultData(json.data);
        if (json.data?.school) {
          setSchool(json.data.school);
        }
        setSubmitted(true);
        if (onSuccess) onSuccess(json.data);
      } else {
        setError(json?.error || 'Invalid credentials or scratch card PIN. Please verify and try again.');
      }
    } catch (err: any) {
      console.error('Scratch card validation error:', err);
      setError('Unable to connect to validation service. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setResultData(null);
    setPin('');
    setError('');
  };

  // Convert raw API response to formatted structure expected by CompactGradebook
  const formattedResult: SchoolResult | null = resultData ? {
    studentName: resultData.student?.name || resultData.studentName || admissionNumber,
    admissionNumber: resultData.student?.admissionNumber || admissionNumber,
    session: resultData.results?.session || resultData.session || '2025/2026',
    term: resultData.results?.term || resultData.term || 'First Term',
    resultType: resultData.results?.resultType || 'Terminal Examination',
    classLevel: resultData.student?.className || resultData.classLevel || 'Senior Secondary',
    position: resultData.results?.position || 'N/A',
    positionInSchool: resultData.results?.positionInSchool || 1,
    totalStudents: resultData.results?.totalStudents || 60,
    overallAverage: resultData.results?.overallAverage || 0,
    overallRemark: resultData.results?.overallRemark || 'Commendable Performance',
    sex: resultData.student?.sex || 'N/A',
    age: resultData.student?.age,
    height: resultData.student?.height,
    weight: resultData.student?.weight,
    dateOfBirth: resultData.student?.dateOfBirth,
    favouriteColor: resultData.student?.favouriteColor,
    subjects: Array.isArray(resultData.results?.subjects)
      ? resultData.results.subjects
      : Object.entries(resultData.results?.subjects || {}).map(([name, val]: [string, any]) => ({
          name,
          ...val,
        })),
    attendance: resultData.results?.attendance || {
      daysPresent: resultData.results?.daysPresent || 60,
      daysSchoolOpen: resultData.results?.daysSchoolOpen || 65,
    },
    affectiveDomain: resultData.results?.affectiveDomain,
    psychomotorDomain: resultData.results?.psychomotorDomain,
    staffInfo: resultData.results?.staffInfo,
    teacherComments: {
      principal: resultData.results?.principalComments || 'Good result, keep striving for excellence.',
      classTeacher: resultData.results?.classTeacherComments || 'Diligent and attentive student.',
    },
  } : null;

  const activeSchool: School = school || {
    slug: schoolSlug || 'resultspro-academy',
    name: resultData?.school?.name || 'Institutional Academy',
    motto: resultData?.school?.motto || 'Knowledge, Integrity & Excellence',
    logo: resultData?.school?.logo || resultData?.school?.logoUrl,
    primaryColor: '#0D1060',
    secondaryColor: '#FBBC04',
    accentColor: '#FBBC04',
    contactEmail: resultData?.school?.contactEmail || 'admin@school.ng',
    contactPhone: resultData?.school?.contactPhone || '+234 800 000 0000',
  };

  return (
    <div className={`w-full ${standalone ? 'min-h-screen bg-slate-900 text-white p-6 md:p-12' : 'p-2 md:p-6'}`}>
      {!submitted ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 text-slate-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBC04]/15 text-[#0D1060] flex items-center justify-center font-bold text-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Scratch Card PIN Verification</h3>
              <p className="text-xs text-slate-500 font-medium">Instant official academic transcript & broadsheet lookup</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Student Admission Number
              </label>
              <input
                type="text"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                placeholder="e.g. SCH/2026/0491"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FBBC04] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Scratch Card PIN / Serial
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 12-digit scratch card PIN"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FBBC04] focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !admissionNumber.trim() || !pin.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#FBBC04] hover:bg-[#E5A800] text-[#0D1060] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-[#FBBC04]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0D1060]/30 border-t-[#0D1060] rounded-full animate-spin" />
                  <span>Verifying PIN...</span>
                </>
              ) : (
                <>
                  <span>Verify & Access Broadsheet</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-2">
              Protected by ResultsPRO Scratch Card Cryptographic Auditing.
            </p>
          </form>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  PIN Verified
                </span>
                <span className="text-xs text-slate-500 font-medium">Session: {formattedResult?.session}</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                {formattedResult?.studentName} ({formattedResult?.admissionNumber})
              </h2>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0D1060] text-white hover:bg-[#0D1060]/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Broadsheet</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
              >
                Check Another
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex justify-center overflow-x-auto">
            {formattedResult && (
              <CompactGradebook
                school={activeSchool}
                result={formattedResult}
                template={getTemplate('comprehensive')}
                previewMode={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCheckerView;
