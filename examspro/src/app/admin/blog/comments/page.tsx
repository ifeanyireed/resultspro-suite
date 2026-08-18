"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { IconLoader2 as Loader2, IconMessageSquare as MessageSquare, IconCheckCircle as CheckCircle, IconXCircle as XCircle, IconTrash2 as Trash2, IconSearch as Search, IconCalendar as Calendar, IconUser as User, IconFileText as FileText, IconChevronLeft as ChevronLeft, IconToggleLeft as ToggleLeft, IconToggleRight as ToggleRight } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface BlogComment {
  id: string;
  postId: string;
  post?: { title: string };
  userName: string;
  user?: { name: string };
  content: string;
  status: string;
  createdAt: string;
}

export default function CommentManagementPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [autoApprove, setAutoApprove] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/blog/comments");
      setComments(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get("/public/settings");
      setAutoApprove(res.data.auto_approve_comments === "true");
    } catch (err) {
      console.error("Failed to fetch settings");
    }
  };

  useEffect(() => {
    fetchComments();
    fetchSettings();
  }, []);

  const toggleAutoApprove = async () => {
    try {
      const newVal = !autoApprove;
      await api.put(`/admin/settings/auto_approve_comments`, { value: String(newVal) });
      setAutoApprove(newVal);
      toast.success(`Auto-approve ${newVal ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error("Failed to update setting");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/blog/comments/${id}`, { status });
      toast.success(`Comment ${status}`);
      fetchComments();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.delete(`/admin/blog/comments/${id}`);
      toast.success("Comment deleted");
      fetchComments();
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const filteredComments = comments.filter(c => filter === "all" || c.status === filter);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-navy text-white">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/blog" className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors font-bold text-sm">
          <ChevronLeft className="w-4 h-4" /> BACK TO BLOG CMS
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-white">Comment Management</h1>
            <p className="text-gray-500">Review and moderate blog interactions</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={toggleAutoApprove}
              className={`rounded-xl gap-2 px-6 border transition-all h-12 ${autoApprove ? 'bg-green/10 border-green text-green' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15] text-gray-400'}`}
            >
              {autoApprove ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              AUTO-APPROVE
            </Button>

            <div className="flex bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-xl p-1 h-12 items-center">
               {["all", "pending", "approved", "spam"].map(f => (
                 <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-green text-navy shadow-lg' : 'text-gray-500 hover:text-white'}`}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-green animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-6 rounded-3xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] hover:border-white/20 transition-all group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green font-black text-xs">
                             {(comment.user?.name || comment.userName || "G").charAt(0)}
                          </div>
                          <div>
                             <div className="font-bold text-white">{comment.user?.name || comment.userName}</div>
                             <div className="text-[10px] text-gray-500 flex items-center gap-2 font-bold uppercase tracking-widest">
                                <Calendar className="w-3 h-3" /> {new Date(comment.createdAt).toLocaleString()}
                             </div>
                          </div>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         comment.status === 'approved' ? 'bg-green/10 text-green' : 
                         comment.status === 'spam' ? 'bg-red-500/10 text-red-500' : 'bg-amber/10 text-amber'
                       }`}>
                         {comment.status}
                       </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-navy/50 border border-white/5 text-gray-300 italic leading-relaxed">
                       "{comment.content}"
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                       <FileText className="w-3 h-3" /> On Post: <span className="text-blue font-bold truncate">"{comment.post?.title}"</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                     {comment.status !== 'approved' && (
                       <Button 
                         onClick={() => handleUpdateStatus(comment.id, 'approved')}
                         variant="ghost" 
                         className="flex-1 rounded-xl bg-green/10 text-green hover:bg-green/20 border border-green/20 gap-2 h-10 px-4 text-xs font-black uppercase tracking-widest"
                       >
                         <CheckCircle className="w-4 h-4" /> APPROVE
                       </Button>
                     )}
                     {comment.status !== 'spam' && (
                       <Button 
                         onClick={() => handleUpdateStatus(comment.id, 'spam')}
                         variant="ghost" 
                         className="flex-1 rounded-xl bg-white/5 text-gray-400 hover:text-red-500 border border-white/[0.1] border-t-white/[0.15] gap-2 h-10 px-4 text-xs font-black uppercase tracking-widest"
                       >
                         <XCircle className="w-4 h-4" /> SPAM
                       </Button>
                     )}
                     <Button 
                        onClick={() => handleDelete(comment.id)}
                        variant="ghost" 
                        className="flex-1 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 border border-white/[0.1] border-t-white/[0.15] h-10 px-4"
                     >
                        <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredComments.length === 0 && (
              <div className="text-center py-20 bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-[40px]">
                <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-bold text-lg">No comments found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
