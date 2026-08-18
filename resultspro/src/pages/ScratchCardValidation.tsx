import React, { useState } from 'react';
import { ArrowRight01, Check, AlertCircle, Building01, Calendar01, Hash, Activity } from '@/lib/hugeicons-compat';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axiosInstance from '@/lib/axiosConfig';

interface UsageRecord {
  usedAt: string;
  studentAdmissionNumber: string;
  termId?: string;
  sessionId?: string;
}

interface ValidationResult {
  pin: string;
  batchCode: string;
  batchStatus: string;
  batchActivatedAt: string;
  schoolName: string;
  schoolCode: string;
  isActive: boolean;
  usesRemaining: number;
  usageCount: number;
  lastUsedAt: string | null;
  usageHistory: UsageRecord[];
}

const ScratchCardValidation: React.FC = () => {
  const [scratchCode, setScratchCode] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!scratchCode.trim()) {
      setError('Please enter your scratch card PIN');
      return;
    }

    if (!schoolName.trim()) {
      setError('Please enter the school name or code');
      return;
    }

    try {
      setLoading(true);
      
      const res = await axiosInstance.post('/scratch-cards/check-status', {
        pin: scratchCode.trim(),
        schoolIdentifier: schoolName.trim()
      });

      if (res.data.success) {
        setSuccess(true);
        setResult(res.data.data);
      } else {
        setError(res.data.error || 'Failed to check card status');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success && result) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex flex-col">
        <Navigation />

        <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
          <img
            src="/Hero.png"
            className="absolute h-full w-full object-cover inset-0"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

          <div className="relative z-10 max-w-3xl mx-auto w-full">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight text-white text-center">
              Card <span className="text-green-400">Verified</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Card Status & Details */}
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-white/5 border-white/10 p-8 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Card Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">PIN</span>
                    <span className="text-white font-mono font-bold">{result.pin}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${result.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {result.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Uses Remaining</span>
                    <span className="text-white font-bold">{result.usesRemaining}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Usage Count</span>
                    <span className="text-white font-bold">{result.usageCount}</span>
                  </div>
                </div>
              </div>

              {/* Batch & School Details */}
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-white/5 border-white/10 p-8 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Building01 className="w-5 h-5 text-purple-400" />
                  Origin
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">School</span>
                    <span className="text-white font-bold truncate ml-4 text-right" title={result.schoolName}>{result.schoolName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Batch Code</span>
                    <span className="text-white font-bold">{result.batchCode}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Batch Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${result.batchStatus === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {result.batchStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Activated At</span>
                    <span className="text-white text-xs">
                      {result.batchActivatedAt ? new Date(result.batchActivatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage History */}
            {result.usageHistory.length > 0 && (
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-white/5 border-white/10 p-8 shadow-2xl mb-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calendar01 className="w-5 h-5 text-yellow-400" />
                  Usage History
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase font-bold border-b border-white/5">
                        <th className="pb-4 pr-4">Date</th>
                        <th className="pb-4 pr-4">Student</th>
                        <th className="pb-4">Term/Session</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {result.usageHistory.map((usage, idx) => (
                        <tr key={idx} className="border-b border-white/5 last:border-0">
                          <td className="py-4 pr-4 text-gray-300">
                            {new Date(usage.usedAt).toLocaleString()}
                          </td>
                          <td className="py-4 pr-4 text-white font-medium">
                            {usage.studentAdmissionNumber}
                          </td>
                          <td className="py-4 text-gray-400">
                            {usage.termId || 'N/A'} {usage.sessionId ? `(${usage.sessionId})` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSuccess(false);
                setResult(null);
                setScratchCode('');
              }}
              className="w-full py-4 rounded-[15px] bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Verify Another Card
              <ArrowRight01 className="w-5 h-5" />
            </button>
          </div>
        </section>

        <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8 text-center">
          <p className="text-gray-500 text-sm">&copy; 2026 Results Pro. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />

      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="relative z-10 max-w-xl mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
              Card <span className="text-blue-400">Verifier</span>
            </h1>
            <p className="text-gray-400">
              Check the validity, usage, and batch information of any scratch card.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[30px] border backdrop-blur-[10px] bg-white/5 border-white/10 p-10 shadow-2xl">
            <div className="space-y-6">
              {error && (
                <div className="p-4 rounded-[15px] bg-red-500/10 border border-red-500/30 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">
                  Scratch Card PIN
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter PIN"
                    value={scratchCode}
                    onChange={(e) => setScratchCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-mono tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">
                  School Name or Code
                </label>
                <div className="relative">
                  <Building01 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter school name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !scratchCode || !schoolName}
                className="w-full py-4 rounded-[15px] bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {loading ? <InlineLoadingSpinner size="sm" /> : 'Verify Status'}
                {!loading && <ArrowRight01 className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8 text-center">
        <p className="text-gray-500 text-sm">&copy; 2026 Results Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ScratchCardValidation;
