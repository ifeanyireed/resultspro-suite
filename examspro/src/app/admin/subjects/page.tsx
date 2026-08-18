"use client";

import { 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  BookOpen, 
  Edit2,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  Eye,
  X,
  FileText,
  FileUp,
  Download,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import { format } from 'date-fns';

export default function AdminSubjectManagerPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedExams, setExpandedExams] = useState<string[]>([]);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, any[]>>({});
  const [topicsMap, setTopicsMap] = useState<Record<string, any[]>>({});
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsAddModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    mode: 'add' | 'edit';
    type: 'exam' | 'subject' | 'topic';
    parentId?: string | number;
    id?: string | number;
    title: string;
  } | null>(null);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemSlug, setNewItemSlug] = useState('');
  const [newItemYearRange, setNewItemYearRange] = useState('');
  const [newItemExamDate, setNewItemExamDate] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemIsBattleReady, setNewItemIsBattleReady] = useState(false);
  const [syllabusContent, setSyllabusContent] = useState('');
  const [aiLessonNotes, setAiLessonNotes] = useState('');
  const [textbookUrl, setTextbookUrl] = useState('');
  const [textbookTitle, setTextbookTitle] = useState('');
  const [textbookContent, setTextbookContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textbookInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/admin/exams');
      setExams(res.data);
    } catch (error) {
      toast.error('Failed to load exams');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExamActive = async (examId: number, currentStatus: boolean) => {
    try {
      const res = await api.put(`/admin/exams/${examId}`, { isActive: !currentStatus });
      setExams(prev => prev.map(e => e.id === examId ? { ...e, isActive: res.data.isActive } : e));
      toast.success(`Exam ${!currentStatus ? 'activated' : 'hidden from frontend'}`);
    } catch (error) {
      toast.error('Failed to update exam status');
    }
  };

  const fetchSubjects = async (examId: string | number, examSlug: string) => {
    try {
      const res = await api.get(`/exams/${examSlug}/subjects`);
      const subjects = Array.isArray(res.data)
        ? res.data
        : (res.data?.subjects ?? res.data?.data ?? []);
      setSubjectsMap(prev => ({ ...prev, [examId.toString()]: subjects }));
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  const fetchTopics = async (subjectId: string | number) => {
    try {
      const res = await api.get(`/exams/subjects/${subjectId}/topics`);
      const topics = Array.isArray(res.data) ? res.data : (res.data?.topics ?? res.data?.data ?? []);
      setTopicsMap(prev => ({ ...prev, [subjectId.toString()]: topics }));
    } catch (error) {
      toast.error('Failed to load topics');
    }
  };

  const toggleExam = (exam: any) => {
    const idStr = exam.id.toString();
    if (expandedExams.includes(idStr)) {
      setExpandedExams(prev => prev.filter(id => id !== idStr));
    } else {
      setExpandedExams(prev => [...prev, idStr]);
      if (!subjectsMap[idStr]) {
        fetchSubjects(exam.id, exam.slug);
      }
    }
  };

  const toggleSubject = (subjectId: string | number) => {
    const idStr = subjectId.toString();
    if (expandedSubjects.includes(idStr)) {
      setExpandedSubjects(prev => prev.filter(id => id !== idStr));
    } else {
      setExpandedSubjects(prev => [...prev, idStr]);
      if (!topicsMap[idStr]) {
        fetchTopics(subjectId);
      }
    }
  };

  const handleDelete = async (type: 'exam' | 'subject' | 'topic', id: string | number, parentId?: string | number) => {
    if (!confirm(`Are you sure you want to delete this ${type}? All children will also be affected.`)) return;

    try {
      if (type === 'exam') {
        await api.delete(`/admin/exams/${id}`);
        setExams(prev => prev.filter(e => e.id !== id));
      } else if (type === 'subject') {
        await api.delete(`/admin/subjects/${id}`);
        if (parentId) {
          const pIdStr = parentId.toString();
          setSubjectsMap(prev => ({
            ...prev,
            [pIdStr]: prev[pIdStr].filter(s => s.id !== id)
          }));
          setExams(prev => prev.map(e => e.id.toString() === pIdStr ? { ...e, _count: { ...e._count, subjects: Math.max(0, (e._count?.subjects || 0) - 1) } } : e));
        }
      } else if (type === 'topic') {
        await api.delete(`/admin/topics/${id}`);
        if (parentId) {
          const pIdStr = parentId.toString();
          setTopicsMap(prev => ({
            ...prev,
            [pIdStr]: prev[pIdStr].filter(t => t.id !== id)
          }));
          setSubjectsMap(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(examId => {
              updated[examId] = updated[examId].map(s => 
                s.id.toString() === pIdStr ? { ...s, _count: { ...s._count, topics: Math.max(0, (s._count?.topics || 0) - 1) } } : s
              );
            });
            return updated;
          });
        }
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
    } catch (error) {
      toast.error(`Failed to delete ${type}. It might have existing questions.`);
    }
  };

  const handleSave = async () => {
    if (!newItemName || !modalConfig) return;

    try {
      let res: any;
      if (modalConfig.mode === 'add') {
        if (modalConfig.type === 'exam') {
          res = await api.post('/admin/exams', { 
            name: newItemName, 
            category: newItemCategory || 'General',
            slug: newItemSlug,
            yearRange: newItemYearRange,
            examDate: newItemExamDate,
            isBattleReady: newItemIsBattleReady
          });
          setExams(prev => [...prev, { ...res.data, _count: { subjects: 0 } }]);
        } else if (modalConfig.type === 'subject' && modalConfig.parentId) {
          res = await api.post('/admin/subjects', { 
            examId: modalConfig.parentId, 
            name: newItemName,
            textbookUrl: textbookUrl,
            textbookTitle: textbookTitle,
            textbookContent: textbookContent
          });
          const pIdStr = modalConfig.parentId.toString();
          setSubjectsMap(prev => ({
            ...prev,
            [pIdStr]: [...(prev[pIdStr] || []), { ...res.data, _count: { topics: 0 } }]
          }));
          setExams(prev => prev.map(e => e.id.toString() === pIdStr ? { ...e, _count: { ...e._count, subjects: (e._count?.subjects || 0) + 1 } } : e));
        } else if (modalConfig.type === 'topic' && modalConfig.parentId) {
          res = await api.post('/admin/topics', { 
            subjectId: modalConfig.parentId, 
            name: newItemName,
            syllabusContent: syllabusContent,
            aiLessonNotes: aiLessonNotes
          });
          const pIdStr = modalConfig.parentId.toString();
          setTopicsMap(prev => ({
            ...prev,
            [pIdStr]: [...(prev[pIdStr] || []), res.data]
          }));
          setSubjectsMap(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(examId => {
              updated[examId] = updated[examId].map(s => 
                s.id.toString() === pIdStr ? { ...s, _count: { ...s._count, topics: (s._count?.topics || 0) + 1 } } : s
              );
            });
            return updated;
          });
        }
      } else {
        // Edit mode
        if (modalConfig.type === 'topic' && modalConfig.id) {
          res = await api.put(`/admin/topics/${modalConfig.id}`, { 
            name: newItemName, 
            syllabusContent,
            aiLessonNotes
          });

          if (newItemExamDate && modalConfig.parentId) {
            const examId = Object.keys(subjectsMap).find(eId => 
              subjectsMap[eId].some(s => s.id === modalConfig.parentId)
            );
            if (examId) {
              await api.put(`/admin/exams/${examId}`, { examDate: newItemExamDate });
              setExams(prev => prev.map(e => e.id.toString() === examId ? { ...e, examDate: newItemExamDate } : e));
            }
          }

          const pIdStr = modalConfig.parentId?.toString() || '';
          setTopicsMap(prev => ({
            ...prev,
            [pIdStr]: (prev[pIdStr] || []).map(t => t.id === modalConfig.id ? { ...t, name: newItemName, syllabusContent, aiLessonNotes } : t)
          }));
        } else if (modalConfig.type === 'subject' && modalConfig.id) {
          await api.put(`/admin/subjects/${modalConfig.id}`, { 
            name: newItemName,
            textbookUrl,
            textbookTitle,
            textbookContent
          });
          const pIdStr = modalConfig.parentId?.toString() || '';
          setSubjectsMap(prev => ({
            ...prev,
            [pIdStr]: (prev[pIdStr] || []).map(s => s.id === modalConfig.id ? { ...s, name: newItemName, textbookUrl, textbookTitle, textbookContent } : s)
          }));
        } else if (modalConfig.type === 'exam' && modalConfig.id) {
          await api.put(`/admin/exams/${modalConfig.id}`, { 
            name: newItemName,
            category: newItemCategory,
            slug: newItemSlug,
            yearRange: newItemYearRange,
            examDate: newItemExamDate,
            isBattleReady: newItemIsBattleReady
          });
          setExams(prev => prev.map(e => e.id === modalConfig.id ? { 
            ...e, 
            name: newItemName,
            category: newItemCategory,
            slug: newItemSlug,
            yearRange: newItemYearRange,
            examDate: newItemExamDate,
            isBattleReady: newItemIsBattleReady
          } : e));
        }
      }
      
      toast.success(`${modalConfig.type} saved successfully`);
      setIsAddModalOpen(false);
      setNewItemName('');
      setNewItemSlug('');
      setNewItemYearRange('');
      setNewItemCategory('');
      setNewItemIsBattleReady(false);
      setSyllabusContent('');
      setAiLessonNotes('');
      setTextbookUrl('');
      setTextbookTitle('');
      setTextbookContent('');
    } catch (error) {
      toast.error(`Failed to save ${modalConfig.type}`);
    }
  };

  const handleTextbookUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/admin/subjects/upload-textbook', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTextbookUrl(res.data.url);
      if (!textbookTitle) {
        setTextbookTitle(file.name.replace('.pdf', ''));
      }
      toast.success('Textbook uploaded successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload textbook');
    } finally {
      setIsUploading(false);
      if (textbookInputRef.current) textbookInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000/api'}/exams/syllabus/template`, '_blank');
  };

  const handleImportSyllabus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/admin/syllabus/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.errors && res.data.errors.length > 0) {
        toast.error(`${res.data.message}. Check console for details.`, { duration: 5000 });
        console.error('Import Errors:', res.data.errors);
      } else {
        toast.success(res.data.message || 'Syllabus imported successfully!');
      }
      
      fetchExams();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to import syllabus.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openAddModal = (type: 'exam' | 'subject' | 'topic', parentId?: string | number) => {
    setModalConfig({
      mode: 'add',
      type,
      parentId,
      title: `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`
    });
    setNewItemName('');
    setNewItemSlug('');
    setNewItemYearRange('');
    setNewItemExamDate('');
    setNewItemCategory('');
    setNewItemIsBattleReady(false);
    setSyllabusContent('');
    setAiLessonNotes('');
    setTextbookUrl('');
    setTextbookTitle('');
    setTextbookContent('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (type: 'exam' | 'subject' | 'topic', item: any, parentId?: string | number) => {
    setModalConfig({
      mode: 'edit',
      type,
      id: item.id,
      parentId,
      title: `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
    });
    setNewItemName(item.name);
    setNewItemSlug(item.slug || '');
    setNewItemYearRange(item.yearRange || '');
    setTextbookUrl(item.textbookUrl || '');
    setTextbookTitle(item.textbookTitle || '');
    setTextbookContent(item.textbookContent || '');
    
    let dateStr = '';
    if (type === 'exam' && item.examDate) {
      dateStr = format(new Date(item.examDate), 'yyyy-MM-dd');
    } else if (type === 'topic' && parentId) {
      const examId = Object.keys(subjectsMap).find(eId => 
        subjectsMap[eId].some(s => s.id === parentId)
      );
      if (examId) {
        const parentExam = exams.find(e => e.id.toString() === examId);
        if (parentExam?.examDate) {
          dateStr = format(new Date(parentExam.examDate), 'yyyy-MM-dd');
        }
      }
    }
    setNewItemExamDate(dateStr);
    setNewItemCategory(item.category || '');
    setNewItemIsBattleReady(item.isBattleReady || false);
    setSyllabusContent(item.syllabusContent || '');
    setAiLessonNotes(item.aiLessonNotes || '');
    setIsAddModalOpen(true);
  };

  return (
    <>
      <AdminHeader title="Subject & Topic Manager" />

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white/[0.02] rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col min-h-[600px] group hover:border-white/10 transition-all">
            <div className="p-6 border-b border-white/[0.05] border-t-white/[0.1] bg-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Filter structure..."
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white placeholder:text-gray-600 outline-none focus:border-green/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-green" />
                  <p className="text-gray-500 text-sm">Loading structure...</p>
                </div>
              ) : exams.map((exam) => (
                <div key={exam.id} className={`space-y-1 ${!exam.isActive ? 'opacity-50' : ''}`}>
                  <div className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group/row">
                    <button 
                      onClick={() => toggleExam(exam)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      {expandedExams.includes(exam.id.toString()) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                      <Folder className="w-5 h-5 text-blue-400 fill-current opacity-20" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white uppercase tracking-tight">{exam.name}</span>
                        <span title="Number of Subjects in this Exam" className="w-5 h-5 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-[10px] font-bold text-gray-500 cursor-help">
                          {exam.Subjects?.length ?? exam.subjects?.length ?? exam._count?.subjects ?? 0}
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleExamActive(exam.id, exam.isActive)} 
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${exam.isActive ? 'text-green' : 'text-gray-600'}`}
                      >
                        {exam.isActive ? <Eye className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEditModal('exam', exam)} title="Edit Exam Name" className="p-1 hover:text-green">
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => openAddModal('subject', exam.id)} title="Add Subject">
                        <Plus className="w-4 h-4 text-green" />
                      </button>
                      <button onClick={() => handleDelete('exam', exam.id)} title="Delete Exam">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {expandedExams.includes(exam.id.toString()) && (
                    <div className="ml-6 space-y-1 border-l border-white/5 pl-4 animate-in slide-in-from-left-2">
                      {subjectsMap[exam.id.toString()]?.map((sub) => (
                        <div key={sub.id} className="space-y-1">
                          <div className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group/sub">
                            <button 
                              onClick={() => toggleSubject(sub.id)}
                              className="flex items-center gap-3 flex-1 text-left"
                            >
                              {expandedSubjects.includes(sub.id.toString()) ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                              <BookOpen className="w-4 h-4 text-green" />
                              <div className="flex flex-col items-start leading-none">
                                <span className="text-sm font-bold text-gray-300">{sub.name}</span>
                                <span className="text-[9px] font-mono text-gray-600 mt-1 uppercase tracking-tighter">{sub.id}</span>
                              </div>
                            </button>
                            <div className="flex items-center gap-2 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                              <button onClick={() => openEditModal('subject', sub, exam.id)} title="Edit Subject Name" className="p-1 hover:text-green">
                                <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              <button onClick={() => openAddModal('topic', sub.id)} title="Add Topic">
                                <Plus className="w-3.5 h-3.5 text-green" />
                              </button>
                              <button onClick={() => handleDelete('subject', sub.id, exam.id)} title="Delete Subject">
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </div>
                          </div>

                          {expandedSubjects.includes(sub.id.toString()) && (
                            <div className="ml-6 space-y-1 border-l border-white/5 pl-4 animate-in slide-in-from-left-2">
                              {topicsMap[sub.id.toString()]?.map((topic) => (
                                <div key={topic.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group/topic">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${topic.syllabusContent ? 'bg-green shadow-[0_0_5px_rgba(0,200,83,0.5)]' : 'bg-white/10'}`} />
                                    <div className="flex flex-col items-start leading-none">
                                      <span className="text-xs font-medium text-gray-500 group-hover/topic:text-white transition-colors">{topic.name}</span>
                                      <span className="text-[8px] font-mono text-gray-700 mt-0.5 uppercase tracking-tighter">{topic.id}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover/topic:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal('topic', topic, sub.id)} className="p-1 hover:text-green">
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete('topic', topic.id, sub.id)} className="p-1 hover:text-red-500">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {topicsMap[sub.id]?.length === 0 && (
                                <p className="text-[10px] text-gray-600 italic p-3">No topics yet</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">Hierarchy Overview</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Manage your syllabus content. Topics with a <span className="text-green font-bold">green dot</span> have syllabus notes for the Study Assistant.
              </p>
            </div>
            
            <Button 
              onClick={() => openAddModal('exam')}
              className="w-full rounded-2xl bg-green text-navy hover:bg-green/90 font-bold py-6 shadow-lg shadow-green/10"
            >
              <Plus className="w-5 h-5 mr-2" /> Add New Exam
            </Button>

            <div className="pt-4 border-t border-white/5 space-y-3 relative">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-2">Bulk Management</p>
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleDownloadTemplate}
                className="w-full rounded-2xl bg-white/5 border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 font-bold py-6"
              >
                <Download className="w-5 h-5 mr-2" /> Download Template
              </Button>

              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImportSyllabus} 
                  accept=".csv" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  title="Click to import syllabus CSV"
                />
                <Button 
                  type="button"
                  disabled={isImporting}
                  className="w-full rounded-2xl bg-blue/10 border border-blue/20 text-blue hover:bg-blue hover:text-white font-bold py-6 disabled:opacity-50"
                >
                  {isImporting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <FileUp className="w-5 h-5 mr-2" />
                  )}
                  Import Syllabus CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsAddModalOpen(false)} title={modalConfig?.title || 'Manage Item'}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 capitalize">{modalConfig?.type} Name</label>
            <input 
              type="text" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
            />
          </div>

          {modalConfig?.type === 'exam' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 capitalize">Exam Category</label>
                <input 
                  type="text" 
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  placeholder="e.g. Nigerian Exams"
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 capitalize">Exam Slug</label>
                <input 
                  type="text" 
                  value={newItemSlug}
                  onChange={(e) => setNewItemSlug(e.target.value)}
                  placeholder="e.g. jamb-utme"
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 capitalize">Year Range</label>
                <input 
                  type="text" 
                  value={newItemYearRange}
                  onChange={(e) => setNewItemYearRange(e.target.value)}
                  placeholder="e.g. 2000 - 2024"
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 capitalize">Exam Date</label>
                <input 
                  type="date" 
                  value={newItemExamDate}
                  onChange={(e) => setNewItemExamDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white uppercase tracking-tight">Battle Mode Ready</div>
                  <div className="text-[10px] text-gray-500">List this exam in BattleMode and LiveGames</div>
                </div>
                <Switch 
                  checked={newItemIsBattleReady} 
                  onCheckedChange={setNewItemIsBattleReady}
                />
              </div>
            </>
          )}

          {modalConfig?.type === 'subject' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Textbook Title</label>
                <input 
                  type="text" 
                  value={textbookTitle}
                  onChange={(e) => setTextbookTitle(e.target.value)}
                  placeholder="e.g. Essential Mathematics for SS3"
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">Recommended Textbook (PDF)</label>
                <input 
                  type="file" 
                  ref={textbookInputRef}
                  onChange={handleTextbookUpload}
                  accept=".pdf"
                  className="hidden"
                />
                
                {textbookUrl ? (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-blue shrink-0" />
                      <span className="text-xs text-gray-300 truncate font-mono">
                        {textbookUrl.split('/').pop()?.split('_').slice(1).join('_')}
                      </span>
                    </div>
                    <button 
                      onClick={() => setTextbookUrl('')}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => textbookInputRef.current?.click()}
                    disabled={isUploading}
                    variant="outline"
                    className="w-full py-6 rounded-xl border-dashed border-white/10 text-gray-500 hover:text-white hover:border-blue/50"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {isUploading ? 'Uploading PDF...' : 'Upload PDF Textbook'}
                  </Button>
                )}
                <p className="text-[10px] text-gray-600 italic">This PDF will be available to students in the syllabus viewer.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-2">
                  <Type className="w-3.5 h-3.5" />
                  Textbook Content (Reader Mode)
                </label>
                <textarea 
                  value={textbookContent}
                  onChange={(e) => setTextbookContent(e.target.value)}
                  placeholder="Enter the textbook text content here... HTML is supported for formatting."
                  className="w-full h-64 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl p-4 text-sm text-white focus:border-green/50 outline-none resize-none no-scrollbar"
                />
                <p className="text-[9px] text-gray-600 italic">This content will be shown when users switch to 'Reader Mode' in the viewer. Supports basic HTML tags.</p>
              </div>
            </div>
          )}

          {modalConfig?.type === 'topic' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Parent Exam Date (Updates all topics in this exam)</label>
                <input 
                  type="date" 
                  value={newItemExamDate}
                  onChange={(e) => setNewItemExamDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Syllabus Content (Study Assistant Context)
                </label>
                <textarea 
                  value={syllabusContent}
                  onChange={(e) => setSyllabusContent(e.target.value)}
                  placeholder="Enter official syllabus guidelines, definitions, or study notes for this topic..."
                  className="w-full h-32 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl p-4 text-sm text-white focus:border-green/50 outline-none resize-none no-scrollbar"
                />
                <p className="text-[9px] text-gray-600 italic">This content is used by the AI Study Assistant to provide accurate, exam-aligned tutoring.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  AI Lesson Notes (Structured Study Content)
                </label>
                <textarea 
                  value={aiLessonNotes}
                  onChange={(e) => setAiLessonNotes(e.target.value)}
                  placeholder="Enter or generate structured lesson notes for this topic..."
                  className="w-full h-48 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl p-4 text-sm text-white focus:border-green/50 outline-none resize-none no-scrollbar"
                />
                <p className="text-[9px] text-gray-600 italic">Structured notes used for deep-dive learning and lesson summaries.</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSave}
            className="w-full bg-green text-navy font-bold py-4 rounded-xl shadow-lg shadow-green/20"
          >
            {modalConfig?.mode === 'add' ? 'Create' : 'Update'} {modalConfig?.type}
          </Button>
        </div>
      </Modal>
    </>
  );
}
