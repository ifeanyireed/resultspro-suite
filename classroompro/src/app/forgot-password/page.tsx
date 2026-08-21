"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconMail as Mail, IconArrowLeft as ArrowLeft } from '@tabler/icons-react';
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { 
        email,
        redirect_url: window.location.origin + "/reset-password"
      });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.error || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="We've sent a password reset link to your email address."
      >
        <div className="space-y-6">
          <div className="bg-green/10 border border-green/20 rounded-xl p-4 flex items-center gap-3 text-green text-sm">
            <Mail className="w-5 h-5" />
            <span>If an account exists, you will receive an email shortly.</span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
              Back to log in
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot password?" 
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              placeholder="name@school.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11"
          disabled={isLoading}
        >
          {isLoading ? "Sending link..." : "Send reset link"}
        </Button>

        <Link 
          href="/login" 
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to log in
        </Link>
      </form>
    </AuthLayout>
  );
}
