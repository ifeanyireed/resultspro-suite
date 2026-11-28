'use client';

import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useAppHost } from './AppHostContext';
import { MotionRise } from '@/components/ScrollRiseProvider';

export interface AppSubtab {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  component: React.ComponentType<any>;
}

interface SpecialistAppContainerProps {
  appTitle: string;
  appSubtitle: string;
  tabs: AppSubtab[];
  defaultTabId?: string;
  appBadge?: string;
  accentColor?: string; // e.g. '#146ef5', '#10b981', '#0D1060', '#f59e0b'
  contextProps?: any;
  headerActions?: React.ReactNode;
}

export function SpecialistAppContainer({
  appTitle,
  appSubtitle,
  tabs,
  defaultTabId,
  appBadge,
  accentColor = '#146ef5',
  contextProps = {},
  headerActions,
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
    <div className="min-w-0 w-full max-w-full space-y-6">
      {/* ── Top Header Area Above the Toggle Bar (Matches /student/campus-os) ── */}
      <MotionRise className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{appTitle}</h1>
            {appBadge && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: `${accentColor}12`,
                  borderColor: `${accentColor}35`,
                  color: accentColor,
                }}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                {appBadge}
              </span>
            )}
            {tenant?.name && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                {tenant.name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{appSubtitle}</p>
        </div>

        {headerActions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {headerActions}
          </div>
        )}
      </MotionRise>

      {/* ── Sticky Horizontal Pill Toggle Bar (Matches /student/campus-os) ── */}
      <div className="sticky top-20 z-20 w-full min-w-0 max-w-full">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-gray-200/80 overflow-x-auto custom-scrollbar flex items-center gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: accentColor,
                        boxShadow: `0 1px 3px ${accentColor}40`,
                      }
                    : {}
                }
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mounted Feature Slice Content ── */}
      <MotionRise key={activeTab} delay={0.04} className="w-full pt-1">
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
