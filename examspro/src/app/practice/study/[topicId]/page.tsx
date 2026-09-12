import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  if (!routes || !routes.topics) return [];
  return routes.topics.filter(Boolean).map(topicId => ({
    topicId: String(topicId)
  }));
}

export default function Page() {
  return <ClientPage />;
}
