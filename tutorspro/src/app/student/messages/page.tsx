"use client";

import { IconSend as Send, IconPaperclip as Paperclip, IconSearch as Search, IconDotsVertical as MoreVertical, IconPhone as Phone, IconVideo as Video, IconInfoCircle as Info, IconChevronLeft as ChevronLeft, IconChecks as CheckCheck, IconLoader2 as Loader2, IconMessage as MessageCircle } from '@tabler/icons-react';
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
        const res = await api.get('/student/conversations').catch(() => ({ 
          data: [
            { id: "c1", name: "Sarah Jenkins", avatarUrl: "https://i.pravatar.cc/150?u=sarah", lastMsg: "I'll see you in class tomorrow!", time: "10:45 AM", unread: 2, online: true },
            { id: "c2", name: "Prof. Smith", avatarUrl: "https://i.pravatar.cc/150?u=smith", lastMsg: "Your assignment looks great.", time: "Yesterday", unread: 0, online: false }
          ] 
        }));
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
        const res = await api.get(`/student/conversations/${selectedChat}/messages`).catch(() => ({
          data: [
            { id: "m1", text: "Hi! Just wanted to check if you reviewed the notes?", time: "10:30 AM", isMe: false },
            { id: "m2", text: "Yes, I did! Very helpful.", time: "10:32 AM", isMe: true },
            { id: "m3", text: "I'll see you in class tomorrow!", time: "10:45 AM", isMe: false }
          ]
        }));
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to fetch messages");
      } finally {
        setChatLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  const activeContact = contacts.find(c => c.id === selectedChat);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#146ef5] animate-spin" />
      </main>
    );
  }

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'TUTOR', 'SUPERADMIN']}>
      <main className="min-h-screen bg-gray-50 flex flex-col pt-4 pb-20 md:pb-4 md:pt-10 px-4 md:px-8">
        <div className="w-full max-w-7xl mx-auto flex-1 flex overflow-hidden rounded-[2rem] bg-white border border-gray-200 shadow-sm min-h-[750px]">
          
          {/* Contacts Sidebar */}
          <div className={`w-full md:w-80 lg:w-[400px] flex-col border-r border-gray-100 bg-white ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Messages</h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search chats..." className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none focus:border-[#146ef5]/50 focus:bg-white transition-all shadow-sm" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
              {contacts.length > 0 ? contacts.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => setSelectedChat(contact.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all mb-1 flex gap-4 items-center group ${
                    selectedChat === contact.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    {contact.avatarUrl ? (
                      <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#146ef5] to-[#0a2e70] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {contact.name[0]}
                      </div>
                    )}
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{contact.name}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{contact.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 truncate mr-2">{contact.lastMsg}</p>
                      {contact.unread > 0 && (
                        <span className="w-5 h-5 bg-[#146ef5] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-gray-400 font-medium text-sm">No conversations yet.</div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col relative bg-gray-50/50 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
             {activeContact ? (
               <>
                 {/* Chat Header */}
                 <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white backdrop-blur-md">
                    <div className="flex items-center gap-4">
                       <button 
                         className="md:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                         onClick={() => setSelectedChat(null)}
                       >
                         <ChevronLeft className="w-6 h-6" />
                       </button>
                       {activeContact.avatarUrl ? (
                         <img src={activeContact.avatarUrl} alt={activeContact.name} className="w-11 h-11 rounded-full object-cover shadow-sm" />
                       ) : (
                         <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#146ef5] to-[#0a2e70] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {activeContact.name[0]}
                         </div>
                       )}
                       <div>
                          <h2 className="text-base font-bold text-gray-900 leading-none mb-1">{activeContact.name}</h2>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                             {activeContact.online ? (
                               <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online</>
                             ) : (
                               <><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Offline</>
                             )}
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-1">
                       <button className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#146ef5] transition-all"><Phone className="w-5 h-5" /></button>
                       <button className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#146ef5] transition-all"><Video className="w-5 h-5" /></button>
                       <div className="w-px h-6 bg-gray-200 mx-1"></div>
                       <button className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 transition-all"><Info className="w-5 h-5" /></button>
                    </div>
                 </div>

                 {/* Messages List */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('/chat-pattern.svg')] bg-repeat opacity-[0.98]">
                    {chatLoading ? (
                      <div className="flex items-center justify-center h-full">
                         <Loader2 className="w-8 h-8 text-[#146ef5] animate-spin" />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                           <span className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today</span>
                        </div>
                        
                        {messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[75%] md:max-w-[65%] space-y-1 flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-3.5 rounded-[1.25rem] text-[15px] leading-relaxed shadow-sm ${
                                  msg.isMe 
                                    ? 'bg-[#146ef5] text-white rounded-tr-[4px]' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-[4px]'
                                }`}>
                                  {msg.text}
                                </div>
                                <div className={`flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                  {msg.time}
                                  {msg.isMe && <CheckCheck className="w-3.5 h-3.5 text-[#146ef5]" />}
                                </div>
                             </div>
                          </div>
                        ))}
                      </>
                    )}
                 </div>

                 {/* Input Area */}
                 <div className="p-5 bg-white border-t border-gray-100 backdrop-blur-md">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full p-1.5 pl-4 focus-within:border-[#146ef5]/50 focus-within:bg-white transition-all shadow-sm">
                       <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"><Paperclip className="w-5 h-5" /></button>
                       <input 
                          type="text" 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..." 
                          className="flex-1 bg-transparent py-2 text-gray-900 focus:outline-none placeholder-gray-400 text-[15px]" 
                       />
                       <button className="w-10 h-10 rounded-full bg-[#146ef5] text-white flex items-center justify-center hover:bg-[#105bd1] transition-all shadow-sm">
                          <Send className="w-4 h-4 ml-0.5" />
                       </button>
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-[#146ef5] mb-6 shadow-sm border border-blue-100">
                     <MessageCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h2>
                  <p className="text-gray-500 text-sm max-w-[240px]">Select a conversation from the sidebar or start a new chat with your tutor.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
