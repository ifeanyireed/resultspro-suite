import React from 'react';
import { Call02Icon, Message01Icon } from '@hugeicons/core-free-icons';
import { School } from '@/lib/schoolData';

interface SchoolHeaderProps {
  school: School;
}

export const SchoolHeader: React.FC<SchoolHeaderProps> = ({ school }) => {
  return (
    <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
      <div className="flex items-center justify-center gap-4 mb-3">
        {school.logo && (
          <img 
            src={school.logo} 
            alt="School Logo"
            style={{ maxWidth: '60px', height: '60px' }}
            className="object-contain"
          />
        )}
        {school.logoEmoji && !school.logo && (
          <div className="text-4xl">{school.logoEmoji}</div>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-1 text-gray-900">{school.name}</h1>
      <p className="text-gray-600 italic text-sm mb-3">{school.motto}</p>
      <div className="flex justify-center gap-8 text-xs text-gray-700">
        {school.contactPhone && <span className="flex items-center gap-1"><Call02Icon className="w-4 h-4" /> {school.contactPhone}</span>}
        {school.contactEmail && <span className="flex items-center gap-1"><Message01Icon className="w-4 h-4" /> {school.contactEmail}</span>}
        {school.location && <span>📍 {school.location}</span>}
      </div>
    </div>
  );
};
