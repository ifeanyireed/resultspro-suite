import React, { useState, useEffect } from 'react';
import axios from '@/lib/axiosConfig';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import {
  Plus,
  Edit02,
  Trash01,
  CheckCircle,
  Play,
  Loading01,
  Search,
  Video,
} from '@/lib/hugeicons-compat';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface VideoTutorial {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  duration?: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VideoManagement() {
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<VideoTutorial | null>(null);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeId: '',
    duration: '',
    category: 'General',
    displayOrder: 0,
    isActive: true,
  });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/videos');
      if (res.data?.success) {
        setVideos(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const extractYoutubeId = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    
    // If it's already an 11-character ID, just return it
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.') && !trimmed.includes('?')) {
      return trimmed;
    }

    // Comprehensive YouTube URL regex
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
    
    // Fallback for cases like 'https://www.youtube.com/v/ID' or other variants
    const fallbackRegExp = /\/([a-zA-Z0-9_-]{11})(?:\?|&|$|\/)/;
    const fallbackMatch = trimmed.match(fallbackRegExp);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }

    return trimmed;
  };

  const handleCreateOrUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const extractedId = extractYoutubeId(formData.youtubeId);
      
      // Basic validation
      if (extractedId.length !== 11) {
        alert('Invalid YouTube ID. Please provide a valid YouTube URL or an 11-character video ID.');
        return;
      }

      const processedData = {
        ...formData,
        youtubeId: extractedId
      };

      if (editingVideo) {
        await axios.put(`/videos/${editingVideo.id}`, processedData);
      } else {
        await axios.post('/videos', processedData);
      }
      setFormData({
        title: '',
        description: '',
        youtubeId: '',
        duration: '',
        category: 'General',
        displayOrder: 0,
        isActive: true,
      });
      setShowVideoForm(false);
      setEditingVideo(null);
      fetchVideos();
    } catch (error: any) {
      console.error('Error saving video:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Please check the YouTube ID and other fields.';
      alert(`Failed to save video: ${errorMessage}`);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`/videos/${videoId}`);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const toggleVideoStatus = async (video: VideoTutorial) => {
    try {
      await axios.put(`/videos/${video.id}`, { isActive: !video.isActive });
      fetchVideos();
    } catch (error) {
      console.error('Error toggling video status:', error);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Video Tutorials</h1>
            <p className="text-gray-400">Manage the videos displayed on the Demo page</p>
          </div>
          <button
            onClick={() => {
              setEditingVideo(null);
              setFormData({
                title: '',
                description: '',
                youtubeId: '',
                duration: '',
                category: 'General',
                displayOrder: videos.length,
                isActive: true,
              });
              setShowVideoForm(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Video
          </button>
        </div>

        {/* Video List */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-400" />
              Manage Tutorials
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
            ) : videos.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-10" />
                <p>No video tutorials added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="p-5 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://img.youtube.com/vi/${video.youtubeId}/default.jpg`} 
                          alt={video.title}
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${video.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {video.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase">{video.category}</span>
                          <span className="text-[10px] text-gray-500 font-bold">Order: {video.displayOrder}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white truncate">{video.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-1">{video.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => toggleVideoStatus(video)}
                        className={`p-2 rounded-lg transition-all ${video.isActive ? 'text-green-400 hover:bg-green-400/10' : 'text-gray-400 hover:bg-white/10'}`}
                        title={video.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingVideo(video);
                          setFormData({
                            title: video.title,
                            description: video.description || '',
                            youtubeId: video.youtubeId,
                            duration: video.duration || '',
                            category: video.category,
                            displayOrder: video.displayOrder,
                            isActive: video.isActive,
                          });
                          setShowVideoForm(true);
                        }}
                        className="p-2 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-all"
                        title="Edit"
                      >
                        <Edit02 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete"
                      >
                        <Trash01 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Form Modal */}
        {showVideoForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">{editingVideo ? 'Edit Video' : 'Add New Video'}</h3>
                <button onClick={() => setShowVideoForm(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500">✕</button>
              </div>
              <form onSubmit={handleCreateOrUpdateVideo} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" 
                    placeholder="e.g., How to Upload Results in Bulk"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">YouTube Video URL or ID</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.youtubeId} 
                      onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })} 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" 
                      placeholder="e.g., https://www.youtube.com/watch?v=l7fT_8LxuTM"
                    />
                    <p className="text-[10px] text-gray-500 ml-1">You can paste the full YouTube URL or just the video ID</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                    <input 
                      type="text" 
                      value={formData.duration} 
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" 
                      placeholder="e.g., 5:24"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" 
                      placeholder="e.g., Setup, Analytics"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Display Order</label>
                    <input 
                      type="number" 
                      required 
                      value={formData.displayOrder} 
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })} 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-blue-500/50" 
                    placeholder="Short description of the video content..."
                  />
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive} 
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Active and visible on Demo page</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                    {editingVideo ? 'Update Video' : 'Add Video'}
                  </button>
                  <button type="button" onClick={() => setShowVideoForm(false)} className="px-8 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
