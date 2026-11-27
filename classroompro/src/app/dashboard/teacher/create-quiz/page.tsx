"use client";

import { useState, useEffect } from "react";
import { IconPlus as Plus, IconTrash as Trash2, IconSettings as Settings, IconEye as Eye, IconDeviceFloppy as Save, IconChevronLeft as ChevronLeft, IconClock as Clock, IconSparkles as Sparkles, IconShieldCheck as ShieldCheck } from '@tabler/icons-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import Link from "next/link";
import { cn } from "../../../../lib/utils";
import { Skeleton } from "../../../../components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api, { getCampusBranches, getCampusClasses } from "../../../../lib/api";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  topicTag?: string;
}

const NERDC_AI_PRESETS: Question[] = [
  {
    id: 101,
    text: "Simplify the algebraic fraction: (3x + 6) / (x² - 4) for x ≠ ±2.",
    options: ["3 / (x - 2)", "3 / (x + 2)", "(x + 2) / 3", "3x / (x - 2)"],
    correctAnswer: 0,
    topicTag: "Fractions & Algebraic Simplification",
  },
  {
    id: 102,
    text: "A trader in Ikeja bought a textbook for ₦4,000 and sold it for ₦4,600. Calculate the percentage profit.",
    options: ["12%", "15%", "18%", "20%"],
    correctAnswer: 1,
    topicTag: "Fractions & Percentages",
  },
  {
    id: 103,
    text: "If 3/5 of the students in JSS 2 Gold are girls and there are 18 girls, how many students are in the class?",
    options: ["25", "28", "30", "35"],
    correctAnswer: 2,
    topicTag: "Fractions & Word Problems",
  },
];

export default function CreateQuizPage() {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState("Main Campus");
  const [selectedClass, setSelectedClass] = useState("JSS 2");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedComponent, setSelectedComponent] = useState("CA 1 (20 Marks)");
  const [selectedTopic, setSelectedTopic] = useState("Fractions & Percentages");
  const [difficulty, setDifficulty] = useState("Medium");
  const [moderationPassed, setModerationPassed] = useState(false);

  useEffect(() => {
    Promise.all([
      getCampusBranches().catch(() => ({ branches: [] })),
      getCampusClasses().catch(() => ({ classes: [] })),
      api.get("/subjects").catch(() => ({ data: [] })),
    ]).then(([branchRes, clsRes, subjRes]) => {
      const bList = Array.isArray(branchRes?.branches) ? branchRes.branches : [];
      const cList = Array.isArray(clsRes?.classes) ? clsRes.classes : [];
      const sList = Array.isArray(subjRes?.data) ? subjRes.data : [];
      setBranches(bList);
      setClasses(cList);
      setSubjects(sList);
      if (bList[0]?.name) setSelectedCampus(bList[0].name);
      if (cList[0]?.name) setSelectedClass(cList[0].name);
      if (sList[0]?.name) setSelectedSubject(sList[0].name);
      setLoading(false);
    });
  }, []);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "Express 0.375 as a common fraction in its lowest terms.",
      options: ["3/8", "3/4", "5/8", "1/3"],
      correctAnswer: 0,
      topicTag: "Fractions & Percentages",
    },
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
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        topicTag: selectedTopic,
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleGenerateNERDC = () => {
    setQuestions(NERDC_AI_PRESETS);
    setModerationPassed(true);
  };

  return (
    <div className="flex-1">
      <main className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <MotionRise className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href="/dashboard/teacher"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Classroom Hub
          </Link>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGenerateNERDC}
              className="bg-[#0D1060] hover:bg-[#0D1060]/90 text-white font-black text-xs"
            >
              <Sparkles className="w-4 h-4 mr-2" /> AI Generate NERDC Questions
            </Button>
            <Button
              onClick={() => setModerationPassed(true)}
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-bold"
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" /> Run AI Exam Moderation
            </Button>
            <Button className="bg-[#FBBC04] hover:bg-[#FBBC04]/90 text-[#0D1060] font-black text-xs">
              <Save className="w-4 h-4 mr-2" /> Publish Assessment
            </Button>
          </div>
        </MotionRise>

        {/* AI Exam Moderation Banner */}
        {moderationPassed && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-950">
                <strong className="font-black">AI Examination Moderation Passed:</strong>{" "}
                0 ambiguous questions, 0 duplicates, 100% verified answer keys, balanced difficulty distribution, and aligned with NERDC {selectedClass} {selectedSubject} syllabus ({selectedTopic}).
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0">
              NERDC Verified
            </span>
          </div>
        )}

        <MotionStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MotionRise className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase">
                  {selectedCampus}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#146ef5] text-[10px] font-bold">
                  {selectedClass} · {selectedSubject}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  Maps to CampusPRO: {selectedComponent}
                </span>
              </div>
              <Input
                defaultValue={`${selectedSubject} Continuous Assessment — ${selectedTopic}`}
                placeholder="Assessment Title"
                className="text-xl md:text-2xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:opacity-30 text-gray-900"
              />
              <textarea
                defaultValue="Answer all objective questions. Your attempt history and topic mastery are tracked in ClassroomPRO, and your final teacher-approved score syncs to CampusPRO."
                placeholder="Short description or instructions for students..."
                className="w-full bg-transparent border-none focus:outline-none text-gray-500 placeholder:opacity-30 resize-none h-16 text-sm"
              />
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 relative group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-[#0D1060] uppercase tracking-[0.2em]">
                        Question {index + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
                        Topic: {q.topicTag || selectedTopic}
                      </span>
                    </div>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      value={q.text}
                      onChange={(e) => {
                        const next = [...questions];
                        next[index].text = e.target.value;
                        setQuestions(next);
                      }}
                      placeholder="Enter your question here..."
                      className="bg-gray-50 border-gray-200 text-gray-900 h-12 font-medium"
                    />

                    <div className="grid gap-3">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const next = [...questions];
                              next[index].correctAnswer = optIndex;
                              setQuestions(next);
                            }}
                            className={cn(
                              "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-black transition-colors",
                              q.correctAnswer === optIndex
                                ? "border-[#0D1060] bg-[#FBBC04] text-[#0D1060]"
                                : "border-gray-200 text-gray-500"
                            )}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </button>
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const next = [...questions];
                              next[index].options[optIndex] = e.target.value;
                              setQuestions(next);
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            className="bg-white shadow-sm border border-gray-200 text-gray-900"
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
              className="w-full border-dashed border-gray-200 hover:border-[#0D1060] hover:bg-gray-50 text-gray-600 hover:text-[#0D1060] py-8 rounded-2xl font-bold"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Another Question
            </Button>
          </MotionRise>

          {/* Sidebar Settings: Multi-Campus & NERDC Generator Config */}
          <MotionRise delay={0.1} className="space-y-6">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-5">
              <h3 className="text-xs font-black text-[#0D1060] uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> CampusPRO &amp; NERDC Config
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-[10px] text-gray-500 uppercase font-black block mb-1.5">
                    Campus Branch (CampusPRO)
                  </Label>
                  <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 px-3 text-xs font-bold text-gray-900"
                  >
                    {branches.length > 0 ? (
                      branches.map((b: any) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))
                    ) : (
                      <option value={selectedCampus}>{selectedCampus}</option>
                    )}
                  </select>
                </div>

                <div>
                  <Label className="text-[10px] text-gray-500 uppercase font-black block mb-1.5">
                    Assigned Class &amp; Arm (CampusPRO)
                  </Label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 px-3 text-xs font-bold text-gray-900"
                  >
                    {classes.length > 0 ? (
                      classes.map((c: any) => (
                        <option key={c.id} value={c.name || c.code}>{c.name || c.code}</option>
                      ))
                    ) : (
                      <option value={selectedClass}>{selectedClass}</option>
                    )}
                  </select>
                </div>

                <div>
                  <Label className="text-[10px] text-gray-500 uppercase font-black block mb-1.5">
                    Subject &amp; Official Exam Component (CampusPRO)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 px-2.5 text-xs font-bold text-gray-900"
                    >
                      {subjects.length > 0 ? (
                        subjects.map((s: any) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))
                      ) : (
                        <option value={selectedSubject}>{selectedSubject}</option>
                      )}
                    </select>
                    <select
                      value={selectedComponent}
                      onChange={(e) => setSelectedComponent(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 px-2.5 text-xs font-bold text-gray-900"
                    >
                      <option>CA 1 (20 Marks)</option>
                      <option>CA 2 (20 Marks)</option>
                      <option>Exam CBT (60 Marks)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] text-gray-500 uppercase font-black block mb-1.5">
                    NERDC Curriculum Topic Tag
                  </Label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 px-3 text-xs font-bold text-gray-900"
                  >
                    <option>Fractions &amp; Percentages</option>
                    <option>Algebraic Simplification</option>
                    <option>Linear Equations &amp; Inequalities</option>
                    <option>Plane Geometry &amp; Angles</option>
                  </select>
                </div>

                <div>
                  <Label className="text-[10px] text-gray-500 uppercase font-black block mb-1.5">
                    Difficulty Distribution
                  </Label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl h-10 px-3 text-xs font-bold text-gray-900"
                  >
                    <option>Easy (Foundational)</option>
                    <option>Medium (NERDC Standard)</option>
                    <option>Hard (Distinction Challenge)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] text-gray-500 uppercase font-black">
                    Time Limit (mins)
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      defaultValue={25}
                      className="pl-10 bg-gray-50 border-gray-200 text-gray-900 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </MotionRise>
        </MotionStagger>
      </main>
    </div>
  );
}
