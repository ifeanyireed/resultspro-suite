import { User, School, SubscriptionPlan, Invoice, PayoutRequest, ScratchCardBatch, BlogPost, SuiteStats } from './types';

const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
const RESULTS_API = process.env.NEXT_PUBLIC_RESULTS_API || 'http://localhost:5000';
const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'http://localhost:8080';
const CLASSROOM_API = process.env.NEXT_PUBLIC_CLASSROOM_API || 'http://localhost:8080';
const TUTORS_API = process.env.NEXT_PUBLIC_TUTORS_API || 'http://localhost:8080';
const COURSES_API = process.env.NEXT_PUBLIC_COURSES_API || 'http://localhost:8080';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('resultspro_admin_token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchSuiteStats(): Promise<SuiteStats> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/admin/stats`, { headers: getAuthHeader() });
    return await res.json();
  } catch {
    return {
      totalUsers: 0,
      totalSchools: 0,
      verifiedSchools: 0,
      pendingVerifications: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
      activeAgents: 0,
      cbtExamsCount: 0,
      activeTutors: 0,
    };
  }
}

// 2. Schools Management
export async function fetchSchools(): Promise<School[]> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/tenants`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data) ? data : (data.tenants || []);
  } catch {
    return [];
  }
}

export async function createTenant(payload: any): Promise<boolean> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function verifySchool(schoolId: string, status: 'VERIFIED' | 'REJECTED', reason?: string): Promise<boolean> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/schools/${schoolId}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, reason }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 3. User Management
export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/users`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data) ? data : (data.users || []);
  } catch {
    return [];
  }
}

export async function updateUserStatus(userId: string, status: string): Promise<boolean> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 4. Subscriptions & Billing
export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/billing/plans`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchInvoices(schoolId?: string): Promise<Invoice[]> {
  try {
    const url = schoolId ? `${USERS_API}/api/v1/billing/invoices/school/${schoolId}` : `${USERS_API}/api/v1/billing/invoices`;
    const res = await fetch(url, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// 5. Agents & Payouts
export async function fetchPayoutRequests(): Promise<PayoutRequest[]> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/admin/payouts`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function processPayout(payoutId: string, action: 'APPROVE' | 'REJECT' | 'MARK_PAID'): Promise<boolean> {
  try {
    const res = await fetch(`${USERS_API}/api/v1/agents/payouts/${payoutId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ action }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 6. ResultPRO Scratch Cards
export async function generateScratchCardBatch(schoolId: string, quantity: number, unitCost: number): Promise<any> {
  try {
    const res = await fetch(`${RESULTS_API}/api/v1/cards/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ school_id: schoolId, quantity, unit_cost: unitCost }),
    });
    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}

// 7. Blog & CMS
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${EXAMS_API}/api/blog`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.posts || []);
  } catch {
    return [];
  }
}

// --- EXAMSPRO API ---

export async function fetchExamproOverview() {
  try {
    const res = await fetch(`${EXAMS_API}/api/v1/admin/overview`, { headers: getAuthHeader() });
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchExamproExams() {
  try {
    const res = await fetch(`${EXAMS_API}/api/v1/admin/exams`, { headers: getAuthHeader() });
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchExamproQuestions() {
  try {
    const res = await fetch(`${EXAMS_API}/api/v1/admin/questions`, { headers: getAuthHeader() });
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchExamproBattles() {
  try {
    const res = await fetch(`${EXAMS_API}/api/v1/admin/battles/monitor-stats`, { headers: getAuthHeader() });
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchExamproUsers() {
  try {
    const res = await fetch(`${EXAMS_API}/api/v1/admin/users`, { headers: getAuthHeader() });
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchExamproFinancials() {
  try {
    const res = await fetch(`${EXAMS_API}/api/v1/admin/finances/stats`, { headers: getAuthHeader() });
    return await res.json();
  } catch {
    return null;
  }
}

// --- CLASSROOMPRO API ---
export async function fetchClassroomNotes() {
  try {
    const res = await fetch(`${CLASSROOM_API}/api/notes`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.notes) ? data.notes : [];
  } catch {
    return [];
  }
}

export async function fetchClassroomQuizzes() {
  try {
    const res = await fetch(`${CLASSROOM_API}/api/quizzes`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.quizzes) ? data.quizzes : [];
  } catch {
    return [];
  }
}

export async function fetchClassroomFlashcards() {
  try {
    const res = await fetch(`${CLASSROOM_API}/api/flashcards`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.flashcards) ? data.flashcards : [];
  } catch {
    return [];
  }
}

// --- TUTORSPRO API ---
export async function fetchTutorsproTutors() {
  try {
    const res = await fetch(`${TUTORS_API}/api/admin/tutors`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.tutors) ? data.tutors : [];
  } catch {
    return [];
  }
}

export async function fetchTutorsproBookings() {
  try {
    const res = await fetch(`${TUTORS_API}/api/admin/bookings`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.bookings) ? data.bookings : [];
  } catch {
    return [];
  }
}

export async function fetchTutorsproPayouts() {
  try {
    const res = await fetch(`${TUTORS_API}/api/admin/payouts`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.payouts) ? data.payouts : [];
  } catch {
    return [];
  }
}

// --- COURSESPRO API ---
export async function fetchCoursesproCohorts() {
  try {
    const res = await fetch(`${COURSES_API}/api/admin/cohorts`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.cohorts) ? data.cohorts : [];
  } catch {
    return [];
  }
}

export async function fetchCoursesproEnrollments() {
  try {
    const res = await fetch(`${COURSES_API}/api/admin/enrollments`, { headers: getAuthHeader() });
    const data = await res.json();
    return Array.isArray(data.enrollments) ? data.enrollments : [];
  } catch {
    return [];
  }
}
