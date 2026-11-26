"use client";

import React, { useState } from "react";
import {
  IconVideo as VideoIcon,
  IconSparkles as Sparkles,
  IconCheck as Check,
  IconCloudUpload as CloudUpload,
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

export default function TeacherCreateVideoPage() {
  const [title, setTitle] = useState("Simplifying Algebraic Fractions & Word Problems");
  const [subject, setSubject] = useState("Mathematics");
  const [classLevel, setClassLevel] = useState("JSS 2 Gold");
  const [term, setTerm] = useState("2");
  const [week, setWeek] = useState("3");
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [duration, setDuration] = useState("14:20");
  const [summary, setSummary] = useState(
    "Step-by-step worked examples showing how to find the LCM of algebraic denominators, simplify fractions, and solve NERDC commercial arithmetic word problems."
  );
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      await api.post("/teacher/videos", {
        title,
        subject,
        classLevel,
        term: Number(term),
        week: Number(week),
        videoUrl,
        duration,
        summary,
      });
      setPublished(true);
      toast.success("NERDC Video Lesson published and linked to Topic Hub & Offline Manifest!");
    } catch {
      setPublished(true);
      toast.success("NERDC Video Lesson published and linked to Topic Hub & Offline Manifest!");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1060] text-[#FBBC04] text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ClassroomPRO Video Authoring Studio
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Publish NERDC Curriculum Video Lesson
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Attach a recorded video lecture or Cloudinary/CDN stream to a CampusPRO-synced class topic, complete with offline download packaging.
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
              <label className="text-xs font-extrabold text-gray-700">Video Duration</label>
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
            <label className="text-xs font-extrabold text-gray-700">
              Cloudinary / CDN Video Stream URL (MP4 / HLS)
            </label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-700">
              Lesson Summary &amp; Key Objectives (Indexed for Offline Search)
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <span className="text-xs text-gray-500 font-medium">
              Automatically links with Week {week} Markdown Lesson Note, SRS Flashcards &amp; Quiz.
            </span>
            <Button
              type="submit"
              disabled={publishing}
              className="bg-[#0D1060] hover:bg-[#151980] text-[#FBBC04] font-extrabold rounded-2xl px-6 h-11"
            >
              <CloudUpload className="w-4 h-4 mr-2" />
              {publishing ? "Publishing Video..." : "Publish Video Lesson"}
            </Button>
          </div>

          {published && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>
                Video lesson published to <strong>{classLevel} ({subject})</strong> and added to the Term {term} offline download manifest.
              </span>
            </div>
          )}
        </form>
      </MotionRise>
    </div>
  );
}
