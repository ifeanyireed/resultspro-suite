import type { Metadata } from "next";
import "./globals.css";
import ScrollRiseProvider from "@/components/ScrollRiseProvider";

export const metadata: Metadata = {
  title: "ScholarsNG — The Digital Campus Operating System",
  description: "Institutional infrastructure and unified learning portal connecting schools, teachers, parents, and students.",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ScrollRiseProvider>
          {children}
        </ScrollRiseProvider>
      </body>
    </html>
  );
}
