"use client";
import React, { useEffect, useState } from 'react';
import { DocumentDuplicateIcon, ArrowDownTrayIcon, PlayCircleIcon, LinkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Resource {
  id: string;
  title: string;
  resourceType: string;
  url: string;
  createdAt: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/student/resources');
        setResources(res.data || []);
      } catch (err: any) {
        toast.error("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('video') || t.includes('mp4')) return <PlayCircleIcon className="w-5 h-5 text-red-500" />;
    if (t.includes('link') || t.includes('url')) return <LinkIcon className="w-5 h-5 text-green-500" />;
    if (t.includes('pdf') || t.includes('document')) return <DocumentDuplicateIcon className="w-5 h-5 text-blue-500" />;
    return <DocumentIcon className="w-5 h-5 text-gray-500" />;
  };

  const getActionText = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('video') || t.includes('mp4')) return 'Watch';
    if (t.includes('link') || t.includes('url')) return 'Open';
    return (
      <span className="flex items-center gap-1 ml-auto">
        <ArrowDownTrayIcon className="w-4 h-4"/> Download
      </span>
    );
  };

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
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">Loading resources...</td>
              </tr>
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">No resources available yet.</td>
              </tr>
            ) : (
              resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {getIcon(resource.resourceType)}
                      <span className="font-medium text-gray-900">{resource.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 capitalize">{resource.resourceType}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#146ef5] hover:text-[#105bd1] font-semibold text-sm inline-flex items-center"
                    >
                      {getActionText(resource.resourceType)}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
