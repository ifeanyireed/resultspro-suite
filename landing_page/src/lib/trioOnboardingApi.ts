// Unified Suite Onboarding API Client (service_users + service_campuspro)
// Shared across landing_page (/onboard), scholars_ng (/onboard & /register),
// tutorspro (/onboard, /signup, /tutor/onboarding), and puzzlepro (/onboard & /onboarding)
// to provision or link to an existing school entity, academic session/terms,
// classes/arms, subjects, teachers/tutors, students/players, and parent-ward links
// across CampusPRO, ClassroomPRO, ResultsPRO, TutorsPRO, and PuzzlePRO.

export const USERS_API_BASE =
  (typeof process !== 'undefined' &&
    (process.env?.NEXT_PUBLIC_USERS_API || process.env?.NEXT_PUBLIC_API_URL)) ||
  'https://resultspro-service-users.onrender.com';

export const CAMPUS_API_BASE =
  (typeof process !== 'undefined' &&
    (process.env?.NEXT_PUBLIC_CAMPUS_API || process.env?.NEXT_PUBLIC_CAMPUSPRO_API)) ||
  'https://resultspro-service-campuspro.onrender.com';

export const TUTORS_API_BASE =
  (typeof process !== 'undefined' &&
    (process.env?.NEXT_PUBLIC_TUTORS_API || process.env?.NEXT_PUBLIC_TUTORSPRO_API)) ||
  'https://resultspro-service-tutorspro.onrender.com';

export function slugifySchoolName(name: string): string {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function detectActiveTenantId(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const qTenant =
    params.get('tenant') || params.get('tenant_id') || params.get('school_id');
  if (qTenant) return qTenant;

  const stored =
    localStorage.getItem('tenantId') ||
    localStorage.getItem('x-tenant-id') ||
    localStorage.getItem('tenant_id') ||
    localStorage.getItem('active_tenant_id') ||
    localStorage.getItem('schoolId') ||
    localStorage.getItem('tenant_slug');
  if (stored) return stored;

  const host = (window.location.hostname || '').toLowerCase();
  if (host.endsWith('.scholars.ng') || host.endsWith('.resultspro.ng')) {
    const sub = host.split('.')[0];
    if (
      sub &&
      ![
        'www',
        'app',
        'api',
        'resultspro',
        'classroompro',
        'coursespro',
        'tutorspro',
        'puzzlepro',
      ].includes(sub)
    ) {
      return sub;
    }
  }
  return '';
}

export function persistTenantSession(tenantId: string, slug: string, schoolName?: string): void {
  if (typeof window === 'undefined' || !tenantId) return;
  localStorage.setItem('tenantId', tenantId);
  localStorage.setItem('x-tenant-id', tenantId);
  localStorage.setItem('tenant_id', tenantId);
  localStorage.setItem('active_tenant_id', tenantId);
  localStorage.setItem('schoolId', tenantId);
  if (slug) {
    localStorage.setItem('tenant_slug', slug);
  }
  if (schoolName) {
    localStorage.setItem('schoolName', schoolName);
  }
}

async function campusFetch(
  path: string,
  tenantId: string,
  options: RequestInit = {}
): Promise<any> {
  const base = CAMPUS_API_BASE.replace(/\/+$/, '');
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('token')
      : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(tenantId ? { 'X-Tenant-ID': tenantId, 'x-tenant-id': tenantId } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `CampusPRO request failed (${res.status})`);
  }
  return data;
}

async function usersFetch(path: string, options: RequestInit = {}): Promise<any> {
  const base = USERS_API_BASE.replace(/\/+$/, '');
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('token')
      : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Users service request failed (${res.status})`);
  }
  return data;
}

/**
 * Resolves an already-existing school entity (tenant) in service_users / service_campuspro
 * by its slug, tenant ID, or subdomain code so any user role (School Admin, Parent/Student,
 * Teacher/Tutor) can link directly to an existing entity during onboarding.
 */
export async function resolveExistingEntityOnSuite(codeOrSlug: string): Promise<{
  tenantId: string;
  slug: string;
  schoolName: string;
  motto?: string;
  primaryColor?: string;
  accentColor?: string;
  curriculum?: string;
} | null> {
  const raw = (codeOrSlug || '').trim().toLowerCase();
  if (!raw) return null;
  const cleanSlug = raw
    .replace(/^https?:\/\//, '')
    .replace(/\.scholars\.ng.*$/, '')
    .replace(/\.resultspro\.ng.*$/, '')
    .replace(/^tenant-/, '')
    .trim();
  const candidateTenantId = raw.startsWith('tenant-') ? raw : `tenant-${cleanSlug}`;

  // 1. Try service_users public tenant resolution endpoint
  try {
    const resolved = await usersFetch(
      `/api/public/tenant/resolve?domain=${encodeURIComponent(cleanSlug)}&slug=${encodeURIComponent(cleanSlug)}`
    );
    const t = resolved?.data || resolved?.tenant || resolved;
    if (t && (t.id || t.slug || t.name)) {
      const tid = String(t.id || candidateTenantId);
      const slug = String(t.slug || cleanSlug);
      const schoolName = String(t.name || t.school_name || cleanSlug);
      persistTenantSession(tid, slug, schoolName);
      return {
        tenantId: tid,
        slug,
        schoolName,
        motto: t.motto || '',
        primaryColor: t.primary_color || '#146ef5',
        accentColor: t.accent_color || '#0f172a',
        curriculum: t.curriculum || 'NERDC / WAEC Standard',
      };
    }
  } catch {
    // Fallback to CampusPRO website-config lookup
  }

  // 2. Try service_campuspro website-config for the tenant
  try {
    const cfg = await campusFetch('/api/public/campus/website-config', candidateTenantId);
    const c = cfg?.config || cfg?.data || cfg;
    if (c && (c.school_name || c.tenant_id || c.tagline)) {
      const schoolName = String(
        c.school_name ||
          cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      );
      persistTenantSession(candidateTenantId, cleanSlug, schoolName);
      return {
        tenantId: candidateTenantId,
        slug: cleanSlug,
        schoolName,
        motto: c.tagline || c.motto || '',
        primaryColor: c.primary_color || '#146ef5',
        accentColor: c.accent_color || '#0f172a',
      };
    }
  } catch {
    // Continue
  }

  return null;
}

export interface SchoolOnboardingPayload {
  existingTenantSlug?: string;
  schoolName: string;
  motto: string;
  email: string;
  phone: string;
  primaryColor: string;
  accentColor: string;
  curriculum: string;
  codingPathway?: string;
  logoUrl?: string | null;
  paymentOption: string;
  referralCode?: string;
  sessionData: {
    sessionName: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    terms: Array<{
      id: number;
      name: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
    }>;
  };
  classesList: Array<{
    id: number;
    name: string;
    level: string;
    curriculum_id: string;
    sections: Array<{ id: number; name: string; room_number: string }>;
    subjects: Array<{ id: number; name: string; code: string }>;
  }>;
  teachersList: Array<{
    id: number;
    email: string;
    assignments: Array<{
      id: number;
      class_id: string | number;
      section_id: string | number;
      subject_id: string | number;
    }>;
  }>;
  studentsList: Array<{
    id: number;
    identifier: string;
    class_id: string | number;
    section_id: string | number;
    status: string;
  }>;
}

/**
 * Provisions a new school tenant (or links to an already-existing school entity)
 * and persists its complete academic structure into service_users and service_campuspro
 * so the school is immediately active across CampusPRO (scholars_ng), ClassroomPRO,
 * ResultsPRO, TutorsPRO, and PuzzlePRO.
 */
export async function provisionSchoolIntoTrio(
  payload: SchoolOnboardingPayload
): Promise<{ tenantId: string; slug: string }> {
  const cleanExisting = (payload.existingTenantSlug || '')
    .trim()
    .toLowerCase()
    .replace(/^tenant-/, '');
  const slug =
    cleanExisting || slugifySchoolName(payload.schoolName) || `school-${Date.now()}`;
  let tenantId = `tenant-${slug}`;

  // 1. Create or Update Tenant & Tenant-Admin User in service_users
  try {
    const tenantRes = await usersFetch('/intelligence/tenant/create', {
      method: 'POST',
      body: JSON.stringify({
        id: tenantId,
        name: payload.schoolName.trim(),
        slug,
        motto: payload.motto?.trim() || '',
        contact_email: payload.email.trim(),
        contact_phone: payload.phone?.trim() || '',
        primary_color: payload.primaryColor || '#146ef5',
        accent_color: payload.accentColor || '#0f172a',
        logo_url:
          payload.logoUrl && !payload.logoUrl.startsWith('blob:')
            ? payload.logoUrl
            : '',
        subscription_tier: payload.paymentOption || 'PRO',
        enabled_modules: JSON.stringify([
          'campuspro',
          'classroompro',
          'resultspro',
          'tutorspro',
          'puzzlepro',
        ]),
      }),
    });
    if (tenantRes?.id) {
      tenantId = String(tenantRes.id);
    }
  } catch {
    // If tenant slug already exists, continue provisioning/linking academic entities under tenantId
  }

  // Also register/sync the school organisation in PuzzlePRO player service so coding cohorts work out-of-the-box
  await usersFetch('/api/v1/organisations', {
    method: 'POST',
    body: JSON.stringify({
      id: tenantId,
      name: payload.schoolName.trim(),
      slug,
      email: payload.email.trim(),
      phone: payload.phone?.trim() || '',
      type: 'school',
      coding_pathway: payload.codingPathway || 'World 1–6 Full Future Skills Track',
    }),
  }).catch(() => {});

  persistTenantSession(tenantId, slug, payload.schoolName.trim());

  // 2. Create Academic Session & Terms in service_campuspro
  if (payload.sessionData?.sessionName) {
    await campusFetch('/api/v1/campus/academic-sessions', tenantId, {
      method: 'POST',
      body: JSON.stringify({
        session_name: payload.sessionData.sessionName,
        academic_year: payload.sessionData.sessionName,
        start_date: payload.sessionData.startDate || undefined,
        end_date: payload.sessionData.endDate || undefined,
        make_active: true,
        description: `${payload.schoolName} Academic Session`,
      }),
    }).catch(() => {});
  }

  // Track created CampusPRO IDs keyed by local wizard IDs
  const classIdMap = new Map<string, { id: string; name: string }>();
  const armIdMap = new Map<string, { id: string; name: string; classId: string }>();
  const subjectIdMap = new Map<string, { id: string; title: string }>();

  // 3. Create Classes, Class Arms, and Curriculum Subjects in service_campuspro
  for (let idx = 0; idx < payload.classesList.length; idx++) {
    const cls = payload.classesList[idx];
    const className = (cls.name || '').trim();
    if (!className) continue;

    let remoteClassId = '';
    try {
      const clsRes = await campusFetch('/api/v1/campus/classes', tenantId, {
        method: 'POST',
        body: JSON.stringify({
          name: className,
          level_order: idx + 1,
          category: (cls.level || 'SECONDARY').toUpperCase(),
          curriculum: payload.curriculum || 'NERDC / WAEC Standard',
          description: `${className} (${payload.curriculum || 'NERDC'})`,
        }),
      });
      remoteClassId = String(clsRes?.id || '');
    } catch {
      // Continue
    }
    if (!remoteClassId) continue;

    classIdMap.set(String(cls.id), { id: remoteClassId, name: className });

    // Create Sections / Arms for this class
    for (const sec of cls.sections || []) {
      const armName = (sec.name || 'Arm A').trim();
      try {
        const armRes = await campusFetch('/api/v1/campus/classes/arms', tenantId, {
          method: 'POST',
          body: JSON.stringify({
            class_id: remoteClassId,
            name: armName,
            arm_code: `${className.replace(/\s+/g, '').toUpperCase()}-${armName
              .slice(0, 3)
              .toUpperCase()}`,
            room_number: sec.room_number || '',
            capacity: 35,
          }),
        });
        if (armRes?.id) {
          armIdMap.set(`${cls.id}:${sec.id}`, {
            id: String(armRes.id),
            name: armName,
            classId: remoteClassId,
          });
        }
      } catch {
        // Continue
      }
    }

    // Create Subjects for this class and map them to the class arms
    for (const subj of cls.subjects || []) {
      const subjTitle = (subj.name || '').trim();
      if (!subjTitle) continue;
      const subjCode =
        (subj.code || '').trim().toUpperCase() ||
        `${subjTitle.slice(0, 3).toUpperCase()}-${100 + idx}`;

      let remoteSubjId = '';
      try {
        const subjRes = await campusFetch('/api/v1/campus/subjects', tenantId, {
          method: 'POST',
          body: JSON.stringify({
            code: subjCode,
            title: subjTitle,
            department: 'General Academics',
            category: 'Core Compulsory',
            curriculum: payload.curriculum || 'NERDC / WAEC Standard',
            level_category: (cls.level || 'ALL').toUpperCase(),
          }),
        });
        remoteSubjId = String(subjRes?.id || '');
      } catch {
        // Continue
      }

      if (remoteSubjId) {
        subjectIdMap.set(`${cls.id}:${subj.id}`, {
          id: remoteSubjId,
          title: subjTitle,
        });
        for (const sec of cls.sections || []) {
          const armInfo = armIdMap.get(`${cls.id}:${sec.id}`);
          if (armInfo) {
            await campusFetch('/api/v1/campus/subjects/allocations', tenantId, {
              method: 'POST',
              body: JSON.stringify({
                action: 'assign_arm',
                subject_id: remoteSubjId,
                class_id: remoteClassId,
                class_name: className,
                arm_id: armInfo.id,
                arm_name: armInfo.name,
                is_compulsory: true,
              }),
            }).catch(() => {});
          }
        }
      }
    }
  }

  // 4. Create Teachers & Subject Allocations in service_campuspro
  for (const teacher of payload.teachersList || []) {
    const email = (teacher.email || '').trim();
    if (!email) continue;
    const derivedName = email
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    await campusFetch('/api/v1/campus/staff', tenantId, {
      method: 'POST',
      body: JSON.stringify({
        full_name: derivedName,
        email,
        cadre: 'TEACHING',
        designation: 'Subject Teacher',
      }),
    }).catch(() => {});

    for (const assign of teacher.assignments || []) {
      const subjInfo = subjectIdMap.get(`${assign.class_id}:${assign.subject_id}`);
      const armInfo = armIdMap.get(`${assign.class_id}:${assign.section_id}`);
      if (subjInfo) {
        await campusFetch('/api/v1/campus/subjects/allocations', tenantId, {
          method: 'POST',
          body: JSON.stringify({
            action: 'assign_teacher',
            subject_id: subjInfo.id,
            arm_id: armInfo?.id || '',
            arm_name: armInfo?.name || '',
            teacher_name: derivedName,
            role: 'Subject Teacher',
            weekly_periods: 4,
          }),
        }).catch(() => {});
      }
    }
  }

  // 5. Enroll Students into Class Arms in service_campuspro
  for (const stu of payload.studentsList || []) {
    const nameOrId = (stu.identifier || '').trim();
    if (!nameOrId) continue;
    const armInfo =
      armIdMap.get(`${stu.class_id}:${stu.section_id}`) ||
      Array.from(armIdMap.values()).find(
        (a) => a.classId === classIdMap.get(String(stu.class_id))?.id
      ) ||
      Array.from(armIdMap.values())[0];

    if (armInfo) {
      await campusFetch('/api/v1/campus/classes/arms/students', tenantId, {
        method: 'POST',
        body: JSON.stringify({
          arm_id: armInfo.id,
          student_name: nameOrId,
        }),
      }).catch(() => {});
    }
  }

  return { tenantId, slug };
}

/**
 * Queries service_campuspro for an enrolled student by Admission Number or Name.
 */
export async function lookupStudentOnCampusPro(
  admissionNumber: string,
  tenantId?: string
): Promise<{
  studentId: string;
  name: string;
  class: string;
  admissionNumber: string;
  schoolName?: string;
} | null> {
  const tid = tenantId || detectActiveTenantId();
  const q = encodeURIComponent(admissionNumber.trim());
  const data = await campusFetch(
    `/api/v1/campus/classes/arms/students?search=${q}`,
    tid
  );
  const list: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.students)
    ? data.students
    : [];
  const match =
    list.find(
      (s) =>
        String(s.admission_number || '').toLowerCase() ===
        admissionNumber.trim().toLowerCase()
    ) || list[0];
  if (!match) return null;
  return {
    studentId: String(match.student_id || match.id || ''),
    name: String(match.student_name || match.full_name || ''),
    class:
      [match.class_name, match.arm_name || match.class_arm_name]
        .filter(Boolean)
        .join(' ') || 'Enrolled Cohort',
    admissionNumber: String(match.admission_number || admissionNumber.trim()),
    schoolName: match.school_name ? String(match.school_name) : undefined,
  };
}

/**
 * Enrolls a new child directly into service_campuspro during Parent/Student Onboarding,
 * capturing full academic background (class level, curriculum, target subjects, and PuzzlePRO coding world).
 */
export async function enrollNewChildOnCampusPro(params: {
  firstName: string;
  lastName: string;
  className: string;
  curriculum?: string;
  targetSubjects?: string[];
  codingPathway?: string;
  tenantId?: string;
}): Promise<{
  studentId: string;
  name: string;
  class: string;
  admissionNumber: string;
}> {
  const tid = params.tenantId || detectActiveTenantId();
  const fullName = `${params.firstName.trim()} ${params.lastName.trim()}`.trim();

  // Resolve an arm_id from service_campuspro
  let targetArmId = '';
  let resolvedClassLabel = params.className;
  try {
    const armsData = await campusFetch('/api/v1/campus/classes/arms', tid);
    const arms: any[] = Array.isArray(armsData)
      ? armsData
      : Array.isArray(armsData?.arms)
      ? armsData.arms
      : [];
    const matched =
      arms.find((a) =>
        `${a.class_name || ''} ${a.name || ''}`
          .toLowerCase()
          .includes(params.className.toLowerCase())
      ) || arms[0];
    if (matched?.id) {
      targetArmId = String(matched.id);
      resolvedClassLabel = [matched.class_name, matched.name]
        .filter(Boolean)
        .join(' ');
    }
  } catch {
    // Ignore if no arms exist yet
  }

  if (!targetArmId) {
    // Create the class and default arm on service_campuspro
    const clsRes = await campusFetch('/api/v1/campus/classes', tid, {
      method: 'POST',
      body: JSON.stringify({
        name: params.className,
        level_order: 1,
        category: 'SECONDARY',
        curriculum: params.curriculum || 'NERDC / WAEC Standard',
      }),
    });
    if (clsRes?.id) {
      const armRes = await campusFetch('/api/v1/campus/classes/arms', tid, {
        method: 'POST',
        body: JSON.stringify({
          class_id: clsRes.id,
          name: 'Arm A',
          capacity: 35,
        }),
      });
      targetArmId = String(armRes?.id || '');
    }
  }

  const stuRes = await campusFetch(
    '/api/v1/campus/classes/arms/students',
    tid,
    {
      method: 'POST',
      body: JSON.stringify({
        arm_id: targetArmId,
        student_name: fullName,
        curriculum: params.curriculum || 'NERDC / WAEC Standard',
        target_subjects: params.targetSubjects || [],
        coding_pathway: params.codingPathway || 'World 1: Algorithmic Foundations',
      }),
    }
  );

  const studentId = String(stuRes?.student_id || stuRes?.id || '');

  // Also provision the learner's PuzzlePRO coding world assignment in service_users
  if (studentId || fullName) {
    await usersFetch('/api/v1/player/users', {
      method: 'POST',
      body: JSON.stringify({
        name: fullName,
        organisation_id: tid || 'independent',
        class_level: resolvedClassLabel,
        world: params.codingPathway || 'World 1: Algorithmic Foundations',
        subjects: params.targetSubjects || [],
      }),
    }).catch(() => {});
  }

  return {
    studentId,
    name: fullName,
    class: resolvedClassLabel,
    admissionNumber: String(stuRes?.admission_number || ''),
  };
}

/**
 * Registers the parent/student account in service_users, persists the parent + linked wards
 * in service_campuspro, and syncs their academic background (curriculum, target subjects for
 * ClassroomPRO & TutorsPRO, and PuzzlePRO coding pathway).
 */
export async function finalizeParentOnboardingInTrio(params: {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentPassword?: string;
  relationshipType: string;
  isEmergencyContact: boolean;
  curriculum?: string;
  targetSubjects?: string[];
  codingPathway?: string;
  learningGoal?: string;
  linkedWards: Array<{
    studentId?: string;
    name: string;
    admissionNumber: string;
    class: string;
  }>;
  tenantId?: string;
}): Promise<void> {
  const tid = params.tenantId || detectActiveTenantId();

  if (params.parentEmail && params.parentPassword) {
    await usersFetch('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: params.parentEmail.trim(),
        password: params.parentPassword,
        full_name: params.parentName.trim(),
        phone: params.parentPhone.trim(),
        tenant_id: tid || undefined,
      }),
    }).catch(() => {});
  }

  await campusFetch('/api/v1/campus/parents', tid, {
    method: 'POST',
    body: JSON.stringify({
      full_name: params.parentName.trim(),
      email: params.parentEmail.trim(),
      phone: params.parentPhone.trim(),
      relationship_type: params.relationshipType.toUpperCase(),
      is_emergency_contact: params.isEmergencyContact,
      portal_access_status: 'ACTIVE',
      curriculum: params.curriculum || 'NERDC / WAEC Standard',
      target_subjects: params.targetSubjects || [],
      coding_pathway: params.codingPathway || 'World 1: Algorithmic Foundations',
      learning_goal: params.learningGoal || 'WAEC / JAMB Mastery & STEM Coding',
      linked_wards: params.linkedWards.map((w) => ({
        student_id: w.studentId || '',
        student_name: w.name,
        admission_number: w.admissionNumber,
        class_arm_name: w.class,
      })),
    }),
  });

  // Sync each linked ward to PuzzlePRO player roster so their Coding World is ready
  for (const w of params.linkedWards) {
    await usersFetch('/api/v1/player/users', {
      method: 'POST',
      body: JSON.stringify({
        id: w.studentId || undefined,
        name: w.name,
        admission_number: w.admissionNumber,
        organisation_id: tid || 'independent',
        class_level: w.class,
        world: params.codingPathway || 'World 1: Algorithmic Foundations',
        subjects: params.targetSubjects || [],
      }),
    }).catch(() => {});
  }
}

/**
 * Fetches a teacher's pre-registered staff record from service_campuspro if available.
 */
export async function lookupTeacherOnCampusPro(
  email?: string,
  tenantId?: string
): Promise<{
  fullName: string;
  email: string;
  department: string;
  assignedArmName: string;
  schoolName?: string;
} | null> {
  const tid = tenantId || detectActiveTenantId();
  const q = email ? `?search=${encodeURIComponent(email.trim())}` : '';
  const data = await campusFetch(`/api/v1/campus/staff${q}`, tid);
  const staffList: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.staff)
    ? data.staff
    : [];
  const match =
    (email &&
      staffList.find(
        (s) =>
          String(s.email || '').toLowerCase() === email.trim().toLowerCase()
      )) ||
    staffList[0];
  if (!match) return null;
  return {
    fullName: String(match.full_name || ''),
    email: String(match.email || ''),
    department: String(match.department || ''),
    assignedArmName: String(match.assigned_arm_name || ''),
    schoolName: match.school_name ? String(match.school_name) : undefined,
  };
}

/**
 * Activates a teacher/tutor's account in service_users, persists/updates their staff
 * and subject allocation record in service_campuspro, and registers their tutoring
 * expertise profile in service_campuspro (/api/v1/campus/tutors) and TutorsPRO.
 */
export async function finalizeTeacherOnboardingInTrio(params: {
  name: string;
  email: string;
  password?: string;
  phone: string;
  gender: string;
  specialization: string;
  experienceLevel?: string;
  curriculum?: string;
  selectedSubjects?: string[];
  hourlyRate?: number;
  bio?: string;
  tutorMode?: 'SCHOOL_STAFF' | 'INDEPENDENT_TUTOR' | 'BOTH';
  tenantId?: string;
}): Promise<void> {
  const tid = params.tenantId || detectActiveTenantId();

  // 1. Central Identity Signup in service_users
  if (params.email && params.password) {
    await usersFetch('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: params.email.trim(),
        password: params.password,
        full_name: params.name.trim(),
        phone: params.phone.trim(),
        sex: params.gender,
        tenant_id: tid || undefined,
      }),
    }).catch(() => {});
  }

  // 2. CampusPRO Staff Record (for school teachers & dual-mode educators)
  if (params.tutorMode !== 'INDEPENDENT_TUTOR' || tid) {
    await campusFetch('/api/v1/campus/staff', tid, {
      method: 'POST',
      body: JSON.stringify({
        full_name: params.name.trim(),
        email: params.email.trim(),
        phone: params.phone.trim(),
        gender: params.gender.toUpperCase(),
        department: params.specialization || 'General Academics',
        qualification: params.experienceLevel || params.specialization,
        cadre: 'TEACHING',
        designation: 'Subject Teacher',
      }),
    }).catch(() => {});
  }

  // 3. CampusPRO & TutorsPRO Educator Profile (/api/v1/campus/tutors)
  await campusFetch('/api/v1/campus/tutors', tid, {
    method: 'POST',
    body: JSON.stringify({
      full_name: params.name.trim(),
      email: params.email.trim(),
      phone: params.phone.trim(),
      specialization: params.specialization || 'General Academics',
      experience_level: params.experienceLevel || 'Certified Teacher',
      curriculum: params.curriculum || 'NERDC / WAEC Standard',
      subjects: params.selectedSubjects || [],
      hourly_rate: params.hourlyRate || 5000,
      bio: params.bio || '',
      mode: params.tutorMode || 'BOTH',
    }),
  }).catch(() => {});

  // 4. TutorsPRO Marketplace Onboarding endpoint
  const tutorsBase = TUTORS_API_BASE.replace(/\/+$/, '');
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('token')
      : null;
  await fetch(`${tutorsBase}/api/v1/tutor/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      full_name: params.name.trim(),
      email: params.email.trim(),
      bio: params.bio || '',
      hourly_rate: params.hourlyRate || 5000,
      experience_level: params.experienceLevel || 'Certified Teacher',
      specialization: params.specialization || '',
      curriculum: params.curriculum || 'NERDC / WAEC Standard',
      subjects_json: JSON.stringify(params.selectedSubjects || []),
      tenant_id: tid || undefined,
    }),
  }).catch(() => {});
}
