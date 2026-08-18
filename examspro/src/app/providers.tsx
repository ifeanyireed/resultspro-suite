"use client";

import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/lib/msal";
import { PopupProvider } from "@/components/PopupProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
        <Toaster position="top-right" />
        <PopupProvider>
          {children}
        </PopupProvider>
      </GoogleOAuthProvider>
    </MsalProvider>
  );
}
