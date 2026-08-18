"use client";

import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import QuestionForm from '@/components/admin/QuestionForm';

function AdminQuestionEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = searchParams.get("id");
  
  const [isLoading, setIsLoading] = useState(true);
  const [questionData, setQuestionData] = useState<any>(null);

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetails();
    } else {
      setIsLoading(false);
    }
  }, [questionId]);

  const fetchQuestionDetails = async () => {
    try {
      // Try direct ID endpoint first
      const qRes = await api.get(`/admin/questions/${questionId}`);
      setQuestionData(qRes.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Fallback to query parameter if direct route fails (compatibility)
        try {
          const fallbackRes = await api.get(`/admin/questions?id=${questionId}`);
          if (fallbackRes.data.questions?.length > 0) {
            setQuestionData(fallbackRes.data.questions[0]);
          } else {
            toast.error('Question not found');
            router.push('/admin/questions');
          }
        } catch (fallbackError) {
          toast.error('Failed to load question details');
          router.push('/admin/questions');
        }
      } else {
        toast.error('Failed to load question details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-navy">
        <Loader2 className="w-10 h-10 animate-spin text-green" />
      </div>
    );
  }

  if (!questionId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-navy text-white p-8">
        <h1 className="text-2xl font-bold mb-4">No Question ID provided</h1>
        <Link href="/admin/questions" className="text-green hover:underline">Back to Questions</Link>
      </div>
    );
  }

  return (
    <>
      <header className="h-20 bg-navy border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/questions" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold text-white">Edit Question</h1>
            <p className="text-[10px] text-green font-bold uppercase tracking-widest leading-none mt-1">
              {questionId}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        <div className="max-w-6xl mx-auto">
          <QuestionForm 
            key={questionData?.id || 'loading'}
            initialData={questionData}
            onSuccess={() => router.push('/admin/questions')}
            onCancel={() => router.push('/admin/questions')}
          />
        </div>
      </div>
    </>
  );
}

export default function AdminQuestionEditPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-navy">
        <Loader2 className="w-10 h-10 animate-spin text-green" />
      </div>
    }>
      <AdminQuestionEditForm />
    </Suspense>
  );
}
