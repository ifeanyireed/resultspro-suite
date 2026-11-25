"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconFileText as FileText, IconLoader2 as Loader2, IconClock as Clock, IconUser as User } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import { MotionRise, MotionStagger } from "@/components/ScrollRiseProvider";

export default function PublicExamsIndex() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/exams");
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <main className="min-h-screen bg-light flex flex-col" style={{ background: "var(--color-nets-light)" }}>
      <Navbar />

      {/* Navy Hero Banner */}
      <section
        className="bg-navy text-white relative overflow-hidden"
        style={{ background: "var(--color-nets-navy-dark)", paddingTop: "10rem", paddingBottom: "5rem", marginTop: "-72px" }}
      >
        <div aria-hidden className="absolute inset-0 z-0 opacity-20">
          <img src="/photo05.jpeg" alt="" className="w-full h-full object-cover" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(105deg, rgba(13,16,96,0.96) 0%, rgba(13,16,96,0.82) 55%, rgba(13,16,96,0.65) 100%)",
          }}
        />
        <div className="container-nets relative z-10 text-center">
          <MotionRise className="max-w-3xl mx-auto">
            <div className="overline-dark justify-center" style={{ marginBottom: "1rem" }}>Timed CBT Simulations</div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Exam <span className="text-green">Archives</span>
            </h1>
            <p className="text-white/75 max-w-2xl mx-auto text-lg">
              Prepare for success with our curated mock exams and simulations. 
              Practice in real-time under timed conditions.
            </p>
          </MotionRise>
        </div>
      </section>

      <section className="flex-1 py-16 px-4 bg-light">
        <div className="max-w-7xl mx-auto">
          {/* Exams Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-12 h-12 text-blue animate-spin" />
            </div>
          ) : (
            <MotionStagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map((exam, idx) => (
                <MotionRise 
                  key={exam.id} 
                  delay={idx * 0.06}
                  className="group bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-8 hover:border-blue/40 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                            MOCK EXAM
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue transition-colors">
                            {exam.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-amber-50 text-amber-700 uppercase tracking-widest border border-amber-200">
                          {exam.class?.school?.curriculum || "General"}
                        </span>
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-blue-50 text-blue uppercase tracking-widest border border-blue-200">
                          {exam.class?.name || "All Classes"}
                        </span>
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-50 text-emerald-700 uppercase tracking-widest border border-emerald-200">
                           Biology
                        </span>
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase tracking-widest border border-gray-200">
                          Term 1
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                        {exam.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {exam.duration} mins
                          </div>
                          <div className="flex items-center gap-1.5 text-blue">
                            <User className="w-3 h-3" /> {exam.author?.name || "Teacher"}
                          </div>
                        </div>
                        
                        <Link href={`/dashboard/exams/${exam.id}`}>
                          <Button className="bg-green hover:bg-[#E5A800] text-navy font-bold h-10 px-8 rounded-full">
                            Practice Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </MotionRise>
              ))}
            </MotionStagger>
          )}

          {!loading && exams.length === 0 && (
            <MotionRise className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
               <p className="text-gray-900 text-xl font-display mb-2">No exams available yet</p>
               <p className="text-gray-500">Check back later for newly published exams.</p>
            </MotionRise>
          )}

          {/* CTA Section */}
          <MotionRise className="mt-20 bg-navy text-white rounded-3xl p-12 text-center relative overflow-hidden" style={{ background: "var(--color-nets-navy-dark)" }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
              Unlock the Full Archive
            </h2>
            <p className="text-white/75 max-w-2xl mx-auto mb-8 text-base leading-relaxed">
              Register as a student or school to access thousands of curated past 
              questions, timed mock exams, and personalized performance reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-green hover:bg-[#E5A800] text-navy font-bold h-12 px-10 text-base rounded-xl">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white h-12 px-10 text-base rounded-xl">
                  View School Plans
                </Button>
              </Link>
            </div>
          </MotionRise>
        </div>
      </section>

      <Footer />
    </main>
  );
}
