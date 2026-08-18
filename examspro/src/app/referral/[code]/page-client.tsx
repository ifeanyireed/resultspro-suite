"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ReferralRedirect() {
  const router = useRouter();
  const params = useParams();
  const referralCode = params.code as string;

  useEffect(() => {
    if (referralCode) {
      // Redirect to signup with the ref parameter
      router.replace(`/signup?ref=${referralCode}`);
    } else {
      router.replace("/signup");
    }
  }, [referralCode, router]);

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-green animate-spin" />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Redirecting to ResultPRO Signup...</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ReferralRedirect />
    </Suspense>
  );
}

