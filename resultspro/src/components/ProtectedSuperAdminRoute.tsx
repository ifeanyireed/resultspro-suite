import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedSuperAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedSuperAdminRoute: React.FC<ProtectedSuperAdminRouteProps> = ({ children }) => {
  const userJson = localStorage.getItem('user');
  const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');

  // Check if user is logged in
  if (!token || !userJson) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);

    console.log('🔒 ProtectedSuperAdminRoute: Checking user role:', user.role, 'Type:', typeof user.role);

    // Check if user is a super admin
    if (user.role !== 'SUPER_ADMIN' && user.role?.toUpperCase() !== 'SUPER_ADMIN') {
      console.log('❌ Access denied: User role is not SUPER_ADMIN, redirecting to /');
      return <Navigate to="/" replace />;
    }

    console.log('✅ Super admin access granted');
    return <>{children}</>;
  } catch (error) {
    // Invalid user data
    console.error('❌ Error parsing user data:', error);
    return <Navigate to="/auth/login" replace />;
  }
};

export default ProtectedSuperAdminRoute;
