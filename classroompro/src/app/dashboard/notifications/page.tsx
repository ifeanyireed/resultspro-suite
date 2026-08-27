"use client";

import { IconBell as Bell, IconBook as BookOpen, IconBrain as BrainCircuit, IconTrophy as Trophy, IconMessage as MessageSquare, IconCheck as Check, IconDotsVertical as MoreVertical, IconClock as Clock } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "note",
    title: "New Study Material",
    message: "Mr. Adeniyi uploaded new notes for 'Photosynthesis' in Biology.",
    time: "2 hours ago",
    read: false,
    icon: <BookOpen className="w-4 h-4" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    id: 2,
    type: "quiz",
    title: "Quiz Result Available",
    message: "You scored 85% in the 'Cell Structure' quiz. Check your rank!",
    time: "5 hours ago",
    read: true,
    icon: <Trophy className="w-4 h-4" />,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    id: 3,
    type: "message",
    title: "School Announcement",
    message: "The 1st term mid-term break starts on Monday, 25th Oct.",
    time: "1 day ago",
    read: true,
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-[#146ef5]",
    bg: "bg-blue-50"
  },
  {
    id: 4,
    type: "reminder",
    title: "Pending Practice",
    message: "Don't forget to complete your 'Quadratic Equations' flashcard set.",
    time: "2 days ago",
    read: true,
    icon: <Clock className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-50"
  }
];

export default function NotificationsPage() {
  return (
    <div className="flex-1">
      
      
      <main className="p-8 max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">Inbox</h2>
            <p className="text-sm text-gray-500">Stay updated with your academic activities.</p>
          </div>
          <Button variant="outline" className="text-xs font-bold border-gray-100 hover:bg-gray-50 text-gray-900">
            Mark all as read
          </Button>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-6 flex items-start justify-between hover:bg-white/[0.02] transition-colors group relative",
                  !notif.read && "bg-white/[0.01]"
                )}
              >
                {!notif.read && (
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 shadow-[4px_0_15px_rgba(0,200,83,0.3)]" />
                )}
                
                <div className="flex gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", notif.bg, notif.color)}>
                    {notif.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className={cn("text-sm font-bold", notif.read ? "text-gray-900/70" : "text-gray-900")}>
                          {notif.title}
                       </h3>
                       {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">
                       {notif.message}
                    </p>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                       <Clock className="w-3 h-3" /> {notif.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100">
                      <Check className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8">
           <Button variant="ghost" className="text-xs font-bold text-gray-500 hover:text-gray-900">
              View Older Notifications
           </Button>
        </div>
      </main>
    </div>
  );
}
