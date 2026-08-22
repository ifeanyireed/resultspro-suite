const fs = require('fs');

const path = 'classroompro/src/app/dashboard/layout.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('const handleLogout')) {
  code = code.replace(
    'const { user, isAuthenticated } = useAuthStore();',
    `const { user, isAuthenticated } = useAuthStore();
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  const handleLogout = () => {
    logoutStore();
    router.push("/login");
  };`
  );
  
  code = code.replace(
    '<Link href="#" className="flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">',
    '<button onClick={handleLogout} className="flex w-full items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">'
  ).replace(
    'Logout\n              </Link>',
    'Logout\n              </button>'
  );

  fs.writeFileSync(path, code);
}
