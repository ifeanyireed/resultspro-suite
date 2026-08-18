import React from 'react';
import { GradebookTemplate } from '@/lib/schoolData';

interface GradingSystemProps {
  template: GradebookTemplate;
}

export const GradingSystem: React.FC<GradingSystemProps> = ({ template }) => {
  if (!template.gradingSystem) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Grading System</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Grade</th>
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Score Range</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Remark</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(template.gradingSystem).map(([grade, range]) => (
            <tr key={grade} className="bg-white">
              <td className="border border-gray-300 px-4 py-3">
                <span className={`inline-block px-3 py-1 rounded font-bold text-white ${
                  grade === 'A' ? 'bg-green-600' :
                  grade === 'B' ? 'bg-blue-600' :
                  grade === 'C' ? 'bg-yellow-600' :
                  grade === 'D' ? 'bg-orange-600' :
                  'bg-red-600'
                }`}>
                  {grade}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">
                {(range as any).min} - {(range as any).max}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-gray-900">{(range as any).remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
