"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconDownload as Download,
  IconTrash as Trash2,
  IconWifiOff as WifiOff,
  IconWifi as Wifi,
  IconCircleCheck as CheckCircle2,
  IconRefresh as RefreshCw,
  IconShieldCheck as ShieldCheck,
  IconBrain as BrainCircuit,
  IconVideo as VideoIcon,
  IconBook as BookOpen,
  IconStack2 as Layers,
  IconCertificate as GraduationCap,
  IconAward as Award,
  IconSparkles as Sparkles,
} from "@tabler/icons-react";
import { Button } from "../../../components/ui/button";
import {
  offlineDb,
  OfflinePackageRecord,
  OfflineLessonRecord,
  OfflineVideoRecord,
  OfflineQuizRecord,
  OfflineFlashcardRecord,
  OfflineExamRecord,
  OfflineBadgeRecord,
  PendingSyncOperation,
  OfflineProgressRecord,
} from "../../../lib/offlineDb";
import { syncEngine } from "../../../lib/syncEngine";

export default function DownloadsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  const [catalog, setCatalog] = useState<any[]>([]);
  const [localPackages, setLocalPackages] = useState<OfflinePackageRecord[]>([]);
  const [localLessons, setLocalLessons] = useState<OfflineLessonRecord[]>([]);
  const [localVideos, setLocalVideos] = useState<OfflineVideoRecord[]>([]);
  const [localQuizzes, setLocalQuizzes] = useState<OfflineQuizRecord[]>([]);
  const [localFlashcards, setLocalFlashcards] = useState<OfflineFlashcardRecord[]>([]);
  const [localExams, setLocalExams] = useState<OfflineExamRecord[]>([]);
  const [localBadges, setLocalBadges] = useState<OfflineBadgeRecord[]>([]);
  const [syncQueue, setSyncQueue] = useState<PendingSyncOperation[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, OfflineProgressRecord>>({});
  const [storageBytes, setStorageBytes] = useState<number>(0);

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [downloadingPkgId, setDownloadingPkgId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Active Modality Tabs in the Local Study Library
  const [libraryTab, setLibraryTab] = useState<
    "scheme" | "notes" | "videos" | "flashcards" | "quizzes" | "exams" | "badges"
  >("scheme");

  // Active Reader / Player / Runner state
  const [activeLesson, setActiveLesson] = useState<OfflineLessonRecord | null>(null);
  const [activeVideo, setActiveVideo] = useState<OfflineVideoRecord | null>(null);
  const [activeFlashcardIdx, setActiveFlashcardIdx] = useState<number | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = useState<boolean>(false);
  const [activeQuiz, setActiveQuiz] = useState<OfflineQuizRecord | null>(null);
  const [activeExam, setActiveExam] = useState<OfflineExamRecord | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<{
    score: number;
    maxScore: number;
    operationId: string;
    syncState: string;
    unlockedBadges: OfflineBadgeRecord[];
  } | null>(null);

  const loadOfflineState = async () => {
    await syncEngine.ensureSampleStudyPackSeededForTestStudent();
    setIsOffline(syncEngine.isOffline());

    const [
      manifests,
      pkgs,
      lessons,
      videos,
      quizzes,
      flashcards,
      exams,
      badges,
      queue,
      progs,
      bytes,
    ] = await Promise.all([
      syncEngine.fetchAvailableManifests({
        class_code: selectedClass || undefined,
        subject_id: selectedSubject || undefined,
        term: selectedTerm || undefined,
      }),
      offlineDb.getAllPackages(),
      offlineDb.getAllLessons(),
      offlineDb.getAllVideos(),
      offlineDb.getAllQuizzes(),
      offlineDb.getAllFlashcards(),
      offlineDb.getAllExams(),
      offlineDb.getAllBadges(),
      offlineDb.getSyncQueue(),
      offlineDb.getAllProgress(),
      offlineDb.getStorageEstimateBytes(),
    ]);

    setCatalog(manifests);
    setLocalPackages(pkgs);
    setLocalLessons(lessons);
    setLocalVideos(videos);
    setLocalQuizzes(quizzes);
    setLocalFlashcards(flashcards);
    setLocalExams(exams);
    setLocalBadges(badges);
    setSyncQueue(queue);
    const pMap: Record<string, OfflineProgressRecord> = {};
    for (const p of progs) {
      pMap[p.content_id] = p;
    }
    setProgressMap(pMap);
    setStorageBytes(bytes);

    if (!activeLesson && !activeVideo && !activeQuiz && !activeExam && lessons.length > 0) {
      setActiveLesson(lessons[0]);
    }
  };

  useEffect(() => {
    syncEngine.registerServiceWorker();
    loadOfflineState();
    return syncEngine.subscribe(loadOfflineState);
  }, [selectedClass, selectedSubject, selectedTerm]);

  const handleDownloadPackage = async (packageId: string) => {
    setDownloadingPkgId(packageId);
    try {
      await syncEngine.downloadPackage(packageId);
      await loadOfflineState();
    } finally {
      setDownloadingPkgId(null);
    }
  };

  const handleRemovePackage = async (packageId: string) => {
    await offlineDb.deletePackage(packageId);
    if (activeLesson?.package_id === packageId) setActiveLesson(null);
    if (activeVideo?.package_id === packageId) setActiveVideo(null);
    if (activeQuiz?.package_id === packageId) setActiveQuiz(null);
    if (activeExam?.package_id === packageId) setActiveExam(null);
    await loadOfflineState();
  };

  const clearRightPane = () => {
    setActiveLesson(null);
    setActiveVideo(null);
    setActiveFlashcardIdx(null);
    setActiveQuiz(null);
    setActiveExam(null);
    setQuizSubmittedResult(null);
  };

  const handleOpenLesson = async (lesson: OfflineLessonRecord) => {
    clearRightPane();
    setActiveLesson(lesson);
    await syncEngine.recordLessonProgress(lesson.content_id, 100);
    await loadOfflineState();
  };

  const handleOpenVideo = (video: OfflineVideoRecord) => {
    clearRightPane();
    setActiveVideo(video);
  };

  const handleOpenFlashcards = (startIdx = 0) => {
    clearRightPane();
    setActiveFlashcardIdx(startIdx);
    setFlashcardFlipped(false);
  };

  const handleStartOfflineQuiz = (quiz: OfflineQuizRecord) => {
    clearRightPane();
    setActiveQuiz(quiz);
    setQuizAnswers({});
  };

  const handleStartOfflineExam = (exam: OfflineExamRecord) => {
    clearRightPane();
    setActiveExam(exam);
    setQuizAnswers({});
  };

  const handleSubmitAssessment = async (isExam: boolean) => {
    const target = isExam ? activeExam : activeQuiz;
    if (!target) return;

    let correct = 0;
    for (const q of target.questions) {
      if (quizAnswers[q.id] === q.correct_index) {
        correct++;
      }
    }
    const total = target.questions.length || 1;
    const scorePct = Math.round((correct / total) * 100);

    const { operation, unlockedBadges } = await syncEngine.submitOfflineQuizAttempt({
      quizId: target.id,
      score: scorePct,
      maxScore: 100,
      answers: quizAnswers,
      topicContentId: (target as any).topic_id,
      isExam,
      packageId: target.package_id,
    });

    await loadOfflineState();
    const stillQueued = (await offlineDb.getSyncQueue()).some(
      (item) => item.operation_id === operation.operation_id
    );

    setQuizSubmittedResult({
      score: scorePct,
      maxScore: 100,
      operationId: operation.operation_id,
      syncState: stillQueued ? "Pending synchronization" : "Synchronized",
      unlockedBadges,
    });
  };

  const handleManualSync = async () => {
    if (isOffline) return;
    setSyncing(true);
    await syncEngine.synchronizePendingOperations();
    if (quizSubmittedResult) {
      setQuizSubmittedResult({ ...quizSubmittedResult, syncState: "Synchronized" });
    }
    await loadOfflineState();
    setSyncing(false);
  };

  const renderOfflineMarkdown = (lesson: OfflineLessonRecord) => {
    const lines = (lesson.markdown_content || "").split("\n");
    return (
      <div className="space-y-4 text-gray-800 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "---") return null;
          if (
            trimmed.startsWith("curriculum:") ||
            trimmed.startsWith("content_id:") ||
            trimmed.startsWith("class:") ||
            trimmed.startsWith("subject:") ||
            trimmed.startsWith("term:") ||
            trimmed.startsWith("week:")
          ) {
            return null;
          }

          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const alt = imgMatch[1];
            const assetKey = imgMatch[2];
            const resolvedSrc = lesson.resolved_assets?.[assetKey] || assetKey;
            return (
              <div
                key={idx}
                className="my-4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-3"
              >
                <img
                  src={resolvedSrc}
                  alt={alt}
                  className="w-full h-auto rounded-xl object-contain"
                />
                <p className="text-xs text-gray-500 font-semibold mt-2 text-center">
                  {alt} •{" "}
                  <span className="text-emerald-700">
                    Cached Offline in IndexedDB ({assetKey})
                  </span>
                </p>
              </div>
            );
          }

          if (trimmed.startsWith("# ")) {
            return (
              <h2 key={idx} className="text-xl font-bold text-gray-900 pt-2">
                {trimmed.replace("# ", "")}
              </h2>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h3 key={idx} className="text-lg font-bold text-[#146ef5] pt-2">
                {trimmed.replace("## ", "")}
              </h3>
            );
          }
          if (trimmed.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-base font-bold text-gray-900 pt-1">
                {trimmed.replace("### ", "")}
              </h4>
            );
          }
          return (
            <p key={idx} className="text-sm text-gray-700">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  const formattedKB = Math.max(1, Math.round(storageBytes / 1024));
  const earnedBadgesCount = localBadges.filter((b) => b.earned).length;

  return (
    <div className="flex-1">
      <main className="py-2 w-full flex flex-col gap-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              ClassroomPRO Study Packs • Neon Object Storage + Offline IndexedDB v2
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Curriculum &amp; Scheme-of-Work Study Pack Player
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Every Study Pack bundles Scheme-of-Work Notes, AI Stories, Linked YouTube Videos, SRS Flashcards, Quizzes, Timed CBT Mock Exams, and Mastery Badges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => syncEngine.setSimulatedOffline(!isOffline)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-colors cursor-pointer ${
                isOffline
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {isOffline ? (
                <WifiOff className="w-4 h-4" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-600" />
              )}
              {isOffline ? "Offline Mode Active" : "Simulate Offline"}
            </button>

            <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-extrabold text-amber-900">
                {earnedBadgesCount} / {localBadges.length} Pack Badges Earned
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Study Packs Catalog (Free & Paid Perpetual Licenses) */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                1. Curriculum &amp; Scheme-of-Work Study Packs Catalog
              </h2>
              <p className="text-xs text-gray-500">
                Filter by Class, Subject, or Term. Presigned Neon Object Storage downloads cache all 5 modalities + badge rules into IndexedDB.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
              >
                <option value="">All Classes (Primary 1 – SSS 3)</option>
                <option value="primary-4">Primary 4</option>
                <option value="jss-2">JSS 2</option>
                <option value="sss-2">SSS 2</option>
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
              >
                <option value="">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
              </select>

              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
              >
                <option value="">All Terms</option>
                <option value="first-term">First Term</option>
                <option value="second-term">Second Term</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {catalog.map((pkg) => {
              const isDownloaded =
                pkg.sync_state !== "Not downloaded" && pkg.sync_state !== "Revoked";
              const isRevoked = pkg.sync_state === "Revoked" || pkg.is_revoked;
              const isLockedPaid = pkg.pricing_type === "PAID" && !pkg.entitled;

              return (
                <div
                  key={pkg.package_id}
                  className="border border-gray-200/80 rounded-2xl p-5 bg-gray-50/70 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#146ef5] text-white font-black text-[10px] uppercase tracking-wider">
                        {pkg.curriculum} • {pkg.class_label} • {pkg.term_label}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isRevoked
                            ? "bg-rose-100 text-rose-800"
                            : pkg.pricing_type === "PAID"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isRevoked
                          ? "REVOKED / REFUNDED"
                          : pkg.pricing_type === "PAID"
                          ? `PAID • ₦${(pkg.price_naira || (pkg.price_kobo || 0) / 100).toLocaleString()}`
                          : "FREE • PERPETUAL"}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-gray-900">
                      {pkg.title || `${pkg.subject_name} (${pkg.class_label})`}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {pkg.subtitle || pkg.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold">
                      <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-800">
                        {pkg.notes_count} Notes
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-purple-700">
                        {pkg.videos_count} Videos
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-emerald-700">
                        {pkg.flashcards_count} SRS Cards
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-amber-800">
                        {pkg.quizzes_count} Quizzes
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[#146ef5]">
                        {pkg.exams_count} CBT Exam
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900">
                        🏅 {pkg.badges_count} Badges
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200/70">
                    {isLockedPaid ? (
                      <Link href="/dashboard/parent" className="flex-1">
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold h-9 rounded-xl">
                          Unlock via Parent Ward Purchase (₦
                          {(pkg.price_naira || (pkg.price_kobo || 0) / 100).toLocaleString()})
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => handleDownloadPackage(pkg.package_id)}
                        disabled={downloadingPkgId === pkg.package_id || isRevoked}
                        className="flex-1 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-extrabold h-9 rounded-xl"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        {downloadingPkgId === pkg.package_id
                          ? "Caching All 5 Modalities..."
                          : isDownloaded
                          ? "Cached in IndexedDB (v" + pkg.package_version + ")"
                          : "Download Pack to IndexedDB"}
                      </Button>
                    )}

                    {isDownloaded && (
                      <button
                        onClick={() => handleRemovePackage(pkg.package_id)}
                        title="Remove offline study pack"
                        className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Interactive Multi-Modal Study Pack Player */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Scheme-of-Work & 5 Modalities + Badges Selector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-gray-900">
                  2. Downloaded Study Pack Contents
                </h3>
                <span className="text-[11px] font-bold text-[#146ef5]">
                  {localPackages.length} Pack{localPackages.length === 1 ? "" : "s"} Cached
                </span>
              </div>

              {/* Modality Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "scheme", label: `Scheme (${localLessons.length} Wks)` },
                  { id: "notes", label: `Notes (${localLessons.length})` },
                  { id: "videos", label: `Videos (${localVideos.length})` },
                  { id: "flashcards", label: `Flashcards (${localFlashcards.length})` },
                  { id: "quizzes", label: `Quizzes (${localQuizzes.length})` },
                  { id: "exams", label: `CBT Exams (${localExams.length})` },
                  { id: "badges", label: `Badges (${localBadges.length})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLibraryTab(t.id as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-colors cursor-pointer ${
                      libraryTab === t.id
                        ? "bg-[#146ef5] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content List */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {(libraryTab === "scheme" || libraryTab === "notes") &&
                  localLessons.map((lesson) => {
                    const prog = progressMap[lesson.content_id];
                    const matchingVideo = localVideos.find(
                      (v) => v.note_id === lesson.content_id || v.week === lesson.week
                    );
                    const matchingQuiz = localQuizzes.find(
                      (q) => q.topic_id === lesson.content_id
                    );
                    return (
                      <div
                        key={lesson.content_id}
                        className={`p-4 rounded-2xl border transition-colors ${
                          activeLesson?.content_id === lesson.content_id
                            ? "border-[#146ef5] bg-blue-50/40"
                            : "border-gray-100 bg-gray-50/70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#146ef5]">
                              Scheme Week {lesson.week} • {lesson.class_code.toUpperCase()} •{" "}
                              {lesson.subject_id.toUpperCase()}
                            </span>
                            <h4 className="text-sm font-extrabold text-gray-900 mt-0.5">
                              {lesson.topic}
                            </h4>
                            <p className="text-xs text-gray-500">{lesson.subtopic}</p>
                          </div>
                          {prog?.completed && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                          <Button
                            onClick={() => handleOpenLesson(lesson)}
                            size="sm"
                            className="h-8 px-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-[11px] font-extrabold rounded-lg"
                          >
                            <BookOpen className="w-3.5 h-3.5 mr-1" /> Note &amp; Story
                          </Button>
                          {matchingVideo && (
                            <Button
                              onClick={() => handleOpenVideo(matchingVideo)}
                              size="sm"
                              variant="outline"
                              className="h-8 px-2.5 text-[11px] font-extrabold rounded-lg border-purple-200 text-purple-700"
                            >
                              <VideoIcon className="w-3.5 h-3.5 mr-1" /> Video
                            </Button>
                          )}
                          <Button
                            onClick={() => handleOpenFlashcards(0)}
                            size="sm"
                            variant="outline"
                            className="h-8 px-2.5 text-[11px] font-extrabold rounded-lg border-emerald-200 text-emerald-700"
                          >
                            <Layers className="w-3.5 h-3.5 mr-1" /> SRS Cards
                          </Button>
                          {matchingQuiz && (
                            <Button
                              onClick={() => handleStartOfflineQuiz(matchingQuiz)}
                              size="sm"
                              variant="outline"
                              className="h-8 px-2.5 text-[11px] font-extrabold rounded-lg border-amber-200 text-amber-800"
                            >
                              <BrainCircuit className="w-3.5 h-3.5 mr-1" /> Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {libraryTab === "videos" &&
                  localVideos.map((video) => (
                    <div
                      key={video.id}
                      className="p-4 rounded-2xl border border-gray-100 bg-purple-50/40 space-y-2"
                    >
                      <span className="text-[10px] font-black uppercase text-purple-700">
                        Week {video.week} Video Lecture • {video.duration}
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900">{video.title}</h4>
                      <p className="text-xs text-gray-600">{video.summary}</p>
                      <Button
                        onClick={() => handleOpenVideo(video)}
                        size="sm"
                        className="h-8 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-lg"
                      >
                        <VideoIcon className="w-3.5 h-3.5 mr-1.5" /> Open Video &amp; Offline Summary
                      </Button>
                    </div>
                  ))}

                {libraryTab === "flashcards" && (
                  <div className="space-y-2.5">
                    <Button
                      onClick={() => handleOpenFlashcards(0)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold h-9 rounded-xl"
                    >
                      <Layers className="w-4 h-4 mr-1.5" /> Launch Interactive SRS Flashcard Deck ({localFlashcards.length} Cards)
                    </Button>
                    {localFlashcards.map((fc, idx) => (
                      <div
                        key={fc.id}
                        onClick={() => handleOpenFlashcards(idx)}
                        className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-emerald-50/40 cursor-pointer space-y-1"
                      >
                        <span className="text-[10px] font-black uppercase text-emerald-700">
                          Card #{idx + 1} • {fc.topic_id}
                        </span>
                        <p className="text-xs font-extrabold text-gray-900">{fc.front}</p>
                      </div>
                    ))}
                  </div>
                )}

                {libraryTab === "quizzes" &&
                  localQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-4 rounded-2xl border border-gray-100 bg-amber-50/40 space-y-2"
                    >
                      <span className="text-[10px] font-black uppercase text-amber-800">
                        Weekly Practice Quiz • {quiz.questions.length} Questions • {quiz.duration_min}m
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900">{quiz.title}</h4>
                      <Button
                        onClick={() => handleStartOfflineQuiz(quiz)}
                        size="sm"
                        className="h-8 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-lg"
                      >
                        <BrainCircuit className="w-3.5 h-3.5 mr-1.5" /> Take Practice Quiz Offline
                      </Button>
                    </div>
                  ))}

                {libraryTab === "exams" &&
                  localExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-2"
                    >
                      <span className="text-[10px] font-black uppercase text-[#146ef5]">
                        {exam.exam_type} • {exam.duration_min} Mins • Pass: {exam.pass_score_pct}%
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900">{exam.title}</h4>
                      <p className="text-xs text-gray-600">{exam.instructions}</p>
                      <Button
                        onClick={() => handleStartOfflineExam(exam)}
                        size="sm"
                        className="h-8 px-3 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-extrabold rounded-lg"
                      >
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Start Timed CBT Exam
                      </Button>
                    </div>
                  ))}

                {libraryTab === "badges" &&
                  localBadges.map((b) => (
                    <div
                      key={b.badge_id}
                      className={`p-4 rounded-2xl border space-y-1.5 ${
                        b.earned
                          ? "bg-amber-50/80 border-amber-300"
                          : "bg-gray-50 border-gray-200 opacity-80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          {b.tier} BADGE • +{b.xp_bonus} XP
                        </span>
                        <span
                          className={`text-[10px] font-extrabold ${
                            b.earned ? "text-emerald-700" : "text-gray-500"
                          }`}
                        >
                          {b.earned ? "✓ UNLOCKED" : "Locked"}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-gray-900">{b.name}</h4>
                      <p className="text-xs text-gray-600">{b.description}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Upload Synchronization Queue */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    3. Offline Upload Sync Queue
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Idempotent sync to <code>POST /api/sync/push</code>
                  </p>
                </div>
                <Button
                  onClick={handleManualSync}
                  disabled={isOffline || syncQueue.length === 0 || syncing}
                  size="sm"
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-extrabold h-8 rounded-lg"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${syncing ? "animate-spin" : ""}`} />
                  Sync ({syncQueue.length})
                </Button>
              </div>

              {syncQueue.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  All progress, CBT exams &amp; earned badges synchronized.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {syncQueue.map((op) => (
                    <div
                      key={op.operation_id}
                      className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-amber-900">
                        {op.operation_type} • {op.entity_id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                        {op.sync_state}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>IndexedDB Storage Used:</span>
                <span className="font-extrabold text-gray-900">{formattedKB} KB</span>
              </div>
            </div>
          </div>

          {/* Right Pane: Unified Reader / Video Player / Flashcard Trainer / Quiz & Exam Runner */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 min-h-[540px]">
              {activeLesson ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-extrabold text-[#146ef5] uppercase tracking-wider">
                        Scheme Week {activeLesson.week} • {activeLesson.content_id} (v
                        {activeLesson.version})
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900">
                        {activeLesson.topic}: {activeLesson.subtopic}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                      Offline IndexedDB Note
                    </span>
                  </div>

                  {renderOfflineMarkdown(activeLesson)}
                </div>
              ) : activeVideo ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-extrabold text-purple-700 uppercase">
                        Scheme Week {activeVideo.week} • Curated YouTube Lecture
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900">
                        {activeVideo.title}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-gray-500">
                      {activeVideo.duration} • {activeVideo.instructor}
                    </span>
                  </div>

                  {isOffline ? (
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                      <p className="text-xs font-extrabold text-amber-900">
                        Offline Mode Active — Studying Cached Video Summary
                      </p>
                      <p className="text-xs text-amber-800">
                        YouTube streaming pauses while offline, but your study pack includes the full structured video summary below for uninterrupted revision.
                      </p>
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-gray-200">
                      <iframe
                        src={`https://www.youtube.com/embed/${activeVideo.youtube_id}`}
                        title={activeVideo.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                    <h4 className="text-sm font-extrabold text-gray-900">
                      Offline Video Summary &amp; Key Formulae
                    </h4>
                    <p className="text-xs text-gray-700 whitespace-pre-line">
                      {activeVideo.offline_summary_markdown || activeVideo.summary}
                    </p>
                  </div>
                </div>
              ) : activeFlashcardIdx !== null && localFlashcards[activeFlashcardIdx] ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-700 uppercase">
                        Spaced-Repetition (SRS) Flashcard Deck
                      </span>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        Card {activeFlashcardIdx + 1} of {localFlashcards.length}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                      Leitner Box Active
                    </span>
                  </div>

                  <div
                    onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                    className="min-h-[240px] p-8 rounded-3xl bg-gradient-to-br from-[#0D1060] to-[#146ef5] text-white flex flex-col items-center justify-center text-center cursor-pointer shadow-lg space-y-4"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/15">
                      {flashcardFlipped ? "Answer (Back)" : "Prompt (Front) — Click to Flip"}
                    </span>
                    <p className="text-lg font-extrabold max-w-lg">
                      {flashcardFlipped
                        ? localFlashcards[activeFlashcardIdx].back
                        : localFlashcards[activeFlashcardIdx].front}
                    </p>
                    {!flashcardFlipped && localFlashcards[activeFlashcardIdx].hint && (
                      <p className="text-xs text-blue-200">
                        Hint: {localFlashcards[activeFlashcardIdx].hint}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      disabled={activeFlashcardIdx === 0}
                      onClick={() => {
                        setActiveFlashcardIdx(Math.max(0, activeFlashcardIdx - 1));
                        setFlashcardFlipped(false);
                      }}
                      className="rounded-xl text-xs font-extrabold"
                    >
                      ← Previous Card
                    </Button>
                    <Button
                      onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold"
                    >
                      {flashcardFlipped ? "Show Question" : "Flip Card for Answer"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={activeFlashcardIdx >= localFlashcards.length - 1}
                      onClick={() => {
                        setActiveFlashcardIdx(
                          Math.min(localFlashcards.length - 1, activeFlashcardIdx + 1)
                        );
                        setFlashcardFlipped(false);
                      }}
                      className="rounded-xl text-xs font-extrabold"
                    >
                      Next Card →
                    </Button>
                  </div>
                </div>
              ) : activeQuiz || activeExam ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-extrabold text-[#146ef5] uppercase tracking-wider">
                        {activeExam
                          ? `Timed Pack CBT Mock Exam • ${activeExam.duration_min} Mins • Pass: ${activeExam.pass_score_pct}%`
                          : "Weekly Formative Practice Quiz"}
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900">
                        {(activeExam || activeQuiz)?.title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-extrabold">
                      {(activeExam || activeQuiz)?.questions.length} Questions
                    </span>
                  </div>

                  <div className="space-y-4">
                    {(activeExam || activeQuiz)?.questions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3"
                      >
                        <p className="text-sm font-extrabold text-gray-900">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const selected = quizAnswers[q.id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                }
                                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                  selected
                                    ? "bg-[#146ef5] text-white border-[#146ef5]"
                                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => handleSubmitAssessment(Boolean(activeExam))}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-6 h-10 rounded-xl"
                    >
                      {activeExam
                        ? "Submit CBT Exam & Evaluate Mastery Badges"
                        : "Submit Practice Quiz Attempt"}
                    </Button>

                    {quizSubmittedResult && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                        <p className="font-extrabold text-emerald-900">
                          Score: {quizSubmittedResult.score}% • Sync Status:{" "}
                          <span className="underline">{quizSubmittedResult.syncState}</span>
                        </p>
                        {quizSubmittedResult.unlockedBadges.length > 0 && (
                          <div className="p-3 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 font-extrabold flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-700 shrink-0" />
                            <span>
                              🏅 Unlocked Pack Mastery Badge:{" "}
                              {quizSubmittedResult.unlockedBadges
                                .map((b) => `${b.name} (+${b.xp_bonus} XP)`)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#146ef5] flex items-center justify-center">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    Select Any Scheme-of-Work Material on the Left
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                    Open any downloaded Note, Linked YouTube Video, SRS Flashcard Deck, Weekly Quiz, or Timed CBT Mock Exam to study 100% offline.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
