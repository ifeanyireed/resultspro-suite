'use client';

import React from 'react';
import { 
  PlusIcon,
  Bars3BottomLeftIcon,
  DocumentDuplicateIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';

export default function ProgramBuilderPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Program Builder</h2>
          <p className="text-sm text-gray-500 mt-1">Create journeys, modules, and author content.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Create Journey
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Existing Journeys */}
        <div className="md:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
                  <DocumentDuplicateIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Fullstack Mastery - Sprint {i}</h3>
                  <p className="text-sm text-gray-500">12 Modules • 4 Projects • 8 Quizzes</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                <ArrowUpRightIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats / Drafts */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content Library</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Bars3BottomLeftIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Total Modules</span>
              </div>
              <span className="text-lg font-bold text-[#146ef5]">142</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <DocumentDuplicateIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Drafts</span>
              </div>
              <span className="text-lg font-bold text-orange-500">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Quiz Generator Section */}
      <div className="mt-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[1.5rem] p-8 shadow-lg border border-indigo-500/30 text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">EXPERIMENTAL</span>
            <h3 className="text-2xl font-bold mt-3 mb-2 flex items-center gap-2">
              Gemini Quiz Generator
            </h3>
            <p className="text-indigo-200 text-sm">Paste lesson markdown below to automatically generate a JSON assessment rubric.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
           <div>
             <textarea 
               className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-sm font-mono text-indigo-100 placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400"
               placeholder="# Lesson Title\n\nContent goes here..."
               id="markdownInput"
             />
             <button 
               className="mt-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-xl w-full transition-colors flex items-center justify-center gap-2"
               onClick={async () => {
                 const btn = document.getElementById('genBtn') as HTMLButtonElement;
                 btn.innerText = 'Generating...';
                 try {
                   // Mock endpoint invocation for now, in reality calls our Go /ai/modules/:id/generate-quiz
                   const txt = (document.getElementById('markdownInput') as HTMLTextAreaElement).value;
                   if (!txt) { alert("Paste some markdown first"); return; }
                   
                   // Simulate Go API delay
                   setTimeout(() => {
                     (document.getElementById('jsonOutput') as HTMLTextAreaElement).value = JSON.stringify([
                        {
                          "question": "What is the primary purpose of this lesson?",
                          "options": ["Option A", "Option B", "Option C", "Option D"],
                          "correct_index": 1
                        }
                     ], null, 2);
                     btn.innerText = 'Generate with Gemini';
                   }, 2000);
                 } catch (e) {
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
               className="w-full h-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm font-mono text-green-400 focus:outline-none"
               readOnly
               placeholder="Generated JSON will appear here..."
             />
           </div>
        </div>
      </div>
    </>
  );
}
