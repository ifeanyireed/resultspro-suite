"use client";

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Sparkles,
  Book,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Topic {
  id: number;
  name: string;
  syllabusContent: string | null;
}

interface Subject {
  id: number;
  name: string;
  textbookUrl?: string | null;
  textbookTitle?: string | null;
  topics: Topic[];
}

interface ExamData {
  id: number;
  name: string;
  subjects: Subject[];
}

export default function FullSyllabusPage() {
  const params = useParams();
  const examId = params.examId as string;

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await api.get(`/exams/${examId}/syllabus`);
        setExamData(response.data.exam);
      } catch (err) {
        console.error('Error fetching syllabus:', err);
        setError('Failed to load the full syllabus accurately.');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchSyllabus();
    }
  }, [examId]);

  const toggleSubject = (id: number) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSubjects(newExpanded);
  };

  const toggleAll = () => {
    if (!examData) return;
    if (expandedSubjects.size === examData.subjects.length) {
      setExpandedSubjects(new Set());
    } else {
      setExpandedSubjects(new Set(examData.subjects.map(s => s.id)));
    }
  };

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
        {/* Breadcrumbs & Master Toggle */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href={`/practice/${examId}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Examination</span>
          </Link>

          {!loading && examData && (
            <button
              onClick={toggleAll}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              {expandedSubjects.size === examData.subjects.length ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  Collapse All
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Expand All
                </>
              )}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue/20 border-t-blue rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Fetching official syllabus...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : examData && (
          <>
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue/10 text-blue">
                  <Book className="w-5 h-5" />
                </div>
                <span className="text-blue font-bold text-sm uppercase tracking-widest">Official Curriculum</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                {examData.name} <span className="text-blue">Full Syllabus</span>
              </h1>
              <p className="text-gray-400 text-lg">Detailed breakdown of all subjects and topics required for your examination.</p>
            </header>

            <div className="space-y-6">
              {(examData.subjects || []).map((subject) => {
                const isExpanded = expandedSubjects.has(subject.id);
                return (
                  <div key={subject.id} className="p-0.5 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent transition-all">
                    <div className="bg-navy/80 backdrop-blur-xl rounded-[30px] overflow-hidden border border-white/5">
                      {/* Header Toggler */}
                      <div 
                        onClick={() => toggleSubject(subject.id)}
                        className="w-full p-6 md:p-8 bg-white/5 border-b border-white/[0.05] border-t-white/[0.1] flex items-center justify-between group transition-colors hover:bg-white/10 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? 'bg-blue text-white' : 'bg-blue/20 text-blue group-hover:bg-blue/30'}`}>
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-2xl font-bold text-white group-hover:text-blue transition-colors">{subject.name}</h2>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{(subject.topics?.length || 0)} Topics Available</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {subject.textbookUrl && (
                            <Link
                              href={`/practice/textbook/${subject.id}`}
                              onClick={(e) => e.stopPropagation()}
                              title={subject.textbookTitle || `Read ${subject.name} Textbook`}
                              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue/10 text-blue border border-blue/20 hover:bg-blue hover:text-white transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span>{subject.textbookTitle || 'Recommended Text'}</span>
                            </Link>
                          )}
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Topic List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                          >
                            <div className="divide-y divide-white/5">
                              {(subject.topics || []).map((topic) => (
                                <div key={topic.id} className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors group">
                                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue transition-colors">{topic.name}</h3>
                                      <div className="text-gray-400 text-sm leading-relaxed prose prose-invert max-w-none">
                                        {topic.syllabusContent ? (
                                          <p>{topic.syllabusContent}</p>
                                        ) : (
                                          <p className="italic text-gray-600">No detailed syllabus description available for this topic.</p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <Link href={`/practice/study/${topic.id}`} className="shrink-0">
                                      <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue/10 text-blue font-bold border border-blue/20 hover:bg-blue hover:text-white transition-all">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Study Topic</span>
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </Link>
                                  </div>
                                </div>
                              ))}

                              {(!subject.topics || subject.topics.length === 0) && (
                                <div className="p-8 text-center text-gray-500 text-sm italic">
                                  No topics have been added to this subject yet.
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
