# Central Auth Service Intelligence

## Purpose
Specialized guidance for integrating with the Central Auth Service (`auth.resultspro.ng`) within the `ClassroomPRO, TutorsPRO, ExamsPRO, ResultsPRO` ecosystem.

## Core Mandates

### 1. Identity vs. Authorization
- **Identification (Central):** `auth.resultspro.ng` is the **Source of Truth** for identity fields: `email`, `full_name`, `avatar_url`, and `account_status`.
- **Authorization (Local):** `ClassroomPRO, TutorsPRO, ExamsPRO, ResultsPRO` is the **Source of Truth** for application roles (`SUPERADMIN`, `TEACHER`, `STUDENT`, etc.) and school/class affiliations.

### 2. Local User Model Constraints
- **Relational Anchor:** The local `User` model in `backend/prisma/schema.prisma` must exist for every user but should only store the `id` (matching the Central ID) and local metadata (`role`, `schoolId`, `classId`).
- **No Identity Duplication:** Do NOT store or update identity fields (names, emails) in the local database. Always fetch or proxy these from the central service.

### 3. API Interaction
- **Headers:** Use `X-App-ID` and `X-App-Secret` (stored in `.env`) for all service-to-service calls to `auth.resultspro.ng`.
- **Fetch Patterns:**
  - Use `auth.FetchUserProfile(id)` to retrieve a single user's identity.
  - Use `auth.FetchUserProfiles([]ids)` for batch fetching (e.g., lists, dashboards).
- **Transient Data:** Identity fields retrieved from the central service should be treated as transient. When returning user data to the frontend, merge the local `User` object with the data from the `CentralUser` profile.

### 4. Codebase Reference
- **Auth Package:** `backend/auth/central.go` contains the implementation for communicating with the central service.
- **Handlers:** See `backend/handlers/auth.go` for the reference implementation of the `Me` endpoint merging local and central data.

### 5. Profile & Metadata Synchronization
- **Snake Case Mandate:** All payload fields sent to Central Auth (e.g., PATCH `/user/profile`) AND all identity fields in JSON responses (e.g., `Login`, `Me`) MUST use `snake_case` (e.g., `full_name`, `avatar_url`, `mfa_enabled`, `account_status`).
- **Dual Update Pattern:** When updating profile metadata, the update must be proxied to the Central Auth Service first. If successful, the corresponding fields should be mirrored in the local database to support local application logic and performance. Ensure the backend unmarshals the `snake_case` body correctly before updating the local DB.
- **Avatar Management (AWS S3):** 
  - User avatars are stored in an AWS S3 bucket.
  - The backend provides a `/user/upload-avatar` endpoint that uploads the file to S3 and returns a public URL.
  - **Permission Mandate:** Do NOT set ACLs (like `public-read`) in the backend code during upload, as modern S3 buckets use "Bucket owner enforced" settings that disable ACLs. Instead, rely on a **Bucket Policy** to make the `avatars/` prefix publicly readable.

### 6. MFA Integration (TOTP)
- **Setup Flow:** The Central Auth Service returns the setup URI in a field named `url`.
- **QR Generation:** If the service returns an `otpauth://` URI instead of a raw image, the frontend must generate the QR code client-side or use a public generator API (e.g., `api.qrserver.com`).
- **Login Requirement:** When `mfa_required: true` is returned during login, the frontend must intercept the flow and prompt for a 6-digit TOTP code before finalizing authentication via `/auth/mfa/challenge`.

### 7. Pagination Standard
To ensure platform scalability and a premium user experience, all lists (Topics, Users, Activity, etc.) MUST implement the following pagination pattern:
- **State Management:** Use `currentPage` (number) and `itemsPerPage` (string) states.
- **Dynamic Slicing:** Use `useMemo` to slice the filtered data subset for the active page.
- **Smart UI:** Implement a pagination footer that includes:
  - An "Items per page" selector (10, 25, 50).
  - Next/Previous buttons.
  - Page number chips with "Smart Ellipsis" logic for large datasets (e.g., `1 ... 4 5 6 ... 12`).
  - Clear status text (e.g., "Page 1 of 5" or "Showing 1-10 of 124").
- **Automatic Reset:** Always reset `currentPage` to 1 whenever search queries or filters change.

---

## Required Auth Service Fields (Reference)

Developers MUST ensure all sub-apps align their internal models and API payloads with these types:

```go
type User struct {
	ID            string     `json:"id"`
	Email         string     `json:"email"`
	PasswordHash  *string    `json:"-"`
	GoogleID      *string    `json:"google_id,omitempty"`
	MicrosoftID   *string    `json:"microsoft_id,omitempty"`
	AuthProvider  string     `json:"auth_provider"`
	FullName      *string    `json:"full_name"`
	AvatarURL     *string    `json:"avatar_url"`
	Phone         *string    `json:"phone,omitempty"`
	Sex           *string    `json:"sex,omitempty"`
	DateOfBirth   *time.Time `json:"date_of_birth,omitempty"`
	Address       *string    `json:"address,omitempty"`
	AccountStatus string     `json:"account_status"`
	MFAEnabled    bool       `json:"mfa_enabled"`
	MFASecret     *string    `json:"-"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

type VerificationToken struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	TokenHash string    `json:"-"`
	Type      string    `json:"type"`
	ExpiresAt time.Time `json:"expires_at"`
	Used      bool      `json:"used"`
}

type RefreshToken struct {
	ID         string    `json:"id"`
	UserID     string    `json:"user_id"`
	TokenHash  string    `json:"-"`
	DeviceInfo *string   `json:"device_info"`
	ExpiresAt  time.Time `json:"expires_at"`
	Revoked    bool      `json:"revoked"`
	CreatedAt  time.Time `json:"created_at"`
}
```

---

## Reference Implementation: User Profile (Frontend)

The following code provides a robust implementation of the User Profile Modal, including S3 avatar uploads and multi-step MFA setup. **This logic MUST be implemented identically in any sub-application across all user types (Student, Teacher, Admin, etc.) to ensure a unified identity experience.**

### `ProfileModal.tsx`

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User as UserIcon, 
  Lock, 
  Shield, 
  Camera, 
  Save, 
  Loader2,
  X,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CheckCircle2
} from "lucide-react";
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

  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string; qr_code: string; url?: string } | null>(null);
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
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{user?.role.replace('_', ' ')} Account</p>
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
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-green text-navy flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
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
                    className="bg-green hover:bg-green/90 text-navy font-bold h-12 rounded-xl mt-2"
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
                                       
                          const otpauthUrl = mfaSetupData.url ||
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
                        className="bg-green hover:bg-green/90 text-navy font-bold h-12 rounded-xl text-lg w-full"
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
              className="bg-green hover:bg-green/90 text-navy font-bold rounded-xl px-8 h-12 min-w-[140px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```
