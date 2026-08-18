import api from "@/lib/api";
import { fetchStaticRoutes } from "@/lib/static-routes";
import SyllabusClient from "./SyllabusClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  try {
    const routes = await fetchStaticRoutes();
    return routes.exams.map(examId => ({ examId }));
  } catch (error) {
    console.error("Error fetching static routes for syllabus:", error);
    return [];
  }
}

async function getSyllabus(examId: string) {
  try {
    const res = await api.get(`/exams/${examId}/syllabus`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch syllabus: ${examId}`);
    return null;
  }
}

export default async function ExamSyllabusPage(props: { params: Promise<{ examId: string }> }) {
  const { examId } = await props.params;
  const syllabus = await getSyllabus(examId);

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      <SyllabusClient syllabus={syllabus} examId={examId} />
      <Footer />
    </div>
  );
}
