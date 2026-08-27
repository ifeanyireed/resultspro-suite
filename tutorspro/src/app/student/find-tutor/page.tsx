"use client";

import { IconSearch as Search, IconFilter as Filter, IconStar as Star, IconClock as Clock, IconHeart as Heart, IconSlidersHorizontal as SlidersHorizontal, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function FindTutor() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState("");
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Mathematics', 'Science', 'English', 'Coding', 'Arts'];

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const res = await api.get('/public/tutors');
        setTutors(res.data || []);
      } catch (err) {
        console.error('Failed to fetch tutors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tutor.subjects?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || tutor.subjects?.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
                
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                Discover <span className="text-green">Experts</span>
              </h1>
              <p className="text-gray-400">Find the right mentor for your learning goals.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Subject or tutor name..." 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-green outline-none transition-all" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                  <SlidersHorizontal className="w-6 h-6" />
               </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                   activeCategory === cat ? 'bg-green-600 text-white border-green' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          {/* Tutor Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
               <Loader2 className="w-12 h-12 text-green animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTutors.length > 0 ? filteredTutors.map((tutor, i) => (
                <div key={tutor.id} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all relative group">
                  <button className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-500 hover:text-red-500 transition-colors">
                     <Heart className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green/20 to-blue/20 flex items-center justify-center text-white text-2xl font-black">
                       {tutor.name[0]}
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-green transition-colors">{tutor.name}</h3>
                        <div className="text-xs text-gray-500">{tutor.subjects?.[0] || "General Tutor"}</div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                     <div className="flex items-center gap-1 text-amber font-bold text-sm">
                        <Star className="w-3 h-3 fill-current" /> {tutor.rating}
                        <span className="text-gray-500 font-normal ml-1">({tutor.reviewCount})</span>
                     </div>
                     <div className="text-white font-black">₦{tutor.hourlyRate?.toLocaleString()}</div>
                  </div>

                  <p className="text-sm text-gray-400 mb-6 line-clamp-2">{tutor.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-8">
                     {tutor.isVerified && <span className="px-3 py-1 rounded-lg bg-green/10 text-[10px] uppercase font-bold tracking-widest text-green">Verified</span>}
                     {tutor.subjects?.slice(0, 2).map((s: string) => (
                       <span key={s} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] uppercase font-bold tracking-widest text-gray-500">{s}</span>
                     ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                     <Clock className="w-3 h-3 text-amber" /> {tutor.location}
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold hover:shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all">
                     View Full Profile
                  </button>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
                   <p className="text-gray-500 font-bold">No tutors found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </RoleGate>
  );
}
