"use client";

import { IconPlus as Plus, IconTrash as Trash2, IconCircleCheck as CheckCircle2, IconHelpCircle as HelpCircle, IconSparkles as Sparkles, IconLoader2 as Loader2, IconEye as Eye, IconUpload as Upload, IconX as X, IconPhoto as ImageIcon } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import api from '@/lib/api-legacy';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { InlineMath } from 'react-katex';

interface QuestionFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuestionForm({ initialData, onSuccess, onCancel }: QuestionFormProps) {
  const [isAssisting, setIsAssisting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [type, setType] = useState(initialData?.type || 'mcq');
  const [bodyText, setBodyText] = useState(initialData?.bodyText || '');
  const [bodyImageUrl, setBodyImageUrl] = useState(initialData?.bodyImageUrl || '');
  const [explanation, setExplanation] = useState(initialData?.explanationStandard || '');
  const [options, setOptions] = useState(
    initialData?.options?.map((opt: any, i: number) => ({
      id: i + 1,
      dbId: opt.id,
      text: opt.optionText,
      isCorrect: opt.isCorrect
    })) || [
      { id: 1, dbId: '', text: '', isCorrect: true },
      { id: 2, dbId: '', text: '', isCorrect: false },
      { id: 3, dbId: '', text: '', isCorrect: false },
      { id: 4, dbId: '', text: '', isCorrect: false },
    ]
  );

  const [metadata, setMetadata] = useState({
    examId: initialData?.topic?.subject?.examId?.toString() || '',
    subjectId: initialData?.topic?.subjectId?.toString() || '',
    topicId: initialData?.topicId?.toString() || '',
    difficulty: initialData?.difficulty || 'medium',
    year: initialData?.year || '',
    coinReward: initialData?.coinReward || 5
  });

  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const initExamId = initialData?.topic?.subject?.examId?.toString() || initialData?.examId?.toString() || '';
    const initSubjectId = initialData?.topic?.subjectId?.toString() || initialData?.subjectId?.toString() || '';
    fetchInitialData(initExamId, initSubjectId);
  }, []);

  const findExamSlug = (examId: string | number, examCategories: any[]): string => {
    for (const cat of examCategories) {
      const found = cat.exams?.find((e: any) => e.dbId?.toString() === examId.toString() || e.id.toString() === examId.toString());
      if (found?.id) return found.id;
    }
    return examId.toString();
  };

  const fetchInitialData = async (examId?: string, subjectId?: string) => {
    try {
      const res = await api.get(`/exams?_t=${Date.now()}`);
      const examCategories = res.data;
      setExams(examCategories);
      
      const targetExamId = examId || metadata.examId;
      if (targetExamId) {
        const slug = findExamSlug(targetExamId, examCategories);
        try {
          const subRes = await api.get(`/exams/${slug}/subjects`);
          setSubjects(Array.isArray(subRes.data) ? subRes.data : (subRes.data?.subjects ?? []));
        } catch (subErr) {
          console.error("Failed to load subjects for exam:", slug, subErr);
        }
      }
      
      const targetSubjectId = subjectId || metadata.subjectId;
      if (targetSubjectId) {
        try {
          const topRes = await api.get(`/exams/subjects/${targetSubjectId}/topics`);
          setTopics(Array.isArray(topRes.data) ? topRes.data : (topRes.data?.topics ?? topRes.data?.data ?? []));
        } catch (topErr) {
          console.error("Failed to load topics for subject:", targetSubjectId, topErr);
        }
      }
    } catch (error) {
      console.error("Failed to load initial metadata:", error);
      toast.error('Failed to load initial metadata');
    }
  };

  const handleExamChange = async (examId: string | number) => {
    setMetadata(prev => ({ ...prev, examId, subjectId: '', topicId: '' }));
    setSubjects([]);
    setTopics([]);
    if (!examId) return;
    
    try {
      const slug = findExamSlug(examId, exams);
      const res = await api.get(`/exams/${slug}/subjects`);
      setSubjects(Array.isArray(res.data) ? res.data : (res.data?.subjects ?? []));
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  const handleSubjectChange = async (subjectId: string | number) => {
    setMetadata(prev => ({ ...prev, subjectId, topicId: '' }));
    setTopics([]);
    if (!subjectId) return;
    
    try {
      const res = await api.get(`/exams/subjects/${subjectId}/topics`);
      setTopics(Array.isArray(res.data) ? res.data : (res.data?.topics ?? res.data?.data ?? []));
    } catch (error) {
      toast.error('Failed to load topics');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setIsUploading(true);
      const res = await api.post("/admin/upload-image?folder=questions", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setBodyImageUrl(res.data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newItemName || !metadata.examId) return;
    try {
      const res = await api.post('/admin/subjects', {
        examId: metadata.examId,
        name: newItemName,
        coinUnlockCost: 0
      });
      const newSubject = res.data;
      setSubjects(prev => [...prev, newSubject]);
      setMetadata(prev => ({ ...prev, subjectId: newSubject.id }));
      handleSubjectChange(newSubject.id);
      setIsAddSubjectOpen(false);
      setNewItemName('');
      toast.success('Subject added');
    } catch (error) {
      toast.error('Failed to add subject');
    }
  };

  const handleAddTopic = async () => {
    if (!newItemName || !metadata.subjectId) return;
    try {
      const res = await api.post('/admin/topics', {
        subjectId: metadata.subjectId,
        name: newItemName
      });
      const newTopic = res.data;
      setTopics(prev => [...prev, newTopic]);
      setMetadata(prev => ({ ...prev, topicId: newTopic.id }));
      setIsAddTopicOpen(false);
      setNewItemName('');
      toast.success('Topic added');
    } catch (error) {
      toast.error('Failed to add topic');
    }
  };

  const handleAIAssist = async () => {
    if (!bodyText) return toast.error('Enter a draft question first');
    setIsAssisting(true);
    try {
      const res = await api.post('/admin/questions/assist-create', { draftText: bodyText });
      const { bodyText: refinedBody, options: refinedOptions, explanation: refinedExplanation, correctAnswerIndex } = res.data;
      
      setBodyText(refinedBody);
      setExplanation(refinedExplanation);
      
      const newOptions = refinedOptions.map((opt: any, i: number) => {
        const isCorrect = (opt.isCorrect === true || opt.isCorrect === "true") || (correctAnswerIndex === i);
        return {
          id: i + 1,
          text: opt.text,
          isCorrect: isCorrect
        };
      });

      if (!newOptions.some((o: any) => o.isCorrect)) {
        newOptions[0].isCorrect = true;
      }
      
      setOptions(newOptions);
      toast.success('AI has refined your question!');
    } catch (error) {
      toast.error('AI Assist failed');
    } finally {
      setIsAssisting(false);
    }
  };

  const handleSave = async () => {
    if (!metadata.topicId) {
      toast.error('Please select a topic');
      return;
    }
    if (!bodyText || !bodyText.trim()) {
      toast.error('Question body is required');
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        topicId: parseInt(metadata.topicId) || 0,
        difficulty: metadata.difficulty,
        year: metadata.year ? parseInt(metadata.year.toString()) || 0 : 0,
        coinReward: metadata.coinReward ? parseInt(metadata.coinReward.toString()) || 0 : 0,
        bodyText,
        bodyImageUrl: bodyImageUrl || null,
        type: type,
        explanationStandard: explanation,
        options: type === 'mcq' ? options.map((opt: any, index: number) => ({
          id: opt.dbId || "", // Include ID if available, else empty
          optionText: opt.text,
          isCorrect: opt.isCorrect,
          orderIndex: index
        })) : [],
        status: 'published'
      };

      if (initialData?.id) {
        await api.put(`/admin/questions/${initialData.id}`, payload);
        toast.success('Question updated successfully');
      } else {
        await api.post('/admin/questions', payload);
        toast.success('Question created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(initialData?.id ? 'Failed to update question' : 'Failed to create question');
    } finally {
      setIsSaving(false);
    }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Question Type Selection */}
          <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest text-[10px] mb-4">Question Type</h3>
            <div className="flex gap-4">
              {['mcq', 'theory'].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-4 rounded-2xl border font-bold text-sm transition-all ${
                    type === t 
                    ? 'bg-green/10 border-green/30 text-green shadow-[0_0_20px_rgba(0,200,83,0.1)]' 
                    : 'bg-white/5 border-white/[0.1] text-gray-500 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">Question Body</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white cursor-pointer transition-colors">
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {bodyImageUrl ? 'Change Image' : 'Add Image'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
                <button 
                  onClick={handleAIAssist}
                  disabled={isAssisting}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline disabled:opacity-50"
                >
                  {isAssisting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  AI Assist
                </button>
              </div>
            </div>

            {bodyImageUrl && (
              <div className="relative group aspect-video max-h-48 rounded-xl overflow-hidden border border-white/[0.1] border-t-white/[0.15] bg-white/5">
                 <img src={bodyImageUrl} alt="Question" className="w-full h-full object-contain" />
                 <button 
                   onClick={() => setBodyImageUrl('')}
                   className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <X className="w-4 h-4" />
                 </button>
              </div>
            )}

            <textarea 
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Type your question draft here... (Use \( math \) for LaTeX)"
              className="w-full min-h-[160px] p-6 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors text-sm font-medium leading-relaxed resize-none"
            />
          </div>

          {/* Options */}
          {type === 'mcq' && (
            <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">Answer Options</h3>
              <div className="space-y-4">
                {options.map((opt: any, i: number) => (
                  <div key={opt.id} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black shrink-0 ${opt.isCorrect ? 'bg-green text-navy' : 'bg-white/5 text-gray-500'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...options];
                          newOpts[i].text = e.target.value;
                          setOptions(newOpts);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className={`w-full h-12 px-4 rounded-xl bg-white/5 border ${opt.isCorrect ? 'border-green/30' : 'border-white/[0.1] border-t-white/[0.15]'} text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors text-sm font-medium`}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newOpts = options.map((o: any) => ({ ...o, isCorrect: o.id === opt.id }));
                        setOptions(newOpts);
                      }}
                      className={`p-3 rounded-xl transition-all ${opt.isCorrect ? 'text-green bg-green/10' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">
              {type === 'mcq' ? 'Step-by-Step Explanation' : 'Correct Answer / Detailed Solution'}
            </h3>
            <textarea 
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={type === 'mcq' ? "Explain how to arrive at the correct answer..." : "Provide the complete solution for this theory question..."}
              className="w-full min-h-[120px] p-6 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors text-sm font-medium leading-relaxed resize-none"
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Metadata */}
          <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-500" />
              Metadata
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Exam</label>
                <select 
                  value={metadata.examId}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green/50"
                  onChange={(e) => handleExamChange(e.target.value)}
                >
                  <option value="" className="bg-navy">Select Exam</option>
                  {exams.map((category: any, idx: number) => (
                    <optgroup key={`cat-${idx}`} label={category.name} className="text-gray-400 font-normal">
                      {category.exams?.map((e: any) => (
                        <option key={e.dbId || e.id} value={e.dbId || e.id} className="bg-navy text-white font-bold">{e.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                  {metadata.examId && (
                    <button 
                      onClick={() => setIsAddSubjectOpen(true)}
                      className="text-[10px] font-bold text-green hover:underline"
                    >
                      + Add New
                    </button>
                  )}
                </div>
                <select 
                  value={metadata.subjectId}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green/50"
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={!metadata.examId}
                >
                  <option value="" className="bg-navy">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id} className="bg-navy">{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Topic</label>
                  {metadata.subjectId && (
                    <button 
                      onClick={() => setIsAddTopicOpen(true)}
                      className="text-[10px] font-bold text-green hover:underline"
                    >
                      + Add New
                    </button>
                  )}
                </div>
                <select 
                  value={metadata.topicId}
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green/50"
                  onChange={(e) => setMetadata(prev => ({ ...prev, topicId: e.target.value }))}
                  disabled={!metadata.subjectId}
                >
                  <option value="" className="bg-navy">Select Topic</option>
                  {topics.map(t => <option key={t.id} value={t.id} className="bg-navy">{t.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Year</label>
                <input 
                  type="number"
                  value={metadata.year}
                  onChange={(e) => setMetadata(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g. 2024"
                  className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Difficulty</label>
                <div className="flex gap-2">
                  {['easy', 'medium', 'hard'].map(d => (
                    <button 
                      key={d} 
                      onClick={() => setMetadata({ ...metadata, difficulty: d })}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${metadata.difficulty === d ? 'bg-amber text-navy' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => setIsPreviewOpen(true)}
              variant="outline" 
              className="w-full rounded-xl border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white font-bold text-xs gap-2 hover:bg-white/10 h-12"
            >
              <Eye className="w-4 h-4" /> Preview Question
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onCancel}
                variant="outline"
                className="rounded-xl border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white font-bold text-xs h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl bg-green text-navy hover:bg-green/90 font-bold text-xs gap-2 h-12"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {initialData?.id ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Question Preview">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 no-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-green/10 text-green text-[10px] font-black uppercase tracking-widest border border-green/20">
                {metadata.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue/10 text-blue text-[10px] font-black uppercase tracking-widest border border-blue/20">
                {subjects.find((s: any) => s.id === metadata.subjectId)?.name || 'Subject'}
              </span>
            </div>
            <div className="text-lg font-bold text-white leading-relaxed whitespace-pre-wrap">
              {bodyImageUrl && (
                <img src={bodyImageUrl} alt="Question" className="max-w-full rounded-xl mb-4 border border-white/10 mx-auto block" />
              )}
              {renderWithMath(bodyText) || <span className="text-gray-600">No question body entered...</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {type === 'mcq' && options.map((opt: any, idx: number) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border flex items-center gap-4 ${opt.isCorrect ? 'bg-green/10 border-green/30 text-green' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15] text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${opt.isCorrect ? 'bg-green text-navy' : 'bg-white/10 text-gray-500'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="text-sm font-medium">
                  {renderWithMath(opt.text) || <span className="text-gray-600 italic">Empty option</span>}
                </div>
                {opt.isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto" />}
              </div>
            ))}
          </div>

          {explanation && (
            <div className="space-y-3 p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> {type === 'mcq' ? 'Step-by-Step Explanation' : 'Detailed Solution'}
              </h4>
              <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                {renderWithMath(explanation)}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Subject Modal */}
      <Modal isOpen={isAddSubjectOpen} onClose={() => setIsAddSubjectOpen(false)} title="Add New Subject">
        <div className="space-y-4 text-white">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">Subject Name</label>
            <input 
              type="text" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
              placeholder="e.g. Physics"
            />
          </div>
          <Button onClick={handleAddSubject} className="w-full bg-green text-navy font-bold rounded-xl">Add Subject</Button>
        </div>
      </Modal>

      {/* Add Topic Modal */}
      <Modal isOpen={isAddTopicOpen} onClose={() => setIsAddTopicOpen(false)} title="Add New Topic">
        <div className="space-y-4 text-white">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">Topic Name</label>
            <input 
              type="text" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl px-4 py-3 text-white focus:border-green/50 outline-none"
              placeholder="e.g. Newton's Laws"
            />
          </div>
          <Button onClick={handleAddTopic} className="w-full bg-green text-navy font-bold rounded-xl">Add Topic</Button>
        </div>
      </Modal>
    </div>
  );
}
