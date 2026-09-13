"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconSearch as Search, IconFilter as Filter, IconStar as Star, IconMapPin as MapPin, IconLoader2 as Loader2 } from '@tabler/icons-react';
import Link from "next/link";
import api from "@/lib/api";

interface Tutor {
  id: string;
  name: string;
  bio: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  avatar: string;
  location: string;
  isVerified: boolean;
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/public/tutors");
      setTutors(res.data.tutors || []);
    } catch (err) {
      console.error("Failed to fetch public tutors:", err);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const tutorName = tutor.name || "Anonymous Tutor";
    let tutorSubjects = tutor.subjects || [];
    
    // Fallback: If the backend hasn't updated yet and returns a JSON string instead of an array
    if (typeof tutorSubjects === 'string') {
      try {
        tutorSubjects = JSON.parse(tutorSubjects);
      } catch (e) {
        tutorSubjects = [];
      }
    }

    return (
      tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(tutorSubjects) && tutorSubjects.some(s => typeof s === 'string' && s.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar />
      
      {/* Hero Section styled identically to Blog page */}
      <section className="bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="container-nets">
          <div className="max-w-3xl">
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Our Tutors</div>
            <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Find Your Perfect <br /><span style={{ fontWeight: 700, color: 'var(--primary)' }}>Tutor.</span>
            </h1>
            <p className="text-body-lg text-white/70">
              Browse our directory of top-rated educators, check their verified credentials, and book a session today to accelerate your learning.
            </p>
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container-nets">
           {/* Filters & Search */}
           <div className="flex flex-col md:flex-row gap-4 mb-12">
             <div className="flex-1 relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search by name or subject..."
                 className="w-full bg-white shadow-sm border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-navy placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-navy hover:bg-slate-50 transition-colors">
               <Filter className="w-5 h-5" />
               <span>Filters</span>
             </button>
           </div>

           {/* Tutor Grid */}
           {loading ? (
             <div className="flex items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-navy animate-spin" />
             </div>
           ) : filteredTutors.length === 0 ? (
             <div className="text-center text-muted py-12">No tutors found. Try adjusting your search keywords.</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredTutors.map((tutor) => {
                 const tName = tutor.name || "Anonymous Tutor";
                 const tAvatar = tutor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tName)}&background=0D1B2A&color=fff`;
                 const tRate = tutor.hourlyRate || tutor.hourly_rate || 0;
                 const tLocation = tutor.location || "Online";
                 const tReviews = tutor.reviewCount || tutor.total_reviews || 0;
                 
                 let tSubjects = tutor.subjects || [];
                 if (typeof tSubjects === 'string') {
                   try { tSubjects = JSON.parse(tSubjects); } catch (e) { tSubjects = []; }
                 }
                 if (!Array.isArray(tSubjects)) tSubjects = [];

                 return (
                 <article key={tutor.id} className="bg-white rounded-sm shadow-sm hover:shadow-card-lg transition-shadow overflow-hidden flex flex-col border border-gray-200">
                    <div className="relative h-48 overflow-hidden bg-nets-light flex items-center justify-center border-b border-gray-200">
                      <img 
                        src={tAvatar} 
                        alt={tName} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {(tutor.isVerified || tutor.is_verified) && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-navy text-xs fw-600 px-3 py-1 rounded-sm flex items-center gap-1">
                            <Star size={12} className="text-amber fill-current" /> Verified
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-navy/90 text-white text-xs fw-600 px-3 py-1 rounded-sm shadow-sm backdrop-blur-sm">
                        ₦{tRate.toLocaleString()} <span className="text-white/70 fw-400">/hr</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between text-xs text-muted mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {tLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-amber fill-current" /> {tutor.rating} ({tReviews})
                        </span>
                      </div>
                      <h2 className="text-xl fw-600 mb-3 text-navy leading-tight">
                        {tName}
                      </h2>
                      <p className="text-sm text-muted mb-6 flex-1 line-clamp-3">
                        {tutor.bio || tutor.headline}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {tSubjects.map((sub: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-nets-light border border-gray-200 text-[10px] fw-600 text-muted rounded-sm">
                            {sub}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-200">
                        <Link href={`/signup`} className="btn btn-outline-navy w-full text-center block" style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                          Book Now
                        </Link>
                      </div>
                    </div>
                 </article>
                 );
               })}
             </div>
           )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
