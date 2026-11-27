"use client";

import { useState, useEffect, useMemo } from "react";
import {
  IconSearch as Search,
  IconGlobe as Globe,
  IconMail as Mail,
  IconPhone as Phone,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise } from "@/components/ScrollRiseProvider";
import { getCampusBranches } from "@/lib/api";

export default function SchoolsOverview() {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadBranches = async () => {
      setLoading(true);
      try {
        const res = await getCampusBranches().catch(() => ({ branches: [] }));
        if (!cancelled) {
          setBranches(Array.isArray(res?.branches) ? res.branches : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadBranches();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSchools = useMemo(() => {
    return branches.filter((school) => {
      const q = search.toLowerCase();
      return (
        String(school.name || "").toLowerCase().includes(q) ||
        String(school.city || school.state || "").toLowerCase().includes(q) ||
        String(school.code || "").toLowerCase().includes(q)
      );
    });
  }, [branches, search]);

  return (
    <div className="flex-1 pb-12 animate-in fade-in duration-500">
      <main className="p-8 space-y-8">
        <MotionRise className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
              Campus &amp; School Sites (service_campuspro)
            </h2>
            <p className="text-sm text-gray-500">
              Live campus branches and institutional sites fetched from{" "}
              <code>service_campuspro</code>.
            </p>
          </div>
        </MotionRise>

        {/* Search */}
        <MotionRise delay={0.05} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campuses by name, city or code..."
              className="pl-10 h-12 bg-white shadow-sm border border-gray-100 text-gray-900 rounded-xl"
            />
          </div>
        </MotionRise>

        {/* Schools Table */}
        <MotionRise
          delay={0.1}
          className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden"
        >
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="py-20 text-center text-gray-500 text-sm">
                No campus branch records returned from <code>service_campuspro</code>.
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Campus / School
                    </th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Head of Campus
                    </th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Enrollment
                    </th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSchools.map((school, idx) => (
                    <tr
                      key={school.id || idx}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#146ef5] flex items-center justify-center text-white font-bold">
                            {String(school.code || school.name || "CP").slice(0, 3)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{school.name}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" /> {school.code}
                              </span>
                              <span>•</span>
                              <span>
                                {school.city}
                                {school.state ? `, ${school.state}` : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-900 mb-1">
                          {school.principal_name || "Campus Administrator"}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                          {school.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {school.email}
                            </span>
                          )}
                          {school.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {school.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-xs font-bold text-gray-700">
                        {(school.students_count || 0).toLocaleString()} Students ·{" "}
                        {(school.staff_count || 0).toLocaleString()} Staff
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-emerald-50 border-emerald-200 text-emerald-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          {school.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </MotionRise>
      </main>
    </div>
  );
}
