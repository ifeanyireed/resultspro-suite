"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { campusApi, resultsApi, getActiveTenantId } from "@/lib/api";

export interface CampusBranchRecord {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  principal_name: string;
  principal_email: string;
  is_main: boolean;
  status: string;
  student_count: number;
  staff_count: number;
}

export interface CampusArmRecord {
  id: string;
  class_id: string;
  class_name?: string;
  name: string;
  arm_code: string;
  form_teacher_id: string;
  form_teacher_name: string;
  room_number: string;
  capacity: number;
  enrolled_students: number;
}

export interface CampusClassRecord {
  id: string;
  name: string;
  level_order: number;
  category: string;
  curriculum: string;
  arms: CampusArmRecord[];
  total_arms: number;
  total_pupils: number;
}

export interface CampusStudentRecord {
  id: string;
  arm_id: string;
  arm_name: string;
  class_id: string;
  class_name: string;
  student_id: string;
  student_name: string;
  admission_number: string;
  gender: string;
  status: string;
}

export interface CampusSubjectRecord {
  id: string;
  code: string;
  title: string;
  department: string;
  category: string;
  curriculum: string;
  level_category: string;
  ca_weight: number;
  exam_weight: number;
  pass_mark: number;
}

export interface CampusStaffRecord {
  id: string;
  staff_number: string;
  title: string;
  full_name: string;
  email: string;
  phone: string;
  cadre: string;
  designation: string;
  department: string;
  assigned_arm_name: string;
  attendance_rate: number;
}

export interface CampusWardRecord {
  id: string;
  student_id: string;
  name: string;
  first_name: string;
  admission_number: string;
  class_name: string;
  arm_name: string;
  gender: string;
  avatar: string;
  attendance_rate: number;
  average_score: number;
  average_gpa: number;
  outstanding_fees: number;
  wallet_balance: number;
  status: string;
}

export interface CampusParentProfile {
  name: string;
  email: string;
  phone: string;
  wards: CampusWardRecord[];
  activeWard: CampusWardRecord | null;
}

export interface CampusOfficialScoreRecord {
  id: string;
  campus_name: string;
  class_name: string;
  subject_name: string;
  student_id: string;
  student_name: string;
  admission_number: string;
  component_code: string;
  score: number;
  max_obtainable: number;
  source_system: string;
  source_reference_id: string;
  approved_by_user_id: string;
  approved_at: string;
}

export interface ResultsInstanceRecord {
  id: string;
  school_id: string;
  session_id: string;
  session_name: string;
  term_id: string;
  term_name: string;
  status: string;
  total_possible_score: number;
}

export interface ScratchCardBatchRecord {
  id: string;
  batch_number: string;
  total_cards: number;
  used_cards: number;
  unit_cost: number;
  total_cost: number;
  status: string;
  created_at: string;
}

export interface ScratchCardUsageRecord {
  id: string;
  card_id: string;
  serial_number: string;
  student_id: string;
  result_id: string;
  accessed_by: string;
  accessed_at: string;
  usage_count: number;
  max_usages: number;
  remaining_usage: number;
  status: string;
}

interface CampusProContextValue {
  loading: boolean;
  tenantId: string;
  schoolName: string;
  schoolMotto: string;
  activeSession: string;
  activeTerm: string;
  termsList: string[];
  branches: CampusBranchRecord[];
  classes: CampusClassRecord[];
  flattenedArms: { id: string; label: string; className: string; armName: string; formTeacher: string; enrolled: number }[];
  students: CampusStudentRecord[];
  subjects: CampusSubjectRecord[];
  staff: CampusStaffRecord[];
  parentProfile: CampusParentProfile;
  officialScores: CampusOfficialScoreRecord[];
  // ResultsPRO owned entities: EOT gradebooks & scratch card history
  eotInstances: ResultsInstanceRecord[];
  scratchCardBatches: ScratchCardBatchRecord[];
  scratchCardUsages: ScratchCardUsageRecord[];
  activeWardId: string;
  setActiveWardId: (id: string) => void;
  refreshCampusData: () => Promise<void>;
  refreshResultsProData: () => Promise<void>;
}

const CampusProContext = createContext<CampusProContextValue | undefined>(undefined);

export const CampusProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState("tenant-greenwoodhigh");
  const [schoolName, setSchoolName] = useState("Greenwood High Academy");
  const [schoolMotto, setSchoolMotto] = useState("Knowledge, Integrity & Excellence");
  const [activeSession, setActiveSession] = useState("2026 / 2027 Session");
  const [activeTerm, setActiveTerm] = useState("First Term");
  const [termsList, setTermsList] = useState<string[]>([
    "First Term · 2026/2027",
    "Second Term · 2026/2027",
    "Third Term · 2025/2026",
  ]);
  const [branches, setBranches] = useState<CampusBranchRecord[]>([]);
  const [classes, setClasses] = useState<CampusClassRecord[]>([]);
  const [students, setStudents] = useState<CampusStudentRecord[]>([]);
  const [subjects, setSubjects] = useState<CampusSubjectRecord[]>([]);
  const [staff, setStaff] = useState<CampusStaffRecord[]>([]);
  const [officialScores, setOfficialScores] = useState<CampusOfficialScoreRecord[]>([]);
  const [parentProfile, setParentProfile] = useState<CampusParentProfile>({
    name: "",
    email: "",
    phone: "",
    wards: [],
    activeWard: null,
  });
  const [activeWardId, setActiveWardId] = useState<string>("");

  // ResultsPRO-controlled EOT Gradebooks & Scratch Card History
  const [eotInstances, setEotInstances] = useState<ResultsInstanceRecord[]>([]);
  const [scratchCardBatches, setScratchCardBatches] = useState<ScratchCardBatchRecord[]>([]);
  const [scratchCardUsages, setScratchCardUsages] = useState<ScratchCardUsageRecord[]>([]);

  const refreshCampusData = useCallback(async () => {
    const tId = getActiveTenantId();
    setTenantId(tId);

    try {
      const [
        summaryRes,
        branchesRes,
        classesRes,
        studentsRes,
        subjectsRes,
        staffRes,
        sessionsRes,
        parentDashRes,
        officialScoresRes,
      ] = await Promise.allSettled([
        campusApi.get("/api/v1/campus/summary"),
        campusApi.get("/api/v1/campus/branches"),
        campusApi.get("/api/v1/campus/classes"),
        campusApi.get("/api/v1/campus/students"),
        campusApi.get("/api/v1/campus/subjects"),
        campusApi.get("/api/v1/campus/staff"),
        campusApi.get("/api/v1/campus/academic-sessions"),
        campusApi.get("/api/v1/campus/parent/dashboard"),
        campusApi.get("/api/v1/campus/exam-scores/official"),
      ]);

      if (summaryRes.status === "fulfilled" && summaryRes.value.data) {
        const s = summaryRes.value.data;
        if (s.school_name) setSchoolName(s.school_name);
        if (s.active_session) setActiveSession(s.active_session);
      }

      if (branchesRes.status === "fulfilled" && Array.isArray(branchesRes.value.data?.branches)) {
        setBranches(branchesRes.value.data.branches);
      }

      if (classesRes.status === "fulfilled" && Array.isArray(classesRes.value.data)) {
        setClasses(classesRes.value.data);
      }

      if (studentsRes.status === "fulfilled" && Array.isArray(studentsRes.value.data)) {
        setStudents(studentsRes.value.data);
      }

      if (subjectsRes.status === "fulfilled" && Array.isArray(subjectsRes.value.data?.subjects)) {
        setSubjects(subjectsRes.value.data.subjects);
      }

      if (staffRes.status === "fulfilled" && Array.isArray(staffRes.value.data?.staff)) {
        setStaff(staffRes.value.data.staff);
      }

      if (sessionsRes.status === "fulfilled" && sessionsRes.value.data) {
        const sessData = sessionsRes.value.data;
        const sessName = sessData.active_session?.session_name || sessData.active_session?.academic_year || "2026/2027";
        if (sessData.active_session?.session_name) {
          setActiveSession(sessData.active_session.session_name);
        }
        if (sessData.active_term?.term_name) {
          setActiveTerm(sessData.active_term.term_name);
        }
        if (Array.isArray(sessData.terms) && sessData.terms.length > 0) {
          setTermsList(sessData.terms.map((t: any) => `${t.term_name} · ${sessName}`));
        }
      }

      if (parentDashRes.status === "fulfilled" && parentDashRes.value.data) {
        const pd = parentDashRes.value.data;
        if (pd.school_name) setSchoolName(pd.school_name);
        const wards: CampusWardRecord[] = Array.isArray(pd.wards) ? pd.wards : [];
        const activeW: CampusWardRecord | null = pd.active_ward || wards[0] || null;
        setParentProfile({
          name: pd.parent?.name || "",
          email: pd.parent?.email || "",
          phone: pd.parent?.phone || "",
          wards,
          activeWard: activeW,
        });
        if (activeW && !activeWardId) {
          setActiveWardId(activeW.student_id || activeW.id);
        }
      }

      if (officialScoresRes.status === "fulfilled" && Array.isArray(officialScoresRes.value.data?.official_scores)) {
        setOfficialScores(officialScoresRes.value.data.official_scores);
      }
    } catch (err) {
      console.error("Failed to fetch CampusPRO context records:", err);
    }
  }, [activeWardId]);

  const refreshResultsProData = useCallback(async () => {
    const tId = getActiveTenantId();
    try {
      const [instancesRes, batchesRes, historyRes] = await Promise.allSettled([
        resultsApi.get("/api/v1/results/instances", { params: { school_id: tId } }),
        resultsApi.get("/api/v1/cards/batches", { params: { school_id: tId } }),
        resultsApi.get("/api/v1/cards/history", { params: { school_id: tId } }),
      ]);

      if (instancesRes.status === "fulfilled" && Array.isArray(instancesRes.value.data?.instances)) {
        setEotInstances(instancesRes.value.data.instances);
      }
      if (batchesRes.status === "fulfilled" && Array.isArray(batchesRes.value.data?.batches)) {
        setScratchCardBatches(batchesRes.value.data.batches);
      }
      if (historyRes.status === "fulfilled" && Array.isArray(historyRes.value.data?.usages)) {
        setScratchCardUsages(historyRes.value.data.usages);
      }
    } catch (err) {
      console.error("Failed to fetch ResultsPRO EOT & scratch card records:", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await Promise.all([refreshCampusData(), refreshResultsProData()]);
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshCampusData, refreshResultsProData]);

  const flattenedArms = React.useMemo(() => {
    const list: { id: string; label: string; className: string; armName: string; formTeacher: string; enrolled: number }[] = [];
    for (const cls of classes) {
      if (Array.isArray(cls.arms)) {
        for (const arm of cls.arms) {
          list.push({
            id: arm.id,
            label: `${cls.name} ${arm.name}`,
            className: cls.name,
            armName: arm.name,
            formTeacher: arm.form_teacher_name || "Form Teacher",
            enrolled: arm.enrolled_students || 0,
          });
        }
      }
    }
    return list;
  }, [classes]);

  const activeParentProfile = React.useMemo(() => {
    if (!activeWardId || parentProfile.wards.length === 0) return parentProfile;
    const found = parentProfile.wards.find((w) => w.student_id === activeWardId || w.id === activeWardId);
    return {
      ...parentProfile,
      activeWard: found || parentProfile.activeWard || parentProfile.wards[0] || null,
    };
  }, [parentProfile, activeWardId]);

  return (
    <CampusProContext.Provider
      value={{
        loading,
        tenantId,
        schoolName,
        schoolMotto,
        activeSession,
        activeTerm,
        termsList,
        branches,
        classes,
        flattenedArms,
        students,
        subjects,
        staff,
        parentProfile: activeParentProfile,
        officialScores,
        eotInstances,
        scratchCardBatches,
        scratchCardUsages,
        activeWardId,
        setActiveWardId,
        refreshCampusData,
        refreshResultsProData,
      }}
    >
      {children}
    </CampusProContext.Provider>
  );
};

export function useCampusProContext(): CampusProContextValue {
  const ctx = useContext(CampusProContext);
  if (!ctx) {
    throw new Error("useCampusProContext must be used inside a CampusProProvider");
  }
  return ctx;
}
