"use client";

import React from 'react';
import { 
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function HelpPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Help & Resources</h1>
          <p className="text-sm text-gray-500 mt-1">Get support, read our guides, and find answers to common questions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Support Cards */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#146ef5] mb-4">
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Live Support</h3>
          <p className="text-xs text-gray-500 mb-4">Chat with our dedicated agent success team.</p>
          <span className="text-sm font-semibold text-[#146ef5] mt-auto">Start Chat</span>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Agent Handbook</h3>
          <p className="text-xs text-gray-500 mb-4">Read the comprehensive guide to selling ResultsPRO.</p>
          <span className="text-sm font-semibold text-emerald-500 mt-auto">Read Guide</span>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4">
            <VideoCameraIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Video Tutorials</h3>
          <p className="text-xs text-gray-500 mb-4">Watch step-by-step videos on how to pitch to schools.</p>
          <span className="text-sm font-semibold text-purple-500 mt-auto">Watch Videos</span>
        </div>

      </div>

      <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6 text-lg">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          
          {/* FAQ Item 1 */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <span className="font-semibold text-gray-900 text-sm">How do I earn my bounty?</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </button>
            <div className="p-4 text-sm text-gray-600 bg-white border-t border-gray-100">
              When you register a school using your unique tracking link, they enter the "Invited" stage. Once they complete their onboarding and make their first payment for ResultsPRO, your ₦50,000 bounty is automatically credited to your ledger.
            </div>
          </div>

          {/* FAQ Item 2 */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
              <span className="font-semibold text-gray-900 text-sm">How do I purchase Wholesale PINs?</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* FAQ Item 3 */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
              <span className="font-semibold text-gray-900 text-sm">When do payouts happen?</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* FAQ Item 4 */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
              <span className="font-semibold text-gray-900 text-sm">What marketing materials can I use?</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
