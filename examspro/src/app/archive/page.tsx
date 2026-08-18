"use client";

import Navbar from '@/components/Navbar';
import { IconArchive as Archive, IconSearch as Search, IconDownload as Download, IconPlay as Play, IconBookOpen as BookOpen, IconClock as Clock, IconFilter as Filter, IconChevronRight as ChevronRight, IconFileText as FileText } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ArchivePage() {
  const papers = [
    { year: 2024, exam: "JAMB", subject: "Physics", questions: 40, duration: "60m" },
    { year: 2024, exam: "JAMB", subject: "Mathematics", questions: 40, duration: "60m" },
    { year: 2023, exam: "WAEC", subject: "English Language", questions: 100, duration: "120m" },
    { year: 2023, exam: "JAMB", subject: "Chemistry", questions: 40, duration: "60m" },
    { year: 2022, exam: "NECO", subject: "Biology", questions: 60, duration: "90m" },
    { year: 2022, exam: "JAMB", subject: "Physics", questions: 40, duration: "60m" },
  ];

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 italic tracking-tighter uppercase">
              Past <span className="text-blue">Questions</span>
            </h1>
            <p className="text-gray-400 max-w-md">
              Access 20+ years of official past questions. Practice in real exam 
              conditions or download PDFs for offline study.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by year or subject..."
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue/50 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {['All Exams', 'JAMB', 'WAEC', 'NECO', 'Post-UTME'].map((f, i) => (
            <button 
              key={f} 
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-blue text-white shadow-lg shadow-blue/20' : 'bg-white/5 text-gray-500 border border-white/[0.05] border-t-white/[0.1] hover:border-white/10'}`}
            >
              {f}
            </button>
          ))}
          <Button variant="outline" className="ml-auto border-white/5 text-gray-500 hover:text-white rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper, i) => (
            <div 
              key={i}
              className="group p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/10 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-24 h-24 text-white" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 rounded-lg bg-blue/10 text-blue text-[10px] font-black uppercase tracking-widest border border-blue/20">
                    {paper.exam}
                  </div>
                  <span className="text-2xl font-display font-black text-white/20">{paper.year}</span>
                </div>
                
                <h3 className="text-xl font-display font-bold text-white mb-6">{paper.subject}</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-400">{paper.questions} Qs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-400">{paper.duration}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/[0.1] border-t-white/[0.15] rounded-2xl h-14 font-bold flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                  <Button className="flex-[2] bg-blue text-white hover:bg-blue/90 rounded-2xl h-14 font-bold flex items-center justify-center gap-2 group/btn">
                    <Play className="w-4 h-4 fill-current" />
                    Practice Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[48px] bg-gradient-to-br from-blue/20 to-transparent border border-white/10 text-center">
          <Archive className="w-12 h-12 text-blue mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold text-white mb-4">Request a Paper</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Can't find a specific year or subject? Let us know and we'll add it 
            to the archive within 24 hours.
          </p>
          <Button className="bg-white text-navy hover:bg-white/90 rounded-2xl px-10 h-14 font-bold">
            Submit Request
          </Button>
        </div>
      </div>
    </main>
  );
}
