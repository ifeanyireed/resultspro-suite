import React, { useState, useEffect, useRef } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import {
  Search,
  Filter,
  MoreVertical,
  Edit02,
  Trash01,
  Shield,
  Eye,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loading01,
  ChevronDown,
  Upload,
  FileText,
  UserCheck,
} from '@/lib/hugeicons-compat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:5000/api';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdBy: string;
  createdByUser: { name?: string; firstName: string; lastName: string; email: string };
  assignedToAgent?: string;
  assignedAgent?: { firstName: string; lastName: string; email: string };
  school: { name: string };
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  sender: { id: string; firstName: string; lastName: string; role: string };
  createdAt: string;
  isInternal: boolean;
  attachmentUrl?: string;
}

interface SupportAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Stats {
  open: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  averageResolutionTimeHours: number;
}

type StatusType = 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

const SuperAdminSupportDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [stats, setStats] = useState<Stats>({
    open: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    averageResolutionTimeHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [assignmentStatus, setAssignmentStatus] = useState<string>('');
  const [assigningTicket, setAssigningTicket] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTickets();
    fetchStats();
    fetchAgents();
    const interval = setInterval(() => {
      fetchTickets();
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [filterStatus, filterPriority, filterCategory]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (filterPriority !== 'ALL') params.append('priority', filterPriority);
      if (filterCategory !== 'ALL') params.append('category', filterCategory);

      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/support/tickets?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/support/tickets/stats/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/support/agents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgents(response.data.data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !file) || !selectedTicket) return;

    try {
      setSendingMessage(true);
      const formData = new FormData();
      formData.append('content', messageInput);
      formData.append('isInternal', String(isInternal));
      if (file) formData.append('file', file);

      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/support/tickets/${selectedTicket.id}/messages`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessageInput('');
      setFile(null);
      setIsInternal(false);
      toast.success('Message sent');
      
      // Refresh ticket details
      const response = await axios.get(`${API_BASE}/support/tickets/${selectedTicket.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTicket(response.data.data);
      fetchTickets();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async (newStatus: StatusType) => {
    if (!selectedTicket) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE}/support/tickets/${selectedTicket.id}`, {
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Ticket marked as ${newStatus.toLowerCase()}`);
      
      // Refresh ticket details
      const response = await axios.get(`${API_BASE}/support/tickets/${selectedTicket.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTicket(response.data.data);
      fetchTickets();
      fetchStats();
    } catch (error) {
      console.error('Failed to update ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !assignmentStatus) return;

    try {
      setAssigningTicket(true);
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE}/support/tickets/${selectedTicket.id}`, {
        assignedToAgent: assignmentStatus === 'unassign' ? null : assignmentStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Ticket assignment updated');
      
      const response = await axios.get(`${API_BASE}/support/tickets/${selectedTicket.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTicket(response.data.data);
      setAssignmentStatus('');
      fetchTickets();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      toast.error('Failed to assign ticket');
    } finally {
      setAssigningTicket(false);
    }
  };

  const handleClaimTicket = async () => {
    if (!selectedTicket) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/support/tickets/${selectedTicket.id}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Ticket claimed successfully');
      
      const response = await axios.get(`${API_BASE}/support/tickets/${selectedTicket.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTicket(response.data.data);
      fetchTickets();
    } catch (error) {
      console.error('Failed to claim ticket:', error);
      toast.error('Failed to claim ticket');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'LOW':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-500/20 text-blue-300';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-purple-500/20 text-purple-300';
      case 'RESOLVED':
        return 'bg-green-500/20 text-green-300';
      case 'CLOSED':
        return 'bg-gray-500/20 text-gray-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Support Dashboard</h1>
            <p className="text-gray-400">Manage all support tickets from your schools</p>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 text-center min-w-[150px]">
            <p className="text-[10px] uppercase tracking-wider text-blue-300 font-bold mb-1">Avg Resolution</p>
            <p className="text-2xl font-bold text-white">{stats.averageResolutionTimeHours} <span className="text-sm font-normal text-blue-300">hrs</span></p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Open', value: stats.open, icon: AlertCircle, color: 'text-blue-400' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-400' },
            { label: 'In Progress', value: stats.inProgress, icon: Loading01, color: 'text-purple-400' },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Closed', value: stats.closed, icon: XCircle, color: 'text-gray-400' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="relative rounded-[24px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-5 hover:bg-white/5 transition-all duration-300"
              >
                <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{(stat.value || 0).toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="BILLING">Billing</option>
              <option value="TECHNICAL">Technical</option>
              <option value="ACCOUNT">Account</option>
              <option value="FEATURE_REQUEST">Feature Request</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="p-6 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between bg-white/5">
            <h2 className="text-xl font-bold">Active Tickets</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-white/10 text-xs text-gray-400 font-mono">
                {tickets.length} total
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Ticket ID</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Subject</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">School</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Priority</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <LoadingSpinner size="lg" text="Loading tickets..." />
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                      No tickets found matching your criteria
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('authToken');
                          const response = await axios.get(`${API_BASE}/support/tickets/${ticket.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setSelectedTicket(response.data.data);
                          setDialogOpen(true);
                        } catch (err) {
                          toast.error('Failed to load ticket details');
                        }
                      }}
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">{ticket.ticketNumber}</td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium mb-0.5">{ticket.title}</div>
                        <div className="text-gray-500 text-xs truncate max-w-[200px]">{ticket.description}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-300 text-sm">{ticket.school?.name || 'Unknown School'}</div>
                        <div className="text-gray-500 text-[10px]">{ticket.createdByUser?.firstName} {ticket.createdByUser?.lastName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl bg-gray-950 border-white/10 text-white rounded-3xl overflow-hidden p-0">
          {selectedTicket && (
            <div className="flex flex-col h-[85vh]">
              <DialogHeader className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{selectedTicket.ticketNumber}</span>
                  <div className="flex gap-2">
                    {!selectedTicket.assignedToAgent && (
                      <Button onClick={handleClaimTicket} variant="outline" size="sm" className="h-7 text-[10px] bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Claim Ticket
                      </Button>
                    )}
                    <Badge className={`text-[10px] font-bold ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedTicket.title}</DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Priority</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Category</p>
                    <p className="text-sm font-medium">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">School</p>
                    <p className="text-sm font-medium">{selectedTicket.school?.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Created By</p>
                    <p className="text-xs font-medium">{selectedTicket.createdByUser?.firstName} {selectedTicket.createdByUser?.lastName}</p>
                    <p className="text-[10px] text-gray-500">{selectedTicket.createdByUser?.email}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold">Issue Description</h4>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-300 text-sm leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    Conversation History ({selectedTicket.messages?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {selectedTicket.messages?.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-2xl border ${
                        msg.sender.role === 'SUPER_ADMIN' || msg.sender.role === 'SUPPORT_AGENT'
                          ? 'bg-blue-500/10 border-blue-500/20 ml-8'
                          : 'bg-white/5 border-white/10 mr-8'
                      } ${msg.isInternal ? 'border-dashed border-yellow-500/40 bg-yellow-500/5' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{msg.sender.firstName} {msg.sender.lastName}</span>
                            {msg.isInternal && <Badge className="bg-yellow-500/20 text-yellow-500 text-[8px] h-4">INTERNAL NOTE</Badge>}
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed mb-2">{msg.content}</p>
                        {msg.attachmentUrl && (
                          <a 
                            href={msg.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 text-[10px] transition-all"
                          >
                            <FileText className="w-3 h-3" />
                            View Attachment
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interaction Footer */}
              <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(e.target.value as StatusType)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="OPEN">Open</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Assign To</label>
                    <div className="flex gap-2">
                      <select
                        value={assignmentStatus || selectedTicket.assignedToAgent || ''}
                        onChange={(e) => setAssignmentStatus(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="">Select Agent...</option>
                        <option value="unassign">Unassign</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.firstName} {agent.lastName}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignTicket}
                        disabled={!assignmentStatus || assigningTicket}
                        className="px-3 py-2 rounded-lg bg-white/10 text-xs font-bold hover:bg-white/20 transition-all disabled:opacity-50"
                      >
                        {assigningTicket ? '...' : 'Update'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isInternal ? 'bg-yellow-500 border-yellow-500' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                          {isInternal && <CheckCircle className="w-3 h-3 text-black" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isInternal ? 'text-yellow-500' : 'text-gray-500'}`}>Internal Note</span>
                      </label>
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${file ? 'text-green-400' : 'text-gray-500 hover:text-white'}`}
                      >
                        <Upload className="w-3 h-3" />
                        {file ? file.name : 'Attach File'}
                      </button>
                      {file && <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-300"><XCircle className="w-3 h-3" /></button>}
                      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder={isInternal ? "Type a private note for staff only..." : "Type your official response here..."}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className={`bg-black/40 border-white/10 text-white rounded-xl focus:border-blue-500/50 min-h-[80px] ${isInternal ? 'focus:border-yellow-500/50' : ''}`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || (!messageInput.trim() && !file)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${isInternal ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-blue-600 hover:bg-blue-50 text-white'}`}
                  >
                    {sendingMessage ? 'Processing...' : isInternal ? 'Save Internal Note' : 'Send Official Response'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
};

export default SuperAdminSupportDashboard;
