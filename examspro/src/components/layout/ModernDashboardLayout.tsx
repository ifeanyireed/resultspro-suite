import React from 'react';

interface ModernDashboardLayoutProps {
  sidebarContent: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function ModernDashboardLayout({ sidebarContent, headerContent, children }: ModernDashboardLayoutProps) {
  return (
    <div className="dashboard-page h-screen w-screen bg-light font-sans text-gray-900 flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-nets-border flex flex-col justify-between py-4 shrink-0 h-full overflow-hidden z-10 relative">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        {headerContent && (
          <header className="h-24 px-8 lg:px-12 flex items-center justify-between shrink-0">
            {headerContent}
          </header>
        )}

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12">
          {children}
        </div>
      </main>

    </div>
  );
}
