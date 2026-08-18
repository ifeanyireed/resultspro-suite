import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  MessageCircle, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { axiosInstance as axios } from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  otherUser: {
    id: string;
    fullName: string;
    email: string;
  };
  student: {
    id: string;
    name: string;
    admissionNumber: string;
  };
  lastMessage: {
    body: string;
    createdAt: string;
    senderRole: 'TEACHER' | 'PARENT';
  };
  unreadCount: number;
}

interface Message {
  id: string;
  senderUserId: string;
  senderRole: 'TEACHER' | 'PARENT';
  body: string;
  createdAt: string;
  isRead: boolean;
}

const ParentMessages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || user.userId;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv);
    }
  }, [selectedConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/messages/conversations');
      setConversations(response.data.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conv: Conversation) => {
    try {
      setLoadingMessages(true);
      const response = await axios.get(`/messages/thread/${conv.otherUser.id}/${conv.student.id}`);
      setMessages(response.data.data || []);
      
      if (conv.unreadCount > 0) {
        fetchConversations();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive'
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || sending) return;

    try {
      setSending(true);
      const response = await axios.post('/messages/send', {
        recipientId: selectedConv.otherUser.id,
        studentId: selectedConv.student.id,
        body: newMessage,
        subject: `Message about ${selectedConv.student.name}`
      });

      if (response.data.success) {
        const newMsg: Message = {
          id: response.data.data.id,
          senderUserId: userId,
          senderRole: 'PARENT',
          body: newMessage,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
        
        setConversations(prev => prev.map(c => 
          (c.otherUser.id === selectedConv.otherUser.id && c.student.id === selectedConv.student.id)
            ? { ...c, lastMessage: { body: newMessage, createdAt: new Date().toISOString(), senderRole: 'PARENT' } }
            : c
        ));
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.otherUser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl">
      {/* Conversations List */}
      <div className={`w-full lg:w-1/3 border-r border-white/10 flex flex-col ${selectedConv ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Chat with Teachers</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search teachers or children..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400">No active chats with teachers</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={`${conv.otherUser.id}-${conv.student.id}`}
                onClick={() => setSelectedConv(conv)}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                  selectedConv?.otherUser.id === conv.otherUser.id && selectedConv?.student.id === conv.student.id
                    ? 'bg-blue-500/10 border-l-4 border-l-blue-500'
                    : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white truncate pr-2">{conv.otherUser.fullName}</h3>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                    {conv.student.name}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 line-clamp-1">
                  {conv.lastMessage.senderRole === 'PARENT' ? 'You: ' : ''}{conv.lastMessage.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-black/20 ${!selectedConv ? 'hidden lg:flex' : 'flex'}`}>
        {selectedConv ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5 backdrop-blur-md sticky top-0 z-10">
              <button 
                onClick={() => setSelectedConv(null)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                {selectedConv.otherUser.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{selectedConv.otherUser.fullName}</h3>
                <p className="text-xs text-slate-400 truncate">{selectedConv.student.name}'s Teacher</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderUserId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.senderUserId === userId
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white/10 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.body}</p>
                        <p className={`text-[10px] mt-1 ${msg.senderUserId === userId ? 'text-blue-200' : 'text-slate-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message Center</h3>
            <p className="text-slate-400 max-w-sm">Select a teacher to discuss your child's academic progress or address any concerns.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentMessages;
