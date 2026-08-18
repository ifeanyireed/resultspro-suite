import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  Ticket, 
  BarChart01,
  CheckCircle,
  TrendingUp,
  MessageCircle,
  ShoppingCart,
  Headphones,
  Settings,
  User,
  Bell,
  LogOut,
  Users,
  Newspaper,
  Mail,
  Play,
} from '../lib/hugeicons-compat';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const SuperAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/auth/login');
  };

  const navItems: NavItem[] = [
    { label: 'Overview', icon: LayoutDashboard, href: '/super-admin/overview' },
    { label: 'Schools', icon: Building2, href: '/super-admin/schools' },
    { label: 'Verifications', icon: CheckCircle, href: '/super-admin/verifications' },
    { label: 'Agents', icon: Users, href: '/super-admin/agents' },
    { label: 'Financials', icon: CreditCard, href: '/super-admin/financials' },
    { label: 'Scratch Cards', icon: Ticket, href: '/super-admin/scratch-cards' },
    { label: 'Subscriptions', icon: ShoppingCart, href: '/super-admin/subscriptions' },
    { label: 'Analytics', icon: TrendingUp, href: '/super-admin/analytics' },
    { label: 'Blog CMS', icon: Newspaper, href: '/super-admin/blog-management' },
    { label: 'Videos', icon: Play, href: '/super-admin/videos' },
    { label: 'Email', icon: Mail, href: '/super-admin/email-management' },
    { label: 'Support', icon: Headphones, href: '/super-admin/support' },
    { label: 'Support Staff', icon: Users, href: '/super-admin/support-staff' },
    { label: 'Settings', icon: Settings, href: '/super-admin/settings' },
  ];

  const isActive = (href: string) => window.location.pathname === href;

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col relative">
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Results Pro" className="h-10 w-auto" />
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Results Pro</div>
                <div className="text-sm font-semibold text-white">Admin Dashboard</div>
              </div>
            </div>
            {/* User Actions in Top Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/super-admin/profile')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                title="Profile"
              >
                <User size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => navigate('/super-admin/notifications')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                title="Notifications"
              >
                <Bell size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 text-gray-400 hover:text-red-400"
                title="Logout"
              >
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md border-t border-white/10" style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.2) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-2 py-4 flex-wrap">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <div key={item.href} className="relative">
                  <Link
                    to={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                      active
                        ? 'text-white bg-white/15 border border-white/30 shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                  </Link>
                  {hoveredItem === item.href && (
                    <div className="nav-tooltip">{item.label}</div>
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

export default SuperAdminLayout;
