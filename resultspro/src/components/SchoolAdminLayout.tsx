import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar,
  LayoutGrid,
  BookOpen,
  Award,
  Users,
  UserGroup,
  Contact,
  FileText,
  Send,
  BarChart01,
  Trophy,
  Settings,
  CreditCard,
  LogOut,
  Bell,
  User,
  Ticket,
  Layers,
  MessageCircle,
  ClipboardList
} from '../lib/hugeicons-compat';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const SchoolAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/auth/login');
  };

  const navItems: NavItem[] = [
    { label: 'Overview', icon: LayoutDashboard, href: '/school-admin/overview' },
    { label: 'School Setup', icon: Building2, href: '/school-admin/onboarding' },
    { label: 'Results Setup', icon: ClipboardList, href: '/school-admin/results-setup' },
    { label: 'Results', icon: FileText, href: '/school-admin/results-entry' },
    { label: 'Sessions', icon: Calendar, href: '/school-admin/sessions' },
    { label: 'Classes', icon: LayoutGrid, href: '/school-admin/classes' },
    { label: 'Subjects', icon: BookOpen, href: '/school-admin/subjects' },
    { label: 'Grading', icon: Award, href: '/school-admin/grading' },
    { label: 'Students', icon: Users, href: '/school-admin/students' },
    { label: 'Teachers', icon: UserGroup, href: '/school-admin/teachers' },
    { label: 'Parents', icon: Contact, href: '/school-admin/parents' },
    { label: 'Publishing', icon: Send, href: '/school-admin/publishing' },
    { label: 'Scratch Cards', icon: Ticket, href: '/school-admin/scratch-cards' },
    { label: 'Card Requests', icon: MessageCircle, href: '/school-admin/scratch-cards/requests' },
    { label: 'Card Batches', icon: Layers, href: '/school-admin/scratch-cards/batches' },
    { label: 'Analytics', icon: BarChart01, href: '/school-admin/analytics' },
    { label: 'Leaderboard', icon: Trophy, href: '/school-admin/leaderboard' },
    { label: 'Billing', icon: CreditCard, href: '/school-admin/billing' },
    { label: 'Support Tickets', icon: MessageCircle, href: '/school-admin/tickets' },
    { label: 'Settings', icon: Settings, href: '/school-admin/settings' },
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
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/Hero.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md px-4 md:px-8" style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Results Pro" className="h-10 w-auto" />
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Results Pro</div>
                <div className="text-sm font-semibold text-white">School Administration</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/school-admin/profile')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                title="Profile"
              >
                <User size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => navigate('/school-admin/notifications')}
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
      <main className="relative z-10 flex-1 overflow-auto pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md border-t border-white/10" style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.2) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-1.5 py-4 flex-wrap">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <div key={item.href} className="relative">
                  <Link
                    to={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      active
                        ? 'text-white bg-white/15 border border-white/30 shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.5} />
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

export default SchoolAdminLayout;
