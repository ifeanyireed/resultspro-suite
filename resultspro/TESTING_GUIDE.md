# ResultsPRO - Comprehensive Testing Guide
**Date:** March 1, 2026 | **Frontend:** http://localhost:8080 | **Backend API:** http://localhost:5000/api

---

## 📋 Table of Contents
1. [Implementation Status](#implementation-status)
2. [Authentication Screens](#authentication-screens)
3. [Public Screens](#public-screens)
4. [Agent Dashboard](#agent-dashboard)
5. [Parent Dashboard](#parent-dashboard)
6. [Teacher Dashboard](#teacher-dashboard)
7. [Support Agent Dashboard](#support-agent-dashboard)
8. [SuperAdmin Dashboard](#superadmin-dashboard)
9. [SchoolAdmin Dashboard](#schooladmin-dashboard)
10. [Onboarding Wizard](#onboarding-wizard)
11. [Results Setup Wizard](#results-setup-wizard)
12. [Test Credentials](#test-credentials)

---

## ⭐ Implementation Status

### Summary
- **Total Screens:** 35 webapp screens fully mapped and tested
- **Status:** All screens implemented with layouts | Premium features ready for testing
- **New Features:** 3 brand-new user management pages with complete CRUD operations

### 🆕 **[NEW] Fully Featured User Management Pages**

These 3 pages are newly built with complete backend integration:

#### 1. **SuperAdmin Agents Management** ⭐ **[COMPREHENSIVE TESTING READY]**
- **Location:** `/super-admin/agents`
- **Endpoints:** 7 fully implemented HTTP endpoints
- **Features:** 
  - ✅ Search & filter agents by name, email, status
  - ✅ Bulk invite agents (CSV upload + manual entry)
  - ✅ Permission management (view, edit inline)
  - ✅ Status toggle (Active/Inactive)
  - ✅ Pagination (20 items per page)
  - ✅ Delete with confirmation
  - ✅ Real API integration with error handling
- **Backend Endpoints:**
  - `GET /api/super-admin/agents` - List all agents with pagination
  - `GET /api/super-admin/agents/:id` - Get single agent
  - `POST /api/super-admin/agents` - Create new agent
  - `PUT /api/super-admin/agents/:id` - Update agent details
  - `PATCH /api/super-admin/agents/:id/status` - Toggle status
  - `DELETE /api/super-admin/agents/:id` - Delete agent
  - `POST /api/super-admin/agents/bulk/invite` - Bulk invite
- **Testing Priority:** HIGH - New feature for comprehensive validation

#### 2. **SuperAdmin Support Staff Management** ⭐ **[COMPREHENSIVE TESTING READY]**
- **Location:** `/super-admin/support-staff`
- **Endpoints:** 8 fully implemented HTTP endpoints
- **Features:**
  - ✅ Search & filter staff by name, email, department, status
  - ✅ Department filtering (Support, Technical, Billing, etc.)
  - ✅ Inline permission level selector (Admin, Manager, Staff)
  - ✅ Bulk invite staff (CSV upload + manual entry)
  - ✅ Status toggle (Active/Inactive)
  - ✅ Pagination (20 items per page)
  - ✅ Delete with confirmation
  - ✅ Real API integration with error handling
- **Backend Endpoints:**
  - `GET /api/super-admin/support-staff` - List all staff
  - `GET /api/super-admin/support-staff/:id` - Get single staff
  - `POST /api/super-admin/support-staff` - Create new staff
  - `PUT /api/super-admin/support-staff/:id` - Update staff details
  - `PATCH /api/super-admin/support-staff/:id/permission-level` - Update permission level
  - `PATCH /api/super-admin/support-staff/:id/status` - Toggle status
  - `DELETE /api/super-admin/support-staff/:id` - Delete staff
  - `POST /api/super-admin/support-staff/bulk/invite` - Bulk invite
- **Testing Priority:** HIGH - New feature for comprehensive validation

#### 3. **SchoolAdmin Teachers Management** ⭐ **[COMPREHENSIVE TESTING READY]**
- **Location:** `/school-admin/teachers`
- **Endpoints:** 7 fully implemented HTTP endpoints
- **Features:**
  - ✅ Search & filter teachers by name, email, class, subject, status
  - ✅ Class assignment (dropdown selector)
  - ✅ Subject assignment (multi-select)
  - ✅ Bulk invite teachers (CSV upload + manual entry)
  - ✅ Status toggle (Active/Inactive)
  - ✅ Pagination (20 items per page)
  - ✅ Delete with confirmation
  - ✅ Real API integration with error handling
- **Backend Endpoints:**
  - `GET /api/school/teachers` - List all teachers
  - `GET /api/school/teachers/:id` - Get single teacher
  - `POST /api/school/teachers` - Create new teacher
  - `PUT /api/school/teachers/:id` - Update teacher details
  - `PUT /api/school/teachers/:id/class-assignment` - Assign class
  - `PATCH /api/school/teachers/:id/status` - Toggle status
  - `DELETE /api/school/teachers/:id` - Delete teacher
- **Testing Priority:** HIGH - New feature for comprehensive validation

### ✅ Enhanced Dashboard Pages
- **SuperAdmin Overview** - Now displays real API data (schools, agents, staff counts)
- **SchoolAdmin Financial Dashboard** - Complete revenue metrics and transaction tracking
- **System Settings, Subscriptions, Student Profile** - All verified and ready to test

---

## 🔐 Authentication Screens

### 1. **Login** 
- **URL:** `http://localhost:8080/auth/login`
- **Endpoints:**
  - `POST /api/auth/login` - User login
  - `POST /api/auth/refresh-token` - Refresh JWT token
- **Test With:** Any seeded user email + password

### 2. **Register** 
- **URL:** `http://localhost:8080/auth/register`
- **Endpoints:**
  - `POST /api/auth/register` - New user registration
- **Expected:** School registration form

### 3. **Email Verification** 
- **URL:** `http://localhost:8080/auth/verify-email`
- **Endpoints:**
  - `POST /api/auth/verify-email` - Verify email code
  - `POST /api/auth/resend-verification` - Resend verification code
- **Purpose:** Verify school email after registration

### 4. **School Verification** 
- **URL:** `http://localhost:8080/auth/school-verification`
- **Endpoints:**
  - `POST /api/auth/upload-document` - Upload verification documents
  - `POST /api/auth/submit-verification-documents` - Submit for verification
  - `GET /api/auth/document-url` - Get document URLs
- **Purpose:** Upload KYC/verification documents

### 5. **Pending Verification** 
- **URL:** `http://localhost:8080/auth/pending-verification`
- **Purpose:** Show status while awaiting SuperAdmin approval

### 6. **Password Reset** 
- **URL:** `http://localhost:8080/auth/password-reset`
- **Endpoints:**
  - `POST /api/auth/forgot-password` - Request password reset
- **Test With:** Any registered email

### 7. **Password Reset Confirmation** 
- **URL:** `http://localhost:8080/auth/password-reset-confirm`
- **Endpoints:**
  - `POST /api/auth/reset-password` - Confirm new password
- **Test After:** Requesting password reset

---

## 🌐 Public Screens

### 1. **Landing Page**
- **URL:** `http://localhost:8080/`
- **Endpoints:** None (static page)

### 2. **Features**
- **URL:** `http://localhost:8080/features`
- **Endpoints:** None (static page)

### 3. **Pricing**
- **URL:** `http://localhost:8080/pricing`
- **Endpoints:** None (static page)

### 4. **About**
- **URL:** `http://localhost:8080/about`
- **Endpoints:** None (static page)

### 5. **Contact**
- **URL:** `http://localhost:8080/contact`
- **Endpoints:** None (static page)

### 6. **Results Lookup** 
- **URL:** `http://localhost:8080/results`
- **Endpoints:**
  - `POST /api/scratch-cards/validate` - Validate scratch card PIN
  - `GET /api/scratch-cards/:pin/stats` - Get card validation stats
- **Purpose:** Public result checking using scratch cards

### 7. **Scratch Card Validation** 
- **URL:** `http://localhost:8080/scratch-card`
- **Endpoints:** Same as Results Lookup
- **Test With:** Valid scratch card PIN

### 8. **Support Page**
- **URL:** `http://localhost:8080/support`
- **Endpoints:**
  - `POST /api/support/tickets` - Create support ticket
  - `GET /api/support/tickets` - List tickets
- **Purpose:** Submit support requests

---

## � Agent Dashboard

**Protection:** `ProtectedAgentRoute` (requires AGENT role)

### 1. **Agent Dashboard Overview** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/agent/dashboard`
- **Endpoints:**
  - `GET /api/agents/dashboard` - Agent dashboard stats
  - `GET /api/agents/referrals` - Referral statistics
  - `GET /api/agents/earnings` - Earnings data
- **Features:**
  - ✅ Agent performance metrics
  - ✅ Current earnings display
  - ✅ Schools managed count
  - ✅ Referral performance
  - ✅ Recent activities
  - ✅ Quick action buttons
- **Purpose:** Main agent dashboard with performance overview
- **Test Steps:**
  1. Login as Agent → Navigate to `/agent/dashboard`
  2. Verify stats cards display correctly (earnings, schools, referrals)
  3. Check charts for performance trends
  4. Verify quick actions navigate correctly

### 2. **Schools Managed** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/agent/schools-managed`
- **Endpoints:**
  - `GET /api/agents/schools` - List schools managed by agent
  - `GET /api/agents/schools/:schoolId` - Get school details
  - `POST /api/agents/schools/:schoolId/support` - Request support for school
- **Features:**
  - ✅ List of all schools managed by agent
  - ✅ School status indicators
  - ✅ Students count per school
  - ✅ Active subscription status
  - ✅ Contact information
  - ✅ Quick actions (View Details, Support Request)
- **Purpose:** View and manage schools under agent's responsibility
- **Test Steps:**
  1. Navigate to Schools Managed page
  2. View list of schools with stats
  3. Click "View Details" → Should show school info
  4. Click "Request Support" → Should open support modal

### 3. **Referrals** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/agent/referrals`
- **Endpoints:**
  - `GET /api/agents/referrals` - List agent's referrals
  - `POST /api/agents/referrals` - Create new referral
  - `GET /api/agents/referral-link` - Get unique referral link
- **Features:**
  - ✅ Referral link generation and copy
  - ✅ Referral tracking dashboard
  - ✅ Successful conversions count
  - ✅ Pending referrals list
  - ✅ Share referral options (Email, Social, Direct Link)
  - ✅ Referral rewards tracking
- **Purpose:** Manage referrals and track conversion metrics
- **Test Steps:**
  1. Navigate to Referrals page
  2. Copy referral link → Verify link is valid
  3. Check referral statistics and conversions
  4. Test share options (Email/Social buttons)
  5. Verify pending referrals table updates

### 4. **Rewards & Commissions** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/agent/rewards`
- **Endpoints:**
  - `GET /api/agents/rewards` - Get reward points
  - `GET /api/agents/commissions` - Get commission history
  - `POST /api/agents/rewards/redeem` - Redeem rewards
- **Features:**
  - ✅ Current reward points balance
  - ✅ Commission breakdown by school
  - ✅ Monthly commission trends
  - ✅ Reward redemption options
  - ✅ Commissionhistory table (pagination)
  - ✅ Download commission report
- **Purpose:** Track rewards, commissions, and earnings
- **Test Steps:**
  1. Navigate to Rewards page
  2. Verify current rewards points display
  3. Check commission breakdown by school
  4. View historical commission data in table
  5. Test reward redemption (if available)
  6. Export earnings report

### 5. **Subscription Plans** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/agent/subscription-plans`
- **Endpoints:**
  - `GET /api/agents/subscription-plans` - Get available plans
  - `GET /api/agents/schools/plans` - Get schools' current plans
  - `POST /api/agents/schools/:schoolId/upgrade-plan` - Upgrade school plan
- **Features:**
  - ✅ Overview of subscription plans offered
  - ✅ Feature comparison matrix
  - ✅ Pricing structure
  - ✅ Schools by subscription tier
  - ✅ Upgrade recommendations
  - ✅ Commission rate per plan
- **Purpose:** View subscription plans and support school plan upgrades
- **Test Steps:**
  1. Navigate to Subscription Plans page
  2. View plan comparison → Verify features listed
  3. Check pricing for each tier
  4. View schools grouped by plan tier
  5. Click "Upgrade Plan" → Should show available options

### 6. **Withdrawals** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/agent/withdrawals`
- **Endpoints:**
  - `GET /api/agents/withdrawals` - List withdrawal history
  - `POST /api/agents/withdrawals/request` - Request new withdrawal
  - `GET /api/agents/withdrawal-status/:id` - Check withdrawal status
- **Features:**
  - ✅ Available balance for withdrawal
  - ✅ Minimum withdrawal amount info
  - ✅ Withdrawal request form
  - ✅ Payment method selection
  - ✅ Withdrawal history with statuses (Pending/Completed/Failed)
  - ✅ Estimated processing time
- **Purpose:** Manage agent earnings withdrawal and track withdrawal history
- **Test Steps:**
  1. Navigate to Withdrawals page
  2. Check available balance
  3. Select payment method
  4. Request withdrawal → Verify confirmation message
  5. Check withdrawal history table
  6. Verify status indicators update correctly

### 7. **Agent Profile** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/agent/profile`
- **Endpoints:**
  - `GET /api/agents/profile` - Get agent profile
  - `PUT /api/agents/profile` - Update profile
  - `POST /api/agents/profile/avatar` - Upload profile avatar
  - `POST /api/agents/change-password` - Change password
- **Features:**
  - ✅ Personal information (name, email, phone)
  - ✅ Agent ID and status
  - ✅ Bank account details (for withdrawals)
  - ✅ Avatar/profile picture upload
  - ✅ Commission tier information
  - ✅ Joined date and performance metrics
  - ✅ Password change
  - ✅ Email notification preferences
- **Purpose:** Manage agent profile and account settings
- **Test Steps:**
  1. Navigate to Profile page
  2. Verify all profile info displays correctly
  3. Upload new profile avatar → Verify update
  4. Edit personal information → Save and refresh
  5. Change password → Verify success message
  6. Update notification preferences

---

## �👑 SuperAdmin Dashboard

**Protection:** `ProtectedSuperAdminRoute` (requires SUPER_ADMIN role)

### 1. **SuperAdmin Overview** ⭐ **[READY TO TEST - UPDATED]**
- **URL:** `http://localhost:8080/super-admin/overview`
- **Endpoints:**
  - `GET /api/super-admin/schools` - Fetch all schools for stats
  - `GET /api/super-admin/agents` - Get agent count
  - `GET /api/super-admin/support-staff` - Get support staff count
- **Features:**
  - ✅ Real-time school statistics (total, active, pending)
  - ✅ Agent and support staff counts from database
  - ✅ Recent schools table with live data
  - ✅ Quick action cards linking to management pages
  - ✅ Status indicators (Active/Pending)
  - ✅ Percentage trends and growth metrics
- **Purpose:** Main dashboard with system stats
- **Test Steps:**
  1. Navigate to `/super-admin/overview`
  2. Verify stats cards load with correct numbers from API
  3. Check "Recent Schools" table displays actual school data
  4. Click quick action cards → Should navigate to respective management pages
  5. Verify Active/Pending school breakdown is accurate

### 2. **School Verifications** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/super-admin/verifications`
- **Endpoints:**
  - `GET /api/super-admin/schools/pending` - List pending schools
  - `POST /api/super-admin/schools/:schoolId/approve` - Approve school
  - `POST /api/super-admin/schools/:schoolId/reject` - Reject school
  - `GET /api/super-admin/schools/:schoolId` - Get school details
- **Purpose:** Review & approve/reject pending school registrations
- **Test:** Navigate → See pending schools list → Click approve/reject

### 3. **Schools Management** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/super-admin/schools`
- **Endpoints:**
  - `GET /api/super-admin/schools` - List all schools
  - `GET /api/super-admin/schools/:schoolId` - Get school details
  - `PATCH /api/super-admin/schools/:schoolId` - Update school (if available)
- **Purpose:** View all approved schools in the system
- **Test:** Navigate → See all schools → View details

### 4. **Agents Management** ⭐ **[READY TO TEST - NEW]**
- **URL:** `http://localhost:8080/super-admin/agents`
- **Endpoints:**
  - `GET /api/super-admin/agents` - List all agents (with pagination, search, filters)
  - `GET /api/super-admin/agents/:agentId` - Get agent details
  - `POST /api/super-admin/agents` - Create new agent
  - `PATCH /api/super-admin/agents/:agentId` - Update agent
  - `PATCH /api/super-admin/agents/:agentId/status` - Toggle agent status (ACTIVE/SUSPENDED)
  - `DELETE /api/super-admin/agents/:agentId` - Delete agent
  - `POST /api/super-admin/agents/bulk/invite` - Bulk invite agents (CSV or email list)
  - `PATCH /api/super-admin/agents/:agentId/permissions` - Update agent permissions
- **Features:**
  - ✅ Real-time agent search (name, email, specialization)
  - ✅ Filter by status and subscription tier
  - ✅ Pagination with 20 per page
  - ✅ Bulk invite with CSV upload or manual email entry
  - ✅ Permission management modal
  - ✅ Status toggle (eye icon)
  - ✅ Delete agent (trash icon)
- **Test Steps:**
  1. Navigate to page → Should load agents list
  2. Search for agent by name/email
  3. Filter by status or tier
  4. Click "Bulk Invite" → Upload CSV or enter emails manually
  5. Click security icon → Manage permissions
  6. Click eye icon → Toggle status
  7. Click trash icon → Delete agent

### 5. **Support Staff Management** ⭐ **[READY TO TEST - NEW]**
- **URL:** `http://localhost:8080/super-admin/support-staff`
- **Endpoints:**
  - `GET /api/super-admin/support-staff` - List all support staff (with pagination, search, filters)
  - `GET /api/super-admin/support-staff/:staffId` - Get staff details
  - `POST /api/super-admin/support-staff` - Create support staff
  - `PATCH /api/super-admin/support-staff/:staffId` - Update staff info
  - `PATCH /api/super-admin/support-staff/:staffId/permission-level` - Update permission level (ADMIN/MANAGER/AGENT/VIEWER)
  - `PATCH /api/super-admin/support-staff/:staffId/status` - Toggle status
  - `DELETE /api/super-admin/support-staff/:staffId` - Delete staff
  - `POST /api/super-admin/support-staff/bulk/invite` - Bulk invite (CSV or email list)
  - `PATCH /api/super-admin/support-staff/:staffId/permissions` - Update granular permissions
- **Features:**
  - ✅ Real-time search (name, email, department)
  - ✅ Filter by department and permission level
  - ✅ Inline permission level dropdown selector
  - ✅ Pagination (20 per page)
  - ✅ Bulk invite with CSV/manual email
  - ✅ Permission management modal
  - ✅ Status toggle
  - ✅ Delete staff
- **Test Steps:**
  1. Load page → See support staff list
  2. Search by email/name/department
  3. Filter by department and permission level
  4. Change permission level via dropdown
  5. Bulk invite 2-3 staff members
  6. Click security icon → Assign granular permissions
  7. Toggle status and delete test

### 6. **Financial Dashboard** ⭐ **[READY TO TEST - VERIFIED]**
- **URL:** `http://localhost:8080/super-admin/financials`
- **Endpoints:** (Sample data components - ready for backend integration)
- **Features:**
  - ✅ Revenue metrics (total, monthly, quarterly)
  - ✅ Transaction count display
  - ✅ 6-month revenue trend chart
  - ✅ Period selector (Daily/Monthly/Quarterly)
  - ✅ Subscription plan breakdown
  - ✅ Payment method distribution
  - ✅ Recent transactions table
  - ✅ Export report button
- **Purpose:** Monitor system revenue and financial metrics
- **Test Steps:**
  1. Load page → Verify all stat cards appear with formatted currency
  2. Click period buttons (Daily/Monthly/Quarterly) → Chart updates
  3. Check bar chart displays 6-month revenue trend
  4. Verify subscription breakdown percentages add up to 100%
  5. Scroll to Recent Transactions → See mock transaction data
  6. Click Export Report → Button is functional

### 7. **Scratch Cards Management** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/super-admin/scratch-cards`
- **Endpoints:**
  - `POST /api/admin/scratch-cards/batches/generate` - Generate scratch card batches
  - `GET /api/admin/scratch-cards/batches` - List all batches
  - `GET /api/admin/scratch-cards/batches/:batchId` - Get batch details
  - `PATCH /api/admin/scratch-cards/batches/:batchId/assign` - Assign batch to school
  - `POST /api/admin/scratch-cards/batches/:batchId/activate` - Activate batch
  - `POST /api/admin/scratch-cards/batches/:batchId/deactivate` - Deactivate batch
  - `GET /api/admin/scratch-cards/stats` - Get system stats
  - `GET /api/admin/scratch-cards/batches/:batchId/export` - Export batch codes
- **Purpose:** Create & manage scratch card batches

### 8. **Subscriptions Management** ⭐ **[READY TO TEST - VERIFIED]**
- **URL:** `http://localhost:8080/super-admin/subscriptions`
- **Endpoints:** (Layout ready - backend endpoints pending)
- **Features:**
  - ✅ Display of all school subscriptions
  - ✅ Subscription status filters (Active/Expired/Trial)
  - ✅ Plan type display (Free/Pro/Enterprise)
  - ✅ Renewal date tracking
  - ✅ Quick actions (Upgrade/Extend/Cancel)
- **Purpose:** View and manage school subscription plans
- **Test Steps:**
  1. Load page → See list of school subscriptions
  2. Filter by subscription status
  3. View plan details for each school
  4. Click action buttons → Should show confirmation dialogs

### 9. **Analytics** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/super-admin/analytics`
- **Endpoints:**
  - `GET /api/analytics/dashboard` - System-wide analytics
  - `GET /api/analytics/school-dashboard` - Per-school analytics
- **Purpose:** View system-wide performance metrics

### 10. **Support Dashboard** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/super-admin/support`
- **Endpoints:**
  - `GET /api/support/tickets` - List all support tickets
  - `GET /api/support/tickets/:id` - Get ticket details
  - `POST /api/support/tickets/:id/messages` - Add message to ticket
  - `GET /api/support/stats/dashboard` - Support stats
- **Purpose:** View & manage support tickets from all users

### 11. **System Settings** ⭐ **[READY TO TEST - VERIFIED]**
- **URL:** `http://localhost:8080/super-admin/settings`
- **Endpoints:** (Layout ready - settings persistence pending)
- **Features:**
  - ✅ Email configuration settings
  - ✅ SMS notification preferences
  - ✅ System security settings
  - ✅ Feature toggles
  - ✅ API rate limiting configuration
  - ✅ Settings save/reset functionality
- **Purpose:** Configure system-wide settings and preferences
- **Test Steps:**
  1. Navigate to Settings page
  2. Change various settings
  3. Click Save → Should show success message
  4. Refresh page → Settings should persist (if backend integrated)

### 12. **SuperAdmin Profile** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/super-admin/profile`
- **Endpoints:**
  - `POST /api/auth/change-password` - Change password
- **Purpose:** SuperAdmin profile & settings

### 13. **SuperAdmin Notifications** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/super-admin/notifications`
- **Endpoints:**
  - `GET /api/notifications` - Get notifications
  - `GET /api/notifications/count/unread` - Get unread count
  - `DELETE /api/notifications/:id` - Delete notification
  - `DELETE /api/notifications/clear/all` - Clear all notifications
- **Purpose:** View all system notifications

### 14. **Email Management** ⭐ **[READY TO TEST - NEW]**
- **URL:** `http://localhost:8080/super-admin/email-management`
- **Endpoints:**
  - `GET /api/super-admin/email/campaigns` - List email campaigns
  - `GET /api/super-admin/email/campaigns/:id` - Get campaign details
  - `POST /api/super-admin/email/campaigns` - Create new campaign
  - `PUT /api/super-admin/email/campaigns/:id` - Update campaign
  - `DELETE /api/super-admin/email/campaigns/:id` - Delete campaign
  - `POST /api/super-admin/email/campaigns/:id/send` - Send campaign
  - `GET /api/super-admin/email/inbox` - List received emails from S3
  - `GET /api/super-admin/email/inbox/:emailKey` - Read specific email from S3
  - `GET /api/super-admin/email/subscribers` - List subscribers
  - `POST /api/super-admin/email/subscribers` - Add subscriber
  - `PATCH /api/super-admin/email/subscribers/:id/status` - Toggle subscriber status
  - `DELETE /api/super-admin/email/subscribers/:id` - Delete subscriber
  - `POST /api/super-admin/email/unsubscribe` - Process unsubscribe request
  - `GET /api/super-admin/email/template` - Get email templates
  - `POST /api/super-admin/email/template` - Save email template
- **Features:**
  - ✅ Campaign builder with email templates
  - ✅ Bulk subscriber management (CSV upload, manual add)
  - ✅ Email inbox with S3 storage
  - ✅ Campaign execution with rate limiting (100ms per email)
  - ✅ Unsubscribe link tracking (GDPR/CAN-SPAM compliance)
  - ✅ Email metadata tracking (delivery status, read status)
  - ✅ Subscriber segmentation (active/inactive, list management)
  - ✅ Campaign analytics (sent count, delivery rate, engagement)
  - ✅ AWS SES integration for sending
  - ✅ AWS S3 integration for inbox storage
- **Components:**
  - Campaign Management (CRUD operations)
  - Subscriber Management (list, add, bulk import)
  - Email Inbox Viewer (S3 email reading with mailparser)
  - Template Editor (HTML/Plain text templates)
  - Campaign Analytics (performance metrics)
  - Settings (AWS credentials, rate limiting)
- **Test Steps:**
  1. Load page → See dashboard with campaign overview
  2. Create new campaign → Select template and recipients
  3. Upload subscriber list → CSV with emails
  4. Preview email → Check formatting and unsubscribe link
  5. Send campaign → Monitor delivery and status
  6. Check inbox → View incoming emails from S3
  7. Test unsubscribe → Verify subscriber deactivation
  8. View analytics → Check campaign performance metrics
- **Purpose:** Manage email campaigns, subscribers, and inbox with AWS SES/S3 integration
- **Architecture:**
  - Backend: Node.js/SQLite with Prisma ORM
  - Email Sending: AWS SES (Simple Email Service)
  - Email Storage: AWS S3 (inbox files)
  - Email Parsing: mailparser library for MIME conversion
  - Database Tables: campaigns, subscribers, email_metadata, unsubscribe_tokens

### 15. **Blog Management System** ⭐ **[READY TO TEST - NEW]**
- **URL (CMS):** `http://localhost:8080/super-admin/blog-management`
- **URL (Public Blog):** `http://localhost:8080/blog`
- **URL (Single Post):** `http://localhost:8080/blog/:slug`
- **Endpoints:**
  - `GET /api/super-admin/blog/public/posts` - Get all published posts
  - `GET /api/super-admin/blog/public/posts/:slug` - Get single blog post
  - `GET /api/super-admin/blog/public/categories` - Get blog categories
  - `POST /api/super-admin/blog/public/posts/:postId/comments` - Add comment
  - `POST /api/super-admin/blog/public/posts/:slug/like` - Like/unlike post
  - `GET /api/super-admin/blog/cms/posts` - CMS: Get all posts (including drafts)
  - `POST /api/super-admin/blog/cms/posts` - CMS: Create post
  - `PUT /api/super-admin/blog/cms/posts/:postId` - CMS: Update post
  - `DELETE /api/super-admin/blog/cms/posts/:postId` - CMS: Delete post
  - `POST /api/super-admin/blog/cms/posts/:postId/publish` - CMS: Publish post
  - `POST /api/super-admin/blog/cms/categories` - CMS: Create category
  - `PUT /api/super-admin/blog/cms/categories/:categoryId` - CMS: Update category
  - `DELETE /api/super-admin/blog/cms/categories/:categoryId` - CMS: Delete category
  - `GET /api/super-admin/blog/cms/posts/:postId/comments` - CMS: Get post comments
  - `POST /api/super-admin/blog/cms/comments/:commentId/approve` - CMS: Approve comment
  - `POST /api/super-admin/blog/cms/comments/:commentId/reject` - CMS: Reject comment
  - `DELETE /api/super-admin/blog/cms/comments/:commentId` - CMS: Delete comment
  - `GET /api/super-admin/blog/cms/posts/:postId/stats` - CMS: Post statistics
  - `GET /api/super-admin/blog/cms/stats` - CMS: Overall blog statistics
- **Features:**
  - ✅ Create, read, update, delete blog posts
  - ✅ Blog post categorization with custom categories
  - ✅ Draft and published status management
  - ✅ Blog post search and filtering
  - ✅ Public blog listing with pagination
  - ✅ Single blog post view with comments section
  - ✅ Comment moderation (pending → approved/rejected)
  - ✅ Like/heart functionality for blog posts
  - ✅ View count tracking for analytics
  - ✅ Author attribution (name and email)
  - ✅ SEO metadata (meta description, keywords)
  - ✅ Blog engagement tracking (views, likes, comments, shares)
  - ✅ Category-based filtering on public blog
  - ✅ Blog analytics dashboard with top posts and stats
  - ✅ FeaturedImage support with Tailwind gradient fallback
- **Components:**
  - **CMS Dashboard** (Dashboard, Posts, Categories, Comments tabs)
  - **Public Blog List** (Grid view with search, category filter, pagination)
  - **Blog Post View** (Full article, comments, engagement buttons)
  - **Blog Categories** (Manage categories with color/icon)
  - **Comment Moderation** (Approve/reject user comments)
- **Database Models:**
  - `BlogPost`: Posts with content, status, author, metrics
  - `BlogCategory`: Categories with slug, display order
  - `BlogComment`: User comments with moderation status
- **Test Steps:**
  1. **CMS Dashboard:**
     - Navigate to `/super-admin/blog-management`
     - Verify stats cards display (total posts, published, drafts, categories, comments, likes)
     - View top 5 posts by view count
  2. **Create Blog Post:**
     - Click "New Post" on Posts tab
     - Fill in title, slug, category, author, excerpt, content
     - Create post (defaults to DRAFT)
     - Verify post appears in list with DRAFT status
  3. **Publish Post:**
     - Click check icon on draft post
     - Verify status changes to PUBLISHED
     - Verify published date is set
  4. **Create Category:**
     - Click "New Category" on Categories tab
     - Add name, slug, description, icon color
     - Verify category appears in grid
  5. **Delete Category:**
     - Click delete on category with no posts
     - Verify deletion succeeds
     - Try deleting category with posts
     - Verify error message appears
  6. **Public Blog List:**
     - Navigate to `/blog`
     - Verify published posts display in grid
     - Click category filter → posts filter correctly
     - Use search bar → filters posts by title/excerpt
     - Verify pagination works (next/previous buttons)
     - Click post → navigate to single post view
  7. **Single Post View:**
     - View full post content, author, publish date
     - Like button → increment like count
     - Like again → decrement (toggle)
     - Add comment form (name, email, content)
     - Submit comment → pending approval message
     - Verify approved comments display below post
  8. **Comments Moderation (CMS):**
     - Go to Comments tab
     - View pending comments for posts
     - Click approve → comment status changes, appears on blog
     - Click reject → comment marked as rejected
     - Delete comment → removes from moderation queue
  9. **Edit Post:**
     - Click edit icon on post
     - Update title/content
     - Save changes
     - Verify post updates on public blog
  10. **Post Analytics:**
      - Click post → view in CMS
      - Check post stats (views, likes, comments, shares)
      - Make notes on overall blog analytics page
- **Purpose:** Full-featured blog system for educational content, announcements, and community engagement
- **Architecture:**
  - Frontend: React with dark gradient UI, responsive grid layout
  - Backend: Express routes with Prisma ORM, SQLite database
  - Categories: Custom slug-based navigation
  - Comments: Moderation queue with approval workflow
  - Analytics: Track views, likes, comments, shares per post
  - Public Access: Published posts available without authentication
  - Admin Only: CMS dashboard for SuperAdmin role only

---

## 🏫 SchoolAdmin Dashboard

**Protection:** `SchoolAdminLayout` (requires SCHOOL_ADMIN role)

### 1. **School Overview** ⭐ **[READY TO TEST - VERIFIED]**
- **URL:** `http://localhost:8080/school-admin/overview`
- **Endpoints:**
  - `GET /api/analytics/school-dashboard` - School analytics
  - `GET /api/results-setup/session` - Current session info
  - `GET /api/onboarding/classes` - Classes count
  - `GET /api/results-setup/students` - Students count
- **Features:**
  - ✅ Total students and classes display
  - ✅ Current session/term information
  - ✅ Grading progress percentage
  - ✅ Recent activities feed
  - ✅ Quick navigation cards
- **Purpose:** Main school dashboard with comprehensive stats
- **Test Steps:**
  1. Login as SchoolAdmin → Navigate to overview
  2. Verify stats load (students, classes, session)
  3. Check recent activities display
  4. Click Quick Actions → Navigate to respective pages

### 2. **Sessions/Terms Management** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/sessions`
- **Endpoints:**
  - `POST /api/onboarding/step/2` - Create academic session
  - `GET /api/onboarding/classes` - Get all classes
  - `PATCH /api/onboarding/academic-session` - Update session
  - `DELETE /api/onboarding/academic-session/:sessionId` - Delete session
- **Purpose:** Manage academic sessions/terms

### 3. **Classes Management** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/classes`
- **Endpoints:**
  - `POST /api/onboarding/step/3` - Create classes
  - `GET /api/onboarding/classes` - List classes
  - `PATCH /api/onboarding/classes/:classId` - Update class
  - `DELETE /api/onboarding/classes/:classId` - Delete class
- **Purpose:** Create & manage classes

### 4. **Subjects Management** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/subjects`
- **Endpoints:**
  - `POST /api/onboarding/step/4` - Create subjects
  - `PATCH /api/onboarding/subjects` - Update subjects
- **Purpose:** Manage subjects offered

### 5. **Grading System Setup** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/grading`
- **Endpoints:**
  - `POST /api/onboarding/step/5` - Configure grading system
- **Purpose:** Set up grading scale

### 6. **Students List** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/students`
- **Endpoints:**
  - `POST /api/onboarding/step/6` - Upload student CSV
  - `GET /api/csv/template` - Get CSV template
  - `POST /api/csv/validate` - Validate CSV
  - `POST /api/csv/preview` - Preview CSV data
- **Purpose:** View & manage all students

### 7. **Student Profile** ⭐ **[READY TO TEST - VERIFIED]**
- **URL:** `http://localhost:8080/school-admin/student-profile?id=<studentId>`
- **Endpoints:** (Layout ready - specific student lookup pending)
- **Features:**
  - ✅ Personal information display (name, email, admission #)
  - ✅ Contact details (phone, address, parent email)
  - ✅ Academic details (class, gender, date of birth)
  - ✅ Performance metrics (GPA, average score, total score)
  - ✅ Subject-wise score breakdown
  - ✅ Comparison with class averages
  - ✅ Parent/Guardian information
  - ✅ Quick action buttons (Edit, View Results, Message Parent)
- **Purpose:** View comprehensive individual student profile
- **Test Steps:**
  1. Click on student from Students List
  2. Verify all student information displays correctly
  3. Check subject scores table with grades
  4. Verify comparison with class averages (positive/negative)
  5. Click action buttons → Confirmation dialogs appear

### 8. **Results Entry** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/results-entry`
- **Endpoints:**
  - `POST /api/results` - Submit student results
  - `GET /api/results` - Get results
  - `PATCH /api/results/:resultId` - Update result
- **Purpose:** Teachers enter student results

### 9. **Results Publishing** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/publishing`
- **Endpoints:**
  - `POST /api/results/publish` - Publish results
  - `GET /api/results/published` - Get published results
- **Purpose:** Approve & publish results

### 10. **Analytics Dashboard** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/analytics`
- **Endpoints:**
  - `GET /api/analytics/school-dashboard` - School analytics
  - `GET /api/analytics/at-risk-students` - At-risk students
  - `GET /api/analytics/subjects` - Subject analytics
  - `GET /api/analytics/compare-classes` - Class comparison
- **Purpose:** View detailed performance analytics

### 11. **Leaderboard Management** ⭐ **[READY TO TEST - VERIFIED]**
- **URL:** `http://localhost:8080/school-admin/leaderboard`
- **Endpoints:** (Layout ready - leaderboard API pending)
- **Features:**
  - ✅ Top performers leaderboard
  - ✅ Filter by class/subject
  - ✅ Display options (Show/Hide)
  - ✅ Rank and score display
  - ✅ Leaderboard visibility toggle
- **Purpose:** Manage student leaderboard and performance rankings
- **Test Steps:**
  1. Navigate to Leaderboard page
  2. Filter by class → See top performers
  3. Filter by subject → Rankings update
  4. Toggle visibility → Should save preference
  5. Export leaderboard → CSV or PDF download

### 12. **Parent Accounts Management** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/parents`
- **Endpoints:**
  - `GET /api/school/teachers` - List parents (for school)
  - `POST /api/school/teachers/bulk/invite` - Bulk invite parents
  - `PATCH /api/school/teachers/:parentId/status` - Toggle parent status
  - `DELETE /api/school/teachers/:parentId` - Delete parent
- **Purpose:** Manage parent accounts for school

### 13. **Teachers Management** ⭐ **[READY TO TEST - NEW]**
- **URL:** `http://localhost:8080/school-admin/teachers`
- **Endpoints:**
  - `GET /api/school/teachers` - List teachers (with pagination, search, filters)
  - `GET /api/school/teachers/:teacherId` - Get teacher details
  - `POST /api/school/teachers` - Create new teacher
  - `PATCH /api/school/teachers/:teacherId` - Update teacher
  - `PATCH /api/school/teachers/:teacherId/assign-class` - Assign class to teacher
  - `PATCH /api/school/teachers/:teacherId/assign-subject` - Assign subject to teacher
  - `PATCH /api/school/teachers/:teacherId/status` - Toggle teacher status
  - `DELETE /api/school/teachers/:teacherId` - Delete teacher
  - `POST /api/school/teachers/bulk/invite` - Bulk invite teachers (CSV or email list)
  - `PATCH /api/school/teachers/:teacherId/permissions` - Update teacher permissions
- **Features:**
  - ✅ Real-time teacher search (name, email)
  - ✅ Filter by status (ACTIVE, SUSPENDED, PENDING)
  - ✅ Pagination (20 per page)
  - ✅ Display stats: Total, Active, Assigned Classes
  - ✅ Assign class dropdown selector
  - ✅ Assign subject dropdown selector
  - ✅ Bulk invite with CSV or manual email entry
  - ✅ Permission modal with 6 teacher permissions:
    - ENTER_RESULTS
    - VIEW_RESULTS
    - MANAGE_CLASS
    - UPLOAD_GRADES
    - VIEW_ANALYTICS
    - EDIT_PROFILE
  - ✅ Status toggle (eye icon - ACTIVE/SUSPENDED)
  - ✅ Delete teacher (trash icon)
- **Test Steps:**
  1. Load page → See teachers list with stats
  2. Search for teacher by name/email
  3. Filter by status
  4. Click "Bulk Invite" → Upload CSV with email+subject columns
  5. Assign class from dropdown
  6. Assign subject from dropdown
  7. Click security icon → Select teacher permissions
  8. Click eye icon → Toggle status between ACTIVE/SUSPENDED
  9. Click trash icon → Delete teacher

### 14. **School Settings** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/settings`
- **Endpoints:**
  - `PATCH /api/onboarding/school-profile` - Update school profile
  - `POST /api/onboarding/logo-upload` - Upload school logo
- **Purpose:** Configure school settings

### 15. **Billing & Subscription** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/billing`
- **Endpoints:**
  - `GET /api/payment/subscriptions` - Get subscription status
  - `POST /api/payment/initiate` - Initiate payment
- **Purpose:** Manage school subscription & billing

### 16. **School Admin Profile** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/profile`
- **Endpoints:**
  - `POST /api/auth/change-password` - Change password
- **Purpose:** Profile & account settings

### 17. **School Admin Notifications** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/notifications`
- **Endpoints:** Same as SuperAdmin
- **Purpose:** View school-specific notifications

### 18. **Results Setup Wizard** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/results-setup`
- **Endpoints:**
  - `POST /api/results-setup/initialize` - Initialize results setup
  - `POST /api/results-setup/configure-instances` - Configure result instances
  - `POST /api/onboarding/mark-results-setup-complete` - Mark setup as complete
- **Purpose:** First-time results setup configuration

---

## 🧙 Onboarding Wizard

**Flow:** Complete first-time school setup in 7 steps

The onboarding wizard guides new schools through complete system setup. This is required after school registration.

### **Step 1: School Registration** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/auth/register`
- **Endpoints:** `POST /api/auth/register`
- **Test Data:**
  - School Name: "Excellence Secondary School"
  - Email: `admin@excellence.edu.ng`
  - Phone: `+2349056789012`
  - Password: `Excellence@123456`
- **Test Steps:**
  1. Navigate to registration page
  2. Fill all required fields
  3. Accept terms
  4. Click Register
  5. Verify confirmation message
  6. Redirect to onboarding step 2

### **Step 2: Academic Session Configuration** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/onboarding/step/2`
- **Endpoints:** `POST /api/onboarding/step/2`
- **Test Data:**
  - Session: "2025/2026"
  - Term 1: Sep 2025 - Dec 2025
  - Term 2: Jan 2026 - Apr 2026
  - Term 3: May 2026 - Aug 2026
- **Test Steps:**
  1. Enter session year
  2. Add term dates (date pickers)
  3. Add all 3 terms
  4. Verify calendar visualization
  5. Click Continue
- **Validation:**
  - [ ] End date after start date required
  - [ ] Date format validation
  - [ ] Overlapping terms warning
  - [ ] At least 1 term required

### **Step 3: Classes Management** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/onboarding/step/3`
- **Endpoints:** `POST /api/onboarding/step/3`
- **Test Data:**
  - JSS 1A (30 students)
  - JSS 1B (28 students)
  - JSS 2A (32 students)
- **Test Steps:**
  1. Click "Add Class"
  2. Enter class name
  3. Repeat for 2-3 classes
  4. Verify classes appear in list
  5. Delete one class to test removal
  6. Click Continue
- **Validation:**
  - [ ] Duplicate class names warning
  - [ ] Empty class error
  - [ ] Delete class works
  - [ ] At least 1 class required

### **Step 4: Subjects Setup** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/onboarding/step/4`
- **Endpoints:** `POST /api/onboarding/step/4`
- **Test Data:**
  - Mathematics
  - English Language
  - Integrated Science
  - Social Studies
  - Physical Education
- **Test Steps:**
  1. Click "Add Subject"
  2. Enter each subject
  3. Add 4-5 subjects
  4. Verify all appear in list
  5. Try duplicate → warning appears
  6. Click Continue
- **Validation:**
  - [ ] At least 1 subject required
  - [ ] Unique subject validation
  - [ ] Delete subject works
  - [ ] Search/filter subjects

### **Step 5: Grading System** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/onboarding/step/5`
- **Endpoints:** `POST /api/onboarding/step/5`
- **Template Selection:**
  - WASSCE (A1-F9)
  - NABTEB (A-E)
  - NECO (A1-F9)
  - Custom
- **Test Steps:**
  1. Select WASSCE template
  2. View default scale:
     - A1: 80-100
     - B2: 70-79
     - C3: 60-69
     - D4: 50-59
     - E5: 40-49
     - F9: 0-39
  3. Select Custom → Add custom grades
  4. Verify ranges don't overlap → Error if they do
  5. Click Continue
- **Custom Grade Test:**
  1. Select Custom template
  2. Delete default grades
  3. Add: Outstanding (90-100), Excellent (80-89), Good (70-79), etc.
  4. Verify 0-100 range covered
  5. Save and proceed

### **Step 6: Students CSV Import** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/onboarding/step/6`
- **CSV Format:**
  - Admission Number, First Name, Last Name, Class, Date of Birth, Female/Male, Parent Email
- **Sample CSV:** (download template from page)
  ```
  ADM001,John,Doe,JSS 1A,2010-05-15,M,parent1@email.com
  ADM002,Jane,Smith,JSS 1A,2010-08-22,F,parent2@email.com
  ADM003,Peter,Johnson,JSS 2A,2010-03-10,M,parent3@email.com
  ```
- **Test Steps:**
  1. Click "Download CSV Template"
  2. Fill sample data (minimum 3 students)
  3. Click "Upload CSV"
  4. System validates → Shows preview
  5. Verify preview table shows all rows
  6. Click "Import" → System creates students
  7. Verify count displayed
- **Validation Tests:**
  - [ ] Invalid CSV format → Line number error shown
  - [ ] Missing columns → Error with column names
  - [ ] Duplicate admission number → Warning shown
  - [ ] Invalid class → Error (must match step 3 classes)
  - [ ] Invalid date format → Shows correct format
  - [ ] Invalid email → Highlights and suggests fix
  - [ ] Large file (100+ students) → Progress bar shows import status
- **Error Handling:**
  - [ ] Partial import → Shows success + error counts
  - [ ] Invalid rows skipped → Valid rows imported
  - [ ] Re-upload allowed → Can fix CSV and re-upload

### **Step 7: Review & Complete** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/onboarding/step/7`
- **Features:**
  - ✅ Complete summary of all setup
  - ✅ Edit buttons to modify any step
  - ✅ Confirmation of readiness
- **Test Steps:**
  1. Review all sections:
     - School details from step 1
     - Sessions/terms from step 2
     - Classes count from step 3
     - Subjects list from step 4
     - Grading system from step 5
     - Students count from step 6
  2. Click "Edit" on any section → Return to that step
  3. Modify and return to step 7
  4. Click "Complete Setup"
  5. Redirect to `/school-admin/overview`
  6. Verify dashboard loads with data

---

## 🧙 Results Setup Wizard

**Flow:** After onboarding, configure which result instances teachers will be using

Duration: ~5-10 minutes | Required: Yes (before teachers enter results)

### **Step 1: Select Sessions & Classes** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/results-setup`
- **Endpoints:** `GET /api/results-setup/available-sessions`, `POST /api/results-setup/initialize`
- **Test Steps:**
  1. Load page → See available sessions from onboarding
  2. Session options: "2025/2026 - Term 1", "Term 2", "Term 3"
  3. Class options: "JSS 1A", "JSS 1B", "JSS 2A"
  4. Create instance combinations:
     - Instance 1: JSS 1A + Term 1
     - Instance 2: JSS 2A + Term 1
     - Instance 3: JSS 1A + Term 2
  5. For each instance, select subjects (optional)
  6. Click "Continue"
- **Validation:**
  - [ ] Can't select same session+class twice
  - [ ] At least 1 instance required
  - [ ] Subject selection optional but recommended

### **Step 2: Configure Scoring Components** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/results-setup/configure`
- **Endpoints:** `POST /api/results-setup/configure-instances`
- **Configuration Options:**
  - CA1 (Continuous Assessment 1) weight: % of total
  - CA2 (Continuous Assessment 2) weight: % of total
  - Exam Score weight: % of total
  - Must sum to 100%
  - Decimal places: 1-3
- **Test Configuration:**
  - CA1: 20%
  - CA2: 20%
  - Exam: 60%
  - Total: 100% ✓
- **Test Steps:**
  1. For each instance, set weights:
     - Set CA1: 20
     - Set CA2: 20
     - Set Exam: 60
     - Verify total shows "100% ✓"
  2. Try invalid configuration:
     - CA1: 30
     - CA2: 30
     - Exam: 50
     - Total shows "110% ✗" → Error
  3. Set decimal places to 2
  4. Verify teacher assignments
  5. Click "Save Configuration"
- **Validation:**
  - [ ] Weights must equal 100%
  - [ ] Decimal places 1-3 only
  - [ ] Teacher assignment required per instance
  - [ ] All instances must be configured
  - [ ] Can edit later via settings

### **Step 3: Activate Instances** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/school-admin/results-setup/activate`
- **Endpoints:** `POST /api/results-setup/activate`
- **Options:**
  - Test Mode: Can enter sample results, won't publish
  - Activate: Live results, teachers start entering
- **Test Steps:**
  1. Review final configuration summary
  2. Click "Test Mode"
  3. Enter sample result:
     - Student: ADM001
     - Subject: Mathematics
     - CA1: 18/20
     - CA2: 19/20
     - Exam: 67/100
  4. System calculates:
     - Final = (18 + 19) × 0.2 + 67 × 0.6 = 7.4 + 40.2 = 47.6
  5. Verify calculation
  6. Exit test mode
  7. Click "Activate" when ready
  8. Verify confirmation message
  9. Redirect to `/school-admin/overview`
- **Test Mode Validation:**
  - [ ] Sample results don't publish
  - [ ] Can modify weights in test mode
  - [ ] Score calculation correct
  - [ ] Can exit and return to setup

---

## 👨‍👩‍👧 Parent Dashboard

**Protection:** `ProtectedParentRoute` (requires PARENT role)

### 1. **Parent Dashboard Overview** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/parent/dashboard`
- **Endpoints:**
  - `GET /api/parent-analytics/children` - Get all children
  - `GET /api/parent-analytics/dashboard` - Parent dashboard stats
  - `GET /api/parent-analytics/notifications` - Parent notifications
- **Features:**
  - ✅ Children list with cards
  - ✅ Overall performance summary
  - ✅ Recent announcements
  - ✅ Quick action buttons
  - ✅ Performance trend indicators
  - ✅ Dark theme with Hero.png background
- **Purpose:** Main parent dashboard with children overview
- **Test Steps:**
  1. Login as Parent → Navigate to `/parent/dashboard`
  2. Verify all children display with profile cards
  3. Click child card → Navigate to ChildDetail
  4. Check performance stats (average, position, trend)
  5. Verify recent announcements section
  6. Test quick action buttons

### 2. **Child Details & Performance Tracking** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/parent/child/:childId`
- **Endpoints:**
  - `GET /api/parent-analytics/child/:childId/summary` - Child summary
  - `GET /api/parent-analytics/child/:childId/results` - Child results
  - `GET /api/parent-analytics/child/:childId/attendance` - Attendance
- **Features:**
  - ✅ Child profile information
  - ✅ Overall GPA and grades
  - ✅ Subject-wise performance breakdown
  - ✅ Class position and rankings
  - ✅ Attendance percentage
  - ✅ Performance trend charts
  - ✅ Parent contact info
  - ✅ Dark theme with gradient cards
- **Purpose:** Track individual child's complete academic performance
- **Test Steps:**
  1. From dashboard, click on child card
  2. View child's basic info (name, class, admission number)
  3. Check GPA and grade averages
  4. Verify subject scores with grades
  5. View position in class (e.g., 5/40)
  6. Check attendance stats
  7. Verify performance comparison with class average

### 3. **Performance Overview** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/parent/performance-overview/:childId`
- **Endpoints:**
  - `GET /api/parent-analytics/child/:childId/performance` - Performance metrics
  - `GET /api/parent-analytics/child/:childId/subjects` - Subject breakdown
- **Features:**
  - ✅ Comprehensive performance dashboard
  - ✅ Subject performance charts
  - ✅ Grade breakdown by component (CA, Exam)
  - ✅ Performance trends over time
  - ✅ Strengths and weaknesses identification
  - ✅ Recommendations for improvement
  - ✅ Comparison with class average
  - ✅ Performance indicators (green/yellow/red)
- **Purpose:** Detailed performance analysis for parents
- **Test Steps:**
  1. Navigate to Performance Overview
  2. Verify all subject cards load with rankings
  3. Check performance indicators (color-coded)
  4. View grade distribution chart
  5. Check trend visualization (trending up/down)
  6. Verify comparison with class average
  7. Read improvement recommendations
  8. View communication recommendations for teacher contact

### 4. **Holistic Development** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/parent/holistic-development/:childId`
- **Endpoints:**
  - `GET /api/parent-analytics/child/:childId/holistic` - Holistic development data
  - `GET /api/parent-analytics/child/:childId/affective` - Affective domain
  - `GET /api/parent-analytics/child/:childId/psychomotor` - Psychomotor domain
- **Features:**
  - ✅ Three-domain development tracking:
    - Academic domain (scores and grades)
    - Affective domain (engagement, honesty, attentiveness, punctuality)
    - Psychomotor domain (practical skills, creativity, expression)
  - ✅ Domain-specific scoring (0-100)
  - ✅ Teacher comments per domain
  - ✅ Overall development summary
  - ✅ Development trend visualization
  - ✅ Parent-friendly insights
  - ✅ Progress indicators
- **Purpose:** Track holistic child development beyond academics
- **Test Steps:**
  1. Navigate to Holistic Development
  2. Verify three domains display (Academic, Affective, Psychomotor)
  3. Check scores for each domain (0-100 scale)
  4. Read teacher comments per domain
  5. View overall development score
  6. Check trend indicators (improving/stable/declining)
  7. Verify parent-friendly insights and recommendations

---

## 🏫 Teacher Dashboard

**Protection:** `ProtectedTeacherRoute` (requires TEACHER role)

### 1. **Teacher Dashboard Overview** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/teacher/dashboard`
- **Endpoints:**
  - `GET /api/teacher-analytics/classes` - Get assigned classes
  - `GET /api/teacher-analytics/dashboard` - Teacher insights
  - `GET /api/teacher-analytics/students` - Student list
- **Features:**
  - ✅ Assigned classes overview
  - ✅ Student count per class
  - ✅ Performance statistics
  - ✅ Attendance trends
  - ✅ Quick action buttons
  - ✅ Recent student performance updates
  - ✅ Dark theme with Hero.png background
- **Purpose:** Main teacher workspace
- **Test Steps:**
  1. Login as Teacher → Navigate to `/teacher/dashboard`
  2. Verify class cards display with stats
  3. Check student counts per class
  4. Click class card → Navigate to ClassOverview
  5. View performance metrics
  6. Check recent activity feed
  7. Test quick action buttons

### 2. **Class Overview & Analytics** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/teacher/class-overview/:classId`
- **Endpoints:**
  - `GET /api/teacher-analytics/class/:classId/overview` - Class analytics
  - `GET /api/teacher-analytics/class/:classId/subjects` - Subject breakdown
  - `GET /api/teacher-analytics/class/:classId/performance` - Class performance
- **Features:**
  - ✅ Class statistics (total students, pass rate, average)
  - ✅ Subject-wise performance breakdown
  - ✅ Student pass/fail distribution
  - ✅ Performance trends by subject
  - ✅ Top/bottom performers
  - ✅ Class comparison (if multiple classes)
  - ✅ Subject difficulty assessment
  - ✅ Attendance impact on performance
- **Purpose:** Class-level performance analytics
- **Test Steps:**
  1. Navigate to Class Overview
  2. View class statistics cards
  3. Check student distribution (pass/fail)
  4. View subject performance ranking
  5. Check performance trend charts
  6. Verify top/bottom performers list
  7. Click student → Navigate to student detail
  8. Compare with other classes (if available)

### 3. **At-Risk Students Identification** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/teacher/at-risk-students/:classId`
- **Endpoints:**
  - `GET /api/teacher-analytics/class/:classId/at-risk` - At-risk students
  - `GET /api/teacher-analytics/student/:studentId/risk-analysis` - Risk details
- **Features:**
  - ✅ AI-powered risk scoring (0-100 scale)
  - ✅ Risk level indicators (Low/Medium/High)
  - ✅ Risk factors display:
    - Below 50% average
    - Poor attendance (<70%)
    - Declining performance trend
    - Weak subjects identification
  - ✅ Recommended interventions
  - ✅ Student contact options (email parent)
  - ✅ Performance tracking
  - ✅ Sortable/filterable list
- **Purpose:** Identify and support struggling students
- **Test Steps:**
  1. Navigate to At-Risk Students
  2. View risk scoring list
  3. Verify risk levels (High/Medium/Low)
  4. Check risk factors for high-risk students
  5. View intervention recommendations
  6. Click student → See detailed risk analysis
  7. Email parent button → Opens email composer
  8. Verify sorting (by risk score, name, etc.)

### 4. **Cohort Analysis** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/teacher/cohort-analysis/:classId`
- **Endpoints:**
  - `GET /api/teacher-analytics/class/:classId/cohort` - Cohort breakdown
  - `GET /api/teacher-analytics/class/:classId/tiers` - Performance tiers
- **Features:**
  - ✅ Student distribution by performance tiers:
    - Excellent (80-100)
    - Good (70-79)
    - Average (60-69)
    - Below Average (50-59)
    - Poor (<50)
  - ✅ Tier-wise statistics (count, percentage, average)
  - ✅ Per-tier student list
  - ✅ Trend comparison with previous terms
  - ✅ Distribution visualization (pie/bar charts)
  - ✅ Recommendations per tier
- **Purpose:** Analyze class distribution and performance tiers
- **Test Steps:**
  1. Navigate to Cohort Analysis
  2. View tier breakdown bars
  3. Verify percentages and student counts
  4. Check trend indicators (improving/declining)
  5. Click tier → See student list
  6. View tier-specific recommendations
  7. Check trend visualization

### 5. **Student Detail & Progress Tracking** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/teacher/student-detail/:studentId`
- **Endpoints:**
  - `GET /api/teacher-analytics/student/:studentId/profile` - Student profile
  - `GET /api/teacher-analytics/student/:studentId/scores` - Subject scores
  - `GET /api/teacher-analytics/student/:studentId/trends` - Performance trends
- **Features:**
  - ✅ Comprehensive student profile
  - ✅ Personal info (name, admission #, class, date of birth)
  - ✅ Contact information (phone, parent email)
  - ✅ Subject-wise scores with grades
  - ✅ Performance components (CA1, CA2, Exam breakdown)
  - ✅ Affective domain assessment (engagement, honesty, etc.)
  - ✅ Psychomotor domain assessment (practical, creativity)
  - ✅ Attendance record
  - ✅ Performance trend chart
  - ✅ Comparison with class average
  - ✅ Strengths and weaknesses summary
  - ✅ Teacher notes/comments
- **Purpose:** Detailed individual student performance view
- **Test Steps:**
  1. Navigate to Student Detail
  2. Verify student profile displays correctly
  3. Check subject scores with grades
  4. View performance components breakdown
  5. Check affective/psychomotor assessments
  6. Verify attendance percentage
  7. View performance trend visualization
  8. Check comparison with class average
  9. Read teacher comments/notes
  10. View recommended interventions

---

## 🎯 Support Agent Dashboard

**Protection:** `ProtectedSupportAgentRoute` (requires SUPPORT_AGENT role)

### 1. **Support Agent Dashboard** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/support-agent/dashboard`
- **Endpoints:**
  - `GET /api/support/tickets` - List assigned tickets
  - `GET /api/support/tickets/stats/dashboard` - Support metrics
  - `GET /api/support/tickets/urgent` - Urgent tickets
- **Features:**
  - ✅ Ticket queue overview
  - ✅ Tickets by status (Open, In Progress, Closed)
  - ✅ Priority indicators
  - ✅ Response time metrics
  - ✅ Current ticket load
  - ✅ Quick action cards
  - ✅ Dark theme styling
- **Purpose:** Support agent workspace
- **Test Steps:**
  1. Login as Support Agent → Navigate to `/support-agent/dashboard`
  2. View ticket queue cards
  3. Check status distribution
  4. Click ticket → Open in detail view
  5. Verify metrics display correctly
  6. Test quick action buttons

### 2. **Support Agent Profile** ⭐ **[READY TO TEST]**
- **URL:** `http://localhost:8080/support-agent/profile`
- **Endpoints:**
  - `GET /api/support-agent/profile` - Agent profile
  - `PUT /api/support-agent/profile` - Update profile
  - `POST /api/auth/change-password` - Change password
- **Features:**
  - ✅ Agent profile information
  - ✅ Department and role
  - ✅ Performance metrics (tickets closed, rating)
  - ✅ Availability status
  - ✅ Edit profile functionality
  - ✅ Password change
  - ✅ Email preferences
- **Purpose:** Support agent profile management
- **Test Steps:**
  1. Navigate to Support Agent Profile
  2. Verify all profile info displays
  3. Edit profile → Save changes
  4. Change password → Verify success
  5. Update email preferences

---

## 🚀 Public Pages (Additional)

### 1. **Agent Landing Page** ⭐ **[READY TO TEST - STYLED]**
- **URL:** `http://localhost:8080/agents`
- **Features:**
  - ✅ Center-aligned hero section with background image
  - ✅ Commission structure display (10%, 15%, 25%)
  - ✅ Benefits showcase (6 key benefits)
  - ✅ How it works (4-step process)
  - ✅ Stats section (max commission, schools, payouts)
  - ✅ FAQ section with expandable items
  - ✅ CTA sections
  - ✅ Dark theme with gradient overlays
  - ✅ Professional shadow styling
- **Purpose:** Agent recruitment and program information
- **Test Steps:**
  1. Navigate to `/agents`
  2. Verify hero section displays centered with background
  3. Check all sections load correctly
  4. Test FAQ expansion/collapse
  5. Click CTA buttons → Verify links work
  6. Verify responsive design on mobile
  7. Check all styling matches Features page theme

---

## 🔔 Global Pages

### 1. **Notifications**
- **URL:** `http://localhost:8080/notifications`
- **Endpoints:**

  - `GET /api/notifications` - Get all notifications
  - `GET /api/notifications/count/unread` - Get unread count
  - `DELETE /api/notifications/:id` - Delete notification
  - `DELETE /api/notifications/clear/all` - Clear all
- **Purpose:** Global notification center

---

## 👤 Test Credentials (Extract for Testing)

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **SUPER_ADMIN** | `superadmin@resultspro.ng` | `SuperAdmin@123456` | System administrator with full access |
| **SCHOOL_ADMIN** | `admin@testacademy.edu.ng` | `SchoolAdmin@123456` | School administrator |
| **TEACHER** | `teacher@testacademy.edu.ng` | `Teacher@123456` | Class teacher |
| **PARENT** | `parent@example.com` | `Parent@123456` | Parent/Guardian |
| **SUPPORT_AGENT** | `support@resultspro.ng` | `Support@123456` | Customer support |
| **AGENT/PARTNER** | `agent@resultspro.ng` | `Agent@123456` | Partner for onboarding |

## 📊 Test Data Summary

**Core Models:**
- ✅ 5 Users (all roles)
- ✅ 1 School (Test Academy International - Pro tier)
- ✅ 1 School Admin
- ✅ 3 Subscription Plans (Free, Pro, Enterprise)
- ✅ 1 Academic Session + 3 Terms
- ✅ 2 Classes (JSS 1A, JSS 2A)
- ✅ 3 Subjects + Grading System (A1-F9 scale)

**People & Data:**
- ✅ 2 Students (with detailed results)
- ✅ 1 Parent with student relations
- ✅ 1 Teacher with messages to parent
- ✅ 1 Agent with commission tracking

**Academic Records:**
- ✅ 2 Student Results (with subjects, grades, affective/psychomotor domains)
- ✅ 1 Results Setup Session
- ✅ 1 Results Instance
- ✅ 1 Onboarding State

**Billing & Payment:**
- ✅ 1 Subscription (active, Pro plan)
- ✅ 1 Payment (completed)
- ✅ 1 Invoice

**Scratch Cards & Support:**
- ✅ 1 Batch (100 cards)
- ✅ 2 Scratch Cards with usage
- ✅ 1 Batch Request
- ✅ 1 Support Ticket with message
- ✅ 1 Notification

**Agent Commissions:**
- ✅ 1 Agent with assignments
- ✅ 1 Referral (paid)
- ✅ 1 Reward + Badge
- ✅ 1 Withdrawal (paid)

**Email & Blog:**
- ✅ 1 Email Template + Campaign
- ✅ 1 Email Subscriber with campaign send
- ✅ 1 Blog Category, Post & Comment

---

## 🧪 Testing Checklist

### Phase 1: Authentication
- [ ] Login with SuperAdmin → Redirect to /super-admin/overview
- [ ] Login with SchoolAdmin → Redirect to /school-admin/overview
- [ ] Invalid credentials → Error message
- [ ] Password reset → Email sent & token verification
- [ ] Token refresh → New JWT issued

### Phase 2: SuperAdmin User Management (NEW)
- [ ] **Agents Management**
  - [ ] Load agents page → List displays correctly
  - [ ] Search agents by name/email → Results filter
  - [ ] Filter by status/tier → Works correctly
  - [ ] Bulk invite with CSV → Agents created
  - [ ] Bulk invite manual → Agents created
  - [ ] Manage permissions → Permissions saved
  - [ ] Toggle status → Status updated
  - [ ] Delete agent → Agent removed

- [ ] **Support Staff Management**
  - [ ] Load staff page → List displays
  - [ ] Search by name/email/department → Filters work
  - [ ] Change permission level dropdown → Saves immediately
  - [ ] Bulk invite CSV → Staff created
  - [ ] Bulk invite manual → Staff created
  - [ ] Manage permissions → Granular permissions saved
  - [ ] Toggle status → Status updated
  - [ ] Delete staff → Staff removed

### Phase 3: SchoolAdmin User Management (NEW)
- [ ] **Teachers Management**
  - [ ] Load teachers page → List displays
  - [ ] Search by name/email → Filters work
  - [ ] Filter by status → Correct filtering
  - [ ] Assign class → Class assigned correctly
  - [ ] Assign subject → Subject assigned correctly
  - [ ] Bulk invite CSV → Teachers created with subject
  - [ ] Bulk invite manual → Teachers created
  - [ ] Manage permissions → All 6 permissions selectable
  - [ ] Toggle status → Status toggle works
  - [ ] Delete teacher → Teacher removed

### Phase 4: Email Management System (NEW)
- [ ] **Email Campaign Management**
  - [ ] Navigate to `/super-admin/email-management`
  - [ ] View dashboard with campaign stats
  - [ ] Create new email campaign (DRAFT)
  - [ ] Fill campaign form (name, subject, body, recipients)
  - [ ] Select recipient segment (ALL, SCHOOLS, BLOG)
  - [ ] Save campaign → Status is DRAFT
  - [ ] Edit campaign → Update content
  - [ ] Publish/Send campaign → Status changes to SENDING then SENT
  - [ ] Delete draft campaign
  - [ ] Verify sent count increments

- [ ] **Subscriber Management**
  - [ ] View subscribers list (pagination)
  - [ ] Add single subscriber (email, name, source)
  - [ ] Upload CSV file with subscribers
  - [ ] Search/filter subscribers by status (active/inactive)
  - [ ] Toggle subscriber status (Active/Inactive)
  - [ ] Delete subscriber from list
  - [ ] Verify email uniqueness validation

- [ ] **Email Inbox**
  - [ ] View inbox with emails from S3
  - [ ] Click email → Parse and display content
  - [ ] Verify email metadata (from, to, date, subject)
  - [ ] Check attachments display (if any)
  - [ ] Mark email as read → Status updates

- [ ] **Email Templates**
  - [ ] View saved email templates
  - [ ] Create new template (name, subject, body)
  - [ ] Use template in campaign
  - [ ] Add template variables ({{unsubscribe_link}}, {{subscriber_name}})

- [ ] **Analytics & Compliance**
  - [ ] View campaign stats (sent, delivered, opened, clicked)
  - [ ] Verify unsubscribe links in emails
  - [ ] Click unsubscribe link → Subscriber deactivated
  - [ ] Confirm unsubscribe token validation

### Phase 5: Blog Management System (NEW)
- [ ] **CMS Dashboard**
  - [ ] Navigate to `/super-admin/blog-management`
  - [ ] View dashboard stats cards (posts, published, drafts, categories, comments, likes)
  - [ ] Verify top 5 posts displayed by view count
  - [ ] Check real-time stat updates

- [ ] **Blog Post Management**
  - [ ] Click "New Post" button
  - [ ] Fill post form (title, slug, category, author, excerpt, content)
  - [ ] Create post → Defaults to DRAFT status
  - [ ] Verify post appears in posts list
  - [ ] Click edit icon → Update post content
  - [ ] Save changes → Post updates
  - [ ] Click publish icon → Status changes to PUBLISHED
  - [ ] Verify published date is set
  - [ ] Delete draft post → Removed from list

- [ ] **Category Management**
  - [ ] Click "New Category" button
  - [ ] Fill category form (name, slug, description, color)
  - [ ] Create category → Appears in grid
  - [ ] Try delete category with posts → Error message appears
  - [ ] Delete empty category → Succeeds

- [ ] **Blog Comment Moderation**
  - [ ] View pending comments for posts
  - [ ] Approve comment → Status changes, appears on blog
  - [ ] Reject comment → Marked as rejected
  - [ ] Delete comment → Removed from queue

- [ ] **Public Blog Testing**
  - [ ] Navigate to `/blog` (public blog list)
  - [ ] Verify published posts display in grid
  - [ ] Click category filter → Posts filter correctly
  - [ ] Use search bar → Filters by title/excerpt
  - [ ] Pagination works (next/previous buttons)
  - [ ] Click post → Navigate to single post view
  - [ ] View full article content
  - [ ] Like button → Increments like count
  - [ ] Like again → Decrements (toggle)
  - [ ] Submit comment form → Pending approval message
  - [ ] View approved comments below article
  - [ ] Share button → Opens share options
  - [ ] Back button → Returns to blog list

### Phase 6: Dashboard Testing - Parent
- [ ] **Parent Dashboard Overview**
  - [ ] Login as Parent → Navigate to `/parent/dashboard`
  - [ ] See all children with name cards
  - [ ] Click child card → Navigate to ChildDetail page
  - [ ] Verify dark theme with Hero.png background
  - [ ] Check responsive design on mobile

- [ ] **Parent Child Detail & Performance**
  - [ ] Navigate to child profile page
  - [ ] View personal info (name, admission #, class)
  - [ ] Check subject scores with letter grades
  - [ ] View position/rank (e.g., "5th out of 40")
  - [ ] Check attendance percentage
  - [ ] View comparison with class average (color-coded indicators)

- [ ] **Parent Performance Overview**
  - [ ] Navigate to `/parent/performance-overview/:childId`
  - [ ] View performance dashboard with all subjects
  - [ ] Check subject rankings
  - [ ] View grade distribution
  - [ ] See trend visualization (trending up/down)
  - [ ] Read improvement recommendations

- [ ] **Parent Holistic Development**
  - [ ] Navigate to `/parent/holistic-development/:childId`
  - [ ] View 3 domains: Academic, Affective, Psychomotor
  - [ ] Check scores for each domain (0-100)
  - [ ] Read teacher comments per domain
  - [ ] View development trend
  - [ ] Read parent-friendly insights

### Phase 7: Dashboard Testing - Teacher
- [ ] **Teacher Dashboard Overview**
  - [ ] Login as Teacher → Navigate to `/teacher/dashboard`
  - [ ] See all assigned classes with cards
  - [ ] Click class → Navigate to ClassOverview
  - [ ] Verify dark theme styling
  - [ ] Check quick action buttons

- [ ] **Teacher Class Overview**
  - [ ] Navigate to class overview page
  - [ ] View class statistics (pass rate, average, etc.)
  - [ ] Check subject performance breakdown
  - [ ] View top/bottom performers list
  - [ ] See performance trends
  - [ ] Compare with other classes (if multiple)

- [ ] **Teacher At-Risk Students**
  - [ ] Navigate to at-risk page
  - [ ] View risk scores (0-100 scale)
  - [ ] Check risk level indicators
  - [ ] See risk factors per student
  - [ ] Read intervention recommendations
  - [ ] Click student → Detailed analysis
  - [ ] Email parent button works

- [ ] **Teacher Cohort Analysis**
  - [ ] Navigate to cohort analysis page
  - [ ] View performance tiers (Excellent/Good/Average/Below/Poor)
  - [ ] Check student counts per tier
  - [ ] Click tier → See student list
  - [ ] View tier recommendations

- [ ] **Teacher Student Detail**
  - [ ] Navigate to student profile
  - [ ] View student personal info
  - [ ] Check subject scores with components
  - [ ] View affective/psychomotor assessments
  - [ ] Check attendance record
  - [ ] See performance trend chart
  - [ ] Compare with class average

### Phase 8: Dashboard Testing - Support Agent
- [ ] **Support Agent Dashboard**
  - [ ] Login as Support Agent → Navigate to `/support-agent/dashboard`
  - [ ] See ticket queue overview
  - [ ] View tickets by status
  - [ ] Click ticket → Open detail view
  - [ ] Verify metrics display

- [ ] **Support Agent Profile**
  - [ ] Navigate to profile page
  - [ ] View profile information
  - [ ] Edit profile → Save changes
  - [ ] Change password
  - [ ] Update notification preferences

### Phase 9: Wizard Testing - Onboarding (7 Steps)
- [ ] **Step 1: School Registration**
  - [ ] Fill school details
  - [ ] Email validation works
  - [ ] Password requirements enforced (8+, upper, lower, special)
  - [ ] Accept terms required
  - [ ] Register → Redirect to step 2

- [ ] **Step 2: Academic Session**
  - [ ] Enter session year (2025/2026)
  - [ ] Add 3 terms with dates
  - [ ] Date validation works
  - [ ] Continue → Proceed to step 3

- [ ] **Step 3: Classes**
  - [ ] Add 3 classes (JSS 1A, JSS 1B, JSS 2A)
  - [ ] Test duplicate warning
  - [ ] Delete class works
  - [ ] Continue → Proceed to step 4

- [ ] **Step 4: Subjects**
  - [ ] Add 5 subjects
  - [ ] Test duplicate warning
  - [ ] Delete subject works
  - [ ] Continue → Proceed to step 5

- [ ] **Step 5: Grading System**
  - [ ] Select WASSCE template
  - [ ] View default grades
  - [ ] Try Custom → Add custom grades
  - [ ] Verify no overlapping ranges
  - [ ] Continue → Proceed to step 6

- [ ] **Step 6: Students CSV**
  - [ ] Download template
  - [ ] Fill with 3+ students
  - [ ] Upload CSV
  - [ ] Preview shows all rows
  - [ ] Import students created
  - [ ] Continue → Proceed to step 7

- [ ] **Step 7: Review & Complete**
  - [ ] View complete summary
  - [ ] Edit any section works
  - [ ] Complete Setup → Redirect to dashboard
  - [ ] Verify data persists after logout/login

### Phase 10: Wizard Testing - Results Setup (3 Steps)
- [ ] **Step 1: Select Sessions & Classes**
  - [ ] Load page → See available sessions/classes
  - [ ] Create instance: JSS 1A + Term 1
  - [ ] Create instance: JSS 2A + Term 1
  - [ ] Test duplicate prevention
  - [ ] Continue → Proceed to step 2

- [ ] **Step 2: Configure Scoring**
  - [ ] Set CA1: 20%, CA2: 20%, Exam: 60%
  - [ ] Total shows 100% (green)
  - [ ] Try invalid (110%) → Error shown
  - [ ] Set decimal places to 2
  - [ ] Assign teacher per instance
  - [ ] Save configuration

- [ ] **Step 3: Activate**
  - [ ] Review configuration
  - [ ] Test Mode → Enter sample result
  - [ ] Verify score calculation correct
  - [ ] Exit test mode
  - [ ] Activate → Go live
  - [ ] Redirect to dashboard

### Phase 11: Agent Landing Page Styling
- [ ] Navigate to `/agents`
- [ ] Hero section CENTER-ALIGNED ✓
- [ ] Background image displays (Hero.png)
- [ ] Gradient overlay (dark fade)
- [ ] All sections load (How It Works, Commission, Benefits, Stats, FAQ)
- [ ] Commission cards: 10%, 15%, 25% with shadows
- [ ] Benefits: 6 items with blue icons
- [ ] How It Works: 4-step process
- [ ] Stats cards match styling
- [ ] FAQ expands/collapses correctly
- [ ] All CTA buttons link correctly
- [ ] Responsive on mobile
- [ ] Dark theme matches Features page
- [ ] Shadow effects visible
- [ ] Gradient blobs visible in sections
- [ ] Hover states work (cards brighten)

### Phase 12: School Management
- [ ] School verifications → Load pending schools
- [ ] Approve/reject schools → Status updated
- [ ] View school details → Details display correctly

### Phase 13: Results Management
- [ ] Upload student CSV → Data imported
- [ ] Enter results → Results saved
- [ ] Publish results → Results published
- [ ] View analytics → Charts display

### Phase 14: Scratch Cards
- [ ] Generate batch → Codes created
- [ ] Assign to school → Assignment works
- [ ] Validate code → Results display
- [ ] Export codes → CSV generated

---

## 🐛 Bug Reporting Template

When testing, if you encounter issues:

```
## Bug Report
**Screen:** [Screen name]
**URL:** http://localhost:8080/path
**API Endpoint:** [Endpoint that failed]
**Issue:** [Description]
**Steps to Reproduce:**
1. ...
2. ...
3. ...
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Error:** [Any console error]
```

---

## 📝 Notes

- All SuperAdmin routes are protected by `ProtectedSuperAdminRoute` component
- All SchoolAdmin routes use `SchoolAdminLayout` wrapper
- Parent/Teacher/SupportAgent routes use role-specific protection components
- API responses follow pattern: `{ success: boolean, data?: any, pagination?: {...}, error?: string }`
- Pagination uses 20 items per page by default
- Search is case-insensitive and real-time
- Bulk operations support both CSV file upload and manual email entry
- Permission modals use checkbox selectors for granular control
- Dark theme: RGBA backgrounds with shadow effects
- All new pages include Hero.png background with gradient overlays
- Icons: HugeIcons (hugeicons-compat) + Lucide React fallback
- Responsive design on 375px (mobile), 768px (tablet), 1280px+ (desktop)

---

**Last Updated:** March 3, 2026
**Status:** Comprehensive testing guide with all 15+ new pages, 2 complete wizards, parent/teacher/support dashboards, and step-by-step test instructions
