import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || "",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Create the instance only if enabled and in a browser with crypto support
export const msalInstance = (() => {
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_MICROSOFT_AUTH === 'true';
  
  if (isEnabled && typeof window !== 'undefined' && (window.crypto || (window as any).msCrypto)) {
    try {
      return new PublicClientApplication(msalConfig);
    } catch (e) {
      console.error("Failed to create MSAL instance:", e);
    }
  }

  // Fallback for SSR, insecure contexts, or when explicitly disabled
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'initialize') return () => Promise.resolve();
      if (prop === 'getAllAccounts') return () => [];
      if (prop === 'getActiveAccount') return () => null;
      if (prop === 'handleRedirectPromise') return () => Promise.resolve(null);
      if (prop === 'addEventCallback') return () => null;
      if (prop === 'enableAccountStorageEvents') return () => null;
      
      return (...args: any[]) => {
        const message = !isEnabled 
          ? "Microsoft login is currently disabled in settings."
          : "Microsoft login is unavailable in this environment (requires HTTPS or localhost).";
        
        // Log which property was accessed to help debugging
        console.warn(`MSAL property "${String(prop)}" called while disabled/unavailable.`);

        const error = new Error(message);
        // Only throw if it's a login/token method, otherwise just log and return null/noop
        const loginMethods = ['loginPopup', 'loginRedirect', 'acquireTokenPopup', 'acquireTokenRedirect', 'acquireTokenSilent'];
        if (loginMethods.includes(String(prop))) {
          throw error;
        }
        return null;
      };
    }
  }) as unknown as PublicClientApplication;
})();

export const loginRequest = {
  scopes: ["User.Read"],
};
