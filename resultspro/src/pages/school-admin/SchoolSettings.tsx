import React, { useState, useEffect, useRef } from 'react';
import { IconSave as Save, IconCopy as Copy, IconCheck as Check, IconExternalLink as ExternalLink, IconUpload as Upload, IconX as X, IconPalette as Palette } from '@tabler/icons-react';
import axiosInstance from '@/lib/axiosConfig';
import { toast } from '@/hooks/use-toast';

const SchoolSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: '',
    registrationNumber: '', // mapped to motto
    schoolCode: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '', // mapped to lga
    state: '',
    country: 'Nigeria',
    slug: '',
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#60A5FA',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const schoolId = localStorage.getItem('schoolId');

  useEffect(() => {
    fetchSettings();
  }, [schoolId]);

  const fetchSettings = async () => {
    if (!schoolId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/onboarding/school/${schoolId}`);
      if (response.data.success) {
        const data = response.data.data;
        setSettings({
          schoolName: data.name || '',
          registrationNumber: data.motto || '',
          schoolCode: data.schoolCode || '',
          phone: data.contactPhone || '',
          email: data.contactEmail || '',
          website: '', 
          address: data.fullAddress || '',
          city: data.lga || '',
          state: data.state || '',
          country: 'Nigeria',
          slug: data.slug || '',
          logoUrl: data.logoUrl || '',
          primaryColor: data.primaryColor || '#3B82F6',
          secondaryColor: data.secondaryColor || '#1E40AF',
          accentColor: data.accentColor || '#60A5FA',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch school settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!schoolId) return;
    try {
      setSaving(true);
      const response = await axiosInstance.patch('/onboarding/school-profile', {
        name: settings.schoolName,
        motto: settings.registrationNumber,
        schoolCode: settings.schoolCode,
        contactPhone: settings.phone,
        contactEmail: settings.email,
        fullAddress: settings.address,
        lga: settings.city,
        state: settings.state,
        logoUrl: settings.logoUrl,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        accentColor: settings.accentColor,
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'School settings updated successfully',
        });
        // Update localStorage
        const schoolData = JSON.parse(localStorage.getItem('schoolData') || '{}');
        localStorage.setItem('schoolData', JSON.stringify({ ...schoolData, ...response.data.data }));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save school settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'File size must be less than 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/onboarding/logo-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.s3Url) {
        setSettings({ ...settings, logoUrl: response.data.s3Url });
        toast({ title: 'Success', description: 'Logo uploaded successfully' });
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      toast({ title: 'Upload failed', description: 'Failed to upload logo', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setSettings({ ...settings, logoUrl: '' });
  };

  const resultCheckerLink = `${window.location.origin}/check-results/${settings.slug || schoolId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultCheckerLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Link copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">School Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage school profile and general settings</p>
      </div>

      {/* Result Checker Link Section */}
      <div className="bg-[rgba(59,130,246,0.1)] rounded-[30px] border border-blue-500/20 p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Result Checker Page Link</h3>
        <p className="text-gray-400 text-sm mb-6">Share this unique link with students and parents so they can check their results directly.</p>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-blue-300 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
            {resultCheckerLink}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
            <a 
              href={`/check-results/${settings.slug || schoolId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl text-blue-400 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Page
            </a>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
        <h3 className="text-lg font-semibold text-white mb-6">School Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">School Name</label>
            <input
              type="text"
              value={settings.schoolName}
              onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">School Code (for /results lookup)</label>
            <input
              type="text"
              value={settings.schoolCode}
              onChange={(e) => setSettings({ ...settings, schoolCode: e.target.value.toUpperCase() })}
              placeholder="e.g. EXCELLENCE-001"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400 uppercase font-mono"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Registration Number / Motto</label>
            <input
              type="text"
              value={settings.registrationNumber}
              onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm font-medium mb-2">Street Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">City / LGA</label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">State</label>
            <input
              type="text"
              value={settings.state}
              onChange={(e) => setSettings({ ...settings, state: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={settings.country}
              readOnly
              className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-4">School Logo</label>
            {settings.logoUrl ? (
              <div className="relative inline-block group">
                <img src={settings.logoUrl} alt="School Logo" className="h-32 w-32 object-contain rounded-xl bg-white/5 p-2 border border-white/10" />
                <button 
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-32 w-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400/50 hover:bg-blue-500/5 transition-all group"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-500 group-hover:text-blue-400 mb-2" />
                    <span className="text-xs text-gray-500 group-hover:text-blue-400 text-center px-2">Upload Logo</span>
                  </>
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
            <p className="text-gray-500 text-xs mt-3">Recommended: Square PNG or SVG, max 5MB.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
                <Palette className="w-4 h-4 text-blue-400" />
                Primary Brand Color
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input 
                    type="color" 
                    value={settings.primaryColor} 
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-16 h-12 rounded-xl bg-white/5 border border-white/10 cursor-pointer p-1" 
                  />
                </div>
                <div className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm uppercase">
                  {settings.primaryColor}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={settings.secondaryColor} 
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 cursor-pointer p-1" 
                  />
                  <span className="text-xs text-gray-500 font-mono uppercase">{settings.secondaryColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={settings.accentColor} 
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 cursor-pointer p-1" 
                  />
                  <span className="text-xs text-gray-500 font-mono uppercase">{settings.accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
        <button 
          onClick={() => fetchSettings()}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default SchoolSettings;
