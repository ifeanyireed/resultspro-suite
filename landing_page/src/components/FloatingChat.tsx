'use client';

import React, { useState } from 'react';
import { IconMessageCircle2, IconX, IconSend } from '@tabler/icons-react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the backend via WebSocket or API
    alert("Live chat is currently offline. Please leave a message and we'll get back to you!");
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
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#146ef5] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                RP
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm">
                Hi there! 👋 How can we help you today?
              </div>
            </div>
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
