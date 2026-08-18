import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight01, Eye, EyeOff } from '@/lib/hugeicons-compat';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axiosInstance from '@/lib/axiosConfig';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'microsoft' | null>(null);
  const navigate = useNavigate();

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

    if (userRole === 'SUPER_ADMIN') return navigate('/super-admin/verifications');
    if (userRole === 'AGENT') return navigate('/agent/dashboard');
    if (userRole === 'PARENT') return navigate('/parent/dashboard');
    if (userRole === 'SUPPORT_AGENT') return navigate('/support-agent/dashboard');
    if (userRole === 'TEACHER') return navigate('/teacher/dashboard');

    if (user.awaitingApproval) {
      return navigate('/auth/pending-verification', {
        state: { schoolId: school?.id, schoolName: school?.name },
      });
    }

    if (user.requiresVerification) {
      if (user.documentsSubmitted) {
        return navigate('/auth/pending-verification', {
          state: { schoolId: school?.id, schoolName: school?.name },
        });
      } else {
        return navigate('/auth/school-verification', {
          state: { schoolId: school?.id, schoolName: school?.name, documentsSubmitted: false },
        });
      }
    }
    
    if (school && school.onboardingStatus !== 'COMPLETE') return navigate('/onboarding');
    if (school && school.resultsSetupStatus !== 'COMPLETE') return navigate('/school-admin/results-setup');
    
    navigate('/school-admin/overview');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) return setError('Please fill in all fields');
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      handleAuthResponse(response.data.data);
    } catch (err: any) {
      const errorCode = err.response?.data?.code;
      if (errorCode === 'EMAIL_NOT_VERIFIED') {
        return navigate('/auth/verify-email', { state: { email, fromLogin: true } });
      }
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    setError('');
    setSocialLoading(provider);
    
    // In a real app, integrate Google/Microsoft SDK here to get idToken
    // For now, showing the flow with a placeholder
    try {
      // Simulate SDK call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const idToken = "SDK_TOKEN_HERE";
      // const response = await axiosInstance.post(`/auth/${provider}`, { idToken });
      // handleAuthResponse(response.data.data);
      
      toast({
        title: 'Coming Soon',
        description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login integration is being finalized.`,
      });
    } catch (err: any) {
      setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed.`);
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
          <h1 className="text-5xl md:text-6xl font-bold mb-2 text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm mb-12">Sign in to your Results Pro account</p>

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
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/50 px-2 text-gray-500 backdrop-blur-sm">Or continue with email</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder=" "
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all"
                  disabled={loading || !!socialLoading}
                />
                <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all pointer-events-none"
                  style={email ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>
                  Email Address
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder=" "
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all pr-12"
                  disabled={loading || !!socialLoading}
                />
                <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all pointer-events-none"
                  style={password ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading || !!socialLoading || !email.trim() || !password.trim()}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
              >
                {loading ? <><InlineLoadingSpinner size="sm" /><span>Signing in...</span></> : <>Sign In<ArrowRight01 className="w-5 h-5" /></>}
              </button>

              <div className="text-left"><Link to="/auth/password-reset" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">Forgot password?</Link></div>
            </form>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Don't have an account? <Link to="/auth/register" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">Sign up</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
