"use client";

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { IconSend as Send, IconSparkles as Sparkles, IconBook as BookOpen, IconBolt as Zap, IconChevronLeft as ChevronLeft, IconLoader2 as Loader2, IconAlertCircle as AlertCircle, IconHistory as History, IconMessage as MessageSquare } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export default function StudyAssistantPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/study-assistant/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to load assistant dashboard");
    }
  };

  const handleSend = async (text: string = input, topicId?: number) => {
    if (!text.trim() && !topicId) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text || "Help me study this topic",
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/study-assistant/chat', {
        message: userMsg.content,
        sessionId: currentSessionId,
        topicId
      });

      setMessages(prev => [...prev, res.data.message]);
      setCurrentSessionId(res.data.sessionId);
      
      // Update dashboard if needed (e.g. session list)
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/study-assistant/sessions/${sessionId}/messages`);
      setMessages(res.data);
      setCurrentSessionId(sessionId);
    } catch (err) {
      toast.error("Failed to load session history");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  return (
    <main className="min-h-screen bg-[var(--color-nets-light)] flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden p-4 md:p-8 gap-6">
        
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-80 space-y-6">
          {/* Weak Topics */}
          <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-red-600 fill-current" />
              Focus Areas
            </h3>
            <div className="space-y-2">
              {dashboardData?.weakTopics?.length > 0 ? (
                dashboardData.weakTopics.map((topic: any) => (
                  <button 
                    key={topic.id}
                    onClick={() => handleSend(`Can you teach me about ${topic.name}?`, topic.id)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all group"
                  >
                    <div className="text-xs font-bold text-[var(--color-nets-navy-dark)] mb-1 group-hover:text-red-600 transition-colors">{topic.name}</div>
                    <div className="text-[10px] text-gray-500 font-medium">Accuracy: {Math.round(topic.accuracy)}%</div>
                  </button>
                ))
              ) : (
                <p className="text-[10px] text-gray-600 italic leading-relaxed">
                  No performance data yet. Keep taking quizzes to identify your weak spots!
                </p>
              )}
            </div>
          </section>

          {/* Recent History */}
          <section className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <History className="w-3 h-3" />
                Recent Chats
              </h3>
              <button onClick={startNewSession} className="text-[10px] font-bold text-red-600 hover:underline">New Chat</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {dashboardData?.recentSessions?.map((session: any) => (
                <button 
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all truncate text-[10px] font-bold ${currentSessionId === session.id ? 'bg-red-600/10 border-red-600/30 text-red-600' : 'bg-white border-slate-200 border-transparent shadow-sm text-gray-600 hover:bg-slate-50'}`}
                >
                  {session.title || 'Untitled Session'}
                </button>
              ))}
              {dashboardData?.recentSessions?.length === 0 && (
                <p className="text-[10px] text-gray-600 italic text-center py-10">No chat history yet.</p>
              )}
            </div>
          </section>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-[40px] border border-slate-200 shadow-sm backdrop-blur-xl backdrop-saturate-[1.2] shadow-xl overflow-hidden relative">
          
          {!user && mounted ? (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex items-center justify-center p-8 text-center">
              <div className="max-w-sm space-y-6">
                <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-nets-navy-dark)]">Unlock Your AI Tutor</h3>
                <p className="text-gray-600 text-sm">
                  Sign in to chat with our AI Study Assistant, get help with difficult topics, and track your focus areas.
                </p>
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => window.location.href = '/login?redirect=/study-assistant'}
                    className="w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500 to-red-800 hover:opacity-90 text-white font-bold h-14 rounded-2xl"
                  >
                    Login to Continue
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/register'}
                    variant="ghost" 
                    className="w-full text-gray-500 hover:text-[var(--color-nets-navy-dark)]"
                  >
                    Create Free Account
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Chat Header */}
          <div className="p-6 border-b border-slate-200 shadow-sm flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[var(--color-nets-navy-dark)] font-bold leading-none mb-1">Study Assistant</h2>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Online • AI Powered</p>
              </div>
            </div>
            <Button variant="ghost" className="lg:hidden text-gray-500 p-2"><AlertCircle className="w-5 h-5" /></Button>
          </div>

          {/* Messages Container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-50 px-10">
                <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-gray-500 mb-2">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[var(--color-nets-navy-dark)] text-xl font-bold">How can I help you today?</h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Ask me to explain a concept, create a mini-quiz, or help you with a topic you're struggling with.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Teach me Algebra", "Chemistry Syllabus", "Practice Quiz"].map((hint) => (
                    <button 
                      key={hint}
                      onClick={() => handleSend(hint)}
                      className="px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-gray-600 hover:bg-slate-50 hover:text-[var(--color-nets-navy-dark)] transition-all"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-3xl ${msg.role === 'user' ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500 to-red-800 text-white rounded-tr-none' : 'bg-slate-50 text-[var(--color-nets-navy-dark)] rounded-tl-none border border-slate-200 shadow-sm'}`}>
                  <div className="markdown-content text-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <div className={`text-[8px] font-bold mt-2 uppercase tracking-widest ${msg.role === 'user' ? 'text-gray-500' : 'text-gray-600'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-5 rounded-3xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Assistant is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your study question..."
                disabled={isLoading}
                className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-6 pr-16 text-[var(--color-nets-navy-dark)] focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-600"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500 to-red-800 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-4">
               <p className="text-[8px] text-gray-600 uppercase tracking-[0.2em] font-bold">
                 Each query costs 2 Coins • AI can make mistakes
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
