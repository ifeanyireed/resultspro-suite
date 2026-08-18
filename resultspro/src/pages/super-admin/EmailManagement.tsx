import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import {
  Mail,
  Plus,
  Send,
  Settings,
  Users,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Edit02,
  Trash01,
  Eye,
  Download01,
  Upload01,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Loading01,
  XCircle,
  ListRecord,
  Location01,
  Refresh,
  ArrowRight,
  Database,
  Cloud,
} from '@/lib/hugeicons-compat';
import axios from '@/lib/axiosConfig';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED';
  recipientSegment: string;
  sentAt?: string;
  sentCount: number;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  isActive: boolean;
  location?: string;
  createdAt: string;
  lists: { id: string; name: string }[];
}

interface EmailList {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
  _count?: { subscribers: number };
}

interface Template {
  id: string;
  name: string;
  subject: string;
  category?: string;
  isActive: boolean;
}

interface InboxEmail {
  id: string;
  s3Key: string;
  subject: string;
  fromEmail: string;
  toEmail: string;
  received: string;
  readStatus: 'READ' | 'UNREAD';
  bodyPreview?: string;
  hasAttachments: boolean;
}

export default function EmailManagement() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers' | 'lists' | 'inbox' | 'templates' | 'settings'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [lists, setLists] = useState<EmailList[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [inboxEmails, setInboxEmails] = useState<InboxEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [listFilter, setListFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    htmlBody: '',
    templateId: '',
    recipientSegment: 'ALL',
    listId: '',
    location: '',
  });

  const [subscriberFormData, setSubscriberFormData] = useState({
    email: '',
    name: '',
    source: 'MANUAL',
    location: '',
    listIds: [] as string[],
  });

  const [listFormData, setListFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (activeTab === 'campaigns') loadCampaigns();
    if (activeTab === 'subscribers') loadSubscribers();
    if (activeTab === 'lists') loadLists();
    if (activeTab === 'templates') loadTemplates();
    if (activeTab === 'inbox') loadInbox();
  }, [activeTab, searchQuery, locationFilter, listFilter]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/super-admin/email/campaigns', {
        params: { skip: 0, take: 20 },
      });
      if (response.data.success) {
        setCampaigns(response.data.data);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribers = async () => {
    try {
      const response = await axios.get('/super-admin/email/subscribers', {
        params: { 
          skip: 0, 
          take: 20, 
          status: 'all',
          searchQuery: searchQuery || undefined,
          location: locationFilter || undefined,
          listId: listFilter || undefined,
        },
      });
      if (response.data.success) {
        setSubscribers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
    }
  };

  const loadLists = async () => {
    try {
      const response = await axios.get('/super-admin/email/lists');
      if (response.data.success) {
        setLists(response.data.data);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await axios.get('/super-admin/email/templates');
      if (response.data.success) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadInbox = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/super-admin/email/inbox');
      if (response.data.success) {
        setInboxEmails(response.data.data);
      }
    } catch (error) {
      console.error('Error loading inbox:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadEmail = async (email: InboxEmail) => {
    try {
      const response = await axios.get(`/super-admin/email/inbox/${email.s3Key}`);
      if (response.data.success) {
        setSelectedEmail(response.data.data);
        setShowEmailModal(true);
        // Update local status to READ
        setInboxEmails(inboxEmails.map(e => e.id === email.id ? { ...e, readStatus: 'READ' } : e));
      }
    } catch (error) {
      console.error('Error reading email:', error);
      toast.error('Failed to load email content');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/super-admin/email/campaigns', formData);
      if (response.data.success) {
        setCampaigns([response.data.data, ...campaigns]);
        setShowCreateModal(false);
        setFormData({
          name: '',
          subject: '',
          body: '',
          htmlBody: '',
          templateId: '',
          recipientSegment: 'ALL',
          listId: '',
          location: '',
        });
        toast.success('Campaign created successfully');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      const response = await axios.post(`/super-admin/email/campaigns/${campaignId}/send`, {
        recipientSegment: formData.recipientSegment,
        listId: formData.listId,
        location: formData.location,
      });
      if (response.data.success) {
        loadCampaigns();
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast.error(error.response?.data?.error || 'Failed to send campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        const response = await axios.delete(`/super-admin/email/campaigns/${campaignId}`);
        if (response.data.success) {
          setCampaigns(campaigns.filter((c) => c.id !== campaignId));
          toast.success('Campaign deleted');
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
        toast.error('Failed to delete campaign');
      }
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/super-admin/email/subscribers', subscriberFormData);
      if (response.data.success) {
        setSubscribers([response.data.data, ...subscribers]);
        setSubscriberFormData({ 
          email: '', 
          name: '', 
          source: 'MANUAL', 
          location: '', 
          listIds: [] 
        });
        toast.success('Subscriber added');
      }
    } catch (error: any) {
      console.error('Error adding subscriber:', error);
      toast.error(error.response?.data?.error || 'Failed to add subscriber');
    }
  };

  const handleToggleSubscriber = async (subscriberId: string) => {
    try {
      const response = await axios.patch(`/super-admin/email/subscribers/${subscriberId}/status`);
      if (response.data.success) {
        setSubscribers(subscribers.map(s => s.id === subscriberId ? response.data.data : s));
        toast.success('Subscriber status updated');
      }
    } catch (error) {
      console.error('Error toggling subscriber:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      try {
        const response = await axios.delete(`/super-admin/email/subscribers/${subscriberId}`);
        if (response.data.success) {
          setSubscribers(subscribers.filter(s => s.id !== subscriberId));
          toast.success('Subscriber deleted');
        }
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        toast.error('Failed to delete subscriber');
      }
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/super-admin/email/lists', listFormData);
      if (response.data.success) {
        setLists([...lists, response.data.data]);
        setShowListModal(false);
        setListFormData({ name: '', description: '' });
        toast.success('Email list created');
      }
    } catch (error: any) {
      console.error('Error creating list:', error);
      toast.error(error.response?.data?.error || 'Failed to create list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (confirm('Are you sure you want to delete this list?')) {
      try {
        const response = await axios.delete(`/super-admin/email/lists/${listId}`);
        if (response.data.success) {
          setLists(lists.filter((l) => l.id !== listId));
          toast.success('List deleted');
        }
      } catch (error: any) {
        console.error('Error deleting list:', error);
        toast.error(error.response?.data?.error || 'Failed to delete list');
      }
    }
  };

  const handleSyncUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/super-admin/email/sync-users');
      if (response.data.success) {
        loadLists();
        loadSubscribers();
        toast.success('Users synced to lists successfully');
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      toast.error('Failed to sync users');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'bg-green-500/20 text-green-300';
      case 'SENDING':
        return 'bg-blue-500/20 text-blue-300';
      case 'DRAFT':
        return 'bg-gray-500/20 text-gray-300';
      case 'FAILED':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <CheckCircle className="w-3 h-3" />;
      case 'SENDING':
        return <Loading01 className="w-3 h-3 animate-spin" />;
      case 'FAILED':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Email Management</h1>
            <p className="text-gray-400">Manage campaigns, subscribers, and communications</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'lists' && (
              <button
                onClick={handleSyncUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium disabled:opacity-50"
              >
                <Refresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Sync System Lists
              </button>
            )}
            {activeTab === 'inbox' && (
              <button
                onClick={loadInbox}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium disabled:opacity-50"
              >
                <Refresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh Inbox
              </button>
            )}
            <button
              onClick={() => {
                if (activeTab === 'lists') setShowListModal(true);
                else setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              {activeTab === 'subscribers' ? 'Add Subscriber' : activeTab === 'lists' ? 'New List' : 'New Campaign'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
          {[
            { id: 'campaigns', label: 'Campaigns', icon: Send },
            { id: 'subscribers', label: 'Subscribers', icon: Users },
            { id: 'lists', label: 'Email Lists', icon: ListRecord },
            { id: 'inbox', label: 'Inbox', icon: Mail },
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {/* Campaign Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Campaigns', value: campaigns.length, icon: Mail, color: 'text-blue-400' },
                  { label: 'Sent', value: campaigns.filter((c) => c.status === 'SENT').length, icon: CheckCircle, color: 'text-green-400' },
                  { label: 'Drafts', value: campaigns.filter((c) => c.status === 'DRAFT').length, icon: FileText, color: 'text-gray-400' },
                  { label: 'Recipients', value: campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0), icon: Users, color: 'text-purple-400' },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="relative rounded-3xl border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-all">
                      <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-bold">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{(stat.value || 0).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              {/* Campaigns Table */}
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
                <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <h2 className="text-xl font-bold text-white">Campaign History</h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.07)]">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Recipient Segment</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sent Count</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} className="py-12 text-center"><LoadingSpinner size="lg" /></td></tr>
                      ) : campaigns.length === 0 ? (
                        <tr><td colSpan={5} className="py-12 text-center text-gray-500">No campaigns found</td></tr>
                      ) : (
                        campaigns.map((campaign) => (
                          <tr key={campaign.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold text-white">{campaign.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{campaign.subject}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {campaign.recipientSegment}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeColor(campaign.status)}`}>
                                {getStatusIcon(campaign.status)}
                                {campaign.status}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                              {campaign.sentCount || 0} / {subscribers.length}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {campaign.status === 'DRAFT' && (
                                  <button onClick={() => handleSendCampaign(campaign.id)} className="p-2 hover:bg-green-500/10 text-green-400 rounded-lg transition-colors">
                                    <Send className="w-4 h-4" />
                                  </button>
                                )}
                                <button onClick={() => handleDeleteCampaign(campaign.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                                  <Trash01 className="w-4 h-4" />
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
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Location01 className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="relative">
                  <ListRecord className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <select
                    value={listFilter}
                    onChange={(e) => setListFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                  >
                    <option value="">All Lists</option>
                    {lists.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search email/name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Quick Add Subscriber Form */}
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8">
                <h3 className="text-xl font-bold text-white mb-6">Quick Add Subscriber</h3>
                <form onSubmit={handleAddSubscriber} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Email</label>
                    <input
                      type="email"
                      required
                      value={subscriberFormData.email}
                      onChange={(e) => setSubscriberFormData({ ...subscriberFormData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Name</label>
                    <input
                      type="text"
                      value={subscriberFormData.name}
                      onChange={(e) => setSubscriberFormData({ ...subscriberFormData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Location</label>
                    <input
                      type="text"
                      value={subscriberFormData.location}
                      onChange={(e) => setSubscriberFormData({ ...subscriberFormData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="City/State"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">List</label>
                    <select
                      value={subscriberFormData.listIds[0] || ''}
                      onChange={(e) => setSubscriberFormData({ ...subscriberFormData, listIds: e.target.value ? [e.target.value] : [] })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                    >
                      <option value="">No List</option>
                      {lists.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                    Add Subscriber
                  </button>
                </form>
              </div>

              {/* Subscribers Table */}
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.07)]">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subscriber</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lists</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-white">{sub.email}</div>
                            <div className="text-xs text-gray-500">{sub.name || 'Anonymous'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Location01 className="w-3 h-3" />
                              {sub.location || 'Unknown'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {sub.lists?.map(l => (
                                <span key={l.id} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">
                                  {l.name}
                                </span>
                              )) || <span className="text-gray-600 text-[10px]">None</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sub.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {sub.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleToggleSubscriber(sub.id)} className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteSubscriber(sub.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                                <Trash01 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <div key={list.id} className="relative rounded-3xl border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                      <ListRecord className="w-6 h-6" />
                    </div>
                    {!list.isSystem && (
                      <button onClick={() => handleDeleteList(list.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash01 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    {list.name}
                    {list.isSystem && <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-bold uppercase tracking-widest">System</span>}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">{list.description || 'No description provided'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                      <Users className="w-4 h-4" />
                      {list._count?.subscribers || 0} Subscribers
                    </div>
                    <button 
                      onClick={() => {
                        setListFilter(list.id);
                        setActiveTab('subscribers');
                      }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      View All <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden">
                <div className="p-6 border-b border-[rgba(255,255,255,0.07)] bg-white/5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Incoming Communications
                  </h2>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hostinger IMAP Active</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.07)]">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">From</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Received</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={4} className="py-12 text-center"><LoadingSpinner size="lg" /></td></tr>
                      ) : inboxEmails.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <Mail className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
                            <p className="text-gray-500 font-bold">Your inbox is empty</p>
                          </td>
                        </tr>
                      ) : (
                        inboxEmails.map((email) => (
                          <tr key={email.id} className={`border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors ${email.readStatus === 'UNREAD' ? 'bg-blue-500/5' : ''}`}>
                            <td className="px-6 py-4">
                              <div className={`text-sm font-bold ${email.readStatus === 'UNREAD' ? 'text-white' : 'text-gray-400'}`}>
                                {email.fromEmail}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${email.readStatus === 'UNREAD' ? 'text-white font-bold' : 'text-gray-400'}`}>
                                {email.subject}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">{email.bodyPreview}</div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                              {new Date(email.received).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleReadEmail(email)}
                                className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                              >
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
          )}

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.length === 0 ? (
                <div className="col-span-full relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-20" />
                  <p className="text-gray-500 font-bold">No templates yet</p>
                </div>
              ) : (
                templates.map((template) => (
                  <div key={template.id} className="relative rounded-3xl border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 hover:border-white/20 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-500 truncate mb-4">{template.subject}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{template.category || 'General'}</span>
                      <div className="flex gap-2">
                        <Edit02 className="w-4 h-4 text-blue-400 cursor-pointer hover:text-blue-300" />
                        <Trash01 className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-300" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
              {/* Hostinger SMTP/IMAP Settings */}
              <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Hostinger Integration</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Primary Delivery Service</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">SMTP Host</label>
                      <input type="text" value="smtp.hostinger.com" readOnly className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono text-xs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">SMTP Port</label>
                      <input type="text" value="465 (SSL)" readOnly className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono text-xs" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Sending Address (noreply)</label>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      noreply@resultspro.ng
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">IMAP Host</label>
                      <input type="text" value="imap.hostinger.com" readOnly className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono text-xs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">IMAP Port</label>
                      <input type="text" value="993 (SSL)" readOnly className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono text-xs" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1 text-blue-400">Inbox Address (hello)</label>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-200 font-bold text-sm">
                      <Mail className="w-4 h-4" />
                      hello@resultspro.ng
                    </div>
                  </div>
                </div>
              </div>

              {/* AWS / Infrastructure Settings */}
              <div className="space-y-8">
                <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AWS Infrastructure</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Storage & Failover</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-bold text-white">S3 Storage</p>
                          <p className="text-[10px] text-gray-500">results-pro-email-inbox</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-lg uppercase">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50">
                      <div className="flex items-center gap-3">
                        <Send className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-bold text-white">SES Sending</p>
                          <p className="text-[10px] text-gray-500">Failover Mode</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-[10px] font-bold rounded-lg uppercase">Standby</span>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8">
                  <h3 className="text-lg font-bold text-white mb-6">Performance Limits</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-500 uppercase tracking-widest">Rate Limit</span>
                        <span className="text-blue-400">100ms / email</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                      Rate limiting is active to ensure compliance with Hostinger and AWS SES sending quotas. Recommended setting: 100-250ms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-white/10 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Create New Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Internal Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="e.g. March Newsletter" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Segment/List</label>
                  <select value={formData.listId} onChange={(e) => setFormData({ ...formData, listId: e.target.value, recipientSegment: e.target.value ? 'LIST' : 'ALL' })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option value="">All Subscribers</option>
                    {lists.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Location Filter</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="Optional: City or State" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Email Subject</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="What they see in their inbox" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Message Content</label>
                <textarea required value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 h-40 resize-none" placeholder="Write your message here..." />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                  Save & Queue Campaign
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-8 py-4 rounded-2xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all">
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-white/10 rounded-[32px] max-w-md w-full shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Create Email List</h3>
              <button onClick={() => setShowListModal(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500">✕</button>
            </div>

            <form onSubmit={handleCreateList} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">List Name</label>
                <input type="text" required value={listFormData.name} onChange={(e) => setListFormData({ ...listFormData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="e.g. Lagos School Admins" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Description</label>
                <textarea value={listFormData.description} onChange={(e) => setListFormData({ ...listFormData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 h-32 resize-none" placeholder="What is this list for?" />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                Create List
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Email Viewer Modal */}
      {showEmailModal && selectedEmail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-white/10 rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{selectedEmail.subject}</h3>
                <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500">✕</button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">From:</span>
                  <span className="text-blue-400 font-medium">{selectedEmail.from}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Date:</span>
                  <span className="text-gray-300 font-medium">{new Date(selectedEmail.date).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white/2">
              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white">
                {selectedEmail.html ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-gray-300">{selectedEmail.text}</pre>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setShowEmailModal(false)} className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all font-bold">
                Close
              </button>
              <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                Reply <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
