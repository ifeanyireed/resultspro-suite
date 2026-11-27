"use client";

import {
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconPlayerPlay as Play,
  IconCircleCheck as CheckCircle2,
  IconClock as Clock,
  IconArrowLeft as ArrowLeft,
  IconVideo as VideoIcon,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { syncEngine } from "@/lib/syncEngine";

export default function TopicHubPage() {
  const searchParams = useSearchParams();
  const topicIdParam = searchParams.get("topicId") || "";
  const [loading, setLoading] = useState(true);
  const [activePack, setActivePack] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    const loadTopic = async () => {
      setLoading(true);
      try {
        const manifests = await syncEngine.fetchAvailableManifests();
        for (const m of manifests) {
          const pkgId = m.pack_id || m.package_id;
          const detail = await syncEngine.fetchStudyPackDetail(pkgId).catch(() => null);
          const bundle = detail?.bundle || detail || m;
          const lessons = Array.isArray(bundle?.lessons) ? bundle.lessons : [];
          const found =
            lessons.find((l: any) => l.content_id === topicIdParam) ||
            (!topicIdParam && lessons[0]);
          if (found) {
            if (!cancelled) {
              setActivePack(bundle);
              setActiveLesson(found);
            }
            break;
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadTopic();
    return () => {
      cancelled = true;
    };
  }, [topicIdParam]);

  if (loading) {
    return (
      <div className="flex-1 animate-in fade-in duration-500">
        <div className="p-8 space-y-8">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-64 w-full rounded-[32px]" />
        </div>
      </div>
    );
  }

  if (!activeLesson || !activePack) {
    return (
      <div className="flex-1 pb-12 p-8 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="p-12 rounded-3xl bg-white border border-gray-100 text-center text-sm text-gray-500">
          Topic not found in persisted Study Packs.
        </div>
      </div>
    );
  }

  const resources = [
    {
      type: "Note",
      title: `${activeLesson.topic}: ${activeLesson.subtopic}`,
      status: "Available",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: `/dashboard/notes/${activeLesson.content_id}`,
    },
    ...(Array.isArray(activePack.videos) ? activePack.videos.slice(0, 1) : []).map(
      (v: any) => ({
        type: "Video",
        title: v.title,
        status: "Linked YouTube",
        icon: <VideoIcon className="w-5 h-5" />,
        color: "text-purple-600",
        bg: "bg-purple-50",
        link: `/dashboard/videos/${v.id}`,
      })
    ),
    ...(Array.isArray(activePack.quizzes) ? activePack.quizzes.slice(0, 1) : []).map(
      (q: any) => ({
        type: "Quiz",
        title: q.title,
        status: "Ready",
        icon: <BrainCircuit className="w-5 h-5" />,
        color: "text-amber-600",
        bg: "bg-amber-50",
        link: `/dashboard/quizzes/${q.id}`,
      })
    ),
  ];

  return (
    <div className="flex-1 pb-12">
      <main className="p-8 space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <MotionRise className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 text-[10px] font-bold text-[#146ef5] uppercase tracking-[0.2em] mb-4">
                <span>{activePack.subject_name}</span>
                <span>•</span>
                <span>{activePack.class_label}</span>
                <span>•</span>
                <span>Week {activeLesson.week}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display">
                {activeLesson.topic}
              </h2>
              <p className="text-gray-500 max-w-2xl leading-relaxed">
                {activeLesson.subtopic}
              </p>
            </div>
            <Link href={`/dashboard/notes/${activeLesson.content_id}`}>
              <Button className="bg-[#146ef5] hover:bg-[#105bd1] text-white font-bold h-11 px-6 rounded-xl">
                Open Lesson Note
              </Button>
            </Link>
          </div>
        </MotionRise>

        <MotionStagger className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 font-display">
            Study Pack Resources
          </h3>
          {resources.map((res, i) => (
            <Link
              key={i}
              href={res.link}
              className="flex items-center justify-between p-5 bg-white shadow-sm border border-gray-100 rounded-2xl hover:border-gray-200 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    res.bg,
                    res.color
                  )}
                >
                  {res.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    {res.type}
                  </div>
                  <div className="text-gray-900 font-bold group-hover:text-[#146ef5] transition-colors">
                    {res.title}
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-[#146ef5] group-hover:text-white transition-all">
                <Play className="w-3 h-3 ml-0.5" />
              </div>
            </Link>
          ))}
        </MotionStagger>
      </main>
    </div>
  );
}
