import ExamPlayerClient from "./ExamPlayerClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const res = await fetch(`${apiUrl}/exams`);
    const exams = await res.json();
    
    if (!Array.isArray(exams)) {
      return [];
    }

    return exams.map((e: any) => ({
      id: e.id,
    }));
  } catch (error) {
    console.error("Failed to fetch exams for static params:", error);
    return [];
  }
}

export default function ExamPage() {
  return <ExamPlayerClient />;
}
