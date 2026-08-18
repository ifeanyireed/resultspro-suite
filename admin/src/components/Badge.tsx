import React from 'react';

interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  const s = status.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  if (['ACTIVE', 'VERIFIED', 'PAID', 'PUBLISHED', 'COMPLETED'].includes(s)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['PENDING', 'PENDING_VERIFICATION', 'DRAFT', 'GENERATED'].includes(s)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['SUSPENDED', 'REJECTED', 'FAILED', 'CANCELLED', 'REVOKED'].includes(s)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['PRO', 'PREMIUM'].includes(s)) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (['ENTERPRISE'].includes(s)) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      {s === 'PENDING_VERIFICATION' ? 'PENDING' : status.replace(/_/g, ' ')}
    </span>
  );
}
