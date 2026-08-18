"use client";

import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/lib/msal";
import { PopupProvider } from "@/components/PopupProvider";
import { useEffect, useState } from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const [initialized, setInitialized] = useState(false);
  const isMsEnabled = process.env.NEXT_PUBLIC_ENABLE_MICROSOFT_AUTH === 'true';

  useEffect(() => {
    const initializeMsal = async () => {
      if (isMsEnabled) {
        try {
          await msalInstance.initialize();
        } catch (error) {
          console.error("MSAL initialization error:", error);
        }
      }
      setInitialized(true);
    };
    initializeMsal();
  }, [isMsEnabled]);

  if (!initialized) {
    return null;
  }

  const content = (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Toaster position="top-right" />
      <PopupProvider>
        {children}
      </PopupProvider>
    </GoogleOAuthProvider>
  );

  if (isMsEnabled) {
    return (
      <MsalProvider instance={msalInstance}>
        {content}
      </MsalProvider>
    );
  }

  return content;
}
