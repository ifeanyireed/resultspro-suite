import React from 'react';
import { Switch } from '@/components/ui/switch';

export default function PreferencesTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications & Display</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div>
              <div className="font-bold text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive weekly progress reports and battle challenges.</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div>
              <div className="font-bold text-gray-900">Push Notifications</div>
              <div className="text-sm text-gray-500">Get instantly notified when you're invited to a Live Game.</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div>
              <div className="font-bold text-gray-900">Sound Effects</div>
              <div className="text-sm text-gray-500">Play sounds during battle mode and quizzes.</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
