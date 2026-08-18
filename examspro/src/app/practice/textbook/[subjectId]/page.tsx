import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  const params: { subjectId: string }[] = [];
  
  routes.subjects.forEach(s => {
    if (s.subjectSlug) params.push({ subjectId: s.subjectSlug });
    params.push({ subjectId: s.subjectId.toString() });
  });
  
  return params;
}

export default function Page() { return <ClientPage />; }
