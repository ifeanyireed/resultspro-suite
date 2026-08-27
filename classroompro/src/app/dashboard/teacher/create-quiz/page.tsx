"use client";

import { useState, useEffect } from "react";
import { IconPlus as Plus, IconTrash as Trash2, IconSettings as Settings, IconEye as Eye, IconDeviceFloppy as Save, IconChevronLeft as ChevronLeft, IconClock as Clock, IconLayout as Layout } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

import { Skeleton } from "@/components/ui/skeleton";

export default function CreateQuizPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        
        <div className="p-8 max-w-5xl mx-auto space-y-8">
           <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded" />
              <div className="flex gap-3">
                 <Skeleton className="h-10 w-24 rounded-xl" />
                 <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <Skeleton className="h-48 w-full rounded-2xl" />
                 <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-96 w-full rounded-2xl" />
           </div>
        </div>
      </div>
    );
  }

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now(), 
      text: "", 
      options: ["", "", "", ""], 
      correctAnswer: 0 
    }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="flex-1">
      
      
      <main className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard/teacher" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <div className="flex gap-3">
             <Button variant="outline" className="border-gray-100 hover:bg-gray-50 text-gray-900">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Save className="w-4 h-4 mr-2" /> Save Quiz
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-4">
              <Input 
                placeholder="Quiz Title (e.g. Photosynthesis Mid-Term Quiz)" 
                className="text-2xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:opacity-30 text-gray-900"
              />
              <textarea 
                placeholder="Short description or instructions for students..."
                className="w-full bg-transparent border-none focus:outline-none text-gray-500 placeholder:opacity-30 resize-none h-20 text-sm"
              />
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Question {index + 1}</span>
                    <button onClick={() => removeQuestion(q.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <Input 
                      placeholder="Enter your question here..." 
                      className="bg-[#146ef5] border-gray-100 text-white h-12"
                    />
                    
                    <div className="grid gap-3">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <button 
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                              q.correctAnswer === optIndex ? "border-green bg-emerald-600 text-white" : "border-gray-100"
                            )}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </button>
                          <Input 
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            className="bg-white shadow-sm border border-gray-100 border-gray-100 text-gray-900"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={addQuestion}
              variant="outline" 
              className="w-full border-dashed border-gray-100 hover:border-green/50 hover:bg-emerald-600/5 text-gray-500 hover:text-emerald-600 py-8 rounded-2xl"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Another Question
            </Button>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Quiz Config
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase font-bold">Time Limit (mins)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input type="number" defaultValue={20} className="pl-10 bg-[#146ef5] border-gray-100 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase font-bold">Passing Score (%)</Label>
                  <Input type="number" defaultValue={50} className="bg-[#146ef5] border-gray-100 text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase font-bold">Shuffle Questions</Label>
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#146ef5] rounded-full" />
                     </div>
                     <span className="text-xs text-gray-900">Enabled</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                 <Label className="text-xs text-gray-500 uppercase font-bold block mb-2">Assign to Class</Label>
                 <select className="w-full bg-[#146ef5] border border-gray-100 rounded-lg h-10 px-3 text-sm text-white">
                    <option>JSS 1 Science</option>
                    <option>JSS 2 Science</option>
                 </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
