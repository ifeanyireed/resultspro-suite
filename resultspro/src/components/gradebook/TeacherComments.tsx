import React from 'react';
import { SchoolResult } from '@/lib/schoolData';

interface TeacherCommentsProps {
  result: SchoolResult;
}

export const TeacherComments: React.FC<TeacherCommentsProps> = ({ result }) => {
  if (!result.teacherComments || (!result.teacherComments.classTeacher && !result.teacherComments.principal)) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Teachers' Comments</h2>
      <div className="space-y-4">
        {result.teacherComments.classTeacher && (
          <div className="bg-white border border-gray-300 rounded p-4">
            <p className="font-bold text-gray-900 mb-2">Class Teacher's Comment</p>
            <p className="text-gray-700 text-sm leading-relaxed">{result.teacherComments.classTeacher}</p>
          </div>
        )}
        {result.teacherComments.principal && (
          <div className="bg-white border border-gray-300 rounded p-4">
            <p className="font-bold text-gray-900 mb-2">Principal's Comment</p>
            <p className="text-gray-700 text-sm leading-relaxed">{result.teacherComments.principal}</p>
          </div>
        )}
      </div>
    </div>
  );
};
