"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuestionForm from '@/components/admin/QuestionForm';

export default function AdminQuestionNewPage() {
  const router = useRouter();
  
  return (
    <>
      <header className="h-20 bg-navy border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/questions" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold text-white">Create New Question</h1>
            <p className="text-[10px] text-green font-bold uppercase tracking-widest leading-none mt-1">
              Drafting New Content
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        <div className="max-w-6xl mx-auto">
          <QuestionForm 
            onSuccess={() => router.push('/admin/questions')}
            onCancel={() => router.push('/admin/questions')}
          />
        </div>
      </div>
    </>
  );
}
