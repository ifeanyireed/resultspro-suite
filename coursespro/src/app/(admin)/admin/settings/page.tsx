'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { getTenantSlug } from '@/lib/api';
import { 
  CheckCircleIcon,
  CogIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [tenantId, setTenantId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coursesSettings, setCoursesSettings] = useState({
    enable_mentor_payouts: true,
    payout_model: 'BASE_PLUS_SLA',
    payout_config_json: '{}'
  });

  const { data: cSettings } = useQuery({
    queryKey: ['courses_settings'],
    queryFn: async () => {
      const res = await api.get('/api/admin/settings');
      return res.data;
    }
  });

  useEffect(() => {
    if (cSettings) {
      setCoursesSettings({
        enable_mentor_payouts: cSettings.enable_mentor_payouts,
        payout_model: cSettings.payout_model || 'BASE_PLUS_SLA',
        payout_config_json: cSettings.payout_config_json || '{}'
      });
    }
  }, [cSettings]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const darkFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDarkLogo, setUploadingDarkLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const previewFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLearner, setUploadingLearner] = useState(false);
  const learnerFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSlideshow, setUploadingSlideshow] = useState(false);
  const slideshowFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    slug: '',
    adminEmail: '',
    password: '',
    address: '',
    contactPerson: '',
    phone: '',
    plan: 'Pro Tier - Active',
    customDomainEnabled: false,
    customDomain: '',
    primaryColor: '#146ef5',
    secondaryColor: '#0D1060',
    accentColor: '#C0272D',
    heroUrl: '',
    previewUrl: '',
    learnerUrl: '',
    slideshowImages: '',
    logoUrl: '',
    darkLogoUrl: '',
    flattenLogo: true,
  });

const { data: tenantData, isLoading } = useQuery({
    queryKey: ['tenant_settings'],
    queryFn: async () => {
      const slug = getTenantSlug();
      const res = await api.get(`/api/public/tenant/resolve?domain=${slug}`);
      return res.data?.tenant;
    }
  });

  useEffect(() => {
    if (tenantData) {
      const t = tenantData;
      setTenantId(t.id);
      setFormData(prev => ({
        ...prev,
        name: t.name || '',
        shortName: t.short_name || t.motto || '',
        slug: t.slug || '',
        adminEmail: t.contact_email || '',
        password: '',
        address: t.full_address || '',
        contactPerson: t.contact_person_name || '',
        phone: t.contact_phone || '',
        plan: t.subscription_tier ? `${t.subscription_tier} - Active` : 'Free - Active',
        customDomainEnabled: !!t.custom_domain,
        customDomain: t.custom_domain || '',
        primaryColor: t.primary_color || '#146ef5',
        secondaryColor: t.secondary_color || '#0D1060',
        accentColor: t.accent_color || '#C0272D',
        logoUrl: t.logo_url || '',
        heroUrl: t.hero_bg_url || '',
        previewUrl: t.preview_image_url || '',
        learnerUrl: t.learner_image_url || '',
        slideshowImages: t.slideshow_images || '',
        darkLogoUrl: t.dark_logo_url || '',
        flattenLogo: t.flatten_logo !== false,
      }));
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [tenantData, isLoading]);

  const handleDarkLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDarkLogo(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'uploads/logos');
      const res = await api.post('/api/v1/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setFormData(prev => ({ ...prev, darkLogoUrl: res.data.url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload dark logo.");
    } finally {
      setUploadingDarkLogo(false);
    }
  };

  const handleLearnerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLearner(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'uploads/heroes');
      const res = await api.post('/api/v1/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setFormData(prev => ({ ...prev, learnerUrl: res.data.url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload learner portal image.");
    } finally {
      setUploadingLearner(false);
    }
  };

  const handlePreviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPreview(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'uploads/heroes');
      const res = await api.post('/api/v1/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setFormData(prev => ({ ...prev, previewUrl: res.data.url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload preview image.");
    } finally {
      setUploadingPreview(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'uploads/heroes');
      const res = await api.post('/api/v1/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setFormData(prev => ({ ...prev, heroUrl: res.data.url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload hero image.");
    } finally {
      setUploadingHero(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'uploads/logos');
      const res = await api.post('/api/v1/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setFormData(prev => ({ ...prev, logoUrl: res.data.url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSlideshowUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingSlideshow(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append('file', file);
        data.append('folder', 'uploads/slideshows');
        const res = await api.post('/api/v1/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data && res.data.url) {
          newUrls.push(res.data.url);
        }
      }
      
      if (newUrls.length > 0) {
        setFormData(prev => {
          const existing = prev.slideshowImages ? prev.slideshowImages.split(',').map(s => s.trim()).filter(Boolean) : [];
          return { ...prev, slideshowImages: [...existing, ...newUrls].join(', ') };
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload one or more slideshow images.");
    } finally {
      setUploadingSlideshow(false);
      if (slideshowFileInputRef.current) {
         slideshowFileInputRef.current.value = '';
      }
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!tenantId) return;
    setSaving(true);
    try {
      const payload: any = {
        name: formData.name,
        short_name: formData.shortName,
        slug: formData.slug,
        contact_email: formData.adminEmail,
        full_address: formData.address,
        contact_person_name: formData.contactPerson,
        contact_phone: formData.phone,
        custom_domain: formData.customDomainEnabled ? formData.customDomain : "",
        primary_color: formData.primaryColor,
        secondary_color: formData.secondaryColor,
        accent_color: formData.accentColor,
        logo_url: formData.logoUrl,
        hero_bg_url: formData.heroUrl,
        preview_image_url: formData.previewUrl,
        learner_image_url: formData.learnerUrl,
        slideshow_images: formData.slideshowImages,
        dark_logo_url: formData.darkLogoUrl,
        flatten_logo: formData.flattenLogo,
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }
      
      await api.patch(`/api/v1/tenants/update/${tenantId}`, payload);
      alert('Platform profile updated successfully!');
      if (formData.password) {
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      console.error("Failed to update tenant", err);
      alert('Failed to update platform profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading settings...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Platform & AI Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Super Admin configuration for BuilderOS.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#146ef5] hover:bg-[#105bd1] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Profile Settings (Spans full width on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BuildingOfficeIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Platform Profile</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academy Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Name / Motto</label>
                <input type="text" name="shortName" value={formData.shortName} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Slug (URL)</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#146ef5] transition-colors">
                  <span className="px-4 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">https://</span>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2.5 text-sm focus:outline-none" />
                  <span className="px-4 py-2.5 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">.resultspro.ng</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Domain</label>
                    <p className="text-xs text-gray-500">Use your own domain instead of .resultspro.ng</p>
                  </div>
                  <div 
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${formData.customDomainEnabled ? 'bg-[#146ef5]' : 'bg-gray-200'}`}
                    onClick={() => setFormData({...formData, customDomainEnabled: !formData.customDomainEnabled})}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${formData.customDomainEnabled ? 'right-1' : 'left-1 shadow-sm'}`}></div>
                  </div>
                </div>
                {formData.customDomainEnabled && (
                  <input 
                    type="text" 
                    name="customDomain" 
                    placeholder="e.g., academy.com"
                    value={formData.customDomain} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" 
                  />
                )}
              </div>
                            <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Logo (Primary)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="text-sm font-medium text-[#146ef5] hover:text-[#105bd1] transition-colors disabled:opacity-50"
                  >
                    {uploadingLogo ? 'Uploading...' : 'Upload primary logo'}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dark Background Logo (Optional)</label>
                <p className="text-xs text-gray-500 mb-3">Upload a white/bright version of your logo for dark backgrounds.</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-gray-200 bg-[#001f3f] flex items-center justify-center overflow-hidden">
                    {formData.darkLogoUrl ? (
                      <img src={formData.darkLogoUrl} alt="Dark Logo" className="w-full h-full object-contain" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-400 opacity-50" />
                    )}
                  </div>
                  <input type="file" ref={darkFileInputRef} className="hidden" accept="image/*" onChange={handleDarkLogoUpload} />
                  <button 
                    onClick={() => darkFileInputRef.current?.click()}
                    disabled={uploadingDarkLogo}
                    className="text-sm font-medium text-[#146ef5] hover:text-[#105bd1] transition-colors disabled:opacity-50"
                  >
                    {uploadingDarkLogo ? 'Uploading...' : 'Upload dark logo'}
                  </button>
                </div>

              <div className="pt-4 mt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Landing Page Hero Image</label>
                <p className="text-xs text-gray-500 mb-3">Upload a banner or illustration for your landing page.</p>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {formData.heroUrl ? (
                      <img src={formData.heroUrl} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input type="file" ref={heroFileInputRef} className="hidden" accept="image/*" onChange={handleHeroUpload} />
                  <button 
                    onClick={() => heroFileInputRef.current?.click()}
                    disabled={uploadingHero}
                    className="text-sm font-medium text-[#146ef5] hover:text-[#105bd1] transition-colors disabled:opacity-50"
                  >
                    {uploadingHero ? 'Uploading...' : 'Upload hero image'}
                  </button>
                </div>
              </div>
                
              <div className="pt-4 mt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard Preview Image</label>
                <p className="text-xs text-gray-500 mb-3">Upload the illustration shown next to your services grid.</p>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {formData.previewUrl ? (
                      <img src={formData.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input type="file" ref={previewFileInputRef} className="hidden" accept="image/*" onChange={handlePreviewUpload} />
                  <button 
                    onClick={() => previewFileInputRef.current?.click()}
                    disabled={uploadingPreview}
                    className="text-sm font-medium text-[#146ef5] hover:text-[#105bd1] transition-colors disabled:opacity-50"
                  >
                    {uploadingPreview ? 'Uploading...' : 'Upload preview image'}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Learner Portal Image</label>
                <p className="text-xs text-gray-500 mb-3">Upload the second illustration shown on the landing page.</p>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {formData.learnerUrl ? (
                      <img src={formData.learnerUrl} alt="Learner" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input type="file" ref={learnerFileInputRef} className="hidden" accept="image/*" onChange={handleLearnerUpload} />
                  <button 
                    onClick={() => learnerFileInputRef.current?.click()}
                    disabled={uploadingLearner}
                    className="text-sm font-medium text-[#146ef5] hover:text-[#105bd1] transition-colors disabled:opacity-50"
                  >
                    {uploadingLearner ? 'Uploading...' : 'Upload learner image'}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cohort Slideshow Images</label>
                <p className="text-xs text-gray-500 mb-3">Upload images or enter URLs (comma separated) to display a slideshow on the cohort enrollment page.</p>
                <div className="flex gap-3 items-start">
                  <input 
                    type="text" 
                    name="slideshowImages" 
                    value={formData.slideshowImages} 
                    onChange={handleChange} 
                    placeholder="e.g. @img01, @img02, https://url.com/img.jpg"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" 
                  />
                  <input type="file" ref={slideshowFileInputRef} className="hidden" accept="image/*" multiple onChange={handleSlideshowUpload} />
                  <button 
                    type="button"
                    onClick={() => slideshowFileInputRef.current?.click()}
                    disabled={uploadingSlideshow}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploadingSlideshow ? 'Uploading...' : 'Upload Images'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Flatten to white</p>
                    <p className="text-xs text-gray-500">Automatically make primary logo solid white on dark backgrounds if no dark logo is provided.</p>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.flattenLogo ? 'bg-[#146ef5]' : 'bg-gray-200'}`}
                    onClick={() => setFormData({...formData, flattenLogo: !formData.flattenLogo})}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.flattenLogo ? 'right-1' : 'left-1 shadow-sm'}`}></div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Primary Color</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer relative">
                    <input 
                      type="color" 
                      name="primaryColor" 
                      value={formData.primaryColor} 
                      onChange={handleChange} 
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" 
                    />
                  </div>
                  <input 
                    type="text" 
                    name="primaryColor" 
                    value={formData.primaryColor} 
                    onChange={handleChange} 
                    className="w-32 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#146ef5] transition-colors uppercase font-mono" 
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Secondary Color</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer relative">
                    <input 
                      type="color" 
                      name="secondaryColor" 
                      value={formData.secondaryColor} 
                      onChange={handleChange} 
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" 
                    />
                  </div>
                  <input 
                    type="text" 
                    name="secondaryColor" 
                    value={formData.secondaryColor} 
                    onChange={handleChange} 
                    className="w-32 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#146ef5] transition-colors uppercase font-mono" 
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer relative">
                    <input 
                      type="color" 
                      name="accentColor" 
                      value={formData.accentColor} 
                      onChange={handleChange} 
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" 
                    />
                  </div>
                  <input 
                    type="text" 
                    name="accentColor" 
                    value={formData.accentColor} 
                    onChange={handleChange} 
                    className="w-32 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#146ef5] transition-colors uppercase font-mono" 
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Public Contact Email</label>
                <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Admin Password</label>
                <input type="password" name="password" placeholder="Enter new password to change..." value={formData.password} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person & Public Phone</label>
                <div className="flex gap-3">
                  <input type="text" name="contactPerson" placeholder="Name" value={formData.contactPerson} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
                  <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Public HQ Address</label>
                <input type="text" name="address" placeholder="e.g., Lagos, Nigeria" value={formData.address} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Details</label>
                <input type="text" name="plan" value={formData.plan} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>
        </div>

        
        {/* Mentor Payout Config */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BanknotesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Mentor Earnings & Payouts</h3>
              <p className="text-xs text-gray-500">Configure how mentors are compensated for their cohorts.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Enable On-Platform Earnings</p>
                <p className="text-xs text-gray-500 mt-0.5">Toggle off if you handle payments off-platform.</p>
              </div>
              <div 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${coursesSettings.enable_mentor_payouts ? 'bg-[#146ef5]' : 'bg-gray-200'}`}
                onClick={() => setCoursesSettings({...coursesSettings, enable_mentor_payouts: !coursesSettings.enable_mentor_payouts})}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${coursesSettings.enable_mentor_payouts ? 'right-1' : 'left-1 shadow-sm'}`}></div>
              </div>
            </div>
            
            {coursesSettings.enable_mentor_payouts && (
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Earning Model</label>
                <select 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] bg-gray-50/50"
                  value={coursesSettings.payout_model}
                  onChange={e => setCoursesSettings({...coursesSettings, payout_model: e.target.value})}
                >
                  <option value="BASE_PLUS_SLA">Base + SLA Bonus (Recommended)</option>
                  <option value="PAY_PER_ACTION">Pay-Per-Action (Granular)</option>
                  <option value="REVENUE_SHARE">Revenue Share</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {coursesSettings.payout_model === 'BASE_PLUS_SLA' && 'Mentors get a fixed base pay per cohort, plus bonuses for fast reviews.'}
                  {coursesSettings.payout_model === 'PAY_PER_ACTION' && 'Mentors are paid a small fee per submission reviewed and per live class held.'}
                  {coursesSettings.payout_model === 'REVENUE_SHARE' && 'Mentors earn a percentage of the total tuition paid by students in their cohort.'}
                </p>
              </div>
            )}
          </div>
        </div>


        {/* AI Config */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">AI Features</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Quiz & Assignment Generator</p>
                <p className="text-xs text-gray-500 mt-0.5">Enable AI to auto-generate quizzes for modules.</p>
              </div>
              <div className="w-12 h-6 bg-[#146ef5] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Mentor AI Assistant</p>
                <p className="text-xs text-gray-500 mt-0.5">Surface risk alerts to mentors based on student activity.</p>
              </div>
              <div className="w-12 h-6 bg-[#146ef5] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">AI Cost Monitoring limit</p>
                <p className="text-xs text-gray-500 mt-0.5">Pause generation when monthly token limit is reached.</p>
              </div>
              <input type="text" value="₦50,000 / mo" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 text-center" readOnly />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
              <CogIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Platform Permissions</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Allow Open Registration</p>
                <p className="text-xs text-gray-500 mt-0.5">Students can join waitlist without invitation.</p>
              </div>
              <div className="w-12 h-6 bg-[#146ef5] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Enforce Hard Deadlines</p>
                <p className="text-xs text-gray-500 mt-0.5">Prevent project submission after due date.</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
