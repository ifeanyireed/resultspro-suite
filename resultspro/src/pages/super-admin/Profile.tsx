import React from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';

const AdminProfile: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Admin Profile</h1>
        <p className="text-gray-400">Manage your super admin account settings</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[20px] p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <p className="text-white">
              {user.email || 'Not available'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
            <p className="text-white">
              {user.role ? user.role.replace(/_/g, ' ') : 'Not available'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Account Status</label>
            <p className="text-white">Active</p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400">
              For additional admin profile settings, please visit Settings.
            </p>
          </div>
        </div>
      </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminProfile;
