import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight01 } from '@/lib/hugeicons-compat';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axiosInstance from '@/lib/axiosConfig';

const ResultsLookup: React.FC = () => {
  const [schoolCode, setSchoolCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!schoolCode.trim()) {
      setError('Please enter a school code');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axiosInstance.get(`/onboarding/school/slug/${schoolCode.trim()}`);
      
      if (response.data.success && response.data.data) {
        const school = response.data.data;
        navigate(`/${school.slug}/result-checker`);
      } else {
        setError('Invalid school code. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid school code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
        {/* Background Image */}
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        {/* Gradient Overlay - Dark edges to transparent center */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="relative z-10 max-w-2xl mx-auto text-center w-full">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
            Check Your <span className="text-blue-400">Results</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-16 leading-relaxed">
            Enter your school code to access your results
          </p>

          {/* Code Entry Card */}
          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-10 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={schoolCode}
                  onChange={(e) => {
                    setSchoolCode(e.target.value);
                    setError('');
                  }}
                  placeholder=" "
                  autoComplete="off"
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-lg uppercase tracking-wide"
                  disabled={loading}
                />
                <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all pointer-events-none"
                  style={schoolCode ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>
                  School Code
                </label>
              </div>

              {error && (
                <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !schoolCode.trim()}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <InlineLoadingSpinner size="sm" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    Access Results
                    <ArrowRight01 className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-gray-400 text-xs">
                Your school provided this code in email or on their website
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Results Pro</h4>
              <p className="text-gray-400 text-sm">Modern results management for Nigerian schools.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="/features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Results Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResultsLookup;
