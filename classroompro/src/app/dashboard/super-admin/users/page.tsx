"use client";

import {
  IconSearch as Search,
  IconMail as Mail,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionRise } from "@/components/ScrollRiseProvider";
import { getCampusUsersDirectory } from "@/lib/api";

export default function GlobalUserManagement() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  useEffect(() => {
    let cancelled = false;
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await getCampusUsersDirectory().catch(() => ({ users: [] }));
        if (!cancelled) {
          setUsers(Array.isArray(res?.users) ? res.users : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        String(u.fullName || u.full_name || "").toLowerCase().includes(q) ||
        String(u.email || u.admission_number || "").toLowerCase().includes(q) ||
        String(u.school || "").toLowerCase().includes(q);
      const matchesRole =
        roleFilter === "All Roles" ||
        String(u.role || "").toLowerCase().includes(roleFilter.toLowerCase());
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <main className="p-8 space-y-8">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-[500px] w-full rounded-[32px]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <main className="p-8 space-y-8">
        <MotionRise className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              User Directory (Synced from CampusPRO)
            </h2>
            <p className="text-sm text-gray-500">
              All student, teacher/staff, and parent records read directly from{" "}
              <code>service_campuspro</code>.
            </p>
          </div>
        </MotionRise>

        {/* Search & Filters */}
        <MotionRise delay={0.05} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, admission number or tenant..."
              className="pl-10 h-12 bg-white shadow-sm border border-gray-100 text-gray-900"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white shadow-sm border border-gray-100 text-gray-900 text-sm font-bold px-4 h-12 rounded-xl outline-none"
            >
              <option>All Roles</option>
              <option>Student</option>
              <option>Teacher</option>
              <option>Parent</option>
            </select>
          </div>
        </MotionRise>

        {/* Users Table */}
        <MotionRise
          delay={0.1}
          className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden text-sm"
        >
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No user records returned from <code>service_campuspro</code> matching your filter.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                    User
                  </th>
                  <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                    Role
                  </th>
                  <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                    Class / Dept
                  </th>
                  <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                    Tenant
                  </th>
                  <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, idx) => {
                  const fullName = user.fullName || user.full_name || user.id;
                  return (
                    <tr
                      key={user.id || idx}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#146ef5] flex items-center justify-center text-white font-bold">
                            {String(fullName)
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{fullName}</h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />{" "}
                              {user.email || user.admission_number || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#146ef5]">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6 text-xs text-gray-700">
                        {user.class_arm_name || user.department || "—"}
                      </td>
                      <td className="p-6 text-gray-900 font-medium">{user.school || "—"}</td>
                      <td className="p-6">
                        <span
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-bold",
                            user.status === "Active" ? "text-emerald-600" : "text-gray-500"
                          )}
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              user.status === "Active" ? "bg-emerald-600" : "bg-gray-400"
                            )}
                          />
                          {user.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </MotionRise>
      </main>
    </div>
  );
}
