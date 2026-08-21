const fs = require('fs');

const stores = [
  'classroompro/src/store/useAuthStore.ts',
  'tutorspro/src/store/useAuthStore.ts',
  'examspro/src/store/useAuthStore.ts'
];

stores.forEach(storePath => {
  if (fs.existsSync(storePath)) {
    let store = fs.readFileSync(storePath, 'utf8');
    store = store.replace(
      /let user = null;/g,
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
      /isAuthenticated: !!accessToken && !!user,/g,
      "isAuthenticated: true, // BYPASS RBAC"
    );
    fs.writeFileSync(storePath, store);
  }
});

const layouts = [
  'classroompro/src/app/dashboard/layout.tsx',
  'tutorspro/src/app/student/layout.tsx',
  'examspro/src/app/dashboard/layout.tsx'
];

layouts.forEach(layoutPath => {
  if (fs.existsSync(layoutPath)) {
    let layout = fs.readFileSync(layoutPath, 'utf8');
    layout = layout.replace(
      /router\.push\("\/login"\);/g,
      "// router.push(\"/login\"); // BYPASS RBAC"
    );
    layout = layout.replace(
      /if \(pathname\.startsWith[^{]+{\s+router\.push\("\/dashboard"\);\s+return;\s+}/g,
      "// bypassed route guard"
    );
    fs.writeFileSync(layoutPath, layout);
  }
});

