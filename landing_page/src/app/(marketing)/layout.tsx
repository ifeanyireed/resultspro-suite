import type { Metadata } from "next";
import "../globals.css";
import "../nets.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

export const metadata: Metadata = {
  title: "ResultsPRO NG | Education Infrastructure",
  description: "A premium digital campus platform for modern schools.",
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
      <body className="font-primary">
        <Navbar />
        {children}
        <Footer />
        <FloatingChat />
      </body>
    </html>
  );
}
