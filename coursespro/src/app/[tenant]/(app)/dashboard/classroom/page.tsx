"use client";
import React, { useEffect, useRef, useState } from 'react';
import { VideoCameraIcon, ChatBubbleBottomCenterTextIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
import DailyIframe, { DailyCall, DailyEventObjectAppMessage } from '@daily-co/daily-js';
import api from '@/lib/api';

export default function ClassroomPage() {
  const videoRef = useRef<HTMLDivElement>(null);
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{sender: string, text: string, isSelf: boolean}>>([]);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.leave();
        callObject.destroy();
      }
    };
  }, [callObject]);

  const joinSession = async () => {
    if (callObject) return;
    setIsLoading(true);
    
    try {
      const res = await api.get('/api/v1/student/classroom/session');
      const { room_url, token } = res.data;

      if (videoRef.current) {
        const frame = DailyIframe.createFrame(videoRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '1.5rem',
            backgroundColor: '#111827'
          },
          showLeaveButton: true,
          theme: {
            colors: {
              accent: '#146ef5',
              background: '#111827',
            }
          }
        });
        
        frame.on('joined-meeting', () => {
          setIsJoined(true);
          setIsLoading(false);
          updateParticipantCount(frame);
        });

        frame.on('left-meeting', () => {
          setIsJoined(false);
          setCallObject(null);
          frame.destroy();
        });

        frame.on('participant-joined', () => updateParticipantCount(frame));
        frame.on('participant-left', () => updateParticipantCount(frame));

        frame.on('app-message', (e: DailyEventObjectAppMessage) => {
          if (e.data?.message) {
            setMessages(prev => [...prev, { 
              sender: e.fromId === 'local' ? 'Me' : (frame.participants()[e.fromId]?.user_name || 'Student'), 
              text: e.data.message,
              isSelf: false
            }]);
          }
        });

        setCallObject(frame);
        await frame.join({ url: room_url, token });
      }
    } catch (err) {
      console.error("Failed to join session", err);
      setIsLoading(false);
      alert("Failed to join classroom. Please check your connection.");
    }
  };

  const updateParticipantCount = (frame: DailyCall) => {
    const participants = frame.participants();
    setParticipantCount(Object.keys(participants).length);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !callObject) return;

    // Broadcast to other participants
    callObject.sendAppMessage({ message: chatMessage });
    
    // Add to our own local state
    setMessages(prev => [...prev, { sender: 'Me', text: chatMessage, isSelf: true }]);
    setChatMessage("");
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Classroom</h1>
          <p className="text-sm text-gray-500 mt-1">Join scheduled cohort sessions and interact with mentors.</p>
        </div>
        {!isJoined && (
          <button 
            onClick={joinSession}
            disabled={isLoading}
            className="bg-[#146ef5] text-white hover:bg-[#105bd1] disabled:opacity-70 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2"
          >
            <VideoCameraIcon className="w-4 h-4" />
            {isLoading ? "Connecting..." : "Join Next Session"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Video Area */}
        <div className="lg:col-span-2 bg-gray-900 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden group shadow-sm">
          {!isJoined && (
            <>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
              <div className="text-center z-10">
                <h2 className="text-3xl font-medium text-white mb-2">Session Offline</h2>
                <p className="text-white/70">Click "Join Next Session" to connect.</p>
              </div>
            </>
          )}
          {/* Daily iframe will be injected here */}
          <div ref={videoRef} className={`w-full h-full absolute inset-0 z-20 ${isJoined ? 'block' : 'hidden'}`}></div>
        </div>
        
        {/* Custom Chat Area */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5"/> Live Chat
            </h3>
            {isJoined && (
              <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
                {participantCount} Online
              </span>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#fafafa]">
            {messages.length === 0 ? (
               <div className="text-center text-gray-400 text-sm mt-10">
                 {isJoined ? "No messages yet. Say hi!" : "Join the session to chat."}
               </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.isSelf ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ${m.isSelf ? 'bg-[#146ef5]' : 'bg-gray-400'}`}>
                    {m.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}>
                    <p className="text-[11px] font-bold text-gray-500 mb-0.5 px-1">{m.sender}</p>
                    <p className={`text-sm px-3 py-2 rounded-xl shadow-sm ${m.isSelf ? 'bg-[#146ef5] text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                      {m.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={sendMessage} className="relative">
              <input 
                type="text" 
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder={isJoined ? "Type a message..." : "Join session to chat"} 
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]" 
                disabled={!isJoined}
              />
              <button type="submit" disabled={!isJoined || !chatMessage.trim()} className="absolute right-2 top-1.5 p-1.5 text-gray-400 hover:text-[#146ef5] disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}