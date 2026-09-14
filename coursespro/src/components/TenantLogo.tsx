import React from 'react';

export interface TenantLogoProps {
  tenantName?: string;
  logoUrl?: string;
  darkLogoUrl?: string;
  flattenLogo?: boolean;
  theme?: 'light' | 'dark';
  height?: number;
  className?: string;
}

export default function TenantLogo({
  tenantName,
  logoUrl,
  darkLogoUrl,
  flattenLogo = true,
  theme = 'light',
  height = 40,
  className = ''
}: TenantLogoProps) {
  // 1. Base default
  let activeSrc = logoUrl || "/logo.png";
  let filter = 'none';

  // 2. Apply dark theme logic if requested
  if (theme === 'dark') {
    if (darkLogoUrl) {
      activeSrc = darkLogoUrl;
    } else if (flattenLogo !== false) {
      // If no dark logo is provided, and flattening isn't explicitly disabled, flatten it.
      filter = 'brightness(0) invert(1)';
    }
  }

  return (
    <img 
      src={activeSrc} 
      alt={tenantName ? `${tenantName} Logo` : "CoursesPRO Logo"} 
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', filter }}
      className={className}
    />
  );
}
