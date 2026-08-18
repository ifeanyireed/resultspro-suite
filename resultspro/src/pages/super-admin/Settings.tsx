import React, { useState } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Save, AlertCircle } from '@/lib/hugeicons-compat';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    platformName: 'Results Pro',
    supportEmail: 'support@resultspro.ng',
    maxUploadSize: '100',
    sessionTimeout: '30',
    maintenanceMode: false,
    emailNotifications: true,
    twoFactorAuth: false
  });

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold mb-2">System Settings</h1>
          <p className="text-gray-400">Configure platform-wide settings and preferences</p>
        </div>

        {/* General Settings */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-all duration-300">
          <h2 className="text-xl font-bold mb-6">General Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleChange('maxUploadSize', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-all duration-300">
          <h2 className="text-xl font-bold mb-6">Feature Flags</h2>
          <div className="space-y-4">
            {[
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put platform in maintenance mode' },
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications to users' },
              { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Require 2FA for all accounts' }
            ].map((flag) => (
              <div key={flag.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium text-white">{flag.label}</p>
                  <p className="text-sm text-gray-400">{flag.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[flag.key as keyof typeof settings] as boolean}
                    onChange={(e) => handleChange(flag.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
          <button className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">
            Reset to Default
          </button>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SystemSettings;