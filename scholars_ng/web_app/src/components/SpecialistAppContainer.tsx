'use client';

import React, { useState } from 'react';
import { useAppHost } from './AppHostContext';
import { MotionRise } from '@/components/ScrollRiseProvider';

export interface AppSubtab {
  id: string;
  label: string;
  icon: any;
  component: React.ComponentType<any>;
}

interface SpecialistAppContainerProps {
  appTitle: string;
  appSubtitle: string;
  tabs: AppSubtab[];
  defaultTabId?: string;
  appBadge?: string;
  accentColor?: string; // e.g. '#2563eb', '#10b981', '#7c3aed', '#f59e0b'
  contextProps?: any;
}

export function SpecialistAppContainer({
  appTitle,
  appSubtitle,
  tabs,
  defaultTabId,
  appBadge,
  accentColor = '#2563eb',
  contextProps = {},
}: SpecialistAppContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id || '');
  const { tenant, user, token, standalone } = useAppHost();

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component;

  const mergedProps = {
    tenantId: tenant?.id,
    tenant,
    user,
    token,
    standalone,
    ...contextProps,
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* ── App Header ── */}
      <MotionRise className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{appTitle}</h1>
            {appBadge && (
              <span 
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{ 
                  backgroundColor: `${accentColor}15`, 
                  borderColor: `${accentColor}40`,
                  color: accentColor 
                }}
              >
                {appBadge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">{appSubtitle}</p>
        </div>

        {tenant && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>{tenant.name}</span>
          </div>
        )}
      </MotionRise>

      {/* ── Horizontal Subtabs Navigation (Admin Pattern) ── */}
      <MotionRise delay={0.05} className="bg-white border-b border-slate-200 px-6 pt-3">
        <div className="flex space-x-2 overflow-x-auto pb-px scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: accentColor,
                        color: accentColor,
                      }
                    : {}
                }
              >
                {Icon && <Icon className="w-4 h-4 stroke-[2]" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </MotionRise>

      {/* ── Mounted Feature Slice Content ── */}
      <MotionRise key={activeTab} delay={0.08} className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        {ActiveComponent ? (
          <ActiveComponent {...mergedProps} />
        ) : (
          <div className="text-center py-20 text-slate-400 text-sm">
            Select a subtab to view content.
          </div>
        )}
      </MotionRise>
    </div>
  );
}

export default SpecialistAppContainer;
