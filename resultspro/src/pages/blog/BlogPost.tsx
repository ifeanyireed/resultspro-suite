import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '@/lib/axiosConfig';
import { ChevronLeft, Heart, MessageCircle, Share2, Calendar, User, Eye, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import 'react-quill/dist/quill.snow.css';

interface BlogComment {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  htmlContent?: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  featuredImageUrl?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  comments: BlogComment[];
  _count?: {
    comments: number;
  };
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [commentForm, setCommentForm] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/super-admin/blog/public/posts/${slug}`);
        if (res.data?.success) {
          setPost(res.data.data);
          // Check if already liked in local storage
          const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
          if (likedPosts.includes(slug)) {
            setLiked(true);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Article not found');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, navigate]);

  const handleLike = async () => {
    if (!post) return;
    try {
      const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
      await axiosInstance.post(`/super-admin/blog/public/posts/${slug}/like`, {
        email: userEmail,
      });
      
      const newLikedStatus = !liked;
      setLiked(newLikedStatus);
      setPost({
        ...post,
        likeCount: newLikedStatus ? post.likeCount + 1 : post.likeCount - 1,
      });

      // Update local storage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (newLikedStatus) {
        likedPosts.push(slug);
      } else {
        const index = likedPosts.indexOf(slug);
        if (index > -1) likedPosts.splice(index, 1);
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      
      toast.success(newLikedStatus ? 'Post liked' : 'Post unliked');
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentForm.content.trim()) return;

    try {
      setSubmittingComment(true);
      await axiosInstance.post(`/super-admin/blog/public/posts/${post.id}/comments`, {
        authorName: commentForm.authorName || 'Anonymous',
        authorEmail: commentForm.authorEmail,
        content: commentForm.content,
      });

      setCommentForm({ authorName: '', authorEmail: '', content: '' });
      toast.success('Comment submitted! Waiting for approval.');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navigation />
      <style>{`
        .ql-align-center { text-align: center; }
        .ql-align-right { text-align: right; }
        .ql-align-justify { text-align: justify; }
        .prose img { border-radius: 20px; display: block; margin: 2rem auto; }
        .prose video { border-radius: 20px; width: 100%; margin: 2rem 0; }
        .prose blockquote { border-left-color: #3b82f6 !important; background: rgba(59, 130, 246, 0.05); padding: 1.5rem 2rem; font-style: italic; border-radius: 0 20px 20px 0; }
        .prose pre { background: #0f172a !important; color: #e2e8f0 !important; padding: 1.5rem; border-radius: 20px; overflow-x: auto; }
        .prose a { color: #3b82f6; text-decoration: underline; font-weight: 600; }
        .prose h1, .prose h2, .prose h3, .prose h4 { color: ${isDarkMode ? 'white' : 'black'} !important; font-weight: 800; margin-top: 3rem; }
        .prose p { margin-bottom: 1.5rem; line-height: 1.8; }
        .prose ul, .prose ol { margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; }
      `}</style>
      
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isDarkMode 
            ? 'bg-white text-black hover:bg-gray-200' 
            : 'bg-black text-white hover:bg-gray-800'
        }`}
        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0 opacity-40"
          alt="Background"
        />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-b from-black via-transparent to-black' : 'bg-white/80'}`} />
        {/* Decorative Blurs */}
        <div className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] top-0 right-0 ${isDarkMode ? 'bg-blue-600/5' : 'bg-blue-200/20'}`} />
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] bottom-0 left-0 ${isDarkMode ? 'bg-indigo-600/5' : 'bg-indigo-200/20'}`} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8 pt-40">
        {/* Back Navigation */}
        <button
          onClick={() => navigate('/blog')}
          className={`group flex items-center gap-3 mb-16 transition-all font-black uppercase tracking-[0.3em] text-[10px] ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
        >
          <div className={`p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-600/10' : 'bg-black/5 border-black/10 group-hover:border-blue-500/50 group-hover:bg-blue-600/5'}`}>
            <ChevronLeft className="w-5 h-5" />
          </div>
          Back to Articles
        </button>

        <article className="space-y-16">
          {/* Article Header */}
          <div className="space-y-10">
            <div className={`inline-block px-6 py-2 border text-[10px] font-black uppercase tracking-[0.3em] rounded-full backdrop-blur-md ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              {post.category.name}
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {post.title}
            </h1>
            
            <div className={`flex flex-wrap items-center gap-10 text-xs font-black uppercase tracking-[0.2em] pt-10 border-t ${isDarkMode ? 'text-gray-500 border-white/5' : 'text-gray-400 border-black/5'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm mb-0.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{post.authorName}</p>
                  <p className="text-[9px] opacity-50">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-black/5 border-black/10 text-gray-500'}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm mb-0.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-[9px] opacity-50">Published</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-black/5 border-black/10 text-gray-500'}`}>
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm mb-0.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{post.viewCount}</p>
                  <p className="text-[9px] opacity-50">Views</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className={`relative rounded-[60px] overflow-hidden aspect-video border shadow-2xl group ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
              <div className={`absolute inset-0 transition-colors duration-700 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'} group-hover:bg-transparent`} />
              <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content Body */}
          <div className={`backdrop-blur-2xl border rounded-[60px] p-6 md:p-20 shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -mr-48 -mt-48 ${isDarkMode ? 'bg-blue-600/5' : 'bg-blue-100/30'}`} />
            
            <div className={`prose prose-xl max-w-none relative z-10 ${isDarkMode ? 'prose-invert' : 'prose-slate'}`}>
              <div
                dangerouslySetInnerHTML={{ __html: post.htmlContent || post.content }}
                className={`ql-editor transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                style={{ padding: 0, height: 'auto', overflow: 'visible' }}
              />
            </div>

            {/* Engagement Actions */}
            <div className={`flex flex-wrap items-center gap-6 mt-20 pt-12 border-t relative z-10 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
              <button
                onClick={handleLike}
                className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border shadow-xl ${
                  liked
                    ? 'bg-pink-600 border-pink-500 text-white shadow-pink-500/20'
                    : isDarkMode 
                      ? 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                      : 'bg-white border-black/10 text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                {post.likeCount} Likes
              </button>
              <button
                onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
                className={`flex items-center gap-4 px-8 py-4 rounded-2xl border font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                  isDarkMode
                    ? 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    : 'bg-white border-black/10 text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                {post._count?.comments || 0} Comments
              </button>
              <button
                onClick={handleShare}
                className={`flex items-center gap-4 px-8 py-4 rounded-2xl border font-black uppercase tracking-widest text-xs transition-all ml-auto shadow-xl ${
                  isDarkMode
                    ? 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    : 'bg-white border-black/10 text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-16 pt-10">
            <div className="flex items-center justify-between">
              <h2 className={`text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Discussion</h2>
              <span className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-black/5 border-black/10 text-gray-500'}`}>
                {post.comments?.length || 0} Comments
              </span>
            </div>

            {/* Comment Form */}
            <form
              id="comment-form"
              onSubmit={handleCommentSubmit}
              className={`border rounded-[40px] p-10 md:p-16 space-y-10 shadow-2xl backdrop-blur-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
            >
              <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Leave a reply</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Results Admin"
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                    className={`w-full border rounded-2xl px-6 py-4 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'}`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Your Email *</label>
                  <input
                    type="email"
                    placeholder="admin@school.com"
                    required
                    value={commentForm.authorEmail}
                    onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                    className={`w-full border rounded-2xl px-6 py-4 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'}`}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Comment</label>
                <textarea
                  placeholder="Share your thoughts on this article..."
                  required
                  rows={6}
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  className={`w-full border rounded-2xl px-6 py-5 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'}`}
                />
              </div>
              <button
                type="submit"
                disabled={submittingComment}
                className="px-12 py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl transition-all font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/20"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-10 backdrop-blur-md rounded-[40px] border flex gap-8 group transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-black/5 hover:bg-gray-50'}`}
                  >
                    <div className={`w-16 h-16 rounded-[24px] flex-shrink-0 flex items-center justify-center border font-black text-xl group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                      {comment.authorName.charAt(0)}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{comment.authorName}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></span>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className={`leading-relaxed text-base font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-24 rounded-[40px] border border-dashed ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                  <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}>
                    <MessageCircle className={`w-10 h-10 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                  </div>
                  <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className={`border-t py-20 px-4 md:px-8 mt-20 transition-colors duration-500 ${isDarkMode ? 'border-white/5 bg-black' : 'border-black/5 bg-white'}`}>
        <div className="max-w-5xl mx-auto text-center">
          <img src="/logo.png" alt="Results Pro" className={`h-12 w-auto mx-auto mb-8 transition-all duration-500 ${isDarkMode ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : 'opacity-80'}`} />
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase mb-4">
            &copy; 2026 Results Pro. All rights reserved.
          </p>
          <div className="flex justify-center gap-8 text-gray-600 text-xs font-black uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
