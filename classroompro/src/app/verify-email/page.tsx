"use client";

import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconShieldCheck as ShieldCheck, IconRefreshCw as RefreshCw, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const email = searchParams.get("email");

  async function handleVerify(code: string) {
    setIsLoading(true);
    try {
      await api.post("/auth/verify-email", { token: code });
      setVerificationStatus("success");
      toast.success("Email verified successfully! 🎉");

      setTimeout(() => {
        if (role === "school_admin") {
          router.push("/onboarding/school-setup");
        } else if (role === "student" || role === "teacher") {
          router.push("/onboarding/school-selection");
        } else {
          router.push("/login");
        }
      }, 2000);
    } catch (error: any) {
      setVerificationStatus("error");
      toast.error(error.response?.data?.error || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }

  async function onResend() {
    if (!email) {
      toast.error("Email not found. Please try signing up again.");
      return;
    }
    setIsResending(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("New 6-digit code sent to your email.");
    } catch (error) {
      toast.error("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  }

  if (verificationStatus === "success") {
    return (
      <AuthLayout
        title="Email Verified!"
        subtitle="Your account is now active. Redirecting you..."
      >
        <div className="flex flex-col items-center py-10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-green/20 flex items-center justify-center text-green animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-green-600 text-white font-bold"
          >
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We've sent a 6-digit verification code to ${email || 'your email'}.`}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-white text-center block font-bold uppercase tracking-widest text-xs">Verification Code</Label>
          <div className="flex justify-center">
            <Input
              id="otp"
              placeholder="000000"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              disabled={isLoading}
              required
              style={{
                fontFamily: 'var(--font-ibm-plex-mono)',
                fontSize: 'min(15vw, 50px)', // Dynamic massive font size
                height: '90px'
              }}
              className="w-full text-center tracking-[0.1em] placeholder:tracking-[0.1em] font-medium bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify email"}
        </Button>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={onResend}
            disabled={isResending || isLoading}
            className="flex items-center justify-center gap-2 text-sm font-bold text-green hover:text-green/80 transition-colors mx-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
