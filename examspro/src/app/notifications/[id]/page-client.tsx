"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function NotificationRedirect() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      // For now, redirect to the main notifications page
      router.replace("/notifications");
    } else {
      router.replace("/notifications");
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-green animate-spin" />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading notification...</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <NotificationRedirect />
    </Suspense>
  );
}
