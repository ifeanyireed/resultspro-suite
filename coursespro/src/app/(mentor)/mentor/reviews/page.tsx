"use client";
import React from 'react';

export default function MentorReviews() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Evaluate and grade builder project submissions.</p>
        </div>
      </div>
      <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending reviews</h3>
        <p className="text-gray-500 text-sm">Your queue is completely clear!</p>
      </div>
    </>
  );
}