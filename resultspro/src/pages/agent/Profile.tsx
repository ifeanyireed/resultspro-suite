import React, { useEffect, useState } from 'react';
import {
  User,
  Award,
  Mail,
  Briefcase,
  CheckCircle,
  Clock,
  Edit02,
  BarChart01,
  Users,
  TrendingUp,
  Trophy,
  DollarSign,
  Calendar,
  LogOut,
  Phone,
} from '@/lib/hugeicons-compat';
import { useAgentProfile } from '@/hooks/useAgentAnalytics';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, fetchProfile, updateProfile } = useAgentProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    bio: '',
    avatarUrl: '',
    state: '',
    lga: '',
    locationType: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        state: profile.state || '',
        lga: profile.lga || '',
        locationType: profile.locationType || 'INDIVIDUAL',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">No profile found</div>
      </div>
    );
  }

  const getVerificationBadge = (status: string) => {
    if (status === 'VERIFIED') {
      return (
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          Verified
        </div>
      );
    }
    if (status === 'PENDING') {
      return (
        <div className="flex items-center gap-1 text-yellow-400 text-sm">
          <Clock className="w-4 h-4" />
          Pending Verification
        </div>
      );
    }
    return (
      <div className="text-red-400 text-sm">Not Verified</div>
    );
  };

  // @ts-ignore
  const user = profile.user || {};

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/Hero.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-6">
      {/* Header */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 text-white hover:bg-white/5 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Agent Avatar"
                className="h-24 w-24 rounded-full object-cover border-2 border-blue-400"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center border border-[rgba(255,255,255,0.10)]">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold mb-2">{user.fullName || (user.firstName ? user.firstName + ' ' + user.lastName : 'Agent')}</h1>
              <p className="text-gray-300 mb-2">ID: {profile.id.substring(0, 8)}...</p>
              {getVerificationBadge(profile.verificationStatus)}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            <Edit02 className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Bio Section */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              About & Location
            </h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Location Type</label>
                    <select
                      value={formData.locationType}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white focus:border-blue-500 outline-none"
                    >
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="CORPORATE">Corporate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Avatar URL</label>
                    <input
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder="Avatar URL..."
                      className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State (e.g. Lagos)"
                      className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">LGA</label>
                    <input
                      type="text"
                      value={formData.lga}
                      onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                      placeholder="LGA"
                      className="w-full bg-[rgba(0,0,0,0.40)] border border-[rgba(255,255,255,0.07)] rounded p-3 text-white placeholder-gray-400 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs text-gray-500 uppercase font-semibold">Bio</h3>
                  <p className="text-gray-300 mt-1">
                    {profile.bio || 'No bio added yet.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase font-semibold">Location Type</h3>
                    <p className="text-white mt-1">{profile.locationType || 'Individual'}</p>
                  </div>
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase font-semibold">Location</h3>
                    <p className="text-white mt-1">
                      {profile.lga ? `${profile.lga}, ` : ''}{profile.state || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Credentials Section */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Credentials & Certifications
            </h2>
            {profile.credentials ? (
              <div className="space-y-2 text-gray-300">
                <p>Credentials on file</p>
              </div>
            ) : (
              <p className="text-gray-400">No credentials uploaded yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Account Info */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <h3 className="text-sm font-semibold text-white mb-4">Account Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400 w-5 h-5" />
                <div>
                  <div className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Email</div>
                  <div className="text-white font-medium">{user.email || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400 w-5 h-5" />
                <div>
                  <div className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Phone</div>
                  <div className="text-white font-medium">{user.phoneNumber || profile.phoneNumber || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400 w-5 h-5" />
                <div>
                  <div className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Member Since</div>
                  <div className="text-white font-medium">
                    {/* @ts-ignore */}
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <h3 className="text-sm font-semibold text-white mb-4">Subscription</h3>
            <div className="space-y-4">
              <div className="text-center py-4 bg-[rgba(0,0,0,0.40)] rounded-xl border border-[rgba(255,255,255,0.07)]">
                <div className="text-2xl font-bold text-blue-400">
                  {profile.subscriptionTier}
                </div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Current Plan</div>
              </div>
              <button 
                onClick={() => navigate('/agent/subscription-plans')}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-blue-500/20"
              >
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6 hover:bg-white/5 transition-colors">
            <h3 className="text-sm font-semibold text-white mb-4">Verification Status</h3>
            <div className="flex items-center justify-center py-4">
              {getVerificationBadge(profile.verificationStatus)}
            </div>
            <p className="text-xs text-gray-400 text-center">
              {profile.verificationStatus === 'VERIFIED'
                ? 'Your account is verified'
                : 'Complete verification to unlock full features'}
            </p>
          </div>
        </div>
      </div>
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
              { label: 'Dashboard', icon: BarChart01, href: '/agent/dashboard' },
              { label: 'Schools', icon: Users, href: '/agent/schools' },
              { label: 'Referrals', icon: TrendingUp, href: '/agent/referrals' },
              { label: 'Rewards', icon: Trophy, href: '/agent/rewards' },
              { label: 'Withdrawals', icon: DollarSign, href: '/agent/withdrawals' },
              { label: 'Plans', icon: Calendar, href: '/agent/subscription-plans' },
              { label: 'Profile', icon: User, href: '/agent/profile' },
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

export default Profile;
