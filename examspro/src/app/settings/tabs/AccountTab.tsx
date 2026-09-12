import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api, { USERS_API } from '@/lib/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IconLoader2, IconCamera } from '@tabler/icons-react';
import Image from 'next/image';
import { useRef } from 'react';

export default function AccountTab() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || (user as any)?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuthStore();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await axios.post(`${USERS_API}/api/v1/auth/avatar`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAvatarUrl(res.data.avatarUrl);
      updateUser({ avatarUrl: res.data.avatarUrl, avatar: res.data.avatarUrl } as any);
      toast.success('Avatar uploaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/user/profile', { name, phone });
      updateUser({ name }); // Update global store so the top navbar updates instantly!
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
        
        <div className="mb-8 flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
              {avatarUrl ? (
                <img src={avatarUrl.startsWith('http') ? avatarUrl : USERS_API + avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                  {name ? name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              {isUploading ? <IconLoader2 className="w-4 h-4 animate-spin" /> : <IconCamera className="w-4 h-4" />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              className="hidden" 
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Profile Picture</h3>
            <p className="text-sm text-slate-500 mt-1">Upload a JPG, PNG or WebP image. Max size 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</Label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</Label>
            <Input 
              value={email}
              disabled
              className="bg-slate-100 border-slate-200 h-12 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</Label>
            <Input 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#146ef5] text-white hover:bg-blue-700 rounded-xl px-8 h-12 font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving && <IconLoader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
