import NoteDetailClient from "./NoteDetailClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const res = await fetch(`${apiUrl}/notes`);
    const notes = await res.json();
    
    if (!Array.isArray(notes)) {
      return [];
    }

    return notes.map((note: any) => ({
      id: note.id,
    }));
  } catch (error) {
    console.error("Failed to fetch notes for static params:", error);
    return [];
  }
}

export default function PublicNoteDetailPage() {
  return <NoteDetailClient />;
}
