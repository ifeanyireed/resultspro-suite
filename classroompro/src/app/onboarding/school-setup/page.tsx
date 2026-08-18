"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, MapPin, Globe, Phone, ArrowRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SchoolSetupPage() {
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
      title="Register your school" 
      subtitle="Complete your school profile to start managing teachers and students."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schoolName" className="text-white text-xs font-bold uppercase tracking-wider">School Name</Label>
          <div className="relative">
            <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="schoolName"
              placeholder="e.g. Royal Academy"
              required
              className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-white text-xs font-bold uppercase tracking-wider">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="address"
              placeholder="Full physical address"
              required
              className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white text-xs font-bold uppercase tracking-wider">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+234..."
                required
                className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="text-white text-xs font-bold uppercase tracking-wider">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                placeholder="https://..."
                className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolType" className="text-white text-xs font-bold uppercase tracking-wider">School Type</Label>
          <select 
            id="schoolType"
            className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green/50 focus:border-transparent"
          >
            <option value="private" className="bg-navy">Private School</option>
            <option value="public" className="bg-navy">Public School</option>
            <option value="international" className="bg-navy">International School</option>
            <option value="other" className="bg-navy">Other</option>
          </select>
        </div>

        <div className="pt-4">
          <Button 
            type="submit"
            className="w-full bg-green hover:bg-green/90 text-navy font-bold h-11"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Complete Registration"} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
