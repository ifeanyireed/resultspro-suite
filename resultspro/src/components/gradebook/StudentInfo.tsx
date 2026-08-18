import React from 'react';
import { SchoolResult } from '@/lib/schoolData';

interface StudentInfoProps {
  result: SchoolResult;
  school: any;
}

export const StudentInfo: React.FC<StudentInfoProps> = ({ result, school }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Student Information</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 font-semibold">Student Name</p>
          <p className="text-gray-900">{result.studentName}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Admission Number</p>
          <p className="text-gray-900">{result.admissionNumber}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Class</p>
          <p className="text-gray-900">{result.classLevel}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Position in Class</p>
          <p className="text-gray-900">{result.position} out of {result.totalStudents}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Term</p>
          <p className="text-gray-900">{result.term}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Assessment Type</p>
          <p className="text-gray-900">{result.resultType}</p>
        </div>
      </div>
    </div>
  );
};
