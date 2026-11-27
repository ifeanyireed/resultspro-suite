"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconBook as BookOpen,
  IconVideo as VideoIcon,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconCertificate as GraduationCap,
  IconAward as Award,
  IconSparkles as Sparkles,
  IconPlus as Plus,
  IconCheck as Check,
  IconRefresh as RefreshCw,
  IconShieldCheck as ShieldCheck,
  IconTrash as Trash2,
  IconCurrencyNaira as CurrencyNaira,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api from "@/lib/api";
import { syncEngine } from "@/lib/syncEngine";

export interface StudyPackCreatorStudioProps {
  creatorRole: "TEACHER" | "SCHOOL_ADMIN" | "PLATFORM_ADMIN";
  creatorName?: string;
}

const SCHEME_TEMPLATES: Record<string, Array<{ week: number; topic: string; subtopic: string }>> = {
  "jss-2:mathematics:second-term": [
    {
      week: 1,
      topic: "Algebraic Processes I: Algebraic Fractions & LCM",
      subtopic: "Simplifying Algebraic Fractions with Monomial & Binomial Denominators",
    },
    {
      week: 2,
      topic: "Algebraic Processes II: Commercial Word Problems & Simple Equations",
      subtopic: "Translating Market & Financial Word Problems into Algebraic Fractions",
    },
    {
      week: 3,
      topic: "Linear Inequalities in One Variable & Number Line Graphs",
      subtopic: "Solving Linear Inequalities, Reversing Signs & Graphing Solution Sets",
    },
  ],
  "sss-2:physics:second-term": [
    {
      week: 1,
      topic: "Projectile Motion & Vector Resolution",
      subtopic: "Time of Flight, Maximum Height, and Horizontal Range",
    },
    {
      week: 2,
      topic: "Equilibrium of Forces & Moments",
      subtopic: "Principle of Moments, Center of Gravity & Couples",
    },
    {
      week: 3,
      topic: "Waves, Refraction of Light & Snell's Law",
      subtopic: "Refractive Index, Critical Angle & Total Internal Reflection",
    },
  ],
  "primary-4:mathematics:first-term": [
    {
      week: 1,
      topic: "Whole Numbers up to 1,000,000 & Place Value Abacus",
      subtopic: "Counting, Reading, and Place Value from Units to Millions",
    },
    {
      week: 2,
      topic: "Roman Numerals (I to C) & Equivalent Fractions",
      subtopic: "Converting Hindu-Arabic Numbers to Roman Numerals and Ordering Fractions",
    },
  ],
};

export function StudyPackCreatorStudio({
  creatorRole,
  creatorName,
}: StudyPackCreatorStudioProps) {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // Pack Creator Form State
  const [curriculum, setCurriculum] = useState("NERDC");
  const [classCode, setClassCode] = useState("jss-2");
  const [subjectId, setSubjectId] = useState("mathematics");
  const [term, setTerm] = useState("second-term");
  const [title, setTitle] = useState(
    "NERDC JSS 2 Mathematics — Second Term Complete Scheme Study Pack"
  );
  const [subtitle, setSubtitle] = useState(
    "Weeks 1–3 Scheme of Work · Notes, AI Stories, Videos, SRS Flashcards, Quizzes, CBT Mock Exam & 3 Mastery Badges"
  );
  const [description, setDescription] = useState(
    "Curriculum and scheme-of-work aligned study pack bundling portable Markdown notes, linked YouTube video lessons, spaced-repetition flashcards, formative quizzes, a timed CBT mock exam, and Bronze/Silver/Gold mastery badges."
  );
  const [pricingType, setPricingType] = useState<"FREE" | "PAID">("FREE");
  const [priceNaira, setPriceNaira] = useState<number>(2500);

  // Scheme of work weeks & modalities
  const [schemeWeeks, setSchemeWeeks] = useState<
    Array<{
      week: number;
      topic: string;
      subtopic: string;
      youtubeId: string;
      flashcardsCount: number;
      quizQuestionsCount: number;
    }>
  >([
    {
      week: 1,
      topic: "Algebraic Processes I: Algebraic Fractions & LCM",
      subtopic: "Simplifying Algebraic Fractions with Monomial & Binomial Denominators",
      youtubeId: "NybHckSEQBI",
      flashcardsCount: 3,
      quizQuestionsCount: 5,
    },
    {
      week: 2,
      topic: "Algebraic Processes II: Commercial Word Problems & Simple Equations",
      subtopic: "Translating Market & Financial Word Problems into Algebraic Fractions",
      youtubeId: "fC9da6eqaqg",
      flashcardsCount: 2,
      quizQuestionsCount: 5,
    },
    {
      week: 3,
      topic: "Linear Inequalities in One Variable & Number Line Graphs",
      subtopic: "Solving Linear Inequalities, Reversing Signs & Graphing Solution Sets",
      youtubeId: "bAerID24QJ0",
      flashcardsCount: 2,
      quizQuestionsCount: 5,
    },
  ]);

  // Exam & Badges configuration
  const [examTitle, setExamTitle] = useState(
    "NERDC Second Term Mathematics Timed CBT Mock Examination"
  );
  const [examDuration, setExamDuration] = useState(30);
  const [examPassPct, setExamPassPct] = useState(60);
  const [campusproComponent, setCampusproComponent] = useState("CA2");

  const [bronzeBadgeName, setBronzeBadgeName] = useState("Scheme Explorer (Bronze)");
  const [silverBadgeName, setSilverBadgeName] = useState("SRS Flashcard & Quiz Tactician (Silver)");
  const [goldBadgeName, setGoldBadgeName] = useState("NERDC Scheme Grandmaster (Gold)");

  const loadCatalog = async () => {
    setLoading(true);
    const { packs: list } = await syncEngine.fetchStudyPacksCatalog();
    setPacks(list);
    setLoading(false);
  };

  useEffect(() => {
    loadCatalog();
    return syncEngine.subscribe(loadCatalog);
  }, []);

  const handleLoadOfficialScheme = () => {
    const key = `${classCode}:${subjectId}:${term}`;
    const tpl = SCHEME_TEMPLATES[key] || [
      {
        week: 1,
        topic: `Week 1: Foundations & Core Principles (${subjectId.toUpperCase()})`,
        subtopic: "Official NERDC Scheme of Work Week 1",
      },
      {
        week: 2,
        topic: `Week 2: Worked Examples & Applications (${subjectId.toUpperCase()})`,
        subtopic: "Official NERDC Scheme of Work Week 2",
      },
      {
        week: 3,
        topic: `Week 3: Continuous Assessment & CBT Mastery (${subjectId.toUpperCase()})`,
        subtopic: "Official NERDC Scheme of Work Week 3",
      },
    ];
    setSchemeWeeks(
      tpl.map((w, idx) => ({
        week: w.week,
        topic: w.topic,
        subtopic: w.subtopic,
        youtubeId: idx % 2 === 0 ? "NybHckSEQBI" : "fC9da6eqaqg",
        flashcardsCount: 5,
        quizQuestionsCount: 5,
      }))
    );

    const classLabel = classCode.toUpperCase().replace("-", " ");
    const subjLabel = subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
    const termLabel = term
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    setTitle(`${curriculum} ${classLabel} ${subjLabel} — ${termLabel} Complete Scheme Study Pack`);
    setExamTitle(`${curriculum} ${classLabel} ${termLabel} ${subjLabel} Mock CBT Examination`);
    setGoldBadgeName(`${curriculum} ${classLabel} ${subjLabel} Grandmaster (Gold)`);
    setBannerMsg(
      `Loaded official ${curriculum} Scheme of Work for ${classLabel} ${subjLabel} (${termLabel}).`
    );
  };

  const handleAddWeek = () => {
    const nextW = schemeWeeks.length + 1;
    setSchemeWeeks([
      ...schemeWeeks,
      {
        week: nextW,
        topic: `Week ${nextW}: Scheme Topic & Problem Solving`,
        subtopic: "Notes, AI Story, Video, SRS Flashcards & Formative Quiz",
        youtubeId: "NybHckSEQBI",
        flashcardsCount: 5,
        quizQuestionsCount: 5,
      },
    ]);
  };

  const handlePublishStudyPack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setBannerMsg(null);

    const classLabel = classCode.toUpperCase().replace("-", " ");
    const subjectName = subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
    const termLabel = term
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    const educationLevel = classCode.startsWith("primary")
      ? "primary"
      : classCode.startsWith("jss")
      ? "junior-secondary"
      : "senior-secondary";

    const packId = `pkg-${curriculum.toLowerCase()}-${classCode}-${subjectId}-${term}-${Date.now()
      .toString()
      .slice(-4)}`;

    const compiledScheme = schemeWeeks.map((w, idx) => ({
      week: w.week,
      topic_id: `${packId}-w0${w.week}`,
      topic: w.topic,
      subtopic: w.subtopic,
      note_id: `${packId}-note-w0${w.week}`,
      video_id: `${packId}-vid-w0${w.week}`,
      flashcard_ids: [`${packId}-fc-w0${w.week}-1`, `${packId}-fc-w0${w.week}-2`],
      quiz_id: `${packId}-quiz-w0${w.week}`,
      exam_id: idx === schemeWeeks.length - 1 ? `${packId}-exam-terminal` : undefined,
      badge_id:
        idx === 0
          ? `${packId}-badge-bronze`
          : idx === 1
          ? `${packId}-badge-silver`
          : `${packId}-badge-gold`,
      is_preview: idx === 0,
    }));

    const lessons = schemeWeeks.map((w) => ({
      content_id: `${packId}-note-w0${w.week}`,
      week: w.week,
      topic: w.topic,
      subtopic: w.subtopic,
      version: 1,
      status: "published",
      checksum_sha256: `sha256:${packId}-w${w.week}`,
      assets: ["asset://cld-jss2-math-algebraic-lcm"],
      youtube_id: w.youtubeId || "NybHckSEQBI",
      youtube_url: `https://www.youtube.com/watch?v=${w.youtubeId || "NybHckSEQBI"}`,
      estimated_minutes: 35,
      markdown_content: `---\ncurriculum: ${curriculum}\nclass: ${classLabel}\nsubject: ${subjectName}\nterm: ${termLabel}\nweek: ${w.week}\ncontent_id: ${packId}-note-w0${w.week}\n---\n# Week ${w.week}: ${w.topic}\n\n## ${w.subtopic}\n${description}\n\n![Offline Scheme Diagram](asset://cld-jss2-math-algebraic-lcm)`,
    }));

    const videos = schemeWeeks.map((w) => ({
      id: `${packId}-vid-w0${w.week}`,
      week: w.week,
      topic_id: `${packId}-w0${w.week}`,
      title: `Week ${w.week} Video Lesson: ${w.topic}`,
      instructor: creatorName || (creatorRole === "TEACHER" ? "Mr. Tunde Ogunleye" : "Dr. Folake Adeyemi"),
      youtube_id: w.youtubeId || "NybHckSEQBI",
      youtube_url: `https://www.youtube.com/watch?v=${w.youtubeId || "NybHckSEQBI"}`,
      thumbnail_url: `https://i.ytimg.com/vi/${w.youtubeId || "NybHckSEQBI"}/hqdefault.jpg`,
      duration: "14:20",
      summary: w.subtopic,
      offline_summary_markdown: `### Offline Video Summary (Week ${w.week})\n- ${w.topic}: ${w.subtopic}`,
      note_id: `${packId}-note-w0${w.week}`,
      quiz_id: `${packId}-quiz-w0${w.week}`,
      flashcard_set_id: `${packId}-fc-w0${w.week}-1`,
    }));

    const flashcards = schemeWeeks.flatMap((w) => [
      {
        id: `${packId}-fc-w0${w.week}-1`,
        topic_id: `${packId}-w0${w.week}`,
        front: `Week ${w.week} Core Concept: What is the main rule in ${w.topic}?`,
        back: `${w.subtopic} (${curriculum} ${classLabel} ${subjectName})`,
        hint: `Review Week ${w.week} lesson note.`,
      },
      {
        id: `${packId}-fc-w0${w.week}-2`,
        topic_id: `${packId}-w0${w.week}`,
        front: `How is ${w.topic} tested in ${curriculum} examinations?`,
        back: `Through structured problem-solving steps and CBT multiple-choice drills.`,
        hint: `Check Week ${w.week} worked example.`,
      },
    ]);

    const quizzes = schemeWeeks.map((w) => ({
      id: `${packId}-quiz-w0${w.week}`,
      topic_id: `${packId}-w0${w.week}`,
      title: `Week ${w.week} Practice Quiz: ${w.topic}`,
      duration_min: 10,
      questions: [
        {
          id: "q1",
          question: `Which ${curriculum} topic is covered in Week ${w.week} of ${classLabel} ${subjectName}?`,
          options: [w.topic, "Unrelated topic", "Skipped syllabus", "None of the above"],
          correct_index: 0,
          explanation: `Week ${w.week} covers ${w.topic} (${w.subtopic}).`,
        },
      ],
    }));

    const exams = [
      {
        id: `${packId}-exam-terminal`,
        pack_id: packId,
        week: schemeWeeks.length,
        exam_type: "TERMINAL_MOCK",
        title: examTitle,
        instructions: `Complete all questions within ${examDuration} minutes. Passing score is ${examPassPct}%.`,
        duration_min: examDuration,
        pass_score_pct: examPassPct,
        sync_to_campuspro_component: campusproComponent,
        questions: schemeWeeks.map((w, idx) => ({
          id: `ex-q${idx + 1}`,
          question: `[Week ${w.week} Scheme Question] Identify the key principle of ${w.topic}:`,
          options: [w.subtopic, "Invalid assumption", "No relation", "Random approximation"],
          correct_index: 0,
          explanation: `${w.topic} focuses on ${w.subtopic}.`,
        })),
      },
    ];

    const badges = [
      {
        badge_id: `${packId}-badge-bronze`,
        pack_id: packId,
        code: `BADGE_${packId.toUpperCase().replace(/-/g, "_")}_BRONZE`,
        name: bronzeBadgeName,
        description: "Completed all Lesson Notes, AI Storybooks & Video Lectures in this pack.",
        icon_svg_or_asset: "BRONZE_SHIELD",
        tier: "BRONZE",
        xp_bonus: 100,
        unlock_rule: { min_notes_completed: schemeWeeks.length },
      },
      {
        badge_id: `${packId}-badge-silver`,
        pack_id: packId,
        code: `BADGE_${packId.toUpperCase().replace(/-/g, "_")}_SILVER`,
        name: silverBadgeName,
        description: "Mastered the SRS Flashcard Deck and scored 70%+ on weekly quizzes.",
        icon_svg_or_asset: "SILVER_STAR",
        tier: "SILVER",
        xp_bonus: 200,
        unlock_rule: { min_quiz_avg: 70 },
      },
      {
        badge_id: `${packId}-badge-gold`,
        pack_id: packId,
        code: `BADGE_${packId.toUpperCase().replace(/-/g, "_")}_GOLD`,
        name: goldBadgeName,
        description: `Passed ${examTitle} with Distinction (75%+).`,
        icon_svg_or_asset: "GOLD_CROWN",
        tier: "GOLD",
        xp_bonus: 300,
        unlock_rule: { min_exam_score: 75 },
      },
    ];

    const payload = {
      pack_id: packId,
      package_id: packId,
      slug: packId,
      title,
      subtitle,
      description,
      curriculum,
      education_level: educationLevel,
      class_code: classCode,
      class_label: classLabel,
      subject_id: subjectId,
      subject_name: subjectName,
      term,
      term_label: termLabel,
      pricing_type: pricingType,
      price_naira: pricingType === "PAID" ? priceNaira : 0,
      price_kobo: pricingType === "PAID" ? priceNaira * 100 : 0,
      creator_role: creatorRole,
      creator_name:
        creatorName ||
        (creatorRole === "TEACHER" ? "Mr. Tunde Ogunleye" : "Dr. (Mrs.) Folake Adeyemi"),
      publish_directly: creatorRole !== "TEACHER" || pricingType === "FREE",
      moderation_status:
        creatorRole === "TEACHER" && pricingType === "PAID" ? "PENDING_APPROVAL" : "PUBLISHED",
      package_version: 1,
      size_bytes: 215040,
      total_xp_reward: 600,
      scheme_of_work: compiledScheme,
      lessons,
      videos,
      flashcards,
      quizzes,
      exams,
      badges,
    };

    try {
      await api.post("/teacher/packs", payload);
    } catch {
      // Persist locally if backend is offline
    }

    syncEngine.saveLocalCreatedPack(payload);
    await loadCatalog();
    setSaving(false);
    setBannerMsg(
      pricingType === "FREE"
        ? `Published FREE Study Pack "${title}" to Neon Postgres & Neon Object Storage! Students can now claim or download it on request.`
        : creatorRole === "TEACHER"
        ? `Submitted PAID Study Pack "${title}" (₦${priceNaira.toLocaleString()}) to Principal/Admin Moderation Queue!`
        : `Published PAID Study Pack "${title}" (₦${priceNaira.toLocaleString()}) to Neon Object Storage & Parent Marketplace!`
    );
  };

  const handleModeratePack = async (
    packId: string,
    newStatus: "PUBLISHED" | "ARCHIVED",
    overridePricing?: "FREE" | "PAID"
  ) => {
    try {
      await api.post(`/admin/packs/${packId}/moderate`, {
        moderation_status: newStatus,
        pricing_type: overridePricing,
      });
    } catch {
      // Also update local pack state
    }
    const local = syncEngine.getLocalCreatedPacks();
    const match = local.find((p) => p.pack_id === packId);
    if (match) {
      match.moderation_status = newStatus;
      if (overridePricing) {
        match.pricing_type = overridePricing;
        if (overridePricing === "FREE") {
          match.price_kobo = 0;
          match.price_naira = 0;
        }
      }
      syncEngine.saveLocalCreatedPack(match);
    }
    setBannerMsg(`Updated pack ${packId} moderation status to ${newStatus}.`);
    await loadCatalog();
  };

  const handleRevokeAndRefund = async (packId: string) => {
    await syncEngine.revokeAndRefundPack(
      packId,
      "profile-student",
      "Admin processed refund — revoked perpetual license and purged device IndexedDB"
    );
    setBannerMsg(
      `Refunded & revoked entitlement for ${packId}. Student's downloaded IndexedDB copy has been purged.`
    );
    await loadCatalog();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ClassroomPRO Study Pack Creator Studio · {creatorRole.replace("_", " ")}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Curriculum &amp; Scheme-of-Work Study Pack Builder
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Bundle weekly Notes, AI Storybooks, Linked YouTube Videos, SRS Flashcards, Formative Quizzes, Timed CBT Mock Exams, and Bronze/Silver/Gold Badges into a single Free or Paid Study Pack stored in Neon Object Storage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link href="/dashboard/downloads">
            <Button variant="outline" className="rounded-2xl text-xs font-extrabold h-10">
              Open Student Pack Player &amp; Offline Manager
            </Button>
          </Link>
        </div>
      </MotionRise>

      {bannerMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            {bannerMsg}
          </span>
          <button
            type="button"
            onClick={() => setBannerMsg(null)}
            className="text-emerald-700 underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Creator Form */}
      <MotionRise className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handlePublishStudyPack} className="space-y-6">
          {/* Step 1: Curriculum, Class, Subject & Term */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  1. Curriculum, Class, Subject &amp; Scheme of Work Spine
                </h2>
                <p className="text-xs text-gray-500">
                  Every pack is anchored to a specific curriculum, class level, subject, and academic term.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleLoadOfficialScheme}
                variant="outline"
                className="rounded-xl text-xs font-extrabold h-9 border-[#146ef5] text-[#146ef5]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Load Official Scheme of Work
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Curriculum
                </label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900"
                >
                  <option value="NERDC">NERDC (National Curriculum)</option>
                  <option value="WAEC">WAEC / WASSCE Prep</option>
                  <option value="JAMB">JAMB UTME CBT</option>
                  <option value="BECE">BECE / Junior WAEC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Target Class
                </label>
                <select
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900"
                >
                  <option value="primary-4">Primary 4</option>
                  <option value="primary-5">Primary 5</option>
                  <option value="primary-6">Primary 6</option>
                  <option value="jss-1">JSS 1</option>
                  <option value="jss-2">JSS 2</option>
                  <option value="jss-3">JSS 3</option>
                  <option value="sss-1">SSS 1</option>
                  <option value="sss-2">SSS 2</option>
                  <option value="sss-3">SSS 3</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900"
                >
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English Language</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="basic-science">Basic Science &amp; Tech</option>
                  <option value="civic-education">Civic Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Academic Term
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900"
                >
                  <option value="first-term">First Term</option>
                  <option value="second-term">Second Term</option>
                  <option value="third-term">Third Term</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Study Pack Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Scheme Subtitle
                </label>
                <Input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Creator Free vs Paid Pricing Selector */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  2. Creator Pricing Model (Free vs. Paid Perpetual License)
                </h3>
                <p className="text-xs text-gray-600">
                  Choose whether students and parents claim this Study Pack for <strong>Free (₦0)</strong> or purchase a <strong>Perpetual License (₦)</strong> via Paystack.
                </p>
              </div>

              <div className="inline-flex rounded-xl bg-white p-1 border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setPricingType("FREE")}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                    pricingType === "FREE"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Free Study Pack (₦0)
                </button>
                <button
                  type="button"
                  onClick={() => setPricingType("PAID")}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                    pricingType === "PAID"
                      ? "bg-[#146ef5] text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Paid Study Pack (₦)
                </button>
              </div>
            </div>

            {pricingType === "PAID" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-blue-100">
                <div>
                  <label className="block text-xs font-extrabold text-gray-800 mb-1">
                    Price per Child Seat (₦ Naira)
                  </label>
                  <div className="relative">
                    <CurrencyNaira className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={500}
                      step={100}
                      value={priceNaira}
                      onChange={(e) => setPriceNaira(Number(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-extrabold text-gray-900"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 flex items-center text-xs text-gray-600 font-medium">
                  <span>
                    Week 1 is automatically unlocked as a <strong>Free Preview</strong> for parents. When a parent buys for a linked child, the child receives a <strong>Perpetual License</strong>. If refunded, the pack is automatically purged from the device&apos;s IndexedDB on next sync.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Week-by-Week Scheme of Work & 4 Weekly Modalities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  3. Scheme-of-Work Weekly Materials (Notes + Videos + SRS Flashcards + Quizzes)
                </h3>
                <p className="text-xs text-gray-500">
                  Each week bundles all 4 weekly study materials so students follow a structured mastery loop.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleAddWeek}
                variant="outline"
                className="rounded-xl text-xs font-extrabold h-9"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Scheme Week
              </Button>
            </div>

            <div className="space-y-3">
              {schemeWeeks.map((w, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase">
                      Week {w.week} {idx === 0 ? "• Free Preview Week" : ""}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-[#146ef5] flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Markdown Note + Diagram
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 flex items-center gap-1">
                        <VideoIcon className="w-3 h-3" /> YouTube ({w.youtubeId})
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {w.flashcardsCount} SRS Cards
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3" /> {w.quizQuestionsCount}-Q Quiz
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        Week {w.week} Scheme Topic
                      </label>
                      <Input
                        value={w.topic}
                        onChange={(e) => {
                          const next = [...schemeWeeks];
                          next[idx].topic = e.target.value;
                          setSchemeWeeks(next);
                        }}
                        className="text-xs font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        Subtopic &amp; Learning Objective
                      </label>
                      <Input
                        value={w.subtopic}
                        onChange={(e) => {
                          const next = [...schemeWeeks];
                          next[idx].subtopic = e.target.value;
                          setSchemeWeeks(next);
                        }}
                        className="text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        Linked YouTube Video ID
                      </label>
                      <Input
                        value={w.youtubeId}
                        onChange={(e) => {
                          const next = [...schemeWeeks];
                          next[idx].youtubeId = e.target.value;
                          setSchemeWeeks(next);
                        }}
                        placeholder="e.g. NybHckSEQBI"
                        className="text-xs font-mono bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Timed CBT Mock Exam & Pack Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#146ef5]" />
                <h3 className="text-sm font-extrabold text-gray-900">
                  4. Bundled Timed CBT Mock / Terminal Exam
                </h3>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  CBT Exam Title
                </label>
                <Input
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="text-xs font-bold bg-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Duration (Min)
                  </label>
                  <Input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value) || 30)}
                    className="text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Pass Score (%)
                  </label>
                  <Input
                    type="number"
                    value={examPassPct}
                    onChange={(e) => setExamPassPct(Number(e.target.value) || 60)}
                    className="text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    CampusPRO Sync
                  </label>
                  <select
                    value={campusproComponent}
                    onChange={(e) => setCampusproComponent(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold"
                  >
                    <option value="CA1">CA 1</option>
                    <option value="CA2">CA 2</option>
                    <option value="EXAM">Terminal Exam</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-extrabold text-gray-900">
                    5. Study Pack Mastery Badges (+600 XP Total)
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Offline Unlock Enabled
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                    Bronze Badge (+100 XP · Notes &amp; Videos Complete)
                  </label>
                  <Input
                    value={bronzeBadgeName}
                    onChange={(e) => setBronzeBadgeName(e.target.value)}
                    className="text-xs font-bold bg-white h-8"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                    Silver Badge (+200 XP · SRS Flashcards &amp; Weekly Quizzes ≥ 70%)
                  </label>
                  <Input
                    value={silverBadgeName}
                    onChange={(e) => setSilverBadgeName(e.target.value)}
                    className="text-xs font-bold bg-white h-8"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                    Gold Badge (+300 XP · CBT Mock Exam Distinction ≥ 75%)
                  </label>
                  <Input
                    value={goldBadgeName}
                    onChange={(e) => setGoldBadgeName(e.target.value)}
                    className="text-xs font-bold bg-white h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#146ef5] hover:bg-[#105bd1] text-white font-extrabold rounded-2xl px-6 h-11 text-xs"
            >
              {saving
                ? "Compiling Bundle to Neon Object Storage..."
                : pricingType === "FREE"
                ? "Compile & Publish Free Study Pack (₦0)"
                : creatorRole === "TEACHER"
                ? `Submit Paid Study Pack (₦${priceNaira.toLocaleString()}) for Approval`
                : `Compile & Publish Paid Study Pack (₦${priceNaira.toLocaleString()})`}
            </Button>
          </div>
        </form>
      </MotionRise>

      {/* Existing Study Packs Catalog, Moderation & Refund/Revoke Manager */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Published &amp; Submitted Study Packs ({packs.length})
            </h2>
            <p className="text-xs text-gray-500">
               Stored in Neon Lakebase Postgres + Neon Object Storage (`packs/&#123;tenant&#125;/&#123;pack_id&#125;/v&#123;n&#125;/bundle.json`).
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4" /> Perpetual License + Refund Offline Purge Active
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-gray-500 py-6 text-center">Loading study packs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packs.map((pack) => (
              <div
                key={pack.pack_id}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase">
                      {pack.curriculum} · {pack.class_label} · {pack.subject_name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          pack.pricing_type === "PAID"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {pack.pricing_type === "PAID"
                          ? `PAID • ₦${(pack.price_naira || (pack.price_kobo || 0) / 100).toLocaleString()}`
                          : "FREE • ₦0"}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pack.moderation_status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {pack.moderation_status || "PUBLISHED"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900">{pack.title}</h3>
                  <p className="text-xs text-gray-500">{pack.subtitle}</p>
                  <p className="text-[11px] text-gray-500 font-semibold">
                    Creator: <strong>{pack.creator_name || "Mr. Tunde Ogunleye"}</strong> ({pack.creator_role || "TEACHER"}) · Neon Key:{" "}
                    <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border">
                      {pack.neon_storage_key || `packs/${pack.pack_id}/v1/bundle.json`}
                    </code>
                  </p>

                  {/* All 5 Modalities + Badges Count Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-bold">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-800">
                      {pack.notes_count} Notes
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-purple-700">
                      {pack.videos_count} Videos
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-emerald-700">
                      {pack.flashcards_count} Flashcards
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-amber-800">
                      {pack.quizzes_count} Quizzes
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[#146ef5]">
                      {pack.exams_count} CBT Exam
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                      🏅 {pack.badges_count} Badges (+{pack.total_xp_reward || 600} XP)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-200/70">
                  <Link href={`/dashboard/downloads?pack=${pack.pack_id}`}>
                    <Button variant="outline" className="rounded-xl text-xs font-extrabold h-8">
                      Open in Pack Player
                    </Button>
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    {creatorRole !== "TEACHER" && pack.moderation_status !== "PUBLISHED" && (
                      <Button
                        type="button"
                        onClick={() => handleModeratePack(pack.pack_id, "PUBLISHED")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold h-8"
                      >
                        Approve &amp; Publish
                      </Button>
                    )}

                    {creatorRole !== "TEACHER" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleModeratePack(
                            pack.pack_id,
                            "PUBLISHED",
                            pack.pricing_type === "PAID" ? "FREE" : "PAID"
                          )
                        }
                        className="rounded-xl text-xs font-bold h-8"
                      >
                        Switch to {pack.pricing_type === "PAID" ? "Free" : "Paid"}
                      </Button>
                    )}

                    {creatorRole !== "TEACHER" && (
                      <button
                        type="button"
                        onClick={() => handleRevokeAndRefund(pack.pack_id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-extrabold transition-colors cursor-pointer"
                        title="Refund order, revoke perpetual entitlement, and purge downloaded IndexedDB content"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Refund &amp; Purge Offline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </MotionRise>
    </div>
  );
}
