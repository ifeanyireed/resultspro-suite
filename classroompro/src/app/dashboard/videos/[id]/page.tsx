"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconArrowLeft as ArrowLeft,
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconBrandYoutube as YoutubeIcon,
  IconExternalLink as ExternalLink,
  IconCheck as Check,
  IconClock as Clock,
  IconSparkles as Sparkles,
} from "@tabler/icons-react";
import { Button } from "../../../../components/ui/button";
import api from "../../../../lib/api";
import { MotionRise } from "../../../../components/ScrollRiseProvider";

function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "NybHckSEQBI";
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = urlOrId.match(regExp);
  if (match && match[1]) return match[1];
  if (urlOrId.length === 11) return urlOrId;
  return "NybHckSEQBI";
}

export default function VideoPlayerPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error("Failed to load video lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);

  if (loading || !video) {
    return <div className="p-8 text-sm text-gray-500">Loading Linked YouTube Video Lesson...</div>;
  }

  const youtubeId = extractYouTubeId(video.youtubeId || video.youtubeUrl || "NybHckSEQBI");
  const youtubeWatchUrl = video.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <div className="space-y-6 py-4 max-w-6xl mx-auto">
      {/* Top Bar */}
      <MotionRise className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/videos"
            className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[11px] font-extrabold text-[#146ef5] uppercase tracking-wider">
              {video.topic?.subject?.name || "Mathematics"} · Term {video.topic?.term || 2} · Week {video.topic?.week || 3}
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900">{video.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={youtubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-extrabold"
            >
              <YoutubeIcon className="w-4 h-4 mr-1.5 text-red-600" />
              Watch on YouTube
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </a>
        </div>
      </MotionRise>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* YouTube Embed Player & Summary */}
        <MotionRise className="lg:col-span-2 space-y-6">
          <div className="bg-[#0D1060] rounded-3xl overflow-hidden shadow-lg border border-gray-200 aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src="/photo02.jpeg"
                  alt={video.instructor || "Mr. Tunde Ogunleye"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">
                    Curated by {video.instructor || "Mr. Tunde Ogunleye"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Laurel Academy · Linked YouTube NERDC Video Lesson
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <Clock className="w-4 h-4" /> Duration: {video.duration || "14:20"}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-gray-900">
                Lesson Summary &amp; Key Learning Objectives
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">{video.summary}</p>
              <ul className="space-y-1.5 pt-2">
                {(video.keyTakeaways || [
                  "Identify the Lowest Common Multiple (LCM) of algebraic denominators.",
                  "Combine numerators accurately and simplify common factors.",
                  "Translate real-world commercial word problems into algebraic fractions.",
                ]).map((pt: string, i: number) => (
                  <li key={i} className="text-xs text-gray-700 font-semibold flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MotionRise>

        {/* Companion Multi-Modal Learning Assets for This Topic */}
        <MotionRise className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Companion Topic Resources
            </span>
            <h3 className="text-base font-extrabold text-gray-900">
              Complete the Topic Mastery Loop
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every linked YouTube lesson is paired with a Markdown Lesson Note, Spaced-Repetition Flashcards, and a Practice CBT Quiz.
            </p>

            <div className="space-y-2.5 pt-1">
              <Link
                href={`/dashboard/notes/${video.noteId || "note-math-1"}`}
                className="p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-50 border border-blue-200/60 flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#146ef5] text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-900">Read Markdown Lesson Note</p>
                  <p className="text-[11px] text-gray-500">Worked examples &amp; diagrams</p>
                </div>
              </Link>

              <Link
                href={`/dashboard/flashcards/${video.flashcardSetId || "fc-math-1"}`}
                className="p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/60 flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-900">Practice SRS Flashcards</p>
                  <p className="text-[11px] text-gray-500">Memorize key formulae &amp; rules</p>
                </div>
              </Link>

              <Link
                href={`/dashboard/quizzes/${video.quizId || "quiz-math-1"}`}
                className="p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200/60 flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-900">Take Topic Diagnostic Quiz</p>
                  <p className="text-[11px] text-gray-500">Test mastery &amp; earn XP</p>
                </div>
              </Link>
            </div>
          </div>
        </MotionRise>
      </div>
    </div>
  );
}
