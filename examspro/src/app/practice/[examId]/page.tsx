import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  return routes.exams.map(examId => ({ examId }));
}

export default function Page() { 
  return <ClientPage />; 
}
