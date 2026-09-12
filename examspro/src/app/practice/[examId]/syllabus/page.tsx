import api from "@/lib/api";
import { fetchStaticRoutes } from "@/lib/static-routes";
import SyllabusClient from "./SyllabusClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  try {
    const routes = await fetchStaticRoutes();
    if (!routes || !routes.exams) return [];
    return routes.exams.filter(Boolean).map(examId => ({ examId: String(examId) }));
  } catch (error) {
    console.error("Error fetching static routes for syllabus:", error);
    return [];
  }
}

async function getSyllabus(examId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://resultspro-service-examspro.onrender.com/api';
    const res = await fetch(`${API_URL}/exams/${examId}/syllabus`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    console.warn(`[getSyllabus] Failed to fetch syllabus for examId ${examId}:`, err.message);
    return null;
  }
}

export default async function ExamSyllabusPage(props: { params: Promise<{ examId: string }> }) {
  const { examId } = await props.params;
  const syllabus = await getSyllabus(examId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <SyllabusClient syllabus={syllabus} examId={examId} />
      <Footer />
    </div>
  );
}
