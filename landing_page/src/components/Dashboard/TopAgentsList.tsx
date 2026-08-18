'use client';

import React from 'react';

export interface TopAgent {
  id: string | number;
  name: string;
  avatarSrc: string;
  metricLabel: string;
  revenue: string;
}

interface TopAgentsListProps {
  title?: string;
  agents: TopAgent[];
  onViewAll?: () => void;
}

export default function TopAgentsList({ title = 'Top Agents', agents, onViewAll }: TopAgentsListProps) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-normal text-gray-900">{title}</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-medium text-[#146ef5]">View All</button>
        )}
      </div>
      
      <div className="space-y-5">
        {agents.map((agent, idx) => (
          <div key={agent.id || idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={agent.avatarSrc} alt={`${agent.name} Avatar`} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="text-base font-normal text-gray-900">{agent.name}</h4>
                <p className="text-sm text-gray-500">{agent.metricLabel}</p>
              </div>
            </div>
            <span className="font-bold text-gray-900 text-sm">{agent.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
