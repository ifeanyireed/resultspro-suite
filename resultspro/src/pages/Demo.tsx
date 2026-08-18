import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/lib/axiosConfig';
import Navigation from '@/components/Navigation';
import { ArrowRight01, Play } from '@/lib/hugeicons-compat';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface VideoTutorial {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  duration: string;
  category: string;
}

const Demo: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/videos/active');
        if (res.data?.success) {
          const fetchedVideos = res.data.data.map((v: any) => ({
            id: v.youtubeId,
            title: v.title,
            description: v.description,
            duration: v.duration,
            category: v.category
          }));
          setVideos(fetchedVideos);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const currentVideo = videos.find(v => v.id === activeVideo) || videos[0];

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 px-4 md:px-8 lg:px-20 overflow-hidden bg-black">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] bottom-0 right-0" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Video <span className="text-blue-400">Tutorials</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Master Results Pro with our comprehensive video guides. From initial setup to advanced analytics, we've got you covered.
          </p>
        </div>
      </section>

      {/* Main Video Section */}
      <section className="relative pb-20 px-4 md:px-8 lg:px-20 bg-black">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-400">Loading tutorials...</p>
            </div>
          ) : videos.length > 0 ? (
            <>
              {/* Featured Video (Almost Full Width) */}
              <div className="mb-16">
                <div className="relative aspect-video w-full rounded-[30px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-white/5">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.id}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {currentVideo.title}
                    </h2>
                    <p className="text-gray-400 max-w-3xl">
                      {currentVideo.description}
                    </p>
                  </div>
                  <div className="flex shrink-0">
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                      {currentVideo.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Grid */}
              {videos.length > 1 && (
                <>
                  <h3 className="text-2xl font-bold mb-8 text-white">More Tutorials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video, idx) => (
                      <div 
                        key={idx}
                        className="group cursor-pointer"
                        onClick={() => {
                          setActiveVideo(video.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 mb-4 group-hover:border-blue-500/50 transition-all duration-300">
                          <img 
                            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-6 h-6 text-white fill-current" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-[10px] font-bold text-white">
                            {video.duration}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No tutorials available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to See it in Action?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of schools already using Results Pro to streamline their academic operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Start Free Trial
              <ArrowRight01 className="w-5 h-5" />
            </Link>
            <Link to="/features" className="glow-button items-center border shadow-[0_1px_3px_0_rgba(199,220,255,0.17)_inset,0_0_20px_0_rgba(198,204,255,0.10)_inset,0_1px_22px_0_rgba(255,255,255,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] flex gap-2 overflow-hidden px-6 py-3 rounded-lg border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 transition-colors text-white text-sm font-medium inline-flex">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 Results Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Demo;
