import DashboardNoteDetailClient from "./DashboardNoteDetailClient";
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function NoteDetailPage() {
  return (
    <MotionRise>
      <DashboardNoteDetailClient />
    </MotionRise>
  );
}
