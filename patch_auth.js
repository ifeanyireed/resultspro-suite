const fs = require('fs');

const storePath = 'classroompro/src/store/useAuthStore.ts';
let store = fs.readFileSync(storePath, 'utf8');

// Inject mock user
store = store.replace(
  "let user = null;",
  `let user: any = {
    id: "mock-bypass-123",
    email: "mock@student.com",
    full_name: "Bypass User",
    role: "student",
    account_status: "active",
    created_at: new Date().toISOString(),
    mfa_enabled: false,
    auth_provider: "local"
  };`
);

store = store.replace(
  "isAuthenticated: !!accessToken && !!user,",
  "isAuthenticated: true, // BYPASS RBAC"
);

fs.writeFileSync(storePath, store);

const layoutPath = 'classroompro/src/app/dashboard/layout.tsx';
let layout = fs.readFileSync(layoutPath, 'utf8');

layout = layout.replace(
  "router.push(\"/login\");",
  "// router.push(\"/login\"); // BYPASS RBAC"
);

// bypass route guards
layout = layout.replace(
  /if \(pathname\.startsWith[^{]+{\s+router\.push\("\/dashboard"\);\s+return;\s+}/g,
  "// bypassed route guard"
);

fs.writeFileSync(layoutPath, layout);
