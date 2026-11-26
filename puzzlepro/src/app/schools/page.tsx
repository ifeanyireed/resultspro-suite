"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconWorld,
  IconTrophy,
  IconUsers,
  IconBuildingSkyscraper,
  IconCheck,
  IconSparkles,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

interface CodingCohort {
  id: string;
  campus: "Ikeja Campus" | "Lekki Campus" | "Abuja Campus";
  className: string;
  studentsCount: number;
  assignedWorldId: number;
  assignedWorldTitle: string;
  avgXp: number;
  completionRate: number;
}

const WORLDS = [
  { id: 1, title: "World 1: Jungle Logic (Sequences & Directions)" },
  { id: 2, title: "World 2: Cyber Canyon (Loops & Autonomous Sprites)" },
  { id: 3, title: "World 3: Deep Sea Rover (Conditionals & Sensors)" },
  { id: 4, title: "World 4: Orbital Station (Functions & Game Physics)" },
  { id: 5, title: "World 5: Neural Nexus (JavaScript & AI Agents)" },
  { id: 6, title: "World 6: Robotics Arena (Autonomous Capstone)" },
];

const INITIAL_COHORTS: CodingCohort[] = [
  {
    id: "coh-ikj-jss1",
    campus: "Ikeja Campus",
    className: "JSS 1 Gold",
    studentsCount: 44,
    assignedWorldId: 1,
    assignedWorldTitle: "World 1: Jungle Logic (Sequences & Directions)",
    avgXp: 1420,
    completionRate: 92,
  },
  {
    id: "coh-ikj-jss2",
    campus: "Ikeja Campus",
    className: "JSS 2 Gold",
    studentsCount: 42,
    assignedWorldId: 2,
    assignedWorldTitle: "World 2: Cyber Canyon (Loops & Autonomous Sprites)",
    avgXp: 2180,
    completionRate: 86,
  },
  {
    id: "coh-lek-jss3",
    campus: "Lekki Campus",
    className: "JSS 3 Diamond",
    studentsCount: 38,
    assignedWorldId: 3,
    assignedWorldTitle: "World 3: Deep Sea Rover (Conditionals & Sensors)",
    avgXp: 2890,
    completionRate: 81,
  },
  {
    id: "coh-abj-ss1",
    campus: "Abuja Campus",
    className: "SS 1 Science",
    studentsCount: 36,
    assignedWorldId: 4,
    assignedWorldTitle: "World 4: Orbital Station (Functions & Game Physics)",
    avgXp: 3450,
    completionRate: 78,
  },
];

export default function PuzzleProSchoolsConsole() {
  const [selectedCampus, setSelectedCampus] = useState<string>("ALL");
  const [cohorts, setCohorts] = useState<CodingCohort[]>(INITIAL_COHORTS);

  const filteredCohorts =
    selectedCampus === "ALL"
      ? cohorts
      : cohorts.filter((c) => c.campus === selectedCampus);

  const handleAssignWorld = (cohortId: string, worldId: number) => {
    const world = WORLDS.find((w) => w.id === worldId);
    if (!world) return;
    setCohorts((prev) =>
      prev.map((c) =>
        c.id === cohortId
          ? { ...c, assignedWorldId: world.id, assignedWorldTitle: world.title }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-12 space-y-8">
        {/* Zero-Duplication Architecture Header */}
        <MotionRise className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider">
              <IconSparkles className="w-3.5 h-3.5" />
              PuzzlePRO Coding &amp; Robotics · Rosters Synced Read-Only from CampusPRO
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              School Coding World &amp; Curriculum Assignment Console
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              To maintain a single System of Record across Laurel Academy, <strong>School Campuses, Classes, Student Enrolment, and Subscriptions</strong> are managed exclusively in <strong>CampusPRO</strong>. Use this console to assign Blockly Coding Adventure Worlds (1–6) to synced CampusPRO classes and track algorithmic mastery.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/"
              className="px-5 py-3 rounded-2xl bg-[#0D1060] text-white text-xs font-extrabold flex items-center gap-2 hover:bg-[#151980] transition-colors"
            >
              <IconPlayerPlay className="w-4 h-4" />
              Launch 636 Coding Adventures
            </Link>
          </div>
        </MotionRise>

        {/* Campus Filter & Summary Cards */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1565C0] flex items-center justify-center mb-3">
              <IconBuildingSkyscraper className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">3 Campuses</div>
            <div className="text-xs font-bold text-gray-500 mt-0.5">
              Ikeja · Lekki · Abuja (CampusPRO Synced)
            </div>
          </MotionRise>

          <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <IconUsers className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">160 Coders</div>
            <div className="text-xs font-bold text-gray-500 mt-0.5">
              Active across 4 synced class cohorts
            </div>
          </MotionRise>

          <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <IconWorld className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">636 Levels</div>
            <div className="text-xs font-bold text-gray-500 mt-0.5">
              6 Progressive Coding &amp; AI Worlds
            </div>
          </MotionRise>

          <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <IconTrophy className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">84.2%</div>
            <div className="text-xs font-bold text-gray-500 mt-0.5">
              Average Cohort Challenge Completion
            </div>
          </MotionRise>
        </MotionStagger>

        {/* Cohort World Assignment Table */}
        <MotionRise className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                CampusPRO Class Cohorts &amp; Assigned Coding Worlds
              </h2>
              <p className="text-xs text-gray-500">
                Assign the active PuzzlePRO Coding Adventure World for each CampusPRO class.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["ALL", "Ikeja Campus", "Lekki Campus", "Abuja Campus"].map((camp) => (
                <button
                  key={camp}
                  type="button"
                  onClick={() => setSelectedCampus(camp)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                    selectedCampus === camp
                      ? "bg-[#0D1060] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {camp === "ALL" ? "All Campuses" : camp}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-6">Campus (CampusPRO)</th>
                  <th className="py-3.5 px-6">Class Cohort</th>
                  <th className="py-3.5 px-6">Synced Students</th>
                  <th className="py-3.5 px-6">Assigned PuzzlePRO World</th>
                  <th className="py-3.5 px-6">Avg. XP</th>
                  <th className="py-3.5 px-6">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredCohorts.map((cohort) => (
                  <tr key={cohort.id} className="hover:bg-gray-50/80">
                    <td className="py-4 px-6 font-bold text-[#0D1060]">{cohort.campus}</td>
                    <td className="py-4 px-6 font-extrabold text-gray-900">{cohort.className}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1565C0] text-xs font-extrabold">
                        {cohort.studentsCount} Students
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={cohort.assignedWorldId}
                        onChange={(e) =>
                          handleAssignWorld(cohort.id, Number(e.target.value))
                        }
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#0D1060]"
                      >
                        {WORLDS.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.title}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-amber-700">
                      {cohort.avgXp.toLocaleString()} XP
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
                        <IconCheck className="w-4 h-4" />
                        {cohort.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionRise>
      </main>

      <SiteFooter />
    </div>
  );
}
