# ResultsPRO NG - Platform Architecture & Roadmap

This document outlines the architectural plan for user onboarding, agent management, and global administration across the ResultsPRO platform.

## Phase 1: The Gateway Flow (User Onboarding)
**Goal:** Seamlessly route new users to their correct domain based on their intent, without duplicating auth logic.

### 1. The Entry Point (`resultspro.ng`)
* **Content:** Marketing landing page, pricing, and features.
* **Action:** User clicks "Get Started" or "Login".
* **Flow:** Redirects entirely to `auth.resultspro.ng` to create an identity (Global User ID) or login.

### 2. The "Fork" (`resultspro.ng/onboard`)
* **Trigger:** After auth, the user is redirected back to the main portal. The portal calls `acad_service/intelligence/profile`. If the user has no roles, they hit this screen.
* **Screen Content:** "Welcome! How do you want to use ResultPRO?"
  * **Card 1: "I am a Parent / Student"**
    * **Action:** Redirects to SchoolHub to link their account to a child using a school-provided code.
  * **Card 2: "I want to register my School"**
    * **Action:** Launches the School Setup Wizard.
  * **Card 3: "I am an Agent / Partner"**
    * **Action:** Launches the Agent Application Form.

### 3. School Setup Wizard (`resultspro.ng/onboard/school`)
* **Step 1:** Basic Details (School Name, Motto, Contact Email).
* **Step 2:** Branding (Upload Logo, Pick Primary/Accent Colors).
* **Step 3:** Curriculum (Select Country/Standard).
* **Backend Action:** Calls `acad_service` to create the School (Status: `PENDING_VERIFICATION`), assigns the user the `school-admin` role, and redirects them to their specialized School Dashboard.

---

## Phase 2: Agent Ecosystem (`resultspro.ng/agent`)
**Goal:** Empower sub-admins to onboard, manage, and earn commissions from multiple schools.

**Agent Lifecycle:** 
An Agent gets an `AGENT` tier in the `user_subscriptions` table. When they onboard a school, they are assigned the `agent` role in `user_school_roles` for that specific school.

### Screens & Content:
1. **Agent Overview (The Dashboard)**
   * **Metrics:** Active Schools, Total Students across portfolio, Pending Commission (₦), Paid Commission (₦).
   * **Quick Actions:** "Generate Referral Link", "Provision New School manually".
2. **School Portfolio (`/agent/schools`)**
   * **Content:** A data table of all schools onboarded by the agent.
   * **Columns:** School Name, Verification Status, Subscription Tier, Active Students, Agent Access.
   * **Action:** "Login as Admin" (Allows the agent to securely SSO into the school's dashboard using their agent role to help the school configure settings).
3. **Wallet & Payouts (`/agent/wallet`)**
   * **Content:** Ledger of earnings. Every time a parent pays for a Scratch Card or Tuition via SchoolHub for a school in their portfolio, a percentage is recorded here.
   * **Action:** "Request Payout" (Updates status to pending approval by Global Admin).
4. **Agent Profile (`/agent/settings`)**
   * **Content:** Bank account details for payouts, custom agent branding (if they operate as an agency).

---

## Phase 3: Global Admin Ecosystem (`resultspro.ng/admin`)
**Goal:** The absolute top-level command center for your internal team to monitor health, approve schools, and pay agents.

### Screens & Content:
1. **Global Command Center (The Dashboard)**
   * **Metrics:** Total ARR, Total Active Schools, Global Student Count, API Health (Auth, Acad, Results).
   * **Charts:** Onboarding velocity (Schools joined per month), Revenue split by sub-app (Results vs Tutors).
2. **School CRM (`/admin/schools`)**
   * **Content:** Master list of all schools in the DB.
   * **Action:** Verification. When a school signs up, they are `PENDING_VERIFICATION`. An admin reviews their details and clicks "Verify", which unlocks their ability to generate official gradebooks or accept payments.
   * **Action:** "Suspend School" (Cuts off all API access for that tenant).
3. **Agent Management (`/admin/agents`)**
   * **Content:** List of all applied and active agents.
   * **Action:** Approve new agent applications.
   * **Action:** Configure commission percentages (e.g., Agent A gets 10%, Agent B gets 15%).
4. **Payout Desk (`/admin/payouts`)**
   * **Content:** Pending withdrawal requests from Agents.
   * **Action:** "Mark as Paid" (Triggers receipt to the agent).
5. **Curriculum & Core Data (`/admin/curriculum`)**
   * **Content:** Management of the universal standard subjects and topics. Since `acad_service` owns syllabus data, admins use this screen to update the National Curriculum (e.g., adding "Robotics" to the standard JSS1 syllabus) so all sub-apps instantly inherit it.
