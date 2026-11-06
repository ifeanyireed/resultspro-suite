"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  ChatBubbleLeftIcon, 
  PaperClipIcon, 
  XMarkIcon,
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  TagIcon,
  FolderOpenIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  Bars3BottomLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  FireIcon as FireSolid
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/useAuthStore';
import { coursesApi } from '@/lib/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';

const COLUMNS = [
  { name: 'To Do', color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600' },
  { name: 'In Progress', color: 'bg-blue-50 text-[#146ef5] border-blue-200', dot: 'bg-[#146ef5]', badge: 'bg-blue-50 text-[#146ef5]' },
  { name: 'In Review', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
  { name: 'Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
];

const SUGGESTED_TAGS = ['Frontend', 'Backend', 'API', 'UI/UX', 'Database', 'Bug', 'Testing', 'Deliverable'];

export default function WorkspacePage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTags, setTaskTags] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [savingTask, setSavingTask] = useState(false);
  const [taskFormError, setTaskFormError] = useState('');

  // Task Details Drawer State
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<any | null>(null);

  // Deleting State
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Fetch summary for sprint context
  const { data: dashboardData } = useQuery({
    queryKey: ['student-dashboard-summary', user?.id],
    queryFn: async () => {
      const res = await coursesApi.get('/api/student/dashboard/summary');
      return res.data;
    },
    enabled: !!user
  });

  // Fetch workspace tasks via coursesApi
  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await coursesApi.get('/api/workspace/tasks');
      setTasks(res.data.tasks || []);
    } catch (e) {
      console.error("Failed to load workspace tasks:", e);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Tag parser
  const parseTags = (tagsStr: string): string[] => {
    if (!tagsStr) return [];
    try {
      const parsed = JSON.parse(tagsStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      if (typeof tagsStr === 'string' && tagsStr.includes(',')) {
        return tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      }
      return tagsStr ? [tagsStr] : [];
    }
  };

  // Collect all unique tags across tasks
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      parseTags(t.tags).forEach(tag => set.add(tag));
    });
    return Array.from(set);
  }, [tasks]);

  // Filter tasks based on search & tag
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = !searchQuery.trim() || 
        t.title?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      
      const tags = parseTags(t.tags);
      const matchesTag = !selectedTag || 
        tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [tasks, searchQuery, selectedTag]);

  // Metrics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => (t.status || 'To Do') === 'To Do').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const inReviewTasks = tasks.filter(t => t.status === 'In Review').length;
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Open Create Modal
  const openCreateModal = (defaultStatus = 'To Do') => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskTags('');
    setTaskStatus(defaultStatus);
    setTaskFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (task: any) => {
    setEditingTask(task);
    setTaskTitle(task.title || '');
    const tags = parseTags(task.tags);
    setTaskTags(tags.join(', '));
    setTaskStatus(task.status || 'To Do');
    setTaskFormError('');
    setIsModalOpen(true);
  };

  // Save Task (Create or Edit)
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setTaskFormError('Task title is required.');
      return;
    }

    setSavingTask(true);
    setTaskFormError('');

    try {
      const tagsArray = taskTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      if (editingTask) {
        // Update existing task
        const res = await coursesApi.put(`/api/workspace/tasks/${editingTask.id}`, {
          title: taskTitle.trim(),
          tags: JSON.stringify(tagsArray),
          status: taskStatus
        });

        setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...res.data.task } : t));
        if (selectedTaskDetails?.id === editingTask.id) {
          setSelectedTaskDetails(res.data.task);
        }
      } else {
        // Create new task
        const res = await coursesApi.post('/api/workspace/tasks', {
          title: taskTitle.trim(),
          tags: JSON.stringify(tagsArray),
          status: taskStatus
        });

        setTasks(prev => [res.data.task, ...prev]);
      }

      setIsModalOpen(false);
      setTaskTitle('');
      setTaskTags('');
      setEditingTask(null);
    } catch (err: any) {
      setTaskFormError(err?.response?.data?.error || err.message || 'Failed to save task.');
    } finally {
      setSavingTask(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setDeletingTaskId(taskId);
    try {
      await coursesApi.delete(`/api/workspace/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (selectedTaskDetails?.id === taskId) {
        setSelectedTaskDetails(null);
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert('Failed to delete task. Please try again.');
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Quick Move Task to Column
  const handleQuickMove = async (task: any, newStatus: string) => {
    if (task.status === newStatus) return;

    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    if (selectedTaskDetails?.id === task.id) {
      setSelectedTaskDetails((prev: any) => ({ ...prev, status: newStatus }));
    }

    try {
      await coursesApi.put(`/api/workspace/tasks/${task.id}/status`, { status: newStatus });
    } catch (e) {
      console.error("Failed to update task status:", e);
      alert("Failed to update task status");
      fetchTasks();
    }
  };

  // Drag and drop handler
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const draggedTask = tasks.find(t => t.id === draggableId);
    if (!draggedTask) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));
    if (selectedTaskDetails?.id === draggableId) {
      setSelectedTaskDetails((prev: any) => ({ ...prev, status: newStatus }));
    }

    try {
      await coursesApi.put(`/api/workspace/tasks/${draggableId}/status`, { status: newStatus });
    } catch (e) {
      console.error("Failed to update status on drag:", e);
      alert("Failed to update task status");
      fetchTasks();
    }
  };

  return (
    <>
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 mt-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace Kanban</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal sprint tasks, project deliverables, and milestone checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => fetchTasks()}
            className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full shadow-sm transition-colors"
            title="Refresh Tasks"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>

          <button 
            onClick={() => openCreateModal('To Do')}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Velocity & Status Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Tasks */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center">
              <FolderOpenIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900 font-sans">{totalTasks}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Sprint board items</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#146ef5]">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <ClockIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#146ef5] font-sans">{inProgressTasks}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Actively working on</p>
          </div>
        </div>

        {/* In Review */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">In Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <SparklesIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600 font-sans">{inReviewTasks}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Awaiting verification</p>
          </div>
        </div>

        {/* Done / Progress % */}
        <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Completion</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircleSolid className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-600 font-sans">{completionRate}%</span>
              <span className="text-xs font-medium text-gray-400">{doneTasks}/{totalTasks} done</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent"
          />
        </div>

        {/* Tags Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
              Clear tag
            </button>
          )}

          {allUniqueTags.slice(0, 5).map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Kanban Board */}
      {loadingTasks ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {COLUMNS.map(col => {
              const columnTasks = filteredTasks.filter(t => (t.status || 'To Do') === col.name);

              return (
                <div key={col.name} className="flex flex-col gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-200/60 shadow-sm">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 px-1 border-b border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <h3 className="font-bold text-gray-900 text-sm">{col.name}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${col.badge}`}>
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={col.name}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[300px] flex flex-col gap-3 p-1 rounded-xl transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50/40 ring-2 ring-blue-300 ring-dashed' : ''
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTaskDetails(task)}
                                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200/80 transition-all group relative cursor-pointer ${
                                  snapshot.isDragging ? 'shadow-xl rotate-1 scale-105 border-blue-400 z-50' : 'hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200'
                                }`}
                              >
                                {/* Task Title */}
                                <h4 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">
                                  {task.title}
                                </h4>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {parseTags(task.tags).map((tag: string) => (
                                    <span 
                                      key={tag} 
                                      className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/50"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>

                                {/* Card Footer & Quick Status Shifts */}
                                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-gray-400">
                                  <div className="flex items-center gap-3">
                                    {task.comments > 0 && (
                                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                        <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                                        <span>{task.comments}</span>
                                      </div>
                                    )}

                                    {task.attachments > 0 && (
                                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                        <PaperClipIcon className="w-3.5 h-3.5" />
                                        <span>{task.attachments}</span>
                                      </div>
                                    )}

                                    {task.created_at && (
                                      <span className="text-[10px] text-gray-400">
                                        {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      </span>
                                    )}
                                  </div>

                                  {/* Quick Action Icons */}
                                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                    <button
                                      onClick={() => openEditModal(task)}
                                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                      title="Edit Task"
                                    >
                                      <PencilSquareIcon className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      disabled={deletingTaskId === task.id}
                                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                      title="Delete Task"
                                    >
                                      <TrashIcon className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="h-28 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
                            No tasks in {col.name}
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>

                  {/* Add Task Button for this column */}
                  <button
                    onClick={() => openCreateModal(col.name)}
                    className="w-full py-2 bg-white hover:bg-gray-100/80 text-gray-600 rounded-xl text-xs font-semibold border border-gray-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-1"
                  >
                    <PlusIcon className="w-3.5 h-3.5 text-gray-500" />
                    Add Task
                  </button>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* 1. Create / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingTask ? 'Edit Task' : 'Create New Sprint Task'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Organize your sprint deliverables and track progress.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent"
                  placeholder="e.g., Implement JWT Auth Middleware"
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Board Stage
                </label>
                <select
                  value={taskStatus}
                  onChange={e => setTaskStatus(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent bg-white"
                >
                  {COLUMNS.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={taskTags}
                  onChange={e => setTaskTags(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:border-transparent"
                  placeholder="e.g., Backend, API, Urgent"
                />

                {/* Suggested Tag Chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {SUGGESTED_TAGS.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        const current = taskTags.split(',').map(t => t.trim()).filter(Boolean);
                        if (!current.includes(st)) {
                          setTaskTags(current.length > 0 ? `${current.join(', ')}, ${st}` : st);
                        }
                      }}
                      className="text-[10px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-md transition-colors"
                    >
                      +{st}
                    </button>
                  ))}
                </div>
              </div>

              {taskFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {taskFormError}
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTask}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] rounded-xl shadow-sm transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  {savingTask ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingTask ? 'Save Changes' : 'Create Task'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Task Details Drawer / Modal */}
      {selectedTaskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedTaskDetails.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedTaskDetails.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  selectedTaskDetails.status === 'In Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {selectedTaskDetails.status || 'To Do'}
                </span>
                <span className="text-xs text-gray-400">
                  Created {new Date(selectedTaskDetails.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <button 
                onClick={() => setSelectedTaskDetails(null)} 
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 leading-snug">
                {selectedTaskDetails.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {parseTags(selectedTaskDetails.tags).map((tag: string) => (
                  <span 
                    key={tag} 
                    className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Move to another column */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Move Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COLUMNS.map(col => (
                    <button
                      key={col.name}
                      onClick={() => handleQuickMove(selectedTaskDetails, col.name)}
                      className={`text-xs font-semibold py-2 px-2.5 rounded-xl border text-center transition-all ${
                        selectedTaskDetails.status === col.name
                          ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sprint Tips */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <p className="font-semibold mb-0.5">Sprint Tip</p>
                Break down your capstone deliverables into bite-sized actionable sprint tasks to maintain your learning consistency streak.
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleDeleteTask(selectedTaskDetails.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete Task
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const task = selectedTaskDetails;
                    setSelectedTaskDetails(null);
                    openEditModal(task);
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                >
                  Edit Task
                </button>

                <button
                  onClick={() => setSelectedTaskDetails(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
