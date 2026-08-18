import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BarChart01, Users } from '@/lib/hugeicons-compat';
import { TrendingUp } from 'lucide-react';
import { axiosInstance as axios } from '@/lib/axiosConfig';

interface SubjectStat {
  subjectName: string;
  classAverage: number;
  passRate: number;
  failCount: number;
  assessment: {
    ca1: number;
    ca2: number;
    exam: number;
    caAverage: number;
  };
  difficulty: 'high' | 'medium' | 'low';
}

interface ClassOverviewData {
  className: string;
  classSize: number;
  classAverage: number;
  medianScore: number;
  stdDeviation: number;
  passRate: number;
  failCount: number;
  gradeDistribution: Record<string, number>;
  subjectStats: SubjectStat[];
  attendanceStats: {
    averageAttendance: number;
    absentCount: number;
  };
}

const TeacherClassOverview: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<ClassOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = (location.state as any)?.sessionId || '';

  useEffect(() => {
    fetchClassOverview();
  }, [classId, sessionId]);

  const fetchClassOverview = async () => {
    try {
      const response = await axios.get(
        `/teacher-analytics/class/${classId}/overview?sessionId=${sessionId}&termId=1`
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch class overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading class overview...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-slate-400">Failed to load class data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">{data.className} - Class Overview</h1>
          <p className="text-slate-400">Performance metrics and subject analysis</p>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-lg">
            <p className="text-blue-100 text-sm">Class Average</p>
            <p className="text-4xl font-bold mt-2">{data.classAverage.toFixed(1)}</p>
            <p className="text-blue-100 text-xs mt-2">Median: {data.medianScore.toFixed(1)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-lg">
            <p className="text-green-100 text-sm">Pass Rate</p>
            <p className="text-4xl font-bold mt-2">{data.passRate.toFixed(0)}%</p>
            <p className="text-green-100 text-xs mt-2">
              {data.classSize - data.failCount} / {data.classSize} passed
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-lg">
            <p className="text-purple-100 text-sm">Total Students</p>
            <p className="text-4xl font-bold mt-2">{data.classSize}</p>
            <p className="text-purple-100 text-xs mt-2">
              Failures: {data.failCount}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-lg">
            <p className="text-orange-100 text-sm">Attendance Rate</p>
            <p className="text-4xl font-bold mt-2">
              {(data.attendanceStats.averageAttendance * 100).toFixed(0)}%
            </p>
            <p className="text-orange-100 text-xs mt-2">Class Average</p>
          </div>
        </div>

        {/* Grade Distribution and Subject Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Grade Distribution */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Grade Distribution</h2>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                const count = data.gradeDistribution[grade] || 0;
                const percentage = (count / data.classSize) * 100;
                return (
                  <div key={grade}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Grade {grade}</span>
                      <span className="text-slate-400">{count} students</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          grade === 'A'
                            ? 'bg-green-500'
                            : grade === 'B'
                              ? 'bg-blue-500'
                              : grade === 'C'
                                ? 'bg-yellow-500'
                                : grade === 'D'
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performing Subjects */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Top Subjects</h2>
            <div className="space-y-3">
              {data.subjectStats
                .sort((a, b) => b.classAverage - a.classAverage)
                .slice(0, 5)
                .map((subject) => (
                  <div
                    key={subject.subjectName}
                    className="bg-slate-700 p-3 rounded flex justify-between items-center"
                  >
                    <span className="text-sm">{subject.subjectName}</span>
                    <span className="font-bold text-green-400">
                      {subject.classAverage.toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Struggling Subjects */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Struggling Subjects</h2>
            <div className="space-y-3">
              {data.subjectStats
                .sort((a, b) => a.passRate - b.passRate)
                .slice(0, 5)
                .map((subject) => (
                  <div
                    key={subject.subjectName}
                    className="bg-slate-700 p-3 rounded flex justify-between items-center"
                  >
                    <span className="text-sm">{subject.subjectName}</span>
                    <span
                      className={`font-bold ${
                        subject.passRate >= 70
                          ? 'text-green-400'
                          : subject.passRate >= 50
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }`}
                    >
                      {subject.passRate.toFixed(0)}% pass
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Subject Details Table */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart01 size={20} />
            Subject Performance Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-400">Subject</th>
                  <th className="text-center p-3 text-slate-400">Avg Score</th>
                  <th className="text-center p-3 text-slate-400">Pass Rate</th>
                  <th className="text-center p-3 text-slate-400">CA1</th>
                  <th className="text-center p-3 text-slate-400">CA2</th>
                  <th className="text-center p-3 text-slate-400">Exam</th>
                  <th className="text-center p-3 text-slate-400">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {data.subjectStats.map((subject) => (
                  <tr key={subject.subjectName} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="p-3 font-medium">{subject.subjectName}</td>
                    <td className="text-center p-3 font-bold">
                      {subject.classAverage.toFixed(1)}
                    </td>
                    <td className="text-center p-3">
                      <span className={
                        subject.passRate >= 70
                          ? 'text-green-400'
                          : subject.passRate >= 50
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }>
                        {subject.passRate.toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-center p-3 text-slate-300">
                      {subject.assessment.ca1.toFixed(1)}
                    </td>
                    <td className="text-center p-3 text-slate-300">
                      {subject.assessment.ca2.toFixed(1)}
                    </td>
                    <td className="text-center p-3 text-slate-300">
                      {subject.assessment.exam.toFixed(1)}
                    </td>
                    <td className="text-center p-3">
                      <span className={
                        subject.difficulty === 'high'
                          ? 'text-red-400'
                          : subject.difficulty === 'medium'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                      }>
                        {subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() =>
              navigate(`/teacher/class/${classId}/at-risk`, {
                state: { sessionId },
              })
            }
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg transition font-semibold"
          >
            <TrendingUp size={18} />
            View At-Risk Students
          </button>
          <button
            onClick={() =>
              navigate(`/teacher/class/${classId}/cohort`, {
                state: { sessionId },
              })
            }
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition font-semibold"
          >
            <Users size={18} />
            Cohort Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassOverview;
