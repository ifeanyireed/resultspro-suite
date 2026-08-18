"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconSearch as Search, IconSchool as School, IconGraduationCap as GraduationCap, IconArrowRight as ArrowRight, IconArrowLeft as ArrowLeft, IconCheckCircle2 as CheckCircle2 } from '@tabler/icons-react';
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockSchools = [
  { id: "1", name: "Lekki British School", address: "Lekki, Lagos" },
  { id: "2", name: "Greenwood House School", address: "Ikoyi, Lagos" },
  { id: "3", name: "Corona Schools", address: "Multiple Locations" },
  { id: "4", name: "Atlantic Hall", address: "Epe, Lagos" },
];

const mockClasses = [
  { id: "j1", name: "JSS 1" },
  { id: "j2", name: "JSS 2" },
  { id: "j3", name: "JSS 3" },
  { id: "s1", name: "SSS 1" },
  { id: "s2", name: "SSS 2" },
  { id: "s3", name: "SSS 3" },
];

export default function SchoolSelectionPage() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredSchools = mockSchools.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Find your school" : "Select your class"} 
      subtitle={step === 1 ? "Search and select your school to access assigned content." : "Choose your current grade level or class."}
    >
      {step === 1 ? (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by school name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white focus:border-green/50 focus:ring-green/50"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
            {filteredSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSelectedSchool(school.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                  selectedSchool === school.id 
                    ? "bg-green/10 border-green/50" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <School className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{school.name}</div>
                    <div className="text-[10px] text-muted-foreground">{school.address}</div>
                  </div>
                </div>
                {selectedSchool === school.id && <CheckCircle2 className="w-5 h-5 text-green" />}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <Button 
              className="w-full bg-green hover:bg-green/90 text-navy font-bold h-11"
              disabled={!selectedSchool}
              onClick={() => setStep(2)}
            >
              Next Step <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Can't find your school? {" "}
              <Link href="/support" className="text-green font-bold hover:underline">Request to add it</Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {mockClasses.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all text-center",
                  selectedClass === cls.id 
                    ? "bg-green/10 border-green/50" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <GraduationCap className={cn("w-6 h-6 mx-auto mb-2", selectedClass === cls.id ? "text-green" : "text-muted-foreground")} />
                <div className={cn("text-sm font-bold", selectedClass === cls.id ? "text-white" : "text-muted-foreground")}>
                  {cls.name}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <Button 
              variant="outline"
              className="flex-1 border-white/10 hover:bg-white/5 text-white h-11"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button 
              className="flex-[2] bg-green hover:bg-green/90 text-navy font-bold h-11"
              disabled={!selectedClass || isLoading}
              onClick={handleFinish}
            >
              {isLoading ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
