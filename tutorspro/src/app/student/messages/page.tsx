"use client";

import Navbar from '@/components/Navbar';
import { 
  Send, 
  Paperclip, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  ChevronLeft,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function StudentMessages() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/student/conversations');
        setContacts(res.data || []);
        if (res.data?.length > 0) {
           setSelectedChat(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    
    const fetchMessages = async () => {
      try {
        setChatLoading(true);
        const res = await api.get(`/student/conversations/${selectedChat}/messages`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to fetch messages");
      } finally {
        setChatLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  if (loading) {
    return (
      <main className="h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  const activeContact = contacts.find(c => c.id === selectedChat);

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'PARENT', 'SUPERADMIN']}>
      <main className="h-screen bg-navy flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 flex max-w-[1600px] mx-auto w-full overflow-hidden border-x border-white/5 bg-white/[0.02]">
          {/* Sidebar - Contacts */}
          <div className="w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-navy/30">
            <div className="p-6 border-b border-white/5">
              <h1 className="text-2xl font-display font-black text-white mb-6">Messages</h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search chats..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue/50 transition-all" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {contacts.length > 0 ? contacts.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => setSelectedChat(contact.id)}
                  className={`p-4 rounded-3xl cursor-pointer transition-all mb-1 flex gap-4 items-center group ${
                    selectedChat === contact.id ? 'bg-blue/10 border border-blue/20' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {contact.name[0]}
                    </div>
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green rounded-full border-4 border-navy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-white truncate">{contact.name}</h3>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{contact.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 truncate mr-2">{contact.lastMsg}</p>
                      {contact.unread > 0 && (
                        <span className="w-5 h-5 bg-blue text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-blue/20">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-gray-500 italic text-sm">No conversations yet.</div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col relative bg-navy/50">
             {activeContact ? (
               <>
                 {/* Chat Header */}
                 <div className="p-6 border-b border-white/5 flex items-center justify-between bg-navy/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white font-bold text-lg">
                          {activeContact.name[0]}
                       </div>
                       <div>
                          <h2 className="text-lg font-bold text-white leading-none mb-1">{activeContact.name}</h2>
                          <div className="text-[10px] font-bold text-green uppercase tracking-widest flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" /> {activeContact.online ? "Online" : "Away"}
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"><Phone className="w-5 h-5" /></button>
                       <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"><Video className="w-5 h-5" /></button>
                       <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"><Info className="w-5 h-5" /></button>
                       <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                 </div>

                 {/* Messages List */}
                 <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {chatLoading ? (
                      <div className="flex items-center justify-center h-full">
                         <Loader2 className="w-8 h-8 text-blue animate-spin" />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                           <span className="px-4 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/5">Today</span>
                        </div>
                        
                        {messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[70%] space-y-1 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-xl ${
                                  msg.isMe 
                                    ? 'bg-blue text-white rounded-tr-none' 
                                    : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                                }`}>
                                  {msg.text}
                                </div>
                                <div className={`flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                  {msg.time}
                                  {msg.isMe && <CheckCheck className="w-3 h-3 text-blue" />}
                                </div>
                             </div>
                          </div>
                        ))}
                      </>
                    )}
                 </div>

                 {/* Input Area */}
                 <div className="p-6 bg-navy/80 backdrop-blur-md border-t border-white/5">
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[32px] p-2 pl-6 focus-within:border-blue/50 transition-all">
                       <button className="text-gray-500 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /></button>
                       <input 
                          type="text" 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..." 
                          className="flex-1 bg-transparent py-4 text-white focus:outline-none" 
                       />
                       <button className="w-12 h-12 rounded-full bg-blue text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue/20">
                          <Send className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-6">
                     <MessageSquare className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Select a Conversation</h2>
                  <p className="text-gray-500 max-w-xs">Connect with your tutors and students to start learning.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
