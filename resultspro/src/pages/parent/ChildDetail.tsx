import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Award, AlertTriangle, MessageCircle } from '@/lib/hugeicons-compat';
import { useParams, useNavigate } from 'react-router-dom';
import { useChildSummary, useChildProgress, useChildAttendance } from '@/hooks/useParentAnalytics';
import { KPICard } from '@/components/analytics/KPICard';
import { RiskLevelBadge, PerformanceBar } from '@/components/analytics/Badges';

const ChildDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'attendance'>('overview');

  const { summary, loading: summaryLoading } = useChildSummary(studentId || '');
  const { progress, loading: progressLoading } = useChildProgress(studentId || '');
  const { attendance, loading: attendanceLoading } = useChildAttendance(studentId || '');

  if (summaryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading child analytics...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <p className="text-slate-400">Failed to load child data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/Hero.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="sticky top-0 z-20 backdrop-blur-md bg-[rgba(0,0,0,0.40)] border-b border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => navigate('/parent')}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-white">{summary.studentName}</h1>
              <p className="text-slate-400 mt-1">Current Academic Performance</p>
            </div>
            <button
              onClick={() => navigate('/parent/messages')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition font-bold shadow-lg shadow-blue-500/20"
            >
              <MessageCircle size={20} />
              Message Teacher
            </button>
          </div>
        </div>
      </div>

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Overall Average"
            value={summary.overallAverage.toFixed(1)}
            icon={<Award className="w-5 h-5" />}
            color="blue"
            subtext={`Class Average: ${summary.classAverage.toFixed(1)}`}
          />
          <KPICard
            label="Class Position"
            value={`#${summary.position}/${summary.classSize}`}
            icon={<Award className="w-5 h-5" />}
            color="green"
          />
          <KPICard
            label="Risk Level"
            value={summary.riskLevel}
            icon={<AlertTriangle className="w-5 h-5" />}
            color={
              summary.riskLevel === 'CRITICAL'
                ? 'red'
                : summary.riskLevel === 'HIGH'
                ? 'amber'
                : summary.riskLevel === 'MEDIUM'
                ? 'purple'
                : 'green'
            }
          />
          <KPICard
            label="Attendance"
            value={`${summary.attendance.percentage}%`}
            icon={<Calendar className="w-5 h-5" />}
            color={parseFloat(summary.attendance.percentage) >= 75 ? 'green' : 'amber'}
            subtext={`${summary.attendance.daysPresent}/${summary.attendance.daysSchoolOpen} days`}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          {(['overview', 'subjects', 'attendance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition border-b-2 ${
                activeTab === tab
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'subjects' && 'Subjects'}
              {tab === 'attendance' && 'Attendance'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
                  <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {summary.strengths.length > 0 ? (
                      summary.strengths.map((strength, idx) => (
                        <div
                          key={idx}
                          className="bg-green-500/10 border border-green-500/20 rounded p-3"
                        >
                          <p className="text-green-400 font-semibold">{strength}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">No data available</p>
                    )}
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
                  <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {summary.weaknesses.length > 0 ? (
                      summary.weaknesses.map((weakness, idx) => (
                        <div
                          key={idx}
                          className="bg-red-500/10 border border-red-500/20 rounded p-3"
                        >
                          <p className="text-red-400 font-semibold">{weakness}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">No weaknesses identified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {summary.recommendations && summary.recommendations.length > 0 ? (
                    summary.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <span className="text-blue-400 font-semibold">•</span>
                        <p className="text-slate-300">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">No specific recommendations at this time</p>
                  )}
                </div>
              </div>

              {/* Progress Trend */}
              {!progressLoading && progress.length > 0 && (
                <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-400" />
                    Progress Trend
                  </h3>
                  <div className="space-y-3">
                    {progress.map((p, idx) => (
                      <div key={idx} className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-white">{p.term}</span>
                          <span className="text-blue-400 font-bold">{p.average.toFixed(1)}%</span>
                        </div>
                        <PerformanceBar percentage={Math.min(100, p.average)} />
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                          <span>Position: #{p.position}</span>
                          <span>Attendance: {p.attendance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'subjects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary.subjectBreakdown.length > 0 ? (
                summary.subjectBreakdown.map((subject, idx) => (
                  <div
                    key={idx}
                    className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        {subject.subject}
                      </h3>
                      <span className="text-2xl font-bold text-blue-400">{subject.score.toFixed(1)}</span>
                    </div>
                    <PerformanceBar percentage={Math.min(100, subject.score)} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-slate-400">Grade</p>
                        <p className="text-white font-semibold">{subject.grade}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Class Average</p>
                        <p className="text-white font-semibold">{subject.classAverage.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Position</p>
                        <p className="text-white font-semibold">#{subject.position}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Remark</p>
                        <p className="text-white font-semibold text-xs">{subject.remark || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-400">No subject data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
              <h3 className="text-lg font-bold text-white mb-6">Attendance Analysis</h3>

              {attendance ? (
                <div className="space-y-6">
                  {/* Current Attendance */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
                      <p className="text-slate-400 text-sm mb-1">Days Present</p>
                      <p className="text-2xl font-bold text-blue-400">{attendance.current.daysPresent}</p>
                    </div>
                    <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
                      <p className="text-slate-400 text-sm mb-1">Days School Opened</p>
                      <p className="text-2xl font-bold text-slate-300">{attendance.current.daysSchoolOpen}</p>
                    </div>
                    <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
                      <p className="text-slate-400 text-sm mb-1">Attendance Rate</p>
                      <p className="text-2xl font-bold text-green-400">{attendance.current.percentage}%</p>
                    </div>
                  </div>

                  {/* Attendance History */}
                  <div>
                    <h4 className="font-semibold text-white mb-4">Attendance History</h4>
                    <div className="space-y-3">
                      {attendance.history.map((histItem: any, idx: number) => (
                        <div key={idx} className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-white">{histItem.term}</span>
                            <span className="text-green-400 font-bold">{histItem.percentage}%</span>
                          </div>
                          <PerformanceBar percentage={histItem.percentage} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Assessment */}
                  <div className="border-t border-slate-700 pt-4">
                    <p className="text-slate-400 text-sm mb-2">Impact on Performance</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          attendance.impact === 'Good'
                            ? 'bg-green-500/20 text-green-400'
                            : attendance.impact === 'Fair'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {attendance.impact}
                      </div>
                      <p className="text-slate-400 text-sm">
                        {attendance.impact === 'Good'
                          ? 'Excellent attendance supporting good academic performance'
                          : attendance.impact === 'Fair'
                          ? 'Attendance may be impacting academic performance'
                          : 'Poor attendance requiring immediate attention'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">No attendance data available</p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
};

export default ChildDetailPage;
