import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AgentLanding from "./pages/AgentLanding";
import Demo from "./pages/Demo";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResultChecker from "./pages/ResultChecker";
import ResultsLookup from "./pages/ResultsLookup";
import ScratchCardValidation from "./pages/ScratchCardValidation";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterAgent from "./pages/auth/RegisterAgent";
import VerifyEmail from "./pages/auth/VerifyEmail";
import SchoolVerification from "./pages/auth/SchoolVerification";
import PendingVerification from "./pages/auth/PendingVerification";
import PasswordReset from "./pages/auth/PasswordReset";
import PasswordResetConfirm from "./pages/auth/PasswordResetConfirm";
import { OnboardingWizard } from "./pages/onboarding";
import { PaymentComplete } from "./pages/PaymentComplete";
import ProtectedSuperAdminRoute from "./components/ProtectedSuperAdminRoute";
import ProtectedSupportAgentRoute from "./components/ProtectedSupportAgentRoute";
import SuperAdminOverview from "./pages/super-admin/Overview";
import SchoolVerifications from "./pages/super-admin/SchoolVerifications";
import SchoolsManagement from "./pages/super-admin/SchoolsManagement";
import FinancialDashboard from "./pages/super-admin/FinancialDashboard";
import ScratchCardManagement from "./pages/super-admin/ScratchCardMgmt";
import SubscriptionsManagement from "./pages/super-admin/Subscriptions";
import Analytics from "./pages/super-admin/Analytics";
import MultiSchoolDashboard from "./pages/MultiSchoolDashboard";
import SupportTickets from "./pages/super-admin/Support";
import SystemSettings from "./pages/super-admin/Settings";
import Support from "./pages/Support";
import SuperAdminSupportDashboard from "./pages/super-admin/SupportDashboard";
import SupportAgentDashboard from "./pages/SupportAgentDashboard";
import SupportAgentProfile from "./pages/SupportAgentProfile";
import NotificationsPage from "./pages/Notifications";
import SuperAdminProfile from "./pages/super-admin/Profile";
import SuperAdminNotifications from "./pages/super-admin/Notifications";
import AgentsManagement from "./pages/super-admin/AgentsManagement";
import SupportStaffManagement from "./pages/super-admin/SupportStaffManagement";
import EmailManagement from "./pages/super-admin/EmailManagement";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import BlogManagementCMS from "./pages/super-admin/BlogManagementCMS";
import VideoManagement from "./pages/super-admin/VideoManagement";
import SchoolAdminLayout from "./components/SchoolAdminLayout";
import TeacherDashboardLayout from "./components/TeacherDashboardLayout";
import ParentDashboardLayout from "./components/ParentDashboardLayout";
import SchoolRejected from "./pages/school-admin/SchoolRejected";
import MyTickets from "./pages/school-admin/MyTickets";

import { Dashboard as AgentDashboard, Profile as AgentProfile, SchoolsManaged, Referrals, Rewards, Withdrawals, SubscriptionPlans } from "./pages/agent";
import SubscriptionVerify from "./pages/agent/SubscriptionVerify";
import { 
  ParentDashboard, 
  ChildDetailPage, 
  ParentPerformanceOverview,
  ParentHolisticDevelopment,
  ParentProfile,
  ParentMessages
} from "./pages/parent";
import {
  TeacherDashboard,
  TeacherClassOverview,
  TeacherAtRiskStudents,
  TeacherCohortAnalysis,
  TeacherStudentDetail,
  TeacherProfile,
  TeacherMessages
} from "./pages/teacher";
import {
  Overview as SchoolOverview,
  SessionTermManagement,
  ClassManagement,
  SubjectManagement,
  GradingSystemSetup,
  StudentsList,
  StudentProfile,
  ResultsEntry,
  ResultsPublishing,
  AnalyticsDashboard,
  LeaderboardManagement,
  ParentAccountsManagement,
  SchoolSettings,
  BillingSubscription,
  Profile as SchoolAdminProfile,
  Notifications as SchoolAdminNotifications,
  ResultsSetupWizard,
  TeachersManagement,
  ScratchCardDashboard,
  ScratchCardRequests,
  ScratchCardBatches,
} from "./pages/school-admin";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/agents" element={<AgentLanding />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/results" element={<ResultsLookup />} />
          <Route path="/scratch-card" element={<ScratchCardValidation />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/register-agent" element={<RegisterAgent />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/school-verification" element={<SchoolVerification />} />
          <Route path="/auth/pending-verification" element={<PendingVerification />} />
          <Route path="/auth/password-reset" element={<PasswordReset />} />
          <Route path="/auth/password-reset-confirm" element={<PasswordResetConfirm />} />
          <Route path="/onboarding" element={<SchoolAdminLayout><OnboardingWizard /></SchoolAdminLayout>} />
          <Route path="/payment-complete" element={<SchoolAdminLayout><PaymentComplete /></SchoolAdminLayout>} />
          {/* Super Admin Routes - Protected */}
          <Route path="/super-admin/verifications" element={<ProtectedSuperAdminRoute><SchoolVerifications /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/overview" element={<ProtectedSuperAdminRoute><SuperAdminOverview /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/schools" element={<ProtectedSuperAdminRoute><SchoolsManagement /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/financials" element={<ProtectedSuperAdminRoute><FinancialDashboard /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/scratch-cards" element={<ProtectedSuperAdminRoute><ScratchCardManagement /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/subscriptions" element={<ProtectedSuperAdminRoute><SubscriptionsManagement /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/analytics" element={<ProtectedSuperAdminRoute><Analytics /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/support" element={<ProtectedSuperAdminRoute><SuperAdminSupportDashboard /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/settings" element={<ProtectedSuperAdminRoute><SystemSettings /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/profile" element={<ProtectedSuperAdminRoute><SuperAdminProfile /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/notifications" element={<ProtectedSuperAdminRoute><SuperAdminNotifications /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/agents" element={<ProtectedSuperAdminRoute><AgentsManagement /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/support-staff" element={<ProtectedSuperAdminRoute><SupportStaffManagement /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/email-management" element={<ProtectedSuperAdminRoute><EmailManagement /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/blog-management" element={<ProtectedSuperAdminRoute><BlogManagementCMS /></ProtectedSuperAdminRoute>} />
          <Route path="/super-admin/videos" element={<ProtectedSuperAdminRoute><VideoManagement /></ProtectedSuperAdminRoute>} />
          
          {/* Support Agent Routes */}
          <Route path="/support-agent/dashboard" element={<ProtectedSupportAgentRoute><SupportAgentDashboard /></ProtectedSupportAgentRoute>} />
          <Route path="/support-agent/profile" element={<ProtectedSupportAgentRoute><SupportAgentProfile /></ProtectedSupportAgentRoute>} />
          
          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/profile" element={<AgentProfile />} />
          <Route path="/agent/schools" element={<SchoolsManaged />} />
          <Route path="/agent/referrals" element={<Referrals />} />
          <Route path="/agent/rewards" element={<Rewards />} />
          <Route path="/agent/withdrawals" element={<Withdrawals />} />
          <Route path="/agent/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/agent/subscription/verify" element={<SubscriptionVerify />} />
          
          {/* Parent Routes */}
          <Route path="/parent/dashboard" element={<ParentDashboardLayout><ParentDashboard /></ParentDashboardLayout>} />
          <Route path="/parent/profile" element={<ParentDashboardLayout><ParentProfile /></ParentDashboardLayout>} />
          <Route path="/parent/messages" element={<ParentDashboardLayout><ParentMessages /></ParentDashboardLayout>} />
          <Route path="/parent/child/:childId" element={<ChildDetailPage />} />
          <Route path="/parent/performance-overview/:childId" element={<ParentDashboardLayout><ParentPerformanceOverview /></ParentDashboardLayout>} />
          <Route path="/parent/holistic-development/:childId" element={<ParentDashboardLayout><ParentHolisticDevelopment /></ParentDashboardLayout>} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboardLayout><TeacherDashboard /></TeacherDashboardLayout>} />
          <Route path="/teacher/profile" element={<TeacherDashboardLayout><TeacherProfile /></TeacherDashboardLayout>} />
          <Route path="/teacher/messages" element={<TeacherDashboardLayout><TeacherMessages /></TeacherDashboardLayout>} />
          <Route path="/teacher/class/:classId/overview" element={<TeacherDashboardLayout><TeacherClassOverview /></TeacherDashboardLayout>} />
          <Route path="/teacher/class/:classId/at-risk" element={<TeacherDashboardLayout><TeacherAtRiskStudents /></TeacherDashboardLayout>} />
          <Route path="/teacher/class/:classId/cohort" element={<TeacherDashboardLayout><TeacherCohortAnalysis /></TeacherDashboardLayout>} />
          <Route path="/teacher/student/:studentId" element={<TeacherDashboardLayout><TeacherStudentDetail /></TeacherDashboardLayout>} />
          
          {/* Notifications Page */}
          <Route path="/notifications" element={<ProtectedSuperAdminRoute><NotificationsPage /></ProtectedSuperAdminRoute>} />
          
          {/* Enterprise Multi-School Management - For Enterprise Subscribers */}
          <Route path="/enterprise/multi-school" element={<ProtectedSuperAdminRoute><MultiSchoolDashboard /></ProtectedSuperAdminRoute>} />
          
          {/* School Admin Routes */}
          <Route path="/school-admin/overview" element={<SchoolAdminLayout><SchoolOverview /></SchoolAdminLayout>} />
          <Route path="/school-admin/sessions" element={<SchoolAdminLayout><SessionTermManagement /></SchoolAdminLayout>} />
          <Route path="/school-admin/classes" element={<SchoolAdminLayout><ClassManagement /></SchoolAdminLayout>} />
          <Route path="/school-admin/subjects" element={<SchoolAdminLayout><SubjectManagement /></SchoolAdminLayout>} />
          <Route path="/school-admin/grading" element={<SchoolAdminLayout><GradingSystemSetup /></SchoolAdminLayout>} />
          <Route path="/school-admin/students" element={<SchoolAdminLayout><StudentsList /></SchoolAdminLayout>} />
          <Route path="/school-admin/student-profile" element={<SchoolAdminLayout><StudentProfile /></SchoolAdminLayout>} />
          <Route path="/school-admin/results-entry" element={<SchoolAdminLayout><ResultsEntry /></SchoolAdminLayout>} />
          <Route path="/school-admin/publishing" element={<SchoolAdminLayout><ResultsPublishing /></SchoolAdminLayout>} />
          <Route path="/school-admin/analytics" element={<SchoolAdminLayout><AnalyticsDashboard /></SchoolAdminLayout>} />
          <Route path="/school-admin/leaderboard" element={<SchoolAdminLayout><LeaderboardManagement /></SchoolAdminLayout>} />
          <Route path="/school-admin/parents" element={<SchoolAdminLayout><ParentAccountsManagement /></SchoolAdminLayout>} />
          <Route path="/school-admin/teachers" element={<SchoolAdminLayout><TeachersManagement /></SchoolAdminLayout>} />
          <Route path="/school-admin/scratch-cards" element={<SchoolAdminLayout><ScratchCardDashboard /></SchoolAdminLayout>} />
          <Route path="/school-admin/scratch-cards/requests" element={<SchoolAdminLayout><ScratchCardRequests /></SchoolAdminLayout>} />
          <Route path="/school-admin/scratch-cards/batches" element={<SchoolAdminLayout><ScratchCardBatches /></SchoolAdminLayout>} />
          <Route path="/school-admin/settings" element={<SchoolAdminLayout><SchoolSettings /></SchoolAdminLayout>} />
          <Route path="/school-admin/billing" element={<SchoolAdminLayout><BillingSubscription /></SchoolAdminLayout>} />
          <Route path="/school-admin/profile" element={<SchoolAdminLayout><SchoolAdminProfile /></SchoolAdminLayout>} />
          <Route path="/school-admin/notifications" element={<SchoolAdminLayout><SchoolAdminNotifications /></SchoolAdminLayout>} />
          <Route path="/school-admin/onboarding" element={<SchoolAdminLayout><OnboardingWizard /></SchoolAdminLayout>} />
          <Route path="/school-admin/results-setup" element={<SchoolAdminLayout><ResultsSetupWizard /></SchoolAdminLayout>} />
          <Route path="/school-admin/tickets" element={<SchoolAdminLayout><MyTickets /></SchoolAdminLayout>} />
          <Route path="/school-admin/school-rejected" element={<SchoolRejected />} />
          
          {/* Public Blog Routes */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          
          <Route path="/:schoolSlug/result-checker" element={<ResultChecker />} />
          <Route path="/check-results/:schoolSlug" element={<ResultChecker />} />
          <Route path="/original" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
