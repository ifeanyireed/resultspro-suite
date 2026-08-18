"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  School, 
  UserCircle, 
  ShieldCheck, 
  Users,
  ArrowRight,
  Heart
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Access class notes, quizzes, and track your academic progress.",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "text-green",
    bgColor: "bg-green/10",
    nextStep: "/onboarding/school-selection"
  },
  {
    id: "parent",
    title: "Parent",
    description: "Monitor your child's progress, view results and manage subscriptions.",
    icon: <Heart className="w-6 h-6" />,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    nextStep: "/onboarding/child-link"
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Create notes, manage classes, and track student performance.",
    icon: <Users className="w-6 h-6" />,
    color: "text-blue",
    bgColor: "bg-blue/10",
    nextStep: "/onboarding/school-selection"
  },
  {
    id: "school_admin",
    title: "School Admin",
    description: "Manage your school's ecosystem, teachers, and students.",
    icon: <School className="w-6 h-6" />,
    color: "text-amber",
    bgColor: "bg-amber/10",
    nextStep: "/onboarding/school-setup"
  },
  {
    id: "public_user",
    title: "Public Learner",
    description: "Self-study using public resources and track your own progress.",
    icon: <UserCircle className="w-6 h-6" />,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    nextStep: "/dashboard"
  }
];

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const currentRole = roles.find(r => r.id === selectedRole);

  return (
    <AuthLayout 
      title="Choose your role" 
      subtitle="Select how you'll be using ClassroomPRO to tailor your experience."
    >
      <div className="grid gap-4 mb-8">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
              selectedRole === role.id 
                ? "bg-white/10 border-green/50 ring-1 ring-green/50" 
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", role.bgColor, role.color)}>
              {role.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold leading-none mb-1">{role.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{role.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Link href={currentRole?.nextStep || "#"}>
        <Button 
          className="w-full bg-green hover:bg-green/90 text-navy font-bold h-12 text-lg"
          disabled={!selectedRole}
        >
          Continue <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Link>
    </AuthLayout>
  );
}
