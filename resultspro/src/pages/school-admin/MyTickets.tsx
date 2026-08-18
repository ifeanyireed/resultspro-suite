import React, { useState, useEffect, useRef } from 'react';
import SchoolAdminLayout from '@/components/SchoolAdminLayout';
import TicketSubmissionModal from '@/components/TicketSubmissionModal';
import { IconMessageCircle as MessageCircle, IconClock as Clock, IconCheckCircle as CheckCircle, IconAlertCircle as AlertCircle, IconXCircle as XCircle, IconEye as Eye, IconSend as Send, IconUpload as Upload, IconFileText as FileText, IconX as X, IconStar as Star, IconPlus as Plus } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  messages: Message[];
  createdAt: string;
  lastMessageAt: string;
  feedbackRating?: number;
  feedbackComment?: string;
}

interface Message {
  id: string;
  content: string;
  sender: { id: string; firstName: string; lastName: string; role: string };
  createdAt: string;
  attachmentUrl?: string;
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);

      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/support/tickets?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load your tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/support/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTicket(response.data.data);
      setDialogOpen(true);
    } catch (err) {
      toast.error('Failed to load ticket details');
    }
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !file) || !selectedTicket) return;

    try {
      setSendingMessage(true);
      const formData = new FormData();
      formData.append('content', messageInput);
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
      toast.success('Message sent');
      
      // Refresh ticket details
      fetchTicketDetails(selectedTicket.id);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedTicket || feedbackRating === 0) return;

    try {
      setSubmittingFeedback(true);
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/support/tickets/${selectedTicket.id}/feedback`, {
        rating: feedbackRating,
        comment: feedbackComment,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Thank you for your feedback!');
      
      // Refresh
      fetchTicketDetails(selectedTicket.id);
      fetchTickets();
      setFeedbackRating(0);
      setFeedbackComment('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'IN_PROGRESS': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'RESOLVED': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'CLOSED': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVED': return <CheckCircle size={14} className="mr-1" />;
      case 'IN_PROGRESS': return <Clock size={14} className="mr-1 animate-pulse" />;
      case 'OPEN': return <AlertCircle size={14} className="mr-1" />;
      default: return <Clock size={14} className="mr-1" />;
    }
  };

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
            <p className="text-sm text-gray-400">Track and manage your support requests</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 flex-1 md:flex-none"
             >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
             </select>
             
             <Button 
               onClick={() => setShowCreateModal(true)}
               className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-blue-500/20"
             >
               <Plus size={18} />
               <span className="hidden sm:inline">New Ticket</span>
             </Button>
          </div>
        </div>

        {loading && tickets.length === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading your tickets..." />
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[30px] p-20 text-center">
            <MessageCircle size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Tickets Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              You haven't submitted any support tickets yet. If you're having trouble, click "New Ticket" to create one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => fetchTicketDetails(ticket.id)}
                className="group relative rounded-[24px] border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-blue-400 font-bold">{ticket.ticketNumber}</span>
                      <Badge className={`text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </Badge>
                      <Badge className="bg-white/10 text-gray-400 text-[10px] border-none">
                        {ticket.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{ticket.description}</p>
                    
                    <div className="flex items-center gap-6 mt-4 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                       <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                       <span>Last Activity: {new Date(ticket.lastMessageAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full">
                    <Eye className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl bg-gray-950 border-white/10 text-white rounded-3xl overflow-hidden p-0">
          {selectedTicket && (
            <div className="flex flex-col h-[85vh]">
              <DialogHeader className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{selectedTicket.ticketNumber}</span>
                  <Badge className={`text-[10px] font-bold ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedTicket.title}</DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status-specific banners */}
                {selectedTicket.status === 'RESOLVED' && !selectedTicket.feedbackRating && (
                  <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-6 text-center">
                    <CheckCircle className="mx-auto text-green-400 mb-3" size={32} />
                    <h4 className="text-lg font-bold text-white mb-2">This ticket has been resolved!</h4>
                    <p className="text-sm text-gray-400 mb-6">How was your support experience? Your feedback helps us improve.</p>
                    
                    <div className="flex justify-center gap-4 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className={`transition-all transform hover:scale-110 ${feedbackRating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                        >
                          <Star size={32} fill={feedbackRating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>

                    {feedbackRating > 0 && (
                      <div className="space-y-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <Textarea
                          placeholder="Tell us more about your experience (optional)..."
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          className="bg-black/40 border-white/10 text-white rounded-xl text-sm"
                        />
                        <Button 
                          onClick={handleSubmitFeedback}
                          disabled={submittingFeedback}
                          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl"
                        >
                          {submittingFeedback ? 'Submitting...' : 'Submit Feedback & Close Ticket'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {selectedTicket.status === 'CLOSED' && selectedTicket.feedbackRating && (
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Your Rating</p>
                        <div className="flex gap-1 text-yellow-400">
                           {Array.from({length: selectedTicket.feedbackRating}).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </div>
                      {selectedTicket.feedbackComment && (
                        <div className="text-right italic text-xs text-gray-400 max-w-[250px]">
                           "{selectedTicket.feedbackComment}"
                        </div>
                      )}
                   </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold">Original Request</h4>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-300 text-sm leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    Conversation ({selectedTicket.messages?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {selectedTicket.messages?.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-2xl border ${
                        msg.sender.role === 'SUPER_ADMIN' || msg.sender.role === 'SUPPORT_AGENT'
                          ? 'bg-blue-600/10 border-blue-500/20 mr-12'
                          : 'bg-white/5 border-white/10 ml-12'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-white">
                            {msg.sender.role === 'SUPER_ADMIN' || msg.sender.role === 'SUPPORT_AGENT' ? 'ResultsPRO Support' : 'You'}
                          </span>
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
                            <FileText size={12} />
                            View Attachment
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interaction Footer - Only if not closed */}
              {selectedTicket.status !== 'CLOSED' && selectedTicket.status !== 'RESOLVED' && (
                <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${file ? 'text-green-400' : 'text-gray-500 hover:text-white'}`}
                        >
                          <Upload className="w-3 h-3" />
                          {file ? file.name : 'Attach File'}
                        </button>
                        {file && <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-300"><X size={12} /></button>}
                        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="Type your reply here..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="bg-black/40 border-white/10 text-white rounded-xl focus:border-blue-500/50 min-h-[80px]"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || (!messageInput.trim() && !file)}
                      className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all disabled:opacity-50"
                    >
                      {sendingMessage ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TicketSubmissionModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          fetchTickets();
          setShowCreateModal(false);
        }}
      />
    </SchoolAdminLayout>
  );
};

export default MyTickets;
