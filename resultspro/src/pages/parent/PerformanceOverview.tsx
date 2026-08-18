import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart01,
  AlertTriangle,
  Download01,
  ArrowUp,
  ArrowDown,
} from '@/lib/hugeicons-compat';
import { TrendingUp, MessageSquare } from 'lucide-react';
import axios from 'axios';

interface SubjectPerformance {
  subject: string;
  score: number;
  grade: string;
  classAverage: number;
  position: number;
  remark: string;
}

interface PerformanceOverviewData {
  studentName: string;
  overallAverage: number;
  classAverage: number;
  position: number;
  classSize: number;
  subjects: SubjectPerformance[];
  performanceTier: string;
  riskLevel?: string;
}

const ParentPerformanceOverview: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PerformanceOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [childId]);

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get(
        `/parent-analytics/child/${childId}/summary`
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-slate-400">Failed to load performance data</p>
      </div>
    );
  }

  const strengths = data.subjects
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.subject);

  const weaknesses = data.subjects
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(s => s.subject);

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">{data.studentName} - Performance Overview</h1>
          <p className="text-slate-400">Term Performance Summary</p>
        </div>

        {/* Overall Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-lg">
            <p className="text-blue-100 text-sm">Overall Average</p>
            <p className="text-4xl font-bold mt-2">{data.overallAverage.toFixed(1)}</p>
            <p className="text-blue-100 text-xs mt-2">
              Class Avg: {data.classAverage.toFixed(1)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-lg">
            <p className="text-green-100 text-sm">Position in Class</p>
            <p className="text-4xl font-bold mt-2">
              {data.position}/{data.classSize}
            </p>
            <p className="text-green-100 text-xs mt-2">
              Top {((data.classSize - data.position) / data.classSize * 100).toFixed(0)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-lg">
            <p className="text-purple-100 text-sm">Performance Tier</p>
            <p className="text-2xl font-bold mt-2">{data.performanceTier}</p>
            <p className="text-purple-100 text-xs mt-2">Academic Tier</p>
          </div>

          {data.riskLevel && (
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-lg">
              <p className="text-orange-100 text-sm">Risk Status</p>
              <p className="text-2xl font-bold mt-2">{data.riskLevel}</p>
              <p className="text-orange-100 text-xs mt-2">Performance Flag</p>
            </div>
          )}
        </div>

        {/* Subject Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Subjects Table */}
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart01 size={20} />
              Subject Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 text-slate-400">Subject</th>
                    <th className="text-center p-3 text-slate-400">Score</th>
                    <th className="text-center p-3 text-slate-400">Grade</th>
                    <th className="text-center p-3 text-slate-400">Class Avg</th>
                    <th className="text-center p-3 text-slate-400">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subjects.map((subject) => (
                    <tr
                      key={subject.subject}
                      className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition"
                      onClick={() =>
                        navigate(`/parent/child/${childId}/subject/${subject.subject}`)
                      }
                    >
                      <td className="p-3 font-medium">{subject.subject}</td>
                      <td className="text-center p-3">{subject.score.toFixed(1)}</td>
                      <td className="text-center p-3 font-bold">
                        <span
                          className={
                            subject.grade === 'A'
                              ? 'text-green-400'
                              : subject.grade === 'B'
                                ? 'text-blue-400'
                                : subject.grade === 'C'
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                          }
                        >
                          {subject.grade}
                        </span>
                      </td>
                      <td className="text-center p-3 text-slate-400">
                        {subject.classAverage.toFixed(1)}
                      </td>
                      <td className="text-center p-3">
                        {subject.position > data.position ? (
                          <span className="text-red-400 flex items-center justify-center gap-1">
                            <ArrowDown size={14} />
                            {subject.position}
                          </span>
                        ) : (
                          <span className="text-green-400 flex items-center justify-center gap-1">
                            <ArrowUp size={14} />
                            {subject.position}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            {/* Strengths */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-400" />
                Top Strengths
              </h3>
              <ul className="space-y-2">
                {strengths.map((subject) => (
                  <li key={subject} className="text-green-300 text-sm">
                    ✓ {subject}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-400" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {weaknesses.map((subject) => (
                  <li key={subject} className="text-orange-300 text-sm">
                    → {subject}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() =>
              navigate(`/parent/child/${childId}/analytics`)
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
          >
            <BarChart01 size={18} />
            View Detailed Analytics
          </button>
          <button
            onClick={() =>
              navigate(`/parent/child/${childId}/messages`)
            }
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition"
          >
            <MessageSquare size={18} />
            Contact Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentPerformanceOverview;
