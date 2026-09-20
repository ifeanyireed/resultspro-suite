import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { coursesApi } from '@/lib/api';

type Question = {
  question: string;
  question_type: 'MCQ' | 'THEORY';
  options: string[];
  correct_index: number;
  explanation: string;
  reference?: string;
};

export const QuizBuilderModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  moduleId, 
  moduleTextContext,
  existingQuizId
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (quizId: string) => void;
  moduleId: string;
  moduleTextContext: string;
  existingQuizId?: string;
}) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const [aiContext, setAiContext] = useState(moduleTextContext);
  const [aiType, setAiType] = useState('MCQ');
  const [aiNumQuestions, setAiNumQuestions] = useState(3);
  const [aiNumOptions, setAiNumOptions] = useState(4);

  useEffect(() => {
    setAiContext(moduleTextContext);
  }, [moduleTextContext]);

  useEffect(() => {
    if (isOpen) {
      if (existingQuizId) {
        coursesApi.get(`/api/admin/quizzes/${existingQuizId}`).then(res => {
          const q = res.data.quiz || res.data;
          const questionsList = res.data.questions || q.questions || [];
          if (q) {
            setTitle(q.title || '');
            let rawQuestions = questionsList;
            if ((!rawQuestions || rawQuestions.length === 0) && q.questions_json) {
              try { rawQuestions = typeof q.questions_json === 'string' ? JSON.parse(q.questions_json) : q.questions_json; } catch(e) {}
            }
            const parsedQuestions = (rawQuestions || []).map((dbQ: any) => {
              let opts = dbQ.options;
              if (!opts && dbQ.options_json) {
                try { opts = JSON.parse(dbQ.options_json); } catch(e) { opts = []; }
              }
              return {
                question: dbQ.question || '',
                question_type: dbQ.question_type || 'MCQ',
                options: opts || ['', '', '', ''],
                correct_index: dbQ.correct_index || 0,
                explanation: dbQ.explanation || '',
                reference: dbQ.reference || ''
              };
            });
            setQuestions(parsedQuestions);
          }
        });
      } else {
        setTitle('');
        setQuestions([]);
      }
    }
  }, [isOpen, existingQuizId]);

  const handleGenerateAI = async () => {
    if (!aiContext.trim()) {
      alert("Please provide some text context for the AI.");
      return;
    }
    setLoadingAI(true);
    try {
      const res = await coursesApi.post('/api/admin/ai/generate-quiz-preview', { 
        content: aiContext,
        question_type: aiType,
        num_questions: aiNumQuestions,
        num_options: aiNumOptions
      });
      if (res.data.quiz) {
        setQuestions(res.data.quiz.map((q: any) => ({
          question: q.question,
          question_type: q.question_type || aiType || 'MCQ',
          options: q.options || [],
          correct_index: q.correct_index || 0,
          explanation: q.explanation || '',
          reference: q.reference || ''
        })));
        if (!title) setTitle("AI Generated Quiz");
        setAiConfigOpen(false);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate quiz. Make sure GEMINI_API_KEY is configured.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Please enter a quiz title");
    if (questions.length === 0) return alert("Please add at least one question");
    
    setSaving(true);
    try {
      let res;
      const payload = {
        title,
        module_id: moduleId,
        generated_by_ai: true,
        questions_json: JSON.stringify(questions.map(q => ({
          question: q.question,
          question_type: q.question_type || 'MCQ',
          options: q.options,
          options_json: JSON.stringify(q.options),
          correct_index: q.correct_index,
          explanation: q.explanation,
          reference: q.reference || '',
          bloom_level: 'REMEMBERING'
        }))),
        questions: questions.map(q => ({
          question: q.question,
          question_type: q.question_type || 'MCQ',
          options: q.options,
          options_json: JSON.stringify(q.options),
          correct_index: q.correct_index,
          explanation: q.explanation,
          reference: q.reference || '',
          bloom_level: 'REMEMBERING'
        }))
      };
      
      // The backend does not support PUT (it returns 404), so we always POST to create 
      // a new updated version of the quiz and replace the ID on the module item.
      res = await coursesApi.post('/api/admin/quizzes', payload);
      
      if (res && res.data && res.data.quiz) {
        onSave(res.data.quiz.id);
        onClose();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', question_type: 'MCQ', options: ['', '', '', ''], correct_index: 0, explanation: '', reference: '' }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, updates: Partial<Question>) => {
    const newQ = [...questions];
    newQ[idx] = { ...newQ[idx], ...updates };
    setQuestions(newQ);
  };

  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    const newQ = [...questions];
    const newOptions = [...newQ[qIdx].options];
    newOptions[oIdx] = val;
    newQ[qIdx].options = newOptions;
    setQuestions(newQ);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">Quiz Builder</h3>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2">
              {saving ? 'Saving...' : 'Save & Attach Quiz'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Title</label>
              <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Intro to Variables Knowledge Check" />
            </div>
            
            {aiConfigOpen && (
              <div className="mt-2 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-indigo-900 mb-1">Source Text Context</label>
                  <textarea className="w-full border border-indigo-200 rounded-md p-2 text-sm h-24" value={aiContext} onChange={e => setAiContext(e.target.value)} placeholder="Paste the text you want the AI to read..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Question Type</label>
                    <select className="w-full border border-indigo-200 rounded-md p-2 text-sm bg-white" value={aiType} onChange={e => setAiType(e.target.value)}>
                      <option value="MCQ">Multiple Choice</option>
                      <option value="THEORY">Theory (Open-Ended)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Questions</label>
                    <input type="number" min="1" max="20" className="w-full border border-indigo-200 rounded-md p-2 text-sm" value={aiNumQuestions} onChange={e => setAiNumQuestions(Number(e.target.value))} />
                  </div>
                  {aiType === 'MCQ' && (
                    <div>
                      <label className="block text-xs font-semibold text-indigo-900 mb-1">Options per Question</label>
                      <input type="number" min="2" max="5" className="w-full border border-indigo-200 rounded-md p-2 text-sm" value={aiNumOptions} onChange={e => setAiNumOptions(Number(e.target.value))} />
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-2">
                  <button onClick={handleGenerateAI} disabled={loadingAI} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                    <SparklesIcon className="w-4 h-4" />
                    {loadingAI ? 'Generating...' : 'Generate Now'}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button onClick={() => setAiConfigOpen(!aiConfigOpen)} disabled={loadingAI} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <SparklesIcon className="w-4 h-4" />
                {loadingAI ? 'Generating with Gemini...' : 'Generate with AI'}
              </button>
              <button onClick={addQuestion} className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <PlusIcon className="w-4 h-4" />
                Add Question Manually
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                <button onClick={() => removeQuestion(qIdx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrashIcon className="w-5 h-5" />
                </button>
                <div className="mb-4 pr-8 flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Question {qIdx + 1}</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" value={q.question} onChange={e => updateQuestion(qIdx, { question: e.target.value })} placeholder="What is...?" />
                  </div>
                  <div className="w-48">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select className="w-full border border-slate-300 rounded-md p-2 text-sm bg-white" value={q.question_type || 'MCQ'} onChange={e => updateQuestion(qIdx, { question_type: e.target.value as 'MCQ' | 'THEORY' })}>
                      <option value="MCQ">Multiple Choice</option>
                      <option value="THEORY">Theory (Open-Ended)</option>
                    </select>
                  </div>
                </div>
                
                {q.question_type !== 'THEORY' && (
                  <div className="space-y-2 mb-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700">Options (Select the correct one)</label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-3">
                        <input type="radio" name={"correct_" + qIdx} checked={q.correct_index === oIdx} onChange={() => updateQuestion(qIdx, { correct_index: oIdx })} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                        <input type="text" className="flex-1 border border-slate-300 rounded-md p-2 text-sm bg-white" value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)} placeholder={"Option " + (oIdx + 1)} />
                      </div>
                    ))}
                  </div>
                )}
                
                {q.question_type !== 'THEORY' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Explanation (Optional)</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-600" value={q.explanation} onChange={e => updateQuestion(qIdx, { explanation: e.target.value })} placeholder="Why is this correct?" />
                  </div>
                )}
                
                <div className={q.question_type === 'THEORY' ? "" : "mt-4"}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {q.question_type === 'THEORY' ? 'Sample Answer / Rubric (Reference)' : 'Reference (Optional)'}
                  </label>
                  {q.question_type === 'THEORY' ? (
                     <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-600 h-24" value={q.reference || ''} onChange={e => updateQuestion(qIdx, { reference: e.target.value })} placeholder="Provide the sample answer, rubric, or key points expected from the student..." />
                  ) : (
                     <input type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-600" value={q.reference || ''} onChange={e => updateQuestion(qIdx, { reference: e.target.value })} placeholder="e.g. Chapter 3, Page 42" />
                  )}
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                No questions yet. Generate with AI or add manually.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
