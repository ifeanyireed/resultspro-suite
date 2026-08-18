import React, { useState } from 'react';
import { Badge } from '@/components/Badge';
import { KeyRound, Plus, CheckCircle2, Download } from 'lucide-react';
import { generateScratchCardBatch } from '@/lib/api';

export default function ScratchCardsTab() {
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
    <div className="space-y-8">
      {/* Scratch Card Generator Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6">
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
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-full p-2.5 text-slate-800 focus:outline-none"
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
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-full p-2.5 text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Cost (NGN)</label>
            <input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-full p-2.5 text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold text-xs py-2.5 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Generating...' : 'Generate Batch'}</span>
            </button>
          </div>
        </form>

        {generatedBatch && generatedBatch.cards && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Batch {generatedBatch.batch_number} generated with {generatedBatch.total_cards} cards!</span>
              </div>
              <button
                onClick={() => alert('Exporting printable PIN slips...')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center space-x-1.5 shadow-sm shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Printable CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing Card Batches */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">Active Scratch Card Batches</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Batch Number</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Assigned School</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Total Cards</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Redeemed / Used</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Unit Price</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Batch Revenue</th>
                <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-slate-800 text-xs">{b.batchNumber}</td>
                  <td className="px-6 py-4 text-slate-700 font-semibold text-xs">{b.school}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold text-xs">{b.quantity}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                    {b.used} ({Math.round((b.used / b.quantity) * 100)}%)
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">₦{b.unitCost}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 text-xs">₦{b.totalCost.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge status={b.status} />
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
