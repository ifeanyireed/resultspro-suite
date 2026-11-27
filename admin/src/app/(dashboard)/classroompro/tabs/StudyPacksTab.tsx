'use client';

import React, { useState } from 'react';
import { BookOpen, Video, Layers, FileText, Award, Plus, CheckCircle2, Trash2, ShieldCheck } from 'lucide-react';

interface AdminPackItem {
  pack_id: string;
  title: string;
  curriculum: string;
  class_label: string;
  subject_name: string;
  term_label: string;
  creator_name: string;
  creator_role: string;
  pricing_type: 'FREE' | 'PAID';
  price_naira: number;
  moderation_status: 'PUBLISHED' | 'PENDING_APPROVAL' | 'ARCHIVED';
  neon_storage_key: string;
  notes_count: number;
  videos_count: number;
  flashcards_count: number;
  quizzes_count: number;
  exams_count: number;
  badges_count: number;
  total_xp_reward: number;
}

const INITIAL_PACKS: AdminPackItem[] = [
  {
    pack_id: 'pkg-nerdc-jss2-math-t2',
    title: 'NERDC JSS 2 Mathematics — Second Term Complete Scheme Study Pack',
    curriculum: 'NERDC',
    class_label: 'JSS 2',
    subject_name: 'Mathematics',
    term_label: 'Second Term',
    creator_name: 'Mr. Tunde Ogunleye',
    creator_role: 'TEACHER',
    pricing_type: 'FREE',
    price_naira: 0,
    moderation_status: 'PUBLISHED',
    neon_storage_key: 'packs/tenant_greenwood/pkg-nerdc-jss2-math-t2/v1/bundle.json',
    notes_count: 3,
    videos_count: 3,
    flashcards_count: 7,
    quizzes_count: 3,
    exams_count: 1,
    badges_count: 3,
    total_xp_reward: 600,
  },
  {
    pack_id: 'pkg-nerdc-sss2-phy-t2',
    title: 'NERDC SSS 2 Physics — Mechanics, Projectiles & Wave Optics WAEC Pack',
    curriculum: 'NERDC',
    class_label: 'SSS 2',
    subject_name: 'Physics',
    term_label: 'Second Term',
    creator_name: 'Mrs. Funke Adebayo',
    creator_role: 'TEACHER',
    pricing_type: 'PAID',
    price_naira: 2500,
    moderation_status: 'PUBLISHED',
    neon_storage_key: 'packs/tenant_greenwood/pkg-nerdc-sss2-phy-t2/v1/bundle.json',
    notes_count: 1,
    videos_count: 1,
    flashcards_count: 2,
    quizzes_count: 1,
    exams_count: 1,
    badges_count: 1,
    total_xp_reward: 350,
  },
  {
    pack_id: 'pkg-nerdc-pri4-math-t1',
    title: 'NERDC Primary 4 Mathematics — First Term Place Value & Fractions Pack',
    curriculum: 'NERDC',
    class_label: 'Primary 4',
    subject_name: 'Mathematics',
    term_label: 'First Term',
    creator_name: 'Dr. (Mrs.) Folake Adeyemi',
    creator_role: 'SCHOOL_ADMIN',
    pricing_type: 'FREE',
    price_naira: 0,
    moderation_status: 'PUBLISHED',
    neon_storage_key: 'packs/tenant_greenwood/pkg-nerdc-pri4-math-t1/v2/bundle.json',
    notes_count: 2,
    videos_count: 1,
    flashcards_count: 2,
    quizzes_count: 1,
    exams_count: 0,
    badges_count: 1,
    total_xp_reward: 250,
  },
];

export default function StudyPacksTab() {
  const [packs, setPacks] = useState<AdminPackItem[]>(INITIAL_PACKS);
  const [title, setTitle] = useState('NERDC SSS 3 Chemistry — WAEC & JAMB Organic Chemistry Scheme Pack');
  const [curriculum, setCurriculum] = useState('NERDC');
  const [classLabel, setClassLabel] = useState('SSS 3');
  const [subjectName, setSubjectName] = useState('Chemistry');
  const [termLabel, setTermLabel] = useState('Second Term');
  const [pricingType, setPricingType] = useState<'FREE' | 'PAID'>('PAID');
  const [priceNaira, setPriceNaira] = useState(3000);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreatePack = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `pkg-${curriculum.toLowerCase()}-${classLabel.toLowerCase().replace(' ', '')}-${Date.now().toString().slice(-4)}`;
    const newPack: AdminPackItem = {
      pack_id: id,
      title,
      curriculum,
      class_label: classLabel,
      subject_name: subjectName,
      term_label: termLabel,
      creator_name: 'Platform Curriculum Admin',
      creator_role: 'PLATFORM_ADMIN',
      pricing_type: pricingType,
      price_naira: pricingType === 'PAID' ? priceNaira : 0,
      moderation_status: 'PUBLISHED',
      neon_storage_key: `packs/global/${id}/v1/bundle.json`,
      notes_count: 4,
      videos_count: 4,
      flashcards_count: 20,
      quizzes_count: 4,
      exams_count: 1,
      badges_count: 3,
      total_xp_reward: 600,
    };
    setPacks([newPack, ...packs]);
    setNotice(`Compiled & published "${title}" (${pricingType === 'PAID' ? `₦${priceNaira.toLocaleString()}` : 'FREE'}) to Neon Object Storage.`);
  };

  const handleTogglePricing = (packId: string) => {
    setPacks(
      packs.map((p) =>
        p.pack_id === packId
          ? {
              ...p,
              pricing_type: p.pricing_type === 'PAID' ? 'FREE' : 'PAID',
              price_naira: p.pricing_type === 'PAID' ? 0 : 2500,
            }
          : p
      )
    );
  };

  const handleRevokeRefund = (packId: string) => {
    setNotice(`Refunded order & revoked perpetual entitlement for ${packId}. Student devices flagged to purge IndexedDB copy on next sync.`);
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-emerald-700 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Creator Studio Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Platform Study Pack Creator Studio (Curriculum &amp; Scheme-of-Work Specific)
            </h3>
            <p className="text-xs text-slate-500">
              Bundle Notes, Linked YouTube Videos, SRS Flashcards, Quizzes, Timed CBT Exams &amp; Mastery Badges into Neon Object Storage.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" /> Neon Storage + Perpetual License
          </span>
        </div>

        <form onSubmit={handleCreatePack} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Curriculum</label>
              <select
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
              >
                <option value="NERDC">NERDC</option>
                <option value="WAEC">WAEC / WASSCE</option>
                <option value="JAMB">JAMB UTME</option>
                <option value="BECE">BECE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Class Level</label>
              <select
                value={classLabel}
                onChange={(e) => setClassLabel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
              >
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 6">Primary 6</option>
                <option value="JSS 2">JSS 2</option>
                <option value="JSS 3">JSS 3</option>
                <option value="SSS 2">SSS 2</option>
                <option value="SSS 3">SSS 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Term</label>
              <select
                value={termLabel}
                onChange={(e) => setTermLabel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Study Pack Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Creator Pricing Mode</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPricingType('FREE')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                    pricingType === 'FREE'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Free (₦0)
                </button>
                <button
                  type="button"
                  onClick={() => setPricingType('PAID')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                    pricingType === 'PAID'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Paid (₦)
                </button>
                {pricingType === 'PAID' && (
                  <input
                    type="number"
                    value={priceNaira}
                    onChange={(e) => setPriceNaira(Number(e.target.value) || 0)}
                    className="w-24 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Compile &amp; Publish Pack to Neon Storage
            </button>
          </div>
        </form>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Active Study Packs &amp; Entitlement Revocation Console ({packs.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map((pack) => (
            <div key={pack.pack_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                  {pack.curriculum} · {pack.class_label} · {pack.subject_name}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    pack.pricing_type === 'PAID'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {pack.pricing_type === 'PAID' ? `PAID • ₦${pack.price_naira.toLocaleString()}` : 'FREE • ₦0'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{pack.title}</h4>
              <p className="text-xs text-slate-500">
                Creator: <strong>{pack.creator_name}</strong> ({pack.creator_role}) · Term: {pack.term_label}
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                <span className="px-2 py-0.5 rounded bg-white border flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-600" /> {pack.notes_count} Notes
                </span>
                <span className="px-2 py-0.5 rounded bg-white border flex items-center gap-1">
                  <Video className="w-3 h-3 text-purple-600" /> {pack.videos_count} Videos
                </span>
                <span className="px-2 py-0.5 rounded bg-white border flex items-center gap-1">
                  <Layers className="w-3 h-3 text-emerald-600" /> {pack.flashcards_count} Flashcards
                </span>
                <span className="px-2 py-0.5 rounded bg-white border flex items-center gap-1">
                  <FileText className="w-3 h-3 text-amber-600" /> {pack.quizzes_count} Quizzes + {pack.exams_count} Exam
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1">
                  <Award className="w-3 h-3" /> {pack.badges_count} Badges (+{pack.total_xp_reward} XP)
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  onClick={() => handleTogglePricing(pack.pack_id)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Switch to {pack.pricing_type === 'PAID' ? 'Free (₦0)' : 'Paid (₦2,500)'}
                </button>
                <button
                  onClick={() => handleRevokeRefund(pack.pack_id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Refund &amp; Revoke Offline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
