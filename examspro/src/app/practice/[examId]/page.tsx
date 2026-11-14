import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";
import { MotionRise } from "@/components/ScrollRiseProvider";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  if (!routes || !routes.exams) return [];
  return routes.exams.filter(Boolean).map(examId => ({ examId: String(examId) }));
}

export default function Page() { 
  return (
    <MotionRise>
      <ClientPage />
    </MotionRise>
  ); 
}
