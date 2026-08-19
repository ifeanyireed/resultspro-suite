import { User, School, SubscriptionPlan, Invoice, PayoutRequest, ScratchCardBatch, BlogPost, SuiteStats } from './types';

const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'http://localhost:7000';
const RESULTS_API = process.env.NEXT_PUBLIC_RESULTS_API || 'http://localhost:5000';
const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'http://localhost:8080';
const CLASSROOM_API = process.env.NEXT_PUBLIC_CLASSROOM_API || 'http://localhost:8080';
const TUTORS_API = process.env.NEXT_PUBLIC_TUTORS_API || 'http://localhost:8080';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('resultspro_admin_token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchSuiteStats(): Promise<SuiteStats> {
  return {
    totalUsers: 4850,
    totalSchools: 142,
    verifiedSchools: 118,
    pendingVerifications: 24,
    activeSubscriptions: 86,
    totalRevenue: 24500000,
    activeAgents: 38,
    cbtExamsCount: 520,
    activeTutors: 84,
  };
}

// 2. Schools Management
export async function fetchSchools(): Promise<School[]> {
  return [
    { id: '1', name: 'Greenwood High', contact_email: 'admin@greenwood.edu', subscription_tier: 'PRO', verification_status: 'PENDING_VERIFICATION', created_at: new Date().toISOString(), school_code: 'GWH', address: 'Lagos', phone_number: '08012345678', logo_url: '' },
    { id: '2', name: 'Kings College', contact_email: 'info@kingscollege.edu', subscription_tier: 'ENTERPRISE', verification_status: 'VERIFIED', created_at: new Date().toISOString(), school_code: 'KCL', address: 'Lagos', phone_number: '08012345678', logo_url: '' },
    { id: '3', name: 'Queens College', contact_email: 'contact@queenscollege.edu', subscription_tier: 'PRO', verification_status: 'VERIFIED', created_at: new Date().toISOString(), school_code: 'QCL', address: 'Lagos', phone_number: '08012345678', logo_url: '' },
  ];
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
  return [
    { id: 'p1', agent_id: 'a1', amount: 75000, status: 'PENDING', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), bank_name: 'Zenith Bank', account_number: '1029384756', account_name: 'Chinedu Okafor' },
    { id: 'p2', agent_id: 'a2', amount: 120000, status: 'PENDING', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), bank_name: 'Access Bank', account_number: '0039281745', account_name: 'Folake Adeleke' },
  ];
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
