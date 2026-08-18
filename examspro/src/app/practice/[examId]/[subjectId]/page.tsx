import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  const params: { examId: string; subjectId: string }[] = [];
  
  routes.subjects.forEach(s => {
    // 1. Map by slug (preferred)
    if (s.subjectSlug) {
      params.push({
        examId: s.examSlug,
        subjectId: s.subjectSlug
      });
    }
    
    // 2. Map by ID (used by some links)
    params.push({
      examId: s.examSlug,
      subjectId: s.subjectId.toString()
    });
  });
  
  return params;
}

export default function Page() { 
  return <ClientPage />; 
}
