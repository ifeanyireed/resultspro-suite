import React, { useState } from 'react';
import { AlertTriangle, Award, ArrowRight, Users } from '@/lib/hugeicons-compat';
import { useParentDashboard, useParentChildren } from '@/hooks/useParentAnalytics';
import { KPICard } from '@/components/analytics/KPICard';
import { RiskLevelBadge } from '@/components/analytics/Badges';
import { useNavigate } from 'react-router-dom';

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: dashboardData, loading: dashLoading } = useParentDashboard();
  const { children } = useParentChildren();
  const [selectedChild, setSelectedChild] = useState<string | null>(
    children.length > 0 ? children[0].id : null
  );

  const handleViewChildDetails = (studentId: string) => {
    navigate(`/parent/child/${studentId}`);
  };

  if (dashLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="text-lg font-bold text-white mb-6">Welcome, {dashboardData.parentName}</div>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Total Children"
            value={dashboardData.totalChildren}
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <KPICard
            label="At Risk (Critical)"
            value={dashboardData.alerts.critical}
            icon={<AlertTriangle className="w-5 h-5" />}
            color={dashboardData.alerts.critical > 0 ? 'red' : 'green'}
            trend={dashboardData.alerts.critical > 0 ? 10 : -5}
          />
          <KPICard
            label="High Attention Needed"
            value={dashboardData.alerts.high}
            icon={<Award className="w-5 h-5" />}
            color={dashboardData.alerts.high > 0 ? 'amber' : 'green'}
          />
          <KPICard
            label="Medium Attention"
            value={dashboardData.alerts.medium}
            icon={<Award className="w-5 h-5" />}
            color="purple"
          />
        </div>

        {/* Children Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Children List */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-colors">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              My Children
            </h2>

            {dashboardData.children.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">No children linked to your account yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.children.map((child) => (
                  <div
                    key={child.studentId}
                    onClick={() => setSelectedChild(child.studentId)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      selectedChild === child.studentId
                        ? 'bg-blue-500/20 border border-blue-400/50'
                        : 'bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{child.studentName}</h3>
                        <p className="text-xs text-slate-400">{child.className}</p>
                      </div>
                      {child.riskLevel && (
                        <RiskLevelBadge level={child.riskLevel as any} />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500">Average</p>
                        <p className="text-blue-400 font-semibold">{child.average.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Position</p>
                        <p className="text-green-400 font-semibold">#{child.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-colors">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-400" />
              Performance Overview
            </h2>

            {selectedChild && dashboardData.children.length > 0 ? (
              <div className="space-y-4">
                {(() => {
                  const child = dashboardData.children.find((c) => c.studentId === selectedChild);
                  if (!child) return null;

                  return (
                    <>
                      <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
                        <p className="text-slate-400 text-sm mb-1">Overall Average</p>
                        <p className="text-3xl font-bold text-blue-400">{child.average.toFixed(1)}%</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Class Position: <span className="text-green-400">#{child.position}</span>
                        </p>
                      </div>

                      <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
                        <p className="text-slate-400 text-sm mb-2">Risk Assessment</p>
                        {child.riskLevel ? (
                          <RiskLevelBadge level={child.riskLevel as any} score={0} />
                        ) : (
                          <p className="text-slate-400 text-sm">No risk data available</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleViewChildDetails(child.studentId)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        View Full Profile
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">Select a child to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Alert Summary */}
        {(dashboardData.alerts.critical > 0 || dashboardData.alerts.high > 0) && (
          <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400 mb-2">Attention Required</h3>
                <p className="text-slate-300 text-sm">
                  {dashboardData.alerts.critical > 0 && (
                    <>
                      {dashboardData.alerts.critical} child{dashboardData.alerts.critical > 1 ? 'ren' : ''} {dashboardData.alerts.critical > 1 ? 'are' : 'is'} at critical risk.{' '}
                    </>
                  )}
                  {dashboardData.alerts.high > 0 && (
                    <>
                      {dashboardData.alerts.high} child{dashboardData.alerts.high > 1 ? 'ren' : ''} {dashboardData.alerts.high > 1 ? 'need' : 'needs'} high attention.
                    </>
                  )}
                </p>
                <button className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition">
                  View At-Risk Children
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 text-center hover:bg-white/5 transition-colors">
          <p className="text-slate-400">
            Need help? <a href="#" className="text-blue-400 hover:text-blue-300 underline">Contact support</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default ParentDashboard;
