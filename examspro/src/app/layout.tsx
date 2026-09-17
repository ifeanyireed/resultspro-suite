import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { ClientProviders } from "./providers";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import "./nets.css";


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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1066097862900377');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1066097862900377&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <ClientProviders>
          {children}
        </ClientProviders>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
