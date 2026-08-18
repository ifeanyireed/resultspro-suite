import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { ClientProviders } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FREE JAMB. WAEC, NECO CBT Practice with 2026 Syllabus and AI Tutor",
  description: "The ultimate CBT practice platform for Nigerian students with AI-powered tutoring and 2026 syllabus coverage.",
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
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
