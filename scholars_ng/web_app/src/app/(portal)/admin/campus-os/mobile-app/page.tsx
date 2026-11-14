'use client';

import React from 'react';
import { MobileAppDashboard, useCampusOS } from '../components';

export default function CampusOSMobileAppPage() {
  const { selectedCampus } = useCampusOS();
  return <MobileAppDashboard selectedCampus={selectedCampus} />;
}
