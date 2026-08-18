"use client";

import { useParams, useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Send,
  Loader2,
  Coins,
  ChevronRight,
  BookOpen,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TopicData {
  id: number;
  name: string;
  aiLessonNotes: string | null;
}

import { useAuthStore } from '@/store/useAuthStore';

export default function StudyAssistantPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeducted, setIsDeducted] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (user && topicId) {
      checkInitialStatus();
    }
  }, [user, topicId]);

  const checkInitialStatus = async () => {
    try {
      const statusRes = await api.get(`/study-assistant/topic/${topicId}/status`);
      if (statusRes.data.alreadyUnlocked) {
        // Now safely load the full content since we know it's already paid
        const fullRes = await api.get(`/study-assistant/topic/${topicId}`);
        setTopic(fullRes.data.topic);
        setIsDeducted(true);
      }
    } catch (err) {
      console.error('Initial status check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudy = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/study-assistant/topic/${topicId}`);
      setTopic(response.data.topic);
      setIsDeducted(true);
      if (user && !response.data.alreadyUnlocked) {
        updateUser({ coinBalance: user.coinBalance - 5 });
      }
    } catch (err: any) {
      console.error('Error starting study session:', err);
      const msg = err.response?.data?.error || 'Failed to start study session.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post(`/study-assistant/topic/${topicId}/ask`, {
        message: input
      });
      
      const assistantMsg: Message = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, assistantMsg]);
      if (user) {
        updateUser({ coinBalance: user.coinBalance - 2 });
      }
    } catch (err) {
      console.error('Error asking assistant:', err);
      toast.error('Failed to get a response from your tutor.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {(!user && mounted) ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-[32px] bg-amber/10 text-amber flex items-center justify-center mb-8">
              <BrainCircuit className="w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              AI Study Assistant
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
              Please log in to your account to unlock personalized lesson notes and start chatting with our AI Tutor.
            </p>
            <Link href={`/login?redirect=${pathname}`} className="px-12 py-6 rounded-2xl bg-blue text-white font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all">
              Sign In to Start
            </Link>
          </div>
        ) : !isDeducted ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-[32px] bg-blue/10 text-blue flex items-center justify-center mb-8 animate-pulse">
              <Sparkles className="w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              AI Study <span className="text-blue">Assistant</span>
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
              Get personalized lesson notes, practical examples, and 24/7 tutor support for this topic.
            </p>
            
            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl max-w-sm w-full">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-amber/10 text-amber">
                  <Coins className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-white">5 COINS</span>
              </div>
              
              <button
                onClick={handleStartStudy}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Unlock Study Pack</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <p className="mt-4 text-xs text-gray-500">Deducts 5 coins from your balance to generate or access this session.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Lesson Notes */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="px-3 py-1 rounded-lg bg-blue/10 text-blue text-[10px] font-black uppercase tracking-widest border border-blue/20">
                    Topic In Focus
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">{topic?.name}</h2>
                
                <div className="markdown-content text-lg">
                  {topic?.aiLessonNotes ? (
                    <ReactMarkdown>{topic.aiLessonNotes}</ReactMarkdown>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                      <Loader2 className="w-10 h-10 text-blue animate-spin" />
                      <p className="text-gray-500 font-medium italic">Generating your comprehensive study guide... this usually takes 10-15 seconds.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: AI Tutor Chat */}
            <div className="lg:sticky lg:top-8 flex flex-col h-[600px] rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl overflow-hidden">
              <div className="p-6 bg-white/5 border-b border-white/[0.05] border-t-white/[0.1] flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green/10 text-green flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI Support</h3>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                    Always Ready to Help
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <MessageSquare className="w-12 h-12 text-gray-700 mb-4 opacity-50" />
                    <p className="text-gray-500 text-sm">Have any questions about the notes on the left? Ask me!</p>
                  </div>
                )}
                
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                      max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                      ${m.role === 'user' 
                        ? 'bg-blue text-white rounded-tr-none' 
                        : 'bg-white/5 text-gray-300 border border-white/[0.05] border-t-white/[0.1] rounded-tl-none'}
                    `}>
                      {m.role === 'assistant' ? (
                        <div className="markdown-content">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/[0.05] border-t-white/[0.1] p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-6 pt-0">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="w-full bg-navy/50 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center hover:bg-blue hover:text-white transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
