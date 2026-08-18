import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Send, Users, List, Mail, Plus, Search, MapPin, Eye, Trash2, CheckCircle2, FileText, AlertCircle, RefreshCw } from 'lucide-react';

export default function CommunicationsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'campaigns' | 'subscribers' | 'lists' | 'inbox'>('campaigns');
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [inboxEmails, setInboxEmails] = useState<any[]>([]);

  useEffect(() => {
    // Mock Data
    setCampaigns([
      { id: '1', name: 'Welcome Series - Step 1', subject: 'Welcome to ResultsPRO!', status: 'SENT', recipientSegment: 'NEW_SCHOOLS', sentCount: 1540 },
      { id: '2', name: 'Termly Results Reminder', subject: 'Don\'t forget to publish results!', status: 'DRAFT', recipientSegment: 'ACTIVE_SCHOOLS', sentCount: 0 },
    ]);
    setSubscribers([
      { id: '1', email: 'admin@greenwood.edu.ng', name: 'Greenwood Admin', location: 'Lagos', isActive: true, lists: [{ name: 'Active Schools' }] },
      { id: '2', email: 'hello@kingscollege.edu.ng', name: 'Kings College', location: 'Abuja', isActive: false, lists: [] },
    ]);
    setLists([
      { id: '1', name: 'Active Schools', description: 'Schools with active subscriptions.', isSystem: true, _count: { subscribers: 1250 } },
      { id: '2', name: 'Newsletter', description: 'General newsletter subscribers.', isSystem: false, _count: { subscribers: 5400 } },
    ]);
    setInboxEmails([
      { id: '1', fromEmail: 'support@school.com', subject: 'Help with portal login', received: '2026-08-18 10:30 AM', readStatus: 'UNREAD' },
      { id: '2', fromEmail: 'billing@other.com', subject: 'Invoice #1234', received: '2026-08-17 02:15 PM', readStatus: 'READ' },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-full shadow-inner border border-slate-200 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {[
            { id: 'campaigns', label: 'Campaigns', icon: Send },
            { id: 'subscribers', label: 'Subscribers', icon: Users },
            { id: 'lists', label: 'Email Lists', icon: List },
            { id: 'inbox', label: 'Inbox', icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                  activeSubTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          {(activeSubTab === 'lists' || activeSubTab === 'inbox') && (
            <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors shadow-sm">
              <RefreshCw className="w-4 h-4" />
              <span>{activeSubTab === 'lists' ? 'Sync System Lists' : 'Refresh Inbox'}</span>
            </button>
          )}
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>
              {activeSubTab === 'subscribers' ? 'Add Subscriber' : activeSubTab === 'lists' ? 'New List' : 'New Campaign'}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        {activeSubTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Campaigns', value: campaigns.length, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Sent', value: campaigns.filter(c => c.status === 'SENT').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Drafts', value: campaigns.filter(c => c.status === 'DRAFT').length, icon: FileText, color: 'text-slate-500', bg: 'bg-slate-100' },
                { label: 'Recipients', value: campaigns.reduce((acc, c) => acc + c.sentCount, 0), icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-base text-slate-800">Campaign History</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search campaigns..." className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Campaign</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Recipient Segment</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Sent Count</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-xs">{campaign.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">{campaign.subject}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold tracking-wider">{campaign.recipientSegment}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={campaign.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium font-mono">{campaign.sentCount}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {campaign.status === 'DRAFT' && (
                              <button className="p-1.5 rounded-full hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"><Send className="w-4 h-4" /></button>
                            )}
                            <button className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

        {activeSubTab === 'subscribers' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Filter by location..." className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500 shadow-sm" />
              </div>
              <div className="relative">
                <List className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500 shadow-sm appearance-none">
                  <option>All Lists</option>
                  <option>Active Schools</option>
                  <option>Newsletter</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search email/name..." className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500 shadow-sm" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Subscriber</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Location</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Lists</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-xs">{sub.email}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{sub.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" /> {sub.location}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {sub.lists.length > 0 ? sub.lists.map((l:any, i:number) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold">{l.name}</span>
                            )) : <span className="text-[10px] text-slate-400">None</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={sub.isActive ? 'ACTIVE' : 'INACTIVE'} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

        {activeSubTab === 'lists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <div key={list.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><List className="w-5 h-5" /></div>
                  {!list.isSystem && (
                    <button className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                  {list.name}
                  {list.isSystem && <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold uppercase tracking-widest">System</span>}
                </h3>
                <p className="text-xs text-slate-500 mb-6">{list.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                    <Users className="w-4 h-4" /> {list._count?.subscribers} Subscribers
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'inbox' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" /> Incoming Communications
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">From</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Subject</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Received</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inboxEmails.map((email) => (
                    <tr key={email.id} className={`hover:bg-blue-50/30 transition-colors ${email.readStatus === 'UNREAD' ? 'bg-blue-50/10' : ''}`}>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">{email.fromEmail}</td>
                      <td className={`px-6 py-4 text-xs ${email.readStatus === 'UNREAD' ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{email.subject}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{email.received}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
