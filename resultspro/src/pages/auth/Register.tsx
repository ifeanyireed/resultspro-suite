import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight01, Eye, EyeOff, ChevronDown, Target } from '@/lib/hugeicons-compat';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axiosInstance from '@/lib/axiosConfig';
import { STATES, getLGAsByState } from '@/lib/nigerian-states-lgas';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'microsoft' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const lgas = state ? getLGAsByState(state) : [];

  const handleAuthResponse = (data: any) => {
    const { token, refreshToken, user, school } = data;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    if (school) {
      localStorage.setItem('schoolId', school.id);
      localStorage.setItem('schoolName', school.name);
      localStorage.setItem('schoolData', JSON.stringify(school));
    }

    const userRole = user.role?.toUpperCase() || '';
    if (userRole === 'PARENT') return navigate('/parent/dashboard');
    if (userRole === 'AGENT') return navigate('/agent/dashboard');
    
    // Default for social signup is parent or incomplete school admin
    navigate('/onboarding');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!schoolName.trim() || !email.trim() || !phone.trim() || !fullAddress.trim() || !state.trim() || !lga.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    try {
      await axiosInstance.post('/auth/register', {
        schoolName: schoolName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        fullAddress: fullAddress.trim(),
        state: state.trim(),
        lga: lga.trim(),
        referralCode: referralCode.trim() || undefined,
        password,
      });

      localStorage.setItem('registerEmail', email.trim());
      navigate('/auth/verify-email', { state: { email: email.trim() } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    setError('');
    setSocialLoading(provider);
    try {
      // Simulate SDK delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Coming Soon',
        description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} registration is being finalized.`,
      });
    } catch (err: any) {
      setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} registration failed.`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
        <img src="/Hero.png" className="absolute h-full w-full object-cover inset-0" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="relative z-10 max-w-md mx-auto text-center w-full">
          <h1 className="text-5xl md:text-5xl font-bold mb-2 text-white">Get Started</h1>
          <p className="text-gray-400 text-sm mb-12">Create your school account with Results Pro</p>

          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-white/10 p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading || loading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
              >
                {socialLoading === 'google' ? <InlineLoadingSpinner size="xs" /> : <FcGoogle className="w-5 h-5" />}
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('microsoft')}
                disabled={!!socialLoading || loading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
              >
                {socialLoading === 'microsoft' ? <InlineLoadingSpinner size="xs" /> : <FaMicrosoft className="w-5 h-5" />}
                Microsoft
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/50 px-2 text-gray-500 backdrop-blur-sm">Or use your school details</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {/* Form fields start */}
              <div className="relative">
                <input type="text" value={schoolName} onChange={(e) => { setSchoolName(e.target.value); setError(''); }} placeholder=" "
                  className="w-full px-6 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all"
                  disabled={loading || !!socialLoading} />
                <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none" style={schoolName ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>School Name</label>
              </div>

              <div className="relative">
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder=" "
                  className="w-full px-6 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all"
                  disabled={loading || !!socialLoading} />
                <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none" style={email ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>Email Address</label>
              </div>

              <div className="relative">
                <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }} placeholder=" "
                  className="w-full px-6 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all"
                  disabled={loading || !!socialLoading} />
                <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none" style={phone ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>Phone Number</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select value={state} onChange={(e) => { setState(e.target.value); setLga(''); setError(''); }}
                    className="w-full px-6 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                    disabled={loading || !!socialLoading}>
                    <option value="">State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={lga} onChange={(e) => { setLga(e.target.value); setError(''); }}
                    className="w-full px-6 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                    disabled={loading || !state || !!socialLoading}>
                    <option value="">LGA</option>
                    {lgas.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <input type="text" value={referralCode} onChange={(e) => { setReferralCode(e.target.value); setError(''); }} placeholder=" "
                  className="w-full px-6 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all"
                  disabled={loading || !!socialLoading} />
                <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none flex items-center gap-2" style={referralCode ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>
                  <Target className="w-3 h-3" />
                  Agent Referral Code (Optional)
                </label>
              </div>

              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder=" "
                  className="w-full px-6 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all pr-12"
                  disabled={loading || !!socialLoading} />
                <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none" style={password ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>Password</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>

              {error && <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}

              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => { setAgreeTerms(e.target.checked); setError(''); }} className="mt-1 rounded border-white/20 bg-white/5" disabled={loading} />
                <label htmlFor="terms" className="text-gray-400 text-[10px] leading-relaxed">I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a></label>
              </div>

              <button type="submit" disabled={loading || !!socialLoading || !agreeTerms}
                className="w-full py-4 rounded-[15px] font-bold transition-all duration-200 flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
              >
                {loading ? <><InlineLoadingSpinner size="sm" /><span>Creating account...</span></> : <>Create Account<ArrowRight01 className="w-5 h-5" /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">Already have an account? <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">Sign in</Link></p>
        </div>
      </section>
    </div>
  );
};

export default Register;
