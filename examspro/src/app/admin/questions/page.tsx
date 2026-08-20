"use client";

import { useState, useEffect, useRef } from 'react';
import { IconSearch as Search, IconPlus as Plus, IconFilter as Filter, IconDotsVertical as MoreVertical, IconUpload as Upload, IconSparkles as Sparkles, IconLoader2 as Loader2, IconEye as Eye, IconEdit as Edit, IconTrash as Trash2, IconDownload as Download, IconX as X, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';

export default function AdminQuestionListPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [searchQuery, selectedExamId, selectedSubjectId, selectedTopicId, selectedYear, selectedType, currentPage, itemsPerPage]);

  const fetchInitialData = async () => {
    try {
      const eRes = await api.get(`/exams?_t=${Date.now()}`);
      setExams(eRes.data);
    } catch (error) {
      toast.error('Failed to fetch exams');
    }
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        examId: selectedExamId,
        subjectId: selectedSubjectId,
        topicId: selectedTopicId,
        year: selectedYear,
        type: selectedType
      });
      const response = await api.get(`/admin/questions?${params.toString()}`);
      setQuestions(response.data.questions || []);
      setTotalQuestions(response.data.total || 0);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamChange = async (examId: string) => {
    setSelectedExamId(examId);
    setSelectedSubjectId('all');
    setSelectedTopicId('all');
    setSubjects([]);
    setTopics([]);
    setCurrentPage(1);
    if (examId === 'all') return;
    
    try {
      const res = await api.get(`/exams/${examId}/subjects`);
      setSubjects(res.data.subjects || []);
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  const handleSubjectChange = async (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedTopicId('all');
    setTopics([]);
    setCurrentPage(1);
    if (subjectId === 'all') return;
    
    try {
      const res = await api.get(`/exams/subjects/${subjectId}/topics`);
      setTopics(res.data.topics || []);
    } catch (error) {
      toast.error('Failed to load topics');
    }
  };

  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleGenerateAI = async (questionId: string) => {
    setIsGenerating(questionId);
    try {
      await api.post(`/admin/questions/${questionId}/generate-ai-explanation`);
      toast.success('AI Explanation generated successfully');
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to generate AI explanation');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success('Question deleted');
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map(q => q.id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} questions? This action cannot be undone.`)) return;

    try {
      const res = await api.post('/admin/questions/bulk-delete', { ids: selectedIds });
      toast.success(res.data.message || `${selectedIds.length} questions deleted`);
      setSelectedIds([]);
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to perform bulk deletion');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      await api.post('/admin/questions/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Bulk upload successful');
      fetchQuestions();
    } catch (error) {
      toast.error('Bulk upload failed. Ensure CSV format is correct.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadCSVTemplate = () => {
    const headers = ['exam', 'subject', 'topicId', 'year', 'bodyText', 'type', 'difficulty', 'optionA', 'optionB', 'optionC', 'optionD', 'correctOption', 'explanation', 'bodyImageUrl'];
    const sampleData = [
      ['JAMB', 'Mathematics', '1', '2024', 'What is 2 + 2?', 'mcq', 'easy', '3', '4', '5', '6', 'B', '2 + 2 is 4.', 'https://example.com/image.png']
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderWithMath = (text: string) => {
    if (!text) return null;
    
    const parts = text.split(/(\\\(.*?\\\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const math = part.slice(2, -2);
        return <InlineMath key={i} math={math} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <AdminHeader title="Question Management" />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-display font-bold text-white">Questions</h2>
          <div className="flex items-center gap-4">
            <Button 
              onClick={downloadCSVTemplate}
              variant="outline" 
              className="rounded-xl border-white/[0.1] border-t-white/[0.15] font-bold text-xs gap-2 bg-white/5 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <Button 
              variant="outline" 
              className="rounded-xl border-white/[0.1] border-t-white/[0.15] font-bold text-xs gap-2 bg-white/5 text-white hover:bg-white/10"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Bulk Import
            </Button>
            <Link href="/admin/questions/new">
              <Button className="rounded-xl bg-green text-navy hover:bg-green/90 font-bold text-xs gap-2">
                <Plus className="w-4 h-4" /> Create Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by ID, text, or topic..."
              className="w-full bg-white/[0.02] border border-white/[0.1] border-t-white/[0.15] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedExamId}
              onChange={(e) => handleExamChange(e.target.value)}
              className="flex-1 min-w-[150px] bg-white/[0.02] border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-green/50"
            >
              <option value="all" className="bg-navy">All Exams</option>
              {exams.map((category, idx) => (
                <optgroup key={`cat-${idx}`} label={category.name} className="text-gray-400 font-normal">
                  {category.exams.map((e: any) => (
                    <option key={e.id} value={e.id} className="bg-navy text-white font-bold">{e.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            <select 
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              disabled={selectedExamId === 'all'}
              className="flex-1 min-w-[150px] bg-white/[0.02] border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-green/50 disabled:opacity-50"
            >
              <option value="all" className="bg-navy">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-navy">{s.name}</option>
              ))}
            </select>

            <select 
              value={selectedTopicId}
              onChange={(e) => handleTopicChange(e.target.value)}
              disabled={selectedSubjectId === 'all'}
              className="flex-1 min-w-[150px] bg-white/[0.02] border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-green/50 disabled:opacity-50"
            >
              <option value="all" className="bg-navy">All Topics</option>
              {topics.map(t => (
                <option key={t.id} value={t.id} className="bg-navy">{t.name}</option>
              ))}
            </select>

            <input 
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="Year"
              className="w-24 bg-white/[0.02] border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-green/50"
            />

            <select 
              value={selectedType}
              onChange={handleTypeChange}
              className="w-32 bg-white/[0.02] border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-green/50"
            >
              <option value="all" className="bg-navy">All Types</option>
              <option value="mcq" className="bg-navy">MCQ</option>
              <option value="theory" className="bg-navy">Theory</option>
            </select>

            {(searchQuery || selectedExamId !== 'all' || selectedSubjectId !== 'all' || selectedTopicId !== 'all' || selectedYear || selectedType !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedExamId('all');
                  setSelectedSubjectId('all');
                  setSelectedTopicId('all');
                  setSelectedYear('');
                  setSelectedType('all');
                  setSubjects([]);
                  setTopics([]);
                  setCurrentPage(1);
                }}
                variant="ghost" 
                className="text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4 mr-2" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-green" />
              <p className="text-gray-500 font-medium">Loading questions...</p>
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/[0.05] border-t-white/[0.1]">
                    <th className="px-8 py-4 w-10">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-white/[0.1] border-t-white/[0.15] bg-white/5 text-green focus:ring-green/50 accent-green cursor-pointer"
                        checked={questions.length > 0 && selectedIds.length === questions.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Question Details</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metadata</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Content</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {questions.map((q, i) => (
                    <tr key={i} className={`hover:bg-white/5 transition-colors group ${selectedIds.includes(q.id) ? 'bg-green/5' : ''}`}>
                      <td className="px-8 py-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-white/[0.1] border-t-white/[0.15] bg-white/5 text-green focus:ring-green/50 accent-green cursor-pointer"
                          checked={selectedIds.includes(q.id)}
                          onChange={() => toggleSelection(q.id)}
                        />
                      </td>
                      <td className="px-8 py-6 max-w-md">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-[10px] font-bold text-green uppercase tracking-widest">{q.id.split('-')[0]}...</div>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${q.type === 'theory' ? 'bg-amber/10 text-amber border border-amber/20' : 'bg-blue/10 text-blue border border-blue/20'}`}>
                            {q.type || 'mcq'}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white line-clamp-2 leading-relaxed">
                          {renderWithMath(q.bodyText)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue/10 text-blue text-[10px] font-black uppercase tracking-tighter border border-blue/20">{q.topic?.subject?.exam?.name || 'Exam'}</span>
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-tighter border border-purple-500/20" title={`Subject ID: ${q.topic?.subjectId}`}>{q.topic?.subject?.name || 'Subject'}</span>
                          {q.year && (
                            <span className="px-2 py-0.5 rounded bg-amber/10 text-amber text-[10px] font-black uppercase tracking-tighter border border-amber/20">{q.year}</span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase mt-2 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">Topic:</span>
                            <span className="text-white">{q.topic?.name}</span>
                            <span className="text-gray-700 font-mono text-[8px] uppercase">{q.topicId}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">Subject ID:</span>
                            <span className="text-gray-700 font-mono text-[8px] uppercase">{q.topic?.subjectId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {q.explanationStandard ? (
                          <div className="flex items-center gap-2 text-green font-bold text-[10px] uppercase">
                            <Sparkles className="w-3 h-3" /> Ready
                          </div>
                        ) : (
                          <Button 
                            onClick={() => handleGenerateAI(q.id)}
                            disabled={isGenerating === q.id}
                            variant="ghost" 
                            className="h-8 px-3 rounded-lg bg-amber/5 text-amber hover:bg-amber/10 border border-amber/10 text-[10px] font-black gap-2 uppercase"
                          >
                            {isGenerating === q.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            Generate
                          </Button>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${q.status === 'published' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setSelectedQuestion(q);
                              setIsPreviewOpen(true);
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-green transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link href={`/admin/questions/edit?id=${q.id}`}>
                            <button 
                              className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-blue-400 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(q.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {questions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <p className="text-gray-500 font-medium">No questions found matching your filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              <div className="px-8 py-6 bg-white/5 border-t border-white/[0.05] border-t-white/[0.1] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    Showing <span className="text-white">{(currentPage-1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalQuestions)}</span> of <span className="text-white">{totalQuestions}</span> questions
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-600 font-black uppercase">Per Page:</span>
                    <select 
                      value={itemsPerPage}
                      onChange={handlePerPageChange}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none focus:border-green/50"
                    >
                      <option value={10} className="bg-navy">10</option>
                      <option value={20} className="bg-navy">20</option>
                      <option value={50} className="bg-navy">50</option>
                      <option value={100} className="bg-navy">100</option>
                      <option value={200} className="bg-navy">200</option>
                      <option value={500} className="bg-navy">500</option>
                      <option value={1000} className="bg-navy">1000</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="rounded-xl h-9 px-4 text-xs font-black uppercase tracking-widest border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-1">
                    {(() => {
                      const totalPages = Math.ceil(totalQuestions / itemsPerPage);
                      const pages = [];
                      const maxVisible = 5;
                      
                      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                      let end = Math.min(totalPages, start + maxVisible - 1);
                      
                      if (end - start + 1 < maxVisible) {
                        start = Math.max(1, end - maxVisible + 1);
                      }

                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }
                      
                      return (
                        <>
                          {start > 1 && (
                            <>
                              <button onClick={() => setCurrentPage(1)} className="w-9 h-9 rounded-lg text-xs font-black text-gray-500 hover:text-white">1</button>
                              {start > 2 && <span className="px-1 text-gray-600">...</span>}
                            </>
                          )}
                          {pages.map(pageNum => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-9 h-9 rounded-lg text-xs font-black transition-colors ${currentPage === pageNum ? 'bg-green text-navy' : 'text-gray-500 hover:text-white'}`}
                            >
                              {pageNum}
                            </button>
                          ))}
                          {end < totalPages && (
                            <>
                              {end < totalPages - 1 && <span className="px-1 text-gray-600">...</span>}
                              <button onClick={() => setCurrentPage(totalPages)} className="w-9 h-9 rounded-lg text-xs font-black text-gray-500 hover:text-white">{totalPages}</button>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage >= Math.ceil(totalQuestions / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="rounded-xl h-9 px-4 text-xs font-black uppercase tracking-widest border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Floating Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-navy/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 pr-8 border-r border-white/10">
                <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green font-black">
                  {selectedIds.length}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Questions Selected</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Ready for bulk action</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setSelectedIds([])}
                  variant="ghost" 
                  className="rounded-xl font-bold text-xs text-gray-500 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBulkDelete}
                  className="rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold text-xs gap-2 px-6"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Question Preview">
        {selectedQuestion && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 no-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-green/10 text-green text-[10px] font-black uppercase tracking-widest border border-green/20">
                  {selectedQuestion.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue/10 text-blue text-[10px] font-black uppercase tracking-widest border border-blue/20">
                  {selectedQuestion.topic?.subject?.name}
                </span>
              </div>
              <div className="text-lg font-bold text-white leading-relaxed whitespace-pre-wrap">
                {renderWithMath(selectedQuestion.bodyText)}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {selectedQuestion.type === 'mcq' && selectedQuestion.options?.map((opt: any, idx: number) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border flex items-center gap-4 ${opt.isCorrect ? 'bg-green/10 border-green/30 text-green' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15] text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${opt.isCorrect ? 'bg-green text-navy' : 'bg-white/10 text-gray-500'}`}>
                    {String.fromCharCode(65 + opt.orderIndex)}
                  </div>
                  <div className="text-sm font-medium">
                    {renderWithMath(opt.optionText)}
                  </div>
                  {opt.isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto" />}
                </div>
              ))}
            </div>

            {selectedQuestion.explanationStandard && (
              <div className="space-y-3 p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> {selectedQuestion.type === 'mcq' ? 'Step-by-Step Explanation' : 'Detailed Solution'}
                </h4>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {renderWithMath(selectedQuestion.explanationStandard)}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
