'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Settings, Shield, Server, Database, Key, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Global Suite Configuration"
        subtitle="Ecosystem secrets, token expiration intervals, and central microservice gateways"
      />

      <div className="p-8 space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Database & ORM Hub */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Central MySQL Database (GORM)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Database Host</label>
                <input
                  type="text"
                  disabled
                  value="srv2113.hstgr.io:3306"
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 font-mono text-slate-700"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Database Name</label>
                <input
                  type="text"
                  disabled
                  value="u721451974_resultspro_db"
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 font-mono text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Microservice Routing Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>Microservice Service Endpoints</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Users & Identity Service (Go)</label>
                <input
                  type="text"
                  defaultValue="http://localhost:7000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">ResultPRO Service (Go)</label>
                <input
                  type="text"
                  defaultValue="http://localhost:5000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">examsPRO CBT Service (Go)</label>
                <input
                  type="text"
                  defaultValue="http://localhost:8080"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">ClassroomPRO Service (Go)</label>
                <input
                  type="text"
                  defaultValue="http://localhost:8080"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Security & Token Policy */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Shield className="w-5 h-5 text-purple-600" />
              <span>Security & Token Rotation Policies</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Access Token Expiry (Hours)</label>
                <input
                  type="number"
                  defaultValue={24}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Refresh Token Expiry (Days)</label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Max Login Attempts Before Lockout</label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {saved ? (
              <span className="text-emerald-700 text-xs font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configuration changes saved successfully!</span>
              </span>
            ) : <span></span>}
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
