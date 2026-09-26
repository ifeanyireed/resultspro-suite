"use client";
import React from 'react';
import { FolderOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

export default function ProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student_projects'],
    queryFn: async () => {
      const res = await api.get('/api/v1/student/projects');
      return res.data;
    }
  });

  const projects = data?.projects || [];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projects & Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">Submit your code and get mentor reviews.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm h-48 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-100 mb-4"></div>
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-gray-500 py-12 text-center bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
          No projects or assignments found in your current learning journey.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj: any, i: number) => {
            const isLocked = proj.status === 'Locked';
            const Wrapper = isLocked ? 'div' : Link;
            const props = isLocked ? {} : { href: `/dashboard/journey/${proj.module_id}` };
            
            return (
              <Wrapper key={i} {...props} className={`bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-200 hover:shadow-md transition-all cursor-pointer'}`}>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center mb-4">
                  <FolderOpenIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{proj.title}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{proj.desc}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className={`text-xs font-bold px-2 py-1 rounded 
                    ${['Submitted', 'Approved'].includes(proj.status) ? 'bg-emerald-50 text-emerald-600' 
                    : proj.status === 'Needs Revision' ? 'bg-rose-50 text-rose-600'
                    : proj.status === 'In Progress' ? 'bg-amber-50 text-amber-600' 
                    : 'bg-gray-100 text-gray-500'}`}
                  >
                    {proj.status}
                  </span>
                  <span className="text-xs font-medium text-gray-400">Due {proj.due || 'TBD'}</span>
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}
    </>
  );
}