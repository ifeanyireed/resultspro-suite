import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import FeatureCard from '@/components/ui/FeatureCard';
import { ArrowRight01 } from '@/lib/hugeicons-compat';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playCount, setPlayCount] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Play video on page load
    if (videoRef.current && playCount < 3) {
      videoRef.current.play();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleVideoEnd = () => {
    const newPlayCount = playCount + 1;
    setPlayCount(newPlayCount);
    
    if (newPlayCount >= 3) {
      setShowVideo(false);
    } else if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoHover = () => {
    if (playCount < 3 && videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="w-full bg-black text-white">
      <style>{`
        @keyframes subtleGlow {
          0%, 100% {
            box-shadow: 0 1px 3px 0 rgba(199, 220, 255, 0.35) inset, 0 0 20px 0 rgba(198, 204, 255, 0.20) inset, 0 1px 22px 0 rgba(255, 255, 255, 0.10), 0 4px 4px 0 rgba(0, 0, 0, 0.05), 0 10px 10px 0 rgba(0, 0, 0, 0.10);
          }
          50% {
            box-shadow: 0 1px 3px 0 rgba(199, 220, 255, 0.45) inset, 0 0 20px 0 rgba(198, 204, 255, 0.30) inset, 0 1px 22px 0 rgba(255, 255, 255, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.05), 0 10px 10px 0 rgba(0, 0, 0, 0.10);
          }
        }
        
        .glow-button {
          animation: subtleGlow 3s ease-in-out infinite;
        }
      `}</style>
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-between px-4 md:px-12 lg:px-20 overflow-hidden bg-black -mt-16" onMouseEnter={handleVideoHover}>
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Video Background */}
          {showVideo && playCount < 3 && (
            <video
              ref={videoRef}
              src="/cover4.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              muted
              onEnded={handleVideoEnd}
            />
          )}
          
          {/* Image Background - Always visible as fallback */}
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 ${showVideo && playCount < 3 ? 'opacity-0' : 'opacity-100'}`}
            style={{
              backgroundImage: "url('/cover4.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center right'
            }}
          />
          
          {/* Gradient Overlay - Left to Right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
          {/* Dissolving Gradient - Bottom Fade */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl pt-20">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
            Results Pro
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
            The all-in-one platform that makes publishing, sharing, and analyzing student results effortless. Join thousands of schools already using Results Pro by Scholars.ng. Free for first 100 students!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/demo" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              <span className="text-lg">▶</span>
              VIEW DEMO
            </Link>
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              GET STARTED
            </Link>
          </div>

          {/* Social proof */}
          <div className="text-sm text-gray-400">
            Free for first 100 students • No credit card required
          </div>
        </div>

        {/* Right side - empty space for character/illustration */}
        <div className="hidden lg:block absolute right-0 bottom-0 z-10 w-1/3">
          {/* Character/Illustration space */}
        </div>
      </section>

      {/* Teams Section */}
      <section className="relative w-full bg-black overflow-hidden">
        <img
          src="/Teams.png"
          className="w-full h-auto object-cover"
          alt="Teams"
        />
      </section>

      {/* Features Overview Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        {/* Blurry Background Image */}
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        {/* Gradient Overlay - Dark edges to transparent center */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why Schools Love <span className="text-blue-400">Results Pro</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Built specifically for Nigerian schools with the features that matter most
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Zero Teacher Login',
                description: 'CSV upload system means teachers never need an account. Simple, fast, secure. Streamline your workflow and reduce administrative burden.',
                icon: null,
                image: '/Score.png',
              },
              {
                title: 'Social-First Design',
                description: 'Auto-generated shareable achievement graphics that parents love. Transform student success into celebration-worthy moments.',
                icon: null,
                image: '/Social.png',
              },
              {
                title: 'Mobile App',
                description: 'Real-time academic monitoring. Parents stay engaged on the go with push notifications and instant result updates.',
                icon: null,
                image: '/video.png',
              },
              {
                title: 'Beautiful Analytics',
                description: 'Disney-inspired glassomorphic dashboards with engaging visualizations. See trends, patterns, and student growth at a glance.',
                icon: null,
                image: '/LessonDashboard.png',
              },
              {
                title: 'Result Checker',
                description: 'Innovative scratch card system for result verification and validation. Gamify the result-checking experience for students.',
                icon: null,
                image: '/Results.png',
              },
              {
                title: 'Built-In Monetization',
                description: 'Premium features that generate revenue while helping schools. Create additional income streams without compromising quality.',
                icon: null,
                image: '/Payment.png',
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <FeatureCard
                  key={index}
                  preview={
                    feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className={`h-auto rounded-md object-cover ${feature.image === '/Score.png' ? 'w-1/2 mx-auto' : 'w-full'}`}
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex w-8 h-8 shrink-0 rounded-lg items-center justify-center bg-[#3395FF]">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-300 font-medium">Feature {index + 1}</div>
                          <div className="text-gray-500">Learn more →</div>
                        </div>
                      </div>
                    )
                  }
                  isImagePreview={!!feature.image}
                  title={feature.title}
                  description={feature.description}
                  buttonText="Start learning →"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        {/* Gradient Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl top-0 left-1/4 -translate-x-1/2" />
          <div className="absolute w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl bottom-0 right-1/4 translate-x-1/2" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How Results Pro Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Upload Results',
                description: 'Simply upload your student results via CSV. No complex setup needed.',
                image: '/Upload.png',
              },
              {
                title: 'Publish Results',
                description: 'Our system auto-generates the result for the assessment for you, Which can be printed or forwarded to parents via email in one click.',
                image: '/Result.png',
              },
              {
                title: 'Parent Engagement',
                description: 'Parents check results and stay engaged via mobile app in real-time.',
                image: '/Results.png',
              },
            ].map((item, index) => (
              <div key={index} className="relative rounded-[20px] border border-[rgba(255,255,255,0.10)] backdrop-blur-[10px] bg-[rgba(0,0,0,0.40)] overflow-hidden hover:bg-white/5 transition-all duration-300 flex flex-col">
                {/* Image Container */}
                {item.image && (
                  <div className={`w-full flex items-center justify-center py-6 ${item.image === '/Upload.png' ? '' : 'px-6'}`}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className={`object-cover ${item.image === '/Upload.png' ? 'w-1/2' : 'w-full'}`}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="px-6 pb-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Results Management?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join schools across Nigeria already using Results Pro. Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Start Free Trial
              <ArrowRight01 className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Results Pro</h4>
              <p className="text-gray-400 text-sm">
                Modern results management for Nigerian schools.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
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

export default Landing;
