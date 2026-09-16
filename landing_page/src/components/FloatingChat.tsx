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
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen && !ws.current) {
      // Connect to the WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = process.env.NEXT_PUBLIC_USERS_API 
        ? process.env.NEXT_PUBLIC_USERS_API.replace(/^http/, 'ws') + '/api/v1/support/ws'
        : `${protocol}//localhost:7005/api/v1/support/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to support chat');
      };

      ws.current.onmessage = (event) => {
        try {
          const newMsg = JSON.parse(event.data);
          setMessages(prev => [...prev, newMsg]);
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
    if (!message.trim() || !ws.current) return;
    
    const msgObj = {
      sender: "Guest",
      text: message,
    };
    
    ws.current.send(JSON.stringify(msgObj));
    setMessage('');
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
              <p className="text-blue-100 text-xs">We typically reply in a few minutes.</p>
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
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..." 
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5]"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-full flex items-center justify-center transition-colors"
              >
                <IconSend className="w-4 h-4" />
              </button>
            </form>
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
