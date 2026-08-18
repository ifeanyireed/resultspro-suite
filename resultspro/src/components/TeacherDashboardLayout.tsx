import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen,
  BarChart01,
  Users,
  AlertTriangle,
  User,
  LogOut,
  ArrowLeft,
  MessageCircle,
} from '@/lib/hugeicons-compat';
import NotificationBell from './NotificationBell';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const TeacherDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string>('');
  const [schoolMotto, setSchoolMotto] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // Load school info
  useEffect(() => {
    const loadSchoolInfo = async () => {
      try {
        const name = localStorage.getItem('schoolName') || '';
        const token = localStorage.getItem('authToken');
        const schoolId = localStorage.getItem('schoolId');

        setSchoolName(name);

        // Fetch school motto from the server only if schoolId exists and is valid
        if (schoolId && schoolId !== 'undefined' && schoolId.trim() && token) {
          const response = await fetch(`http://localhost:5000/api/onboarding/school/${schoolId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.motto) {
              setSchoolMotto(data.data.motto);
              localStorage.setItem('schoolMotto', data.data.motto);
            }
          }
        }
      } catch (error) {
        console.error('Error loading school motto:', error);
      }
    };

    loadSchoolInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/auth/login');
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/teacher/dashboard' },
    { label: 'Messages', icon: MessageCircle, href: '/teacher/messages' },
    { label: 'Profile', icon: User, href: '/teacher/profile' },
  ];

  const isActive = (href: string) => window.location.pathname === href;

  // Detect if we're on a detail page and show back button
  const isDetailPage = location.pathname.includes('/class/') || location.pathname.includes('/student/');
  const handleBack = () => navigate('/teacher/dashboard');

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
          <div className="flex items-center justify-between py-4 relative">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src="/logo.png" alt="Results Pro" className="h-10 w-auto" />
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Results Pro</div>
                <div className="text-sm font-semibold text-white">Teacher</div>
              </div>
            </div>

            {/* Center Section - School Name and Motto */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{schoolName || 'School Portal'}</div>
                {schoolMotto && (
                  <div className="text-xs text-gray-400 italic mt-1">{schoolMotto}</div>
                )}
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/teacher/profile')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                title="Profile"
              >
                <User size={20} strokeWidth={1.5} />
              </button>
              <div className="text-white">
                <NotificationBell />
              </div>
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
            {isDetailPage && (
              <div className="relative">
                <button
                  onClick={handleBack}
                  onMouseEnter={() => setHoveredItem('back')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  title="Go Back"
                >
                  <ArrowLeft size={24} strokeWidth={1.5} />
                </button>
                {hoveredItem === 'back' && (
                  <div className="nav-tooltip">Back</div>
                )}
              </div>
            )}
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href) && index === 0;
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

export default TeacherDashboardLayout;
