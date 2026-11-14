import QuizResultsClient from "./QuizResultsClient";
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function QuizResultsPage() {
  return (
    <MotionRise>
      <QuizResultsClient />
    </MotionRise>
  );
}
