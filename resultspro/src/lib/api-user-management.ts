import api from './api';
import {
  Agent,
  SupportStaff,
  Teacher,
  Parent,
  BulkInvitePayload,
  ListUsersResponse,
  UserDetailsResponse,
  BulkInviteResponse,
} from '@/types/user-management';

/**
 * Agent Management API
 */
export const agentAPI = {
  // Get all agents (SuperAdmin)
  listAgents: async (page = 1, limit = 20, filters?: Record<string, unknown>) => {
    const response = await api.get<ListUsersResponse>('/super-admin/agents', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Get agent details
  getAgent: async (agentId: string) => {
    const response = await api.get<UserDetailsResponse>(`/super-admin/agents/${agentId}`);
    return response.data;
  },

  // Create agent (SuperAdmin)
  createAgent: async (data: Partial<Agent>) => {
    const response = await api.post('/super-admin/agents', data);
    return response.data;
  },

  // Update agent
  updateAgent: async (agentId: string, data: Partial<Agent>) => {
    const response = await api.patch(`/super-admin/agents/${agentId}`, data);
    return response.data;
  },

  // Suspend/Unsuspend agent
  toggleAgentStatus: async (agentId: string, status: 'SUSPENDED' | 'ACTIVE') => {
    const response = await api.patch(`/super-admin/agents/${agentId}/status`, { status });
    return response.data;
  },

  // Delete agent
  deleteAgent: async (agentId: string) => {
    const response = await api.delete(`/super-admin/agents/${agentId}`);
    return response.data;
  },

  // Bulk invite agents
  bulkInviteAgents: async (payload: BulkInvitePayload) => {
    const response = await api.post<BulkInviteResponse>('/super-admin/agents/bulk/invite', payload);
    return response.data;
  },

  // Get agent permission/roles
  getAgentPermissions: async (agentId: string) => {
    const response = await api.get(`/super-admin/agents/${agentId}/permissions`);
    return response.data;
  },

  // Update agent permissions
  updateAgentPermissions: async (agentId: string, permissionIds: string[]) => {
    const response = await api.patch(`/super-admin/agents/${agentId}/permissions`, { permissionIds });
    return response.data;
  },

  // List all referrals (SuperAdmin)
  listReferrals: async (page = 1, limit = 20, filters?: Record<string, unknown>) => {
    const response = await api.get('/super-admin/agents/referrals', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Approve referral (SuperAdmin)
  approveReferral: async (referralId: string) => {
    const response = await api.post(`/super-admin/agents/referrals/${referralId}/approve`);
    return response.data;
  },

  // Reject referral (SuperAdmin)
  rejectReferral: async (referralId: string, reason: string) => {
    const response = await api.post(`/super-admin/agents/referrals/${referralId}/reject`, { reason });
    return response.data;
  },

  // List all school assignments (SuperAdmin)
  listAssignments: async (page = 1, limit = 20, filters?: Record<string, unknown>) => {
    const response = await api.get('/super-admin/agents/assignments', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Assign school to agent (SuperAdmin)
  assignSchool: async (agentId: string, schoolId: string, role: string, commissionRate: number) => {
    const response = await api.post('/super-admin/agents/assignments', {
      agentId,
      schoolId,
      role,
      commissionRate,
    });
    return response.data;
  },

  // Remove assignment (SuperAdmin)
  removeAssignment: async (assignmentId: string) => {
    const response = await api.delete(`/super-admin/agents/assignments/${assignmentId}`);
    return response.data;
  },
};

/**
 * Support Staff Management API
 */
export const supportStaffAPI = {
  // Get all support staff (SuperAdmin)
  listStaff: async (page = 1, limit = 20, filters?: Record<string, unknown>) => {
    const response = await api.get<ListUsersResponse>('/super-admin/support-staff', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Get support staff member details
  getStaffMember: async (staffId: string) => {
    const response = await api.get<UserDetailsResponse>(`/super-admin/support-staff/${staffId}`);
    return response.data;
  },

  // Create support staff
  createStaffMember: async (data: Partial<SupportStaff>) => {
    const response = await api.post('/super-admin/support-staff', data);
    return response.data;
  },

  // Update support staff
  updateStaffMember: async (staffId: string, data: Partial<SupportStaff>) => {
    const response = await api.patch(`/super-admin/support-staff/${staffId}`, data);
    return response.data;
  },

  // Change staff permission level
  updatePermissionLevel: async (staffId: string, permissionLevel: string) => {
    const response = await api.patch(`/super-admin/support-staff/${staffId}/permission-level`, {
      permissionLevel,
    });
    return response.data;
  },

  // Suspend/Unsuspend staff
  toggleStaffStatus: async (staffId: string, status: 'SUSPENDED' | 'ACTIVE') => {
    const response = await api.patch(`/super-admin/support-staff/${staffId}/status`, { status });
    return response.data;
  },

  // Delete support staff
  deleteStaffMember: async (staffId: string) => {
    const response = await api.delete(`/super-admin/support-staff/${staffId}`);
    return response.data;
  },

  // Bulk invite support staff
  bulkInviteStaff: async (payload: BulkInvitePayload) => {
    const response = await api.post<BulkInviteResponse>(
      '/super-admin/support-staff/bulk/invite',
      payload
    );
    return response.data;
  },

  // Get staff member permissions
  getPermissions: async (staffId: string) => {
    const response = await api.get(`/super-admin/support-staff/${staffId}/permissions`);
    return response.data;
  },

  // Update staff member permissions
  updatePermissions: async (staffId: string, permissionIds: string[]) => {
    const response = await api.patch(`/super-admin/support-staff/${staffId}/permissions`, {
      permissionIds,
    });
    return response.data;
  },
};

/**
 * Teacher Management API (SchoolAdmin)
 */
export const teacherAPI = {
  // Get all teachers for a school
  listTeachers: async (schoolId: string, page = 1, limit = 20, filters?: Record<string, unknown>) => {
    const response = await api.get<ListUsersResponse>(
      `/school/teachers`,
      { params: { schoolId, page, limit, ...filters } }
    );
    return response.data;
  },

  // Get teacher details
  getTeacher: async (teacherId: string) => {
    const response = await api.get<UserDetailsResponse>(
      `/school/teachers/${teacherId}`
    );
    return response.data;
  },

  // Create teacher
  createTeacher: async (data: Partial<Teacher>) => {
    const response = await api.post(`/school/teachers`, data);
    return response.data;
  },

  // Update teacher
  updateTeacher: async (teacherId: string, data: Partial<Teacher>) => {
    const response = await api.patch(`/school/teachers/${teacherId}`, data);
    return response.data;
  },

  // Assign class to teacher
  assignClass: async (teacherId: string, classId: string) => {
    const response = await api.patch(`/school/teachers/${teacherId}/assign-class`, {
      classId,
    });
    return response.data;
  },

  // Assign subject to teacher
  assignSubject: async (teacherId: string, subject: string) => {
    const response = await api.patch(`/school/teachers/${teacherId}/assign-subject`, {
      subject,
    });
    return response.data;
  },

  // Suspend/Unsuspend teacher
  toggleTeacherStatus: async (
    teacherId: string,
    status: 'SUSPENDED' | 'ACTIVE'
  ) => {
    const response = await api.patch(`/school/teachers/${teacherId}/status`, {
      status,
    });
    return response.data;
  },

  // Delete teacher
  deleteTeacher: async (teacherId: string) => {
    const response = await api.delete(`/school/teachers/${teacherId}`);
    return response.data;
  },

  // Get teacher permissions
  getPermissions: async (teacherId: string) => {
    const response = await api.get(
      `/school/teachers/${teacherId}/permissions`
    );
    return response.data;
  },

  // Update teacher permissions
  updatePermissions: async (teacherId: string, permissions: string[]) => {
    const response = await api.patch(
      `/school/teachers/${teacherId}/permissions`,
      { permissions }
    );
    return response.data;
  },
};

/**
 * Parent Management API (SchoolAdmin)
 */
export const parentAPI = {
  // Get all parents for a school
  listParents: async (schoolId: string, page = 1, limit = 20, filters?: Record<string, unknown>) => {
    const response = await api.get<ListUsersResponse>(
      `/school/parents`,
      { params: { schoolId, page, limit, ...filters } }
    );
    return response.data;
  },

  // Get parent details
  getParent: async (schoolId: string, parentId: string) => {
    const response = await api.get<UserDetailsResponse>(
      `/school/parents/${parentId}`
    );
    return response.data;
  },
};

/**
 * Permission Management API
 */
export const permissionAPI = {
  // Get all available roles
  getAllRoles: async () => {
    const response = await api.get('/permissions/roles');
    return response.data;
  },

  // Get all available permissions
  getAllPermissions: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },

  // Get user's current permissions
  getUserPermissions: async (userId: string) => {
    const response = await api.get(`/permissions/users/${userId}`);
    return response.data;
  },
};
