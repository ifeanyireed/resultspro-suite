"use client";

import React, { useEffect, useState } from "react";
import {
  IconDownload as Download,
  IconTrash as Trash2,
  IconWifiOff as WifiOff,
  IconWifi as Wifi,
  IconCircleCheck as CheckCircle2,
  IconFileText as FileText,
  IconRefresh as RefreshCw,
  IconShieldCheck as ShieldCheck,
  IconBrain as BrainCircuit,
  IconVideo as VideoIcon,
  IconBook as BookOpen,
  IconAlertCircle as AlertCircle,
  IconPlayerPlay as Play,
} from "@tabler/icons-react";
import { Button } from "../../../components/ui/button";
import {
  offlineDb,
  OfflinePackageRecord,
  OfflineLessonRecord,
  OfflineQuizRecord,
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
  const [localQuizzes, setLocalQuizzes] = useState<OfflineQuizRecord[]>([]);
  const [syncQueue, setSyncQueue] = useState<PendingSyncOperation[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, OfflineProgressRecord>>({});
  const [storageBytes, setStorageBytes] = useState<number>(0);

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [downloadingPkgId, setDownloadingPkgId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Active Offline Reader & Offline Quiz Runner state (for E2E Scenario: Primary 4 -> Mathematics -> First Term)
  const [activeLesson, setActiveLesson] = useState<OfflineLessonRecord | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<OfflineQuizRecord | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<{
    score: number;
    maxScore: number;
    operationId: string;
    syncState: string;
  } | null>(null);

  const loadOfflineState = async () => {
    setIsOffline(syncEngine.isOffline());
    const [manifests, pkgs, lessons, quizzes, queue, progs, bytes] = await Promise.all([
      syncEngine.fetchAvailableManifests({
        class_code: selectedClass || undefined,
        subject_id: selectedSubject || undefined,
        term: selectedTerm || undefined,
      }),
      offlineDb.getAllPackages(),
      offlineDb.getAllLessons(),
      offlineDb.getAllQuizzes(),
      offlineDb.getSyncQueue(),
      offlineDb.getAllProgress(),
      offlineDb.getStorageEstimateBytes(),
    ]);

    setCatalog(manifests);
    setLocalPackages(pkgs);
    setLocalLessons(lessons);
    setLocalQuizzes(quizzes);
    setSyncQueue(queue);
    const pMap: Record<string, OfflineProgressRecord> = {};
    for (const p of progs) {
      pMap[p.content_id] = p;
    }
    setProgressMap(pMap);
    setStorageBytes(bytes);
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
    if (activeQuiz?.package_id === packageId) setActiveQuiz(null);
    await loadOfflineState();
  };

  const handleOpenLesson = async (lesson: OfflineLessonRecord) => {
    setActiveLesson(lesson);
    setActiveQuiz(null);
    setQuizSubmittedResult(null);
    await syncEngine.recordLessonProgress(lesson.content_id, 100);
    await loadOfflineState();
  };

  const handleStartOfflineQuiz = (quiz: OfflineQuizRecord) => {
    setActiveQuiz(quiz);
    setActiveLesson(null);
    setQuizAnswers({});
    setQuizSubmittedResult(null);
  };

  const handleSubmitOfflineQuiz = async () => {
    if (!activeQuiz) return;
    let correct = 0;
    for (const q of activeQuiz.questions) {
      if (quizAnswers[q.id] === q.correct_index) {
        correct++;
      }
    }
    const total = activeQuiz.questions.length || 1;
    const scorePct = Math.round((correct / total) * 100);

    const op = await syncEngine.submitOfflineQuizAttempt({
      quizId: activeQuiz.id,
      score: scorePct,
      maxScore: 100,
      answers: quizAnswers,
      topicContentId: activeQuiz.topic_id,
    });

    await loadOfflineState();
    const stillQueued = (await offlineDb.getSyncQueue()).some(
      (item) => item.operation_id === op.operation_id
    );

    setQuizSubmittedResult({
      score: scorePct,
      maxScore: 100,
      operationId: op.operation_id,
      syncState: stillQueued ? "Pending synchronization" : "Synchronized",
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

  // Render portable Markdown with inline cached SVG/Data-URL diagrams
  const renderOfflineMarkdown = (lesson: OfflineLessonRecord) => {
    const lines = (lesson.markdown_content || "").split("\n");
    return (
      <div className="space-y-4 text-gray-800 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "---") return null;
          if (trimmed.startsWith("curriculum:") || trimmed.startsWith("content_id:")) return null;

          // Image syntax: ![Alt](asset://...)
          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const alt = imgMatch[1];
            const assetKey = imgMatch[2];
            const resolvedSrc = lesson.resolved_assets?.[assetKey] || assetKey;
            return (
              <div key={idx} className="my-4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-3">
                <img
                  src={resolvedSrc}
                  alt={alt}
                  className="w-full h-auto rounded-xl object-contain"
                />
                <p className="text-xs text-gray-500 font-semibold mt-2 text-center">
                  {alt} • <span className="text-emerald-700">Cached Offline in IndexedDB ({assetKey})</span>
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
              <h3 key={idx} className="text-lg font-bold text-[#0D1060] pt-2">
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

  return (
    <div className="flex-1">
      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        {/* Top Header & Connectivity Control */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              NERDC Offline Curriculum & Sync Manager
            </h2>
            <p className="text-sm text-gray-500">
              Selectively download portable Markdown lessons, cached Cloudinary diagrams, and quizzes by Class, Subject, and Term.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => syncEngine.setSimulatedOffline(!isOffline)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors ${
                isOffline
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
              {isOffline ? "Offline Mode Active (Click to Reconnect)" : "Online Mode (Click to Simulate Offline)"}
            </button>

            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                IndexedDB + PWA Service Worker
              </span>
            </div>
          </div>
        </div>

        {/* Selective Download Filters: Class / Subject / Term */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                1. Selective Curriculum Package Download
              </h3>
              <p className="text-xs text-gray-500">
                Filter by Class, Subject, or Term so student devices only store the packs they need.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
              >
                <option value="">All Classes (Primary 1 – SSS 3)</option>
                <option value="primary-4">Primary 4</option>
                <option value="jss-2">JSS 2</option>
                <option value="sss-2">SSS 2</option>
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
              >
                <option value="">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
              </select>

              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
              >
                <option value="">All Terms</option>
                <option value="first-term">First Term</option>
                <option value="second-term">Second Term</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {catalog.map((pkg) => {
              const isDownloaded = pkg.sync_state !== "Not downloaded";
              const hasUpdate = pkg.sync_state === "Update available";
              return (
                <div
                  key={pkg.package_id}
                  className="border border-gray-100 rounded-2xl p-5 bg-gray-50/60 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#146ef5] font-bold text-[10px] uppercase tracking-wider">
                        {pkg.class_label} • {pkg.term_label}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          hasUpdate
                            ? "bg-amber-100 text-amber-800"
                            : isDownloaded
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {pkg.sync_state} (v{pkg.package_version})
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900">
                      {pkg.subject_name} ({pkg.class_label})
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {pkg.lessons?.length || 0} Portable Markdown Lessons •{" "}
                      {pkg.quizzes?.length || 0} Practice Quizzes •{" "}
                      {Math.round((pkg.size_bytes || 180000) / 1024)} KB
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200/70">
                    <Button
                      onClick={() => handleDownloadPackage(pkg.package_id)}
                      disabled={downloadingPkgId === pkg.package_id}
                      className="flex-1 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold h-9 rounded-xl"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      {downloadingPkgId === pkg.package_id
                        ? "Caching to IndexedDB..."
                        : hasUpdate
                        ? "Update Package"
                        : isDownloaded
                        ? "Re-Verify Offline Pack"
                        : "Download Offline Pack"}
                    </Button>

                    {isDownloaded && (
                      <button
                        onClick={() => handleRemovePackage(pkg.package_id)}
                        title="Remove offline package"
                        className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors"
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

        {/* Downloaded Offline Lessons & Quizzes Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  2. Local IndexedDB Study Library
                </h3>
                <span className="text-xs font-bold text-[#146ef5]">
                  {localLessons.length} Lessons • {localQuizzes.length} Quizzes
                </span>
              </div>

              {localLessons.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 text-center space-y-2">
                  <p className="text-xs text-gray-600 font-medium">
                    No curriculum packages downloaded yet.
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Click <strong>Download Offline Pack</strong> on{" "}
                    <strong>Mathematics (Primary 4 • First Term)</strong> above to test offline reading and quiz synchronization.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {localLessons.map((lesson) => {
                    const prog = progressMap[lesson.content_id];
                    return (
                      <div
                        key={lesson.content_id}
                        className={`p-4 rounded-2xl border transition-colors ${
                          activeLesson?.content_id === lesson.content_id
                            ? "border-[#146ef5] bg-blue-50/40"
                            : "border-gray-100 bg-gray-50/60 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#146ef5]">
                              Week {lesson.week} • v{lesson.version} • {lesson.assets.length} Cached Diagram(s)
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 mt-0.5">
                              {lesson.topic}: {lesson.subtopic}
                            </h4>
                          </div>
                          {prog?.completed && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {prog.sync_state}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            onClick={() => handleOpenLesson(lesson)}
                            size="sm"
                            className="h-8 px-3 bg-[#0D1060] hover:bg-[#146ef5] text-white text-xs font-bold rounded-lg"
                          >
                            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                            Read Offline Note
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {localQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className={`p-4 rounded-2xl border transition-colors ${
                        activeQuiz?.id === quiz.id
                          ? "border-[#146ef5] bg-blue-50/40"
                          : "border-gray-100 bg-emerald-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          Offline CBT Practice Quiz • {quiz.questions.length} Questions
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">
                          {quiz.duration_min} mins
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{quiz.title}</h4>
                      <div className="mt-3">
                        <Button
                          onClick={() => handleStartOfflineQuiz(quiz)}
                          size="sm"
                          className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
                        >
                          <BrainCircuit className="w-3.5 h-3.5 mr-1.5" />
                          Take Quiz Offline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Synchronization Queue */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    3. Upload Sync Queue
                  </h3>
                  <p className="text-xs text-gray-500">
                    Idempotent operation log queued for <code>POST /api/sync/push</code>
                  </p>
                </div>
                <Button
                  onClick={handleManualSync}
                  disabled={isOffline || syncQueue.length === 0 || syncing}
                  size="sm"
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold h-8 rounded-lg"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`} />
                  Sync Queue ({syncQueue.length})
                </Button>
              </div>

              {syncQueue.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  All offline quiz attempts and study progress are synchronized with the backend.
                </div>
              ) : (
                <div className="space-y-2">
                  {syncQueue.map((op) => (
                    <div
                      key={op.operation_id}
                      className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-amber-900">
                          {op.operation_type} • {op.entity_id}
                        </p>
                        <p className="text-[10px] text-amber-700 font-mono">
                          ID: {op.operation_id}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                        {op.sync_state}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Local IndexedDB Storage Used:</span>
                <span className="font-bold text-gray-900">{formattedKB} KB / 100 MB</span>
              </div>
            </div>
          </div>

          {/* Right Pane: Offline Lesson Reader & Offline Quiz Runner */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 min-h-[460px]">
              {activeLesson ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-bold text-[#146ef5] uppercase tracking-wider">
                        {activeLesson.content_id} • Version {activeLesson.version}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        Week {activeLesson.week}: {activeLesson.topic} — {activeLesson.subtopic}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      Rendered from Local IndexedDB
                    </span>
                  </div>

                  {/* Linked YouTube Video Banner (Gracefully degrades when offline) */}
                  {activeLesson.youtube_id && (
                    <div className="p-4 rounded-2xl bg-gray-900 text-white flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <VideoIcon className="w-6 h-6 text-red-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold">
                            Linked YouTube Video Lesson (ID: {activeLesson.youtube_id})
                          </p>
                          <p className="text-[11px] text-gray-300">
                            {isOffline
                              ? "You are offline. The text lesson and cached diagrams below work 100% offline; YouTube streaming will resume when online."
                              : "Online connection active — linked YouTube instructional video ready."}
                          </p>
                        </div>
                      </div>
                      {!isOffline && (
                        <a
                          href={activeLesson.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0"
                        >
                          Watch on YouTube
                        </a>
                      )}
                    </div>
                  )}

                  {renderOfflineMarkdown(activeLesson)}
                </div>
              ) : activeQuiz ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Offline CBT Practice Engine • Local IndexedDB
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">{activeQuiz.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold">
                      {activeQuiz.questions.length} Questions
                    </span>
                  </div>

                  <div className="space-y-5">
                    {activeQuiz.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                        <p className="text-sm font-bold text-gray-900">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const selected = quizAnswers[q.id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                }
                                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      onClick={handleSubmitOfflineQuiz}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 h-10 rounded-xl"
                    >
                      Submit Quiz Attempt ({isOffline ? "Queue Offline" : "Sync Immediately"})
                    </Button>

                    {quizSubmittedResult && (
                      <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                        <p className="font-bold text-emerald-900">
                          Score: {quizSubmittedResult.score}% • Status:{" "}
                          <span className="underline">{quizSubmittedResult.syncState}</span>
                        </p>
                        <p className="text-[10px] text-emerald-700 font-mono">
                          Operation ID: {quizSubmittedResult.operationId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#146ef5] flex items-center justify-center">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Offline Lesson Reader & CBT Quiz Runner
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                    Download any NERDC curriculum package above, then click{" "}
                    <strong>Read Offline Note</strong> or <strong>Take Quiz Offline</strong> on the left to study without internet connectivity.
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
