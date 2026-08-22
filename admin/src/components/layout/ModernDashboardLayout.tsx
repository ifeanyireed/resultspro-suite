import React from 'react';

interface ModernDashboardLayoutProps {
  sidebarContent: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function ModernDashboardLayout({ sidebarContent, headerContent, children }: ModernDashboardLayoutProps) {
  return (
    <div className="dashboard-page min-h-screen bg-[#f3f6f8] font-sans text-gray-900 flex justify-center p-4 lg:p-6 overflow-hidden">
      {/* Main App Container */}
      <div className="w-full max-w-[1600px] bg-[#f9fafc] rounded-[2rem] shadow-xl border border-gray-100 flex overflow-hidden h-[calc(100vh-3rem)]">
        
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between py-4 shrink-0 h-full overflow-y-auto">
          {sidebarContent}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          {headerContent && (
            <header className="h-24 px-3 flex items-center justify-between shrink-0">
              {headerContent}
            </header>
          )}

          {/* Scrollable Dashboard Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
