"use client";

import React from "react";
import { useAuthStore } from "../../../../store/useAuthStore";
import { StudyPackCreatorStudio } from "../../../../components/StudyPackCreatorStudio";

export default function TeacherStudyPacksPage() {
  const user = useAuthStore((state) => state.user);
  const teacherName = user?.full_name || "Mr. Tunde Ogunleye";

  return <StudyPackCreatorStudio creatorRole="TEACHER" creatorName={teacherName} />;
}
