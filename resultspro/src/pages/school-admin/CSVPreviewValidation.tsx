import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XClose } from '@/lib/hugeicons-compat';

const CSVPreviewValidation: React.FC = () => {
  const [issues] = useState([
    { row: 5, field: 'Score', issue: 'Invalid score format', severity: 'error' },
    { row: 12, field: 'Student ID', issue: 'Duplicate student ID', severity: 'error' },
  ]);

  const previewData = [
    { studentId: 'STU001', name: 'Chioma Okafor', class: 'SS3A', subject: 'Mathematics', score: 87 },
    { studentId: 'STU002', name: 'Tunde Adeyemi', class: 'SS3A', subject: 'Mathematics', score: 92 },
    { studentId: 'STU003', name: 'Amara Nwosu', class: 'SS3A', subject: 'Mathematics', score: 78 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">CSV Preview & Validation</h2>
        <p className="text-gray-400 text-sm mt-1">Review and validate your data before import</p>
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Rows</p>
          <p className="text-3xl font-bold text-white">42</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Valid Rows</p>
          <p className="text-3xl font-bold text-green-400">40</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Errors</p>
          <p className="text-3xl font-bold text-red-400">2</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Success Rate</p>
          <p className="text-3xl font-bold text-blue-400">95%</p>
        </div>
      </div>

      {/* Validation Issues */}
      {issues.length > 0 && (
        <div className="bg-red-400/5 rounded-[20px] border border-red-400/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Validation Issues</h3>
          </div>
          <div className="space-y-2">
            {issues.map((issue, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/2.5 rounded-lg">
                <span className="text-gray-300 text-sm">
                  <span className="font-medium">Row {issue.row}</span> - {issue.field}: {issue.issue}
                </span>
                <span className="px-2 py-1 bg-red-400/20 text-red-400 rounded text-xs font-medium">Error</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 bg-white/2.5">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Student ID</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Class</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Subject</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Score</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6 text-white font-medium">{row.studentId}</td>
                  <td className="py-4 px-6 text-white">{row.name}</td>
                  <td className="py-4 px-6 text-gray-400">{row.class}</td>
                  <td className="py-4 px-6 text-gray-400">{row.subject}</td>
                  <td className="py-4 px-6 text-white">{row.score}</td>
                  <td className="py-4 px-6">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors">
          Import Data
        </button>
      </div>
    </div>
  );
};

export default CSVPreviewValidation;
