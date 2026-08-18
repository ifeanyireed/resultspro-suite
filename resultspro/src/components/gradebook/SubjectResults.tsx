import React from 'react';
import { SchoolResult } from '@/lib/schoolData';

interface SubjectResultsProps {
  result: SchoolResult;
}

export const SubjectResults: React.FC<SubjectResultsProps> = ({ result }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Subject Results</h2>
      <table className="w-full border-collapse text-sm bg-white">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Subject</th>
            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Score</th>
            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Grade</th>
            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Remark</th>
            {result.subjects[0]?.classAverage !== undefined && (
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Class Avg</th>
            )}
            {result.subjects[0]?.positionInClass !== undefined && (
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Pos. in Class</th>
            )}
          </tr>
        </thead>
        <tbody>
          {result.subjects.map((subject, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">{subject.name}</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-gray-900 font-bold">{subject.score}</td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                <span className={`px-3 py-1 rounded font-bold text-white ${
                  subject.grade === 'A' ? 'bg-green-600' :
                  subject.grade === 'B' ? 'bg-blue-600' :
                  subject.grade === 'C' ? 'bg-yellow-600' :
                  subject.grade === 'D' ? 'bg-orange-600' :
                  'bg-red-600'
                }`}>
                  {subject.grade}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">{subject.remark || '-'}</td>
              {subject.classAverage !== undefined && (
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">{subject.classAverage}</td>
              )}
              {subject.positionInClass !== undefined && (
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700 font-medium">{subject.positionInClass}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
