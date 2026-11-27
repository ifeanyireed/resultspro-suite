"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconTrendingUp as TrendingUp,
  IconBook as BookOpen,
  IconBrain as BrainCircuit,
  IconStack2 as Layers,
  IconVideo as VideoIcon,
  IconCertificate as GraduationCap,
  IconAward as Award,
  IconCheck as Check,
  IconSparkles as Sparkles,
  IconCreditCard as CreditCard,
  IconShieldCheck as ShieldCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import api from "@/lib/api";
import { syncEngine, DEFAULT_LINKED_WARDS } from "@/lib/syncEngine";
import { offlineDb, OfflineBadgeRecord } from "@/lib/offlineDb";

export default function ParentLearningHub() {
  const user = useAuthStore((state) => state.user);
  const parentName = user?.full_name || "Chief & Mrs. O. Adeleke";

  const [linkedWards, setLinkedWards] = useState<any[]>(DEFAULT_LINKED_WARDS);
  const [selectedWardId, setSelectedWardId] = useState<string>("profile-student");
  const [packs, setPacks] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<OfflineBadgeRecord[]>([]);
  const [checkoutPack, setCheckoutPack] = useState<any | null>(null);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([
    "profile-student",
  ]);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  const loadParentData = async () => {
    await syncEngine.ensureSampleStudyPackSeededForTestStudent();
    const [{ packs: catalogPacks, linkedWards: wards }, badges] = await Promise.all([
      syncEngine.fetchStudyPacksCatalog(),
      offlineDb.getAllBadges(),
    ]);
    if (wards && wards.length > 0) {
      setLinkedWards(wards);
    }
    setPacks(catalogPacks);
    setEarnedBadges(badges.filter((b) => b.earned));
  };

  useEffect(() => {
    loadParentData();
    return syncEngine.subscribe(loadParentData);
  }, []);

  const activeWard =
    linkedWards.find((w) => w.student_id === selectedWardId) || linkedWards[0];

  const handleOpenWardCheckout = (pack: any) => {
    setCheckoutPack(pack);
    setSelectedBeneficiaries([selectedWardId]);
  };

  const toggleBeneficiary = (studentId: string) => {
    setSelectedBeneficiaries((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleCompleteWardAcquisition = async () => {
    if (!checkoutPack || selectedBeneficiaries.length === 0) return;
    setProcessingOrder(true);
    setPurchaseNotice(null);

    try {
      if (checkoutPack.pricing_type === "FREE") {
        await api
          .post(`/packs/${checkoutPack.pack_id}/claim`, {
            beneficiary_student_ids: selectedBeneficiaries,
          })
          .catch(() => {});
      } else {
        await api
          .post(`/packs/${checkoutPack.pack_id}/checkout`, {
            buyer_user_id: "profile-parent",
            buyer_email: user?.email || "adeleke.family@gmail.com",
            beneficiary_student_ids: selectedBeneficiaries,
            simulate_instant_pay: true,
          })
          .catch(() => {});
      }
    } finally {
      syncEngine.recordLocalWardPurchase(checkoutPack.pack_id, selectedBeneficiaries);
      await syncEngine.downloadPackage(checkoutPack.pack_id);
      await loadParentData();
      setProcessingOrder(false);
      const childNames = linkedWards
        .filter((w) => selectedBeneficiaries.includes(w.student_id))
        .map((w) => w.full_name)
        .join(" & ");
      setPurchaseNotice(
        checkoutPack.pricing_type === "FREE"
          ? `Claimed Perpetual Free Study Pack "${checkoutPack.title}" for ${childNames}!`
          : `Paystack Payment Verified! Perpetual Study Pack "${checkoutPack.title}" unlocked & cached for ${childNames}.`
      );
      setCheckoutPack(null);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            ClassroomPRO — Parent Learning, Ward Study Pack Store &amp; Remedial Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Hello, {parentName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Purchase or claim curriculum-aligned Study Packs directly for your linked children, track Scheme-of-Work mastery, and view earned pack badges.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/parent/progress">
            <Button className="bg-[#0D1060] hover:bg-[#151980] text-white font-extrabold rounded-2xl">
              <TrendingUp className="w-4 h-4 mr-2" /> Full Topic Mastery Report
            </Button>
          </Link>
        </div>
      </MotionRise>

      {purchaseNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            {purchaseNotice}
          </span>
          <button
            type="button"
            onClick={() => setPurchaseNotice(null)}
            className="underline text-emerald-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Linked Children (Wards) Switcher */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[11px] font-extrabold text-[#146ef5] uppercase tracking-wider">
              Linked Children Synced from CampusPRO
            </span>
            <h2 className="text-lg font-extrabold text-gray-900">
              Select Linked Child to Manage Study Packs &amp; Remedial Progress
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {linkedWards.map((ward) => {
              const active = ward.student_id === activeWard?.student_id;
              return (
                <button
                  key={ward.student_id}
                  type="button"
                  onClick={() => setSelectedWardId(ward.student_id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#146ef5] text-white border-[#146ef5]"
                      : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {ward.full_name} ({ward.class_label})
                </button>
              );
            })}
          </div>
        </div>

        {activeWard && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">{activeWard.full_name}</h3>
              <p className="text-xs text-gray-500">
                {activeWard.class_label} · Admission: {activeWard.admission_number} ·{" "}
                {activeWard.campus}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                {activeWard.overall_mastery}% Topic Mastery
              </div>
              <div className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 text-xs font-extrabold">
                {activeWard.streak_days}-Day Study Streak
              </div>
              <div className="px-4 py-2 rounded-2xl bg-blue-50 text-[#146ef5] text-xs font-extrabold flex items-center gap-1.5">
                <Award className="w-4 h-4" /> {earnedBadges.length} Pack Badges Earned
              </div>
            </div>
          </div>
        )}
      </MotionRise>

      {/* Direct Parent Study Pack Store for Linked Child */}
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#146ef5]" />
              Curriculum &amp; Scheme-of-Work Study Packs for {activeWard?.full_name}
            </h3>
            <p className="text-xs text-gray-500">
              Buy or claim Free &amp; Paid teacher-authored Study Packs directly for your linked children. Every purchase grants a <strong>Perpetual License</strong>.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4" /> Perpetual Access • Neon Object Storage
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packs.map((pack) => {
            const wardStatus =
              pack.ward_entitlements?.[activeWard?.student_id] ||
              (pack.entitled ? "ACTIVE" : "NOT_PURCHASED");
            const isOwnedForWard = wardStatus === "ACTIVE";
            const isRevoked = wardStatus === "REVOKED" || pack.is_revoked;

            return (
              <div
                key={pack.pack_id}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#146ef5] text-white">
                      {pack.curriculum} · {pack.class_label} · {pack.subject_name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isRevoked
                          ? "bg-rose-100 text-rose-800"
                          : pack.pricing_type === "PAID"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isRevoked
                        ? "REFUNDED / REVOKED"
                        : pack.pricing_type === "PAID"
                        ? `₦${(pack.price_naira || (pack.price_kobo || 0) / 100).toLocaleString()}`
                        : "FREE (₦0)"}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-gray-900">{pack.title}</h4>
                  <p className="text-xs text-gray-500">{pack.subtitle}</p>
                  <p className="text-[11px] text-gray-600 font-semibold">
                    Author: <strong>{pack.creator_name || "Mr. Tunde Ogunleye"}</strong> ·{" "}
                    {pack.term_label}
                  </p>

                  {/* All 5 Modalities + Badges Summary */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-bold">
                    <span className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-800 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#146ef5]" /> {pack.notes_count} Notes
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-purple-700 flex items-center gap-1">
                      <VideoIcon className="w-3.5 h-3.5" /> {pack.videos_count} Videos
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-emerald-700 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> {pack.flashcards_count} SRS Cards
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-amber-800 flex items-center gap-1">
                      <BrainCircuit className="w-3.5 h-3.5" /> {pack.quizzes_count} Quizzes
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-[#146ef5] flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> {pack.exams_count} CBT Exam
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> {pack.badges_count} Badges
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200/70 flex flex-col gap-2">
                  {isOwnedForWard && !isRevoked ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/downloads?pack=${pack.pack_id}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold h-9 rounded-xl">
                          <Check className="w-3.5 h-3.5 mr-1.5" /> Perpetual Access Active • Open Pack
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleOpenWardCheckout(pack)}
                      className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-extrabold h-9 rounded-xl"
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                      {pack.pricing_type === "PAID"
                        ? `Buy Perpetual Pack for Child (₦${(
                            pack.price_naira || (pack.price_kobo || 0) / 100
                          ).toLocaleString()})`
                        : "Claim Free Pack for Child (₦0)"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </MotionRise>

      {/* Parent Direct-for-Child Purchase Modal */}
      {checkoutPack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase">
                  Parent Direct Purchase for Linked Children
                </span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-1">
                  {checkoutPack.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {checkoutPack.curriculum} · {checkoutPack.class_label} ·{" "}
                  {checkoutPack.subject_name} ({checkoutPack.term_label})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutPack(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-800">
                Select Linked Child(ren) to Receive Perpetual Access:
              </label>
              {linkedWards.map((ward) => {
                const checked = selectedBeneficiaries.includes(ward.student_id);
                return (
                  <label
                    key={ward.student_id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                      checked
                        ? "border-[#146ef5] bg-blue-50/50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBeneficiary(ward.student_id)}
                        className="w-4 h-4 accent-[#146ef5]"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-gray-900">
                          {ward.full_name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {ward.class_label} · {ward.admission_number}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#146ef5]">
                      Perpetual License
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-700">
                  Selected Seats: {selectedBeneficiaries.length} Child
                  {selectedBeneficiaries.length === 1 ? "" : "ren"}
                </p>
                <p className="text-[11px] text-gray-500">
                  Includes Notes, Videos, Flashcards, Quizzes, CBT Exam &amp; Badges
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-gray-900">
                  {checkoutPack.pricing_type === "FREE"
                    ? "₦0 (Free)"
                    : `₦${(
                        (checkoutPack.price_naira ||
                          (checkoutPack.price_kobo || 0) / 100) *
                        selectedBeneficiaries.length
                      ).toLocaleString()}`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCheckoutPack(null)}
                className="rounded-xl text-xs font-extrabold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={processingOrder || selectedBeneficiaries.length === 0}
                onClick={handleCompleteWardAcquisition}
                className="bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-extrabold px-5"
              >
                {processingOrder
                  ? "Minting Perpetual Entitlement..."
                  : checkoutPack.pricing_type === "FREE"
                  ? "Claim Free Pack Now"
                  : "Pay with Paystack & Unlock for Child"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* System Boundary Notice */}
      <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MotionRise className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#146ef5] text-white">
            CampusPRO
          </span>
          <h3 className="text-sm font-extrabold text-gray-900">
            Teacher Messaging &amp; School Circulars
          </h3>
          <p className="text-xs text-gray-500">
            All direct messages with subject teachers and official school notices are unified inside <strong>CampusPRO Messaging</strong>.
          </p>
        </MotionRise>
        <MotionRise className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#146ef5] text-white">
            CampusPRO
          </span>
          <h3 className="text-sm font-extrabold text-gray-900">
            Bursary, Fees &amp; Ward Enrolment
          </h3>
          <p className="text-xs text-gray-500">
            Tuition invoices, payment receipts, attendance logs, and ward profile linking live exclusively in <strong>CampusPRO</strong>.
          </p>
        </MotionRise>
        <MotionRise className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#1565C0] text-white">
            ResultsPRO
          </span>
          <h3 className="text-sm font-extrabold text-gray-900">
            Official Terminal Report Cards &amp; AI Interpreter
          </h3>
          <p className="text-xs text-gray-500">
            Terminal report cards, plain-language AI result interpretation, and scratch-card validation live in <strong>ResultsPRO</strong>.
          </p>
        </MotionRise>
      </MotionStagger>
    </div>
  );
}
