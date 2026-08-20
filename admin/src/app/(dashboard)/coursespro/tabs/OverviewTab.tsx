import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Layers, GraduationCap, ArrowRight } from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@resultspro/design-system';

export default function OverviewTab() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <GradientMetricCard
          title="Active Cohorts"
          value="42"
          subtitle="Running programs"
          trend="+5%"
          icon={Layers}
        />
        <WhiteMetricCard
          title="Total Enrollments"
          value="18,500"
          subtitle="Active students"
          trend="+12%"
          trendColor="green"
          icon={Users}
        />
        <WhiteMetricCard
          title="Completion Rate"
          value="84%"
          subtitle="Graduated"
          trend="-2%"
          trendColor="red"
          icon={TrendingUp}
        />
        <WhiteMetricCard
          title="Active Mentors"
          value="156"
          subtitle="Guiding students"
          trend="+8%"
          trendColor="green"
          icon={GraduationCap}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12 flex flex-col gap-3">
          <WidgetCard title="Cohort Management">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="group p-6 bg-orange-50/50 border border-orange-200 rounded-2xl hover:bg-orange-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">New Cohort</h4>
                  <p className="text-xs text-slate-500 mt-1">Create a new learning cohort</p>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-400 group-hover:text-orange-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Review Enrollments</h4>
                  <p className="text-xs text-slate-500 mt-1">Approve pending enrollments</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-purple-50/50 border border-purple-200 rounded-2xl hover:bg-purple-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Mentor Applications</h4>
                  <p className="text-xs text-slate-500 mt-1">Review new mentor requests</p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors transform group-hover:translate-x-1" />
              </button>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
