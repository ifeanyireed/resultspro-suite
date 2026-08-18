import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedSupportAgentRouteProps {
  children: React.ReactNode;
}

const ProtectedSupportAgentRoute: React.FC<ProtectedSupportAgentRouteProps> = ({ children }) => {
  const userJson = localStorage.getItem('user');
  const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');

  // Check if user is logged in
  if (!token || !userJson) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);

    console.log('🔒 ProtectedSupportAgentRoute: Checking user role:', user.role, 'Type:', typeof user.role);

    // Check if user is a support agent
    if (user.role !== 'SUPPORT_AGENT' && user.role?.toUpperCase() !== 'SUPPORT_AGENT') {
      console.log('❌ Access denied: User role is not SUPPORT_AGENT, redirecting to /');
      return <Navigate to="/" replace />;
    }

    console.log('✅ Support agent access granted');
    return <>{children}</>;
  } catch (error) {
    // Invalid user data
    console.error('❌ Error parsing user data:', error);
    return <Navigate to="/auth/login" replace />;
  }
};

export default ProtectedSupportAgentRoute;
