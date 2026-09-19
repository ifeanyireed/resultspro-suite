'use client';

import React from 'react';
import { 
  PlusIcon,
  Bars3BottomLeftIcon,
  DocumentDuplicateIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';

export default function ProgramBuilderPage() {
  const [programs, setPrograms] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  const fetchPrograms = async () => {
    try {
      const res = await coursesApi.get('/api/admin/programs');
      setPrograms(res.data.programs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreateProgram = async () => {
    const title = prompt("Enter a title for the new Journey (Program):");
    if (!title) return;
    
    setCreating(true);
    try {
      await coursesApi.post('/api/admin/programs', {
        title,
        description: "New authored journey",
        duration_weeks: 12,
        base_price: 0
      });
      await fetchPrograms();
    } catch (e) {
      alert("Failed to create journey");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Program Builder</h2>
          <p className="text-sm text-gray-500 mt-1">Create journeys, modules, and author content.</p>
        </div>
        <button 
          disabled={creating}
          onClick={handleCreateProgram}
          className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          <PlusIcon className="w-4 h-4" />
          {creating ? 'Creating...' : 'Create Journey'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Existing Journeys */}
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="text-gray-500 p-4">Loading journeys...</div>
          ) : programs.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-8 text-center shadow-sm border border-gray-100">
              <DocumentDuplicateIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-medium">No journeys found</h3>
              <p className="text-gray-500 text-sm mt-1">Click "Create Journey" to start authoring.</p>
            </div>
          ) : (
            programs.map((prog) => (
              <div key={prog.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
                    <DocumentDuplicateIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{prog.title}</h3>
                    <p className="text-sm text-gray-500">{prog.duration_weeks} Weeks • (Modules coming soon)</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                  <ArrowUpRightIcon className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats / Drafts */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content Library</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Bars3BottomLeftIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Total Programs</span>
              </div>
              <span className="text-lg font-bold text-[#146ef5]">{programs.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <DocumentDuplicateIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Drafts</span>
              </div>
              <span className="text-lg font-bold text-gray-900">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Block */}
      <div className="mt-6 bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-blue-50 text-[#146ef5] p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </span>
            Gemini Quiz Generator
          </h3>
          <p className="text-sm text-gray-500 mt-1">Paste your lesson markdown below, and Gemini will automatically generate a JSON quiz rubric for the students.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div>
             <textarea 
               className="w-full h-64 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-shadow"
               placeholder="# Lesson Title\n\nContent goes here..."
               id="markdownInput"
             />
             <button 
               className="mt-4 bg-[#146ef5] hover:bg-[#105bd1] shadow-sm shadow-[#146ef5]/20 text-white font-semibold py-3 px-6 rounded-xl w-full transition-colors flex items-center justify-center gap-2"
               onClick={async () => {
                 const btn = document.getElementById('genBtn') as HTMLButtonElement;
                 btn.innerText = 'Generating...';
                 try {
                   const txt = (document.getElementById('markdownInput') as HTMLTextAreaElement).value;
                   if (!txt) { alert("Paste some markdown first"); btn.innerText = 'Generate with Gemini'; return; }
                   
                   const res = await coursesApi.post('/api/admin/ai/generate-quiz-preview', { content: txt });
                   (document.getElementById('jsonOutput') as HTMLTextAreaElement).value = JSON.stringify(res.data.quiz, null, 2);
                   
                   btn.innerText = 'Generate with Gemini';
                 } catch (e) {
                   console.error("Failed to generate quiz:", e);
                   alert("Failed to generate quiz. Make sure the Go backend is running and GEMINI_API_KEY is set.");
                   btn.innerText = 'Generate with Gemini';
                 }
               }}
               id="genBtn"
             >
               Generate with Gemini
             </button>
           </div>
           <div>
             <textarea 
               id="jsonOutput"
               className="w-full h-full min-h-[16rem] bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-mono text-gray-800 focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-shadow"
               readOnly
               placeholder="Generated JSON will appear here..."
             />
           </div>
        </div>
      </div>
    </>
  );
}
