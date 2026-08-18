'use client';

import PortalSidebar from "@/components/PortalSidebar/PortalSidebar";
import PortalHeader from "@/components/PortalHeader/PortalHeader";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', /* Use fixed height to enable internal scrolling */
      background: '#eff6ff', 
      color: '#1a202c',
      overflow: 'hidden'
    }}>
      <PortalSidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: '280px', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <main style={{ 
          flex: 1, 
          overflowY: 'auto',
          position: 'relative' /* Context for sticky children */
        }}>
          <PortalHeader />
          <div style={{ padding: '1rem 1.5rem 2rem' }}>
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        /* Reset background for portal specifically if body background leaks */
        body {
          background: #eff6ff !important;
        }
        
        /* Remove text shadows from all portal elements */
        h1, h2, h3, p, span, div {
          text-shadow: none !important;
        }

        /* Standardize scrollbars to 2px */
        *::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `}</style>
    </div>
  );
}
