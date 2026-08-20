import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, GraduationCap, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@resultspro/design-system';
import Link from 'next/link';

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
          title="Total Payouts"
          value="₦4.5M"
          subtitle="Tutor earnings distributed"
          trend="+12.5%"
          icon={DollarSign}
        />
        <WhiteMetricCard
          title="Total Tutors"
          value="1,248"
          subtitle="Approved platform tutors"
          trend="+15%"
          trendColor="green"
          icon={GraduationCap}
        />
        <WhiteMetricCard
          title="Active Bookings"
          value="342"
          subtitle="Sessions happening"
          trend="+8%"
          trendColor="green"
          icon={TrendingUp}
        />
        <WhiteMetricCard
          title="Pending Approval"
          value="24"
          subtitle="Tutor verification queue"
          trend="-5%"
          trendColor="red"
          icon={AlertCircle}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12 flex flex-col gap-3">
          <WidgetCard title="Tutor Operations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="group p-6 bg-amber-50/50 border border-amber-200 rounded-2xl hover:bg-amber-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Review Tutors</h4>
                  <p className="text-xs text-slate-500 mt-1">Check pending verifications</p>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Process Payouts</h4>
                  <p className="text-xs text-slate-500 mt-1">Review pending payouts</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-blue-50/50 border border-blue-200 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Manage Disputes</h4>
                  <p className="text-xs text-slate-500 mt-1">Resolve booking disputes</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
              </button>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
