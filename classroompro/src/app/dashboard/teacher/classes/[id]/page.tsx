import { TeacherClassDetailClient } from "./TeacherClassDetailClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://resultspro-service-classroompro.onrender.com/api';
    const res = await fetch(`${apiUrl}/classes`);
    const classes = await res.json();

    if (!Array.isArray(classes)) {
      return [];
    }

    return classes.map((c: any) => ({
      id: c.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch classes for static params:", error);
    return [];
  }
}

export default function TeacherClassDetailPage() {
  return <TeacherClassDetailClient />;
}
