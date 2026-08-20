import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Palette, Cloud, ArrowRight } from 'lucide-react';
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
          title="Active Tenants"
          value="142"
          subtitle="Provisioned instances"
          trend="+18%"
          icon={Building2}
        />
        <WhiteMetricCard
          title="Verification Queue"
          value="15"
          subtitle="Pending approval"
          trend="-4%"
          trendColor="red"
          icon={ShieldCheck}
        />
        <WhiteMetricCard
          title="Custom Domains"
          value="84"
          subtitle="Active routing"
          trend="+12%"
          trendColor="green"
          icon={Cloud}
        />
        <WhiteMetricCard
          title="Branded Themes"
          value="120"
          subtitle="Customized UIs"
          trend="+5%"
          trendColor="green"
          icon={Palette}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12 flex flex-col gap-3">
          <WidgetCard title="Tenant Operations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="group p-6 bg-blue-50/50 border border-blue-200 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Provision Tenant</h4>
                  <p className="text-xs text-slate-500 mt-1">Setup a new school instance</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-amber-50/50 border border-amber-200 rounded-2xl hover:bg-amber-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">KYC Verifications</h4>
                  <p className="text-xs text-slate-500 mt-1">Review pending approvals</p>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-pink-50/50 border border-pink-200 rounded-2xl hover:bg-pink-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                    <Palette className="w-5 h-5 text-pink-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Platform Branding</h4>
                  <p className="text-xs text-slate-500 mt-1">Manage global theme config</p>
                </div>
                <ArrowRight className="w-5 h-5 text-pink-400 group-hover:text-pink-600 transition-colors transform group-hover:translate-x-1" />
              </button>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
