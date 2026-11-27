"use client";

import {
  IconTrendingUp as TrendingUp,
  IconCurrencyDollar as DollarSign,
  IconSchool as School,
  IconWallet as Wallet,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { syncEngine } from "@/lib/syncEngine";

export default function RevenueAnalytics() {
  const [loading, setLoading] = useState(true);
  const [packs, setPacks] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const manifests = await syncEngine.fetchAvailableManifests({
          include_pending: true,
        });
        if (!cancelled) {
          setPacks(Array.isArray(manifests) ? manifests : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const paidPacks = packs.filter((p) => p.pricing_type === "PAID");
  const freePacks = packs.filter((p) => p.pricing_type !== "PAID");
  const catalogValue = paidPacks.reduce(
    (acc, p) => acc + (Number(p.price_naira) || 0),
    0
  );

  const revenueStats = [
    {
      label: "Paid Pack Catalog Value",
      value: `₦${catalogValue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Paid Study Packs",
      value: String(paidPacks.length),
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-[#146ef5]",
      bg: "bg-blue-50",
    },
    {
      label: "Free Study Packs",
      value: String(freePacks.length),
      icon: <School className="w-5 h-5" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Persisted Packs",
      value: String(packs.length),
      icon: <Wallet className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-[24px]" />
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
              Study Pack Catalog &amp; Monetization
            </h2>
            <p className="text-sm text-gray-500">
              Live breakdown of FREE and PAID Study Packs persisted in ClassroomPRO.
            </p>
          </div>
        </MotionRise>

        {/* Stats Grid */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueStats.map((stat, i) => (
            <MotionRise
              key={i}
              delay={i * 0.05}
              className="bg-white shadow-sm border border-gray-100 p-6 rounded-[24px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </MotionRise>
          ))}
        </MotionStagger>

        {/* Paid & Free Study Packs Table */}
        <MotionRise delay={0.1} className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 font-display px-2">
            Study Pack Pricing Ledger
          </h3>
          <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Pack ID
                    </th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Study Pack Title
                    </th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Class &amp; Subject
                    </th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Price
                    </th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packs.map((pack) => (
                    <tr
                      key={pack.pack_id || pack.package_id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-6 font-mono text-xs text-gray-500">
                        {pack.pack_id || pack.package_id}
                      </td>
                      <td className="p-6 font-bold text-gray-900">{pack.title}</td>
                      <td className="p-6 text-xs text-gray-500">
                        {pack.class_label} · {pack.subject_name}
                      </td>
                      <td className="p-6 font-bold text-gray-900">
                        {pack.pricing_type === "PAID"
                          ? `₦${Number(pack.price_naira || 0).toLocaleString()}`
                          : "FREE (₦0)"}
                      </td>
                      <td className="p-6 text-right">
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600">
                          {pack.moderation_status || "PUBLISHED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionRise>
      </main>
    </div>
  );
}
