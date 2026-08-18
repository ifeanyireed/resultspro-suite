import React from 'react';
import { SchoolResult } from '@/lib/schoolData';

interface PerformanceSummaryProps {
  result: SchoolResult;
  template: any;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ result, template }) => {
  const totalObtained = result.subjects.reduce((sum, s) => sum + s.score, 0);
  const totalObtainable = result.totalObtainable || (result.subjects.length * 100);
  const percentage = Math.round((totalObtained / totalObtainable) * 100);
  
  // Calculate grade
  let overallGrade = 'F';
  const gradingSystem = template.gradingSystem;
  for (const [grade, range] of Object.entries(gradingSystem)) {
    if (percentage >= (range as any).min && percentage <= (range as any).max) {
      overallGrade = grade;
      break;
    }
  }

  const getGradeRemark = (grade: string) => {
    return gradingSystem[grade]?.remark || 'Not Specified';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-blue-200 rounded p-4 text-center">
          <p className="text-gray-600 font-semibold text-sm">Total Obtained</p>
          <p className="text-3xl font-bold text-blue-600">{totalObtained}</p>
        </div>
        <div className="bg-white border border-blue-200 rounded p-4 text-center">
          <p className="text-gray-600 font-semibold text-sm">Total Obtainable</p>
          <p className="text-3xl font-bold text-gray-900">{totalObtainable}</p>
        </div>
        <div className="bg-white border border-blue-200 rounded p-4 text-center">
          <p className="text-gray-600 font-semibold text-sm">Percentage</p>
          <p className="text-3xl font-bold text-green-600">{percentage}%</p>
        </div>
        <div className="bg-white border border-blue-200 rounded p-4 text-center">
          <p className="text-gray-600 font-semibold text-sm">Overall Grade</p>
          <p className={`text-3xl font-bold ${
            overallGrade === 'A' ? 'text-green-600' :
            overallGrade === 'B' ? 'text-blue-600' :
            overallGrade === 'C' ? 'text-yellow-600' :
            overallGrade === 'D' ? 'text-orange-600' :
            'text-red-600'
          }`}>
            {overallGrade}
          </p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-white border border-blue-200 rounded text-center">
        <p className="text-gray-700"><span className="font-semibold">Remarks:</span> {getGradeRemark(overallGrade)}</p>
      </div>
    </div>
  );
};
