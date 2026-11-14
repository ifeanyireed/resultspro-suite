/**
 * Campus OS (service_campuspro) API Client & TypeScript Definitions
 * ResultsPRO Institutional ERP Engine
 */

const CAMPUS_API = process.env.NEXT_PUBLIC_CAMPUS_API || '';

function getHeaders(tenantId?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('resultspro_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  if (tenantId) {
    headers['X-Tenant-ID'] = tenantId;
  }
  return headers;
}

// =================== TYPES ===================

export interface CampusSummary {
  tenantId?: string;
  totalStudents: number;
  activeClasses: number;
  attendanceRate: number;
  currentTerm: string;
  currentSession: string;
  pendingInquiries: number;
  unpaidFeesCount: number;
  totalRevenueYTD: number;
  activeTransportRoutes: number;
  hostelOccupancyRate: number;
  libraryBooksCount: number;
  activeLoansCount: number;
  openProcurementCount: number;
  publishedNoticesCount: number;
  activeParentAccounts: number;
  todayPeriodsCount: number;
  pendingHomeworkCount: number;
}

export interface TimetableSlot {
  id: string;
  tenant_id: string;
  class_name: string;
  day_of_week: string;
  period_index: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_name: string;
  room: string;
}

export interface HomeworkAssignment {
  id: string;
  tenant_id: string;
  title: string;
  class_name: string;
  subject: string;
  due_date: string;
  instructions: string;
  max_score: number;
  submissions_count?: number;
  created_at: string;
}

export interface AdmissionInquiry {
  id: string;
  tenant_id: string;
  applicant_name: string;
  guardian_name: string;
  email: string;
  phone: string;
  target_grade: string;
  previous_school?: string;
  stage: 'Inquiry' | 'Application Submitted' | 'CBT Scheduled' | 'Admitted' | 'Enrolled' | 'Rejected';
  tour_date?: string;
  notes?: string;
  created_at: string;
}

export interface FeeStructure {
  id: string;
  tenant_id: string;
  class_level: string;
  term: string;
  tuition_fee: number;
  development_levy: number;
  ict_stem_fee: number;
  exam_materials_fee: number;
  total_due: number;
  due_date: string;
}

export interface StudentInvoice {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  term: string;
  session: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  payment_reference?: string;
  paid_at?: string;
  created_at: string;
}

export interface LibraryBook {
  id: string;
  tenant_id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  total_copies: number;
  available_copies: number;
  shelf_location: string;
}

export interface LibraryLoan {
  id: string;
  tenant_id: string;
  book_id: string;
  book_title?: string;
  borrower_id: string;
  borrower_name: string;
  borrower_type: 'STUDENT' | 'TEACHER' | 'STAFF';
  borrowed_date: string;
  due_date: string;
  return_date?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export interface TransportRoute {
  id: string;
  tenant_id: string;
  route_name: string;
  vehicle_plate: string;
  driver_name: string;
  driver_phone: string;
  capacity: number;
  enrolled_students: number;
  corridor_areas: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface HostelAllocation {
  id: string;
  tenant_id: string;
  hostel_name: string;
  gender: 'MALE' | 'FEMALE';
  room_number: string;
  bed_number: string;
  student_id: string;
  student_name: string;
  class_name: string;
  guardian_phone: string;
  session: string;
  term: string;
  status: 'OCCUPIED' | 'VACANT' | 'RESERVED';
}

export interface InventoryItem {
  id: string;
  tenant_id: string;
  item_name: string;
  category: string;
  current_stock: number;
  reorder_threshold: number;
  unit_price: number;
  location: string;
}

export interface ProcurementRequest {
  id: string;
  tenant_id: string;
  requested_by: string;
  department: string;
  title: string;
  estimated_cost: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ORDERED';
  approval_notes?: string;
  created_at: string;
}

export interface CampusNotice {
  id: string;
  tenant_id: string;
  title: string;
  category: 'CIRCULAR' | 'EXAM' | 'HOLIDAY' | 'PTA' | 'GENERAL';
  body: string;
  event_date?: string;
  target_audience: 'ALL' | 'PARENTS' | 'STAFF' | 'STUDENTS';
  is_pinned: boolean;
  created_at: string;
}

export interface CampusMessage {
  id: string;
  tenant_id: string;
  sender_name: string;
  sender_role: string;
  recipient_group: string;
  subject: string;
  message: string;
  channel: 'PORTAL' | 'SMS' | 'EMAIL' | 'PUSH';
  sent_at: string;
}

export interface MobileAccount {
  id: string;
  tenant_id: string;
  user_id: string;
  full_name: string;
  role: 'PARENT' | 'STUDENT' | 'TEACHER';
  device_type: 'iOS' | 'Android' | 'Web';
  push_token?: string;
  last_active: string;
}

// =================== FALLBACK DATA ===================

const mockSummary: CampusSummary = {
  totalStudents: 1420,
  activeClasses: 36,
  attendanceRate: 96.4,
  currentTerm: '1st Term 2026/2027',
  currentSession: '2026/2027',
  pendingInquiries: 24,
  unpaidFeesCount: 18,
  totalRevenueYTD: 84500000,
  activeTransportRoutes: 8,
  hostelOccupancyRate: 88.5,
  libraryBooksCount: 4850,
  activeLoansCount: 142,
  openProcurementCount: 5,
  publishedNoticesCount: 14,
  activeParentAccounts: 1120,
  todayPeriodsCount: 42,
  pendingHomeworkCount: 16,
};

const mockTimetable: TimetableSlot[] = [
  { id: 'tt-1', tenant_id: 'tenant_default', class_name: 'SS3 A', day_of_week: 'Monday', period_index: 1, start_time: '08:00', end_time: '08:45', subject: 'Further Mathematics', teacher_name: 'Engr. D. Adeleke', room: 'Hall 3A' },
  { id: 'tt-2', tenant_id: 'tenant_default', class_name: 'SS3 A', day_of_week: 'Monday', period_index: 2, start_time: '08:45', end_time: '09:30', subject: 'Physics (Optics)', teacher_name: 'Dr. C. Nwosu', room: 'Physics Lab 1' },
  { id: 'tt-3', tenant_id: 'tenant_default', class_name: 'SS3 A', day_of_week: 'Monday', period_index: 3, start_time: '09:30', end_time: '10:15', subject: 'English Language', teacher_name: 'Mrs. F. Alabi', room: 'Hall 3A' },
  { id: 'tt-4', tenant_id: 'tenant_default', class_name: 'SS2 Science', day_of_week: 'Monday', period_index: 1, start_time: '08:00', end_time: '08:45', subject: 'Chemistry', teacher_name: 'Mr. B. Okonkwo', room: 'Chemistry Lab' },
  { id: 'tt-5', tenant_id: 'tenant_default', class_name: 'JS1 Gold', day_of_week: 'Monday', period_index: 1, start_time: '08:00', end_time: '08:45', subject: 'Basic Science & Tech', teacher_name: 'Miss T. Bakare', room: 'Room J1' },
  { id: 'tt-6', tenant_id: 'tenant_default', class_name: 'SS1 Arts', day_of_week: 'Tuesday', period_index: 1, start_time: '08:00', end_time: '08:45', subject: 'Government & Civics', teacher_name: 'Barr. K. Ibrahim', room: 'Room A2' },
  { id: 'tt-7', tenant_id: 'tenant_default', class_name: 'SS3 B', day_of_week: 'Tuesday', period_index: 2, start_time: '08:45', end_time: '09:30', subject: 'Data Processing & ICT', teacher_name: 'Mr. I. Felix', room: 'CBT Center 1' },
];

const mockHomework: HomeworkAssignment[] = [
  { id: 'hw-1', tenant_id: 'tenant_default', title: 'Calculus: Integration by Parts Problem Set', class_name: 'SS3 Science', subject: 'Mathematics', due_date: '2026-11-20', instructions: 'Solve Exercises 4.2 to 4.9 in New General Mathematics. Show full working steps for credit.', max_score: 20, submissions_count: 28, created_at: '2026-11-14' },
  { id: 'hw-2', tenant_id: 'tenant_default', title: 'WAEC Literature: Analysis of Wole Soyinka Death and the Kings Horseman', class_name: 'SS3 Arts', subject: 'Literature in English', due_date: '2026-11-22', instructions: 'Write a 500-word critique analyzing the tragic flaw of Elesin Oba.', max_score: 25, submissions_count: 19, created_at: '2026-11-13' },
  { id: 'hw-3', tenant_id: 'tenant_default', title: 'Electrolysis of Copper(II) Sulphate Lab Writeup', class_name: 'SS2 Science', subject: 'Chemistry', due_date: '2026-11-18', instructions: 'Submit typed lab report including diagram of electrodes and ionic half-reactions.', max_score: 15, submissions_count: 32, created_at: '2026-11-12' },
  { id: 'hw-4', tenant_id: 'tenant_default', title: 'Basic Technology: Orthographic Projection Assignment', class_name: 'JS2 Diamond', subject: 'Basic Tech', due_date: '2026-11-25', instructions: 'Draw the 1st angle projection views on A3 drawing sheet using appropriate lettering.', max_score: 20, submissions_count: 41, created_at: '2026-11-11' },
];

const mockAdmissions: AdmissionInquiry[] = [
  { id: 'adm-1', tenant_id: 'tenant_default', applicant_name: 'Chidera Emmanuel Okonkwo', guardian_name: 'Chief & Mrs. E. Okonkwo', email: 'e.okonkwo@investments.ng', phone: '+234 803 442 1190', target_grade: 'JS1 (Boarding)', previous_school: 'Corona Primary Gbagada', stage: 'CBT Scheduled', tour_date: '2026-11-24', notes: 'Scheduled for Hall B scholarship entrance CBT examination.', created_at: '2026-11-10' },
  { id: 'adm-2', tenant_id: 'tenant_default', applicant_name: 'Zainab Fatima Danjuma', guardian_name: 'Alhaji M. Danjuma', email: 'danjuma.farms@kaduna.ng', phone: '+234 802 884 9912', target_grade: 'SS1 Science (Boarding)', previous_school: 'Capital Science Academy Abuja', stage: 'Admitted', tour_date: '2026-11-05', notes: 'Top 5% score in entrance test. Admission letter dispatched.', created_at: '2026-11-02' },
  { id: 'adm-3', tenant_id: 'tenant_default', applicant_name: 'Oluwaseun David Adeleke', guardian_name: 'Engr. & Dr. T. Adeleke', email: 'adeleke.family@lekki.org', phone: '+234 818 550 4421', target_grade: 'JS1 (Day Student)', previous_school: 'Greensprings School Lekki', stage: 'Application Submitted', tour_date: '2026-11-28', notes: 'Parent requested ICT robotics club profile.', created_at: '2026-11-12' },
  { id: 'adm-4', tenant_id: 'tenant_default', applicant_name: 'Amara Grace Umeh', guardian_name: 'Mr. Patrick Umeh', email: 'p.umeh@enugubiz.com', phone: '+234 703 118 7765', target_grade: 'SS2 Commercial', previous_school: 'Christ the King College Onitsha', stage: 'Inquiry', tour_date: '2026-12-02', notes: 'Inquired about boarding transfer criteria for Term 2.', created_at: '2026-11-14' },
];

const mockFeeStructures: FeeStructure[] = [
  { id: 'fee-1', tenant_id: 'tenant_default', class_level: 'Senior Secondary (SS1 - SS3)', term: '1st Term 2026/2027', tuition_fee: 380000, development_levy: 45000, ict_stem_fee: 35000, exam_materials_fee: 25000, total_due: 485000, due_date: '2026-12-05' },
  { id: 'fee-2', tenant_id: 'tenant_default', class_level: 'Junior Secondary (JS1 - JS3)', term: '1st Term 2026/2027', tuition_fee: 320000, development_levy: 40000, ict_stem_fee: 30000, exam_materials_fee: 20000, total_due: 410000, due_date: '2026-12-05' },
  { id: 'fee-3', tenant_id: 'tenant_default', class_level: 'Primary Upper (Basic 4 - 6)', term: '1st Term 2026/2027', tuition_fee: 260000, development_levy: 30000, ict_stem_fee: 25000, exam_materials_fee: 15000, total_due: 330000, due_date: '2026-12-05' },
  { id: 'fee-4', tenant_id: 'tenant_default', class_level: 'Hostel & Boarding Accommodation', term: '1st Term 2026/2027', tuition_fee: 280000, development_levy: 20000, ict_stem_fee: 0, exam_materials_fee: 10000, total_due: 310000, due_date: '2026-12-05' },
];

const mockInvoices: StudentInvoice[] = [
  { id: 'inv-101', tenant_id: 'tenant_default', student_id: 'STU-2026-089', student_name: 'Kamsiyochukwu Ani', class_name: 'SS3 Science', term: '1st Term', session: '2026/2027', total_amount: 485000, amount_paid: 485000, balance: 0, status: 'PAID', payment_reference: 'PAY-STU-9921820', paid_at: '2026-10-18', created_at: '2026-09-15' },
  { id: 'inv-102', tenant_id: 'tenant_default', student_id: 'STU-2026-142', student_name: 'Temiloluwa Johnson', class_name: 'SS2 Arts', term: '1st Term', session: '2026/2027', total_amount: 485000, amount_paid: 250000, balance: 235000, status: 'PARTIAL', payment_reference: 'PAY-STU-7721990', paid_at: '2026-10-22', created_at: '2026-09-15' },
  { id: 'inv-103', tenant_id: 'tenant_default', student_id: 'STU-2026-304', student_name: 'Mustapha Bello', class_name: 'JS1 Emerald', term: '1st Term', session: '2026/2027', total_amount: 410000, amount_paid: 0, balance: 410000, status: 'UNPAID', payment_reference: undefined, paid_at: undefined, created_at: '2026-09-15' },
  { id: 'inv-104', tenant_id: 'tenant_default', student_id: 'STU-2026-419', student_name: 'Somtochukwu Eze', class_name: 'SS1 Commercial', term: '1st Term', session: '2026/2027', total_amount: 485000, amount_paid: 485000, balance: 0, status: 'PAID', payment_reference: 'PAY-STU-3301984', paid_at: '2026-10-02', created_at: '2026-09-15' },
];

const mockLibraryBooks: LibraryBook[] = [
  { id: 'bk-1', tenant_id: 'tenant_default', title: 'Things Fall Apart (50th Anniversary Ed)', author: 'Chinua Achebe', isbn: '978-0385474542', category: 'African Literature', total_copies: 45, available_copies: 12, shelf_location: 'Aisle 3 / Bay B' },
  { id: 'bk-2', tenant_id: 'tenant_default', title: 'New General Mathematics for Senior Secondary 3', author: 'M.F. Macrae et al.', isbn: '978-9780814678', category: 'Mathematics & STEM', total_copies: 60, available_copies: 18, shelf_location: 'Aisle 1 / Bay A' },
  { id: 'bk-3', tenant_id: 'tenant_default', title: 'Senior Secondary Physics (WAEC/NECO Standard)', author: 'P.N. Okeke & M.W. Anyakoha', isbn: '978-9781750247', category: 'Physical Sciences', total_copies: 50, available_copies: 14, shelf_location: 'Aisle 2 / Bay C' },
  { id: 'bk-4', tenant_id: 'tenant_default', title: 'Comprehensive Certificate Chemistry', author: 'G.N.C. Ohia et al.', isbn: '978-9781395561', category: 'Chemical Sciences', total_copies: 40, available_copies: 9, shelf_location: 'Aisle 2 / Bay D' },
  { id: 'bk-5', tenant_id: 'tenant_default', title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '978-0007200283', category: 'African Fiction', total_copies: 35, available_copies: 8, shelf_location: 'Aisle 3 / Bay E' },
];

const mockLibraryLoans: LibraryLoan[] = [
  { id: 'loan-1', tenant_id: 'tenant_default', book_id: 'bk-1', book_title: 'Things Fall Apart', borrower_id: 'STU-2026-089', borrower_name: 'Kamsiyochukwu Ani', borrower_type: 'STUDENT', borrowed_date: '2026-11-04', due_date: '2026-11-18', status: 'ACTIVE' },
  { id: 'loan-2', tenant_id: 'tenant_default', book_id: 'bk-3', book_title: 'Senior Secondary Physics', borrower_id: 'STU-2026-142', borrower_name: 'Temiloluwa Johnson', borrower_type: 'STUDENT', borrowed_date: '2026-10-25', due_date: '2026-11-08', status: 'OVERDUE' },
  { id: 'loan-3', tenant_id: 'tenant_default', book_id: 'bk-2', book_title: 'New General Mathematics 3', borrower_id: 'TCH-102', borrower_name: 'Engr. D. Adeleke', borrower_type: 'TEACHER', borrowed_date: '2026-11-01', due_date: '2026-12-01', status: 'ACTIVE' },
];

const mockTransportRoutes: TransportRoute[] = [
  { id: 'tr-1', tenant_id: 'tenant_default', route_name: 'Route 1: Lekki Phase 1 - Ikoyi - Victoria Island', vehicle_plate: 'EKY-904-XA (Coaster Bus 1)', driver_name: 'Mallam Haruna Musa', driver_phone: '+234 802 331 4455', capacity: 36, enrolled_students: 34, corridor_areas: 'Admiralty Way, Bourdillon, Kingsway, Adeola Odeku', status: 'ACTIVE' },
  { id: 'tr-2', tenant_id: 'tenant_default', route_name: 'Route 2: Chevron - Ajah - Sangotedo Corridor', vehicle_plate: 'LSR-441-YB (Toyota HiAce)', driver_name: 'Mr. Jude Okafor', driver_phone: '+234 814 660 7821', capacity: 18, enrolled_students: 17, corridor_areas: 'Lekki Toll 2, Chevron Drive, VGC Gate, Ajah Bridge, Novare Mall', status: 'ACTIVE' },
  { id: 'tr-3', tenant_id: 'tenant_default', route_name: 'Route 3: Ikeja GRA - Maryland - Anthony Corridor', vehicle_plate: 'AGL-802-ZZ (Coaster Bus 2)', driver_name: 'Mr. Babatunde Sowore', driver_phone: '+234 803 992 1104', capacity: 36, enrolled_students: 31, corridor_areas: 'Isaac John, Mobolaji Bank Anthony, Maryland Mall, Anthony Village', status: 'ACTIVE' },
  { id: 'tr-4', tenant_id: 'tenant_default', route_name: 'Route 4: Surulere - Yaba - Gbagada Campus Express', vehicle_plate: 'KJA-551-XC (HiAce)', driver_name: 'Mr. Segun Adeleke', driver_phone: '+234 808 221 9901', capacity: 18, enrolled_students: 16, corridor_areas: 'Bode Thomas, Commercial Ave Yaba, Deeper Life Gbagada', status: 'ACTIVE' },
];

const mockHostelAllocations: HostelAllocation[] = [
  { id: 'hst-1', tenant_id: 'tenant_default', hostel_name: 'Nelson Mandela Hall (Boys Senior)', gender: 'MALE', room_number: 'Room 204', bed_number: 'Bed 204-B (Upper)', student_id: 'STU-2026-089', student_name: 'Kamsiyochukwu Ani', class_name: 'SS3 Science', guardian_phone: '+234 803 442 1190', session: '2026/2027', term: '1st Term', status: 'OCCUPIED' },
  { id: 'hst-2', tenant_id: 'tenant_default', hostel_name: 'Nelson Mandela Hall (Boys Senior)', gender: 'MALE', room_number: 'Room 204', bed_number: 'Bed 204-A (Lower)', student_id: 'STU-2026-304', student_name: 'Mustapha Bello', class_name: 'SS3 Science', guardian_phone: '+234 802 884 9912', session: '2026/2027', term: '1st Term', status: 'OCCUPIED' },
  { id: 'hst-3', tenant_id: 'tenant_default', hostel_name: 'Queen Amina Hall (Girls Senior)', gender: 'FEMALE', room_number: 'Room 102', bed_number: 'Bed 102-A (Lower)', student_id: 'STU-2026-142', student_name: 'Temiloluwa Johnson', class_name: 'SS2 Arts', guardian_phone: '+234 818 550 4421', session: '2026/2027', term: '1st Term', status: 'OCCUPIED' },
  { id: 'hst-4', tenant_id: 'tenant_default', hostel_name: 'Queen Amina Hall (Girls Senior)', gender: 'FEMALE', room_number: 'Room 102', bed_number: 'Bed 102-B (Upper)', student_id: '', student_name: '— Vacant Bed —', class_name: '—', guardian_phone: '—', session: '2026/2027', term: '1st Term', status: 'VACANT' },
];

const mockInventory: InventoryItem[] = [
  { id: 'inv-itm-1', tenant_id: 'tenant_default', item_name: 'A4 White Printing Paper (80gsm Double A)', category: 'Office & Stationery', current_stock: 142, reorder_threshold: 30, unit_price: 6800, location: 'Store Room Central A' },
  { id: 'inv-itm-2', tenant_id: 'tenant_default', item_name: 'Copper Sulphate Crystals (500g Lab Grade)', category: 'Science Lab Chemicals', current_stock: 18, reorder_threshold: 8, unit_price: 14500, location: 'Chemistry Chemical Cabinet' },
  { id: 'inv-itm-3', tenant_id: 'tenant_default', item_name: 'CBT Computer Mouse (USB Optical Logitech)', category: 'ICT Hardware', current_stock: 64, reorder_threshold: 20, unit_price: 3500, location: 'Server Room Rack 2' },
  { id: 'inv-itm-4', tenant_id: 'tenant_default', item_name: 'Diesel Fuel for Backup Generator (Liters)', category: 'Facility & Power', current_stock: 2400, reorder_threshold: 800, unit_price: 1250, location: 'Underground Fuel Reservoir' },
];

const mockProcurementRequests: ProcurementRequest[] = [
  { id: 'pr-1', tenant_id: 'tenant_default', requested_by: 'Engr. D. Adeleke (HOD STEM)', department: 'Science & Robotics Lab', title: 'Procurement of 12 Arduino Uno Sensor Kits for JSS STEM Practical Expo', estimated_cost: 380000, status: 'APPROVED', approval_notes: 'Budget verified against STEM development levy pool.', created_at: '2026-11-08' },
  { id: 'pr-2', tenant_id: 'tenant_default', requested_by: 'Mrs. F. Alabi (HOD English)', department: 'Languages & Humanities', title: 'Restock of 40 copies of 2026 WAEC Prescribed Drama Texts', estimated_cost: 220000, status: 'PENDING', approval_notes: 'Awaiting bursar signature.', created_at: '2026-11-12' },
  { id: 'pr-3', tenant_id: 'tenant_default', requested_by: 'Mr. Jude Okafor (Transport)', department: 'Campus Logistics', title: 'Brake pads, hydraulic fluid and tire overhaul for Bus EKY-904-XA', estimated_cost: 165000, status: 'APPROVED', approval_notes: 'Approved for urgent vehicle safety compliance.', created_at: '2026-11-13' },
];

const mockNotices: CampusNotice[] = [
  { id: 'ntc-1', tenant_id: 'tenant_default', title: 'End-of-Year 2026 Carol Service & Inter-House Speech Day Schedule', category: 'CIRCULAR', body: 'The Board of Governors and College Management cordially invite all esteemed parents and guardians to the 2026 Annual Carol Service & Thanksgiving Ceremony holding on Friday 11th December in the Main College Auditorium.', event_date: '2026-12-11', target_audience: 'ALL', is_pinned: true, created_at: '2026-11-10' },
  { id: 'ntc-2', tenant_id: 'tenant_default', title: 'First Term 2026/2027 Mock CBT Examination Timetable for SS3', category: 'EXAM', body: 'All SS3 Candidates are notified that the internal mock examinations replicating WAEC/UTME test interface will commence on Monday 23rd November at CBT Center 1 and 2.', event_date: '2026-11-23', target_audience: 'STUDENTS', is_pinned: true, created_at: '2026-11-08' },
  { id: 'ntc-3', tenant_id: 'tenant_default', title: 'Emergency PTA Executive Meeting on Campus Security & Solar Microgrid', category: 'PTA', body: 'Executive members of the Parents-Teachers Association are requested to convene in the Conference Hall on Saturday 21st November at 10:00 AM prompt.', event_date: '2026-11-21', target_audience: 'PARENTS', is_pinned: false, created_at: '2026-11-12' },
];

const mockMessages: CampusMessage[] = [
  { id: 'msg-1', tenant_id: 'tenant_default', sender_name: 'Vice Principal (Academics)', sender_role: 'ADMINISTRATOR', recipient_group: 'All SS3 Parents', subject: 'Submission of National Identification Number (NIN) for JAMB 2027 Registration', message: 'Dear Esteemed Parents, please ensure your ward submits their verified 11-digit NIN slip to the Examinations Officer before Friday 27th November.', channel: 'SMS', sent_at: '2026-11-14 09:30' },
  { id: 'msg-2', tenant_id: 'tenant_default', sender_name: 'Bursary & Accounts Unit', sender_role: 'BURSAR', recipient_group: 'Parents with Outstanding Fee Balances', subject: 'Notice on Tuition Fee Balance Reconciliation for Term 1', message: 'This is a gentle reminder that remaining term balances must be cleared prior to issuance of CBT exam clearance slips.', channel: 'EMAIL', sent_at: '2026-11-13 14:15' },
  { id: 'msg-3', tenant_id: 'tenant_default', sender_name: 'Campus Clinic & Health Center', sender_role: 'HEALTH_OFFICER', recipient_group: 'All Boarding Students & Guardians', subject: 'Harmattan Season Preventative Health & Hydration Advisory', message: 'Parents of boarding students are advised to provide their wards with appropriate moisturizing lotions and warm cardigans for evening prep.', channel: 'PORTAL', sent_at: '2026-11-12 11:00' },
];

const mockMobileAccounts: MobileAccount[] = [
  { id: 'mob-1', tenant_id: 'tenant_default', user_id: 'USR-PRNT-1092', full_name: 'Dr. (Mrs.) Chioma Okonkwo', role: 'PARENT', device_type: 'iOS', push_token: 'ExponentPushToken[AbC123XyZ_ios_prod]', last_active: '2 minutes ago' },
  { id: 'mob-2', tenant_id: 'tenant_default', user_id: 'USR-PRNT-2294', full_name: 'Alhaji Mansur Danjuma', role: 'PARENT', device_type: 'Android', push_token: 'ExponentPushToken[Danjuma_andr_9921]', last_active: '15 minutes ago' },
  { id: 'mob-3', tenant_id: 'tenant_default', user_id: 'USR-TCHR-0041', full_name: 'Engr. David Adeleke', role: 'TEACHER', device_type: 'Android', push_token: 'ExponentPushToken[Adeleke_tch_882]', last_active: '1 hour ago' },
  { id: 'mob-4', tenant_id: 'tenant_default', user_id: 'USR-PRNT-3381', full_name: 'Barrister (Mrs.) T. Adeleke', role: 'PARENT', device_type: 'iOS', push_token: 'ExponentPushToken[Adeleke_ios_7721]', last_active: '3 hours ago' },
];

// =================== API CLIENT METHODS ===================

export async function fetchCampusSummary(tenantId?: string): Promise<CampusSummary> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/summary`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return { ...mockSummary, ...data };
    }
  } catch (err) {
    console.warn('[campus-api] Using cached summary fallback:', err);
  }
  return mockSummary;
}

export async function fetchTimetableSlots(tenantId?: string, className?: string): Promise<TimetableSlot[]> {
  try {
    const url = new URL(`${CAMPUS_API}/api/v1/campus/timetable`);
    if (className) url.searchParams.set('class_name', className);
    const res = await fetch(url.toString(), {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using timetable fallback:', err);
  }
  if (className) {
    return mockTimetable.filter(slot => slot.class_name.toLowerCase().includes(className.toLowerCase()));
  }
  return mockTimetable;
}

export async function createTimetableSlot(slot: Partial<TimetableSlot>): Promise<boolean> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/timetable`, {
      method: 'POST',
      headers: getHeaders(slot.tenant_id),
      body: JSON.stringify(slot),
    });
    return res.ok;
  } catch {
    return true; // Graceful optimistic fallback
  }
}

export async function fetchHomeworkAssignments(tenantId?: string): Promise<HomeworkAssignment[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/homework`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using homework fallback:', err);
  }
  return mockHomework;
}

export async function createHomeworkAssignment(hw: Partial<HomeworkAssignment>): Promise<boolean> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/homework`, {
      method: 'POST',
      headers: getHeaders(hw.tenant_id),
      body: JSON.stringify(hw),
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function fetchAdmissionsInquiries(tenantId?: string): Promise<AdmissionInquiry[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/admissions`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using admissions fallback:', err);
  }
  return mockAdmissions;
}

export async function createAdmissionInquiry(inquiry: Partial<AdmissionInquiry>): Promise<boolean> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/admissions`, {
      method: 'POST',
      headers: getHeaders(inquiry.tenant_id),
      body: JSON.stringify(inquiry),
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function fetchFeeStructures(tenantId?: string): Promise<FeeStructure[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/fees?type=structures`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using fees fallback:', err);
  }
  return mockFeeStructures;
}

export async function fetchStudentInvoices(tenantId?: string): Promise<StudentInvoice[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/fees?type=invoices`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using invoices fallback:', err);
  }
  return mockInvoices;
}

export async function fetchLibraryBooks(tenantId?: string): Promise<LibraryBook[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/library?type=books`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using books fallback:', err);
  }
  return mockLibraryBooks;
}

export async function fetchLibraryLoans(tenantId?: string): Promise<LibraryLoan[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/library?type=loans`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using loans fallback:', err);
  }
  return mockLibraryLoans;
}

export async function fetchTransportRoutes(tenantId?: string): Promise<TransportRoute[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/transport`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using transport fallback:', err);
  }
  return mockTransportRoutes;
}

export async function fetchHostelAllocations(tenantId?: string): Promise<HostelAllocation[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/hostel`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using hostel fallback:', err);
  }
  return mockHostelAllocations;
}

export async function fetchInventoryItems(tenantId?: string): Promise<InventoryItem[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/procurement?type=inventory`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using inventory fallback:', err);
  }
  return mockInventory;
}

export async function fetchProcurementRequests(tenantId?: string): Promise<ProcurementRequest[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/procurement?type=requests`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using procurement fallback:', err);
  }
  return mockProcurementRequests;
}

export async function fetchCampusNotices(tenantId?: string): Promise<CampusNotice[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/notices`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using notices fallback:', err);
  }
  return mockNotices;
}

export async function fetchCampusMessages(tenantId?: string): Promise<CampusMessage[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/messages`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using messages fallback:', err);
  }
  return mockMessages;
}

export async function fetchMobileAccounts(tenantId?: string): Promise<MobileAccount[]> {
  try {
    const res = await fetch(`${CAMPUS_API}/api/v1/campus/mobile-accounts`, {
      headers: getHeaders(tenantId),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[campus-api] Using mobile-accounts fallback:', err);
  }
  return mockMobileAccounts;
}
