"use client";

import React from 'react';
import { 
  BuildingStorefrontIcon,
  TicketIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function WholesaleStorePage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Wholesale Store</h1>
          <p className="text-sm text-gray-500 mt-1">Purchase ResultsPRO PINs in bulk at discounted agent rates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Inventory Card */}
        <div className="bg-[#146ef5] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between h-[160px] relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-white/90 text-sm font-medium">Vault Balance</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <TicketIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-4xl font-bold text-white mb-2">50</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <span>Unused PINs available</span>
            </div>
          </div>
        </div>

        {/* Warning/Alert Card */}
        <div className="bg-orange-50 rounded-[1.5rem] p-6 shadow-sm border border-orange-100 flex flex-col justify-center lg:col-span-3">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl shrink-0">
              <ArrowDownTrayIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-orange-900 mb-1">Low Inventory Alert</h3>
              <p className="text-sm text-orange-700">You are running low on PINs. Schools in your network require at least 200 PINs for the upcoming end-of-term. Restock now to avoid delays.</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-6">Available Packages</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Package 1 */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex flex-col relative hover:-translate-y-1 transition-transform">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Standard</h4>
            <h2 className="text-4xl font-bold text-gray-900">100 <span className="text-xl text-gray-400 font-medium">PINs</span></h2>
          </div>
          <div className="space-y-3 mb-8 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheckIcon className="w-5 h-5 text-[#146ef5]" /> ₦800 per PIN
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheckIcon className="w-5 h-5 text-[#146ef5]" /> 20% Agent Discount
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-3">Total Cost: <span className="font-bold text-gray-900 text-lg">₦80,000</span></div>
            <button className="w-full bg-white border border-[#146ef5] hover:bg-[#eef5ff] text-[#146ef5] font-semibold py-3 rounded-xl transition-colors">
              Purchase Package
            </button>
          </div>
        </div>

        {/* Package 2 (Popular) */}
        <div className="bg-[#111827] rounded-[1.5rem] p-8 shadow-lg flex flex-col relative hover:-translate-y-1 transition-transform overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[#146ef5]"></div>
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#146ef5] rounded-full blur-[50px] opacity-20"></div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Premium</h4>
              <span className="bg-[#146ef5] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            </div>
            <h2 className="text-4xl font-bold text-white">500 <span className="text-xl text-gray-500 font-medium">PINs</span></h2>
          </div>
          <div className="space-y-3 mb-8 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <ShieldCheckIcon className="w-5 h-5 text-[#146ef5]" /> ₦700 per PIN
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <ShieldCheckIcon className="w-5 h-5 text-[#146ef5]" /> 30% Agent Discount
            </div>
            <div className="flex items-center gap-2 text-sm text-[#146ef5] font-medium">
              <TicketIcon className="w-5 h-5" /> +20 Bonus PINs
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-3">Total Cost: <span className="font-bold text-white text-lg">₦350,000</span></div>
            <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold py-3 rounded-xl transition-colors">
              Purchase Package
            </button>
          </div>
        </div>

        {/* Package 3 */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex flex-col relative hover:-translate-y-1 transition-transform">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Mega</h4>
            <h2 className="text-4xl font-bold text-gray-900">1000 <span className="text-xl text-gray-400 font-medium">PINs</span></h2>
          </div>
          <div className="space-y-3 mb-8 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheckIcon className="w-5 h-5 text-[#146ef5]" /> ₦600 per PIN
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheckIcon className="w-5 h-5 text-[#146ef5]" /> 40% Agent Discount
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <BuildingStorefrontIcon className="w-5 h-5" /> Dedicated Account Manager
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-3">Total Cost: <span className="font-bold text-gray-900 text-lg">₦600,000</span></div>
            <button className="w-full bg-white border border-[#146ef5] hover:bg-[#eef5ff] text-[#146ef5] font-semibold py-3 rounded-xl transition-colors">
              Purchase Package
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
