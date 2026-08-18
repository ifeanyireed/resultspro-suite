"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  Search, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  Phone,
  Video,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const contactsData = [
  { id: 1, name: "Mr. Kunle Alabi", role: "Parent (Jessica Alabi)", lastMessage: "Thank you for the update on Jessica's progress.", time: "10:24 AM", unread: 2, online: true },
  { id: 2, name: "Mrs. Sarah John", role: "Parent (Daniel John)", lastMessage: "Is there any extra material for Algebra?", time: "09:15 AM", unread: 0, online: false },
  { id: 3, name: "Jessica Alabi", role: "Student (SS3 Biology)", lastMessage: "I finished the assignment, sir.", time: "Yesterday", unread: 0, online: true },
  { id: 4, name: "School Admin", role: "Staff", lastMessage: "Meeting at 2pm today in the staff room.", time: "Yesterday", unread: 0, online: false },
];

export default function TeacherMessagesPage() {
  const [activeContact, setActiveContact] = useState(contactsData[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen overflow-hidden animate-in fade-in duration-500">
        <DashboardHeader title="Messages" />
        <main className="flex-1 flex overflow-hidden">
          <div className="w-full md:w-80 border-r border-white/10 bg-navy/30 p-6 space-y-6">
            <Skeleton className="h-10 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
          </div>
          <div className="flex-1 bg-navy/50 flex flex-col">
            <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
            <div className="flex-1 p-8 space-y-6">
              <Skeleton className="h-24 w-2/3 rounded-2xl" />
              <Skeleton className="h-20 w-1/2 ml-auto rounded-2xl" />
              <Skeleton className="h-24 w-2/3 rounded-2xl" />
            </div>
            <div className="p-6 border-t border-white/10">
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <DashboardHeader title="Messages" />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r border-white/10 bg-navy/30 flex flex-col">
          <div className="p-6 space-y-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9 bg-white/5 border-white/10 h-10 text-sm" />
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-full bg-green text-navy font-bold text-[10px] uppercase tracking-widest">All</button>
                <button className="px-4 py-1.5 rounded-full bg-white/5 text-muted-foreground font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Parents</button>
                <button className="px-4 py-1.5 rounded-full bg-white/5 text-muted-foreground font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Students</button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
             {contactsData.map((contact) => (
                <button 
                   key={contact.id}
                   onClick={() => setActiveContact(contact)}
                   className={cn(
                      "w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-all text-left relative group",
                      activeContact.id === contact.id ? "bg-white/5" : ""
                   )}
                >
                   {activeContact.id === contact.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green shadow-[4px_0_15px_rgba(0,200,83,0.3)]" />
                   )}
                   <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-navy border border-white/10 flex items-center justify-center font-bold text-white shadow-lg">
                         {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {contact.online && (
                         <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green rounded-full border-2 border-navy" />
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                         <h4 className="text-sm font-bold text-white truncate">{contact.name}</h4>
                         <span className="text-[10px] text-muted-foreground whitespace-nowrap">{contact.time}</span>
                      </div>
                      <p className="text-[10px] text-green font-bold uppercase tracking-wider mb-1">{contact.role}</p>
                      <p className={cn("text-xs truncate", contact.unread > 0 ? "text-white font-medium" : "text-muted-foreground")}>
                         {contact.lastMessage}
                      </p>
                   </div>
                   {contact.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-green text-navy text-[10px] font-black flex items-center justify-center shadow-lg shadow-green/20">
                         {contact.unread}
                      </div>
                   )}
                </button>
             ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-navy/50 relative">
           {/* Chat Header */}
           <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                    {activeContact.name.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div>
                    <h3 className="text-white font-bold">{activeContact.name}</h3>
                    <p className="text-[10px] text-green font-bold uppercase tracking-widest flex items-center gap-1.5">
                       <span className={cn("w-1.5 h-1.5 rounded-full", activeContact.online ? "bg-green" : "bg-white/20")} />
                       {activeContact.online ? 'Online' : 'Offline'}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                 </button>
                 <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all">
                    <Video className="w-4 h-4" />
                 </button>
                 <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all">
                    <MoreVertical className="w-4 h-4" />
                 </button>
              </div>
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              <div className="flex justify-center">
                 <span className="px-4 py-1 rounded-full bg-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-white/10">Today</span>
              </div>

              {/* Message Received */}
              <div className="flex items-start gap-4 max-w-2xl text-sm">
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {activeContact.name.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div className="space-y-2">
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-white/90 leading-relaxed">
                       Hello sir, I was reviewing Jessica's latest quiz result. 
                       She mentioned some difficulty with the theory section on Photosynthesis.
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">10:20 AM</span>
                 </div>
              </div>

              {/* Message Sent */}
              <div className="flex items-start gap-4 max-w-2xl ml-auto flex-row-reverse text-sm">
                 <div className="w-8 h-8 rounded-lg bg-green text-navy flex items-center justify-center text-[10px] font-black shrink-0">
                    JD
                 </div>
                 <div className="space-y-2 text-right">
                    <div className="p-4 rounded-2xl rounded-tr-none bg-green text-navy font-medium leading-relaxed shadow-xl shadow-green/10">
                       Hello Mr. Kunle, yes I noticed that too. I've uploaded a revision note 
                       specifically focusing on the theory questions. She should check it out.
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground font-medium">
                       10:22 AM <CheckCircle2 className="w-3 h-3 text-green" />
                    </div>
                 </div>
              </div>

              {/* Message Received */}
              <div className="flex items-start gap-4 max-w-2xl text-sm">
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {activeContact.name.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div className="space-y-2">
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-white/90 leading-relaxed">
                       Thank you for the update on Jessica's progress. We will check it tonight.
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">10:24 AM</span>
                 </div>
              </div>
           </div>

           {/* Input Area */}
           <div className="p-6 bg-navy/80 backdrop-blur-xl border-t border-white/10">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 shadow-2xl focus-within:border-green/50 transition-all">
                 <button className="p-2 text-muted-foreground hover:text-white transition-all">
                    <MessageSquare className="w-5 h-5" />
                 </button>
                 <input 
                    placeholder="Write a message..." 
                    className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm py-3"
                 />
                 <Button className="bg-green hover:bg-green/90 text-navy font-black rounded-xl h-10 px-6 shadow-lg shadow-green/20">
                    Send <Send className="w-3.5 h-3.5 ml-2" />
                 </Button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
