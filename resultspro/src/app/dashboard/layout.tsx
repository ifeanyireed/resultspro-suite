"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlayCircleIcon,
  ChartBarIcon,
  CameraIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  AcademicCapIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { ModernDashboardLayout } from "@/components/layout/ModernDashboardLayout";
import { CampusProProvider, useCampusProContext } from "@/context/CampusProContext";

interface RoleProfile {
  id: string;
  roleName: string;
  fullName: string;
  subtitle: string;
  avatar: string;
}

function ResultsProDashboardShell({ children }: { children: React.ReactNode }) {
  const { schoolName, branches, staff, parentProfile } = useCampusProContext();

  const roles: RoleProfile[] = useMemo(() => {
    const branchNames = branches.length > 0
      ? branches.map((b) => b.name.split("·")[0].trim()).join(", ")
      : "Multi-Campus Network";

    const principalStaff =
      staff.find((s) => s.designation?.toLowerCase().includes("principal") || s.designation?.toLowerCase().includes("hod")) ||
      staff[0];
    const teacherStaff =
      staff.find((s) => s.cadre === "TEACHING" && s.id !== principalStaff?.id) ||
      staff[1] ||
      staff[0];

    const mainPrincipalName =
      branches.find((b) => b.is_main)?.principal_name ||
      (principalStaff ? `${principalStaff.title} ${principalStaff.full_name}`.trim() : "Dr. Olufemi Adeleke");

    const teacherFullName = teacherStaff
      ? `${teacherStaff.title} ${teacherStaff.full_name}`.trim()
      : "Engr. David Adeleke";
    const teacherSubtitle = teacherStaff
      ? `${teacherStaff.designation} · ${teacherStaff.assigned_arm_name || teacherStaff.department}`
      : `STEM & Mathematics Lead · ${branches[0]?.name || "Main Campus"}`;

    const activeWard = parentProfile.activeWard || parentProfile.wards[0];
    const parentName = parentProfile.name || "Mrs. Sarah Adeleke-Okonkwo";
    const parentSubtitle = activeWard
      ? `Parent of ${activeWard.name} (${activeWard.class_name} ${activeWard.arm_name})`
      : `Verified Guardian · ${schoolName}`;

    return [
      {
        id: "results-officer",
        roleName: "Principal / Results Officer",
        fullName: mainPrincipalName,
        subtitle: `${schoolName} (${branchNames})`,
        avatar: "/photo01.jpeg",
      },
      {
        id: "subject-teacher",
        roleName: "Subject Teacher",
        fullName: teacherFullName,
        subtitle: teacherSubtitle,
        avatar: "/photo02.jpeg",
      },
      {
        id: "parent-guardian",
        roleName: "Parent / Guardian",
        fullName: parentName,
        subtitle: parentSubtitle,
        avatar: "/photo03.jpeg",
      },
    ];
  }, [schoolName, branches, staff, parentProfile]);

  const [selectedRoleId, setSelectedRoleId] = useState<string>("results-officer");
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const activeProfile = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId]
  );

  const navItems = [
    { label: "★ 9-Step Webinar Live Demo", icon: PlayCircleIcon, href: "/dashboard" },
    { label: "Multi-Campus AI Officer", icon: ChartBarIcon, href: "/dashboard" },
    { label: "AI Marksheet OCR & Voice", icon: CameraIcon, href: "/dashboard" },
    { label: "Pre-Publication AI Auditor", icon: ShieldExclamationIcon, href: "/dashboard" },
    { label: "AI Report Card Comments", icon: SparklesIcon, href: "/dashboard" },
    { label: "Parent AI Result & Remedial", icon: AcademicCapIcon, href: "/dashboard" },
  ];

  const branchSummaryText =
    branches.length > 0
      ? `${branches.map((b) => b.name).join(" · ")} (CampusPRO Live Sync)`
      : "CampusPRO System-of-Record Connected";

  return (
    <ModernDashboardLayout
      sidebarContent={
        <>
          <div>
            {/* Logo */}
            <div className="px-8 mb-6">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="ResultsPRO"
                  width={300}
                  height={80}
                  className="w-auto h-20 object-contain"
                />
              </Link>
            </div>

            {/* AI Intelligence Pillars */}
            <div className="px-6 space-y-1">
              <p className="px-2 text-xs font-extrabold text-gray-400 tracking-wider uppercase mb-3">
                ResultsPRO AI Engine
              </p>
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 text-sm px-4 py-2.5 rounded-xl font-bold transition-colors ${
                      idx === 0
                        ? "bg-[#0D1060] text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* System-of-Record Boundaries */}
            <div className="px-6 mt-8 space-y-2">
              <p className="px-2 text-[11px] font-extrabold text-gray-400 tracking-wider uppercase">
                Connected Suite Boundaries
              </p>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-900">CampusPRO</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#0D1060] text-white">
                    ERP Record
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Owns Manage Teachers, Students, Classes, Attendance, Fees &amp; All Messaging.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-900">ClassroomPRO</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#1565C0] text-white">
                    Learning Hub
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Owns NERDC Notes, AI Stories, Flashcards, CBT Quizzes &amp; Remedial Packs.
                </p>
              </div>
            </div>
          </div>

          {/* Active Persona Card (100% read from CampusPRO) */}
          <div className="px-6 mt-6">
            <div
              className="rounded-3xl p-5 text-white relative overflow-hidden shadow-lg bg-cover bg-center"
              style={{ backgroundImage: "url('/photo07.jpeg')" }}
            >
              <div className="absolute inset-0 bg-[#0D1060]/80 mix-blend-multiply" />
              <div className="relative z-10 space-y-2">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FBBC04] text-[#0D1060]">
                  {activeProfile.roleName}
                </span>
                <h4 className="font-extrabold text-sm leading-tight">{activeProfile.fullName}</h4>
                <p className="text-[11px] text-gray-200">{activeProfile.subtitle}</p>
              </div>
            </div>
          </div>
        </>
      }
      headerContent={
        <>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-[#0D1060] text-white text-xs font-extrabold">
              {schoolName}
            </span>
            <span className="hidden md:inline text-xs font-bold text-gray-500">
              {branchSummaryText}
            </span>
          </div>

          {/* Role Switcher in Header / Floating */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSwitcherOpen((prev) => !prev)}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:border-[#0D1060] transition-all cursor-pointer"
            >
              <img
                src={activeProfile.avatar}
                alt={activeProfile.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#1565C0]">
                  Switch Role · {activeProfile.roleName}
                </p>
                <p className="text-xs font-extrabold text-gray-900">{activeProfile.fullName}</p>
              </div>
              <ArrowsRightLeftIcon className="w-4 h-4 text-[#0D1060]" />
            </button>

            {switcherOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 bg-[#0D1060] text-white flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Switch CampusPRO Persona
                  </span>
                </div>
                <div className="p-2 space-y-1">
                  {roles.map((prof) => {
                    const isCurrent = prof.id === activeProfile.id;
                    return (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => {
                          setSelectedRoleId(prof.id);
                          setSwitcherOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                          isCurrent ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={prof.avatar}
                          alt={prof.fullName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-gray-900 truncate">{prof.roleName}</p>
                          <p className="text-[11px] text-gray-500 truncate">{prof.fullName}</p>
                        </div>
                        {isCurrent && <CheckIcon className="w-4 h-4 text-[#1565C0]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      }
    >
      {children}
    </ModernDashboardLayout>
  );
}

export default function ResultsProDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CampusProProvider>
      <ResultsProDashboardShell>{children}</ResultsProDashboardShell>
    </CampusProProvider>
  );
}
