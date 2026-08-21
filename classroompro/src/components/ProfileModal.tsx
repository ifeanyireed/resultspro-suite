"use client";

import { useState, useEffect, useRef } from "react";
import { IconUser as UserIcon, IconLock as Lock, IconShield as Shield, IconCamera as Camera, IconDeviceFloppy as Save, IconLoader2 as Loader2, IconX as X, IconPhone as Phone, IconMail as Mail, IconCalendar as Calendar, IconMapPin as MapPin, IconCircleCheck as CheckCircle2 } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    sex: user?.sex || "",
    date_of_birth: user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : "",
    address: user?.address || "",
    avatar_url: user?.avatar_url || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string; qr_code: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        sex: user.sex || "",
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : "",
        address: user.address || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("avatar", file);

    setLoading(true);
    try {
      const response = await api.post("/user/upload-avatar", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const newAvatarUrl = response.data.url;
      setFormData(prev => ({ ...prev, avatar_url: newAvatarUrl }));
      
      // Update immediately on Central Auth
      await api.patch("/user/profile", {
        avatar_url: newAvatarUrl
      });
      
      updateUser({ avatar_url: newAvatarUrl });
      toast.success("Avatar updated successfully");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      const errorMessage = error.response?.data?.details || error.message || "Failed to upload avatar";
      console.error("S3 Upload Failure Details:", errorMessage);
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Mandate: Use snake_case for Central Auth Service
      await api.patch("/user/profile", {
        full_name: formData.full_name,
        phone: formData.phone,
        sex: formData.sex,
        date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null,
        address: formData.address,
        avatar_url: formData.avatar_url,
      });
      
      updateUser(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaEnable = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/mfa/setup");
      console.log("MFA Setup Data Received:", res.data);
      setMfaSetupData(res.data);
      toast.success("MFA setup initiated. Please scan the QR code.");
    } catch (error) {
      console.error("Error setting up MFA:", error);
      toast.error("Failed to initiate MFA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/mfa/verify", { code: mfaCode });
      updateUser({ mfa_enabled: true });
      setMfaSetupData(null);
      setMfaCode("");
      toast.success("MFA enabled successfully");
    } catch (error) {
      console.error("Error verifying MFA:", error);
      toast.error("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaDisable = async () => {
    setLoading(true);
    try {
      await api.post("/auth/mfa/disable");
      updateUser({ mfa_enabled: false });
      toast.success("MFA disabled successfully");
    } catch (error) {
      console.error("Error disabling MFA:", error);
      toast.error("Failed to disable MFA");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <UserIcon className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
      <div className="bg-navy border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green/20 flex items-center justify-center text-green">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">User Profile</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{user?.role?.replace('_', ' ')} Account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-muted-foreground hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2",
                activeTab === tab.id 
                  ? "border-green text-green bg-green/5" 
                  : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[32px] bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden font-bold text-3xl text-green">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.full_name?.[0] || "U"
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{user?.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Full Name
                  </Label>
                  <Input 
                    value={formData.full_name} 
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email Address
                  </Label>
                  <Input 
                    value={user?.email} 
                    disabled 
                    className="bg-white/5 border-white/10 text-white/50 h-12 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Phone Number
                  </Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+234 ..."
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Sex
                  </Label>
                  <select 
                    value={formData.sex}
                    onChange={(e) => setFormData({...formData, sex: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white h-12 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green/50"
                  >
                    <option value="" disabled className="bg-navy">Select Sex</option>
                    <option value="Male" className="bg-navy">Male</option>
                    <option value="Female" className="bg-navy">Female</option>
                    <option value="Other" className="bg-navy">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </Label>
                  <Input 
                    type="date"
                    value={formData.date_of_birth} 
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Address
                  </Label>
                  <Input 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Residential Address"
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green" /> Change Password
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase font-bold">Current Password</Label>
                    <Input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="••••••••" 
                      className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase font-bold">New Password</Label>
                      <Input 
                        type="password" 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="••••••••" 
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase font-bold">Confirm New Password</Label>
                      <Input 
                        type="password" 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="••••••••" 
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl" 
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                  </Button>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green" /> Two-Factor Authentication
                </h3>
                
                {mfaSetupData ? (
                  <div className="space-y-6 p-6 rounded-2xl bg-white/5 border border-green/20 animate-in fade-in zoom-in duration-300">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="bg-white p-3 rounded-2xl shadow-xl shadow-green/10">
                        {(() => {
                          const qrData = mfaSetupData.qr_code || 
                                       (mfaSetupData as any).qrCode || 
                                       (mfaSetupData as any).qr ||
                                       (mfaSetupData as any).image;
                                       
                          const otpauthUrl = (mfaSetupData as any).url ||
                                            (mfaSetupData as any).otpauth_url || 
                                            (mfaSetupData as any).otpauthUrl ||
                                            (mfaSetupData as any).totp_url ||
                                            (mfaSetupData as any).totpUrl;
                                       
                          if (!qrData && !otpauthUrl) return <div className="w-32 h-32 flex items-center justify-center text-[10px] text-navy/50 text-center px-2">QR Code Data Missing</div>;
                          
                          let src = "";
                          if (qrData) {
                            if (qrData.startsWith('http')) {
                              src = qrData;
                            } else if (qrData.startsWith('data:')) {
                              src = qrData;
                            } else {
                              src = `data:image/png;base64,${qrData}`;
                            }
                          } else if (otpauthUrl) {
                            // Use public QR code generator for otpauth URLs
                            src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(otpauthUrl)}&size=200x200&bgcolor=ffffff`;
                          }

                          return (
                            <img 
                              src={src} 
                              alt="MFA QR Code" 
                              className="w-32 h-32" 
                            />
                          );
                        })()}
                      </div>
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <h4 className="font-bold text-white">Setup MFA</h4>
                        <p className="text-xs text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.), then enter the 6-digit code below.</p>
                        <div className="pt-2">
                          <code className="text-[10px] bg-white/10 px-2 py-1 rounded text-green font-mono">Secret: {mfaSetupData.secret}</code>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <Label className="text-white text-center block font-bold uppercase tracking-widest text-[10px]">Verification Code</Label>
                      <div className="flex justify-center">
                        <Input 
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="000000"
                          maxLength={6}
                          style={{
                            fontSize: 'min(10vw, 40px)', 
                            height: '80px'
                          }}
                          className="w-full bg-white/5 border-white/10 text-white text-center tracking-[0.1em] placeholder:tracking-[0.1em] font-medium focus:border-green/50 focus:ring-green/50 rounded-2xl"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handleMfaVerify}
                        disabled={loading || mfaCode.length !== 6}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl text-lg w-full"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Enable 2FA"}
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          setMfaSetupData(null);
                          setMfaCode("");
                        }}
                        className="text-white hover:bg-white/10 h-10 rounded-xl text-xs font-bold"
                      >
                        Cancel Setup
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-white">
                        {user?.mfa_enabled ? (
                          <span className="flex items-center gap-2 text-green"><CheckCircle2 className="w-4 h-4" /> 2FA is enabled</span>
                        ) : "2FA is currently disabled"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account.</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={user?.mfa_enabled ? handleMfaDisable : handleMfaEnable}
                      disabled={loading}
                      className="font-bold h-10 border-white/10 rounded-xl px-6"
                    >
                      {user?.mfa_enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "profile" && (
          <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5">
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10 rounded-xl px-6 font-bold h-12">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-8 h-12 min-w-[140px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
