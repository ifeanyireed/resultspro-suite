import React from 'react';
import { SchoolResult } from '@/lib/schoolData';

interface AffectiveDomainProps {
  result: SchoolResult;
}

const getRatingColor = (rating: string) => {
  switch(rating) {
    case 'Excellent': return 'bg-green-100 text-green-800 border-green-300';
    case 'Very Good': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Good': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Fair': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Poor': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const AffectiveDomain: React.FC<AffectiveDomainProps> = ({ result }) => {
  if (!result.affectiveDomain || Object.keys(result.affectiveDomain).length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Affective Domain (Behavioral Traits)</h2>
      <div className="space-y-3">
        {Object.entries(result.affectiveDomain).map(([trait, rating]) => (
          <div key={trait} className="flex items-center justify-between bg-white border border-gray-300 rounded p-4">
            <span className="font-medium text-gray-900">{trait}</span>
            <span className={`px-4 py-2 rounded border font-semibold text-sm ${getRatingColor(rating)}`}>
              {rating}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
