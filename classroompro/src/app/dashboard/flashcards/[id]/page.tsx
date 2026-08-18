import FlashcardStudyClient from "./FlashcardStudyClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const res = await fetch(`${apiUrl}/flashcards`);
    const responseData = await res.json();
    
    // Handle both direct array and wrapped object structure
    const flashcards = Array.isArray(responseData) ? responseData : (responseData.data || []);
    
    if (!Array.isArray(flashcards)) {
      return [];
    }

    return flashcards.map((f: any) => ({
      id: f.id,
    }));
  } catch (error) {
    console.error("Failed to fetch flashcards for static params:", error);
    return [];
  }
}

export default function FlashcardStudyPage() {
  return <FlashcardStudyClient />;
}
