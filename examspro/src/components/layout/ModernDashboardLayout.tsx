import React from 'react';

interface ModernDashboardLayoutProps {
  sidebarContent: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function ModernDashboardLayout({ sidebarContent, headerContent, children }: ModernDashboardLayoutProps) {
  return (
    <div className="dashboard-page h-screen w-screen bg-light font-sans text-gray-900 flex overflow-hidden">
      
      {/* Sidebar (Desktop) / Bottom Nav container (Mobile) */}
      <aside className="z-50 md:z-10 md:w-[280px] md:bg-white md:border-r md:border-nets-border md:flex md:flex-col md:justify-between py-0 md:py-4 shrink-0 md:h-full overflow-visible md:overflow-hidden md:relative">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full pb-16 md:pb-0">
        
        {/* Header */}
        {headerContent && (
          <header className="h-16 md:h-24 px-4 md:px-8 lg:px-12 flex items-center justify-between shrink-0 bg-white md:bg-transparent z-10 border-b md:border-none border-gray-200">
            {headerContent}
          </header>
        )}

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 pb-6 md:pb-12 pt-4 md:pt-0">
          {children}
        </div>
      </main>

    </div>
  );
}
