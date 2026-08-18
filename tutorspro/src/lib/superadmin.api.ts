import api from './api';

export const getSuperAdminDashboard = async () => {
  try {
    const response = await api.get('/super-admin/dashboard');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching super admin dashboard data.');
  }
};

export const getSystemHealth = async () => {
  try {
    const response = await api.get('/super-admin/health');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching system health.');
  }
};

export const getFeatureFlags = async () => {
  try {
    const response = await api.get('/super-admin/feature-flags');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching feature flags.');
  }
};

export const updateFeatureFlag = async (id: string, enabled: boolean) => {
  try {
    const response = await api.post(`/super-admin/feature-flags/${id}`, { enabled });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while updating feature flag.');
  }
};

export const getInfrastructure = async () => {
  try {
    const response = await api.get('/super-admin/infrastructure');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching infrastructure data.');
  }
};

export const getIntegrations = async () => {
  try {
    const response = await api.get('/super-admin/integrations');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching integrations.');
  }
};

export const getAuditLogs = async () => {
  try {
    const response = await api.get('/super-admin/audit-logs');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching audit logs.');
  }
};

export const getPermissions = async () => {
  try {
    const response = await api.get('/super-admin/permissions');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching permissions.');
  }
};

export const getSystemAnalytics = async () => {
  try {
    const response = await api.get('/super-admin/analytics');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred while fetching system analytics.');
  }
};
