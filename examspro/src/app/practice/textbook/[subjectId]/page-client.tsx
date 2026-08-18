"use client";

import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Book,
  Plus,
  Minus,
  Maximize,
  Type,
  FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Topic {
  id: number;
  name: string;
  syllabusContent: string | null;
}

interface Subject {
  id: number;
  name: string;
  textbookUrl: string | null;
  textbookTitle: string | null;
  textbookContent: string | null;
  topics: Topic[];
}

export default function TextbookViewerPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isReaderMode, setIsReaderMode] = useState(false);

  useEffect(() => {
    fetchSubject();
  }, [subjectId]);

  const fetchSubject = async () => {
    try {
      // We need an endpoint that returns subject details with topics
      const res = await api.get(`/exams/subjects/${subjectId}`);
      setSubject(res.data);
    } catch (err) {
      setError("Failed to load textbook details.");
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 60));
  const resetZoom = () => setZoom(100);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Textbook...</p>
      </div>
    );
  }

  if (error || !subject?.textbookUrl) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Textbook Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">The requested textbook is either missing or has not been assigned to this subject yet.</p>
        <button 
          onClick={() => router.back()}
          className="px-8 py-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> GO BACK
        </button>
      </div>
    );
  }

  return (
    <main className="h-screen bg-navy flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-20 bg-white/5 border-b border-white/[0.1] border-t-white/[0.15] backdrop-blur-xl flex items-center justify-between px-6 md:px-10 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="h-10 w-px bg-white/10 hidden md:block" />
          
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Book className="w-3.5 h-3.5 text-blue" />
              <span className="text-[10px] font-black text-blue uppercase tracking-widest">{subject.name}</span>
            </div>
            <h1 className="text-sm md:text-lg font-bold text-white truncate max-w-[200px] md:max-w-md leading-none">
              {subject.textbookTitle || 'Recommended Textbook'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReaderMode(!isReaderMode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              isReaderMode 
                ? 'bg-blue text-white shadow-lg shadow-blue/20' 
                : 'bg-white/5 text-gray-400 border border-white/[0.1] border-t-white/[0.15] hover:bg-white/10 hover:text-white'
            }`}
          >
            {isReaderMode ? (
              <>
                <FileText className="w-4 h-4" />
                SWITCH TO PDF
              </>
            ) : (
              <>
                <Type className="w-4 h-4" />
                READER MODE
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#1a1a1a] relative overflow-auto custom-scrollbar flex flex-col items-center">
        {isReaderMode ? (
          <div className="w-full max-w-3xl px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-16 border-b border-white/10 pb-8">
              <h2 className="text-[10px] font-black text-blue uppercase tracking-[0.2em] mb-4">Reading Material</h2>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                {subject.textbookTitle || subject.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Full text-based reading mode for this textbook.
              </p>
            </header>

            <div className="text-gray-300 text-lg leading-relaxed prose prose-invert max-w-none prose-p:mb-6 prose-li:mb-2 prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6">
              {subject.textbookContent ? (
                <div dangerouslySetInnerHTML={{ __html: subject.textbookContent }} />
              ) : (
                <div className="bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-3xl p-12 text-center">
                  <Book className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-20" />
                  <p className="text-gray-500 italic">Text-based content has not been added for this textbook yet.</p>
                  <p className="text-gray-600 text-sm mt-2">Please use the PDF mode to view the original document.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Floating Zoom Controls (Only in PDF Mode) */}
            <div className="fixed right-8 bottom-12 z-50 flex flex-col gap-2">
              <button 
                onClick={handleZoomIn}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl"
                title="Zoom In"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button 
                onClick={resetZoom}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl"
                title="Reset Zoom"
              >
                <Maximize className="w-4 h-4 mx-auto" />
              </button>

              <button 
                onClick={handleZoomOut}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl"
                title="Zoom Out"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

            <div 
              className="transition-all duration-300 ease-in-out p-4 md:p-8 min-h-full flex flex-col items-center"
              style={{ 
                width: `${zoom}%`,
                minWidth: '40%',
              }}
            >
              <div className="w-full aspect-[1/1.414] relative shadow-2xl bg-white rounded-lg overflow-hidden">
                <iframe
                  src={`${subject.textbookUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="absolute inset-0 w-full h-full border-none"
                  title="Textbook PDF"
                />
              </div>
            </div>
          </>
        )}
        
        {/* Anti-Copy Overlay (Only at bottom) */}
        <div className="sticky bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-10 bg-[#0D1B2A] border-t border-white/5 flex items-center justify-between px-6 shrink-0">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
          {isReaderMode ? 'Interactive Reader Mode • Enhanced Accessibility' : 'Secure Educational Viewer • Printing and Downloads Disabled'}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
            {isReaderMode ? `Reading: ${subject.name}` : `Subject: ${subject.name} | Zoom: ${zoom}%`}
          </span>
        </div>
      </footer>
    </main>
  );
}
