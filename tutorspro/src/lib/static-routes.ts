export interface StaticRoutes {
  exams: string[];
  blog: string[];
  subjects: { examSlug: string; subjectSlug: string; subjectId: number }[];
  topics: number[];
}

export async function fetchStaticRoutes(): Promise<StaticRoutes> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  
  try {
    const res = await fetch(`${API_URL}/public/routes`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch routes');
    return await res.json();
  } catch (err) {
    console.error("Static parameter fetch failed. Using fallback empty lists.", err);
    // Fallback to minimal set if backend is down during build
    return {
      exams: ['jamb', 'waec', 'sat', 'neco'],
      blog: ['welcome'],
      subjects: [
        { examSlug: 'jamb', subjectSlug: 'english', subjectId: 1 },
        { examSlug: 'jamb', subjectSlug: 'mathematics', subjectId: 2 },
        { examSlug: 'jamb', subjectSlug: 'physics', subjectId: 3 },
        { examSlug: 'jamb', subjectSlug: 'chemistry', subjectId: 4 },
        { examSlug: 'jamb', subjectSlug: 'biology', subjectId: 5 },
        { examSlug: 'jamb', subjectSlug: 'commerce', subjectId: 8 },
      ],
      topics: [1, 2, 3, 4, 5, 8]
    };
  }
}
