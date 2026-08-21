"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUser as User, IconCamera as Camera, IconMail as Mail, IconPhone as Phone, IconArrowRight as ArrowRight } from '@tabler/icons-react';

export default function ProfileSetupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Complete your profile" 
      subtitle="Help us personalize your learning journey by providing a few more details."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-green/50">
              <User className="w-10 h-10 text-muted-foreground transition-colors group-hover:text-green" />
            </div>
            <button type="button" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Upload a profile picture (optional)</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white text-xs font-bold uppercase tracking-wider">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="First and Last Name"
                required
                className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white text-xs font-bold uppercase tracking-wider">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+234..."
                className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white text-xs font-bold uppercase tracking-wider">Short Bio (Optional)</Label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell us a bit about yourself..."
              className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green/50 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Go to Dashboard"} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
