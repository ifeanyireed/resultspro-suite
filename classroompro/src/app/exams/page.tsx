"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IconFileText as FileText, IconLoader2 as Loader2, IconClock as Clock, IconUser as User } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";

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
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Exam <span className="text-green">Archives</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Prepare for success with our curated mock exams and simulations. 
              Practice in real-time under timed conditions.
            </p>
          </div>

          {/* Exams Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-12 h-12 text-green animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map((exam) => (
                <div 
                  key={exam.id} 
                  className="group bg-white/5 border border-white/10 rounded-[40px] p-8 hover:border-green/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                            MOCK EXAM
                          </span>
                          <h3 className="text-xl font-bold text-white group-hover:text-green transition-colors">
                            {exam.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-green/10 text-green uppercase tracking-widest border border-green/10">
                          {exam.class?.school?.curriculum || "General"}
                        </span>
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-blue/10 text-blue uppercase tracking-widest border border-blue/10">
                          {exam.class?.name || "All Classes"}
                        </span>
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-amber/10 text-amber uppercase tracking-widest border border-amber/10">
                           Biology
                        </span>
                        <span className="text-[10px] font-black px-2 py-1 rounded bg-white/10 text-white uppercase tracking-widest border border-white/10">
                          Term 1
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                        {exam.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-6 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {exam.duration} mins
                          </div>
                          <div className="flex items-center gap-1.5 text-green">
                            <User className="w-3 h-3" /> {exam.author?.name || "Teacher"}
                          </div>
                        </div>
                        
                        <Link href={`/dashboard/exams/${exam.id}`}>
                          <Button className="bg-green hover:bg-green/90 text-navy font-bold h-10 px-8 rounded-full">
                            Practice Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && exams.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/10">
               <p className="text-white text-xl font-display mb-2">No exams available yet</p>
               <p className="text-muted-foreground">Check back later for newly published exams.</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-24 bg-gradient-to-br from-green/20 to-blue/20 border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-green/20 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue/20 blur-[100px] rounded-full" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-6">
              Unlock the Full Archive
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Register as a student or school to access thousands of curated past 
              questions, timed mock exams, and personalized performance reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-green hover:bg-green/90 text-navy font-bold h-14 px-10 text-lg rounded-2xl">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white h-14 px-10 text-lg rounded-2xl">
                  View School Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
