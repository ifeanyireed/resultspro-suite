// User Management Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Agent extends User {
  locationType?: string;
  state?: string;
  lga?: string;
  phoneNumber?: string;
  subscriptionTier: string;
  bio?: string;
  credentials?: string;
  verificationStatus: VerificationStatus;
  totalCommissionEarned: number;
  pointsBalance: number;
  leaderboardRank?: number;
  uniqueReferralCode: string;
}

export interface SupportStaff extends User {
  department: string;
  permissionLevel: PermissionLevel;
  assignedTicketCount?: number;
  responseRate?: number;
}

export interface Teacher extends User {
  schoolId: string;
  classId?: string;
  subjectId?: string;
  qualifications?: string;
  employeeId?: string;
  bio?: string;
  profilePhotoUrl?: string;
}

export interface Parent extends User {
  schoolId: string;
  phoneNumber: string;
  occupation?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  children?: string[];
}

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'SUPPORT_AGENT' | 'AGENT' | 'TEACHER' | 'PARENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
export type VerificationStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type PermissionLevel = 'ADMIN' | 'MANAGER' | 'AGENT' | 'VIEWER';

// Bulk Operations
export interface BulkInvitePayload {
  emails: string[];
  role: UserRole;
  department?: string;
  schoolId?: string;
  message?: string;
  state?: string;
  lga?: string;
  locationType?: string;
}

export interface BulkUploadResult {
  success: number;
  failed: number;
  errors: { email: string; error: string }[];
}

// Permission/Role Management
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount?: number;
}

export interface UserPermissions {
  userId: string;
  role: UserRole;
  permissions: Permission[];
  customPermissions?: Permission[];
}

// API Responses
export interface ListUsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserDetailsResponse {
  success: boolean;
  data: User;
}

export interface BulkInviteResponse {
  success: boolean;
  data: BulkUploadResult;
  message: string;
}
