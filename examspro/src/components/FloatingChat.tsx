'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IconMessageCircle2, IconX, IconSend } from '@tabler/icons-react';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStaffOnline, setIsStaffOnline] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  
  useEffect(() => {
    const fetchHistory = async (sid: string) => {
      try {
        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
        const res = await fetch(`${USERS_API}/api/v1/support/chat/history?session_id=${sid}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {}
    };

    let sid = localStorage.getItem('support_chat_session');
    if (sid) {
      fetchHistory(sid);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !ws.current) {
      
      // Connect to the WebSocket
      let sessionId = localStorage.getItem('support_chat_session');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('support_chat_session', sessionId);
      }
      
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      let wsUrl = process.env.NEXT_PUBLIC_USERS_API 
        ? process.env.NEXT_PUBLIC_USERS_API.replace(/^http/, 'ws') + '/api/v1/support/ws'
        : `${protocol}//localhost:7005/api/v1/support/ws`;
      
      wsUrl += `?role=guest&session_id=${sessionId}`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to support chat');
      };

      ws.current.onmessage = (event) => {
        try {
          const newMsg = JSON.parse(event.data);
          if (newMsg.type === "status") {
            setIsStaffOnline(newMsg.staff_online);
          } else {
            setMessages(prev => [...prev, newMsg]);
          }

        } catch (e) {
          console.error("Invalid WS message", e);
        }
      };

      ws.current.onclose = () => {
        console.log('Disconnected from support chat');
        ws.current = null;
      };
    }

    return () => {
      // Optional: close connection when closed
      // if (ws.current) ws.current.close();
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      alert("Live chat is disconnected. Please ensure you have a stable connection and the server is running.");
      return;
    }
    
    const msgObj = {
      sender: "Guest",
      text: message,
    };
    
    try {
      ws.current.send(JSON.stringify(msgObj));
      setMessage('');
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl mb-4 w-[350px] max-h-[500px] flex flex-col overflow-hidden transition-all transform origin-bottom-right animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#146ef5] text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">ResultsPRO Support</h3>
              {isStaffOnline ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-blue-50 text-xs font-medium">Support is Online</p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-gray-400/50 rounded-full"></div>
                  <p className="text-blue-100 text-xs">We typically reply in a few minutes.</p>
                </div>
              )}
            </div>
            <button 
              onClick={toggleChat}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 bg-gray-50 min-h-[300px] flex flex-col gap-3 overflow-y-auto">
            {messages.length === 0 && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#146ef5] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  RP
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm">
                  Hi there! 👋 How can we help you today?
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.sender === 'Guest' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white ${msg.sender === 'Guest' ? 'bg-gray-800' : 'bg-[#146ef5]'}`}>
                  {msg.sender === 'Guest' ? 'G' : 'RP'}
                </div>
                <div className={`bg-white border border-gray-200 p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'Guest' ? 'rounded-tr-none text-gray-900 bg-gray-50' : 'rounded-tl-none text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="relative">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend(e as any);
                  }
                }}
                placeholder="Type your message..." 
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5]"
              />
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSend(e as any);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer"
              >
                <IconSend className="w-4 h-4 pointer-events-none" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-[#146ef5]/30 transition-transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-gray-800' : 'bg-[#146ef5]'}`}
      >
        {isOpen ? <IconX className="w-6 h-6" /> : <IconMessageCircle2 className="w-6 h-6" strokeWidth={2.5} />}
      </button>
    </div>
  );
}
