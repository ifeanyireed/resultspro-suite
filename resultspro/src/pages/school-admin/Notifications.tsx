import React from 'react';
import { Bell } from '@/lib/hugeicons-compat';

const Notifications: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-gray-400">Stay updated with important system notifications</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[20px] p-12 flex flex-col items-center justify-center min-h-96">
        <Bell size={48} className="text-gray-600 mb-4" strokeWidth={1} />
        <h3 className="text-lg font-semibold text-white mb-2">No Notifications</h3>
        <p className="text-gray-400 text-center max-w-md">
          You're all caught up! Notifications about important system events will appear here.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[20px] p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
        <p className="text-sm text-gray-400">
          Notification settings can be configured in the Settings page.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
