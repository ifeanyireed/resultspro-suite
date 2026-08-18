"use client";

import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Mail, 
  ShieldCheck,
  Trash2,
  ExternalLink,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getSchoolTeachers, inviteTeacher, InviteTeacherData } from '@/lib/school.api';

// Define the Teacher type based on expected API response
interface Teacher {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  // This will be enriched on the client-side
  status: 'Active' | 'Invited';
}

export default function SchoolTeachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteFullName, setInviteFullName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSchoolTeachers();
      const enrichedTeachers = data.map((t: any) => ({
        id: t.id,
        fullName: t.fullName || 'N/A',
        email: t.email || 'N/A', // Assuming email comes from a different source
        role: t.role,
        createdAt: t.createdAt,
        status: t.status === 'pending' ? 'Invited' : 'Active',
      }));
      setTeachers(enrichedTeachers);
    } catch (err: any) {
      const msg = err.error || "Failed to fetch teachers.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteFullName || !inviteEmail) {
      toast.error("Please provide both name and email.");
      return;
    }
    setIsInviting(true);
    const inviteData: InviteTeacherData = {
      full_name: inviteFullName,
      email: inviteEmail
    };

    try {
      await inviteTeacher(inviteData);
      toast.success(`${inviteFullName} has been invited!`);
      setIsModalOpen(false);
      setInviteEmail('');
      setInviteFullName('');
      fetchTeachers(); // Refresh the list
    } catch (err: any) {
      const msg = err.error || "Failed to invite teacher.";
      toast.error(msg);
    } finally {
      setIsInviting(false);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Teacher Management</h1>
            <p className="text-gray-400">Invite and manage teachers assigned to your school.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-purple text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all text-sm">
            <UserPlus className="w-5 h-5" /> Onboard New Teacher
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple transition-colors" />
            <input 
              type="text" 
              placeholder="Search teachers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Teacher</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500">Loading teachers...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center py-20 text-red-400">{error}</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500">No teachers found.</td></tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold">
                          {teacher.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-bold group-hover:text-purple transition-colors">{teacher.fullName}</div>
                          <div className="text-xs text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2 py-1 rounded-lg bg-white/5 text-[10px] text-gray-400 font-medium">{teacher.role}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        teacher.status === 'Active' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-400">{new Date(teacher.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all" disabled>
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all" disabled>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="max-w-md w-full bg-navy border border-white/10 rounded-[40px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-display text-white">Invite a New Teacher</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jane Austen"
                  value={inviteFullName}
                  onChange={(e) => setInviteFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="teacher@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button 
                onClick={handleInvite}
                disabled={isInviting}
                className="flex-[2] py-4 rounded-2xl bg-purple text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:bg-purple/50 disabled:cursor-not-allowed"
              >
                {isInviting ? 'Sending Invite...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
