"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Filter, Star, MapPin, Loader2, User } from "lucide-react";
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
      setTutors(res.data || []);
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
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-32">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-6 text-center">
           <div className="max-w-3xl mx-auto space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-[10px] font-black text-green mb-4 uppercase tracking-[0.2em]">
                <User className="w-3 h-3" />
                Verified Experts
             </div>
             <h1 className="text-5xl md:text-6xl font-display font-black text-white">
               Find Your Perfect <span className="text-green">Tutor</span>
             </h1>
             <p className="text-gray-400 text-lg">
               Browse our directory of top-rated educators and book a session today.
             </p>
           </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-6 space-y-12">
           {/* Filters & Search */}
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="relative flex-1 w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                 <input 
                   type="text" 
                   placeholder="Search by name or subject..."
                   className="w-full bg-navy/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-green/50 transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                 <Filter className="w-4 h-4" /> Filters
              </button>
           </div>

           {/* Tutor Grid */}
           {loading ? (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-green animate-spin" />
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredTutors.map((tutor) => (
                 <div key={tutor.id} className="group p-8 rounded-[40px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                       <div className="relative">
                          <img src={tutor.avatar} alt={tutor.name} className="w-20 h-20 rounded-[28px] object-cover border-2 border-white/10 shadow-xl" />
                          {tutor.isVerified && (
                             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green rounded-full border-4 border-navy flex items-center justify-center">
                                <Star className="w-2.5 h-2.5 text-navy fill-current" />
                             </div>
                          )}
                       </div>
                       <div className="text-right">
                          <div className="text-2xl font-display font-black text-white">₦{tutor.hourlyRate.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">per hour</div>
                       </div>
                    </div>

                    <div className="flex-1 space-y-4">
                       <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-green transition-colors">{tutor.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                             <MapPin className="w-3 h-3" /> {tutor.location}
                          </div>
                       </div>
                       
                       <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                         {tutor.bio}
                       </p>

                       <div className="flex flex-wrap gap-2">
                          {tutor.subjects.map((sub, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-300">
                               {sub}
                            </span>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                       <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber fill-current" />
                          <span className="text-sm font-bold text-white">{tutor.rating}</span>
                          <span className="text-[10px] text-gray-500">({tutor.reviewCount})</span>
                       </div>
                       <Link 
                         href={`/signup`}
                         className="py-3 rounded-xl bg-green text-navy font-black text-xs text-center hover:bg-green/90 transition-all"
                       >
                          BOOK NOW
                       </Link>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
