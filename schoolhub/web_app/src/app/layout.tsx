import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loral International Schools | Moulding Future Leaders",
  description: "Loral International Schools is a premier educational institution in Nigeria, dedicated to moulding the tender life of a child through quality education and character development.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
