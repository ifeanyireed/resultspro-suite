"use client";

import { IconCalendar as Calendar, IconClock as Clock, IconUser as User, IconChevronRight as ChevronRight, IconCircleCheck as CheckCircle2, IconWallet as Wallet, IconPlus as Plus, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function Bookings() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/student/bookings');
        setBookings(res.data || []);
      } catch (err) {
        console.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-amber animate-spin" />
      </main>
    );
  }

  const walletBalance = user?.coinBalance || 12500; // Fallback or use real field

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
                
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                   My <span className="text-amber">Bookings</span>
                </h1>
                <p className="text-gray-400">Manage your scheduled sessions and pending requests.</p>
             </div>
             <button onClick={() => setStep(2)} className="px-6 py-3 rounded-2xl bg-green-600 text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all">
                <Plus className="w-5 h-5" /> Book New Session
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Booking List (Left) */}
             <div className="md:col-span-2 space-y-4">
                {bookings.length > 0 ? bookings.map(booking => (
                  <div key={booking.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                              <User className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-white">{booking.tutor}</h3>
                              <div className="text-xs text-gray-500">{booking.subject}</div>
                           </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === 'Confirmed' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'
                        }`}>
                          {booking.status}
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                           <Calendar className="w-4 h-4 text-gray-600" /> {booking.date}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                           <Clock className="w-4 h-4 text-gray-600" /> {booking.time}
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="text-white font-black">{booking.price}</div>
                        <div className="flex gap-2">
                           <button className="px-4 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">Reschedule</button>
                           <button className="px-4 py-2 rounded-xl bg-white/5 text-red-500 font-bold text-xs hover:bg-red-500/10 transition-all">Cancel</button>
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="p-16 rounded-[40px] bg-white/5 border border-dashed border-white/10 text-center">
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No bookings found</p>
                  </div>
                )}
             </div>

             {/* Sidebar Info (Right) */}
             <div className="space-y-6">
                <section className="p-8 rounded-[40px] bg-gradient-to-br from-green/20 to-transparent border border-white/10">
                   <div className="w-12 h-12 rounded-2xl bg-green/20 flex items-center justify-center text-green mb-6">
                      <Wallet className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-display font-bold text-white mb-2">Student Wallet</h3>
                   <div className="text-3xl font-black text-white mb-6">₦{walletBalance.toLocaleString()}</div>
                   <button className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold hover:shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all">
                      Top Up Now
                   </button>
                </section>
                {/* ... rest of sidebar ... */}
                <section className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
                   <h4 className="text-sm font-bold text-white mb-4">Quick Stats</h4>
                   <div className="space-y-4">
                      {[
                        { label: 'Completed', value: bookings.filter(b => b.status === 'Completed').length.toString() },
                        { label: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length.toString() },
                        { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length.toString() },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between items-center">
                           <span className="text-xs text-gray-500">{s.label}</span>
                           <span className="text-sm font-bold text-white">{s.value}</span>
                        </div>
                      ))}
                   </div>
                </section>
             </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
