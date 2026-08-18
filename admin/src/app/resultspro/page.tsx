'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { FileCheck2, KeyRound, Plus, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { generateScratchCardBatch } from '@/lib/api';

export default function ResultProAdminPage() {
  const [quantity, setQuantity] = useState(100);
  const [unitCost, setUnitCost] = useState(500);
  const [schoolId, setSchoolId] = useState('school-1');
  const [generatedBatch, setGeneratedBatch] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const batches = [
    {
      id: 'batch-1',
      batchNumber: 'BATCH-1723901-4821',
      school: 'Greenwood High',
      quantity: 500,
      used: 342,
      unitCost: 500,
      totalCost: 250000,
      status: 'ASSIGNED',
      date: '2026-08-10',
    },
    {
      id: 'batch-2',
      batchNumber: 'BATCH-1723902-9102',
      school: 'Kings College Lagos',
      quantity: 1000,
      used: 810,
      unitCost: 450,
      totalCost: 450000,
      status: 'ASSIGNED',
      date: '2026-08-12',
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await generateScratchCardBatch(schoolId, Number(quantity), Number(unitCost));
    setGeneratedBatch(res);
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="ResultPRO Command Center"
        subtitle="Manage scratch card PIN generators, assessment sessions, and grading scales"
      />

      <div className="p-8 space-y-8">
        {/* Scratch Card Generator Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Cryptographic Scratch Card Batch Generator</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Generates unique serial numbers and SHA-256 encrypted PINs (e.g. 4029-8192-3841) for parent result card verification.
          </p>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target School</label>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
              >
                <option value="school-1">Greenwood High (GHS001)</option>
                <option value="school-2">Kings College Lagos (KCL002)</option>
                <option value="school-3">Queens College Yaba (QCY003)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Card Quantity</label>
              <input
                type="number"
                min="10"
                max="5000"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Cost (NGN)</label>
              <input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{loading ? 'Generating...' : 'Generate Batch'}</span>
              </button>
            </div>
          </form>

          {generatedBatch && generatedBatch.cards && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Batch {generatedBatch.batch_number} generated with {generatedBatch.total_cards} cards!</span>
                </div>
                <button
                  onClick={() => alert('Exporting printable PIN slips...')}
                  className="bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Printable CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Card Batches */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">Active Scratch Card Batches</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Batch Number</th>
                  <th className="px-4 py-3">Assigned School</th>
                  <th className="px-4 py-3">Total Cards</th>
                  <th className="px-4 py-3">Redeemed / Used</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Batch Revenue</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{b.batchNumber}</td>
                    <td className="px-4 py-3.5 text-slate-700 font-semibold">{b.school}</td>
                    <td className="px-4 py-3.5 text-slate-900 font-bold">{b.quantity}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {b.used} ({Math.round((b.used / b.quantity) * 100)}%)
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">₦{b.unitCost}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">₦{b.totalCost.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <Badge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
