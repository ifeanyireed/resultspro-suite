"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUserPlus as UserPlus, IconSearch as Search, IconArrowRight as ArrowRight, IconShieldCheck as ShieldCheck, IconHeart as Heart } from '@tabler/icons-react';
import { cn } from "@/lib/utils";

export default function ChildLinkPage() {
  const [step, setStep] = useState<"find" | "confirm">("find");
  const [studentId, setStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("confirm");
    }, 1000);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/onboarding/profile-setup";
    }, 1000);
  };

  return (
    <AuthLayout 
      title={step === "find" ? "Link your child's account" : "Confirm child details"} 
      subtitle={step === "find" ? "Enter your child's unique Student ID provided by their school." : "Please verify the details below are correct."}
    >
      {step === "find" ? (
        <form onSubmit={handleFind} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-white text-xs font-bold uppercase tracking-wider">Student ID</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="studentId"
                  placeholder="e.g. LBS-2024-042"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50 h-12"
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                 You can find this on your child's school ID card or contact the school administrator.
              </p>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg"
            disabled={isLoading || !studentId}
          >
            {isLoading ? "Searching..." : "Find Account"} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <button 
            type="button"
            onClick={() => window.location.href = "/onboarding/profile-setup"}
            className="w-full text-xs font-bold text-muted-foreground hover:text-white transition-colors"
          >
             I'll do this later
          </button>
        </form>
      ) : (
        <div className="space-y-8">
           <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-navy border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-2xl">
                 JA
              </div>
              <div>
                 <h3 className="text-xl font-bold text-white">Jessica Alabi</h3>
                 <p className="text-muted-foreground text-xs">Lekki British School • SSS 1</p>
              </div>
           </div>

           <div className="bg-green/5 border border-green/20 p-6 rounded-2xl flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-green shrink-0 mt-0.5" />
              <p className="text-xs text-green/80 leading-relaxed">
                 By linking this account, you will have access to Jessica's academic performance, quiz results, and teacher feedback.
              </p>
           </div>

           <div className="space-y-3">
              <Button 
                onClick={handleConfirm}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Linking..." : "Confirm & Link Account"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setStep("find")}
                className="w-full border-white/10 text-white h-12 font-bold"
                disabled={isLoading}
              >
                Not my child
              </Button>
           </div>
        </div>
      )}
    </AuthLayout>
  );
}
