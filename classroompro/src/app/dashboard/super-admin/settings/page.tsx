"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  Settings, 
  Globe, 
  Shield, 
  CreditCard, 
  Bell, 
  Database,
  Layout,
  Save,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "billing", label: "Billing/Plans", icon: <CreditCard className="w-4 h-4" /> },
    { id: "seo", label: "SEO & Public", icon: <Globe className="w-4 h-4" /> },
    { id: "notifications", label: "System Alerts", icon: <Bell className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Platform Settings" />
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-11 w-48 rounded-xl" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 space-y-2">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
            </div>
            <Skeleton className="flex-1 h-[600px] rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Platform Settings" />
      
      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Global Configurations</h2>
            <p className="text-sm text-muted-foreground">Manage platform-wide settings, subscription tiers, and system security.</p>
          </div>
          <Button className="bg-green text-navy font-bold h-11 px-8 shadow-lg shadow-green/10">
             <Save className="w-4 h-4 mr-2" /> Save All Changes
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* Navigation Sidebar */}
           <div className="lg:w-64 space-y-1">
              {tabs.map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                       activeTab === tab.id 
                       ? 'bg-white/10 text-white border border-white/10 shadow-xl' 
                       : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                    }`}
                 >
                    {tab.icon}
                    {tab.label}
                 </button>
              ))}
           </div>

           {/* Content Area */}
           <div className="flex-1 bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10">
              {activeTab === "general" && (
                 <div className="space-y-10">
                    <div className="space-y-6">
                       <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Layout className="w-5 h-5 text-blue" /> Basic Information
                       </h3>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Platform Name</Label>
                             <Input defaultValue="ClassroomPRO LMS" className="bg-navy border-white/10 text-white h-11" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Support Email</Label>
                             <Input defaultValue="support@classroompro.com" className="bg-navy border-white/10 text-white h-11" />
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-6">
                       <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Database className="w-5 h-5 text-amber" /> System Controls
                       </h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div>
                                <h4 className="text-sm font-bold text-white">Maintenance Mode</h4>
                                <p className="text-xs text-muted-foreground">Restrict access to super admins while performing updates.</p>
                             </div>
                             <Switch />
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div>
                                <h4 className="text-sm font-bold text-white">Public Registration</h4>
                                <p className="text-xs text-muted-foreground">Allow new users to sign up without school invitation.</p>
                             </div>
                             <Switch defaultChecked />
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === "security" && (
                 <div className="space-y-10">
                    <div className="space-y-6">
                       <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green" /> Authentication Security
                       </h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div>
                                <h4 className="text-sm font-bold text-white">Enforce 2FA for Admins</h4>
                                <p className="text-xs text-muted-foreground">Require two-factor authentication for all admin roles.</p>
                             </div>
                             <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div>
                                <h4 className="text-sm font-bold text-white">Auto-Logout Session</h4>
                                <p className="text-xs text-muted-foreground">Logout users after 30 minutes of inactivity.</p>
                             </div>
                             <Switch defaultChecked />
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                       <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-4">
                          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                             <h4 className="text-sm font-bold text-red-500 mb-1">Danger Zone</h4>
                             <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                The following actions are irreversible. Please proceed with extreme caution.
                             </p>
                             <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10 h-9 font-bold text-xs">
                                Clear System Logs
                             </Button>
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === "billing" && (
                 <div className="space-y-8">
                    <h3 className="text-lg font-bold text-white mb-6">Manage Subscription Plans</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                       {['Standard', 'Premium', 'Enterprise'].map((plan) => (
                          <div key={plan} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Settings className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
                             </div>
                             <h4 className="font-bold text-white">{plan} Plan</h4>
                             <p className="text-2xl font-black text-green">
                                {plan === 'Standard' ? 'Free' : plan === 'Premium' ? '₦50k' : 'Custom'}
                                {plan === 'Premium' && <span className="text-xs font-normal text-muted-foreground"> /mo</span>}
                             </p>
                             <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                   <CheckCircle2 className="w-3 h-3 text-green" /> Unlimited Students
                                </li>
                                <li className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                   <CheckCircle2 className="w-3 h-3 text-green" /> Admin Panel
                                </li>
                             </ul>
                             <Button variant="outline" className="w-full border-white/10 text-white h-9 text-xs">Edit Plan</Button>
                          </div>
                       ))}
                    </div>
                    <Button variant="outline" className="w-full border-dashed border-white/20 hover:bg-white/5 text-muted-foreground py-6">
                       Add New Tier
                    </Button>
                 </div>
              )}

              {activeTab === "seo" && (
                 <div className="space-y-8">
                    <h3 className="text-lg font-bold text-white mb-6">Global SEO Metadata</h3>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Meta Title</Label>
                          <Input defaultValue="ClassroomPRO | Digital Class Notes & Learning Platform" className="bg-navy border-white/10 text-white h-11" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Meta Description</Label>
                          <textarea 
                             className="w-full bg-navy border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-green h-32 resize-none"
                             defaultValue="Access high-quality class notes, interactive quizzes, and study flashcards for all secondary school levels in Nigeria."
                          />
                       </div>
                       <div className="p-6 rounded-2xl bg-blue/5 border border-blue/20">
                          <h4 className="text-sm font-bold text-blue mb-2 flex items-center gap-2">
                             <Globe className="w-4 h-4" /> Sitemap Status
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                             Your sitemap was last generated 12 hours ago and contains 1,245 indexed pages.
                          </p>
                          <Button size="sm" className="bg-blue/20 hover:bg-blue/30 text-blue border-none font-bold text-[10px]">
                             Regenerate Sitemap
                          </Button>
                       </div>
                    </div>
                 </div>
              )}
              
              {activeTab === "notifications" && (
                 <div className="space-y-8">
                    <h3 className="text-lg font-bold text-white mb-6">Global Notification Rules</h3>
                    <div className="space-y-4">
                       {[
                          "Notify Super Admins on new school onboarding",
                          "Send email on payment failures",
                          "Alert moderation team on mass flagging",
                          "Notify users of scheduled maintenance"
                       ].map((rule, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                             <span className="text-sm text-white/80">{rule}</span>
                             <Switch defaultChecked={i < 2} />
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
