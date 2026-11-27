"use client";

import React, { useEffect, useState } from "react";
import {
  IconBook as BookOpen,
  IconSearch as Search,
  IconCheck as Check,
  IconSparkles as Sparkles,
  IconAlertCircle as AlertCircle,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api from "@/lib/api";

export default function NerdcContentModerationPage() {
  const [query, setQuery] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await api.get("/subjects");
        setSubjects(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.error ||
            "Unable to load subjects from service_campuspro."
        );
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  const filtered = subjects.filter((s) =>
    (s.name || s.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 py-4">
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ClassroomPRO Content Moderation · Subject Definitions Synced from service_campuspro
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">
            NERDC Syllabus &amp; Learning Content Repository
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Subject definitions and teacher allocations are read directly from <strong>CampusPRO</strong> (<code>/api/v1/campus/subjects</code>).
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter CampusPRO subjects..."
            className="pl-10 bg-gray-50 border-gray-200 rounded-2xl text-gray-900"
          />
        </div>
      </MotionRise>

      {loading ? (
        <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center text-xs text-gray-500 font-semibold">
          Loading subject definitions from service_campuspro...
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 rounded-3xl p-6 border border-rose-200 text-xs text-rose-900 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center space-y-2">
          <p className="text-sm font-extrabold text-gray-900">
            No subjects returned from service_campuspro.
          </p>
          <p className="text-xs text-gray-500">
            Configure academic subjects in <strong>CampusPRO</strong> to moderate their ClassroomPRO study packs.
          </p>
        </div>
      ) : (
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((sub, idx) => (
            <MotionRise
              key={sub.id || idx}
              delay={idx * 0.04}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {sub.curriculum || "NERDC"}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  {sub.name || sub.title}
                </h3>
                <p className="text-xs font-bold text-gray-500 mt-0.5">
                  {sub.department || sub.category || sub.code} ·{" "}
                  {sub.level_category || "School-Wide"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="font-extrabold text-gray-900">
                    {sub.topicsCount ?? 0}
                  </span>{" "}
                  <span className="text-gray-500">Pack Lessons</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="font-extrabold text-[#146ef5]">
                    {sub.tutors_count ?? 0}
                  </span>{" "}
                  <span className="text-gray-500">Assigned Teachers</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 col-span-2">
                  <span className="font-extrabold text-emerald-700">
                    {sub.arms_count ?? 0}
                  </span>{" "}
                  <span className="text-gray-500">
                    CampusPRO Class Arms Allocated
                  </span>
                </div>
              </div>
            </MotionRise>
          ))}
        </MotionStagger>
      )}
    </div>
  );
}
