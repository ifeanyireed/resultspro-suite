"use client";
import React, { useEffect, useState } from 'react';
import { PlusIcon, ChatBubbleLeftIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS = [
  { name: 'To Do', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  { name: 'In Progress', color: 'bg-blue-50 text-[#146ef5]', dot: 'bg-[#146ef5]' },
  { name: 'In Review', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  { name: 'Done', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
];

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const [verifying, setVerifying] = useState(false);
  const token = useAuthStore((state: any) => state.token);

  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTags, setNewTaskTags] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (reference && token) {
      setVerifying(true);
      const tenantSlug = params?.tenant as string;
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || "http://localhost:5001";
      
      fetch(`${USERS_API}/api/v1/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Domain': tenantSlug || window.location.hostname,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reference })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Payment verified successfully!');
        } else {
          alert('Payment verification failed or pending.');
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setVerifying(false);
        window.history.replaceState(null, '', window.location.pathname);
      });
    }
  }, [searchParams, token]);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await api.get('/api/workspace/tasks');
      setTasks(res.data.tasks || []);
    } catch (e) {
      console.error("Failed to load tasks", e);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: any) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setSavingTask(true);
    try {
      const tagsArray = newTaskTags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.post('/api/workspace/tasks', {
        title: newTaskTitle,
        tags: JSON.stringify(tagsArray),
        status: 'To Do'
      });
      setTasks([res.data.task, ...tasks]);
      setIsModalOpen(false);
      setNewTaskTitle('');
      setNewTaskTags('');
    } catch (e) {
      alert("Failed to create task");
    } finally {
      setSavingTask(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const draggedTask = tasks.find(t => t.id === draggableId);
    if (!draggedTask) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await api.put(`/api/workspace/tasks/${draggableId}/status`, { status: newStatus });
    } catch (e) {
      // Revert if failed
      alert("Failed to update task status");
      fetchTasks();
    }
  };

  const parseTags = (tagsStr: string) => {
    if (!tagsStr) return [];
    try {
      return JSON.parse(tagsStr);
    } catch(e) {
      return [];
    }
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your sprint tasks and project deliverables.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          New Task
        </button>
      </div>

      {loadingTasks ? (
        <div className="py-20 text-center text-gray-400">Loading workspace...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {COLUMNS.map(col => {
              const columnTasks = tasks.filter(t => (t.status || 'To Do') === col.name);
              
              return (
                <div key={col.name} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></div>
                      <h3 className="font-medium text-gray-900">{col.name}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${col.color}`}>{columnTasks.length}</span>
                  </div>
                  
                  <Droppable droppableId={col.name}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px] flex flex-col gap-4"
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-[1.25rem] p-5 shadow-sm border border-gray-100 transition-transform group ${
                                  snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : 'hover:-translate-y-1'
                                }`}
                              >
                                <h4 className="text-sm font-medium text-gray-900 mb-3">{task.title}</h4>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {parseTags(task.tags).map((tag: string) => (
                                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-400">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1"><ChatBubbleLeftIcon className="w-3.5 h-3.5"/> <span className="text-xs">{task.comments || 0}</span></div>
                                    <div className="flex items-center gap-1"><PaperClipIcon className="w-3.5 h-3.5"/> <span className="text-xs">{task.attachments || 0}</span></div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] uppercase font-bold text-gray-500">
                                    {task.title.substring(0,2)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#146ef5]"
                  placeholder="e.g., Draft API Schema"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={newTaskTags}
                  onChange={e => setNewTaskTags(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#146ef5]"
                  placeholder="e.g., Backend, API, Urgent (comma separated)"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTask}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#146ef5] hover:bg-[#105bd1] rounded-xl disabled:opacity-50"
                >
                  {savingTask ? 'Saving...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
