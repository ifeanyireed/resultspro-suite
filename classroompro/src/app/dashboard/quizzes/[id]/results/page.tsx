import QuizResultsClient from "./QuizResultsClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const res = await fetch(`${apiUrl}/quizzes`);
    const quizzes = await res.json();
    
    if (!Array.isArray(quizzes)) {
      return [];
    }

    return quizzes.map((q: any) => ({
      id: q.id,
    }));
  } catch (error) {
    console.error("Failed to fetch quizzes for static params:", error);
    return [];
  }
}

export default function QuizResultsPage() {
  return <QuizResultsClient />;
}
