import type { Metadata } from "next";
import { ClientProviders } from "./providers";
import { ScrollRiseProvider } from "@/components/ScrollRiseProvider";
import "./globals.css";
import "./nets.css";

export const metadata: Metadata = {
  title: "TutorsPro - Empowering Learners Globally",
  description: "Advanced online tutoring platform for students, parents, tutors, and schools. One-to-one teaching, live classes, and progress tracking.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        
        <ClientProviders>
          <ScrollRiseProvider>
            {children}
          </ScrollRiseProvider>
        </ClientProviders>
      
      </body>
    </html>
  );
}
