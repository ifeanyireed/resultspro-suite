'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { IconKanban as Kanban, IconPlus as Plus, IconMessage as MessageSquare, IconPaperclip as Paperclip, IconCircleCheck as CheckCircle2, IconStar as Star } from '@tabler/icons-react';

export default function WorkspacePage() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Implement GORM MySQL Pool', stage: 'DOING', tags: ['Backend', 'Go'], comments: 4, attachments: 2 },
    { id: '2', title: 'Design Token Introspection Middleware', stage: 'REVIEW', tags: ['Security', 'Zero-PII'], comments: 7, attachments: 1 },
    { id: '3', title: 'Scratch Card Cryptographic Generator', stage: 'APPROVED', tags: ['ResultPRO', 'Go'], comments: 12, attachments: 3 },
    { id: '4', title: 'Multiplayer CBT WebSockets Arena', stage: 'BACKLOG', tags: ['Realtime', 'Melody'], comments: 2, attachments: 0 },
    { id: '5', title: 'Spaced Repetition Flashcard Engine', stage: 'PORTFOLIO', tags: ['LMS', 'Next.js'], comments: 8, attachments: 4 },
  ]);

  const columns = [
    { id: 'BACKLOG', label: 'Sprint Backlog', color: 'bg-slate-400' },
    { id: 'DOING', label: 'In Progress', color: 'bg-signal' },
    { id: 'REVIEW', label: 'Peer & Mentor Review', color: 'bg-amber' },
    { id: 'APPROVED', label: 'Mentor Approved', color: 'bg-growth' },
    { id: 'PORTFOLIO', label: 'Portfolio Ready', color: 'bg-purple-600' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Sprint Workspace"
        subtitle="Kanban Task Board • Drag & drop progress synchronization"
      />

      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Kanban className="w-5 h-5 text-signal" />
            <h3 className="font-grotesk font-bold text-base text-ink">Active Sprint Tasks</h3>
          </div>
          <button className="bg-signal text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-signal-light transition-colors flex items-center space-x-1 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 items-start">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.stage === col.id);
            return (
              <div key={col.id} className="bg-surface2/60 rounded-2xl p-4 border border-line flex flex-col space-y-3 min-h-[500px]">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                    <h4 className="font-bold text-xs text-ink">{col.label}</h4>
                  </div>
                  <span className="mono text-[10px] font-bold text-ink-faint px-1.5 py-0.5 rounded bg-surface border border-line">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-surface rounded-xl p-4 border border-line shadow-sm hover:border-signal/30 transition-all space-y-3 cursor-grab"
                    >
                      <h5 className="font-bold text-xs text-ink">{task.title}</h5>

                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-surface2 text-ink-soft border border-line"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-line/60 text-[10px] text-ink-faint">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center space-x-0.5">
                            <MessageSquare className="w-3 h-3" />
                            <span>{task.comments}</span>
                          </span>
                          <span className="flex items-center space-x-0.5">
                            <Paperclip className="w-3 h-3" />
                            <span>{task.attachments}</span>
                          </span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-signal text-white flex items-center justify-center font-bold text-[9px]">
                          AR
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
