"use client";

import {
  IconCircleCheck as CheckCircle,
  IconCircleX as XCircle,
  IconBook as BookOpen,
  IconFlag as Flag,
  IconSearch as Search,
} from "@tabler/icons-react";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { syncEngine } from "@/lib/syncEngine";
import { toast } from "@/lib/toast";

export default function ContentModeration() {
  const [loading, setLoading] = useState(true);
  const [packs, setPacks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadPacks = async () => {
    setLoading(true);
    try {
      const manifests = await syncEngine.fetchAvailableManifests({
        include_pending: true,
      });
      setPacks(Array.isArray(manifests) ? manifests : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const handleModerate = async (
    packId: string,
    action: "APPROVE_PUBLISH" | "REJECT"
  ) => {
    await syncEngine.moderateTeacherStudyPack(packId, action);
    toast.success(
      action === "APPROVE_PUBLISH"
        ? "Study Pack approved and published!"
        : "Study Pack rejected."
    );
    await loadPacks();
  };

  const filteredItems = useMemo(() => {
    return packs.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        String(item.title || "").toLowerCase().includes(q) ||
        String(item.creator_name || "").toLowerCase().includes(q) ||
        String(item.subject_name || "").toLowerCase().includes(q);
      if (statusFilter === "PENDING") {
        return matchesSearch && item.moderation_status === "PENDING_APPROVAL";
      }
      if (statusFilter === "PUBLISHED") {
        return matchesSearch && item.moderation_status === "PUBLISHED";
      }
      return matchesSearch;
    });
  }, [packs, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <main className="p-8 space-y-8">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-[32px]" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12 animate-in fade-in duration-500">
      <main className="p-8 space-y-8">
        <MotionRise className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Study Pack Moderation Queue
            </h2>
            <p className="text-sm text-gray-500">
              Review and approve database-persisted Study Packs across ClassroomPRO.
            </p>
          </div>
          <div className="flex gap-2 p-1 bg-white shadow-sm border border-gray-100 rounded-xl">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-2 rounded-lg font-bold text-xs ${
                statusFilter === "ALL"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All ({packs.length})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-4 py-2 rounded-lg font-bold text-xs ${
                statusFilter === "PENDING"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Pending (
              {packs.filter((p) => p.moderation_status === "PENDING_APPROVAL").length}
              )
            </button>
            <button
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`px-4 py-2 rounded-lg font-bold text-xs ${
                statusFilter === "PUBLISHED"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Published
            </button>
          </div>
        </MotionRise>

        {/* Search */}
        <MotionRise delay={0.05} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search study packs by title, creator, or subject..."
              className="w-full pl-10 h-12 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-900 outline-none"
            />
          </div>
        </MotionRise>

        {/* Queue List */}
        <MotionStagger className="grid gap-4">
          {filteredItems.map((item, i) => (
            <MotionRise
              key={item.pack_id || item.package_id || i}
              delay={i * 0.04}
              className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-gray-100 flex items-center justify-center text-[#146ef5] shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    {item.pricing_type} ·{" "}
                    {item.pricing_type === "PAID"
                      ? `₦${Number(item.price_naira || 0).toLocaleString()}`
                      : "FREE"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-[#146ef5] uppercase">
                    {item.moderation_status || "PUBLISHED"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  by <span className="text-gray-900 font-bold">{item.creator_name}</span> •{" "}
                  {item.class_label} • {item.subject_name} ({item.term_label})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleModerate(item.pack_id || item.package_id, "APPROVE_PUBLISH")
                  }
                  title="Approve & Publish"
                  className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    handleModerate(item.pack_id || item.package_id, "REJECT")
                  }
                  title="Reject"
                  className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </MotionRise>
          ))}

          {filteredItems.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto text-gray-300">
                <Flag className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">No items in queue</h4>
            </div>
          )}
        </MotionStagger>
      </main>
    </div>
  );
}
