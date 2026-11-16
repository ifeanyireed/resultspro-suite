import type { Metadata } from "next";
import "../globals.css";
import "../nets.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import ScrollRiseProvider from "@/components/ScrollRiseProvider";

export const metadata: Metadata = {
  title: "ResultsPRO NG | Education Infrastructure",
  description: "A premium digital campus platform for modern schools.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ResultsPRO NG | Education Infrastructure",
    description: "A premium digital campus platform for modern schools.",
    url: "https://www.resultspro.ng",
    siteName: "ResultsPRO",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResultsPRO NG | Education Infrastructure",
    description: "A premium digital campus platform for modern schools.",
    site: "@resultsprong",
    creator: "@resultsprong",
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
        <ScrollRiseProvider>
          <Navbar />
          {children}
          <Footer />
          <FloatingChat />
        </ScrollRiseProvider>
      </body>
    </html>
  );
}
