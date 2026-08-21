"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconBell as Bell, IconBook as BookOpen, IconBrain as BrainCircuit, IconTrophy as Trophy, IconMessage as MessageSquare, IconCheck as Check, IconMoreVertical as MoreVertical, IconClock as Clock } from '@tabler/icons-react';
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
    color: "text-green",
    bg: "bg-green/10"
  },
  {
    id: 2,
    type: "quiz",
    title: "Quiz Result Available",
    message: "You scored 85% in the 'Cell Structure' quiz. Check your rank!",
    time: "5 hours ago",
    read: true,
    icon: <Trophy className="w-4 h-4" />,
    color: "text-amber",
    bg: "bg-amber/10"
  },
  {
    id: 3,
    type: "message",
    title: "School Announcement",
    message: "The 1st term mid-term break starts on Monday, 25th Oct.",
    time: "1 day ago",
    read: true,
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-blue",
    bg: "bg-blue/10"
  },
  {
    id: 4,
    type: "reminder",
    title: "Pending Practice",
    message: "Don't forget to complete your 'Quadratic Equations' flashcard set.",
    time: "2 days ago",
    read: true,
    icon: <Clock className="w-4 h-4" />,
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  }
];

export default function NotificationsPage() {
  return (
    <div className="flex-1">
      <DashboardHeader title="Notifications" />
      
      <main className="p-8 max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Inbox</h2>
            <p className="text-sm text-muted-foreground">Stay updated with your academic activities.</p>
          </div>
          <Button variant="outline" className="text-xs font-bold border-white/10 hover:bg-white/5 text-white">
            Mark all as read
          </Button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
          <div className="divide-y divide-white/10">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-6 flex items-start justify-between hover:bg-white/[0.02] transition-colors group relative",
                  !notif.read && "bg-white/[0.01]"
                )}
              >
                {!notif.read && (
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-green shadow-[4px_0_15px_rgba(0,200,83,0.3)]" />
                )}
                
                <div className="flex gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", notif.bg, notif.color)}>
                    {notif.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className={cn("text-sm font-bold", notif.read ? "text-white/70" : "text-white")}>
                          {notif.title}
                       </h3>
                       {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-green" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                       {notif.message}
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                       <Clock className="w-3 h-3" /> {notif.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <Check className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8">
           <Button variant="ghost" className="text-xs font-bold text-muted-foreground hover:text-white">
              View Older Notifications
           </Button>
        </div>
      </main>
    </div>
  );
}
