import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  if (!routes || !routes.exams) return [];
  return routes.exams.filter(Boolean).map(examId => ({ examId: String(examId) }));
}

export default function Page() { 
  return <ClientPage />; 
}
