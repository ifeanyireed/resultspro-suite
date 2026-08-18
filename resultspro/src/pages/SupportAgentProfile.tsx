import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  BarChart01, 
  LogOut, 
  Edit02 
} from '@/lib/hugeicons-compat';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:5000/api';

interface SupportAgentData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  assignedTickets?: number;
  resolvedTickets?: number;
  pendingTickets?: number;
}

const SupportAgentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState<SupportAgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentProfile();
  }, []);

  const fetchAgentProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/support/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgentData(response.data.data);
      setFormData({
        name: response.data.data.name || '',
        email: response.data.data.email || '',
        phone: response.data.data.phone || '',
        bio: response.data.data.bio || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE}/support/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false);
      await fetchAgentProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

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
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          white-space: nowrap;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Hero Section with background */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url('/Hero.png')`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>

        {/* Sticky Header */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-8 flex items-center justify-between">
            {/* Left Section - Logo/Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <User size={24} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Support Agent Profile</div>
                <div className="text-xs text-gray-400 italic mt-1">View and manage your profile</div>
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/support-agent/dashboard')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                title="Dashboard"
              >
                <BarChart01 size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {agentData?.name || 'Support Agent'}
                  </h1>
                  <p className="text-gray-400">{agentData?.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit02 size={18} strokeWidth={1.5} />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">
                      Full Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-[rgba(0,0,0,0.40)] border-[rgba(255,255,255,0.07)] text-white"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-[rgba(0,0,0,0.40)] border-[rgba(255,255,255,0.07)] text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">
                      Phone Number
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-[rgba(0,0,0,0.40)] border-[rgba(255,255,255,0.07)] text-white"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">
                      Bio
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="bg-[rgba(0,0,0,0.40)] border-[rgba(255,255,255,0.07)] text-white resize-none h-24"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-gray-300">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Full Name
                      </p>
                      <p className="text-white">{agentData?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Email
                      </p>
                      <p className="text-white">{agentData?.email}</p>
                    </div>
                  </div>

                  {agentData?.phone && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Phone
                      </p>
                      <p className="text-white">{agentData.phone}</p>
                    </div>
                  )}

                  {agentData?.bio && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Bio
                      </p>
                      <p className="text-white">{agentData.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Statistics Card */}
            {(agentData?.assignedTickets !== undefined ||
              agentData?.resolvedTickets !== undefined ||
              agentData?.pendingTickets !== undefined) && (
              <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-8">
                <h2 className="text-xl font-bold text-white mb-6">Ticket Statistics</h2>
                <div className="grid grid-cols-3 gap-4">
                  {agentData?.assignedTickets !== undefined && (
                    <div className="bg-[rgba(0,0,0,0.40)] rounded-lg p-4 text-center border border-[rgba(255,255,255,0.07)]">
                      <p className="text-3xl font-bold text-white mb-2">
                        {agentData.assignedTickets}
                      </p>
                      <p className="text-sm text-gray-400">Assigned Tickets</p>
                    </div>
                  )}
                  {agentData?.resolvedTickets !== undefined && (
                    <div className="bg-[rgba(0,0,0,0.40)] rounded-lg p-4 text-center border border-[rgba(255,255,255,0.07)]">
                      <p className="text-3xl font-bold text-green-400 mb-2">
                        {agentData.resolvedTickets}
                      </p>
                      <p className="text-sm text-gray-400">Resolved</p>
                    </div>
                  )}
                  {agentData?.pendingTickets !== undefined && (
                    <div className="bg-[rgba(0,0,0,0.40)] rounded-lg p-4 text-center border border-[rgba(255,255,255,0.07)]">
                      <p className="text-3xl font-bold text-yellow-400 mb-2">
                        {agentData.pendingTickets}
                      </p>
                      <p className="text-sm text-gray-400">Pending</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md border-t border-white/10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      >
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

export default SupportAgentProfile;
