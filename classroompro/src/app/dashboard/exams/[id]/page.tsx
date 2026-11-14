import ExamPlayerClient from "./ExamPlayerClient";
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function ExamPage() {
  return (
    <MotionRise>
      <ExamPlayerClient />
    </MotionRise>
  );
}
