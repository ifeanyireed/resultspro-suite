import type { Metadata } from 'next';
import './globals.css';
import "./nets.css";

export const metadata: Metadata = {
  title: 'CoursesPRO — Cohort Learning & Mentor Operating System',
  description: 'Cohort-based learning operating system with 7-stage journeys, live presence, and mentor reviews',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

