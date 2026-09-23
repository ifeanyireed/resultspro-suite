"use client";
import React from 'react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account, billing, and platform preferences.</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" defaultValue="David K." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" defaultValue="david@example.com" />
            </div>
            <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all mt-2">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            Subscription & Billing
          </h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4">
            <div>
              <p className="font-bold text-gray-900">Monthly Installment</p>
              <p className="text-sm text-gray-500">Next payment of ₦45,000 due soon.</p>
            </div>
            <button 
              onClick={async () => {
                try {
                  const token = useAuthStore.getState().token;
                  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || "http://localhost:5001";
                  const tenantSlug = window.location.pathname.split('/')[1];
                  const res = await fetch(`${USERS_API}/api/v1/payments/initialize`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Tenant-Domain': tenantSlug,
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ 
                      amount: 45000,
                      purpose: 'subscription_renewal',
                      reference_id: 'sub_renewal_1',
                      callback_url: window.location.href
                    })
                  });
                  const data = await res.json();
                  if (res.ok && data.authorization_url) {
                    window.location.href = data.authorization_url;
                  } else {
                    alert(data.error || "Payment failed to initialize");
                  }
                } catch (e) {
                  alert("Network error");
                }
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Pay Now
            </button>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
             Payments are securely processed via Paystack.
          </p>
        </div>
      </div>
    </>
  );
}