"use client";

import { useState, Suspense } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLock as Lock, IconEye as Eye, IconEyeOff as EyeOff, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.error || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-green/10 border border-green/20 rounded-xl p-4 flex items-center gap-3 text-green text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>Success! Your account is secure again.</span>
        </div>
        <Link href="/login">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11">
            Log in to your account
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            disabled={isLoading}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            disabled={isLoading}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11"
        disabled={isLoading || !token}
      >
        {isLoading ? "Resetting..." : "Reset password"}
      </Button>

      {!token && (
        <p className="text-xs text-red-400 text-center font-medium">
          Error: Reset token is missing. Please use the link sent to your email.
        </p>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Choose a strong password to protect your account."
    >
      <Suspense fallback={<div className="text-white text-center py-8">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
