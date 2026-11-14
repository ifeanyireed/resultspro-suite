import NoteDetailClient from "./NoteDetailClient";
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function PublicNoteDetailPage() {
  return (
    <MotionRise>
      <NoteDetailClient />
    </MotionRise>
  );
}
