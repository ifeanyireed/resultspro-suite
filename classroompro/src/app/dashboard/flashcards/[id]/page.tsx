import FlashcardStudyClient from "./FlashcardStudyClient";
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function FlashcardStudyPage() {
  return (
    <MotionRise>
      <FlashcardStudyClient />
    </MotionRise>
  );
}
