"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  IconBrandYoutube as YoutubeIcon,
  IconSearch as Search,
  IconPlayerPlay as Play,
  IconClock as Clock,
  IconEye as Eye,
  IconSparkles as Sparkles,
} from "@tabler/icons-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/useAuthStore";
import { MotionRise, MotionStagger } from "../../../components/ScrollRiseProvider";

export default function VideosListPage() {
  const user = useAuthStore((state) => state.user);
  const [videos, setVideos] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [videosRes, subjectsRes] = await Promise.all([
          api.get(`/videos${user?.class_id ? `?classId=${user.class_id}` : ""}`),
          api.get("/subjects"),
        ]);
        setVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.class_id]);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesSearch =
        (v.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (v.topic?.subject?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (v.topic?.title || "").toLowerCase().includes(search.toLowerCase());
      const matchesSubject =
        selectedSubjectId === "all" || v.topic?.subjectId === selectedSubjectId;
      const matchesTerm =
        selectedTerm === "all" || String(v.topic?.term || "1") === selectedTerm;
      return matchesSearch && matchesSubject && matchesTerm;
    });
  }, [videos, search, selectedSubjectId, selectedTerm]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ClassroomPRO Video Library · Curated YouTube NERDC Lectures
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            NERDC Educational Video Lessons
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Watch teacher-linked YouTube video explanations mapped directly to your weekly lesson notes, flashcards, and practice quizzes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search YouTube lessons..."
              className="pl-10 h-11 rounded-2xl"
            />
          </div>

          <div className="w-44">
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="All Terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="1">1st Term</SelectItem>
                <SelectItem value="2">2nd Term</SelectItem>
                <SelectItem value="3">3rd Term</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </MotionRise>

      {/* Video Cards Grid */}
      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, idx) => {
          const ytThumb =
            video.thumbnailUrl ||
            (video.youtubeId
              ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
              : "/photo04.jpeg");
          return (
            <MotionRise
              key={video.id}
              delay={idx * 0.05}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:border-gray-200 transition-all"
            >
              {/* YouTube Thumbnail Preview */}
              <Link
                href={`/dashboard/videos/${video.id}`}
                className="relative aspect-video bg-[#0D1060] overflow-hidden block"
              >
                <img
                  src={ytThumb}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1060]/80 via-[#0D1060]/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#146ef5]/90 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  {video.topic?.subject?.name || "NERDC"} · Term {video.topic?.term || 2}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center gap-1">
                  <YoutubeIcon className="w-3.5 h-3.5" /> YouTube
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 text-white text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {video.duration || "14:20"}
                </div>
              </Link>

              {/* Video Metadata */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span>
                      Week {video.topic?.week || 3} · {video.topic?.title}
                    </span>
                  </div>
                  <Link href={`/dashboard/videos/${video.id}`}>
                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#146ef5] transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-2">{video.summary}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-gray-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {video.viewsCount || 184} views
                    </span>
                    <span>{video.instructor || "Mr. Tunde Ogunleye"}</span>
                  </div>
                  <Link href={`/dashboard/videos/${video.id}`}>
                    <Button
                      size="sm"
                      className="rounded-xl text-xs font-extrabold bg-[#0D1060] hover:bg-[#151980] text-white"
                    >
                      Watch
                    </Button>
                  </Link>
                </div>
              </div>
            </MotionRise>
          );
        })}
      </MotionStagger>

      {filteredVideos.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 space-y-3">
          <YoutubeIcon className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-extrabold text-gray-900">
            No linked YouTube lessons match your filter
          </h3>
          <p className="text-xs text-gray-500">Try clearing the subject or term filter.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setSelectedSubjectId("all");
              setSelectedTerm("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
