import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart01, Users, AlertTriangle } from '@/lib/hugeicons-compat';
import { TrendingUp } from 'lucide-react';
import { axiosInstance as axios } from '@/lib/axiosConfig';

interface TeacherClass {
  id: string;
  name: string;
  formLevel: string;
  streamName: string;
  sessionId: string;
}

interface ClassStats {
  classAverage: number;
  passRate: number;
  studentCount: number;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [classStats, setClassStats] = useState<Record<string, ClassStats>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classes.length > 0 && !selectedSessionId) {
      setSelectedSessionId(classes[0].sessionId);
    }
  }, [classes]);

  useEffect(() => {
    if (classes.length > 0) {
      fetchClassStatistics();
    }
  }, [selectedSessionId]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/teacher-analytics/classes');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStatistics = async () => {
    try {
      const stats: Record<string, ClassStats> = {};
      for (const cls of classes) {
        try {
          const response = await axios.get(
            `/teacher-analytics/class/${cls.id}/overview?sessionId=${selectedSessionId}&termId=1`
          );
          stats[cls.id] = {
            classAverage: response.data.data.classAverage,
            passRate: response.data.data.passRate,
            studentCount: response.data.data.classSize,
          };
        } catch (error) {
          console.error(`Failed to fetch stats for class ${cls.id}:`, error);
        }
      }
      setClassStats(stats);
    } catch (error) {
      console.error('Failed to fetch class statistics:', error);
    }
  };

  const handleViewClassOverview = (classId: string) => {
    navigate(`/teacher/class/${classId}/overview`, {
      state: { sessionId: selectedSessionId },
    });
  };

  const handleViewAtRiskStudents = (classId: string) => {
    navigate(`/teacher/class/${classId}/at-risk`, {
      state: { sessionId: selectedSessionId },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-slate-400">Monitor your class performance and student progress</p>
        </div>

        {/* Quick Stats */}
        {classes.length > 0 && classStats[classes[0].id] && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg">
              <p className="text-slate-400 text-sm">Total Classes</p>
              <p className="text-4xl font-bold mt-2">{classes.length}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <p className="text-slate-400 text-sm">Total Students</p>
              <p className="text-4xl font-bold mt-2">
                {Object.values(classStats).reduce((sum, c) => sum + c.studentCount, 0)}
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <p className="text-slate-400 text-sm">Avg Class Performance</p>
              <p className="text-4xl font-bold mt-2">
                {(
                  Object.values(classStats).reduce((sum, c) => sum + c.classAverage, 0) /
                  Object.keys(classStats).length
                ).toFixed(1)}
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <p className="text-slate-400 text-sm">Avg Pass Rate</p>
              <p className="text-4xl font-bold mt-2">
                {(
                  Object.values(classStats).reduce((sum, c) => sum + c.passRate, 0) /
                  Object.keys(classStats).length
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map((cls) => {
            const stats = classStats[cls.id];
            return (
              <div
                key={cls.id}
                className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <BarChart01 size={20} />
                      {cls.name}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Form {cls.formLevel} • {cls.streamName}
                    </p>
                  </div>
                </div>

                {stats && (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class Average</span>
                      <span className="font-bold text-blue-400">{stats.classAverage.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pass Rate</span>
                      <span className="font-bold text-green-400">{stats.passRate.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Students</span>
                      <span className="font-bold">{stats.studentCount}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewClassOverview(cls.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={16} />
                    Overview
                  </button>
                  <button
                    onClick={() => handleViewAtRiskStudents(cls.id)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                  >
                    <AlertTriangle size={16} />
                    At-Risk
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No classes assigned yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
