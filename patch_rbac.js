const fs = require('fs');
const path = 'service_users/main.go';
let content = fs.readFileSync(path, 'utf8');

const rbacTenantAdmin = 'middleware.RequireRole("super-admin", "platform-admin", "tenant-admin")(';
const rbacPlatformAdmin = 'middleware.RequireRole("super-admin", "platform-admin")(';

content = content.replace(
  'mux.HandleFunc("/api/v1/admin/stats", handlers.HandleGetSuiteStats)',
  `mux.HandleFunc("/api/v1/admin/stats", ${rbacPlatformAdmin}handlers.HandleGetSuiteStats))`
);
content = content.replace(
  'mux.HandleFunc("/api/v1/admin/payouts", handlers.HandleGetAdminPayouts)',
  `mux.HandleFunc("/api/v1/admin/payouts", ${rbacPlatformAdmin}handlers.HandleGetAdminPayouts))`
);
content = content.replace(
  'mux.HandleFunc("/api/v1/admin/plans", handlers.HandleListPlans)',
  `mux.HandleFunc("/api/v1/admin/plans", ${rbacPlatformAdmin}handlers.HandleListPlans))`
);
content = content.replace(
  'mux.HandleFunc("/api/v1/admin/invoices", handlers.HandleListInvoices)',
  `mux.HandleFunc("/api/v1/admin/invoices", ${rbacPlatformAdmin}handlers.HandleListInvoices))`
);
content = content.replace(
  'mux.HandleFunc("/api/v1/admin/agents", func(w http.ResponseWriter, r *http.Request) {\n\t\tif r.Method == http.MethodPost {\n\t\t\thandlers.HandleCreateAgent(w, r)\n\t\t} else {\n\t\t\thandlers.HandleListAgents(w, r)\n\t\t}\n\t})',
  `mux.HandleFunc("/api/v1/admin/agents", ${rbacPlatformAdmin}func(w http.ResponseWriter, r *http.Request) {\n\t\tif r.Method == http.MethodPost {\n\t\t\thandlers.HandleCreateAgent(w, r)\n\t\t} else {\n\t\t\thandlers.HandleListAgents(w, r)\n\t\t}\n\t}))`
);
content = content.replace(
  'mux.HandleFunc("/api/v1/admin/agents/referrals", handlers.HandleListReferrals)',
  `mux.HandleFunc("/api/v1/admin/agents/referrals", ${rbacPlatformAdmin}handlers.HandleListReferrals))`
);
content = content.replace(
  'mux.HandleFunc("/api/v1/admin/agents/assignments", handlers.HandleListAssignments)',
  `mux.HandleFunc("/api/v1/admin/agents/assignments", ${rbacPlatformAdmin}handlers.HandleListAssignments))`
);

content = content.replace(
  'mux.HandleFunc("/api/v1/tenants", func(w http.ResponseWriter, r *http.Request) {\n\t\tif r.Method == http.MethodPost {\n\t\t\thandlers.HandleCreateTenant(w, r)\n\t\t} else {\n\t\t\thandlers.HandleListTenants(w, r)\n\t\t}\n\t})',
  `mux.HandleFunc("/api/v1/tenants", ${rbacPlatformAdmin}func(w http.ResponseWriter, r *http.Request) {\n\t\tif r.Method == http.MethodPost {\n\t\t\thandlers.HandleCreateTenant(w, r)\n\t\t} else {\n\t\t\thandlers.HandleListTenants(w, r)\n\t\t}\n\t}))`
);

// We need to use exact matching for the last route
const targetTenantRoute = 'handlers.HandleGetTenant(w, r)\n\t})';
content = content.replace(
  'mux.HandleFunc("/api/v1/tenants/", func(w http.ResponseWriter, r *http.Request) {',
  `mux.HandleFunc("/api/v1/tenants/", ${rbacTenantAdmin}func(w http.ResponseWriter, r *http.Request) {`
);
content = content.replace(
  targetTenantRoute,
  'handlers.HandleGetTenant(w, r)\n\t}))'
);


fs.writeFileSync(path, content);
