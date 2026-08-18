"use client";

import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Lock,
  Globe,
  MapPin,
  User
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { registerSchool, SchoolRegistrationData } from '@/lib/school.api';

export default function SchoolSignup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [schoolName, setSchoolName] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    const registrationData: SchoolRegistrationData = {
      school_name: schoolName,
      website,
      location,
      full_name: fullName,
      email,
      password,
    };

    try {
      await registerSchool(registrationData);
      setStep(3);
    } catch (err: any) {
      const errorMessage = err.error || 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center p-4 py-20">
      <div className="max-w-xl w-full">
        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-purple' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple/20 border border-purple/30 flex items-center justify-center text-purple mb-8">
            <Building2 className="w-8 h-8" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
              <p className="font-bold">Registration Failed</p>
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Register your School</h1>
                <p className="text-gray-400">Join the TutorsPRO network to manage your students and teachers efficiently.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">School Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. Greenwood International Academy"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">School Website</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple transition-colors" />
                    <input 
                      type="text" 
                      placeholder="www.academy.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple transition-colors" />
                    <input 
                      type="text" 
                      placeholder="City, Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!schoolName || !website || !location}
                className="w-full py-4 rounded-2xl bg-purple text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:bg-purple/50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Credentials</h1>
                <p className="text-gray-400">Set up the primary administrator account for your school.</p>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple transition-colors" />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple transition-colors" />
                    <input 
                      type="email" 
                      placeholder="admin@school.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading || !fullName || !email || !password}
                  className="flex-[2] py-4 rounded-2xl bg-purple text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:bg-purple/50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Complete Setup'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-full bg-green/20 border border-green/30 flex items-center justify-center text-green mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Aboard!</h1>
                <p className="text-gray-400 max-w-sm mx-auto">Your school has been registered. Our team will verify your documents within 24 hours.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-left">
                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Next Steps:</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 shrink-0" /> Complete branding profile</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 shrink-0" /> Invite your first 5 teachers</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 shrink-0" /> Setup your subscription</li>
                </ul>
              </div>

              <Link 
                href="/school/dashboard"
                className="block w-full py-4 rounded-2xl bg-purple text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Already have a school account? <Link href="/login" className="text-purple font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
