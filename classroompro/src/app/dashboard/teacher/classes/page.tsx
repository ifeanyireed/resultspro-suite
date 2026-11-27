"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconChartBar as BarChart3,
  IconCheck as Check,
  IconAlertCircle as AlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";
import { getCampusClasses } from "../../../../lib/api";

export default function AssignedClassesLearningView() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadCampusClasses = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await getCampusClasses();
        const classesList = Array.isArray(data?.classes) ? data.classes : [];
        const flattenedArms: any[] = [];
        for (const cls of classesList) {
          if (Array.isArray(cls.arms) && cls.arms.length > 0) {
            for (const arm of cls.arms) {
              flattenedArms.push({
                id: arm.id,
                name: `${cls.name} ${arm.name}`,
                armCode: arm.arm_code || arm.name,
                curriculum: cls.curriculum || "NERDC",
                formTeacher: arm.form_teacher_name || "",
                room: arm.room_number || "",
                students: arm.enrolled_students ?? 0,
                capacity: arm.capacity ?? 0,
                status: arm.status || "ACTIVE",
              });
            }
          } else {
            flattenedArms.push({
              id: cls.id,
              name: cls.name,
              armCode: cls.category,
              curriculum: cls.curriculum || "NERDC",
              formTeacher: "",
              room: "",
              students: cls.total_pupils ?? 0,
              capacity: 0,
              status: "ACTIVE",
            });
          }
        }
        setCohorts(flattenedArms);
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.error ||
            "Unable to load assigned classes from service_campuspro."
        );
        setCohorts([]);
      } finally {
        setLoading(false);
      }
    };
    loadCampusClasses();
  }, []);

  return (
    <div className="space-y-6 py-4">
      <MotionRise className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146ef5] text-white text-[10px] font-black uppercase tracking-wider mb-2">
            Synced Read-Only from service_campuspro Academic ERP
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Your Assigned Classes &amp; Learning Streams
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Class creation, student enrolment, and daily attendance roll-call live in <strong>CampusPRO</strong> (<code>/api/v1/campus/classes</code>).
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <Link href="/dashboard/teacher/study-packs">
            <Button className="bg-[#146ef5] text-white font-extrabold rounded-2xl text-xs">
              + Study Pack Studio
            </Button>
          </Link>
          <Link href="/dashboard/teacher/create-note">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-900 font-extrabold rounded-2xl text-xs"
            >
              + Author Note
            </Button>
          </Link>
        </div>
      </MotionRise>

      {loading ? (
        <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center text-xs text-gray-500 font-semibold">
          Loading class &amp; arm records from service_campuspro...
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 rounded-3xl p-6 border border-rose-200 text-xs text-rose-900 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : cohorts.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center space-y-2">
          <p className="text-sm font-extrabold text-gray-900">
            No classes or arms found in CampusPRO for this tenant.
          </p>
          <p className="text-xs text-gray-500">
            Create classes and enroll students in <strong>CampusPRO</strong> to view them here.
          </p>
        </div>
      ) : (
        <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cohorts.map((cls, i) => (
            <MotionRise
              key={cls.id || i}
              delay={i * 0.05}
              className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100 space-y-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#146ef5]">
                    {cls.curriculum}
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {cls.students} Students Enrolled (CampusPRO Roster)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold">
                  {cls.status}
                </span>
              </div>

              {cls.formTeacher && (
                <div className="p-3 rounded-2xl bg-gray-50 text-xs text-gray-700 font-semibold flex items-center justify-between">
                  <span>Form Teacher:</span>
                  <span className="font-extrabold text-gray-900">
                    {cls.formTeacher}
                  </span>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Check className="w-4 h-4 shrink-0" />
                <span>Synced from CampusPRO ({cls.armCode})</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/teacher/analytics?arm_id=${encodeURIComponent(
                    cls.id
                  )}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-[#0D1060] hover:bg-[#151980] text-white text-xs font-extrabold h-10 rounded-xl">
                    <BarChart3 className="w-4 h-4 mr-1.5" />
                    Roster &amp; Sync Scores
                  </Button>
                </Link>
              </div>
            </MotionRise>
          ))}
        </MotionStagger>
      )}
    </div>
  );
}
