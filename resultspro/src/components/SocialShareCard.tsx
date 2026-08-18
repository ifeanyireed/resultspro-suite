import React from 'react';
import { SchoolResult, School } from '@/lib/schoolData';

interface SocialShareCardProps {
  school: any;
  result: any;
  platform?: string;
}

export const SocialShareCard: React.FC<SocialShareCardProps> = ({ 
  school, 
  result, 
  platform = 'SHARE' 
}) => {
  const primaryColor = school.primaryColor || '#3b82f6';

  return (
    <div 
      className="relative overflow-hidden rounded-2xl shadow-2xl" 
      style={{ 
        width: '644px', 
        height: '618px',
        backgroundColor: '#000'
      }}
    >
      {/* Background Image */}
      <img
        src="/share.png"
        alt="Share Card Background"
        className="block w-full h-full object-cover"
      />

      {/* Overlaid Content */}
      <div 
        className="absolute inset-0 flex flex-col" 
        style={{ 
          paddingTop: '20px', 
          paddingLeft: '20px', 
          paddingRight: '20px', 
          paddingBottom: '20px' 
        }}
      >
        {/* Row 1: Student Info + School Logo */}
        <div className="flex justify-between items-start mb-auto gap-4">
          {/* Left: School Logo */}
          {school.logoUrl || school.logo ? (
            <img
              src={school.logoUrl || school.logo}
              alt="School Logo"
              style={{
                width: '120px',
                height: '120px',
                flexShrink: 0
              }}
              className="object-cover rounded-lg"
            />
          ) : (
            <div 
              style={{
                width: '120px',
                height: '120px',
                flexShrink: 0,
                backgroundColor: primaryColor
              }}
              className="rounded-lg flex items-center justify-center text-4xl text-white font-bold"
            >
              {school.name?.charAt(0) || 'S'}
            </div>
          )}

          {/* Right: Student Name and Details */}
          <div className="flex-1">
            <h1
              className="text-white font-semibold truncate"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '40px',
                fontWeight: 600,
                lineHeight: '1.1',
                letterSpacing: '-0.5px',
                marginTop: '20px',
                marginBottom: '1px'
              }}
            >
              {result.studentName || result.name}
            </h1>
            <p
              className="text-gray-300"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '21px',
                fontWeight: 200,
                letterSpacing: '-0.3px',
                marginTop: '1px',
                paddingLeft: '8px'
              }}
            >
              {result.classLevel || result.className}, {result.subjects?.length || 0} subjects
            </p>
          </div>
        </div>

        {/* ✅ CENTER NUMBER INSIDE CIRCLE */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: '44%',
            left: '24%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            pointerEvents: 'none'
          }}
        >
          <span
            className="text-white"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '48px',
              fontWeight: 600,
              letterSpacing: '-2px',
              textShadow: '0 0 12px rgba(59,130,246,0.5)'
            }}
          >
            {result.overallAverage || 0}%
          </span>
        </div>

        {/* Row 2: Performance Metrics */}
        <div className="flex justify-between items-end mt-auto">

          {/* Left Column: Metrics Grid */}
          <div 
            className="grid grid-cols-2 gap-x-12 gap-y-4" 
            style={{ marginBottom: '40px', marginLeft: '12px' }}
          >
            {/* Position */}
            <div className="flex flex-col">
              <span 
                className="text-gray-400 uppercase font-medium" 
                style={{ fontSize: '13px', letterSpacing: '1px' }}
              >
                Position
              </span>
              <span 
                className="text-white font-bold" 
                style={{ fontSize: '32px', lineHeight: '1' }}
              >
                {result.position || result.overallPosition || 'N/A'}
              </span>
            </div>

            {/* Average */}
            <div className="flex flex-col">
              <span 
                className="text-gray-400 uppercase font-medium" 
                style={{ fontSize: '13px', letterSpacing: '1px' }}
              >
                Average
              </span>
              <span 
                className="text-white font-bold" 
                style={{ fontSize: '32px', lineHeight: '1' }}
              >
                {result.overallAverage || 0}%
              </span>
            </div>

            {/* Total Score */}
            <div className="flex flex-col">
              <span 
                className="text-gray-400 uppercase font-medium" 
                style={{ fontSize: '13px', letterSpacing: '1px' }}
              >
                Total Score
              </span>
              <span 
                className="text-white font-bold" 
                style={{ fontSize: '32px', lineHeight: '1' }}
              >
                {result.subjects?.reduce((acc: any, s: any) => acc + (s.score || s.total || 0), 0) || 0}
              </span>
            </div>

            {/* Grade */}
            <div className="flex flex-col">
              <span 
                className="text-gray-400 uppercase font-medium" 
                style={{ fontSize: '13px', letterSpacing: '1px' }}
              >
                Overall Grade
              </span>
              <span 
                className="text-blue-400 font-bold" 
                style={{ fontSize: '32px', lineHeight: '1' }}
              >
                {result.subjects?.[0]?.grade || 'A'}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-end" style={{ marginBottom: '35px', marginRight: '10px' }}>
            <div 
              style={{ backgroundColor: `${primaryColor}33`, borderColor: `${primaryColor}4d` }}
              className="border px-4 py-1.5 rounded-full mb-4"
            >
              <span style={{ color: primaryColor }} className="font-bold text-xs tracking-widest uppercase">
                {platform}
              </span>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Verified via</p>
              <p className="text-white font-bold text-sm tracking-tight">RESULTSPRO.NG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};