import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  const params: { subjectId: string }[] = [];
  
  if (!routes || !routes.subjects) return params;

  routes.subjects.forEach(s => {
    if (s.subjectSlug) params.push({ subjectId: String(s.subjectSlug) });
    if (s.subjectId) params.push({ subjectId: String(s.subjectId) });
  });
  
  return params;
}

export default function Page() { return <ClientPage />; }
