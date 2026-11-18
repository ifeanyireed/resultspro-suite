import SharedLoginPage from '@/components/public/SharedLoginPage';

export default function LoginPage() {
  const usersApi = process.env.NEXT_PUBLIC_USERS_API || '';
  
  return (
    <div className="w-full min-h-screen" data-no-rise="true">
      <SharedLoginPage 
        appName="Edu Suite"
        appDescription="The Engine Powering Modern Education."
        redirectPath="/overview"
        loginEndpoint={`${usersApi}/api/v1/auth/admin-login`}
      />
    </div>
  );
}
