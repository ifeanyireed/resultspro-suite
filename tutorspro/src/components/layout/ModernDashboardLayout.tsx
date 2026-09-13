import React from 'react';

interface ModernDashboardLayoutProps {
  sidebarContent: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function ModernDashboardLayout({ sidebarContent, headerContent, children }: ModernDashboardLayoutProps) {
  return (
    <div className="dashboard-page min-h-screen bg-[#f9fafc] font-sans text-gray-900 flex">
      {/* Sidebar - Sticky */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between py-4 shrink-0 h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Main Content Area - Native Scroll */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* Header */}
        {headerContent && (
          <header className="h-24 px-6 flex items-center justify-between shrink-0 sticky top-0 bg-[#f9fafc] z-10">
            {headerContent}
          </header>
        )}

        {/* Dashboard Content */}
        <div className="flex-1 px-6 pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}
