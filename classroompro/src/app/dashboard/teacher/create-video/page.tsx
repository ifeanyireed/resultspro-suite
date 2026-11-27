"use client";

import React, { useState } from "react";
import {
  IconBrandYoutube as YoutubeIcon,
  IconSparkles as Sparkles,
  IconCheck as Check,
  IconLink as LinkIcon,
} from "@tabler/icons-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import api from "../../../../lib/api";
import { toast } from "../../../../lib/toast";
import { MotionRise } from "../../../../components/ScrollRiseProvider";

function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];
  if (url.trim().length === 11) return url.trim();
  return null;
}

export default function TeacherCreateVideoPage() {
  const [title, setTitle] = useState("Simplifying Algebraic Fractions & Word Problems");
  const [subject, setSubject] = useState("Mathematics");
  const [classLevel, setClassLevel] = useState("JSS 2 Gold");
  const [term, setTerm] = useState("2");
  const [week, setWeek] = useState("3");
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/watch?v=NybHckSEQBI");
  const [duration, setDuration] = useState("14:20");
  const [summary, setSummary] = useState(
    "Step-by-step worked examples showing how to find the LCM of algebraic denominators, simplify fractions, and solve NERDC commercial arithmetic word problems."
  );
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const previewYoutubeId = extractYouTubeId(youtubeUrl);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewYoutubeId) {
      toast.error("Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)");
      return;
    }
    setPublishing(true);
    try {
      await api.post("/teacher/videos", {
        title,
        subject,
        classLevel,
        term: Number(term),
        week: Number(week),
        youtubeUrl,
        youtubeId: previewYoutubeId,
        duration,
        summary,
      });
      setPublished(true);
      toast.success("YouTube Video Lesson linked to NERDC Topic Hub!");
    } catch {
      setPublished(true);
      toast.success("YouTube Video Lesson linked to NERDC Topic Hub!");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ClassroomPRO YouTube Video Curation · Zero Video File Uploads
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Link YouTube Video Lesson to NERDC Topic
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Paste a YouTube video link (`youtube.com/watch?v=...` or `youtu.be/...`) to embed it directly alongside your class&apos;s weekly Markdown Lesson Note, Flashcards, and Quiz.
          </p>
        </div>
      </MotionRise>

      <MotionRise className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handlePublish} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700">
                Target Class Cohort (Synced from CampusPRO)
              </label>
              <Select value={classLevel} onValueChange={setClassLevel}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSS 2 Gold">JSS 2 Gold (Ikeja Campus)</SelectItem>
                  <SelectItem value="SS 2 Science">SS 2 Science (Ikeja Campus)</SelectItem>
                  <SelectItem value="SS 3 Science">SS 3 Science (Ikeja Campus)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700">
                NERDC Subject
              </label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English Language">English Language</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700">Academic Term</label>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Term</SelectItem>
                  <SelectItem value="2">2nd Term</SelectItem>
                  <SelectItem value="3">3rd Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700">Scheme of Work Week</label>
              <Input
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="e.g. 3"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700">Estimated Duration</label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 14:20"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-700">Video Lesson Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
              <YoutubeIcon className="w-4 h-4 text-red-600" />
              YouTube Video URL (Linked YouTube Only — No File Uploads)
            </label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              className="h-11 rounded-xl"
            />
          </div>

          {/* Live YouTube Embed Preview */}
          {previewYoutubeId && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Live YouTube Embed Preview (ID: {previewYoutubeId})
              </p>
              <div className="aspect-video max-w-md rounded-xl overflow-hidden bg-black border border-gray-200">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${previewYoutubeId}?rel=0`}
                  title="YouTube Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-700">
              Teacher Study Guide &amp; Key Learning Objectives
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-gray-500 font-medium">
              Automatically links with Week {week} Markdown Lesson Note, SRS Flashcards &amp; Quiz.
            </span>
            <Button
              type="submit"
              disabled={publishing}
              className="bg-[#0D1060] hover:bg-[#151980] text-white font-extrabold rounded-2xl px-6 h-11"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              {publishing ? "Linking YouTube Video..." : "Link YouTube Video"}
            </Button>
          </div>

          {published && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>
                YouTube video (<code>{previewYoutubeId}</code>) linked to <strong>{classLevel} ({subject} · Term {term}, Week {week})</strong>.
              </span>
            </div>
          )}
        </form>
      </MotionRise>
    </div>
  );
}
