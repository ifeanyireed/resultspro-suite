"use client";

import React from "react";
import { useAuthStore } from "../../../../store/useAuthStore";
import { StudyPackCreatorStudio } from "../../../../components/StudyPackCreatorStudio";

export default function AdminStudyPacksPage() {
  const user = useAuthStore((state) => state.user);
  const adminName = user?.full_name || "Dr. (Mrs.) Folake Adeyemi";

  return <StudyPackCreatorStudio creatorRole="SCHOOL_ADMIN" creatorName={adminName} />;
}
