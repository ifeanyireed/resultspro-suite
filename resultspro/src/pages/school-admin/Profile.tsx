import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'http://localhost:5000/api';

interface SchoolProfile {
  name: string;
  motto?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  contactEmail: string;
  contactPhone?: string;
  contactPersonName?: string;
  altContactEmail?: string;
  altContactPhone?: string;
  fullAddress?: string;
  state?: string;
  lga?: string;
}

const Profile: React.FC = () => {
  const [schoolData, setSchoolData] = useState<SchoolProfile | null>(null);
  const [formData, setFormData] = useState<SchoolProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        const schoolId = localStorage.getItem('schoolId');

        if (!schoolId || !token) {
          setErrorMessage('School information not found. Please log in again.');
          return;
        }

        const response = await axios.get(`${API_BASE}/onboarding/school/${schoolId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success && response.data?.data) {
          const data = response.data.data;
          setSchoolData(data);
          setFormData(data);
          setLogoUrl(data.logoUrl);
        }
      } catch (error: any) {
        console.error('Error loading school data:', error);
        setErrorMessage(
          error?.response?.data?.error || 'Failed to load school information'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSchoolData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      const updated = { ...formData, [name]: value };
      setFormData(updated);
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(schoolData));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = localStorage.getItem('authToken');

      const response = await axios.patch(
        `${API_BASE}/onboarding/school-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setSchoolData(formData);
        setHasChanges(false);
        setSuccessMessage('School profile updated successfully!');
        toast({
          title: 'Success',
          description: 'Your school profile has been updated.',
        });

        // Update localStorage
        localStorage.setItem('schoolName', formData?.name || '');
        localStorage.setItem('schoolMotto', formData?.motto || '');
      }
    } catch (error: any) {
      console.error('Error saving school data:', error);
      const errorMsg =
        error?.response?.data?.error || 'Failed to update school profile';
      setErrorMessage(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(schoolData);
    setHasChanges(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Logo file must be smaller than 5MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'].includes(file.type)) {
        setErrorMessage('Only JPEG, PNG, WebP, GIF, and SVG images are allowed');
        return;
      }

      setIsUploadingLogo(true);
      setErrorMessage(null);

      const token = localStorage.getItem('authToken');
      const formDataObj = new FormData();
      formDataObj.append('file', file);

      const response = await axios.post(`${API_BASE}/onboarding/logo-upload`, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.s3Url) {
        setLogoUrl(response.data.s3Url);
        
        // Update school with new logo URL
        await axios.patch(
          `${API_BASE}/onboarding/school-profile`,
          { logoUrl: response.data.s3Url },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSuccessMessage('Logo uploaded successfully!');
        toast({
          title: 'Success',
          description: 'Logo has been updated.',
        });
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      const errorMsg =
        error?.response?.data?.error || 'Failed to upload logo';
      setErrorMessage(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('All password fields are required');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters');
        return;
      }

      setIsChangingPassword(true);
      setPasswordError('');
      setPasswordSuccess('');

      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        `${API_BASE}/auth/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordSuccess('Password changed successfully!');
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess('');
        }, 2000);
        toast({
          title: 'Success',
          description: 'Your password has been updated.',
        });
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      const errorMsg =
        error?.response?.data?.message || 'Failed to change password';
      setPasswordError(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">School Profile</h1>
          <p className="text-gray-400">Manage your school information</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">School Profile</h1>
        <p className="text-gray-400">
          Edit your school information including contact details, branding, and location
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex gap-3">
          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}

      {formData && (
        <form className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  School Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  disabled
                  placeholder="Enter school name"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500 opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-2">School name cannot be changed after registration</p>
              </div>

              <div>
                <Label htmlFor="motto" className="text-gray-300">
                  School Motto
                </Label>
                <Input
                  id="motto"
                  name="motto"
                  type="text"
                  value={formData.motto || ''}
                  onChange={handleInputChange}
                  placeholder="Enter school motto"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactEmail" className="text-gray-300">
                  Primary Email *
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  disabled
                  placeholder="Enter primary email"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500 opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-2">Primary email cannot be changed after registration</p>
              </div>

              <div>
                <Label htmlFor="contactPhone" className="text-gray-300">
                  Primary Phone
                </Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter primary phone"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="contactPersonName" className="text-gray-300">
                  Contact Person Name
                </Label>
                <Input
                  id="contactPersonName"
                  name="contactPersonName"
                  type="text"
                  value={formData.contactPersonName || ''}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="altContactEmail" className="text-gray-300">
                  Alternative Email
                </Label>
                <Input
                  id="altContactEmail"
                  name="altContactEmail"
                  type="email"
                  value={formData.altContactEmail || ''}
                  onChange={handleInputChange}
                  placeholder="Enter alternative email"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="altContactPhone" className="text-gray-300">
                  Alternative Phone
                </Label>
                <Input
                  id="altContactPhone"
                  name="altContactPhone"
                  type="tel"
                  value={formData.altContactPhone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter alternative phone"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Location</h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="fullAddress" className="text-gray-300">
                  Full Address
                </Label>
                <Textarea
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress || ''}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows={3}
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="state" className="text-gray-300">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="lga" className="text-gray-300">
                    Local Government Area (LGA)
                  </Label>
                  <Input
                    id="lga"
                    name="lga"
                    type="text"
                    value={formData.lga || ''}
                    onChange={handleInputChange}
                    placeholder="Enter LGA"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Branding</h2>

            <div className="grid grid-cols-1 gap-6">
              {/* Logo Upload */}
              <div>
                <Label className="text-gray-300 mb-4 block">School Logo</Label>
                <div className="space-y-4">
                  {logoUrl && (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <img
                        src={logoUrl}
                        alt="School Logo"
                        className="h-16 w-16 object-contain rounded"
                      />
                      <div>
                        <p className="text-sm text-gray-300">Current logo</p>
                        <p className="text-xs text-gray-500 mt-1 break-all">{logoUrl.substring(0, 50)}...</p>
                      </div>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-white/40 transition">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={isUploadingLogo}
                        className="hidden"
                      />
                      <div className="text-center">
                        <p className="text-sm text-gray-300">
                          {isUploadingLogo ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP, GIF, or SVG (max 5MB)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <Label htmlFor="primaryColor" className="text-gray-300">
                  Primary Color
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="text"
                    value={formData.primaryColor || ''}
                    onChange={handleInputChange}
                    placeholder="#000000"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                  <div
                    className="w-12 h-10 rounded border border-white/20"
                    style={{
                      backgroundColor: formData.primaryColor || '#000000',
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor" className="text-gray-300">
                  Secondary Color
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="text"
                    value={formData.secondaryColor || ''}
                    onChange={handleInputChange}
                    placeholder="#000000"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                  <div
                    className="w-12 h-10 rounded border border-white/20"
                    style={{
                      backgroundColor: formData.secondaryColor || '#000000',
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor" className="text-gray-300">
                  Accent Color
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="accentColor"
                    name="accentColor"
                    type="text"
                    value={formData.accentColor || ''}
                    onChange={handleInputChange}
                    placeholder="#000000"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                  <div
                    className="w-12 h-10 rounded border border-white/20"
                    style={{
                      backgroundColor: formData.accentColor || '#000000',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Security</h3>
              {!showPasswordForm && (
                <Button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(true);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Change Password
                </Button>
              )}
            </div>

            {showPasswordForm && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="oldPassword" className="text-gray-300">
                      Current Password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="oldPassword"
                        name="oldPassword"
                        type={showOldPassword ? 'text' : 'password'}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            oldPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-gray-300">
                      New Password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password (min 8 characters)"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">• At least 8 characters • Mix of uppercase and lowercase</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">
                      Confirm New Password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded text-sm">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    >
                      {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          oldPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setPasswordError('');
                        setPasswordSuccess('');
                      }}
                      variant="outline"
                      className="bg-transparent border-white/20 text-gray-300 hover:bg-white/5 flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={!hasChanges || isSaving}
              className="bg-transparent border-white/20 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
