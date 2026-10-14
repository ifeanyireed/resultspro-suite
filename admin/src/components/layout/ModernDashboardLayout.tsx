import React from 'react';
import { MobileBottomNav, NavItem } from './MobileBottomNav';

interface ModernDashboardLayoutProps {
  sidebarContent: React.ReactNode;
  headerContent?: React.ReactNode;
  mobileNavItems?: NavItem[];
  children: React.ReactNode;
}

export function ModernDashboardLayout({ 
  sidebarContent, 
  headerContent, 
  mobileNavItems,
  children 
}: ModernDashboardLayoutProps) {
  return (
    <div className="dashboard-page min-h-screen bg-[#f9fafc] font-sans text-gray-900 flex flex-col md:flex-row relative">
      {/* Sidebar - Desktop Sticky, Hidden on Mobile */}
      <aside className="hidden md:flex w-[280px] bg-white border-r border-gray-100 flex-col justify-between py-4 shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar z-20">
        {sidebarContent}
      </aside>

      {/* Main Content Area - Native Scroll with bottom padding on mobile for nav */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0 pb-20 md:pb-0">
        
        {/* Header - Compact on Mobile, Spacious on Desktop */}
        {headerContent && (
          <header className="h-16 sm:h-20 md:h-24 px-2.5 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 bg-[#f9fafc]/95 backdrop-blur-md z-30 border-b border-gray-100/80 md:border-b-0">
            {headerContent}
          </header>
        )}

        {/* Dashboard Content - Very Little Left/Right Padding on Mobile */}
        <div className="flex-1 px-2.5 sm:px-6 pb-24 md:pb-6 min-w-0">
          {children}
        </div>
      </main>

      {/* Mobile Horizontally Scrollable Bottom Nav */}
      <MobileBottomNav items={mobileNavItems} />
    </div>
  );
}
