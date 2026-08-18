import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Users, Award } from '@/lib/hugeicons-compat';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { axiosInstance as axios } from '@/lib/axiosConfig';

interface CohortTier {
  count: number;
  percentage: number;
  students: Array<{
    id: string;
    name: string;
    average: number;
    position: number;
  }>;
}

interface CohortAnalysisData {
  excellent: CohortTier;
  good: CohortTier;
  average: CohortTier;
  atRisk: CohortTier;
  totalStudents: number;
}

const TeacherCohortAnalysis: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<CohortAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTier, setExpandedTier] = useState<string | null>('excellent');

  const sessionId = (location.state as any)?.sessionId || '';

  useEffect(() => {
    fetchCohortAnalysis();
  }, [classId, sessionId]);

  const fetchCohortAnalysis = async () => {
    try {
      const response = await axios.get(
        `/teacher-analytics/class/${classId}/cohort?sessionId=${sessionId}&termId=1`
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch cohort analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading cohort analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-slate-400">Failed to load cohort data</p>
      </div>
    );
  }

  const tiers = [
    {
      key: 'excellent',
      label: 'Excellent (80+)',
      icon: Award,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-600/20',
      borderColor: 'border-green-600',
      data: data.excellent,
    },
    {
      key: 'good',
      label: 'Good (70-79)',
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-600',
      data: data.good,
    },
    {
      key: 'average',
      label: 'Average (60-69)',
      icon: Users,
      color: 'from-yellow-600 to-yellow-700',
      bgColor: 'bg-yellow-600/20',
      borderColor: 'border-yellow-600',
      data: data.average,
    },
    {
      key: 'atRisk',
      label: 'At-Risk (<60)',
      icon: TrendingDown,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-600/20',
      borderColor: 'border-red-600',
      data: data.atRisk,
    },
  ];

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
          <h1 className="text-3xl font-bold mb-2">Cohort Analysis</h1>
          <p className="text-slate-400">Student grouping by performance tier</p>
        </div>

        {/* Distribution Visualization */}
        <div className="mb-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Class Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.key}
                className={`${tier.bgColor} border ${tier.borderColor} rounded-lg p-6 cursor-pointer hover:opacity-80 transition`}
                onClick={() =>
                  setExpandedTier(
                    expandedTier === tier.key ? null : tier.key
                  )
                }
              >
                <div className="flex items-center gap-3 mb-4">
                  <tier.icon size={24} />
                  <div>
                    <p className="text-sm font-semibold">{tier.label}</p>
                    <p className="text-2xl font-bold">{tier.data.count}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${tier.color} h-2 rounded-full`}
                    style={{ width: `${tier.data.percentage}%` }}
                  />
                </div>
                <p className="text-sm mt-2">{tier.data.percentage.toFixed(0)}% of class</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Student Lists */}
        <div className="space-y-4">
          {tiers.map((tier) => (
            <div key={tier.key} className="bg-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setExpandedTier(
                    expandedTier === tier.key ? null : tier.key
                  )
                }
                className={`w-full bg-gradient-to-r ${tier.color} p-6 text-left flex items-center justify-between hover:opacity-90 transition`}
              >
                <div className="flex items-center gap-3">
                  <tier.icon size={20} />
                  <span className="font-bold text-lg">{tier.label}</span>
                  <span className="ml-auto mr-auto text-sm opacity-80">
                    {tier.data.count} student{tier.data.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <span>{expandedTier === tier.key ? '−' : '+'}</span>
              </button>

              {expandedTier === tier.key && (
                <div className="p-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-3 text-slate-400">Student Name</th>
                        <th className="text-center p-3 text-slate-400">Average</th>
                        <th className="text-center p-3 text-slate-400">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tier.data.students
                        .sort((a, b) => b.average - a.average)
                        .map((student, idx) => (
                          <tr
                            key={student.id}
                            className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition"
                            onClick={() =>
                              navigate(
                                `/teacher/student/${student.id}`,
                                { state: { sessionId } }
                              )
                            }
                          >
                            <td className="p-3 font-medium">
                              {idx + 1}. {student.name}
                            </td>
                            <td className="text-center p-3 font-bold">
                              {student.average.toFixed(1)}
                            </td>
                            <td className="text-center p-3 text-slate-400">
                              {student.position}/{data.totalStudents}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Insights and Recommendations */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">📊 Class Insights</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                • <span className="font-semibold">{data.excellent.percentage.toFixed(0)}% Excellent:</span> Top performers exceeding expectations
              </p>
              <p>
                • <span className="font-semibold">{(data.excellent.percentage + data.good.percentage).toFixed(0)}% Good/Excellent:</span> Performing above average
              </p>
              <p>
                • <span className="font-semibold">{data.atRisk.percentage.toFixed(0)}% At-Risk:</span> Require targeted intervention
              </p>
              <p>
                • <span className="font-semibold">Diversity:</span> Class has mixed academic levels
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">💡 Differentiation Strategies</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-green-400">✓ For Excellent:</span> Challenge with advanced tasks
              </p>
              <p>
                <span className="font-semibold text-blue-400">✓ For Good:</span> Consolidate and extend learning
              </p>
              <p>
                <span className="font-semibold text-yellow-400">✓ For Average:</span> Targeted remedial support
              </p>
              <p>
                <span className="font-semibold text-red-400">✓ For At-Risk:</span> Intensive intervention programs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCohortAnalysis;
