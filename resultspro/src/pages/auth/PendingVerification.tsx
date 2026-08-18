import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from '@/lib/hugeicons-compat';
import Navigation from '@/components/Navigation';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Animation styles
const animationStyles = `
  @keyframes glowPulse {
    0%, 100% {
      text-shadow: 
        0 0 20px rgba(59, 130, 246, 0.8),
        0 0 40px rgba(59, 130, 246, 0.5),
        0 0 60px rgba(59, 130, 246, 0.3);
    }
    50% {
      text-shadow: 
        0 0 30px rgba(59, 130, 246, 1),
        0 0 60px rgba(59, 130, 246, 0.8),
        0 0 90px rgba(59, 130, 246, 0.6),
        0 0 120px rgba(59, 130, 246, 0.4);
    }
  }
  
  .timer-glow {
    animation: glowPulse 2s ease-in-out infinite;
  }
`;

interface LocationState {
  schoolId?: string;
  schoolName?: string;
  documentType?: string;
}

const PendingVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [minutes, setMinutes] = useState(60);
  const [seconds, setSeconds] = useState(0);
  const [isApproved, setIsApproved] = useState(false);

  const schoolId = state?.schoolId || localStorage.getItem('schoolId') || '';
  const schoolName = state?.schoolName || localStorage.getItem('schoolName') || 'Your School';
  const documentType = state?.documentType || localStorage.getItem('documentType') || 'CAC';

  // Inject animation styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = animationStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Poll for approval status
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/school-status/${schoolId}`);
        if (response.data.data && response.data.data.status === 'APPROVED') {
          setIsApproved(true);
        }
      } catch (error) {
        // Silent error - school not approved yet
      }
    };

    // Check immediately
    checkApprovalStatus();

    // Check every 10 seconds
    const statusCheckInterval = setInterval(checkApprovalStatus, 10000);

    return () => clearInterval(statusCheckInterval);
  }, [schoolId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        const mins = Math.floor(newTime / 60);
        const secs = newTime % 60;
        setMinutes(mins);
        setSeconds(secs);

        if (newTime <= 0) {
          clearInterval(timer);
        }
        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoHome = () => {
    localStorage.removeItem('schoolId');
    localStorage.removeItem('schoolName');
    localStorage.removeItem('documentType');
    navigate('/auth/login');
  };

  if (isApproved) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex flex-col">
        <Navigation />

        {/* Approved Section */}
        <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
          {/* Background Image */}
          <img
            src="/Hero.png"
            className="absolute h-full w-full object-cover inset-0"
            alt="Background"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

          <div className="relative z-10 max-w-md mx-auto text-center w-full">
            <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight leading-tight text-white">
              School Approved
            </h1>
            <p className="text-gray-400 text-sm mb-12">
              <span className="text-green-400 font-semibold">{schoolName}</span> is now verified
            </p>

            {/* Approved Card */}
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] space-y-8">
              {/* Check Icon */}
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>

              {/* Success Message */}
              <div className="space-y-4 py-4">
                <p className="text-gray-300 text-sm">
                  Your school is now verified and approved. You can access your dashboard.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGoHome}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white"
              >
                Return to Login
              </button>

              {/* Email Contact */}
              <div className="text-center border-t border-white/10 pt-4">
                <p className="text-gray-400 text-sm mb-2">Have questions?</p>
                <p className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                  Contact support@resultspro.ng
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />

      {/* Pending Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
        {/* Background Image */}
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="relative z-10 max-w-md mx-auto text-center w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight leading-tight text-white">
            Verification Pending
          </h1>
          <p className="text-gray-400 text-sm mb-12">
            We're reviewing your <span className="text-blue-400 font-semibold">{schoolName}</span> documents
          </p>

          {/* Pending Card */}
          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] space-y-8">
            {/* Timer with Glow */}
            <div className="space-y-3 py-4 border-t border-white/10 border-b">
              <p className="text-gray-400 text-sm">Estimated time to completion:</p>
              <div 
                className="text-6xl font-bold text-blue-400 tracking-wider relative timer-glow"
                style={{ 
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="text-gray-500 text-xs">
                You can close this page and check back later
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGoHome}
              className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white"
            >
              Return to Login
            </button>

            {/* Email Contact */}
            <div className="text-center border-t border-white/10 pt-4">
              <p className="text-gray-400 text-sm mb-2">Have questions?</p>
              <p className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                Contact support@resultspro.ng
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PendingVerification;
