import React, { useState, useEffect } from 'react';
import { BarChart01, TrendingUp, Users, BookOpen, AlertTriangle, Target, Calendar, CheckCircle, Mail, X, Activity } from '@/lib/hugeicons-compat';
import { KPICard } from '@/components/analytics/KPICard';
import { RiskLevelBadge, PerformanceBar, DistributionGauge } from '@/components/analytics/Badges';
import { useAnalyticsDashboard, useAtRiskStudents, useAttendanceAnalytics, useDomainAnalytics } from '@/hooks/useAnalytics';
import axios from '@/lib/axiosConfig';

interface AnalyticsDashboardProps {
  initialClassId?: string;
  initialSessionId?: string;
  initialTermId?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  initialClassId = '',
  initialSessionId = '',
  initialTermId = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'at-risk' | 'subjects' | 'attendance' | 'domains'>('overview');
  const [selectedClass, setSelectedClass] = useState(initialClassId);
  const [selectedSession, setSelectedSession] = useState(initialSessionId);
  const [selectedTerm, setSelectedTerm] = useState(initialTermId);
  const [selectedInstance, setSelectedInstance] = useState('');
  
  const [classes, setClasses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [instances, setInstances] = useState<any[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  // Student Detail Modal state
  const [selectedRiskStudent, setSelectedRiskStudent] = useState<any | null>(null);
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Domain Modal state
  const [selectedDomainStudent, setSelectedDomainStudent] = useState<any | null>(null);
  const [showDomainModal, setShowDomainModal] = useState(false);

  // Fetch filter metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setMetaLoading(true);
        const schoolId = localStorage.getItem('schoolId');
        
        const [classesRes, schoolRes, instancesRes] = await Promise.all([
          axios.get('/onboarding/classes'),
          axios.get(`/onboarding/school/${schoolId}`),
          axios.get('/results-setup/instances')
        ]);

        const classesData = classesRes.data.data?.classes || classesRes.data.data || [];
        setClasses(classesData);
        
        const sessionsData = schoolRes.data.data?.academicSessions || [];
        setSessions(sessionsData);

        const instancesData = instancesRes.data.data || [];
        setInstances(instancesData);

        // Auto-select defaults if not provided
        if (!selectedClass && classesData.length > 0) setSelectedClass(classesData[0].id);
        if (!selectedSession && sessionsData.length > 0) {
          const current = sessionsData[0];
          setSelectedSession(current.id);
          setTerms(current.terms || []);
          if (!selectedTerm && current.terms?.length > 0) setSelectedTerm(current.terms[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch analytics metadata', err);
      } finally {
        setMetaLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  // Update terms when session changes
  useEffect(() => {
    if (selectedSession) {
      const session = sessions.find(s => s.id === selectedSession);
      if (session) {
        setTerms(session.terms || []);
        if (session.terms?.length > 0 && !session.terms.find((t: any) => t.id === selectedTerm)) {
          setSelectedTerm(session.terms[0].id);
        }
      }
    }
  }, [selectedSession, sessions]);

  const handleInstanceChange = (instanceId: string) => {
    setSelectedInstance(instanceId);
    if (instanceId) {
      const instance = instances.find(i => i.id === instanceId);
      if (instance) {
        setSelectedClass(instance.classId);
        setSelectedSession(instance.sessionId);
        setSelectedTerm(instance.termId);
      }
    }
  };

  const { data: dashboardData, loading: dashLoading } = useAnalyticsDashboard(
    selectedClass, 
    selectedSession, 
    selectedTerm,
    selectedInstance
  );
  const { data: atRiskData, loading: riskLoading } = useAtRiskStudents(
    selectedClass, 
    selectedSession, 
    selectedTerm,
    selectedInstance
  );
  const { data: attendanceData, loading: attLoading } = useAttendanceAnalytics(
    selectedClass,
    selectedSession,
    selectedTerm,
    selectedInstance
  );
  const { data: domainData, loading: domLoading } = useDomainAnalytics(
    selectedClass,
    selectedSession,
    selectedTerm,
    selectedInstance
  );

  const isLoading = metaLoading || (dashLoading && (selectedInstance || (selectedClass && selectedSession && selectedTerm)));

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Class and term performance insights</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none min-w-[180px]">
            <select 
              value={selectedInstance} 
              onChange={(e) => handleInstanceChange(e.target.value)}
              className="w-full px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-100 outline-none focus:border-blue-500/50"
            >
              <option value="" className="bg-gray-900">Pull from Published Data</option>
              {instances.map(inst => (
                <option key={inst.id} value={inst.id} className="bg-gray-900">
                  {inst.instanceName} ({inst.status})
                </option>
              ))}
            </select>
          </div>

          {!selectedInstance && (
            <>
              <div className="flex-1 lg:flex-none min-w-[140px]">
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                >
                  <option value="" disabled className="bg-gray-900">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>)}
                </select>
              </div>
              
              <div className="flex-1 lg:flex-none min-w-[140px]">
                <select 
                  value={selectedSession} 
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                >
                  <option value="" disabled className="bg-gray-900">Select Session</option>
                  {sessions.map(s => <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>)}
                </select>
              </div>
              
              <div className="flex-1 lg:flex-none min-w-[120px]">
                <select 
                  value={selectedTerm} 
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                >
                  <option value="" disabled className="bg-gray-900">Select Term</option>
                  {terms.map(t => <option key={t.id} value={t.id} className="bg-gray-900">{t.name}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-white/5">
          <div className="inline-block animate-spin">
            <Target className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-gray-400 mt-4 font-medium">Processing analytics data...</p>
        </div>
      ) : (!selectedClass || !selectedSession || !selectedTerm) ? (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-dashed border-[rgba(255,255,255,0.15)] p-20 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">Please Select Filters</h3>
          <p className="text-gray-500 mt-2">Select a class, session, and term or a results instance to view analytics data.</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                activeTab === 'overview'
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('at-risk')}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                activeTab === 'at-risk'
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              At-Risk
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                activeTab === 'subjects'
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Subjects
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                activeTab === 'attendance'
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                activeTab === 'domains'
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Affective & Psychomotor
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && dashboardData && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <KPICard
                  label="Class Average"
                  value={`${(dashboardData.classAverage || 0).toFixed(1)}%`}
                  icon={<BarChart01 className="w-4 h-4" />}
                  color="blue"
                  trend={dashboardData.termTrend && dashboardData.termTrend.length > 1 ? 
                    dashboardData.termTrend[dashboardData.termTrend.length - 1].average - 
                    dashboardData.termTrend[0].average : 0
                  }
                />
                <KPICard
                  label="Pass Rate"
                  value={`${(dashboardData.passRate || 0).toFixed(1)}%`}
                  icon={<TrendingUp className="w-4 h-4" />}
                  color="green"
                />
                <KPICard
                  label="Distinction"
                  value={dashboardData.excellenceCount || 0}
                  icon={<Users className="w-4 h-4" />}
                  color="purple"
                />
                <KPICard
                  label="At Risk"
                  value={dashboardData.atRiskCount || 0}
                  icon={<AlertTriangle className="w-4 h-4" />}
                  color={(dashboardData.atRiskCount || 0) > 5 ? 'red' : 'amber'}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
                  <h3 className="text-lg font-semibold text-white mb-6">Student Distribution</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {(() => {
                      const total = (dashboardData.studentTierDistribution?.excellent || 0) +
                                   (dashboardData.studentTierDistribution?.good || 0) +
                                   (dashboardData.studentTierDistribution?.average || 0) +
                                   (dashboardData.studentTierDistribution?.atRisk || 0);
                      const displayTotal = Math.max(total, 1);
                      
                      return (
                        <>
                          <DistributionGauge
                            label="Excellent"
                            value={dashboardData.studentTierDistribution?.excellent || 0}
                            maxValue={displayTotal}
                            color="#3b82f6"
                          />
                          <DistributionGauge
                            label="Good"
                            value={dashboardData.studentTierDistribution?.good || 0}
                            maxValue={displayTotal}
                            color="#10b981"
                          />
                          <DistributionGauge
                            label="Average"
                            value={dashboardData.studentTierDistribution?.average || 0}
                            maxValue={displayTotal}
                            color="#f59e0b"
                          />
                          <DistributionGauge
                            label="At Risk"
                            value={dashboardData.studentTierDistribution?.atRisk || 0}
                            maxValue={displayTotal}
                            color="#ef4444"
                          />
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
                    <div className="space-y-3">
                      {dashboardData.topSubjects?.length > 0 ? dashboardData.topSubjects.slice(0, 3).map((subject, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-white">{subject.subjectName}</span>
                            <span className="text-sm font-bold text-green-400">
                              {(subject.average || 0).toFixed(1)}%
                            </span>
                          </div>
                          <PerformanceBar value={subject.average} maxValue={100} color="green" showLabel={false} />
                        </div>
                      )) : <p className="text-gray-500 text-sm italic">No data available</p>}
                    </div>
                  </div>

                  <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Needs Support</h3>
                    <div className="space-y-3">
                      {dashboardData.worstSubjects?.length > 0 ? dashboardData.worstSubjects.slice(0, 3).map((subject, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-white">{subject.subjectName}</span>
                            <span className="text-sm font-bold text-amber-400">
                              {(subject.average || 0).toFixed(1)}%
                            </span>
                          </div>
                          <PerformanceBar value={subject.average} maxValue={100} color="amber" showLabel={false} />
                        </div>
                      )) : <p className="text-gray-500 text-sm italic">No data available</p>}
                    </div>
                  </div>
                </div>
              </div>

              {dashboardData.termTrend?.length > 0 && (
                <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 mt-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Performance Trend</h3>
                  <div className="space-y-4">
                    {dashboardData.termTrend.map((term, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">{term.term}</span>
                          <span className="text-sm font-bold text-white">{(term.average || 0).toFixed(1)}%</span>
                        </div>
                        <PerformanceBar value={term.average} maxValue={100} color="blue" showLabel={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* At-Risk Tab */}
          {activeTab === 'at-risk' && atRiskData && (
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">At-Risk Students Summary</h3>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md font-bold uppercase tracking-wider animate-pulse">
                  Click any student for details
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <KPICard label="Total" value={atRiskData.summary?.totalAtRisk || 0} icon={<Users className="w-4 h-4" />} />
                <KPICard label="Critical" value={atRiskData.summary?.critical || 0} icon={<AlertTriangle className="w-4 h-4" />} color="red" />
                <KPICard label="High" value={atRiskData.summary?.high || 0} icon={<AlertTriangle className="w-4 h-4" />} color="orange" />
                <KPICard label="Medium" value={atRiskData.summary?.medium || 0} icon={<AlertTriangle className="w-4 h-4" />} color="amber" />
                <KPICard label="Low" value={atRiskData.summary?.low || 0} icon={<AlertTriangle className="w-4 h-4" />} color="green" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Risk Score</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Current Avg</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Class Avg</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 text-right">Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atRiskData.students?.length > 0 ? atRiskData.students
                      .filter(s => s.currentAverage < s.classAverage)
                      .slice(0, 10).map((student) => (
                      <tr 
                        key={student.studentId} 
                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all group"
                        onClick={() => {
                          setSelectedRiskStudent(student);
                          setShowRiskModal(true);
                        }}
                      >
                        <td className="py-3 px-4 text-sm text-white group-hover:text-blue-400 transition-colors">
                          <div className="flex items-center gap-2">
                            {student.studentName}
                            <Target className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <RiskLevelBadge level={student.riskLevel} score={student.riskScore} />
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-white">{(student.currentAverage || 0).toFixed(1)}%</td>
                        <td className="py-3 px-4 text-sm text-gray-400">{(student.classAverage || 0).toFixed(1)}%</td>
                        <td className="py-3 px-4 text-sm text-red-400 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span>{Math.abs((student.classAverage || 0) - (student.currentAverage || 0)).toFixed(1)}% below avg</span>
                            <Calendar className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">No at-risk students identified for this selection</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === 'subjects' && dashboardData && (
            <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center bg-white/2.5 p-4 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold text-white">Subject Performance Analysis</h3>
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  {dashboardData.allSubjects?.length || 0} Total Subjects
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {(dashboardData.allSubjects || []).map((subject: any) => {
                  const avg = subject.average || 0;
                  const pass = subject.passRate || 0;
                  const isLow = avg < 50;
                  const isHigh = avg >= 75;
                  
                  return (
                    <div key={subject.subjectId} className="bg-[rgba(255,255,255,0.02)] rounded-2xl border border-white/5 p-4 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-all group">
                      <div className="flex-1 w-full md:w-auto">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {subject.subjectName}
                          </h4>
                          <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter ${
                            isLow ? 'bg-red-500/20 text-red-400' : 
                            isHigh ? 'bg-green-500/20 text-green-400' : 
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {isLow ? 'Reassess' : isHigh ? 'Exceeding' : 'Stable'}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Academic Performance Summary</p>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Class Avg</p>
                          </div>
                          <DistributionGauge 
                            label="" 
                            value={avg} 
                            maxValue={100} 
                            color={isLow ? '#ef4444' : isHigh ? '#10b981' : '#3b82f6'} 
                          />
                        </div>

                        <div className="flex items-center gap-3 border-l border-white/10 pl-8">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Pass Rate</p>
                          </div>
                          <DistributionGauge 
                            label="" 
                            value={pass} 
                            maxValue={100} 
                            color="#a855f7" 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(!dashboardData.allSubjects || dashboardData.allSubjects.length === 0) && (
                  <div className="text-center py-20 bg-white/2.5 rounded-[30px] border border-dashed border-white/10">
                    <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No subject analytics available for this selection</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && attendanceData && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard
                  label="Average Attendance"
                  value={`${(attendanceData.averageAttendance || 0).toFixed(1)}%`}
                  icon={<CheckCircle className="w-4 h-4" />}
                  color="green"
                />
                <KPICard
                  label="Good Attendance"
                  value={attendanceData.distribution?.good || 0}
                  icon={<Users className="w-4 h-4" />}
                  color="blue"
                />
                <KPICard
                  label="Chronic Absence"
                  value={attendanceData.distribution?.critical || 0}
                  icon={<AlertTriangle className="w-4 h-4" />}
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
                  <h3 className="text-lg font-semibold text-white mb-6">Attendance Distribution</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <DistributionGauge
                      label="Good (90%+)"
                      value={attendanceData.distribution?.good || 0}
                      maxValue={Math.max(attendanceData.distribution?.good + attendanceData.distribution?.warning + attendanceData.distribution?.critical, 1)}
                      color="#10b981"
                    />
                    <DistributionGauge
                      label="Warning (75-90%)"
                      value={attendanceData.distribution?.warning || 0}
                      maxValue={Math.max(attendanceData.distribution?.good + attendanceData.distribution?.warning + attendanceData.distribution?.critical, 1)}
                      color="#f59e0b"
                    />
                    <DistributionGauge
                      label="Critical (<75%)"
                      value={attendanceData.distribution?.critical || 0}
                      maxValue={Math.max(attendanceData.distribution?.good + attendanceData.distribution?.warning + attendanceData.distribution?.critical, 1)}
                      color="#ef4444"
                    />
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
                  <h3 className="text-lg font-semibold text-white mb-6">Chronic Absentees</h3>
                  <div className="space-y-4">
                    {attendanceData.chronicAbsentees?.length > 0 ? attendanceData.chronicAbsentees.map((student: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-white">{student.studentName}</span>
                          <span className="text-sm font-bold text-red-400">{(student.percentage || 0).toFixed(1)}%</span>
                        </div>
                        <PerformanceBar value={student.percentage} maxValue={100} color="red" showLabel={false} />
                      </div>
                    )) : <p className="text-gray-500 text-sm italic">No chronic absentees identified</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Domains Tab */}
          {activeTab === 'domains' && domainData && (
            <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Affective & Psychomotor Summary</h3>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md font-bold uppercase tracking-wider animate-pulse">
                  Click any student for details
                </span>
              </div>

              {/* Class Trait Averages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
                  <h3 className="text-lg font-semibold text-white mb-8 flex items-center gap-2 border-b border-white/5 pb-4">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Class Averages by Trait
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                    {domainData.traitAverages?.slice(0, 6).map((trait: any, idx: number) => (
                      <DistributionGauge
                        key={idx}
                        label={trait.name}
                        value={trait.average}
                        maxValue={5}
                        color={trait.type === 'Affective' ? '#3b82f6' : '#a855f7'}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
                  <h3 className="text-lg font-semibold text-white mb-6">Trait Breakdown by Student</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Name</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400">Affective Avg</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400">Psychomotor Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {domainData.studentSummaries?.slice(0, 10).map((student: any) => (
                          <tr 
                            key={student.studentId} 
                            className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all group"
                            onClick={() => {
                              setSelectedDomainStudent(student);
                              setShowDomainModal(true);
                            }}
                          >
                            <td className="py-3 px-4 text-sm text-white group-hover:text-amber-400 transition-colors">
                              {student.studentName}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-sm font-bold text-blue-400">{student.affectiveAvg.toFixed(1)}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-sm font-bold text-purple-400">{student.psychomotorAvg.toFixed(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Student Risk Detail Modal */}
      {showRiskModal && selectedRiskStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 w-full max-w-2xl rounded-[30px] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2.5">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedRiskStudent.studentName}</h3>
                <p className="text-sm text-gray-400">Detailed Risk Analysis</p>
              </div>
              <button 
                onClick={() => setShowRiskModal(false)}
                className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-white/2.5 border border-white/5">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Risk Score</p>
                  <p className="text-3xl font-bold text-white">{selectedRiskStudent.riskScore}%</p>
                </div>
                <RiskLevelBadge level={selectedRiskStudent.riskLevel} score={selectedRiskStudent.riskScore} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-300">Class Average Comparison</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Student: {selectedRiskStudent.currentAverage}%</span>
                    <span>Class: {selectedRiskStudent.classAverage}%</span>
                  </div>
                  <PerformanceBar value={selectedRiskStudent.currentAverage} maxValue={100} color={selectedRiskStudent.factors.lowAverageScore.triggered ? 'red' : 'blue'} showLabel={false} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-300">Weak Subjects ({selectedRiskStudent.factors.weakSubjects.subjects?.length || 0})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRiskStudent.factors.weakSubjects.subjects?.length > 0 ? (
                      selectedRiskStudent.factors.weakSubjects.subjects.map((sub: string) => (
                        <span key={sub} className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">No weak subjects identified</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Recommended Interventions</h4>
                <div className="space-y-2">
                  {selectedRiskStudent.recommendations?.map((rec: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-white/2.5">
              <button 
                onClick={() => setShowRiskModal(false)}
                className="px-6 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Parent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Detail Modal */}
      {showDomainModal && selectedDomainStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 w-full max-w-3xl rounded-[30px] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2.5">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedDomainStudent.studentName}</h3>
                <p className="text-sm text-gray-400">Affective & Psychomotor Breakdown</p>
              </div>
              <button 
                onClick={() => setShowDomainModal(false)}
                className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto max-h-[70vh]">
              {/* Affective Breakdown */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs">Affective Domain</h4>
                </div>
                <div className="space-y-4">
                  {Object.entries(selectedDomainStudent.traits.affective || {}).map(([trait, val]: [string, any]) => (
                    <div key={trait}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-gray-300">{trait}</span>
                        <span className="text-xs font-bold text-blue-400">{val} / 5</span>
                      </div>
                      <PerformanceBar value={parseInt(String(val))} maxValue={5} color="blue" showLabel={false} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychomotor Breakdown */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs">Psychomotor Domain</h4>
                </div>
                <div className="space-y-4">
                  {Object.entries(selectedDomainStudent.traits.psychomotor || {}).map(([trait, val]: [string, any]) => (
                    <div key={trait}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-gray-300">{trait}</span>
                        <span className="text-xs font-bold text-purple-400">{val} / 5</span>
                      </div>
                      <PerformanceBar value={parseInt(String(val))} maxValue={5} color="purple" showLabel={false} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 flex justify-end bg-white/2.5">
              <button 
                onClick={() => setShowDomainModal(false)}
                className="px-8 py-2 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
