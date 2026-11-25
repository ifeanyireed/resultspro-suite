"use client";

import { IconCalendar as Calendar, IconClock as Clock, IconUser as User, IconChevronRight as ChevronRight, IconCircleCheck as CheckCircle2, IconWallet as Wallet, IconPlus as Plus, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { RoleGate } from '../../../components/RoleGate';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '../../../lib/api';

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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  const walletBalance = (user as any)?.coinBalance || 12500; // Fallback or use real field

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-gray-50 pb-24">
                
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12">
          <MotionRise className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-2">
                   My <span className="text-blue">Bookings</span>
                </h1>
                <p className="text-gray-600">Manage your scheduled sessions and pending requests.</p>
             </div>
             <button onClick={() => setStep(2)} className="px-6 py-3 rounded-2xl bg-green text-navy font-bold flex items-center gap-2 hover:opacity-95 transition-all shadow-sm">
                <Plus className="w-5 h-5" /> Book New Session
             </button>
          </MotionRise>

          <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Booking List (Left) */}
             <MotionRise className="md:col-span-2 space-y-4">
                {bookings.length > 0 ? bookings.map(booking => (
                  <div key={booking.id} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                              <User className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-gray-900">{booking.tutor}</h3>
                              <div className="text-xs text-gray-500">{booking.subject}</div>
                           </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === 'Confirmed' ? 'bg-green/20 text-navy' : 'bg-blue/10 text-blue'
                        }`}>
                          {booking.status}
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Calendar className="w-4 h-4 text-gray-400" /> {booking.date}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Clock className="w-4 h-4 text-gray-400" /> {booking.time}
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="text-gray-900 font-black">{booking.price}</div>
                        <div className="flex gap-2">
                           <button className="px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">Reschedule</button>
                           <button className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-all">Cancel</button>
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="p-16 rounded-[40px] bg-white border border-dashed border-gray-200 text-center">
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No bookings found</p>
                  </div>
                )}
             </MotionRise>

             {/* Sidebar Info (Right) */}
             <MotionRise delay={0.1} className="space-y-6">
                <section className="p-8 rounded-[40px] bg-navy text-white border border-gray-100 shadow-lg">
                   <div className="w-12 h-12 rounded-2xl bg-green/20 flex items-center justify-center text-green mb-6">
                      <Wallet className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-display font-bold text-white mb-2">Student Wallet</h3>
                   <div className="text-3xl font-black text-white mb-6">₦{walletBalance.toLocaleString()}</div>
                   <button className="w-full py-4 rounded-2xl bg-green text-navy font-bold hover:opacity-95 transition-all">
                      Top Up Now
                   </button>
                </section>
                {/* ... rest of sidebar ... */}
                <section className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                   <h4 className="text-sm font-bold text-gray-900 mb-4">Quick Stats</h4>
                   <div className="space-y-4">
                      {[
                        { label: 'Completed', value: bookings.filter(b => b.status === 'Completed').length.toString() },
                        { label: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length.toString() },
                        { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length.toString() },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between items-center">
                           <span className="text-xs text-gray-500">{s.label}</span>
                           <span className="text-sm font-bold text-gray-900">{s.value}</span>
                        </div>
                      ))}
                   </div>
                </section>
             </MotionRise>
          </MotionStagger>
        </div>
      </main>
    </RoleGate>
  );
}
