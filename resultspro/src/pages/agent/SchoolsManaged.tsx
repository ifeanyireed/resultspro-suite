import React, { useEffect, useState } from 'react';
import { Building2, Plus, MoreVertical, BarChart01, Users, TrendingUp, Trophy, DollarSign, Calendar, User, LogOut } from '@/lib/hugeicons-compat';
import { useNavigate } from 'react-router-dom';
import { useAgentSchools, useAgentProfile } from '@/hooks/useAgentAnalytics';
import RegisterSchoolModal from '@/components/RegisterSchoolModal';

export const SchoolsManaged: React.FC = () => {
  const navigate = useNavigate();
  const { schools, loading, fetchSchools } = useAgentSchools();
  const { profile, fetchProfile } = useAgentProfile();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    fetchSchools();
    fetchProfile();
  }, [fetchSchools, fetchProfile]);

  const handleAddSchoolClick = () => {
    // Check plan limits
    const maxSchoolsMap: Record<string, number> = {
      'Free': 3,
      'Pro': 15,
      'Premium': 100
    };
    
    const maxSchools = maxSchoolsMap[profile?.subscriptionTier || 'Free'] || 3;
    
    if (schools.length >= maxSchools) {
      alert(`Your current plan (${profile?.subscriptionTier}) only allows managing up to ${maxSchools} schools. Please upgrade to add more.`);
      navigate('/agent/subscription-plans');
      return;
    }
    
    setShowRegisterModal(true);
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative pb-20">
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
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] p-6 text-white border border-[rgba(255,255,255,0.07)] shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Schools Managed</h1>
                  <p className="text-gray-300">Manage your assigned schools and technical support</p>
                </div>
                <button 
                  onClick={handleAddSchoolClick}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-bold shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-5 h-5" />
                  Add School
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-6 border border-[rgba(255,255,255,0.07)] backdrop-blur-md">
                <div className="text-gray-400 text-xs uppercase font-black tracking-widest mb-2">Total Schools</div>
                <div className="text-4xl font-bold text-white font-mono">{schools.length}</div>
              </div>
              <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-6 border border-[rgba(255,255,255,0.07)] backdrop-blur-md">
                <div className="text-gray-400 text-xs uppercase font-black tracking-widest mb-2">Active Technical Lead</div>
                <div className="text-4xl font-bold text-green-400 font-mono">
                  {schools.filter((s: any) => s.status === 'ACTIVE').length}
                </div>
              </div>
              <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] p-6 border border-[rgba(255,255,255,0.07)] backdrop-blur-md">
                <div className="text-gray-400 text-xs uppercase font-black tracking-widest mb-2">Avg. Commission</div>
                <div className="text-4xl font-bold text-blue-400 font-mono">
                  {schools.length > 0
                    ? (
                        schools.reduce((sum: number, s: any) => sum + (s.commissionRate || 0), 0) /
                        schools.length
                      ).toFixed(1)
                    : '—'}
                  <span className="text-xl ml-1">%</span>
                </div>
              </div>
            </div>

            {/* Schools List */}
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden shadow-2xl backdrop-blur-sm">
              {loading ? (
                <div className="p-20 text-center text-gray-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                  <p className="font-bold uppercase tracking-widest text-xs">Loading schools...</p>
                </div>
              ) : schools.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No Schools Yet</h3>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">You haven't added or been assigned to manage any schools yet. Use the "Add School" button to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/40">
                      <tr>
                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          School Name
                        </th>
                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          Role
                        </th>
                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          Commission Rate
                        </th>
                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          Status
                        </th>
                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          Assigned Date
                        </th>
                        <th className="px-6 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {schools.map((school: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/5 transition-all duration-300">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold">
                                {school.name.charAt(0)}
                              </div>
                              <span className="text-white font-bold">{school.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-gray-300 font-medium text-sm">{school.role}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                              {school.commissionRate}%
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                school.status === 'ACTIVE'
                                  ? 'text-green-400 bg-green-950/30 border border-green-500/20'
                                  : 'text-yellow-400 bg-yellow-950/30 border border-yellow-500/20'
                              }`}
                            >
                              {school.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-gray-400 text-xs font-medium">
                            {new Date(school.assignedAt).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                              <MoreVertical className="w-5 h-5 text-gray-500 group-hover:text-white" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Register School Modal */}
      {showRegisterModal && (
        <RegisterSchoolModal 
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => fetchSchools()}
          agentReferralCode={profile?.uniqueReferralCode}
        />
      )}

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

export default SchoolsManaged;
