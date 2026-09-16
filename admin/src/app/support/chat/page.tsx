"use client";

import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ChatMessage {
  id: string;
  session_id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export default function SupportChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionsData, setSessionsData] = useState<any[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
      const res = await fetch(`${USERS_API}/api/v1/support/chat/sessions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('resultspro_admin_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Sort by timestamp descending
        data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setSessionsData(data);
      }
    } catch (err) {}
  };

  const fetchHistory = async (sessionId: string) => {
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
      const res = await fetch(`${USERS_API}/api/v1/support/chat/history?session_id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => {
          // Merge history with current messages for this session
          const existingIds = new Set(prev.map(m => m.id));
          const newMsgs = data.filter(m => !existingIds.has(m.id));
          return [...prev, ...newMsgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        });
      }
    } catch (err) {}
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
    fetchHistory(sessionId);
  };
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = process.env.NEXT_PUBLIC_USERS_API 
      ? process.env.NEXT_PUBLIC_USERS_API.replace(/^http/, 'ws') + '/api/v1/support/ws?role=staff'
      : `${protocol}//localhost:7005/api/v1/support/ws?role=staff`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => console.log('Connected to support chat (Staff)');

    ws.current.onmessage = (event) => {
      try {
        const newMsg = JSON.parse(event.data);
        if (newMsg.type === "status") return; // Ignore status broadcasts in admin UI
        setMessages(prev => [...prev, newMsg]);
        if (newMsg.sender === "Guest" && !activeSession) {
          setActiveSession(newMsg.session_id);
        }
      } catch (e) {
        console.error("Invalid WS message", e);
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !ws.current || !activeSession) return;
    
    const msgObj = {
      sender: "Support",
      session_id: activeSession,
      text: message,
    };
    
    ws.current.send(JSON.stringify(msgObj));
    setMessage('');
  };

  // Group active session messages for the main view
  const displayMessages = messages.filter(m => m.session_id === activeSession);
  
  // Unique sessions from real-time + history
  const activeSessionIds = Array.from(new Set([...sessionsData.map(s => s.session_id), ...messages.map(m => m.session_id).filter(Boolean)]));

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Sessions Sidebar */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Active Chats</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-400 p-4 text-center">No active chats</p>
          ) : (
            activeSessionIds.map(sessionId => {
              const sessionMsgs = messages.filter(m => m.session_id === sessionId);
              const lastMsg = sessionMsgs[sessionMsgs.length - 1];
              const isActive = activeSession === sessionId;
              
              return (
                <div 
                  key={sessionId} 
                  onClick={() => handleSessionClick(sessionId)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${isActive ? 'bg-[#146ef5]/10 border-l-4 border-l-[#146ef5]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-gray-900">Visitor {sessionId.substring(0, 4)}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{lastMsg.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeSession ? `Chatting with Visitor ${activeSession.substring(0, 4)}` : 'Select a chat'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Connected</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {!activeSession ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              Select a visitor from the left to start chatting
            </div>
          ) : displayMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              Waiting for incoming messages...
            </div>
          ) : (
            displayMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'Support' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">{msg.sender}</span>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm ${
                  msg.sender === 'Support' 
                    ? 'bg-[#146ef5] text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!activeSession}
              placeholder={activeSession ? "Type your reply..." : "Select a chat to reply"} 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-3.5 pl-6 pr-12 focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!activeSession}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
