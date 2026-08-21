"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconUser as User, IconLock as Lock, IconBell as Bell, IconShield as Shield, IconLogOut as LogOut, IconCamera as Camera, IconSave as Save, IconMail as Mail, IconPhone as Phone, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/change-password", {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Info", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1">
      <DashboardHeader title="Account Settings" />
      
      <main className="p-8 max-w-4xl space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs */}
          <div className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-green/10 text-green" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-white/5">
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
               >
                  <LogOut className="w-4 h-4" />
                  Sign Out
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-[32px] p-8">
            {activeTab === "profile" && (
               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden font-bold text-2xl text-green">
                           {user?.full_name?.[0] || <User className="w-10 h-10 text-muted-foreground" />}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                           <Camera className="w-3.5 h-3.5" />
                        </button>
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white mb-1">{user?.full_name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()} Account</p>
                     </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12">
                       <Loader2 className="w-8 h-8 text-green animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">Full Name</Label>
                          <Input 
                            value={profileData?.full_name || user?.full_name} 
                            onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                            className="bg-navy border-white/10 text-white" 
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">Email Address</Label>
                          <Input defaultValue={user?.email} disabled className="bg-navy border-white/10 text-white/50" />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">Phone Number</Label>
                          <Input 
                            value={profileData?.phone || ""} 
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            placeholder="+234 ..."
                            className="bg-navy border-white/10 text-white" 
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">Sex</Label>
                          <select 
                            value={profileData?.sex || ""}
                            onChange={(e) => setProfileData({...profileData, sex: e.target.value})}
                            className="w-full bg-navy border border-white/10 text-white h-10 rounded-md px-3 text-sm focus:outline-none"
                          >
                            <option value="" disabled>Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">Date of Birth</Label>
                          <Input 
                            type="date"
                            value={profileData?.date_of_birth ? new Date(profileData.date_of_birth).toISOString().split('T')[0] : ""} 
                            onChange={(e) => setProfileData({...profileData, date_of_birth: e.target.value})}
                            className="bg-navy border-white/10 text-white" 
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">Address</Label>
                          <Input 
                            value={profileData?.address || ""} 
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            placeholder="Residential Address"
                            className="bg-navy border-white/10 text-white" 
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">Your Class</Label>
                          <Input value={profileData?.class?.name || "No Class Assigned"} disabled className="bg-navy border-white/10 text-green font-bold" />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase font-bold">School</Label>
                          <Input value={profileData?.school?.name || "Lekki British School"} disabled className="bg-navy border-white/10 text-white/50" />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 flex justify-end">
                     <Button 
                          onClick={async () => {
                            try {
                              setLoading(true);
                              // Mandate: Use snake_case for Central Auth Service
                              const response = await api.patch("/user/profile", {
                                full_name: profileData.full_name,
                                phone: profileData.phone,
                                sex: profileData.sex,
                                date_of_birth: profileData.date_of_birth ? new Date(profileData.date_of_birth).toISOString() : null,
                                address: profileData.address,
                                avatar_url: profileData.avatar_url,
                              });

                              const updatedUser = response.data.user;
                              updateUser(updatedUser);

                              toast.success("Profile updated successfully");
                            } catch (error) {                              console.error("Error updating profile:", error);
                              toast.error("Failed to update profile");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold"
                     >                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                     </Button>
                  </div>
               </div>
            )}

            {activeTab === "security" && (
               <div className="space-y-8">
                  <div className="space-y-6">
                     <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
                     <div className="space-y-4 max-w-sm">
                        <div className="space-y-2">
                           <Label className="text-xs text-muted-foreground uppercase font-bold">Current Password</Label>
                           <Input 
                             type="password" 
                             placeholder="••••••••" 
                             value={passwordData.currentPassword}
                             onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                             className="bg-navy border-white/10 text-white" 
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-xs text-muted-foreground uppercase font-bold">New Password</Label>
                           <Input 
                             type="password" 
                             placeholder="••••••••" 
                             value={passwordData.newPassword}
                             onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                             className="bg-navy border-white/10 text-white" 
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-xs text-muted-foreground uppercase font-bold">Confirm New Password</Label>
                           <Input 
                             type="password" 
                             placeholder="••••••••" 
                             value={passwordData.confirmPassword}
                             onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                             className="bg-navy border-white/10 text-white" 
                           />
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                     <h3 className="text-lg font-bold text-white mb-4">Two-Factor Authentication</h3>
                     <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                           <Shield className="w-5 h-5 text-green" />
                           <div>
                              <div className="text-sm font-bold text-white">
                                 {user?.mfa_enabled ? "2FA is currently enabled" : "2FA is currently disabled"}
                              </div>
                              <div className="text-[10px] text-muted-foreground">Add an extra layer of security to your account.</div>
                           </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-[10px] font-bold h-8 border-white/10">
                           {user?.mfa_enabled ? "Disable" : "Enable"}
                        </Button>
                     </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                     <Button 
                       onClick={handleChangePassword}
                       disabled={loading}
                       className="bg-green-600 hover:bg-green-700 text-white font-bold"
                     >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Update Password
                     </Button>
                  </div>
               </div>
            )}

            {activeTab === "notifications" && (
               <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white mb-6">Notification Preferences</h3>
                  <div className="space-y-4">
                     {[
                        { label: "New Class Notes", desc: "Get notified when a teacher uploads new notes for your classes." },
                        { label: "Quiz Reminders", desc: "Weekly reminders for pending or practice quizzes." },
                        { label: "Performance Reports", desc: "Receive monthly summaries of your academic progress." },
                        { label: "School Announcements", desc: "Important updates from your school administration." },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                           <div className="max-w-[80%]">
                              <div className="text-sm font-bold text-white">{item.label}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                           </div>
                           <div className="w-10 h-5 bg-green rounded-full relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-navy rounded-full" />
                           </div>
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
