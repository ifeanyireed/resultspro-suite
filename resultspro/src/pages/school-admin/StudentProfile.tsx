import React from 'react';
import { Mail, Phone01, Award, TrendingUp } from '@/lib/hugeicons-compat';

const StudentProfile: React.FC = () => {
  const student = {
    id: 'STU001',
    name: 'Chioma Okafor',
    email: 'chioma@school.edu',
    phone: '+234 812 345 6789',
    class: 'SS3A',
    admissionYear: '2022',
    parentName: 'Mr. Okafor Chukwu',
    parentEmail: 'okafor@email.com',
  };

  const subjects = [
    { subject: 'Mathematics', score: 87, grade: 'A', status: 'Excellent' },
    { subject: 'English Language', score: 92, grade: 'A', status: 'Excellent' },
    { subject: 'Physics', score: 78, grade: 'B', status: 'Very Good' },
    { subject: 'Chemistry', score: 85, grade: 'A', status: 'Excellent' },
    { subject: 'Biology', score: 76, grade: 'B', status: 'Very Good' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Student Profile</h2>
          <p className="text-gray-400 text-sm mt-1">{student.name} - {student.id}</p>
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
          <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-gray-400">Full Name</span>
              <span className="text-white font-medium">{student.name}</span>
            </div>
            <div className="flex justify-between items-start border-t border-white/5 pt-4">
              <span className="text-gray-400">Student ID</span>
              <span className="text-white font-medium">{student.id}</span>
            </div>
            <div className="flex justify-between items-start border-t border-white/5 pt-4">
              <span className="text-gray-400">Email</span>
              <span className="text-white font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                {student.email}
              </span>
            </div>
            <div className="flex justify-between items-start border-t border-white/5 pt-4">
              <span className="text-gray-400">Phone</span>
              <span className="text-white font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                {student.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
          <h3 className="text-lg font-semibold text-white mb-6">Academic Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-gray-400">Class</span>
              <span className="text-white font-medium">{student.class}</span>
            </div>
            <div className="flex justify-between items-start border-t border-white/5 pt-4">
              <span className="text-gray-400">Admission Year</span>
              <span className="text-white font-medium">{student.admissionYear}</span>
            </div>
            <div className="flex justify-between items-start border-t border-white/5 pt-4">
              <span className="text-gray-400">Parent Name</span>
              <span className="text-white font-medium">{student.parentName}</span>
            </div>
            <div className="flex justify-between items-start border-t border-white/5 pt-4">
              <span className="text-gray-400">Parent Email</span>
              <span className="text-white font-medium">{student.parentEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Cumulative Average</h3>
          </div>
          <p className="text-4xl font-bold text-blue-400">84.4%</p>
          <p className="text-gray-400 text-sm mt-2">Grade: A (Excellent)</p>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Rank</h3>
          </div>
          <p className="text-4xl font-bold text-green-400">3rd</p>
          <p className="text-gray-400 text-sm mt-2">Out of 42 students in class</p>
        </div>
      </div>

      {/* Subject Results */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Subject Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 bg-white/2.5">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Subject</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Score</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Grade</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6 text-white">{row.subject}</td>
                  <td className="py-4 px-6 text-white font-medium">{row.score}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20">
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
