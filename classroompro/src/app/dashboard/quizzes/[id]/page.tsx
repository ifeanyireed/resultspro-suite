import QuizPlayerClient from "./QuizPlayerClient";
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function QuizPlayerPage() {
  return (
    <MotionRise>
      <QuizPlayerClient />
    </MotionRise>
  );
}
