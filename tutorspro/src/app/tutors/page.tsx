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

  const filteredTutors = tutors.filter(tutor => 
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 rounded-sm bg-white border border-nets-border shadow-sm mb-12">
              <div className="relative flex-1 w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                 <input 
                   type="text" 
                   placeholder="Search by name or subject..."
                   className="w-full bg-transparent border-none py-3 pl-12 pr-6 text-navy focus:outline-none placeholder:text-muted"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="btn btn-outline-navy flex items-center gap-2">
                 <Filter size={16} /> Filters
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
               {filteredTutors.map((tutor) => (
                 <article key={tutor.id} className="bg-white rounded-sm shadow-sm hover:shadow-card-lg transition-shadow overflow-hidden flex flex-col border border-nets-border">
                    <div className="relative h-48 overflow-hidden bg-nets-light flex items-center justify-center border-b border-nets-border">
                      <img 
                        src={tutor.avatar} 
                        alt={tutor.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {tutor.isVerified && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-navy text-xs fw-600 px-3 py-1 rounded-sm flex items-center gap-1">
                            <Star size={12} className="text-amber fill-current" /> Verified
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-navy/90 text-white text-xs fw-600 px-3 py-1 rounded-sm shadow-sm backdrop-blur-sm">
                        ₦{tutor.hourlyRate.toLocaleString()} <span className="text-white/70 fw-400">/hr</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between text-xs text-muted mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {tutor.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-amber fill-current" /> {tutor.rating} ({tutor.reviewCount})
                        </span>
                      </div>
                      <h2 className="text-xl fw-600 mb-3 text-navy leading-tight">
                        {tutor.name}
                      </h2>
                      <p className="text-sm text-muted mb-6 flex-1 line-clamp-3">
                        {tutor.bio}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {tutor.subjects.map((sub, i) => (
                          <span key={i} className="px-2 py-1 bg-nets-light border border-nets-border text-[10px] fw-600 text-muted rounded-sm">
                            {sub}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-nets-border">
                        <Link href={`/signup`} className="btn btn-outline-navy w-full text-center block" style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                          Book Now
                        </Link>
                      </div>
                    </div>
                 </article>
               ))}
             </div>
           )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
