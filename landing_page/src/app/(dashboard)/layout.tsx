import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./dashboard.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dashboard | ResultsPRO",
  description: "ResultsPRO Portal",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#f3f6f8] text-gray-900 m-0 p-0`}>
        {children}
      </body>
    </html>
  );
}
