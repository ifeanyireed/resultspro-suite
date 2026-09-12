import ClientPage from './page-client';
import { fetchStaticRoutes } from "@/lib/static-routes";

export async function generateStaticParams() {
  const routes = await fetchStaticRoutes();
  const params: { examId: string; subjectId: string }[] = [];
  
  if (!routes || !routes.subjects) return params;

  routes.subjects.forEach(s => {
    // 1. Map by slug (preferred)
    if (s.examSlug && s.subjectSlug) {
      params.push({
        examId: String(s.examSlug),
        subjectId: String(s.subjectSlug)
      });
    }
    
    // 2. Map by ID (used by some links)
    if (s.examSlug && s.subjectId) {
      params.push({
        examId: String(s.examSlug),
        subjectId: String(s.subjectId)
      });
    }
  });
  
  return params;
}

export default function Page() { 
  return <ClientPage />; 
}
