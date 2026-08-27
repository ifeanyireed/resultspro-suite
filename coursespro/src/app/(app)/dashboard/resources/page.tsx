"use client";
import React from 'react';
import { DocumentDuplicateIcon, ArrowDownTrayIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

export default function ResourcesPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shared Resources</h1>
          <p className="text-sm text-gray-500 mt-1">Session recordings, slide decks, and external learning materials.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Added</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <PlayCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-900">Week 1 Kickoff Session (Recording)</span>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-gray-500">Video (MP4)</td>
              <td className="py-4 px-6 text-sm text-gray-500">Oct 1, 2026</td>
              <td className="py-4 px-6 text-right">
                <button className="text-[#146ef5] hover:text-[#105bd1] font-semibold text-sm">Watch</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <DocumentDuplicateIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Git & GitHub Cheatsheet</span>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-gray-500">Document (PDF)</td>
              <td className="py-4 px-6 text-sm text-gray-500">Oct 3, 2026</td>
              <td className="py-4 px-6 text-right">
                <button className="text-[#146ef5] hover:text-[#105bd1] font-semibold text-sm flex items-center gap-1 ml-auto">
                  <ArrowDownTrayIcon className="w-4 h-4"/> Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}