export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SUPERADMIN]: 100,
  [Role.SCHOOL_ADMIN]: 80,
  [Role.TEACHER]: 60,
  [Role.PARENT]: 40,
  [Role.STUDENT]: 20,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
