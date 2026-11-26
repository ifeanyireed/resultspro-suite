"use client";

import React from "react";
import Link from "next/link";
import {
  IconSparkles,
  IconPlayerPlay,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function PuzzleProOnboardingHandoff() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16 flex items-center">
        <MotionRise className="w-full bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1060] text-white text-[10px] font-black uppercase tracking-wider">
            <IconSparkles className="w-3.5 h-3.5" />
            Zero-Duplication Suite Onboarding
          </span>

          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            School &amp; Student Onboarding Is Unified in CampusPRO
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed">
            In the ResultsPRO Suite, you never have to register schools, campuses, classes, or student rosters twice. Once your school or family account is provisioned in <strong>CampusPRO</strong>, all student profiles and class cohorts automatically sync into <strong>PuzzlePRO</strong>, <strong>ClassroomPRO</strong>, <strong>TutorsPRO</strong>, and <strong>ResultsPRO</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1565C0] flex items-center justify-center">
                <IconSchool className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold text-gray-900">
                For School Administrators &amp; Teachers
              </h2>
              <p className="text-xs text-gray-500">
                Assign Coding Worlds (Worlds 1–6) to your CampusPRO-synced classes and monitor cohort XP.
              </p>
              <Link
                href="/schools"
                className="inline-block pt-1 text-xs font-extrabold text-[#1565C0] hover:underline"
              >
                Open School Coding Console →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <IconUsers className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold text-gray-900">
                For Parents &amp; Guardians
              </h2>
              <p className="text-xs text-gray-500">
                Track your ward&apos;s coding level progression, algorithmic badges, and game projects.
              </p>
              <Link
                href="/families"
                className="inline-block pt-1 text-xs font-extrabold text-emerald-700 hover:underline"
              >
                Open Family Coding Tracker →
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-2xl bg-[#0D1060] text-white text-xs font-extrabold flex items-center gap-2 hover:bg-[#151980] transition-colors"
            >
              <IconPlayerPlay className="w-4 h-4" />
              Launch PuzzlePRO Coding Studio
            </Link>
          </div>
        </MotionRise>
      </main>

      <SiteFooter />
    </div>
  );
}
