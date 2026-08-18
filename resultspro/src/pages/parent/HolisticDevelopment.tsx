import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Target } from '@/lib/hugeicons-compat';
import { TrendingUp } from 'lucide-react';
import axios from 'axios';

interface HolisticDevelopmentData {
  academic: {
    score: number;
    trend: number;
    grade: string;
  };
  affective: {
    engagement: number;
    honesty: number;
    attentiveness: number;
    punctuality: number;
  };
  psychomotor: {
    practical: number;
    creativity: number;
    problemSolving: number;
  };
}

const ParentHolisticDevelopment: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<HolisticDevelopmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevelopmentData();
  }, [childId]);

  const fetchDevelopmentData = async () => {
    try {
      const response = await axios.get(
        `/parent-analytics/child/${childId}/analytics`
      );
      // Extract/transform relevant data
      const analyticsData = response.data.data;
      setData({
        academic: {
          score: analyticsData.overallAverage,
          trend: analyticsData.trend || 0,
          grade: analyticsData.grade || 'C',
        },
        affective: analyticsData.affectiveDomain || {},
        psychomotor: analyticsData.psychomotorDomain || {},
      });
    } catch (error) {
      console.error('Failed to fetch development data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading development profile...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-slate-400">Failed to load development data</p>
      </div>
    );
  }

  // Create a radar chart-like display with three dimensions
  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'academic':
        return 'from-blue-600 to-blue-700';
      case 'affective':
        return 'from-purple-600 to-purple-700';
      case 'psychomotor':
        return 'from-green-600 to-green-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const renderProgressBar = (value: number, max: number = 100) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

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
          <h1 className="text-3xl font-bold mb-2">Holistic Development Profile</h1>
          <p className="text-slate-400">Academic, Affective, and Psychomotor Assessment</p>
        </div>

        {/* Three-Dimensional Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Academic Dimension */}
          <div className={`bg-gradient-to-br ${getDimensionColor('academic')} rounded-lg p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <Target size={24} />
              <h2 className="text-2xl font-bold">Academic</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-blue-100 text-sm">Overall Score</p>
                <p className="text-5xl font-bold mt-2">{data.academic.score.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Grade</p>
                <p className="text-3xl font-bold mt-1">{data.academic.grade}</p>
              </div>
              {data.academic.trend > 0 && (
                <div className="flex items-center gap-2 text-green-200">
                  <TrendingUp size={16} />
                  <p>Improving trend (+{data.academic.trend.toFixed(1)})</p>
                </div>
              )}
            </div>
          </div>

          {/* Affective Dimension */}
          <div className={`bg-gradient-to-br ${getDimensionColor('affective')} rounded-lg p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <Users size={24} />
              <h2 className="text-2xl font-bold">Affective</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(data.affective).map(([trait, value]: any) => (
                <div key={trait}>
                  <div className="flex justify-between mb-1">
                    <p className="text-purple-100 text-sm capitalize">{trait}</p>
                    <p className="text-purple-100 text-sm">{value || 0}/5</p>
                  </div>
                  {renderProgressBar(value || 0, 5)}
                </div>
              ))}
            </div>
          </div>

          {/* Psychomotor Dimension */}
          <div className={`bg-gradient-to-br ${getDimensionColor('psychomotor')} rounded-lg p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={24} />
              <h2 className="text-2xl font-bold">Psychomotor</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(data.psychomotor).map(([skill, value]: any) => (
                <div key={skill}>
                  <div className="flex justify-between mb-1">
                    <p className="text-green-100 text-sm capitalize">{skill}</p>
                    <p className="text-green-100 text-sm">{value || 0}/5</p>
                  </div>
                  {renderProgressBar(value || 0, 5)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Development Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-green-400 font-semibold mb-2">✓ Strengths</p>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• Strong academic performance in core subjects</li>
                <li>• Good engagement and participation</li>
              </ul>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-orange-400 font-semibold mb-2">→ Areas for Growth</p>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• Practical skills development</li>
                <li>• Punctuality consistency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentHolisticDevelopment;
