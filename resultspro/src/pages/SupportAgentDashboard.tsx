import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  MessageSquare,
  Send,
  X,
  Upload,
  FileText,
  UserCheck,
} from 'lucide-react';
import { User, LogOut, BarChart01 } from '@/lib/hugeicons-compat';
import { useNavigate } from 'react-router-dom';
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
  createdByUser: { firstName: string; lastName: string; email: string };
  assignedToAgent?: string;
  school: { name: string };
  messages: Message[];
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  sender: { firstName: string; lastName: string; role: string };
  createdAt: string;
  isInternal: boolean;
  attachmentUrl?: string;
}

const SupportAgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, [filterStatus, filterPriority]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // Agents can see tickets assigned to them OR unassigned tickets they might want to claim
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (filterPriority !== 'ALL') params.append('priority', filterPriority);

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

  const handleStatusChange = async (newStatus: string) => {
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
    } catch (error) {
      console.error('Failed to update ticket:', error);
      toast.error('Failed to update ticket');
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


  const getTicketStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'OPEN').length,
      pending: tickets.filter((t) => t.status === 'PENDING').length,
      inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Loader2 className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'OPEN':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <X className="w-4 h-4" />;
    }
  };

  const stats = getTicketStats();

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative pb-20">
      <style>{`
        .nav-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          margin-bottom: 8px;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      {/* Background Effects - Fixed/Static */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/Hero.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Header with Logo and User Actions */}
      <div className="sticky top-0 z-20 backdrop-blur-md px-4 md:px-8" style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4 relative">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src="/logo.png" alt="Results Pro" className="h-10 w-auto" />
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Results Pro</div>
                <div className="text-sm font-semibold text-white">Support Agent</div>
              </div>
            </div>

            {/* Center Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">Support Tickets</div>
                <div className="text-xs text-gray-400 italic mt-1">Manage and resolve support requests</div>
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/support-agent/dashboard')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                title="Profile"
              >
                <User size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">My Support Tickets</h1>
        <p className="text-gray-400 mt-2">Manage and respond to your assigned tickets</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-sm text-gray-400 mt-1">Total Assigned</p>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.open}</div>
            <p className="text-sm text-gray-400 mt-1">Open</p>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
            <p className="text-sm text-gray-400 mt-1">Pending</p>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.inProgress}</div>
            <p className="text-sm text-gray-400 mt-1">In Progress</p>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
            <p className="text-sm text-gray-400 mt-1">Resolved</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Filter by Status
            </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-[rgba(0,0,0,0.40)] border-[rgba(255,255,255,0.07)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(20,20,20,0.95)] border-[rgba(255,255,255,0.07)]">
                  <SelectItem value="ALL" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">All Statuses</SelectItem>
                  <SelectItem value="OPEN" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">Open</SelectItem>
                  <SelectItem value="PENDING" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">In Progress</SelectItem>
                  <SelectItem value="RESOLVED" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">Resolved</SelectItem>
                  <SelectItem value="CLOSED" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Filter by Priority
            </label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="bg-[rgba(0,0,0,0.40)] border-[rgba(255,255,255,0.07)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(20,20,20,0.95)] border-[rgba(255,255,255,0.07)]">
                  <SelectItem value="ALL" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">All Priorities</SelectItem>
                  <SelectItem value="LOW" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">Low</SelectItem>
                  <SelectItem value="MEDIUM" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">Medium</SelectItem>
                  <SelectItem value="HIGH" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">High</SelectItem>
                  <SelectItem value="CRITICAL" className="text-white hover:bg-white/20 hover:text-black focus:bg-white/20 focus:text-black">Critical</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
        <h2 className="text-xl font-bold text-white mb-6">Assigned Tickets ({tickets.length})</h2>
        <div>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Loading tickets..." />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tickets assigned to you at the moment
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
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
                className="w-full text-left p-4 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5 transition-colors bg-[rgba(0,0,0,0.20)]"
                >
                  <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-blue-400">
                      {ticket.ticketNumber}
                    </span>
                        <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                          <span className="mr-1">{getStatusIcon(ticket.status)}</span>
                          {ticket.status}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                        {!ticket.assignedToAgent && (
                          <Badge className="bg-blue-600/20 text-blue-400 text-xs border border-blue-500/30">
                            UNASSIGNED
                          </Badge>
                        )}
                      </div>

                    <h3 className="font-semibold text-lg text-white mb-1">{ticket.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center gap-6 mt-3 text-xs text-gray-400">
                        <span>📍 {ticket.school.name}</span>
                        <span>👤 {ticket.createdByUser?.firstName} {ticket.createdByUser?.lastName}</span>
                        <span>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={async (e) => {
                      e.stopPropagation();
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
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View
                  </Button>
                </div>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-[rgba(20,20,20,0.95)] border-[rgba(255,255,255,0.07)] text-white p-0 overflow-hidden">
          {selectedTicket && (
            <div className="flex flex-col max-h-[90vh]">
            <DialogHeader className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between w-full pr-8">
                <div>
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-2xl text-white">{selectedTicket.title}</DialogTitle>
                    {!selectedTicket.assignedToAgent && (
                      <Button onClick={handleClaimTicket} variant="outline" size="sm" className="h-7 text-[10px] bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Claim Ticket
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{selectedTicket.ticketNumber}</p>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Ticket Details Card */}
              <div className="bg-[rgba(255,255,255,0.02)] p-4 rounded-lg border border-[rgba(255,255,255,0.07)]">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Priority
                  </p>
                      <Badge className={`mt-1 ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                  </p>
                  <p className="text-sm font-medium text-white mt-1">
                        {selectedTicket.category}
                      </p>
                    </div>
                  </div>

              <div className="pt-3 border-t border-[rgba(255,255,255,0.07)]">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  From
                </p>
                <p className="text-sm text-white">
                  {selectedTicket.createdByUser?.firstName} {selectedTicket.createdByUser?.lastName}{' '}
                  <span className="text-gray-400 text-xs">({selectedTicket.createdByUser?.email})</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  School: {selectedTicket.school.name}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-2">Description</h4>
              <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                {selectedTicket.description}
              </p>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <MessageCircle className="w-3 h-3" />
                Conversation History ({selectedTicket.messages.length})
              </h4>
              <div className="space-y-3">
                {selectedTicket.messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4 bg-white/5 rounded-xl border border-dashed border-white/10">No messages yet</p>
                ) : (
                  selectedTicket.messages.map((msg) => (
                    <div key={msg.id} className={`p-4 rounded-2xl border ${
                      msg.sender.role === 'SUPER_ADMIN' || msg.sender.role === 'SUPPORT_AGENT'
                        ? 'bg-blue-500/10 border-blue-500/20 ml-8'
                        : 'bg-white/5 border-white/10 mr-8'
                    } ${msg.isInternal ? 'border-dashed border-yellow-500/40 bg-yellow-500/5' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {msg.sender.firstName} {msg.sender.lastName}
                            <span className="text-[10px] text-gray-400 ml-2 font-normal">({msg.sender.role})</span>
                          </span>
                          {msg.isInternal && <Badge className="bg-yellow-500/20 text-yellow-500 text-[8px] h-4">INTERNAL NOTE</Badge>}
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {new Date(msg.createdAt).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{msg.content}</p>
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
                  ))
                )}
              </div>
            </div>
            </div>

            {/* Interaction Area */}
            <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
              {/* Status & Actions */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 block">Status</label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="bg-[rgba(0,0,0,0.40)] border-[rgba(255,255,255,0.07)] text-white h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[rgba(20,20,20,0.95)] border-[rgba(255,255,255,0.07)]">
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col justify-end h-full pt-5">
                   {/* File Attachment Hidden Input */}
                   <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                   <div className="flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${file ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                      <Upload className="w-3 h-3" />
                      {file ? 'File Added' : 'Attach'}
                    </button>
                    {file && <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-300"><XCircle size={14} /></button>}
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isInternal ? 'bg-yellow-500 border-yellow-500' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                      {isInternal && <CheckCircle className="w-3 h-3 text-black" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isInternal ? 'text-yellow-500' : 'text-gray-500'}`}>Internal Note (Staff only)</span>
                  </label>
                </div>

                <Textarea
                  placeholder={isInternal ? "Type a private note for staff only..." : "Type your response to the customer..."}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className={`resize-none h-20 border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.40)] text-white placeholder:text-gray-500 rounded-xl focus:border-blue-500/50 ${isInternal ? 'focus:border-yellow-500/50' : ''}`}
                />
                
                <Button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || (!messageInput.trim() && !file)}
                  className={`w-full font-bold transition-all ${isInternal ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {sendingMessage ? 'Processing...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {isInternal ? 'Save Internal Note' : 'Send Official Reply'}
                    </>
                  )}
                </Button>
              </div>
            </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md border-t border-white/10" style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.2) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-2 py-4 flex-wrap">
            {[
              { label: 'Dashboard', icon: BarChart01, href: '/support-agent/dashboard' },
              { label: 'Profile', icon: User, href: '/support-agent/profile' },
              { label: 'Logout', icon: LogOut, href: '#logout' },
            ].map((item) => {
              const Icon = item.icon;
              const active = window.location.pathname === item.href;
              const isLogout = item.href === '#logout';
              
              return (
                <div key={item.href} className="relative group">
                  <button
                    onClick={() => {
                      if (isLogout) {
                        localStorage.clear();
                        navigate('/auth/login');
                      } else {
                        navigate(item.href);
                      }
                    }}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                      active && !isLogout
                        ? 'text-white bg-white/15 border border-white/30 shadow-lg shadow-blue-500/20'
                        : isLogout
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                  </button>
                  {hoveredItem === item.href && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none border border-white/10">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAgentDashboard;
