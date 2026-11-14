import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";
import { MotionRise } from "@/components/ScrollRiseProvider";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  if (!routes || !routes.topics) return [];
  return routes.topics.filter(Boolean).map(topicId => ({
    topicId: String(topicId)
  }));
}

export default function Page() {
  return (
    <MotionRise>
      <ClientPage />
    </MotionRise>
  );
}
