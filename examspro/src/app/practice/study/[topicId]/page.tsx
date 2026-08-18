import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  return routes.topics.map(topicId => ({
    topicId: topicId.toString()
  }));
}

export default function Page() {
  return <ClientPage />;
}
