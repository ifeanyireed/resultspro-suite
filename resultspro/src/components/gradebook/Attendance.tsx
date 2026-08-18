import React from 'react';
import { SchoolResult } from '@/lib/schoolData';

interface AttendanceProps {
  result: SchoolResult;
}

export const Attendance: React.FC<AttendanceProps> = ({ result }) => {
  if (!result.attendance) return null;

  const { daysPresent, daysSchoolOpen } = result.attendance;
  const percentage = Math.round((daysPresent / daysSchoolOpen) * 100);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Attendance Record</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-300 rounded p-4 text-center">
          <p className="text-gray-600 font-semibold text-sm">Days Present</p>
          <p className="text-3xl font-bold text-blue-600">{daysPresent}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded p-4 text-center">
          <p className="text-gray-600 font-semibold text-sm">School Days</p>
          <p className="text-3xl font-bold text-gray-900">{daysSchoolOpen}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded p-4 text-center">
          <p className="text-gray-600 font-semibold text-sm">Attendance %</p>
          <p className={`text-3xl font-bold ${percentage >= 90 ? 'text-green-600' : percentage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
            {percentage}%
          </p>
        </div>
      </div>
    </div>
  );
};
