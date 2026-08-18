# TutorsPRO API Endpoints

This document lists all the available API endpoints for the TutorsPRO backend.

## Public Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User signup |
| POST | `/api/school/register` | School registration |
| GET | `/api/public/tutors` | Get public tutor list |
| GET | `/api/public/faq` | Get public FAQs |
| GET | `/api/public/home` | Get home page data |
| GET | `/api/public/content/:key` | Get specific site content |
| GET | `/api/blog` | Get all blog posts |
| GET | `/api/blog/:slug` | Get blog post by slug |

## Protected Routes (Requires Auth Token)

### Common
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/auth/me` | Get current user info |

### Tutor
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/tutor/onboarding` | Tutor onboarding |
| GET | `/api/tutor/dashboard` | Tutor dashboard |
| GET | `/api/tutor/bookings` | Get tutor bookings |
| POST | `/api/tutor/bookings/status` | Update booking status |
| POST | `/api/tutor/assignments` | Create assignment |
| GET | `/api/tutor/assignments` | Get tutor assignments |
| GET | `/api/tutor/student-progress` | Get student progress |
| GET | `/api/tutor/earnings` | Get tutor earnings |
| GET | `/api/tutor/payouts` | Get tutor payouts |
| POST | `/api/tutor/payouts` | Request payout |
| GET | `/api/tutor/reviews` | Get tutor reviews |
| POST | `/api/tutor/notes` | Create note |
| GET | `/api/tutor/notes` | Get notes |
| POST | `/api/tutor/quizzes` | Create quiz |
| GET | `/api/tutor/quizzes` | Get quizzes |

### Student
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/student/dashboard` | Student dashboard |
| GET | `/api/student/quizzes` | Get student quizzes |
| GET | `/api/student/flashcards` | Get flashcards |
| GET | `/api/student/assignments` | Get student assignments |
| GET | `/api/student/bookings` | Get student bookings |
| GET | `/api/student/schedule` | Get student schedule |
| GET | `/api/student/classroom/:id` | Get classroom data |
| GET | `/api/student/games` | Get games data |
| GET | `/api/student/progress` | Get progress data |
| GET | `/api/student/certificates` | Get certificates |
| GET | `/api/student/conversations` | Get conversations |
| GET | `/api/student/conversations/:id/messages` | Get messages |
| GET | `/api/student/wallet` | Get wallet data |
| GET | `/api/student/settings/notifications` | Get notification settings |
| POST | `/api/student/settings/profile` | Update profile |

### Parent
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/parent/dashboard` | Parent dashboard |
| GET | `/api/parent/children` | Get linked children |
| POST | `/api/parent/children` | Link a child |
| GET | `/api/parent/history` | Get lesson history |
| GET | `/api/parent/progress/:id` | Get child progress |
| GET | `/api/parent/feedback` | Get feedback data |
| POST | `/api/parent/feedback` | Submit feedback |
| GET | `/api/parent/notifications` | Get notifications |
| POST | `/api/parent/notifications/read` | Mark notifications as read |
| GET | `/api/parent/billing` | Get billing data |

### School Admin
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/school/dashboard` | School dashboard |
| GET | `/api/school/teachers` | Get school teachers |
| POST | `/api/school/teachers` | Invite teacher |
| DELETE | `/api/school/teachers/:id` | Remove teacher |
| GET | `/api/school/classes` | Get school classes |
| POST | `/api/school/classes` | Create class |
| GET | `/api/school/students` | Get school students |
| POST | `/api/school/students/import` | Import students |
| GET | `/api/school/subscription` | Get subscription |
| POST | `/api/school/subscription` | Update subscription |
| GET | `/api/school/branding` | Get branding |
| POST | `/api/school/branding` | Update branding |
| GET | `/api/school/reports` | Get reports |
| POST | `/api/school/reports` | Generate report |
| GET | `/api/school/analytics` | Get analytics |
| GET | `/api/school/notifications` | Get notifications |
| POST | `/api/school/notifications` | Create notification |

### Platform Admin
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/platform-admin/dashboard` | Platform admin dashboard |
| GET | `/api/platform-admin/users` | Get all users |
| POST | `/api/platform-admin/users/:id` | Update user status |
| GET | `/api/platform-admin/tutor-verifications` | Get tutor verifications |
| POST | `/api/platform-admin/tutor-verifications/:id` | Update verification status |
| GET | `/api/platform-admin/payments` | Get payments |
| POST | `/api/platform-admin/payments/:id` | Update payment status |
| GET | `/api/platform-admin/disputes` | Get disputes |
| POST | `/api/platform-admin/disputes/:id` | Update dispute status |
| GET | `/api/platform-admin/moderation` | Get moderation flags |
| POST | `/api/platform-admin/moderation/:id` | Update moderation status |
| GET | `/api/platform-admin/support-tickets` | Get support tickets |
| POST | `/api/platform-admin/support-tickets/:id` | Update ticket status |

### Super Admin
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/super-admin/dashboard` | Super admin dashboard |
| GET | `/api/super-admin/health` | System health |
| GET | `/api/super-admin/feature-flags` | Feature flags |
| POST | `/api/super-admin/feature-flags/:id` | Update feature flag |
| GET | `/api/super-admin/infrastructure` | Infrastructure data |
| GET | `/api/super-admin/integrations` | External integrations |
| GET | `/api/super-admin/audit-logs` | Audit logs |
| GET | `/api/super-admin/permissions` | Roles & permissions |
| GET | `/api/super-admin/analytics` | System analytics |
